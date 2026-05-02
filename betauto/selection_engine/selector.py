from __future__ import annotations

import json
import logging
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from betauto.api_clients.openai_client import (
    create_response_with_retry,
    create_structured_response_with_retry,
    parse_response_output_json,
)
from betauto.api_clients.errors import ExternalApiPermanentError, ExternalApiRateLimitError

from .models import SelectionConfig, SelectionResult

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parents[2]
PROMPT_PATH = BASE_DIR / "prompts" / "ticket_selection_prompt.txt"


def _load_prompt() -> str:
    if not PROMPT_PATH.exists():
        raise FileNotFoundError(f"Prompt introuvable: {PROMPT_PATH}")
    return PROMPT_PATH.read_text(encoding="utf-8")


def _env_flag(name: str, default: bool) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


class SelectionJsonParseError(ValueError):
    """Erreur levée quand aucune stratégie de parsing JSON n'a abouti."""

    def __init__(self, message: str, *, meta: dict[str, Any] | None = None):
        super().__init__(message)
        self.meta = meta or {}


def _strip_markdown_fences(text: str) -> str:
    cleaned = (text or "").strip()
    cleaned = re.sub(r"^\s*```(?:json)?\s*", "", cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s*```\s*$", "", cleaned)
    return cleaned.strip()


def _extract_balanced_json_object(text: str) -> str:
    start = text.find("{")
    if start == -1:
        raise SelectionJsonParseError("Aucun objet JSON détecté dans la réponse LLM.")

    depth = 0
    in_string = False
    escaped = False

    for index in range(start, len(text)):
        char = text[index]

        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == '"':
                in_string = False
            continue

        if char == '"':
            in_string = True
        elif char == "{":
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0:
                return text[start : index + 1]

    raise SelectionJsonParseError("Objet JSON incomplet: accolade fermante manquante.")


def extract_json_from_llm_response(text: str) -> str:
    payload = _strip_markdown_fences(text).replace("\ufeff", "").replace("\x00", "").strip()
    if not payload:
        raise SelectionJsonParseError("Réponse LLM vide.")

    return _extract_balanced_json_object(payload)


def repair_json_string(json_str: str) -> str:
    repaired = (json_str or "").strip()
    if not repaired:
        return repaired

    replacements = {
        "“": '"',
        "”": '"',
        "‘": "'",
        "’": "'",
    }
    for source, target in replacements.items():
        repaired = repaired.replace(source, target)

    repaired = re.sub(r"\bNone\b", "null", repaired)
    repaired = re.sub(r"\bTrue\b", "true", repaired)
    repaired = re.sub(r"\bFalse\b", "false", repaired)
    repaired = re.sub(r",\s*([}\]])", r"\1", repaired)
    repaired = re.sub(r'([}\]"0-9a-zA-Z])(\s*)"([A-Za-z0-9_]+)"\s*:', r'\1,\2"\3":', repaired)
    repaired = re.sub(r"(?<!\\)'([^'\\]*(?:\\.[^'\\]*)*)'", r'"\1"', repaired)
    repaired = re.sub(r'([{,]\s*)([A-Za-z_][A-Za-z0-9_]*)(\s*:)', r'\1"\2"\3', repaired)
    return repaired


def _safe_parse_json_with_meta(text: str) -> tuple[dict[str, Any], dict[str, Any]]:
    attempts = 0
    repair_used = False
    cleaned_json = ""
    repair_applied = ""
    last_error: Exception | None = None

    attempts += 1
    try:
        parsed = json.loads(text)
        return parsed, {
            "parsing_attempts": attempts,
            "repair_used": repair_used,
            "cleaned_json": cleaned_json,
            "repair_applied": repair_applied,
        }
    except Exception as exc:  # noqa: BLE001
        last_error = exc

    attempts += 1
    cleaned_json = extract_json_from_llm_response(text)
    try:
        parsed = json.loads(cleaned_json)
        return parsed, {
            "parsing_attempts": attempts,
            "repair_used": repair_used,
            "cleaned_json": cleaned_json,
            "repair_applied": repair_applied,
        }
    except Exception as exc:  # noqa: BLE001
        last_error = exc

    attempts += 1
    repair_applied = repair_json_string(cleaned_json)
    repair_used = repair_applied != cleaned_json
    try:
        parsed = json.loads(repair_applied)
        return parsed, {
            "parsing_attempts": attempts,
            "repair_used": repair_used,
            "cleaned_json": cleaned_json,
            "repair_applied": repair_applied,
        }
    except Exception as exc:  # noqa: BLE001
        last_error = exc

    raise SelectionJsonParseError(
        f"Parsing JSON impossible après {attempts} tentatives: {last_error}",
        meta={
            "parsing_attempts": attempts,
            "repair_used": repair_used,
            "cleaned_json": cleaned_json,
            "repair_applied": repair_applied,
        },
    ) from last_error


def safe_parse_json(text: str) -> dict[str, Any]:
    parsed, _ = _safe_parse_json_with_meta(text)
    return parsed


def _risk_from_confidence(confidence_score: int) -> str:
    if confidence_score >= 80:
        return "low"
    if confidence_score >= 60:
        return "medium"
    return "high"


def _to_int(value: Any, default: int = 0) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def _normalize_pick(raw_pick: dict[str, Any], index: int, normalization_notes: list[str]) -> dict[str, Any]:
    pick = dict(raw_pick)

    if not pick.get("pick_id"):
        pick["pick_id"] = f"pick_{index:03d}"
        normalization_notes.append(f"pick #{index}: pick_id généré automatiquement")

    if "confidence_score" not in pick and "confidence" in pick:
        pick["confidence_score"] = pick.get("confidence")
        normalization_notes.append(f"pick #{index}: confidence copié vers confidence_score")

    confidence_score = max(0, min(100, _to_int(pick.get("confidence_score"), 0)))
    pick["confidence_score"] = confidence_score

    if not pick.get("risk_level"):
        pick["risk_level"] = _risk_from_confidence(confidence_score)
        normalization_notes.append(f"pick #{index}: risk_level déduit depuis confidence_score")

    if not pick.get("reason"):
        pick["reason"] = "Sélection proposée par le moteur de sélection."
        normalization_notes.append(f"pick #{index}: reason par défaut injecté")

    pick.setdefault("fixture_id", None)
    pick.setdefault("event", "Unknown event")
    pick.setdefault("competition", None)
    pick.setdefault("kickoff", None)
    pick.setdefault("market_canonical_id", "unknown_market")
    pick.setdefault("selection_canonical_id", "unknown_selection")
    pick.setdefault("market", None)
    pick.setdefault("pick", None)
    pick.setdefault("expected_odds_min", None)
    pick.setdefault("expected_odds_max", None)
    pick.setdefault("evidence_summary", {})
    pick.setdefault("source_match_analysis_id", None)
    return pick


def _ticket_shape_errors(pick_count: int, config: SelectionConfig) -> list[str]:
    errors: list[str] = []
    if pick_count:
        if pick_count < config.min_picks:
            errors.append(f"ticket has {pick_count} pick(s), below min_picks={config.min_picks}")
        if pick_count > config.max_picks:
            errors.append(f"ticket has {pick_count} pick(s), above max_picks={config.max_picks}")
        if pick_count == 1 and not config.allow_single:
            errors.append("single ticket returned while allow_single=false")
        if pick_count > 1 and not config.allow_combo:
            errors.append("combo ticket returned while allow_combo=false")
    return errors


def _normalize_picks(raw_picks: Any, normalization_notes: list[str]) -> list[dict[str, Any]]:
    if not isinstance(raw_picks, list):
        return []
    normalized_picks: list[dict[str, Any]] = []
    for idx, raw_pick in enumerate(raw_picks, start=1):
        if isinstance(raw_pick, dict):
            normalized_picks.append(_normalize_pick(raw_pick, idx, normalization_notes))
    return normalized_picks


def _estimated_odds_from_picks(picks: list[dict[str, Any]]) -> float | None:
    if not picks:
        return None
    estimated = 1.0
    for pick in picks:
        odd = _safe_float(pick.get("expected_odds_min") or pick.get("expected_odds_max"))
        if odd is None:
            return None
        estimated *= odd
    return round(estimated, 2)


def _in_target_range(estimated_combo_odds: float | None, config: SelectionConfig) -> bool:
    return estimated_combo_odds is not None and config.combo_min_odds <= estimated_combo_odds <= config.combo_max_odds


def _confidence_from_picks(picks: list[dict[str, Any]]) -> int | None:
    if not picks:
        return None
    return int(round(sum(_to_int(pick.get("confidence_score"), 0) for pick in picks) / len(picks)))


def _risk_from_picks(picks: list[dict[str, Any]]) -> str | None:
    if not picks:
        return None
    risks = {str(pick.get("risk_level") or "").lower() for pick in picks}
    if "high" in risks:
        return "high"
    if "medium" in risks:
        return "medium"
    return "low"


def _strategy_fit_score(
    *,
    picks: list[dict[str, Any]],
    estimated_combo_odds: float | None,
    combo_in_target_range: bool,
    combo_risk_level: str | None,
) -> int:
    confidence = _confidence_from_picks(picks) or 0
    risk_penalty = {"low": 0, "medium": 6, "high": 16}.get(str(combo_risk_level or "").lower(), 10)
    odds_bonus = 8 if combo_in_target_range else -8 if estimated_combo_odds is not None else -12
    pick_count_penalty = max(0, len(picks) - 2) * 2
    return max(0, min(100, confidence + odds_bonus - risk_penalty - pick_count_penalty))


def _normalize_variant(
    raw_variant: dict[str, Any],
    index: int,
    config: SelectionConfig,
    normalization_notes: list[str],
) -> dict[str, Any] | None:
    variant = dict(raw_variant)
    variant_id = str(variant.get("variant_id") or f"variant_{index:03d}")
    label = str(variant.get("label") or f"Variant {index}")
    picks = _normalize_picks(variant.get("picks"), normalization_notes)
    shape_errors = _ticket_shape_errors(len(picks), config)
    if shape_errors:
        normalization_notes.append(f"{variant_id}: variante rejetée ({'; '.join(shape_errors)})")
        return None
    if not picks:
        normalization_notes.append(f"{variant_id}: variante vide ignorée")
        return None

    raw_estimated_combo_odds = _safe_float(variant.get("estimated_combo_odds"))
    computed_estimated_combo_odds = _estimated_odds_from_picks(picks)
    estimated_combo_odds = computed_estimated_combo_odds if computed_estimated_combo_odds is not None else raw_estimated_combo_odds
    if (
        raw_estimated_combo_odds is not None
        and computed_estimated_combo_odds is not None
        and abs(raw_estimated_combo_odds - computed_estimated_combo_odds) > 0.01
    ):
        normalization_notes.append(
            f"{variant_id}: estimated_combo_odds corrigé de {raw_estimated_combo_odds} à {computed_estimated_combo_odds}"
        )

    combo_in_target_range = _in_target_range(estimated_combo_odds, config)
    if "combo_in_target_range" in variant and bool(variant.get("combo_in_target_range")) != combo_in_target_range:
        normalization_notes.append(f"{variant_id}: combo_in_target_range recalculé depuis les cotes des picks")
    global_confidence_score = max(
        0,
        min(100, _to_int(variant.get("global_confidence_score"), _confidence_from_picks(picks) or 0)),
    )
    combo_risk_level = str(variant.get("combo_risk_level") or _risk_from_picks(picks) or "medium").lower()
    if combo_risk_level not in {"low", "medium", "high"}:
        combo_risk_level = _risk_from_picks(picks) or "medium"
    computed_strategy_fit_score = _strategy_fit_score(
        picks=picks,
        estimated_combo_odds=estimated_combo_odds,
        combo_in_target_range=combo_in_target_range,
        combo_risk_level=combo_risk_level,
    )
    raw_strategy_fit_score = variant.get("strategy_fit_score")
    if (
        raw_strategy_fit_score is not None
        and _to_int(raw_strategy_fit_score, computed_strategy_fit_score) != computed_strategy_fit_score
    ):
        normalization_notes.append(f"{variant_id}: strategy_fit_score recalculé par garde-fou BetAuto")
    strategy_fit_score = computed_strategy_fit_score
    tradeoffs = variant.get("tradeoffs") if isinstance(variant.get("tradeoffs"), list) else []

    return {
        "variant_id": variant_id,
        "label": label,
        "picks": picks,
        "estimated_combo_odds": estimated_combo_odds,
        "combo_in_target_range": combo_in_target_range,
        "global_confidence_score": global_confidence_score,
        "combo_risk_level": combo_risk_level,
        "strategy_fit_score": strategy_fit_score,
        "reason": str(variant.get("reason") or "Variante générée depuis les candidats filtrés."),
        "tradeoffs": [str(item) for item in tradeoffs if item is not None],
    }


def _candidate_to_pick(candidate: dict[str, Any], pick_id: str) -> dict[str, Any]:
    expected_odds = _safe_float(candidate.get("expected_odds_min") or candidate.get("odds"))
    confidence_score = max(0, min(100, _to_int(candidate.get("confidence_score"), 0)))
    return _normalize_pick(
        {
            "pick_id": pick_id,
            "fixture_id": candidate.get("fixture_id"),
            "event": candidate.get("event") or "Unknown event",
            "competition": candidate.get("competition"),
            "kickoff": candidate.get("kickoff"),
            "market_canonical_id": candidate.get("market_canonical_id") or "unknown_market",
            "selection_canonical_id": candidate.get("selection_canonical_id") or "unknown_selection",
            "market": candidate.get("market"),
            "pick": candidate.get("pick"),
            "expected_odds_min": expected_odds,
            "expected_odds_max": _safe_float(candidate.get("expected_odds_max") or candidate.get("odds"))
            or expected_odds,
            "confidence_score": confidence_score,
            "risk_level": candidate.get("risk_level") or _risk_from_confidence(confidence_score),
            "reason": candidate.get("reasoning") or candidate.get("reason") or "Candidat retenu par filtrage stratégique.",
            "evidence_summary": {
                "global_confidence": confidence_score,
                "confidence_tier": candidate.get("confidence_tier"),
                "data_quality": candidate.get("data_quality"),
                "odds_source": candidate.get("odds_source"),
                "source_status": candidate.get("source_status"),
                "expected_odds_min": expected_odds,
                "expected_odds_max": _safe_float(candidate.get("expected_odds_max") or candidate.get("odds"))
                or expected_odds,
            },
            "source_match_analysis_id": candidate.get("source_match_analysis_id"),
        },
        index=1,
        normalization_notes=[],
    )


def _variant_signature(variant: dict[str, Any]) -> tuple[str, ...]:
    picks = variant.get("picks") if isinstance(variant.get("picks"), list) else []
    keys = []
    for pick in picks:
        if not isinstance(pick, dict):
            continue
        keys.append(
            "|".join(
                [
                    str(pick.get("fixture_id") or ""),
                    str(pick.get("market_canonical_id") or ""),
                    str(pick.get("selection_canonical_id") or ""),
                ]
            )
        )
    return tuple(sorted(keys))


def _unique_candidates(candidates: list[dict[str, Any]]) -> list[dict[str, Any]]:
    seen: set[tuple[str, str, str]] = set()
    unique: list[dict[str, Any]] = []
    for candidate in candidates:
        key = (
            str(candidate.get("fixture_id") or ""),
            str(candidate.get("market_canonical_id") or ""),
            str(candidate.get("selection_canonical_id") or ""),
        )
        if key in seen:
            continue
        seen.add(key)
        unique.append(candidate)
    return unique


def _pick_count_for_variant(config: SelectionConfig) -> int:
    if config.preferred_ticket_type == "single" and config.allow_single:
        return 1
    return min(config.max_picks, max(config.min_picks, 1))


def _select_candidate_window(candidates: list[dict[str, Any]], pick_count: int, offset: int = 0) -> list[dict[str, Any]]:
    selected: list[dict[str, Any]] = []
    used_fixtures: set[str] = set()
    for candidate in candidates[offset:] + candidates[:offset]:
        fixture_id = str(candidate.get("fixture_id") or "")
        if fixture_id and fixture_id in used_fixtures:
            continue
        selected.append(candidate)
        if fixture_id:
            used_fixtures.add(fixture_id)
        if len(selected) >= pick_count:
            break
    return selected


def _build_variant_from_candidates(
    *,
    variant_id: str,
    label: str,
    candidates: list[dict[str, Any]],
    config: SelectionConfig,
    reason: str,
    tradeoffs: list[str],
) -> dict[str, Any] | None:
    pick_count = _pick_count_for_variant(config)
    if len(candidates) < pick_count:
        return None
    picks = [
        _candidate_to_pick(candidate, f"{variant_id}_pick_{index:03d}")
        for index, candidate in enumerate(candidates[:pick_count], start=1)
    ]
    shape_errors = _ticket_shape_errors(len(picks), config)
    if shape_errors:
        return None
    estimated_combo_odds = _estimated_odds_from_picks(picks)
    combo_risk_level = _risk_from_picks(picks)
    combo_in_target_range = _in_target_range(estimated_combo_odds, config)
    global_confidence_score = _confidence_from_picks(picks)
    return {
        "variant_id": variant_id,
        "label": label,
        "picks": picks,
        "estimated_combo_odds": estimated_combo_odds,
        "combo_in_target_range": combo_in_target_range,
        "global_confidence_score": global_confidence_score,
        "combo_risk_level": combo_risk_level,
        "strategy_fit_score": _strategy_fit_score(
            picks=picks,
            estimated_combo_odds=estimated_combo_odds,
            combo_in_target_range=combo_in_target_range,
            combo_risk_level=combo_risk_level,
        ),
        "reason": reason,
        "tradeoffs": tradeoffs,
    }


def _fallback_variants_from_candidates(
    match_analyses: dict[str, Any] | None,
    config: SelectionConfig,
    existing_variants: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    candidates = (
        match_analyses.get("candidates")
        if isinstance(match_analyses, dict) and isinstance(match_analyses.get("candidates"), list)
        else []
    )
    usable = [
        candidate
        for candidate in candidates
        if isinstance(candidate, dict)
        and _safe_float(candidate.get("expected_odds_min") or candidate.get("odds")) is not None
        and _to_int(candidate.get("confidence_score"), 0) >= config.min_pick_confidence
    ]
    usable = _unique_candidates(usable)
    if len(usable) < _pick_count_for_variant(config):
        return []

    low_risk_rank = {"low": 0, "medium": 1, "high": 2}
    recipes: list[tuple[str, str, list[dict[str, Any]], str, list[str]]] = [
        (
            "variant_safe",
            "Prudente",
            sorted(
                usable,
                key=lambda candidate: (
                    low_risk_rank.get(str(candidate.get("risk_level") or "").lower(), 2),
                    -_to_int(candidate.get("confidence_score"), 0),
                    _safe_float(candidate.get("expected_odds_min") or candidate.get("odds")) or 99,
                ),
            ),
            "Variante générée automatiquement depuis les candidats les plus robustes après filtrage stratégique.",
            ["Priorise la confiance et le risque faible, parfois au détriment du rendement."],
        ),
        (
            "variant_balanced",
            "Équilibrée",
            sorted(
                usable,
                key=lambda candidate: (
                    -_to_int(candidate.get("confidence_score"), 0),
                    abs((_safe_float(candidate.get("expected_odds_min") or candidate.get("odds")) or 0) - 1.65),
                ),
            ),
            "Variante générée automatiquement avec un compromis confiance/cote autour d'une zone de rendement modérée.",
            ["Peut conserver des risques medium si la confiance et la cote restent cohérentes."],
        ),
        (
            "variant_yield",
            "Rendement",
            sorted(
                usable,
                key=lambda candidate: (
                    -(_safe_float(candidate.get("expected_odds_min") or candidate.get("odds")) or 0),
                    -_to_int(candidate.get("confidence_score"), 0),
                ),
            ),
            "Variante générée automatiquement pour tester une construction à rendement plus élevé sous les seuils de stratégie.",
            ["Plus volatile: elle privilégie des cotes plus hautes parmi les candidats encore éligibles."],
        ),
    ]

    variants: list[dict[str, Any]] = []
    signatures = {_variant_signature(variant) for variant in existing_variants}
    for variant_id, label, sorted_candidates, reason, tradeoffs in recipes:
        for offset in range(0, min(5, len(sorted_candidates))):
            selected_candidates = _select_candidate_window(
                sorted_candidates,
                _pick_count_for_variant(config),
                offset=offset,
            )
            variant = _build_variant_from_candidates(
                variant_id=variant_id,
                label=label,
                candidates=selected_candidates,
                config=config,
                reason=reason,
                tradeoffs=tradeoffs,
            )
            if not variant:
                continue
            signature = _variant_signature(variant)
            if signature in signatures:
                continue
            variant["variant_id"] = f"variant_{len(existing_variants) + len(variants) + 1:03d}"
            signatures.add(signature)
            variants.append(variant)
            break
        if len(existing_variants) + len(variants) >= 3:
            break

    return variants


def _variant_from_top_level(
    normalized: dict[str, Any],
    picks: list[dict[str, Any]],
    config: SelectionConfig,
) -> dict[str, Any]:
    estimated_combo_odds = _estimated_odds_from_picks(picks) or _safe_float(
        normalized.get("estimated_combo_odds")
    )
    combo_in_target_range = _in_target_range(estimated_combo_odds, config)
    combo_risk_level = str(normalized.get("combo_risk_level") or _risk_from_picks(picks) or "medium").lower()
    if combo_risk_level not in {"low", "medium", "high"}:
        combo_risk_level = _risk_from_picks(picks) or "medium"
    return {
        "variant_id": str(normalized.get("selected_variant_id") or "variant_001"),
        "label": "Best ticket",
        "picks": picks,
        "estimated_combo_odds": estimated_combo_odds,
        "combo_in_target_range": combo_in_target_range,
        "global_confidence_score": _to_int(
            normalized.get("global_confidence_score"),
            _confidence_from_picks(picks) or 0,
        ),
        "combo_risk_level": combo_risk_level,
        "strategy_fit_score": _strategy_fit_score(
            picks=picks,
            estimated_combo_odds=estimated_combo_odds,
            combo_in_target_range=combo_in_target_range,
            combo_risk_level=combo_risk_level,
        ),
        "reason": str(normalized.get("selection_reason") or "Ticket final sélectionné par le moteur de sélection."),
        "tradeoffs": [],
    }


def _best_variant(variants: list[dict[str, Any]], selected_variant_id: str | None) -> dict[str, Any] | None:
    if selected_variant_id:
        for variant in variants:
            if variant.get("variant_id") == selected_variant_id and variant.get("combo_in_target_range"):
                return variant
    if not variants:
        return None
    risk_rank = {"low": 2, "medium": 1, "high": 0}
    return max(
        variants,
        key=lambda variant: (
            _to_int(variant.get("strategy_fit_score"), 0),
            1 if variant.get("combo_in_target_range") else 0,
            _to_int(variant.get("global_confidence_score"), 0),
            risk_rank.get(str(variant.get("combo_risk_level") or "").lower(), 0),
        ),
    )


def _normalize_selection_payload(
    parsed: dict[str, Any],
    config: SelectionConfig,
    input_file: str,
    match_analyses: dict[str, Any] | None = None,
) -> dict[str, Any]:
    normalized = dict(parsed)
    normalization_notes: list[str] = []

    if not isinstance(normalized.get("picks"), list):
        normalization_notes.append("picks absent ou invalide: [] injecté")
    normalized_picks = _normalize_picks(normalized.get("picks"), normalization_notes)

    raw_variants = normalized.get("variants") if isinstance(normalized.get("variants"), list) else []
    variants: list[dict[str, Any]] = []
    for idx, raw_variant in enumerate(raw_variants, start=1):
        if isinstance(raw_variant, dict):
            variant = _normalize_variant(raw_variant, idx, config, normalization_notes)
            if variant:
                variants.append(variant)
        if len(variants) >= 3:
            break

    if not variants and normalized_picks:
        ticket_shape_errors = _ticket_shape_errors(len(normalized_picks), config)
        if ticket_shape_errors:
            normalized_picks = []
            normalized["status"] = "failed"
            normalized["estimated_combo_odds"] = None
            normalized["combo_in_target_range"] = False
            normalized["global_confidence_score"] = None
            normalized["combo_risk_level"] = None
            normalized["selected_variant_id"] = None
            normalized["selection_reason"] = None
            normalization_notes.append("ticket invalide rejeté par les garde-fous de forme")
        else:
            variants.append(_variant_from_top_level(normalized, normalized_picks, config))

    if len(variants) < 3:
        added_variants = _fallback_variants_from_candidates(match_analyses, config, variants)
        if added_variants:
            variants_to_add = added_variants[: 3 - len(variants)]
            variants.extend(variants_to_add)
            normalization_notes.append(
                f"{len(variants_to_add)} variante(s) alternative(s) ajoutée(s) depuis les candidats filtrés"
            )

    selected_variant = _best_variant(variants, normalized.get("selected_variant_id"))
    if selected_variant:
        normalized["selected_variant_id"] = selected_variant["variant_id"]
        normalized["selection_reason"] = str(
            normalized.get("selection_reason") or selected_variant.get("reason") or "Meilleure variante retenue."
        )
        normalized["picks"] = selected_variant["picks"]
        normalized["estimated_combo_odds"] = selected_variant["estimated_combo_odds"]
        normalized["combo_in_target_range"] = selected_variant["combo_in_target_range"]
        normalized["global_confidence_score"] = selected_variant["global_confidence_score"]
        normalized["combo_risk_level"] = selected_variant["combo_risk_level"]
    else:
        normalized["selected_variant_id"] = None
        normalized["selection_reason"] = None
        normalized["picks"] = []
        normalized["estimated_combo_odds"] = None
        normalized["combo_in_target_range"] = False
        normalized["global_confidence_score"] = None
        normalized["combo_risk_level"] = None

    normalized["variants"] = variants
    if variants and not any(variant.get("combo_in_target_range") for variant in variants):
        normalization_notes.append("Aucune variante ne respecte la plage de cote cible après recalcul des cotes.")

    if not selected_variant and normalized_picks:
        normalized["errors"] = list(normalized.get("errors") or [])
        normalized["errors"].append("Aucune variante valide n'a pu être conservée.")

    if normalized.get("status") not in {"completed", "partial", "failed"}:
        normalized["status"] = "completed" if selected_variant else "failed"
        normalization_notes.append("status injecté automatiquement")
    if not selected_variant:
        normalized["status"] = "failed"

    if normalized.get("input_file") != input_file:
        normalized["input_file"] = input_file
        normalization_notes.append("input_file forcé depuis l'artefact du run courant")

    normalized.setdefault(
        "generated_at",
        datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
    )
    normalized["selection_config"] = config.model_dump()

    normalized.setdefault("rejected_candidates", [])
    normalized.setdefault("notes", [])
    normalized.setdefault("errors", [])

    if normalization_notes:
        normalized["notes"] = list(normalized.get("notes") or [])
        normalized["notes"].append("Normalisation défensive appliquée.")
        normalized["notes"].extend(normalization_notes)
        logger.info("Selection payload normalized: %s", "; ".join(normalization_notes))

    return normalized


def _fallback_result(config: SelectionConfig, input_file: str, error: str) -> dict[str, Any]:
    return SelectionResult(
        generated_at=datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
        status="failed",
        selection_config=config.model_dump(),
        input_file=input_file,
        picks=[],
        variants=[],
        selected_variant_id=None,
        selection_reason=None,
        estimated_combo_odds=None,
        combo_in_target_range=False,
        global_confidence_score=None,
        combo_risk_level=None,
        rejected_candidates=[],
        notes=["Aucune sélection exploitable générée."],
        errors=[error],
    ).model_dump()


def _safe_float(value: Any) -> float | None:
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _candidate_sort_key(candidate: dict[str, Any]) -> tuple[int, float]:
    confidence = _to_int(candidate.get("confidence_score"), 0)
    odds = _safe_float(candidate.get("expected_odds_min") or candidate.get("odds")) or 0.0
    return confidence, odds


def _compact_candidate(candidate: dict[str, Any]) -> dict[str, Any]:
    reasoning = str(candidate.get("reasoning") or candidate.get("reason") or "")
    if len(reasoning) > 280:
        reasoning = reasoning[:277].rstrip() + "..."
    return {
        "candidate_id": candidate.get("candidate_id"),
        "fixture_id": candidate.get("fixture_id"),
        "event": candidate.get("event"),
        "competition": candidate.get("competition"),
        "kickoff": candidate.get("kickoff"),
        "market_canonical_id": candidate.get("market_canonical_id"),
        "selection_canonical_id": candidate.get("selection_canonical_id"),
        "market": candidate.get("market"),
        "pick": candidate.get("pick"),
        "confidence_score": candidate.get("confidence_score"),
        "confidence_tier": candidate.get("confidence_tier"),
        "risk_level": candidate.get("risk_level"),
        "data_quality": candidate.get("data_quality"),
        "expected_odds_min": candidate.get("expected_odds_min") or candidate.get("odds"),
        "expected_odds_max": candidate.get("expected_odds_max") or candidate.get("odds"),
        "odds_source": candidate.get("odds_source"),
        "source_match_analysis_id": candidate.get("source_match_analysis_id"),
        "reasoning": reasoning,
    }


def _compact_selection_payload(match_analyses: dict[str, Any]) -> dict[str, Any]:
    candidates = match_analyses.get("candidates") if isinstance(match_analyses.get("candidates"), list) else []
    rejected = (
        match_analyses.get("rejected_candidates")
        if isinstance(match_analyses.get("rejected_candidates"), list)
        else []
    )
    try:
        max_candidates = int(os.getenv("SELECTION_MAX_CANDIDATES_FOR_LLM", "60"))
    except ValueError:
        max_candidates = 60
    max_candidates = max(1, min(200, max_candidates))
    sorted_candidates = sorted(
        [candidate for candidate in candidates if isinstance(candidate, dict)],
        key=_candidate_sort_key,
        reverse=True,
    )
    selected_candidates = sorted_candidates[:max(1, max_candidates)]
    return {
        "generated_at": match_analyses.get("generated_at"),
        "target_date": match_analyses.get("target_date"),
        "source_file": match_analyses.get("source_file"),
        "status": match_analyses.get("status"),
        "filter_config": match_analyses.get("filter_config") if isinstance(match_analyses.get("filter_config"), dict) else {},
        "candidate_count": len(candidates),
        "candidates_sent_count": len(selected_candidates),
        "rejected_count": len(rejected),
        "candidate_truncation_applied": len(selected_candidates) < len(candidates),
        "candidates": [_compact_candidate(candidate) for candidate in selected_candidates],
        "rejected_summary": {
            "count": len(rejected),
            "top_reasons": _top_rejection_reasons(rejected),
        },
    }


def _top_rejection_reasons(rejected: list[Any]) -> dict[str, int]:
    counts: dict[str, int] = {}
    for item in rejected:
        if not isinstance(item, dict):
            continue
        reasons = item.get("rejection_reasons") or item.get("filter_reasons") or []
        if not isinstance(reasons, list):
            continue
        for reason in reasons:
            key = str(reason)
            counts[key] = counts.get(key, 0) + 1
    return dict(sorted(counts.items(), key=lambda row: row[1], reverse=True)[:8])


def _build_selection_input(match_analyses: dict[str, Any], config: SelectionConfig) -> str:
    analyses_json = json.dumps(_compact_selection_payload(match_analyses), ensure_ascii=False, indent=2)
    config_json = json.dumps(config.model_dump(), ensure_ascii=False, indent=2)
    return f"INPUT_SELECTION_CONFIG_JSON:\n{config_json}\n\nINPUT_FILTERED_CANDIDATES_JSON:\n{analyses_json}"


def _select_ticket_legacy(
    *,
    llm: Any,
    model_name: str,
    timeout: float,
    prompt: str,
) -> tuple[dict[str, Any], dict[str, Any]]:
    max_json_retries = 2
    retry_count = 0
    parsing_attempts = 0
    repair_used = False
    cleaned_json = ""
    repair_applied = ""
    last_raw_response = ""
    current_prompt = prompt
    parsed: dict[str, Any] | None = None

    while retry_count <= max_json_retries:
        response, _ = create_response_with_retry(
            llm,
            model=model_name,
            input=current_prompt,
            operation_name="openai.responses.create selection_engine",
            timeout=timeout,
        )
        raw_response = response.output_text or ""
        last_raw_response = raw_response

        try:
            parsed, parse_meta = _safe_parse_json_with_meta(raw_response)
            parsing_attempts += int(parse_meta.get("parsing_attempts", 0))
            repair_used = repair_used or bool(parse_meta.get("repair_used"))
            cleaned_json = str(parse_meta.get("cleaned_json") or cleaned_json)
            repair_applied = str(parse_meta.get("repair_applied") or repair_applied)
            logger.info(
                "Selection JSON parsed successfully | parsing_attempts=%s repair_used=%s retry_count=%s",
                parsing_attempts,
                repair_used,
                retry_count,
            )
            break
        except SelectionJsonParseError as parse_exc:
            parse_meta = parse_exc.meta
            parsing_attempts += int(parse_meta.get("parsing_attempts", 0))
            repair_used = repair_used or bool(parse_meta.get("repair_used"))
            cleaned_json = str(parse_meta.get("cleaned_json") or cleaned_json)
            repair_applied = str(parse_meta.get("repair_applied") or repair_applied)
            retry_count += 1
            retry_triggered = retry_count <= max_json_retries
            logger.warning(
                "Selection JSON parsing failed | parsing_attempts=%s repair_used=%s retry_count=%s retry_triggered=%s raw_llm_response=%s cleaned_json=%s repair_applied=%s",
                parsing_attempts,
                repair_used,
                retry_count,
                retry_triggered,
                raw_response[:500],
                cleaned_json[:500],
                repair_applied[:500],
            )
            if not retry_triggered:
                raise
            current_prompt = (
                "The previous output was not valid JSON. Fix ONLY the JSON.\n\n"
                f"Previous output:\n{raw_response}"
            )

    if parsed is None:
        raise SelectionJsonParseError("Aucune sortie JSON parseable après les retries.")

    return parsed, {
        "retry_count": retry_count,
        "parsing_attempts": parsing_attempts,
        "repair_used": repair_used,
        "cleaned_json": cleaned_json,
        "repair_applied": repair_applied,
        "last_raw_response": last_raw_response,
    }


def select_combo(match_analyses: dict, config: SelectionConfig, llm, *, input_file: str = "") -> dict:
    try:
        instructions = _load_prompt().strip()
        input_text = _build_selection_input(match_analyses, config)

        model_name = getattr(llm, "analysis_model", None) or os.getenv("SELECTION_ENGINE_MODEL") or os.getenv(
            "OPENAI_ANALYSIS_MODEL"
        )
        if not model_name:
            raise RuntimeError("Modèle OpenAI manquant (SELECTION_ENGINE_MODEL/OPENAI_ANALYSIS_MODEL ou --model).")

        timeout = float(os.getenv("OPENAI_TIMEOUT_SECONDS", "120"))
        use_structured_outputs = _env_flag("OPENAI_USE_STRUCTURED_OUTPUTS", True)
        fallback_to_legacy = _env_flag("OPENAI_STRUCTURED_FALLBACK_TO_LEGACY", True)
        parsed: dict[str, Any]
        meta: dict[str, Any]

        try:
            if use_structured_outputs:
                response, retry_count = create_structured_response_with_retry(
                    llm,
                    model=model_name,
                    instructions=instructions,
                    input=input_text,
                    response_model=SelectionResult,
                    operation_name="openai.responses.create selection_engine",
                    timeout=timeout,
                )
                parsed = parse_response_output_json(response)
                meta = {
                    "retry_count": retry_count,
                    "parsing_attempts": 1,
                    "repair_used": False,
                    "cleaned_json": "",
                    "repair_applied": "",
                    "last_raw_response": response.output_text or "",
                }
            else:
                parsed, meta = _select_ticket_legacy(
                    llm=llm,
                    model_name=model_name,
                    timeout=timeout,
                    prompt=f"{instructions}\n\n{input_text}",
                )
        except Exception as exc:
            if isinstance(exc, (ExternalApiPermanentError, ExternalApiRateLimitError)):
                raise
            if not (use_structured_outputs and fallback_to_legacy):
                raise
            logger.warning("Selection structured output failed, falling back to legacy JSON prompt", exc_info=True)
            parsed, meta = _select_ticket_legacy(
                llm=llm,
                model_name=model_name,
                timeout=timeout,
                prompt=f"{instructions}\n\n{input_text}",
            )

        normalized = _normalize_selection_payload(
            parsed,
            config=config,
            input_file=input_file,
            match_analyses=match_analyses,
        )
        validated = SelectionResult.model_validate(normalized)
        logger.info(
            "Selection completed | parsing_attempts=%s repair_used=%s retry_count=%s raw_llm_response=%s cleaned_json=%s repair_applied=%s",
            meta.get("parsing_attempts"),
            meta.get("repair_used"),
            meta.get("retry_count"),
            str(meta.get("last_raw_response") or "")[:500],
            str(meta.get("cleaned_json") or "")[:500],
            str(meta.get("repair_applied") or "")[:500],
        )
        return validated.model_dump()
    except Exception as exc:  # noqa: BLE001
        logger.exception("Selection engine failed")
        return _fallback_result(config, input_file=input_file, error=str(exc))

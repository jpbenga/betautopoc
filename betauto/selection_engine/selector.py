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


def _normalize_selection_payload(
    parsed: dict[str, Any],
    config: SelectionConfig,
    input_file: str,
) -> dict[str, Any]:
    normalized = dict(parsed)
    normalization_notes: list[str] = []

    picks = normalized.get("picks")
    if not isinstance(picks, list):
        picks = []
        normalization_notes.append("picks absent ou invalide: [] injecté")

    normalized_picks: list[dict[str, Any]] = []
    for idx, raw_pick in enumerate(picks, start=1):
        if isinstance(raw_pick, dict):
            normalized_picks.append(_normalize_pick(raw_pick, idx, normalization_notes))

    normalized["picks"] = normalized_picks
    pick_count = len(normalized_picks)
    ticket_shape_errors: list[str] = []
    if pick_count:
        if pick_count < config.min_picks:
            ticket_shape_errors.append(f"ticket has {pick_count} pick(s), below min_picks={config.min_picks}")
        if pick_count > config.max_picks:
            ticket_shape_errors.append(f"ticket has {pick_count} pick(s), above max_picks={config.max_picks}")
        if pick_count == 1 and not config.allow_single:
            ticket_shape_errors.append("single ticket returned while allow_single=false")
        if pick_count > 1 and not config.allow_combo:
            ticket_shape_errors.append("combo ticket returned while allow_combo=false")
    if ticket_shape_errors:
        normalized["picks"] = []
        normalized_picks = []
        normalized["status"] = "failed"
        normalized["estimated_combo_odds"] = None
        normalized["combo_in_target_range"] = False
        normalized["global_confidence_score"] = None
        normalized["combo_risk_level"] = None
        normalized["errors"] = list(normalized.get("errors") or [])
        normalized["errors"].extend(ticket_shape_errors)
        normalization_notes.append("ticket invalide rejeté par les garde-fous de forme")

    if not normalized.get("status"):
        normalized["status"] = "completed" if normalized_picks else "failed"
        normalization_notes.append("status injecté automatiquement")

    if normalized.get("input_file") != input_file:
        normalized["input_file"] = input_file
        normalization_notes.append("input_file forcé depuis l'artefact du run courant")

    normalized.setdefault(
        "generated_at",
        datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
    )
    normalized["selection_config"] = config.model_dump()
    normalized.setdefault("estimated_combo_odds", None)

    if "combo_in_target_range" not in normalized:
        estimated = normalized.get("estimated_combo_odds")
        in_range = False
        if isinstance(estimated, (int, float)):
            in_range = config.combo_min_odds <= float(estimated) <= config.combo_max_odds
        normalized["combo_in_target_range"] = in_range

    if normalized.get("global_confidence_score") is None and normalized_picks:
        avg_score = round(sum(p["confidence_score"] for p in normalized_picks) / len(normalized_picks))
        normalized["global_confidence_score"] = int(avg_score)
        normalization_notes.append("global_confidence_score déduit depuis les picks")

    if not normalized.get("combo_risk_level") and normalized_picks:
        risks = {p.get("risk_level") for p in normalized_picks}
        if "high" in risks:
            normalized["combo_risk_level"] = "high"
        elif "medium" in risks:
            normalized["combo_risk_level"] = "medium"
        else:
            normalized["combo_risk_level"] = "low"
        normalization_notes.append("combo_risk_level déduit depuis les picks")

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

        normalized = _normalize_selection_payload(parsed, config=config, input_file=input_file)
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

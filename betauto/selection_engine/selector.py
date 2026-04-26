from __future__ import annotations

import json
import logging
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from betauto.api_clients.openai_client import create_response_with_retry

from .models import SelectionConfig, SelectionResult

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parents[2]
PROMPT_PATH = BASE_DIR / "prompts" / "combo_selection_prompt.txt"


def _load_prompt() -> str:
    if not PROMPT_PATH.exists():
        raise FileNotFoundError(f"Prompt introuvable: {PROMPT_PATH}")
    return PROMPT_PATH.read_text(encoding="utf-8")


def _extract_json_from_text(text: str) -> dict[str, Any]:
    payload = (text or "").strip()
    if not payload:
        raise ValueError("Réponse LLM vide.")

    if payload.startswith("{") and payload.endswith("}"):
        return json.loads(payload)

    fenced = re.search(r"```(?:json)?\\s*(\{.*?\})\\s*```", payload, flags=re.DOTALL | re.IGNORECASE)
    if fenced:
        return json.loads(fenced.group(1))

    start = payload.find("{")
    end = payload.rfind("}")
    if start != -1 and end != -1 and end > start:
        return json.loads(payload[start : end + 1])

    raise ValueError("Aucun objet JSON détecté dans la réponse LLM.")


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

    if not normalized.get("status"):
        normalized["status"] = "completed" if normalized_picks else "failed"
        normalization_notes.append("status injecté automatiquement")

    if not normalized.get("input_file"):
        normalized["input_file"] = input_file
        normalization_notes.append("input_file injecté automatiquement")

    normalized.setdefault(
        "generated_at",
        datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z"),
    )
    normalized.setdefault("selection_config", config.model_dump())
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


def select_combo(match_analyses: dict, config: SelectionConfig, llm, *, input_file: str = "") -> dict:
    try:
        prompt_template = _load_prompt()
        analyses_json = json.dumps(match_analyses, ensure_ascii=False, indent=2)
        config_json = json.dumps(config.model_dump(), ensure_ascii=False, indent=2)
        prompt = (
            prompt_template.replace("{{SELECTION_CONFIG_JSON}}", config_json)
            .replace("{{MATCH_ANALYSES_JSON}}", analyses_json)
            .strip()
        )

        model_name = getattr(llm, "analysis_model", None) or os.getenv("SELECTION_ENGINE_MODEL") or os.getenv(
            "OPENAI_ANALYSIS_MODEL"
        )
        if not model_name:
            raise RuntimeError("Modèle OpenAI manquant (SELECTION_ENGINE_MODEL/OPENAI_ANALYSIS_MODEL ou --model).")

        response, _ = create_response_with_retry(
            llm,
            model=model_name,
            input=prompt,
            operation_name="openai.responses.create selection_engine",
            timeout=float(os.getenv("OPENAI_TIMEOUT_SECONDS", "120")),
        )

        parsed = _extract_json_from_text(response.output_text or "")
        normalized = _normalize_selection_payload(parsed, config=config, input_file=input_file)
        validated = SelectionResult.model_validate(normalized)
        return validated.model_dump()
    except Exception as exc:  # noqa: BLE001
        logger.exception("Selection engine failed")
        return _fallback_result(config, input_file=input_file, error=str(exc))

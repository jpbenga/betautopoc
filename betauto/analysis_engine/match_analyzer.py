from __future__ import annotations

import json
import logging
import re
from pathlib import Path
from typing import Any

from .models import MatchAnalysis, MatchAnalysisResult

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parents[2]
PROMPT_PATH = BASE_DIR / "prompts" / "match_analysis_prompt.txt"


def _extract_json_from_text(text: str) -> dict[str, Any]:
    payload = (text or "").strip()
    if not payload:
        raise ValueError("Empty LLM response.")

    if payload.startswith("{") and payload.endswith("}"):
        return json.loads(payload)

    fenced = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", payload, flags=re.DOTALL | re.IGNORECASE)
    if fenced:
        return json.loads(fenced.group(1))

    start = payload.find("{")
    end = payload.rfind("}")
    if start != -1 and end != -1 and end > start:
        return json.loads(payload[start : end + 1])

    raise ValueError("No JSON object detected in LLM response.")


def _build_event_label(match_context: dict[str, Any]) -> str:
    home = (match_context.get("home_team") or {}).get("name", "Home")
    away = (match_context.get("away_team") or {}).get("name", "Away")
    return f"{home} vs {away}"


def _minimal_fallback(match_context: dict[str, Any], error: str) -> MatchAnalysisResult:
    fixture_id = int(match_context.get("fixture_id") or 0)
    analysis = MatchAnalysis(
        fixture_id=fixture_id,
        event=_build_event_label(match_context),
        competition=str(match_context.get("competition") or "Unknown"),
        kickoff=str(match_context.get("kickoff_time") or ""),
        analysis_summary="Analyse indisponible: échec de parsing ou réponse LLM invalide.",
        key_factors=["Données insuffisantes ou réponse non exploitable."],
        risks=[f"Erreur: {error}"],
        predicted_markets=[],
        global_confidence=0,
        data_quality="low",
    )
    return MatchAnalysisResult(status="failed", analysis=analysis, error=error)


def _load_prompt() -> str:
    if not PROMPT_PATH.exists():
        raise FileNotFoundError(f"Prompt not found: {PROMPT_PATH}")
    return PROMPT_PATH.read_text(encoding="utf-8")


def analyze_match(match_context: dict, llm) -> dict:
    """Analyze one match context with exactly one LLM call.

    Parameters
    ----------
    match_context:
        Single match payload from latest_analysis_context.json.
    llm:
        OpenAI client-like object exposing responses.create(...).
    """
    try:
        prompt_template = _load_prompt()
        match_json = json.dumps(match_context, ensure_ascii=False, indent=2)
        prompt = prompt_template.replace("{{MATCH_CONTEXT_JSON}}", match_json)

        model_name = getattr(llm, "analysis_model", None)
        if not model_name:
            model_name = "gpt-4.1-mini"

        response = llm.responses.create(
            model=model_name,
            input=prompt,
        )

        raw_text = response.output_text or ""
        parsed = _extract_json_from_text(raw_text)
        validated = MatchAnalysis.model_validate(parsed)

        usage = getattr(response, "usage", None)
        usage_dict: dict[str, int] = {}
        if usage is not None:
            usage_dict = {
                "input_tokens": int(getattr(usage, "input_tokens", 0) or 0),
                "output_tokens": int(getattr(usage, "output_tokens", 0) or 0),
                "total_tokens": int(getattr(usage, "total_tokens", 0) or 0),
            }

        return MatchAnalysisResult(
            status="success",
            analysis=validated,
            llm_usage=usage_dict,
        ).model_dump()
    except Exception as exc:
        fixture_id = match_context.get("fixture_id", "unknown")
        logger.exception("Match analysis failed for fixture_id=%s", fixture_id)
        return _minimal_fallback(match_context, str(exc)).model_dump()

from __future__ import annotations

import json
import logging
import os
import re
import time
from pathlib import Path
from typing import Any

from betauto.api_clients.errors import ExternalApiError
from betauto.api_clients.openai_client import create_response_with_retry

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


def _limit_list(value: Any, limit: int = 8) -> list[Any]:
    if not isinstance(value, list):
        return []
    return value[:limit]


def compact_match_context_for_llm(match_context: dict[str, Any]) -> dict[str, Any]:
    home_team = match_context.get("home_team") or {}
    away_team = match_context.get("away_team") or {}

    compact_context = {
        "fixture_id": match_context.get("fixture_id"),
        "kickoff_time": match_context.get("kickoff_time"),
        "competition": match_context.get("competition"),
        "home_team": {
            "id": home_team.get("id"),
            "name": home_team.get("name"),
            "standings": home_team.get("standings"),
            "recent_form": _limit_list(home_team.get("recent_form"), 8),
            "season_statistics": home_team.get("season_statistics"),
            "injuries": _limit_list(home_team.get("injuries"), 10),
            "lineup": home_team.get("lineup"),
        },
        "away_team": {
            "id": away_team.get("id"),
            "name": away_team.get("name"),
            "standings": away_team.get("standings"),
            "recent_form": _limit_list(away_team.get("recent_form"), 8),
            "season_statistics": away_team.get("season_statistics"),
            "injuries": _limit_list(away_team.get("injuries"), 10),
            "lineup": away_team.get("lineup"),
        },
        "head_to_head": _limit_list(match_context.get("head_to_head"), 8),
        "odds": match_context.get("odds"),
        "qualitative_context": match_context.get("qualitative_context", {}),
        "analysis_readiness": match_context.get("analysis_readiness", {}),
    }
    return compact_context


def _minimal_fallback(
    match_context: dict[str, Any],
    error: str,
    *,
    duration_seconds: float,
    retry_count: int,
    prompt_size_chars: int,
) -> MatchAnalysisResult:
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
    return MatchAnalysisResult(
        status="failed",
        analysis=analysis,
        error=error,
        duration_seconds=duration_seconds,
        retry_count=retry_count,
        prompt_size_chars=prompt_size_chars,
    )


def _load_prompt() -> str:
    if not PROMPT_PATH.exists():
        raise FileNotFoundError(f"Prompt not found: {PROMPT_PATH}")
    return PROMPT_PATH.read_text(encoding="utf-8")


def analyze_match(match_context: dict, llm) -> dict:
    """Analyze one match context with exactly one LLM call."""
    start = time.perf_counter()
    prompt_size_chars = 0
    retry_count = 0
    try:
        prompt_template = _load_prompt()
        compact_context = compact_match_context_for_llm(match_context)
        match_json = json.dumps(compact_context, ensure_ascii=False, indent=2)
        prompt = prompt_template.replace("{{MATCH_CONTEXT_JSON}}", match_json)
        prompt_size_chars = len(prompt)

        fixture_id = match_context.get("fixture_id", "unknown")
        logger.info("[analysis] fixture_id=%s prompt_size_chars=%s", fixture_id, prompt_size_chars)

        model_name = getattr(llm, "analysis_model", None) or "gpt-4.1-mini"
        timeout_seconds = float(os.getenv("OPENAI_TIMEOUT_SECONDS", "120"))

        response, retry_count = create_response_with_retry(
            llm,
            model=model_name,
            input=prompt,
            operation_name=f"openai.responses.create fixture_id={fixture_id}",
            timeout=timeout_seconds,
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

        duration_seconds = round(time.perf_counter() - start, 3)
        return MatchAnalysisResult(
            status="success",
            analysis=validated,
            llm_usage=usage_dict,
            token_usage=usage_dict,
            duration_seconds=duration_seconds,
            retry_count=retry_count,
            prompt_size_chars=prompt_size_chars,
        ).model_dump()
    except Exception as exc:  # noqa: BLE001
        fixture_id = match_context.get("fixture_id", "unknown")
        duration_seconds = round(time.perf_counter() - start, 3)
        if isinstance(exc, ExternalApiError):
            logger.error("[openai] request failed fixture_id=%s error=%s", fixture_id, exc)
        else:
            logger.exception("Match analysis failed for fixture_id=%s", fixture_id)
        return _minimal_fallback(
            match_context,
            str(exc),
            duration_seconds=duration_seconds,
            retry_count=retry_count,
            prompt_size_chars=prompt_size_chars,
        ).model_dump()

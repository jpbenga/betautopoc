from __future__ import annotations

import json
import logging
import os
import re
import time
from pathlib import Path
from typing import Any, Callable, Optional

from betauto.api_clients.errors import ExternalApiError
from betauto.api_clients.openai_client import (
    create_response_with_retry,
    create_structured_response_with_retry,
    parse_response_output_json,
)
from betauto.strategy import ResolvedStrategyConfig

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


def _qualitative_trace(match_context: dict[str, Any]) -> dict[str, Any]:
    context = match_context.get("qualitative_context") if isinstance(match_context, dict) else {}
    if not isinstance(context, dict):
        context = {}

    preferred_media = context.get("preferred_media") if isinstance(context.get("preferred_media"), list) else []
    consulted_sources = (
        context.get("consulted_sources") if isinstance(context.get("consulted_sources"), list) else []
    )
    signals = context.get("signals") if isinstance(context.get("signals"), list) else []
    collection_status = str(context.get("collection_status") or "not_collected")

    return {
        "available": bool(context.get("available")),
        "collection_status": collection_status,
        "preferred_media_count": len(preferred_media),
        "preferred_media": [
            {
                "source_id": source.get("source_id"),
                "media_name": source.get("media_name"),
                "priority_rank": source.get("priority_rank"),
                "language": source.get("language"),
            }
            for source in preferred_media
            if isinstance(source, dict)
        ],
        "consulted_sources_count": len(consulted_sources),
        "consulted_sources": [
            {
                "source_id": source.get("source_id"),
                "media_name": source.get("media_name"),
                "url": source.get("url"),
                "published_at": source.get("published_at"),
                "language": source.get("language"),
            }
            for source in consulted_sources
            if isinstance(source, dict)
        ],
        "signals_count": len(signals),
        "signals": [
            {
                "signal_id": signal.get("signal_id"),
                "category": signal.get("category"),
                "summary": signal.get("summary"),
                "impact": signal.get("impact"),
                "confidence": signal.get("confidence"),
                "team_scope": signal.get("team_scope"),
                "source_ids": signal.get("source_ids") if isinstance(signal.get("source_ids"), list) else [],
                "evidence": signal.get("evidence") if isinstance(signal.get("evidence"), list) else [],
            }
            for signal in signals
            if isinstance(signal, dict)
        ],
        "used_as_evidence": bool(consulted_sources or signals),
        "usage_note": (
            "preferred_media_directory_only"
            if preferred_media and collection_status == "not_collected" and not consulted_sources and not signals
            else "qualitative_signals_available"
            if consulted_sources or signals
            else "no_qualitative_context"
        ),
    }


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
        qualitative_trace=_qualitative_trace(match_context),
        duration_seconds=duration_seconds,
        retry_count=retry_count,
        prompt_size_chars=prompt_size_chars,
    )


def _load_prompt() -> str:
    if not PROMPT_PATH.exists():
        raise FileNotFoundError(f"Prompt not found: {PROMPT_PATH}")
    return PROMPT_PATH.read_text(encoding="utf-8")


def _build_strategy_constraints(strategy_cfg: ResolvedStrategyConfig | None) -> str:
    if strategy_cfg is None:
        return ""

    allowed_markets = strategy_cfg.allowed_markets or []
    allowed_markets_text = ", ".join(allowed_markets) if allowed_markets else "(aucun marché explicite; rester strictement factuel)"
    risk_policy = f"pick={strategy_cfg.max_pick_risk}, combo={strategy_cfg.max_combo_risk}"
    data_quality_min = getattr(strategy_cfg.min_data_quality, "value", strategy_cfg.min_data_quality)

    return (
        "CONTRAINTES STRATÉGIE (OBLIGATOIRES)\n"
        f"- Strategy ID: {strategy_cfg.strategy_id}\n"
        f"- Marchés autorisés (prioritaires): {allowed_markets_text}\n"
        f"- Seuil de confiance minimal (pick): {strategy_cfg.min_pick_confidence}\n"
        f"- Data quality minimale: {data_quality_min}\n"
        f"- Risk policy: {risk_policy}\n"
        "- N'invente jamais de marché hors stratégie.\n"
        "- Priorise strictement les marchés autorisés.\n"
        "- Si les données ne permettent pas un marché autorisé fiable, renvoie predicted_markets=[].\n"
    )


def _env_flag(name: str, default: bool) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _build_analysis_instructions(prompt_template: str, strategy_cfg: ResolvedStrategyConfig | None) -> str:
    strategy_constraints = _build_strategy_constraints(strategy_cfg)
    return prompt_template.replace("{{STRATEGY_CONSTRAINTS}}", strategy_constraints).strip()


def _build_analysis_input(match_context: dict[str, Any]) -> str:
    compact_context = compact_match_context_for_llm(match_context)
    match_json = json.dumps(compact_context, ensure_ascii=False, indent=2)
    return f"INPUT_MATCH_JSON:\n{match_json}"


def analyze_match(
    match_context: dict,
    llm,
    strategy_cfg: Optional[ResolvedStrategyConfig] = None,
    log_callback: Callable[[str], None] | None = None,
) -> dict:
    """Analyze one match context with exactly one LLM call."""
    start = time.perf_counter()
    prompt_size_chars = 0
    retry_count = 0
    try:
        prompt_template = _load_prompt()
        instructions = _build_analysis_instructions(prompt_template, strategy_cfg)
        input_text = _build_analysis_input(match_context)
        prompt_size_chars = len(instructions) + len(input_text)
        qualitative_trace = _qualitative_trace(match_context)

        fixture_id = match_context.get("fixture_id", "unknown")
        logger.info(
            "[analysis] fixture_id=%s prompt_size_chars=%s strategy_applied=%s "
            "qualitative_status=%s preferred_media=%s qualitative_signals=%s",
            fixture_id,
            prompt_size_chars,
            strategy_cfg is not None,
            qualitative_trace.get("collection_status"),
            qualitative_trace.get("preferred_media_count"),
            qualitative_trace.get("signals_count"),
        )

        model_name = getattr(llm, "analysis_model", None) or "gpt-4.1-mini"
        timeout_seconds = float(os.getenv("OPENAI_TIMEOUT_SECONDS", "120"))

        def on_retry(operation_name: str, error: ExternalApiError, sleep_seconds: float, attempt: int, max_retries: int) -> None:
            if not log_callback:
                return
            if error.status_code == 429:
                log_callback(f"[analysis] fixture_id={fixture_id} rate limited by OpenAI, retry in {sleep_seconds:.1f}s")
                return
            log_callback(
                f"[analysis] fixture_id={fixture_id} retry/backoff {attempt}/{max_retries} "
                f"after {error.provider} error, retry in {sleep_seconds:.1f}s"
            )

        use_structured_outputs = _env_flag("OPENAI_USE_STRUCTURED_OUTPUTS", True)
        fallback_to_legacy = _env_flag("OPENAI_STRUCTURED_FALLBACK_TO_LEGACY", True)

        try:
            if use_structured_outputs:
                response, retry_count = create_structured_response_with_retry(
                    llm,
                    model=model_name,
                    instructions=instructions,
                    input=input_text,
                    response_model=MatchAnalysis,
                    operation_name=f"openai.responses.create fixture_id={fixture_id}",
                    timeout=timeout_seconds,
                    retry_log_callback=on_retry,
                )
                parsed = parse_response_output_json(response)
            else:
                legacy_prompt = f"{instructions}\n\n{input_text}"
                response, retry_count = create_response_with_retry(
                    llm,
                    model=model_name,
                    input=legacy_prompt,
                    operation_name=f"openai.responses.create fixture_id={fixture_id}",
                    timeout=timeout_seconds,
                    retry_log_callback=on_retry,
                )
                raw_text = response.output_text or ""
                parsed = _extract_json_from_text(raw_text)
        except Exception:
            if not (use_structured_outputs and fallback_to_legacy):
                raise
            logger.warning(
                "[analysis] fixture_id=%s structured output failed, falling back to legacy JSON prompt",
                fixture_id,
                exc_info=True,
            )
            legacy_prompt = f"{instructions}\n\n{input_text}"
            response, retry_count = create_response_with_retry(
                llm,
                model=model_name,
                input=legacy_prompt,
                operation_name=f"openai.responses.create fixture_id={fixture_id}",
                timeout=timeout_seconds,
                retry_log_callback=on_retry,
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
            qualitative_trace=qualitative_trace,
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

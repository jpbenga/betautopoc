from __future__ import annotations

import json
import logging
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Literal

from pydantic import BaseModel, ConfigDict, Field

from betauto.api_clients.openai_client import (
    create_structured_response_with_retry,
    parse_response_output_json,
)

from .models import QualitativeContext, QualitativeSignalContext, QualitativeSourceContext

logger = logging.getLogger(__name__)

BASE_DIR = Path(__file__).resolve().parents[2]
PROMPT_PATH = BASE_DIR / "prompts" / "qualitative_research_prompt.txt"


class StrictBaseModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class QualitativeResearchSource(StrictBaseModel):
    source_id: str | None = None
    media_name: str
    url: str
    title: str | None = None
    published_at: str | None = None
    language: str | None = None
    reliability: Literal["preferred_reference", "reliable", "uncertain"] = "reliable"


class QualitativeResearchSignal(StrictBaseModel):
    signal_id: str | None = None
    category: Literal[
        "team_news",
        "rotation",
        "injury_update",
        "coach_quote",
        "schedule_pressure",
        "travel_fatigue",
        "motivation_context",
        "weather",
        "tactical_context",
        "other",
    ]
    summary: str
    impact: Literal["positive", "negative", "neutral", "mixed"]
    confidence: Literal["high", "medium", "low", "unknown"]
    team_scope: Literal["home", "away", "both", "match"]
    source_ids: list[str] = Field(default_factory=list)
    evidence: list[str] = Field(default_factory=list)


class QualitativeSignalReport(StrictBaseModel):
    fixture_id: int
    event: str
    competition: str | None = None
    kickoff: str | None = None
    collection_status: Literal["completed", "partial", "failed", "not_collected"]
    consulted_sources: list[QualitativeResearchSource] = Field(default_factory=list)
    signals: list[QualitativeResearchSignal] = Field(default_factory=list)
    missing_dimensions: list[str] = Field(default_factory=list)
    source_notes: list[str] = Field(default_factory=list)


def _load_prompt() -> str:
    if not PROMPT_PATH.exists():
        raise FileNotFoundError(f"Prompt introuvable: {PROMPT_PATH}")
    return PROMPT_PATH.read_text(encoding="utf-8").strip()


def _env_flag(name: str, default: bool) -> bool:
    value = os.getenv(name)
    if value is None:
        return default
    return value.strip().lower() in {"1", "true", "yes", "on"}


def _match_label(match_context: dict[str, Any]) -> str:
    home = (match_context.get("home_team") or {}).get("name") or "Home"
    away = (match_context.get("away_team") or {}).get("name") or "Away"
    return f"{home} vs {away}"


def should_collect_qualitative_context(match_context: dict[str, Any], strategy_cfg: Any | None = None) -> bool:
    if not _env_flag("QUALITATIVE_RESEARCH_ENABLED", True):
        return False
    if strategy_cfg is not None and getattr(strategy_cfg, "use_qualitative_context", True) is False:
        return False

    context = match_context.get("qualitative_context") if isinstance(match_context, dict) else {}
    if not isinstance(context, dict):
        return False
    preferred_media = context.get("preferred_media") if isinstance(context.get("preferred_media"), list) else []
    if not preferred_media:
        return False
    signals = context.get("signals") if isinstance(context.get("signals"), list) else []
    consulted_sources = (
        context.get("consulted_sources") if isinstance(context.get("consulted_sources"), list) else []
    )
    return not signals and not consulted_sources


def _research_input(match_context: dict[str, Any]) -> str:
    context = match_context.get("qualitative_context") if isinstance(match_context.get("qualitative_context"), dict) else {}
    preferred_media = context.get("preferred_media") if isinstance(context.get("preferred_media"), list) else []
    home_team = match_context.get("home_team") or {}
    away_team = match_context.get("away_team") or {}
    payload = {
        "fixture_id": match_context.get("fixture_id"),
        "event": _match_label(match_context),
        "competition": match_context.get("competition"),
        "league_id": match_context.get("league_id"),
        "kickoff": match_context.get("kickoff_time"),
        "home_team": {"id": home_team.get("id"), "name": home_team.get("name")},
        "away_team": {"id": away_team.get("id"), "name": away_team.get("name")},
        "preferred_media": preferred_media,
        "research_dimensions": [
            "team_news",
            "rotation",
            "injury_update",
            "coach_quote",
            "schedule_pressure",
            "travel_fatigue",
            "motivation_context",
            "weather",
            "tactical_context",
        ],
        "current_date": datetime.now(timezone.utc).date().isoformat(),
    }
    return "INPUT_QUALITATIVE_RESEARCH_JSON:\n" + json.dumps(payload, ensure_ascii=False, indent=2)


def _preferred_source_id(media_name: str, preferred_media: list[dict[str, Any]]) -> str | None:
    normalized = media_name.strip().lower()
    for source in preferred_media:
        if not isinstance(source, dict):
            continue
        if str(source.get("media_name") or "").strip().lower() == normalized:
            return str(source.get("source_id") or "") or None
    return None


def _normalize_sources(
    report_sources: list[dict[str, Any]],
    preferred_media: list[dict[str, Any]],
) -> list[QualitativeSourceContext]:
    sources: list[QualitativeSourceContext] = []
    used_ids: set[str] = set()
    for index, item in enumerate(report_sources, start=1):
        media_name = str(item.get("media_name") or "").strip()
        url = str(item.get("url") or "").strip()
        if not media_name or not url:
            continue
        source_id = str(item.get("source_id") or "").strip()
        source_id = source_id or _preferred_source_id(media_name, preferred_media) or f"SRC-{index:03d}"
        if source_id in used_ids:
            source_id = f"{source_id}-{index:03d}"
        used_ids.add(source_id)
        sources.append(
            QualitativeSourceContext(
                source_id=source_id,
                media_name=media_name,
                url=url,
                published_at=item.get("published_at"),
                language=item.get("language"),
                scope="match",
                reliability=str(item.get("reliability") or "reliable"),
            )
        )
    return sources


def _normalize_signals(
    report_signals: list[dict[str, Any]],
    known_source_ids: set[str],
) -> list[QualitativeSignalContext]:
    signals: list[QualitativeSignalContext] = []
    for index, item in enumerate(report_signals, start=1):
        source_ids = [str(source_id) for source_id in item.get("source_ids", []) if str(source_id) in known_source_ids]
        if not source_ids:
            continue
        signals.append(
            QualitativeSignalContext(
                signal_id=str(item.get("signal_id") or f"SIG-{index:03d}"),
                category=str(item.get("category") or "other"),
                summary=str(item.get("summary") or ""),
                impact=str(item.get("impact") or "neutral"),
                confidence=str(item.get("confidence") or "unknown"),
                team_scope=str(item.get("team_scope") or "match"),
                source_ids=source_ids,
                evidence=[str(value) for value in item.get("evidence", []) if value is not None],
            )
        )
    return [signal for signal in signals if signal.summary.strip()]


def _merge_report_into_context(match_context: dict[str, Any], report: dict[str, Any]) -> dict[str, Any]:
    raw_context = match_context.get("qualitative_context") if isinstance(match_context.get("qualitative_context"), dict) else {}
    preferred_media = raw_context.get("preferred_media") if isinstance(raw_context.get("preferred_media"), list) else []
    sources = _normalize_sources(
        report.get("consulted_sources") if isinstance(report.get("consulted_sources"), list) else [],
        preferred_media,
    )
    source_ids = {str(source.source_id) for source in sources if source.source_id}
    signals = _normalize_signals(
        report.get("signals") if isinstance(report.get("signals"), list) else [],
        source_ids,
    )
    status = str(report.get("collection_status") or "completed")
    if status == "completed" and not sources:
        status = "not_collected"
    if status == "completed" and sources and not signals:
        status = "partial"

    return QualitativeContext(
        available=bool(signals),
        collection_status=status,
        preferred_media=[
            QualitativeSourceContext(**source)
            for source in preferred_media
            if isinstance(source, dict)
        ],
        consulted_sources=sources,
        signals=signals,
        missing_dimensions=[str(item) for item in report.get("missing_dimensions", []) if item is not None],
        source_notes=[str(item) for item in report.get("source_notes", []) if item is not None],
    ).to_dict()


def _failed_context(match_context: dict[str, Any], error: str) -> dict[str, Any]:
    raw_context = match_context.get("qualitative_context") if isinstance(match_context.get("qualitative_context"), dict) else {}
    preferred_media = raw_context.get("preferred_media") if isinstance(raw_context.get("preferred_media"), list) else []
    return QualitativeContext(
        available=False,
        collection_status="failed",
        preferred_media=[
            QualitativeSourceContext(**source)
            for source in preferred_media
            if isinstance(source, dict)
        ],
        consulted_sources=[],
        signals=[],
        source_notes=[f"Qualitative research failed: {error}"],
    ).to_dict()


def collect_qualitative_context(match_context: dict[str, Any], llm: Any, strategy_cfg: Any | None = None) -> dict[str, Any]:
    if not should_collect_qualitative_context(match_context, strategy_cfg):
        context = match_context.get("qualitative_context")
        return context if isinstance(context, dict) else QualitativeContext().to_dict()

    model_name = (
        getattr(llm, "qualitative_research_model", None)
        or os.getenv("QUALITATIVE_RESEARCH_MODEL")
        or getattr(llm, "analysis_model", None)
        or os.getenv("OPENAI_ANALYSIS_MODEL")
    )
    if not model_name:
        return _failed_context(match_context, "QUALITATIVE_RESEARCH_MODEL or OPENAI_ANALYSIS_MODEL missing.")

    try:
        response, _ = create_structured_response_with_retry(
            llm,
            model=model_name,
            instructions=_load_prompt(),
            input=_research_input(match_context),
            response_model=QualitativeSignalReport,
            operation_name=f"openai.responses.create qualitative fixture_id={match_context.get('fixture_id')}",
            tools=[{"type": "web_search"}],
            timeout=float(os.getenv("OPENAI_TIMEOUT_SECONDS", "120")),
        )
        report = parse_response_output_json(response)
        return _merge_report_into_context(match_context, report)
    except Exception as exc:  # noqa: BLE001
        logger.warning(
            "[qualitative] fixture_id=%s collection failed: %s",
            match_context.get("fixture_id"),
            exc,
            exc_info=True,
        )
        return _failed_context(match_context, str(exc))

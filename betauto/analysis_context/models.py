from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any


@dataclass(slots=True)
class ApiCallLog:
    endpoint: str
    params: dict[str, Any] = field(default_factory=dict)
    status_code: int | None = None
    success: bool = False
    error: str | None = None
    response_items: int | None = None
    duration_seconds: float | None = None
    retry_count: int = 0
    requests_remaining: int | None = None
    requests_limit: int | None = None
    quota_reset: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class TeamContext:
    id: int
    name: str
    recent_form: list[dict[str, Any]] = field(default_factory=list)
    season_statistics: dict[str, Any] = field(default_factory=dict)
    standings: dict[str, Any] = field(default_factory=dict)
    injuries: list[dict[str, Any]] = field(default_factory=list)
    lineup: dict[str, Any] | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class MarketContext:
    id: int | None
    name: str
    values: list[dict[str, Any]] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class OddsContext:
    bookmaker: dict[str, Any]
    markets: list[MarketContext] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        payload = asdict(self)
        payload["markets"] = [market.to_dict() for market in self.markets]
        return payload


@dataclass(slots=True)
class QuantitativeContext:
    available: bool
    notes: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class QualitativeSourceContext:
    source_id: str | None = None
    media_name: str = ""
    media_type: str = "press"
    priority_rank: int | None = None
    url: str | None = None
    published_at: str | None = None
    language: str | None = None
    scope: str = "match"
    reliability: str = "unknown"

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class QualitativeSignalContext:
    signal_id: str | None = None
    category: str = ""
    summary: str = ""
    impact: str = "neutral"
    confidence: str = "unknown"
    team_scope: str = "match"
    source_ids: list[str] = field(default_factory=list)
    evidence: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class QualitativeContext:
    available: bool = False
    collection_status: str = "not_collected"
    preferred_media: list[QualitativeSourceContext] = field(default_factory=list)
    consulted_sources: list[QualitativeSourceContext] = field(default_factory=list)
    signals: list[QualitativeSignalContext] = field(default_factory=list)
    missing_dimensions: list[str] = field(default_factory=list)
    source_notes: list[str] = field(default_factory=list)
    news: list[str] = field(default_factory=list)
    coach_quotes: list[str] = field(default_factory=list)
    rumors: list[str] = field(default_factory=list)
    weather: dict[str, Any] | None = None
    fatigue_notes: list[str] = field(default_factory=list)
    schedule_context: list[str] = field(default_factory=list)
    motivation_notes: list[str] = field(default_factory=list)
    manual_notes: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        payload = asdict(self)
        payload["preferred_media"] = [source.to_dict() for source in self.preferred_media]
        payload["consulted_sources"] = [source.to_dict() for source in self.consulted_sources]
        payload["signals"] = [signal.to_dict() for signal in self.signals]
        return payload


@dataclass(slots=True)
class MatchContext:
    fixture_id: int
    kickoff_time: str
    competition: str
    league_id: int | None
    season: int | None
    home_team: TeamContext
    away_team: TeamContext
    head_to_head: list[dict[str, Any]] = field(default_factory=list)
    predictions: dict[str, Any] = field(default_factory=dict)
    odds: OddsContext | None = None
    fixture_statistics: list[dict[str, Any]] = field(default_factory=list)
    fixture_events: list[dict[str, Any]] = field(default_factory=list)
    quantitative_summary: QuantitativeContext = field(default_factory=lambda: QuantitativeContext(available=False))
    qualitative_context: QualitativeContext = field(default_factory=QualitativeContext)
    analysis_readiness: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        payload = asdict(self)
        payload["home_team"] = self.home_team.to_dict()
        payload["away_team"] = self.away_team.to_dict()
        payload["odds"] = self.odds.to_dict() if self.odds else {"bookmaker": {}, "markets": []}
        payload["quantitative_summary"] = self.quantitative_summary.to_dict()
        payload["qualitative_context"] = self.qualitative_context.to_dict()
        return payload


@dataclass(slots=True)
class AnalysisContext:
    generated_at: str
    target_date: str
    source: dict[str, bool]
    league: dict[str, Any]
    leagues: list[dict[str, Any]] = field(default_factory=list)
    matches: list[MatchContext] = field(default_factory=list)
    api_calls: list[ApiCallLog] = field(default_factory=list)
    pipeline_trace: dict[str, Any] = field(default_factory=dict)

    def to_dict(self) -> dict[str, Any]:
        return {
            "generated_at": self.generated_at,
            "target_date": self.target_date,
            "source": self.source,
            "league": self.league,
            "leagues": self.leagues,
            "matches": [match.to_dict() for match in self.matches],
            "api_calls": [call.to_dict() for call in self.api_calls],
            "pipeline_trace": self.pipeline_trace,
        }

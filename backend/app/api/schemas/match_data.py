from __future__ import annotations

from pydantic import Field

from backend.app.api.schemas.common import ContractBaseModel


class MatchDataStatus(ContractBaseModel):
    status: str
    message: str | None = None
    target_date: str | None = None


class TeamSummary(ContractBaseModel):
    id: int | None = None
    name: str


class MarketOddsSummary(ContractBaseModel):
    market_id: int | None = None
    name: str
    values: list[dict[str, str | float | int | None]] = Field(default_factory=list)


class OddsSummary(ContractBaseModel):
    fixture_id: int
    target_date: str
    source_run_id: str
    source_file: str
    bookmaker_id: int | None = None
    bookmaker_name: str | None = None
    markets: list[MarketOddsSummary] = Field(default_factory=list)
    status: str = "available"


class FixtureSummary(ContractBaseModel):
    target_date: str
    source_run_id: str
    source_file: str
    data_source_mode: str = "run_artifacts"
    date_consistency_status: str = "ok"
    league_id: int | None = None
    league_name: str | None = None
    fixture_id: int
    home_team: TeamSummary
    away_team: TeamSummary
    kickoff: str | None = None
    status: str = "available"
    odds_markets_count: int = 0


class MatchContextSummary(ContractBaseModel):
    status: str = "available"
    target_date: str
    source_run_id: str
    source_file: str
    data_source_mode: str = "run_artifacts"
    date_consistency_status: str = "ok"
    league_id: int | None = None
    league_name: str | None = None
    matches_count: int = 0
    fixtures: list[FixtureSummary] = Field(default_factory=list)


class ProviderQuotaSummary(ContractBaseModel):
    provider: str = "api-football"
    status: str
    message: str
    used: int | None = None
    limit: int | None = None
    remaining: int | None = None
    source: str | None = None


class MatchDataNoDataResponse(ContractBaseModel):
    status: str = "no_data"
    message: str
    target_date: str | None = None
    data_source_mode: str = "run_artifacts"
    date_consistency_status: str = "no_data"


class RebuildContextRequest(ContractBaseModel):
    date: str
    strategy_file: str | None = None


class RebuildContextResponse(ContractBaseModel):
    status: str
    message: str
    target_date: str | None = None

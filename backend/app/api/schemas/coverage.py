from __future__ import annotations

from typing import Literal

from pydantic import Field

from backend.app.api.schemas.common import ContractBaseModel


class FootballLeagueRegistryEntry(ContractBaseModel):
    sport: Literal["football"]
    country: str
    competition_name: str
    competition_type: Literal["league", "cup", "international"]
    league_id: int | None = None
    season_mode: str
    tier: int
    priority: int
    enabled: bool
    agent_profile: str
    strategy_profile: str
    notes: str | None = None


class FootballLeagueRegistryResponse(ContractBaseModel):
    status: Literal["available", "no_data", "error"]
    version: int | None = None
    source: str = "api-football"
    generated_at: str | None = None
    verification_status: str | None = None
    notes: str | None = None
    leagues: list[FootballLeagueRegistryEntry] = Field(default_factory=list)
    total_count: int = 0
    enabled_count: int = 0
    verified_count: int = 0


class FootballLeagueToggleRequest(ContractBaseModel):
    enabled: bool


class FootballLeagueToggleResponse(ContractBaseModel):
    status: Literal["updated"]
    league: FootballLeagueRegistryEntry
    total_count: int = 0
    enabled_count: int = 0

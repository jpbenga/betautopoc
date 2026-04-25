from __future__ import annotations

from typing import Literal
from pydantic import BaseModel, Field

Competition = Literal["Ligue 1", "Premier League", "La Liga"]
RiskLevel = Literal["low", "medium", "high"]
Market = Literal[
    "1N2",
    "Double chance",
    "Draw no bet",
    "Over 1.5 goals",
    "Under 4.5 goals",
    "Both teams to score",
]


class RejectedMatch(BaseModel):
    competition: Competition
    event: str
    reason: str


class Pick(BaseModel):
    pick_id: str
    competition: Competition
    event: str
    home_team: str
    away_team: str
    kickoff_time_local: str
    market: Market
    pick: str
    expected_odds_min: float = Field(gt=1.0)
    expected_odds_max: float = Field(gt=1.0)
    confidence_score: int = Field(ge=0, le=100)
    risk_level: RiskLevel
    analysis_summary: str
    key_factors: list[str]
    main_risks: list[str]
    source_urls: list[str]


class ComboAnalysis(BaseModel):
    generated_at: str
    target_date: str
    competitions_analyzed: list[Competition]
    combo_target_odds_range: dict[str, float]
    max_matches: int = Field(ge=2, le=5)
    strategy_summary: str
    picks: list[Pick]
    estimated_combo_odds: float | None = None
    global_confidence_score: int = Field(ge=0, le=100)
    combo_risk_level: RiskLevel
    rejected_matches: list[RejectedMatch] = Field(default_factory=list)
    notes: list[str] = Field(default_factory=list)


class UnibetPickVerification(BaseModel):
    pick_id: str
    competition: str
    event: str
    market: str
    pick: str
    found_on_unibet: bool
    added_to_betslip: bool = False
    unibet_event_label: str | None = None
    unibet_market_label: str | None = None
    unibet_pick_label: str | None = None
    expected_odds_min: float
    expected_odds_max: float
    unibet_odds: float | None = None
    odds_coherent: bool
    confidence: Literal["high", "medium", "low"]
    reason: str


class BrowserProcessStep(BaseModel):
    step: int
    action: str
    observation: str
    status: Literal["done", "warning", "failed"]


class UnibetVerificationOutput(BaseModel):
    checked_at: str
    source: str = "unibet.fr"
    status: Literal["completed", "partial", "failed"]
    process_steps: list[BrowserProcessStep] = Field(default_factory=list)
    picks_checked: list[UnibetPickVerification]
    unibet_combo_odds: float | None = None
    combo_in_target_range: bool | None = None
    errors: list[str] = Field(default_factory=list)
    notes: list[str] = Field(default_factory=list)


COMBO_ANALYSIS_JSON_SCHEMA = ComboAnalysis.model_json_schema()

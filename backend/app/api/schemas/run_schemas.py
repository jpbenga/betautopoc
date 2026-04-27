from __future__ import annotations

from typing import Any, Optional

from pydantic import BaseModel, Field


class Pick(BaseModel):
    pick_id: str
    competition: str
    event: str
    home_team: Optional[str] = None
    away_team: Optional[str] = None
    kickoff_time_local: Optional[str] = None
    market: str
    pick: str
    market_canonical_id: Optional[str] = None
    selection_canonical_id: Optional[str] = None
    market_aliases: list[str] = Field(default_factory=list)
    selection_aliases: list[str] = Field(default_factory=list)
    dictionary_match_status: Optional[str] = None
    dictionary_notes: list[str] = Field(default_factory=list)
    expected_odds_min: float
    expected_odds_max: float
    confidence_score: int
    risk_level: Optional[str] = None
    analysis_summary: Optional[str] = None
    key_factors: list[str] = Field(default_factory=list)
    main_risks: list[str] = Field(default_factory=list)
    source_urls: list[str] = Field(default_factory=list)


class PicksPayload(BaseModel):
    generated_at: str
    target_date: str
    competitions_analyzed: list[str] = Field(default_factory=list)
    combo_target_odds_range: dict[str, float] = Field(default_factory=dict)
    max_matches: Optional[int] = None
    strategy_summary: Optional[str] = None
    picks: list[Pick]
    estimated_combo_odds: Optional[float] = None
    global_confidence_score: Optional[int] = None
    combo_risk_level: Optional[str] = None
    rejected_matches: list[dict[str, Any]] = Field(default_factory=list)
    notes: list[str] = Field(default_factory=list)


class VerifiedPick(BaseModel):
    pick_id: str
    competition: Optional[str] = None
    event: str
    market: str
    pick: str
    market_canonical_id: Optional[str] = None
    selection_canonical_id: Optional[str] = None
    matched_market_alias: Optional[str] = None
    matched_selection_alias: Optional[str] = None
    dictionary_match_status: Optional[str] = None

    found_on_unibet: bool
    added_to_betslip: bool = False
    unibet_event_label: Optional[str] = None
    unibet_market_label: Optional[str] = None
    unibet_pick_label: Optional[str] = None

    expected_odds_min: Optional[float] = None
    expected_odds_max: Optional[float] = None
    unibet_odds: Optional[float] = None

    odds_coherent: bool
    confidence: Optional[str] = None
    reason: str


class VerificationOutput(BaseModel):
    checked_at: str
    source: str = "unibet.fr"
    status: str
    picks_checked: list[VerifiedPick]
    unibet_combo_odds: Optional[float] = None
    combo_in_target_range: Optional[bool] = None
    browser_summary: Optional[str] = None
    navigation_steps: list[str] = Field(default_factory=list)
    errors: list[str] = Field(default_factory=list)
    notes: list[str] = Field(default_factory=list)

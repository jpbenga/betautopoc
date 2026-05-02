from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, ConfigDict, Field


class StrictBaseModel(BaseModel):
    model_config = ConfigDict(extra="forbid")


class SelectionConfig(StrictBaseModel):
    combo_min_odds: float = Field(gt=1)
    combo_max_odds: float = Field(gt=1)
    min_picks: int = Field(default=1, ge=1)
    max_picks: int = Field(ge=1)
    allow_single: bool = True
    allow_combo: bool = True
    preferred_ticket_type: Literal["single", "combo", "mixed"] = "combo"
    min_pick_confidence: int = Field(ge=0, le=100)
    min_global_match_confidence: int = Field(ge=0, le=100)


class EvidenceSummary(StrictBaseModel):
    global_confidence: int | None = Field(default=None, ge=0, le=100)
    data_quality: Literal["high", "medium", "low"] | None = None
    confidence_tier: Literal["elite", "very_strong", "strong", "medium", "weak", "very_weak"] | None = None
    odds_source: str | None = None
    source_status: str | None = None
    expected_odds_min: float | None = None
    expected_odds_max: float | None = None


class SelectedPick(StrictBaseModel):
    pick_id: str
    fixture_id: int | None = None
    event: str
    competition: str | None = None
    kickoff: str | None = None
    market_canonical_id: str
    selection_canonical_id: str
    market: str | None = None
    pick: str | None = None
    expected_odds_min: float | None = None
    expected_odds_max: float | None = None
    confidence_score: int = Field(ge=0, le=100)
    risk_level: str
    reason: str
    evidence_summary: EvidenceSummary = Field(default_factory=EvidenceSummary)
    source_match_analysis_id: str | None = None


class RejectedCandidate(StrictBaseModel):
    candidate_id: str | None = None
    fixture_id: int | None = None
    event: str | None = None
    market: str | None = None
    pick: str | None = None
    market_canonical_id: str | None = None
    selection_canonical_id: str | None = None
    confidence_score: int | None = Field(default=None, ge=0, le=100)
    risk_level: str | None = None
    reason: str


class SelectionVariant(StrictBaseModel):
    variant_id: str
    label: str
    picks: list[SelectedPick] = Field(default_factory=list)
    estimated_combo_odds: float | None = None
    combo_in_target_range: bool = False
    global_confidence_score: int | None = Field(default=None, ge=0, le=100)
    combo_risk_level: Literal["low", "medium", "high"] | None = None
    strategy_fit_score: int = Field(default=0, ge=0, le=100)
    reason: str
    tradeoffs: list[str] = Field(default_factory=list)


class SelectionResult(StrictBaseModel):
    generated_at: str
    status: Literal["completed", "partial", "failed"]
    selection_config: SelectionConfig
    input_file: str
    picks: list[SelectedPick] = Field(default_factory=list)
    variants: list[SelectionVariant] = Field(default_factory=list)
    selected_variant_id: str | None = None
    selection_reason: str | None = None
    estimated_combo_odds: float | None = None
    combo_in_target_range: bool = False
    global_confidence_score: int | None = Field(default=None, ge=0, le=100)
    combo_risk_level: Literal["low", "medium", "high"] | None = None
    rejected_candidates: list[RejectedCandidate] = Field(default_factory=list)
    notes: list[str] = Field(default_factory=list)
    errors: list[str] = Field(default_factory=list)

from __future__ import annotations

from typing import Any, Literal

from pydantic import BaseModel, Field


class SelectionConfig(BaseModel):
    combo_min_odds: float = Field(gt=1)
    combo_max_odds: float = Field(gt=1)
    max_picks: int = Field(ge=1)
    min_pick_confidence: int = Field(ge=0, le=100)
    min_global_match_confidence: int = Field(ge=0, le=100)


class SelectedPick(BaseModel):
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
    evidence_summary: dict[str, Any] = Field(default_factory=dict)
    source_match_analysis_id: str | None = None


class SelectionResult(BaseModel):
    generated_at: str
    status: Literal["completed", "partial", "failed"]
    selection_config: dict[str, Any]
    input_file: str
    picks: list[SelectedPick] = Field(default_factory=list)
    estimated_combo_odds: float | None = None
    combo_in_target_range: bool = False
    global_confidence_score: int | None = Field(default=None, ge=0, le=100)
    combo_risk_level: Literal["low", "medium", "high"] | None = None
    rejected_candidates: list[dict[str, Any]] = Field(default_factory=list)
    notes: list[str] = Field(default_factory=list)
    errors: list[str] = Field(default_factory=list)

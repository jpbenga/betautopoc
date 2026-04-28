from __future__ import annotations

from pydantic import BaseModel, Field


class PredictedMarket(BaseModel):
    market_canonical_id: str
    selection_canonical_id: str
    confidence: int = Field(ge=0, le=100)
    reason: str


class MatchAnalysis(BaseModel):
    fixture_id: int
    event: str
    competition: str
    kickoff: str
    analysis_summary: str
    key_factors: list[str] = Field(default_factory=list)
    risks: list[str] = Field(default_factory=list)
    predicted_markets: list[PredictedMarket] = Field(default_factory=list)
    global_confidence: int = Field(ge=0, le=100)
    data_quality: str = Field(pattern="^(high|medium|low)$")


class MatchAnalysisResult(BaseModel):
    status: str = Field(pattern="^(success|failed)$")
    analysis: MatchAnalysis
    error: str | None = None
    llm_usage: dict[str, int] = Field(default_factory=dict)
    token_usage: dict[str, int] = Field(default_factory=dict)
    estimated_cost_usd: float | None = None
    duration_seconds: float | None = None
    retry_count: int | None = None
    prompt_size_chars: int | None = None


class AnalysisCandidate(BaseModel):
    candidate_id: str
    fixture_id: int
    event: str
    pick: str | None = None
    market: str
    market_canonical_id: str
    selection_canonical_id: str
    confidence_score: int = Field(ge=0, le=100)
    confidence_tier: str = Field(pattern="^(elite|very_strong|strong|medium|weak|very_weak)$")
    risk_level: str = Field(pattern="^(low|medium|high)$")
    reasoning: str
    data_quality: str = Field(pattern="^(high|medium|low)$")
    odds: float | None = None
    odds_source: str | None = None
    expected_odds_min: float | None = None
    expected_odds_max: float | None = None
    competition: str | None = None
    kickoff: str | None = None
    source_match_analysis_id: str
    source_status: str
    filter_reasons: list[str] = Field(default_factory=list)
    rejection_reasons: list[str] = Field(default_factory=list)

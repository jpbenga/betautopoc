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
    estimated_cost_usd: float | None = None

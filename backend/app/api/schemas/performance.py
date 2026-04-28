from __future__ import annotations

from pydantic import Field

from backend.app.api.schemas.common import ContractBaseModel


class PerformanceNoDataResponse(ContractBaseModel):
    status: str = "no_data"
    message: str = "No performance data available yet"
    data_source_mode: str = "run_artifacts"


class DistributionItem(ContractBaseModel):
    key: str
    count: int
    percent: float


class PerformanceSummaryResponse(ContractBaseModel):
    status: str
    total_runs: int
    total_tickets: int
    total_candidates: int
    filtered_candidates_count: int
    average_confidence_score: float | None = None
    average_confidence_score_filtered: float | None = None
    average_estimated_odds: float | None = None
    data_quality_distribution: list[DistributionItem] = Field(default_factory=list)
    confidence_tier_distribution: list[DistributionItem] = Field(default_factory=list)
    risk_level_distribution: list[DistributionItem] = Field(default_factory=list)
    metric_basis: str = "proxy_from_run_artifacts"


class PerformanceAccuracyResponse(ContractBaseModel):
    status: str
    accuracy_not_available_reason: str
    proxy_acceptance_rate: float | None = None
    total_candidates: int
    accepted_candidates: int
    metric_basis: str = "proxy_filtering_not_outcomes"


class PerformanceRoiResponse(ContractBaseModel):
    status: str
    message: str
    estimated_exposure: float | None = None
    estimated_potential_return: float | None = None
    simulated_pnl: float | None = None
    metric_basis: str = "no_real_settlement"


class CalibrationBucket(ContractBaseModel):
    bucket: str
    candidates_count: int
    filtered_count: int
    rejected_count: int
    filtered_rate: float
    metric_basis: str = "proxy_filtering_not_outcomes"


class PerformanceCalibrationResponse(ContractBaseModel):
    status: str
    message: str
    buckets: list[CalibrationBucket] = Field(default_factory=list)


class StrategyPerformanceItem(ContractBaseModel):
    strategy_key: str
    runs_count: int
    tickets_count: int
    avg_confidence: float | None = None
    avg_filtered_candidates: float | None = None
    avg_estimated_odds: float | None = None
    status: str = "proxy"


class StrategiesCompareResponse(ContractBaseModel):
    status: str
    strategies: list[StrategyPerformanceItem] = Field(default_factory=list)


class MarketPerformanceItem(ContractBaseModel):
    market: str
    candidates_count: int
    filtered_count: int
    rejected_count: int
    avg_confidence: float | None = None
    avg_estimated_odds: float | None = None
    filtered_rate: float
    status: str = "proxy"


class MarketsPerformanceResponse(ContractBaseModel):
    status: str
    markets: list[MarketPerformanceItem] = Field(default_factory=list)


class DriftSignal(ContractBaseModel):
    dimension: str
    status: str
    variation_score: float
    message: str


class PerformanceDriftResponse(ContractBaseModel):
    status: str
    message: str
    signals: list[DriftSignal] = Field(default_factory=list)


class PerformanceDataQualityResponse(ContractBaseModel):
    status: str
    data_quality_distribution: list[DistributionItem] = Field(default_factory=list)
    candidates_with_odds_percent: float
    missing_odds_rejected_percent: float
    completed_no_data_runs_percent: float
    metric_basis: str = "proxy_from_candidates_and_run_status"


class PerformanceLogEntry(ContractBaseModel):
    level: str
    message: str
    source: str = "performance_service"


class PerformanceLogsResponse(ContractBaseModel):
    status: str
    logs: list[PerformanceLogEntry] = Field(default_factory=list)

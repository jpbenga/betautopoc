from __future__ import annotations

from pydantic import Field

from backend.app.api.schemas.common import ContractBaseModel


class CostNoDataResponse(ContractBaseModel):
    status: str = "no_data"
    message: str = "No cost data available yet"
    data_source_mode: str = "run_artifacts"


class CostRunItem(ContractBaseModel):
    run_id: str
    target_date: str | None = None
    status: str | None = None
    started_at: str | None = None
    finished_at: str | None = None
    duration_seconds: int | None = None
    duration_label: str
    matches_analyzed_estimate: int
    estimated_tokens: int
    estimated_cost: float
    openai_estimated_cost: float
    api_football_estimated_cost: float
    browser_use_estimated_cost: float
    source_file: str
    data_source_mode: str = "run_artifacts"


class CostSummary(ContractBaseModel):
    status: str = "available"
    currency: str = "USD"
    total_cost_today: float
    total_cost_7d: float
    runs_count: int
    average_cost_per_run: float
    total_estimated_tokens: int
    estimation_method: str


class CostRunListResponse(ContractBaseModel):
    status: str = "available"
    runs: list[CostRunItem] = Field(default_factory=list)


class CostTrendPoint(ContractBaseModel):
    date: str
    cost: float


class CostTrendResponse(ContractBaseModel):
    status: str = "available"
    window: str
    points: list[CostTrendPoint] = Field(default_factory=list)


class CostBreakdownItem(ContractBaseModel):
    service: str
    estimated_requests: int
    estimated_cost: float
    average_cost_per_request: float
    status: str


class CostBreakdownResponse(ContractBaseModel):
    status: str = "available"
    services: list[CostBreakdownItem] = Field(default_factory=list)


class CostAlert(ContractBaseModel):
    level: str
    title: str
    detail: str
    metric: str
    threshold: float
    value: float


class CostAlertsResponse(ContractBaseModel):
    status: str = "available"
    alerts: list[CostAlert] = Field(default_factory=list)

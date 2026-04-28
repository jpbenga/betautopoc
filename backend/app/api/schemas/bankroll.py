from __future__ import annotations

from pydantic import Field

from backend.app.api.schemas.common import ContractBaseModel


class BankrollNoDataResponse(ContractBaseModel):
    status: str = "no_data"
    message: str = "No bankroll data available yet"
    data_source_mode: str = "run_artifacts"


class BankrollSummary(ContractBaseModel):
    status: str = "available"
    currency: str = "EUR"
    total_bankroll: float
    available_capital: float
    total_exposure: float
    exposure_percent: float
    estimated_roi: float
    simulated_pnl: float
    open_positions_count: int
    stake_per_ticket: float
    simulation_mode: str


class BankrollTrendPoint(ContractBaseModel):
    date: str
    bankroll: float
    exposure: float
    available_capital: float


class BankrollTrendResponse(ContractBaseModel):
    status: str = "available"
    window: str
    points: list[BankrollTrendPoint] = Field(default_factory=list)


class BankrollExposureItem(ContractBaseModel):
    ticket_id: str
    run_id: str
    target_date: str | None = None
    exposure: float
    bankroll_percent: float
    estimated_odds: float | None = None
    potential_return: float
    risk_level: str | None = None
    picks_count: int
    source_file: str
    data_source_mode: str = "run_artifacts"


class BankrollExposureResponse(ContractBaseModel):
    status: str = "available"
    total_exposure: float
    exposure_percent: float
    items: list[BankrollExposureItem] = Field(default_factory=list)


class OpenPosition(ContractBaseModel):
    position_id: str
    ticket_id: str
    run_id: str
    target_date: str | None = None
    stake: float
    estimated_odds: float | None = None
    potential_return: float
    status: str = "open"
    result_status: str = "no_result"
    risk_level: str | None = None
    picks_count: int
    source_file: str


class OpenPositionsResponse(ContractBaseModel):
    status: str = "available"
    positions: list[OpenPosition] = Field(default_factory=list)


class RiskLimit(ContractBaseModel):
    key: str
    value: float | int | str
    unit: str
    status: str


class RiskLimitsResponse(ContractBaseModel):
    status: str = "available"
    limits: list[RiskLimit] = Field(default_factory=list)


class BankrollAlert(ContractBaseModel):
    level: str
    title: str
    detail: str
    metric: str
    threshold: float
    value: float


class BankrollAlertsResponse(ContractBaseModel):
    status: str = "available"
    alerts: list[BankrollAlert] = Field(default_factory=list)

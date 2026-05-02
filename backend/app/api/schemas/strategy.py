from __future__ import annotations

from typing import Any

from pydantic import Field

from backend.app.api.schemas.common import ContractBaseModel


class StrategyCatalogItem(ContractBaseModel):
    strategy_file: str
    strategy_id: str | None = None
    name: str | None = None
    description: str | None = None
    enabled: bool | None = None
    active: bool = False
    valid: bool = True
    updated_at: str | None = None
    error: str | None = None


class StrategyDetailResponse(ContractBaseModel):
    status: str = "available"
    strategy_file: str
    strategy_id: str | None = None
    name: str | None = None
    description: str | None = None
    active: bool = False
    valid: bool = True
    errors: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    payload: dict[str, Any] = Field(default_factory=dict)
    resolved: dict[str, Any] | None = None
    state_file: str | None = None


class StrategyCatalogResponse(ContractBaseModel):
    status: str = "available"
    active_strategy_file: str
    state_file: str
    strategies: list[StrategyCatalogItem] = Field(default_factory=list)
    active_strategy: StrategyDetailResponse | None = None


class StrategyActivateRequest(ContractBaseModel):
    strategy_file: str


class StrategyActivateResponse(ContractBaseModel):
    status: str = "updated"
    active_strategy_file: str
    active_strategy: StrategyDetailResponse


class StrategySaveRequest(ContractBaseModel):
    strategy_file: str
    payload: dict[str, Any]
    activate: bool = False


class StrategySaveResponse(ContractBaseModel):
    status: str = "saved"
    strategy_file: str
    active_strategy_file: str
    strategy: StrategyDetailResponse


class StrategyApplyRequest(ContractBaseModel):
    run_id: str
    strategy_file: str | None = None
    selection_mode: str = "filter_and_select"


class StrategyApplyResponse(ContractBaseModel):
    status: str
    application_id: str
    run_id: str
    target_date: str | None = None
    strategy_file: str
    strategy_id: str | None = None
    selection_mode: str
    source_run_dir: str
    application_dir: str
    files: dict[str, str] = Field(default_factory=dict)
    aggregation_candidate_count: int = 0
    filtered_candidate_count: int = 0
    rejected_candidate_count: int = 0
    picks_count: int = 0
    estimated_combo_odds: float | None = None
    selection_status: str | None = None
    notes: list[str] = Field(default_factory=list)
    errors: list[str] = Field(default_factory=list)

from __future__ import annotations

from typing import Any

from pydantic import Field

from backend.app.api.schemas.common import ContractBaseModel


class RunRequest(ContractBaseModel):
    date: str | None = None
    force: bool = False
    strategy_file: str | None = None
    max_matches: int | None = None
    sleep_between_matches: float | None = None
    with_browser: bool | None = None


class RunStartResponse(ContractBaseModel):
    job_id: str
    status: str


class PickSummary(ContractBaseModel):
    pick_id: str | None = None
    event: str | None = None
    market: str | None = None
    pick: str | None = None
    confidence_score: int | None = None
    risk_level: str | None = None


class SelectionSummary(ContractBaseModel):
    picks: list[PickSummary] = Field(default_factory=list)
    estimated_combo_odds: float | None = None
    global_confidence_score: int | None = None
    combo_risk_level: str | None = None


class RunSummary(ContractBaseModel):
    run_id: str | None = None
    run_dir: str | None = None
    target_date: str | None = None
    status: str | None = None
    files: dict[str, Any] = Field(default_factory=dict)

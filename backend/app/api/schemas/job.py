from __future__ import annotations

from typing import Any, Literal

from pydantic import Field

from backend.app.api.schemas.common import ContractBaseModel

StepStatus = Literal["pending", "running", "done", "completed", "failed", "error", "skipped"]


class JobStep(ContractBaseModel):
    label: str
    status: StepStatus | str
    message: str | None = None
    updated_at: str | None = None


class JobLogEntry(ContractBaseModel):
    at: str | None = None
    message: str
    level: Literal["info", "success", "warning", "error"] | None = None


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


class JobResponse(ContractBaseModel):
    job_id: str
    status: str
    error: str | None = None
    created_at: str
    completed_at: str | None = None
    target_date: str | None = None
    steps: dict[str, JobStep] = Field(default_factory=dict)
    logs: list[JobLogEntry] = Field(default_factory=list)
    picks: Any = None
    verification: Any = None
    orchestrator_run_id: str | None = None
    orchestrator_run_dir: str | None = None
    run_summary: RunSummary | dict[str, Any] | None = None
    selection_file: str | None = None
    selection: Any = None

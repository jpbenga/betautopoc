from __future__ import annotations

from typing import Any

from pydantic import Field

from backend.app.api.schemas.common import ContractBaseModel


class AnalysisRunListItem(ContractBaseModel):
    run_id: str
    job_id: str
    status: str
    created_at: str
    completed_at: str | None = None
    target_date: str | None = None
    progress: int = 0
    step_count: int = 0
    completed_steps: int = 0
    failed_steps: int = 0
    picks_count: int | None = None
    orchestrator_run_id: str | None = None


class AnalysisTimelineStep(ContractBaseModel):
    id: str
    title: str
    status: str
    message: str | None = None
    updated_at: str | None = None


class AnalysisLogEntry(ContractBaseModel):
    at: str | None = None
    message: str
    level: str = "info"


class AnalysisRun(AnalysisRunListItem):
    error: str | None = None
    stop_requested: bool = False
    stop_requested_at: str | None = None
    steps: list[AnalysisTimelineStep] = Field(default_factory=list)
    logs: list[AnalysisLogEntry] = Field(default_factory=list)
    run_summary: dict[str, Any] | None = None
    selection: Any = None


class AnalysisRunArtifact(ContractBaseModel):
    name: str
    filename: str
    status: str
    path: str | None = None
    summary: dict[str, Any] = Field(default_factory=dict)
    data: Any = None
    error: str | None = None


class AnalysisRunOutputs(ContractBaseModel):
    run_id: str
    job_id: str
    orchestrator_run_id: str | None = None
    run_dir: str | None = None
    progress: dict[str, Any] = Field(default_factory=dict)
    artifacts: dict[str, AnalysisRunArtifact] = Field(default_factory=dict)

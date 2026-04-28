from __future__ import annotations

from pydantic import Field

from backend.app.api.schemas.common import ContractBaseModel


class AgentsNoDataResponse(ContractBaseModel):
    status: str = "no_data"
    message: str = "No agent data available yet"
    data_source_mode: str = "run_artifacts"


class AgentSummary(ContractBaseModel):
    agent_id: str
    label: str
    status: str
    current_job_id: str | None = None
    last_activity_at: str | None = None
    last_message: str | None = None
    jobs_processed_count: int = 0
    error_count: int = 0
    source_mode: str = "jobs_and_run_artifacts"


class AgentListResponse(ContractBaseModel):
    status: str = "available"
    agents: list[AgentSummary] = Field(default_factory=list)


class AgentJob(ContractBaseModel):
    job_id: str
    run_id: str | None = None
    agent_id: str
    target_date: str | None = None
    status: str
    started_at: str | None = None
    finished_at: str | None = None
    current_step: str | None = None
    last_message: str | None = None
    source_mode: str = "jobs_and_run_artifacts"


class AgentDetail(AgentSummary):
    jobs: list[AgentJob] = Field(default_factory=list)


class AgentJobsResponse(ContractBaseModel):
    status: str = "available"
    jobs: list[AgentJob] = Field(default_factory=list)


class AgentLogEntry(ContractBaseModel):
    at: str | None = None
    agent_id: str
    job_id: str | None = None
    level: str = "info"
    message: str
    source_mode: str = "jobs"


class AgentLogsResponse(ContractBaseModel):
    status: str = "available"
    logs: list[AgentLogEntry] = Field(default_factory=list)


class AgentResourcesResponse(ContractBaseModel):
    status: str = "available"
    cpu_usage: int
    memory_usage: int
    jobs_running: int
    active_sessions: int
    source_mode: str = "simulated_from_jobs"
    message: str = "Simulated resources derived from pipeline run activity"


class BrowserSession(ContractBaseModel):
    session_id: str
    status: str
    reason: str
    source_mode: str = "placeholder"


class BrowserSessionsResponse(ContractBaseModel):
    status: str = "disabled"
    reason: str = "Browser Use is not implemented in orchestrator API mode"
    sessions: list[BrowserSession] = Field(default_factory=list)

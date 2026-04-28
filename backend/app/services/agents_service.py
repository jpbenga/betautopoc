from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from backend.app.api.schemas.agents import (
    AgentDetail,
    AgentJob,
    AgentListResponse,
    AgentLogEntry,
    AgentLogsResponse,
    AgentResourcesResponse,
    AgentSummary,
    AgentsNoDataResponse,
    BrowserSession,
    BrowserSessionsResponse,
    AgentJobsResponse,
)
from backend.app.core.paths import REPO_ROOT
from backend.app.services.job_service import JOBS
from betauto.runtime_mode import ensure_latest_allowed

ORCHESTRATOR_RUNS_DIR = REPO_ROOT / "data" / "orchestrator_runs"

AGENT_LABELS = {
    "orchestrator": "Orchestrator",
    "analysis": "Analysis Agent",
    "aggregation": "Aggregation Agent",
    "filtering": "Filtering Agent",
    "selection": "Selection Agent",
    "browser_use": "Browser Use Agent",
    "ticketing": "Ticketing Agent",
}

STEP_TO_AGENT = {
    "analysis_context": "orchestrator",
    "cache": "orchestrator",
    "match_analysis": "analysis",
    "analysis": "analysis",
    "aggregation": "aggregation",
    "filtering": "filtering",
    "selection": "selection",
    "unibet": "browser_use",
}

RUNNING = {"running", "active", "pending"}
DONE = {"done", "completed", "success", "succeeded", "skipped", "completed_no_data"}
FAILED = {"failed", "error"}


def _summary_files() -> list[Path]:
    if not ORCHESTRATOR_RUNS_DIR.exists():
        return []
    return sorted(
        ORCHESTRATOR_RUNS_DIR.glob("*/run_summary.json"),
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )


def _read_summary(path: Path) -> dict[str, Any]:
    ensure_latest_allowed(path)
    return json.loads(path.read_text(encoding="utf-8"))


def _has_data() -> bool:
    return bool(JOBS) or bool(_summary_files())


def _level(status: str) -> str:
    lowered = status.lower()
    if lowered in FAILED:
        return "failed"
    if lowered in RUNNING:
        return "running"
    if lowered in DONE:
        return "completed"
    return "idle"


def _agent_status(statuses: list[str], *, disabled: bool = False) -> str:
    if disabled:
        return "disabled"
    levels = {_level(status) for status in statuses}
    if "failed" in levels:
        return "failed"
    if "running" in levels:
        return "running"
    if "completed" in levels:
        return "completed"
    return "idle"


def _last_log(job: dict[str, Any]) -> dict[str, Any] | None:
    logs = job.get("logs")
    if isinstance(logs, list) and logs:
        latest = logs[-1]
        return latest if isinstance(latest, dict) else None
    return None


def _step_agent(step_id: str) -> str:
    return STEP_TO_AGENT.get(step_id, step_id)


def _job_items_from_memory() -> list[AgentJob]:
    items: list[AgentJob] = []
    for job in JOBS.values():
        steps = job.get("steps") if isinstance(job.get("steps"), dict) else {}
        for step_id, step in steps.items():
            if not isinstance(step, dict):
                continue
            agent_id = _step_agent(str(step_id))
            items.append(
                AgentJob(
                    job_id=str(job.get("job_id") or ""),
                    run_id=job.get("orchestrator_run_id"),
                    agent_id=agent_id,
                    target_date=job.get("target_date"),
                    status=str(step.get("status") or job.get("status") or "unknown"),
                    started_at=job.get("created_at"),
                    finished_at=job.get("completed_at"),
                    current_step=str(step_id),
                    last_message=step.get("message"),
                    source_mode="jobs",
                )
            )
        selection = job.get("selection")
        if isinstance(selection, dict):
            items.append(
                AgentJob(
                    job_id=str(job.get("job_id") or ""),
                    run_id=job.get("orchestrator_run_id"),
                    agent_id="ticketing",
                    target_date=job.get("target_date"),
                    status=str(job.get("status") or "unknown"),
                    started_at=job.get("created_at"),
                    finished_at=job.get("completed_at"),
                    current_step="ticket_projection",
                    last_message="Ticket projection derived from selection output",
                    source_mode="jobs",
                )
            )
    return items


def _job_items_from_summaries() -> list[AgentJob]:
    items: list[AgentJob] = []
    for path in _summary_files():
        try:
            summary = _read_summary(path)
        except (json.JSONDecodeError, OSError, RuntimeError):
            continue
        run_id = str(summary.get("run_id") or path.parent.name)
        steps = summary.get("steps") if isinstance(summary.get("steps"), dict) else {}
        for step_id, status in steps.items():
            agent_id = _step_agent(str(step_id))
            items.append(
                AgentJob(
                    job_id=run_id,
                    run_id=run_id,
                    agent_id=agent_id,
                    target_date=summary.get("target_date"),
                    status=str(status or summary.get("status") or "unknown"),
                    started_at=summary.get("started_at"),
                    finished_at=summary.get("finished_at"),
                    current_step=str(step_id),
                    last_message=f"{step_id}: {status}",
                    source_mode="run_artifacts",
                )
            )
        if isinstance(summary.get("selection"), dict):
            items.append(
                AgentJob(
                    job_id=run_id,
                    run_id=run_id,
                    agent_id="ticketing",
                    target_date=summary.get("target_date"),
                    status=str(summary.get("status") or "unknown"),
                    started_at=summary.get("started_at"),
                    finished_at=summary.get("finished_at"),
                    current_step="ticket_projection",
                    last_message="Ticket projection derived from selection output",
                    source_mode="run_artifacts",
                )
            )
    return items


def list_agent_jobs() -> list[AgentJob]:
    jobs = _job_items_from_memory() + _job_items_from_summaries()
    return sorted(jobs, key=lambda item: item.started_at or "", reverse=True)


def _agent_logs_from_memory() -> list[AgentLogEntry]:
    entries: list[AgentLogEntry] = []
    for job in JOBS.values():
        job_id = str(job.get("job_id") or "")
        logs = job.get("logs") if isinstance(job.get("logs"), list) else []
        for entry in logs:
            if not isinstance(entry, dict):
                continue
            message = str(entry.get("message") or "")
            entries.append(
                AgentLogEntry(
                    at=entry.get("at"),
                    agent_id=_agent_from_message(message),
                    job_id=job_id,
                    level=_log_level(message),
                    message=message,
                    source_mode="jobs",
                )
            )
    return sorted(entries, key=lambda item: item.at or "", reverse=True)


def _agent_logs_from_summaries() -> list[AgentLogEntry]:
    entries: list[AgentLogEntry] = []
    for path in _summary_files():
        try:
            summary = _read_summary(path)
        except (json.JSONDecodeError, OSError, RuntimeError):
            continue
        run_id = str(summary.get("run_id") or path.parent.name)
        steps = summary.get("steps") if isinstance(summary.get("steps"), dict) else {}
        for step_id, status in steps.items():
            agent_id = _step_agent(str(step_id))
            message = f"[{agent_id}] {step_id}: {status}"
            entries.append(
                AgentLogEntry(
                    at=summary.get("finished_at") or summary.get("started_at"),
                    agent_id=agent_id,
                    job_id=run_id,
                    level=_log_level(message),
                    message=message,
                    source_mode="run_artifacts",
                )
            )
    return entries


def _agent_from_message(message: str) -> str:
    lowered = message.lower()
    if "aggregation" in lowered or "agrégation" in lowered:
        return "aggregation"
    if "filtrage" in lowered or "filter" in lowered:
        return "filtering"
    if "sélection" in lowered or "selection" in lowered:
        return "selection"
    if "browser" in lowered or "unibet" in lowered:
        return "browser_use"
    if "ticket" in lowered:
        return "ticketing"
    if "analysis" in lowered or "analyse" in lowered:
        return "analysis"
    return "orchestrator"


def _log_level(message: str) -> str:
    lowered = message.lower()
    if "erreur" in lowered or "error" in lowered or "failed" in lowered:
        return "error"
    if "warning" in lowered or "warn" in lowered or "skipped" in lowered:
        return "warning"
    if "terminé" in lowered or "completed" in lowered or "done" in lowered:
        return "success"
    return "info"


def _agent_summary(agent_id: str, jobs: list[AgentJob]) -> AgentSummary:
    agent_jobs = [job for job in jobs if job.agent_id == agent_id]
    statuses = [job.status for job in agent_jobs]
    current = next((job for job in agent_jobs if _level(job.status) == "running"), None)
    latest = agent_jobs[0] if agent_jobs else None
    return AgentSummary(
        agent_id=agent_id,
        label=AGENT_LABELS[agent_id],
        status=_agent_status(statuses, disabled=agent_id == "browser_use"),
        current_job_id=current.job_id if current else None,
        last_activity_at=(latest.finished_at or latest.started_at) if latest else None,
        last_message=latest.last_message if latest else ("Browser Use disabled in orchestrator API mode" if agent_id == "browser_use" else None),
        jobs_processed_count=len([job for job in agent_jobs if _level(job.status) in {"completed", "failed"}]),
        error_count=len([job for job in agent_jobs if _level(job.status) == "failed"]),
        source_mode="jobs_and_run_artifacts",
    )


def agents_response() -> AgentListResponse | AgentsNoDataResponse:
    if not _has_data():
        return AgentsNoDataResponse()
    jobs = list_agent_jobs()
    return AgentListResponse(agents=[_agent_summary(agent_id, jobs) for agent_id in AGENT_LABELS])


def agent_detail(agent_id: str) -> AgentDetail | None:
    if agent_id not in AGENT_LABELS:
        return None
    jobs = [job for job in list_agent_jobs() if job.agent_id == agent_id]
    summary = _agent_summary(agent_id, list_agent_jobs())
    return AgentDetail(**summary.model_dump(), jobs=jobs[:20])


def jobs_response() -> AgentJobsResponse | AgentsNoDataResponse:
    jobs = list_agent_jobs()
    if not jobs:
        return AgentsNoDataResponse(message="No agent jobs available yet")
    return AgentJobsResponse(jobs=jobs[:100])


def logs_response() -> AgentLogsResponse | AgentsNoDataResponse:
    logs = sorted(_agent_logs_from_memory() + _agent_logs_from_summaries(), key=lambda item: item.at or "", reverse=True)
    if not logs:
        return AgentsNoDataResponse(message="No agent logs available yet", data_source_mode="jobs")
    return AgentLogsResponse(logs=logs[:200])


def resources_response() -> AgentResourcesResponse | AgentsNoDataResponse:
    if not _has_data():
        return AgentsNoDataResponse(message="No agent resources available yet", data_source_mode="jobs_and_run_artifacts")
    jobs = list_agent_jobs()
    running = len([job for job in jobs if _level(job.status) == "running"])
    active_sessions = 0
    cpu = min(95, 12 + running * 18 + len(JOBS) * 3)
    memory = min(8192, 384 + running * 256 + len(JOBS) * 48)
    return AgentResourcesResponse(
        cpu_usage=cpu,
        memory_usage=memory,
        jobs_running=running,
        active_sessions=active_sessions,
    )


def browser_sessions_response() -> BrowserSessionsResponse:
    return BrowserSessionsResponse(
        sessions=[
            BrowserSession(
                session_id="browser_use_disabled",
                status="disabled",
                reason="not implemented in orchestrator api mode",
            )
        ]
    )

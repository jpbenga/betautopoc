from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException, Query

from backend.app.api.schemas.analysis import (
    AnalysisLogEntry,
    AnalysisRun,
    AnalysisRunListItem,
    AnalysisTimelineStep,
)
from backend.app.services.job_service import JOBS, get_job

router = APIRouter(prefix="/api/analysis", tags=["analysis"])

COMPLETED_STATUSES = {"done", "completed", "success", "succeeded", "skipped"}
FAILED_STATUSES = {"failed", "error"}


def _steps(job: dict[str, Any]) -> list[AnalysisTimelineStep]:
    steps = job.get("steps") or {}
    return [
        AnalysisTimelineStep(
            id=step_id,
            title=str(step.get("label") or step_id),
            status=str(step.get("status") or "pending"),
            message=step.get("message"),
            updated_at=step.get("updated_at"),
        )
        for step_id, step in steps.items()
        if isinstance(step, dict)
    ]


def _logs(job: dict[str, Any]) -> list[AnalysisLogEntry]:
    logs = job.get("logs") or []
    return [
        AnalysisLogEntry(
            at=entry.get("at"),
            message=str(entry.get("message") or ""),
            level=str(entry.get("level") or _level_from_message(str(entry.get("message") or ""))),
        )
        for entry in logs
        if isinstance(entry, dict)
    ]


def _level_from_message(message: str) -> str:
    lowered = message.lower()
    if "erreur" in lowered or "error" in lowered or "failed" in lowered:
        return "error"
    if "warning" in lowered or "warn" in lowered:
        return "warning"
    if "terminé" in lowered or "completed" in lowered or "done" in lowered:
        return "success"
    return "info"


def _picks_count(job: dict[str, Any]) -> int | None:
    picks = job.get("picks")
    if isinstance(picks, list):
        return len(picks)
    if isinstance(picks, dict) and isinstance(picks.get("picks"), list):
        return len(picks["picks"])

    selection = job.get("selection")
    if isinstance(selection, dict) and isinstance(selection.get("picks"), list):
        return len(selection["picks"])

    return None


def _progress(timeline: list[AnalysisTimelineStep]) -> tuple[int, int, int, int]:
    step_count = len(timeline)
    if step_count == 0:
        return 0, 0, 0, 0

    completed_steps = sum(1 for step in timeline if step.status.lower() in COMPLETED_STATUSES)
    failed_steps = sum(1 for step in timeline if step.status.lower() in FAILED_STATUSES)
    progress = round((completed_steps / step_count) * 100)
    return progress, step_count, completed_steps, failed_steps


def _list_item(job: dict[str, Any]) -> AnalysisRunListItem:
    timeline = _steps(job)
    progress, step_count, completed_steps, failed_steps = _progress(timeline)
    job_id = str(job["job_id"])
    return AnalysisRunListItem(
        run_id=job_id,
        job_id=job_id,
        status=str(job.get("status") or "unknown"),
        created_at=str(job.get("created_at") or ""),
        completed_at=job.get("completed_at"),
        target_date=job.get("target_date"),
        progress=progress,
        step_count=step_count,
        completed_steps=completed_steps,
        failed_steps=failed_steps,
        picks_count=_picks_count(job),
        orchestrator_run_id=job.get("orchestrator_run_id"),
    )


def _analysis_run(job: dict[str, Any]) -> AnalysisRun:
    item = _list_item(job)
    return AnalysisRun(
        **item.model_dump(),
        error=job.get("error"),
        steps=_steps(job),
        logs=_logs(job),
        run_summary=job.get("run_summary"),
        selection=job.get("selection"),
    )


@router.get("/runs", response_model=list[AnalysisRunListItem])
async def list_analysis_runs():
    return sorted(
        (_list_item(job) for job in JOBS.values()),
        key=lambda run: run.created_at,
        reverse=True,
    )


@router.get("/runs/{run_id}", response_model=AnalysisRun)
async def get_analysis_run(run_id: str):
    job = get_job(run_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Run introuvable.")
    return _analysis_run(job)


@router.get("/runs/{run_id}/timeline", response_model=list[AnalysisTimelineStep])
async def get_analysis_timeline(run_id: str):
    job = get_job(run_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Run introuvable.")
    return _steps(job)


@router.get("/logs", response_model=list[AnalysisLogEntry])
async def get_analysis_logs(run_id: str | None = Query(default=None)):
    if run_id is None:
        logs: list[AnalysisLogEntry] = []
        for job in JOBS.values():
            logs.extend(_logs(job))
        return logs

    job = get_job(run_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Run introuvable.")
    return _logs(job)

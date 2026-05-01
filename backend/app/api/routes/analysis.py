from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from fastapi import APIRouter, HTTPException, Query

from backend.app.api.schemas.analysis import (
    AnalysisRunArtifact,
    AnalysisRunOutputs,
    AnalysisLogEntry,
    AnalysisRun,
    AnalysisRunListItem,
    AnalysisTimelineStep,
)
from backend.app.core.paths import REPO_ROOT
from backend.app.services.job_service import JOBS, get_job, request_stop

router = APIRouter(prefix="/api/analysis", tags=["analysis"])

COMPLETED_STATUSES = {"done", "completed", "success", "succeeded", "skipped", "stopped"}
FAILED_STATUSES = {"failed", "error"}
ORCHESTRATOR_RUNS_DIR = REPO_ROOT / "data" / "orchestrator_runs"
RUN_OUTPUT_FILES = {
    "match_analysis": "match_analysis.json",
    "aggregation_candidates": "aggregation_candidates.json",
    "filtered_candidates": "filtered_candidates.json",
    "selection": "selection.json",
}


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
    if "stop" in lowered or "interrupted" in lowered:
        return "warning"
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
        stop_requested=bool(job.get("stop_requested")),
        stop_requested_at=job.get("stop_requested_at"),
        steps=_steps(job),
        logs=_logs(job),
        run_summary=job.get("run_summary"),
        selection=job.get("selection"),
    )


def _safe_run_dir(job: dict[str, Any]) -> Path | None:
    raw = job.get("orchestrator_run_dir")
    if not raw and isinstance(job.get("run_summary"), dict):
        raw = job["run_summary"].get("run_dir")
    if not raw and job.get("orchestrator_run_id"):
        raw = ORCHESTRATOR_RUNS_DIR / str(job["orchestrator_run_id"])
    if not raw:
        return None

    path = Path(str(raw))
    if not path.is_absolute():
        path = REPO_ROOT / path
    try:
        resolved = path.resolve()
        resolved.relative_to(ORCHESTRATOR_RUNS_DIR.resolve())
    except ValueError:
        return None
    return resolved if resolved.exists() and resolved.is_dir() else None


def _artifact_summary(name: str, payload: Any) -> dict[str, Any]:
    if not isinstance(payload, dict):
        return {}
    if name == "match_analysis":
        results = payload.get("results") if isinstance(payload.get("results"), list) else []
        return {
            "generated_at": payload.get("generated_at"),
            "target_date": payload.get("target_date"),
            "match_count": len(results),
            "stats": payload.get("stats") if isinstance(payload.get("stats"), dict) else {},
        }
    if name == "aggregation_candidates":
        candidates = payload.get("candidates") if isinstance(payload.get("candidates"), list) else []
        return {
            "generated_at": payload.get("generated_at"),
            "target_date": payload.get("target_date"),
            "status": payload.get("status"),
            "candidate_count": payload.get("candidate_count", len(candidates)),
            "error_count": len(payload.get("errors") or []) if isinstance(payload.get("errors"), list) else 0,
        }
    if name == "filtered_candidates":
        candidates = payload.get("candidates") if isinstance(payload.get("candidates"), list) else []
        rejected = payload.get("rejected_candidates") if isinstance(payload.get("rejected_candidates"), list) else []
        return {
            "generated_at": payload.get("generated_at"),
            "target_date": payload.get("target_date"),
            "status": payload.get("status"),
            "candidate_count": payload.get("candidate_count", len(candidates)),
            "rejected_count": payload.get("rejected_count", len(rejected)),
            "filter_config": payload.get("filter_config") if isinstance(payload.get("filter_config"), dict) else {},
        }
    if name == "selection":
        picks = payload.get("picks") if isinstance(payload.get("picks"), list) else []
        return {
            "generated_at": payload.get("generated_at"),
            "status": payload.get("status"),
            "picks_count": len(picks),
            "estimated_combo_odds": payload.get("estimated_combo_odds"),
            "global_confidence_score": payload.get("global_confidence_score"),
            "combo_risk_level": payload.get("combo_risk_level"),
            "notes_count": len(payload.get("notes") or []) if isinstance(payload.get("notes"), list) else 0,
            "errors_count": len(payload.get("errors") or []) if isinstance(payload.get("errors"), list) else 0,
        }
    return {}


def _read_artifact(run_dir: Path, name: str, filename: str) -> AnalysisRunArtifact:
    path = run_dir / filename
    if not path.exists():
        return AnalysisRunArtifact(name=name, filename=filename, status="missing")
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:  # noqa: BLE001
        return AnalysisRunArtifact(
            name=name,
            filename=filename,
            status="error",
            path=str(path.relative_to(REPO_ROOT)),
            error=str(exc),
        )
    return AnalysisRunArtifact(
        name=name,
        filename=filename,
        status="available",
        path=str(path.relative_to(REPO_ROOT)),
        summary=_artifact_summary(name, payload),
        data=payload,
    )


def _read_json_file(path: Path) -> dict[str, Any]:
    if not path.exists():
        return {}
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except Exception:  # noqa: BLE001
        return {}
    return payload if isinstance(payload, dict) else {}


def _match_label(match: dict[str, Any]) -> str:
    home = (match.get("home_team") or {}).get("name") or "Home"
    away = (match.get("away_team") or {}).get("name") or "Away"
    return f"{home} vs {away}"


def _outputs_progress(run_dir: Path | None) -> dict[str, Any]:
    if run_dir is None:
        return {}
    context = _read_json_file(run_dir / "analysis_context.json")
    analysis = _read_json_file(run_dir / "match_analysis.json")
    matches = context.get("matches") if isinstance(context.get("matches"), list) else []
    results = analysis.get("results") if isinstance(analysis.get("results"), list) else []
    stats = analysis.get("stats") if isinstance(analysis.get("stats"), dict) else {}
    result_by_fixture: dict[str, dict[str, Any]] = {}
    for result in results:
        if not isinstance(result, dict):
            continue
        analysis_payload = result.get("analysis") if isinstance(result.get("analysis"), dict) else {}
        fixture_id = result.get("fixture_id") or analysis_payload.get("fixture_id")
        if fixture_id is not None:
            result_by_fixture[str(fixture_id)] = result

    current_fixture_id = stats.get("current_fixture_id")
    rows: list[dict[str, Any]] = []
    for index, match in enumerate(matches, start=1):
        if not isinstance(match, dict):
            continue
        fixture_id = match.get("fixture_id")
        result = result_by_fixture.get(str(fixture_id))
        status = "pending"
        if result:
            status = "completed" if str(result.get("status") or "").lower() == "success" else "failed"
        elif current_fixture_id is not None and str(fixture_id) == str(current_fixture_id):
            status = "running"
        rows.append(
            {
                "index": index,
                "fixture_id": fixture_id,
                "status": status,
                "competition": match.get("competition"),
                "event": _match_label(match),
                "kickoff": match.get("kickoff_time"),
            }
        )

    completed = sum(1 for row in rows if row["status"] == "completed")
    failed = sum(1 for row in rows if row["status"] == "failed")
    running = sum(1 for row in rows if row["status"] == "running")
    pending = sum(1 for row in rows if row["status"] == "pending")
    return {
        "total_matches": len(rows),
        "analyzed_matches": completed + failed,
        "completed_matches": completed,
        "failed_matches": failed,
        "running_matches": running,
        "pending_matches": pending,
        "current_fixture_id": current_fixture_id,
        "current_match_label": stats.get("current_match_label"),
        "status": analysis.get("status") or ("running" if running else "pending"),
        "partial": bool(analysis.get("partial")),
        "upstream_trace": analysis.get("upstream_trace") if isinstance(analysis.get("upstream_trace"), dict) else {},
        "matches": rows,
    }


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


@router.get("/runs/{run_id}/outputs", response_model=AnalysisRunOutputs)
async def get_analysis_run_outputs(run_id: str):
    job = get_job(run_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Run introuvable.")

    run_dir = _safe_run_dir(job)
    artifacts = {
        name: _read_artifact(run_dir, name, filename)
        if run_dir
        else AnalysisRunArtifact(
            name=name,
            filename=filename,
            status="missing",
            error="Run directory unavailable for this job.",
        )
        for name, filename in RUN_OUTPUT_FILES.items()
    }
    return AnalysisRunOutputs(
        run_id=run_id,
        job_id=str(job.get("job_id") or run_id),
        orchestrator_run_id=job.get("orchestrator_run_id"),
        run_dir=str(run_dir.relative_to(REPO_ROOT)) if run_dir else None,
        progress=_outputs_progress(run_dir),
        artifacts=artifacts,
    )


@router.post("/runs/{run_id}/stop")
async def stop_analysis_run(run_id: str):
    job = get_job(run_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Run introuvable.")
    status = str(job.get("status") or "").lower()
    if status not in {"running", "active", "pending"}:
        return {"run_id": run_id, "status": str(job.get("status") or "unknown"), "stop_requested": False}
    request_stop(run_id)
    return {"run_id": run_id, "status": "stop_requested", "stop_requested": True}


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

from __future__ import annotations

import json
from datetime import datetime, timezone
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

COMPLETED_STATUSES = {
    "done",
    "completed",
    "success",
    "succeeded",
    "skipped",
    "stopped",
    "completed_filter_only",
}
FAILED_STATUSES = {"failed", "error", "completed_with_errors"}
ORCHESTRATOR_RUNS_DIR = REPO_ROOT / "data" / "orchestrator_runs"
STRATEGY_APPLICATIONS_INDEX = "strategy_applications.json"
RUN_OUTPUT_FILES = {
    "analysis_context": "analysis_context.json",
    "match_analysis": "match_analysis.json",
    "aggregation_candidates": "aggregation_candidates.json",
    "filtered_candidates": "filtered_candidates.json",
    "resolved_strategy": "resolved_strategy.json",
    "strategy_applications": STRATEGY_APPLICATIONS_INDEX,
    "selection": "selection.json",
}
ARCHIVE_STEP_LABELS = {
    "analysis_context": "Contexte analyse",
    "match_analysis": "Analyse GPT",
    "aggregation": "Agrégation candidats",
    "filtering": "Filtrage candidats",
    "selection": "Sélection ticket",
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


def _summary_files() -> list[Path]:
    if not ORCHESTRATOR_RUNS_DIR.exists():
        return []
    return sorted(
        ORCHESTRATOR_RUNS_DIR.glob("*/run_summary.json"),
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )


def _read_summary(path: Path) -> dict[str, Any]:
    try:
        payload = json.loads(path.read_text(encoding="utf-8"))
    except Exception:  # noqa: BLE001
        return {}
    return payload if isinstance(payload, dict) else {}


def _archive_run_dir(run_id: str) -> Path | None:
    if Path(run_id).name != run_id:
        return None
    path = ORCHESTRATOR_RUNS_DIR / run_id
    try:
        resolved = path.resolve()
        resolved.relative_to(ORCHESTRATOR_RUNS_DIR.resolve())
    except ValueError:
        return None
    return resolved if resolved.exists() and resolved.is_dir() else None


def _archive_summary(run_id: str) -> dict[str, Any] | None:
    run_dir = _archive_run_dir(run_id)
    if run_dir is None:
        return None
    summary = _read_summary(run_dir / "run_summary.json")
    return summary or None


def _strategy_application_status(application: dict[str, Any]) -> str:
    status = str(application.get("status") or "completed")
    selection_status = str(application.get("selection_status") or "").lower()
    errors = application.get("errors") if isinstance(application.get("errors"), list) else []
    if errors or selection_status in {"failed", "error"}:
        return "completed_with_errors"
    if selection_status == "skipped" and status == "completed":
        return "completed_filter_only"
    return status


def _archive_steps(summary: dict[str, Any]) -> list[AnalysisTimelineStep]:
    raw_steps = summary.get("steps") if isinstance(summary.get("steps"), dict) else {}
    steps: list[AnalysisTimelineStep] = []
    for step_id, status in raw_steps.items():
        steps.append(
            AnalysisTimelineStep(
                id=str(step_id),
                title=ARCHIVE_STEP_LABELS.get(str(step_id), str(step_id).replace("_", " ").title()),
                status=str(status or "unknown"),
                message=f"Artefact sauvegardé: {status}",
                updated_at=summary.get("finished_at") or summary.get("started_at"),
            )
        )
    run_dir = _archive_run_dir(str(summary.get("run_id") or ""))
    applications_payload = _read_json_file(run_dir / STRATEGY_APPLICATIONS_INDEX) if run_dir else {}
    applications = (
        applications_payload.get("applications")
        if isinstance(applications_payload.get("applications"), list)
        else []
    )
    for application in applications[:5]:
        if not isinstance(application, dict):
            continue
        steps.append(
            AnalysisTimelineStep(
                id=f"strategy_application:{application.get('application_id')}",
                title=f"Application stratégie · {application.get('strategy_id') or 'strategy'}",
                status=_strategy_application_status(application),
                message=(
                    f"{application.get('filtered_candidate_count', 0)} candidats retenus, "
                    f"{application.get('picks_count', 0)} pick(s), "
                    f"selection={application.get('selection_status') or 'unknown'}"
                ),
                updated_at=application.get("generated_at"),
            )
        )
    return steps


def _archive_picks_count(summary: dict[str, Any]) -> int | None:
    selection = summary.get("selection") if isinstance(summary.get("selection"), dict) else {}
    picks = selection.get("picks") if isinstance(selection.get("picks"), list) else None
    return len(picks) if picks is not None else None


def _archive_list_item(summary: dict[str, Any], path: Path) -> AnalysisRunListItem:
    timeline = _archive_steps(summary)
    progress, step_count, completed_steps, failed_steps = _progress(timeline)
    run_id = str(summary.get("run_id") or path.parent.name)
    return AnalysisRunListItem(
        run_id=run_id,
        job_id=run_id,
        status=str(summary.get("status") or "archived"),
        created_at=str(summary.get("started_at") or datetime_from_mtime(path)),
        completed_at=summary.get("finished_at"),
        target_date=summary.get("target_date"),
        progress=progress,
        step_count=step_count,
        completed_steps=completed_steps,
        failed_steps=failed_steps,
        picks_count=_archive_picks_count(summary),
        orchestrator_run_id=run_id,
    )


def datetime_from_mtime(path: Path) -> str:
    return datetime.fromtimestamp(path.stat().st_mtime, tz=timezone.utc).replace(microsecond=0).isoformat().replace(
        "+00:00", "Z"
    )


def _archive_analysis_run(run_id: str, summary: dict[str, Any], path: Path) -> AnalysisRun:
    item = _archive_list_item(summary, path)
    logs = [
        AnalysisLogEntry(
            at=summary.get("finished_at") or summary.get("started_at"),
            message="Archived run loaded from data/orchestrator_runs.",
            level="info",
        )
    ]
    selection = summary.get("selection") if isinstance(summary.get("selection"), dict) else None
    if selection and selection.get("errors"):
        logs.append(
            AnalysisLogEntry(
                at=selection.get("generated_at"),
                message="Selection contains errors; inspect selection.json.",
                level="warning",
            )
        )
    applications_payload = _read_json_file(path.parent / STRATEGY_APPLICATIONS_INDEX)
    applications = (
        applications_payload.get("applications")
        if isinstance(applications_payload.get("applications"), list)
        else []
    )
    for application in applications[:10]:
        if not isinstance(application, dict):
            continue
        level = "error" if application.get("errors") else "success"
        logs.append(
            AnalysisLogEntry(
                at=application.get("generated_at"),
                message=(
                    f"Strategy application {application.get('application_id')} "
                    f"({application.get('strategy_id')}) finished with status={_strategy_application_status(application)}; "
                    f"filtered={application.get('filtered_candidate_count')} picks={application.get('picks_count')}"
                ),
                level=level,
            )
        )
    return AnalysisRun(
        **item.model_dump(),
        error=summary.get("error"),
        stop_requested=False,
        stop_requested_at=None,
        steps=_archive_steps(summary),
        logs=logs,
        run_summary=summary,
        selection=selection,
    )


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
    if name == "analysis_context":
        matches = payload.get("matches") if isinstance(payload.get("matches"), list) else []
        trace = payload.get("pipeline_trace") if isinstance(payload.get("pipeline_trace"), dict) else {}
        return {
            "target_date": payload.get("target_date"),
            "matches_count": len(matches),
            "fixtures_fetched_total": trace.get("fixtures_fetched_total"),
            "fixtures_in_context_count": trace.get("fixtures_in_context_count"),
            "matches_skipped_count": trace.get("matches_skipped_count"),
        }
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
    if name == "resolved_strategy":
        return {
            "strategy_id": payload.get("strategy_id"),
            "enabled": payload.get("enabled"),
            "sports_allowed": payload.get("sports_allowed"),
            "max_picks": payload.get("max_picks"),
            "combo_min_odds": payload.get("combo_min_odds"),
            "combo_max_odds": payload.get("combo_max_odds"),
        }
    if name == "strategy_applications":
        applications = payload.get("applications") if isinstance(payload.get("applications"), list) else []
        latest = applications[0] if applications and isinstance(applications[0], dict) else {}
        return {
            "status": payload.get("status"),
            "applications_count": len(applications),
            "latest_application_id": latest.get("application_id"),
            "latest_strategy_id": latest.get("strategy_id"),
            "latest_filtered_candidate_count": latest.get("filtered_candidate_count"),
            "latest_picks_count": latest.get("picks_count"),
            "latest_status": _strategy_application_status(latest) if latest else None,
            "latest_selection_status": latest.get("selection_status"),
            "latest_errors_count": len(latest.get("errors") or []) if isinstance(latest.get("errors"), list) else 0,
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
    live_items = [_list_item(job) for job in JOBS.values()]
    live_job_ids = {item.job_id for item in live_items}
    live_orchestrator_ids = {item.orchestrator_run_id for item in live_items if item.orchestrator_run_id}
    archived_items: list[AnalysisRunListItem] = []
    for path in _summary_files():
        summary = _read_summary(path)
        run_id = str(summary.get("run_id") or path.parent.name)
        if run_id in live_job_ids or run_id in live_orchestrator_ids:
            continue
        archived_items.append(_archive_list_item(summary, path))
    return sorted(live_items + archived_items, key=lambda run: run.created_at, reverse=True)


@router.get("/runs/{run_id}", response_model=AnalysisRun)
async def get_analysis_run(run_id: str):
    job = get_job(run_id)
    if job is not None:
        return _analysis_run(job)
    summary = _archive_summary(run_id)
    if summary is None:
        raise HTTPException(status_code=404, detail="Run introuvable.")
    return _archive_analysis_run(run_id, summary, ORCHESTRATOR_RUNS_DIR / run_id / "run_summary.json")


@router.get("/runs/{run_id}/outputs", response_model=AnalysisRunOutputs)
async def get_analysis_run_outputs(run_id: str):
    job = get_job(run_id)
    if job is not None:
        run_dir = _safe_run_dir(job)
        job_id = str(job.get("job_id") or run_id)
        orchestrator_run_id = job.get("orchestrator_run_id")
    else:
        run_dir = _archive_run_dir(run_id)
        if run_dir is None:
            raise HTTPException(status_code=404, detail="Run introuvable.")
        job_id = run_id
        orchestrator_run_id = run_id
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
        job_id=job_id,
        orchestrator_run_id=orchestrator_run_id,
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
    if job is not None:
        return _steps(job)
    summary = _archive_summary(run_id)
    if summary is None:
        raise HTTPException(status_code=404, detail="Run introuvable.")
    return _archive_steps(summary)


@router.get("/logs", response_model=list[AnalysisLogEntry])
async def get_analysis_logs(run_id: str | None = Query(default=None)):
    if run_id is None:
        logs: list[AnalysisLogEntry] = []
        for job in JOBS.values():
            logs.extend(_logs(job))
        return logs

    job = get_job(run_id)
    if job is not None:
        return _logs(job)
    summary = _archive_summary(run_id)
    if summary is None:
        raise HTTPException(status_code=404, detail="Run introuvable.")
    return _archive_analysis_run(run_id, summary, ORCHESTRATOR_RUNS_DIR / run_id / "run_summary.json").logs

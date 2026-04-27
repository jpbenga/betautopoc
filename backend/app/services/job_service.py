from __future__ import annotations

from datetime import date as date_cls
from datetime import datetime, timedelta
from typing import Any
from uuid import uuid4

from backend.app.core.config import TZ

JOBS: dict[str, dict[str, Any]] = {}


def now_iso() -> str:
    return datetime.now(TZ).isoformat(timespec="seconds")


def get_target_date() -> str:
    return (datetime.now(TZ).date() + timedelta(days=1)).isoformat()


def resolve_target_date(value: Any) -> str:
    if value is None:
        return get_target_date()
    parsed = date_cls.fromisoformat(str(value))
    return parsed.isoformat()


def create_job() -> str:
    job_id = uuid4().hex[:8]
    JOBS[job_id] = {
        "job_id": job_id,
        "status": "running",
        "error": None,
        "created_at": now_iso(),
        "completed_at": None,
        "target_date": None,
        "steps": {
            "cache": {
                "label": "Cache JSON",
                "status": "pending",
                "message": "En attente.",
                "updated_at": None,
            },
            "analysis": {
                "label": "Analyse GPT",
                "status": "pending",
                "message": "En attente.",
                "updated_at": None,
            },
            "unibet": {
                "label": "Vérification Unibet",
                "status": "pending",
                "message": "En attente.",
                "updated_at": None,
            },
        },
        "logs": [],
        "picks": None,
        "verification": None,
        "orchestrator_run_id": None,
        "orchestrator_run_dir": None,
        "run_summary": None,
        "selection_file": None,
        "selection": None,
    }
    return job_id


def get_job(job_id: str) -> dict[str, Any] | None:
    return JOBS.get(job_id)


def log(job_id: str, message: str) -> None:
    JOBS[job_id]["logs"].append({"at": now_iso(), "message": message})


def set_step(job_id: str, step: str, status: str, message: str) -> None:
    JOBS[job_id]["steps"][step]["status"] = status
    JOBS[job_id]["steps"][step]["message"] = message
    JOBS[job_id]["steps"][step]["updated_at"] = now_iso()
    log(job_id, f"[{step}] {message}")


def set_error(job_id: str, message: str) -> None:
    JOBS[job_id]["status"] = "failed"
    JOBS[job_id]["error"] = message
    log(job_id, f"ERREUR — {message}")

from __future__ import annotations

from fastapi import APIRouter, BackgroundTasks, HTTPException

from backend.app.services.job_service import create_job, resolve_target_date
from backend.app.services.run_service import queue_job_run

router = APIRouter(prefix="/api", tags=["runs"])


@router.post("/run")
async def run(data: dict, background_tasks: BackgroundTasks):
    job_id = create_job()
    try:
        requested_date = resolve_target_date(data.get("date"))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {exc}") from exc

    queue_job_run(job_id=job_id, data=data, background_tasks=background_tasks, requested_date=requested_date)
    return {"job_id": job_id, "status": "running"}

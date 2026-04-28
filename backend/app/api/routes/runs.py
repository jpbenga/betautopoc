from __future__ import annotations

from fastapi import APIRouter, BackgroundTasks, HTTPException

from backend.app.api.schemas.run import RunRequest, RunStartResponse
from backend.app.services.job_service import create_job, resolve_target_date
from backend.app.services.run_service import queue_job_run

router = APIRouter(prefix="/api", tags=["runs"])


@router.post("/run", response_model=RunStartResponse)
async def run(data: RunRequest, background_tasks: BackgroundTasks):
    job_id = create_job()
    payload = data.model_dump(exclude_none=True)
    try:
        requested_date = resolve_target_date(payload.get("date"))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {exc}") from exc

    queue_job_run(job_id=job_id, data=payload, background_tasks=background_tasks, requested_date=requested_date)
    return {"job_id": job_id, "status": "running"}

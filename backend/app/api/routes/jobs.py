from __future__ import annotations

from fastapi import APIRouter, HTTPException
from fastapi.responses import FileResponse

from backend.app.services.job_service import get_job
from backend.app.services.run_service import get_run_dir

router = APIRouter(prefix="/api", tags=["jobs"])


@router.get("/job/{job_id}")
async def get_job_details(job_id: str):
    job = get_job(job_id)
    if job is None:
        raise HTTPException(status_code=404, detail="Job introuvable.")
    return job


@router.get("/job/{job_id}/file/{filename}")
async def get_file(job_id: str, filename: str):
    allowed = {
        "picks.json",
        "unibet_verification.json",
        "gpt_raw_output.txt",
        "browser_raw_output.txt",
        "prompt_used.txt",
    }

    if filename not in allowed:
        raise HTTPException(status_code=400, detail="Fichier non autorisé.")

    path = get_run_dir(job_id) / filename
    if not path.exists():
        raise HTTPException(status_code=404, detail="Fichier introuvable.")

    return FileResponse(path)


@router.post("/cache/clear")
async def clear_cache():
    from backend.app.services.run_service import clear_generated_cache

    removed = clear_generated_cache()
    return {"status": "ok", "removed": removed}

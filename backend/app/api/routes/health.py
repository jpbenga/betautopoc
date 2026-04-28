from __future__ import annotations

from fastapi import APIRouter

from backend.app.api.schemas.health import ApiStatus

router = APIRouter(tags=["health"])


@router.get("/health", response_model=ApiStatus)
async def health():
    return ApiStatus(status="ok")

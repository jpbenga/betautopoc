from __future__ import annotations

from typing import Any

from fastapi import APIRouter, HTTPException

from backend.app.api.schemas.settings import (
    SettingsIntegrationsResponse,
    SettingsLogsResponse,
    SettingsResponse,
    SettingsUpdateRequest,
    SettingsValidationRequest,
    SettingsValidationResult,
)
from backend.app.services.settings_service import (
    integrations_response,
    logs_response,
    settings_response,
    validate_settings,
)

router = APIRouter(prefix="/api/settings", tags=["settings"])


@router.get("", response_model=SettingsResponse)
async def get_settings():
    return settings_response()


@router.get("/integrations", response_model=SettingsIntegrationsResponse)
async def get_integrations():
    return integrations_response()


@router.post("/validate", response_model=SettingsValidationResult)
async def validate_settings_payload(payload: SettingsValidationRequest | dict[str, Any]):
    data = payload.model_dump() if hasattr(payload, "model_dump") else payload
    return validate_settings(data)


@router.put("")
async def update_settings(_: SettingsUpdateRequest):
    raise HTTPException(
        status_code=501,
        detail="Settings writes are disabled until a persistence and rollback contract is implemented.",
    )


@router.get("/logs", response_model=SettingsLogsResponse)
async def get_settings_logs():
    return logs_response()

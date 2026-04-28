from __future__ import annotations

from fastapi import APIRouter

from backend.app.api.schemas.common import CapabilitiesResponse, CapabilityStatus

router = APIRouter(prefix="/api", tags=["capabilities"])


@router.get("/capabilities", response_model=CapabilitiesResponse)
async def get_capabilities():
    available_endpoints = [
        "GET /health",
        "GET /api/capabilities",
        "POST /api/run",
        "GET /api/job/{job_id}",
        "GET /api/job/{job_id}/file/{filename}",
        "POST /api/cache/clear",
    ]

    return CapabilitiesResponse(
        capabilities=[
            CapabilityStatus(name="analysis", status="available", endpoints=["POST /api/run", "GET /api/job/{job_id}"]),
            CapabilityStatus(name="match_data", status="planned"),
            CapabilityStatus(name="ticketing", status="planned"),
            CapabilityStatus(name="costs", status="planned"),
            CapabilityStatus(name="bankroll", status="planned"),
            CapabilityStatus(name="agents", status="planned"),
            CapabilityStatus(name="performance", status="planned"),
            CapabilityStatus(name="settings", status="planned"),
        ],
        available_endpoints=available_endpoints,
    )

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
        "GET /api/analysis/runs",
        "GET /api/analysis/runs/{run_id}",
        "GET /api/analysis/runs/{run_id}/timeline",
        "GET /api/analysis/logs",
        "GET /api/match-data/context/latest",
        "GET /api/match-data/fixtures",
        "GET /api/match-data/odds",
        "GET /api/match-data/providers/api-football/quota",
        "POST /api/match-data/context/rebuild",
        "GET /api/tickets",
        "GET /api/tickets/{ticket_id}",
        "GET /api/tickets/{ticket_id}/audit-log",
        "POST /api/tickets/generate",
        "GET /api/job/{job_id}",
        "GET /api/job/{job_id}/file/{filename}",
        "POST /api/cache/clear",
    ]

    return CapabilitiesResponse(
        capabilities=[
            CapabilityStatus(
                name="analysis",
                status="available",
                endpoints=[
                    "POST /api/run",
                    "GET /api/analysis/runs",
                    "GET /api/analysis/runs/{run_id}",
                    "GET /api/analysis/runs/{run_id}/timeline",
                    "GET /api/analysis/logs",
                ],
            ),
            CapabilityStatus(
                name="match_data",
                status="partial",
                endpoints=[
                    "GET /api/match-data/context/latest",
                    "GET /api/match-data/fixtures",
                    "GET /api/match-data/odds",
                    "GET /api/match-data/providers/api-football/quota",
                    "POST /api/match-data/context/rebuild",
                ],
            ),
            CapabilityStatus(
                name="ticketing",
                status="partial",
                endpoints=[
                    "GET /api/tickets",
                    "GET /api/tickets/{ticket_id}",
                    "GET /api/tickets/{ticket_id}/audit-log",
                    "POST /api/tickets/generate",
                ],
            ),
            CapabilityStatus(name="costs", status="planned"),
            CapabilityStatus(name="bankroll", status="planned"),
            CapabilityStatus(name="agents", status="planned"),
            CapabilityStatus(name="performance", status="planned"),
            CapabilityStatus(name="settings", status="planned"),
        ],
        available_endpoints=available_endpoints,
    )

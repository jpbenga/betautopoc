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
        "GET /api/costs/summary",
        "GET /api/costs/runs",
        "GET /api/costs/trend",
        "GET /api/costs/breakdown",
        "GET /api/costs/alerts",
        "GET /api/coverage/football/leagues",
        "GET /api/bankroll/summary",
        "GET /api/bankroll/trend",
        "GET /api/bankroll/exposure",
        "GET /api/bankroll/positions/open",
        "GET /api/bankroll/risk-limits",
        "GET /api/bankroll/alerts",
        "GET /api/agents",
        "GET /api/agents/{agent_id}",
        "GET /api/agents/jobs",
        "GET /api/agents/logs",
        "GET /api/agents/resources",
        "GET /api/agents/browser-use/sessions",
        "GET /api/settings",
        "GET /api/settings/integrations",
        "POST /api/settings/validate",
        "PUT /api/settings",
        "GET /api/settings/logs",
        "GET /api/strategy",
        "GET /api/strategy/detail",
        "PUT /api/strategy/active",
        "PUT /api/strategy/config",
        "POST /api/strategy/apply-to-run",
        "GET /api/performance/summary",
        "GET /api/performance/accuracy",
        "GET /api/performance/roi",
        "GET /api/performance/calibration",
        "GET /api/performance/strategies/compare",
        "GET /api/performance/markets",
        "GET /api/performance/drift",
        "GET /api/performance/data-quality",
        "GET /api/performance/logs",
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
            CapabilityStatus(
                name="costs",
                status="partial",
                endpoints=[
                    "GET /api/costs/summary",
                    "GET /api/costs/runs",
                    "GET /api/costs/trend",
                    "GET /api/costs/breakdown",
                    "GET /api/costs/alerts",
                ],
            ),
            CapabilityStatus(
                name="coverage",
                status="partial",
                endpoints=[
                    "GET /api/coverage/football/leagues",
                ],
            ),
            CapabilityStatus(
                name="bankroll",
                status="partial",
                endpoints=[
                    "GET /api/bankroll/summary",
                    "GET /api/bankroll/trend",
                    "GET /api/bankroll/exposure",
                    "GET /api/bankroll/positions/open",
                    "GET /api/bankroll/risk-limits",
                    "GET /api/bankroll/alerts",
                ],
            ),
            CapabilityStatus(
                name="agents",
                status="partial",
                endpoints=[
                    "GET /api/agents",
                    "GET /api/agents/{agent_id}",
                    "GET /api/agents/jobs",
                    "GET /api/agents/logs",
                    "GET /api/agents/resources",
                    "GET /api/agents/browser-use/sessions",
                ],
            ),
            CapabilityStatus(
                name="performance",
                status="partial",
                endpoints=[
                    "GET /api/performance/summary",
                    "GET /api/performance/accuracy",
                    "GET /api/performance/roi",
                    "GET /api/performance/calibration",
                    "GET /api/performance/strategies/compare",
                    "GET /api/performance/markets",
                    "GET /api/performance/drift",
                    "GET /api/performance/data-quality",
                    "GET /api/performance/logs",
                ],
            ),
            CapabilityStatus(
                name="settings",
                status="partial",
                endpoints=[
                    "GET /api/settings",
                    "GET /api/settings/integrations",
                    "POST /api/settings/validate",
                    "PUT /api/settings",
                    "GET /api/settings/logs",
                ],
            ),
            CapabilityStatus(
                name="strategy",
                status="available",
                endpoints=[
                    "GET /api/strategy",
                    "GET /api/strategy/detail",
                    "PUT /api/strategy/active",
                    "PUT /api/strategy/config",
                    "POST /api/strategy/apply-to-run",
                ],
            ),
        ],
        available_endpoints=available_endpoints,
    )

from __future__ import annotations

from fastapi import APIRouter

from backend.app.api.schemas.costs import (
    CostAlertsResponse,
    CostBreakdownResponse,
    CostNoDataResponse,
    CostRunListResponse,
    CostSummary,
    CostTrendResponse,
)
from backend.app.services.costs_service import (
    alerts_response,
    breakdown_response,
    runs_response,
    summary_response,
    trend_response,
)

router = APIRouter(prefix="/api/costs", tags=["costs"])


@router.get("/summary", response_model=CostSummary | CostNoDataResponse)
async def get_cost_summary():
    return summary_response()


@router.get("/runs", response_model=CostRunListResponse | CostNoDataResponse)
async def get_cost_runs():
    return runs_response()


@router.get("/trend", response_model=CostTrendResponse | CostNoDataResponse)
async def get_cost_trend(window: str = "7d"):
    return trend_response(window)


@router.get("/breakdown", response_model=CostBreakdownResponse | CostNoDataResponse)
async def get_cost_breakdown():
    return breakdown_response()


@router.get("/alerts", response_model=CostAlertsResponse | CostNoDataResponse)
async def get_cost_alerts():
    return alerts_response()

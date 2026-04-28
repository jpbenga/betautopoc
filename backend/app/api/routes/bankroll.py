from __future__ import annotations

from fastapi import APIRouter

from backend.app.api.schemas.bankroll import (
    BankrollAlertsResponse,
    BankrollExposureResponse,
    BankrollNoDataResponse,
    BankrollSummary,
    BankrollTrendResponse,
    OpenPositionsResponse,
    RiskLimitsResponse,
)
from backend.app.services.bankroll_service import (
    alerts_response,
    exposure_response,
    open_positions_response,
    risk_limits_response,
    summary_response,
    trend_response,
)

router = APIRouter(prefix="/api/bankroll", tags=["bankroll"])


@router.get("/summary", response_model=BankrollSummary | BankrollNoDataResponse)
async def get_bankroll_summary():
    return summary_response()


@router.get("/trend", response_model=BankrollTrendResponse | BankrollNoDataResponse)
async def get_bankroll_trend(window: str = "7d"):
    return trend_response(window)


@router.get("/exposure", response_model=BankrollExposureResponse | BankrollNoDataResponse)
async def get_bankroll_exposure():
    return exposure_response()


@router.get("/positions/open", response_model=OpenPositionsResponse | BankrollNoDataResponse)
async def get_open_positions():
    return open_positions_response()


@router.get("/risk-limits", response_model=RiskLimitsResponse)
async def get_risk_limits():
    return risk_limits_response()


@router.get("/alerts", response_model=BankrollAlertsResponse | BankrollNoDataResponse)
async def get_bankroll_alerts():
    return alerts_response()

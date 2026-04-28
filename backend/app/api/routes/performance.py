from __future__ import annotations

from fastapi import APIRouter

from backend.app.api.schemas.performance import (
    MarketsPerformanceResponse,
    PerformanceAccuracyResponse,
    PerformanceCalibrationResponse,
    PerformanceDataQualityResponse,
    PerformanceDriftResponse,
    PerformanceLogsResponse,
    PerformanceNoDataResponse,
    PerformanceRoiResponse,
    PerformanceSummaryResponse,
    StrategiesCompareResponse,
)
from backend.app.services.performance_service import (
    accuracy_response,
    calibration_response,
    data_quality_response,
    drift_response,
    logs_response,
    markets_response,
    roi_response,
    strategies_compare_response,
    summary_response,
)

router = APIRouter(prefix="/api/performance", tags=["performance"])


@router.get("/summary", response_model=PerformanceSummaryResponse | PerformanceNoDataResponse)
async def get_performance_summary():
    return summary_response()


@router.get("/accuracy", response_model=PerformanceAccuracyResponse | PerformanceNoDataResponse)
async def get_performance_accuracy():
    return accuracy_response()


@router.get("/roi", response_model=PerformanceRoiResponse | PerformanceNoDataResponse)
async def get_performance_roi():
    return roi_response()


@router.get("/calibration", response_model=PerformanceCalibrationResponse | PerformanceNoDataResponse)
async def get_performance_calibration():
    return calibration_response()


@router.get("/strategies/compare", response_model=StrategiesCompareResponse | PerformanceNoDataResponse)
async def get_strategy_comparison():
    return strategies_compare_response()


@router.get("/markets", response_model=MarketsPerformanceResponse | PerformanceNoDataResponse)
async def get_market_performance():
    return markets_response()


@router.get("/drift", response_model=PerformanceDriftResponse | PerformanceNoDataResponse)
async def get_performance_drift():
    return drift_response()


@router.get("/data-quality", response_model=PerformanceDataQualityResponse | PerformanceNoDataResponse)
async def get_performance_data_quality():
    return data_quality_response()


@router.get("/logs", response_model=PerformanceLogsResponse | PerformanceNoDataResponse)
async def get_performance_logs():
    return logs_response()

from __future__ import annotations

from fastapi import APIRouter, HTTPException, Query

from backend.app.api.schemas.strategy import (
    StrategyActivateRequest,
    StrategyActivateResponse,
    StrategyApplyRequest,
    StrategyApplyResponse,
    StrategyCatalogResponse,
    StrategyDetailResponse,
    StrategySaveRequest,
    StrategySaveResponse,
)
from backend.app.services.strategy_service import (
    activate_strategy,
    apply_strategy_to_run,
    save_strategy,
    strategy_catalog,
    strategy_detail,
)

router = APIRouter(prefix="/api/strategy", tags=["strategy"])


@router.get("", response_model=StrategyCatalogResponse)
async def get_strategy_catalog():
    return strategy_catalog()


@router.get("/detail", response_model=StrategyDetailResponse)
async def get_strategy_detail(strategy_file: str | None = Query(default=None)):
    try:
        return strategy_detail(strategy_file)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.put("/active", response_model=StrategyActivateResponse)
async def update_active_strategy(payload: StrategyActivateRequest):
    try:
        return activate_strategy(payload.strategy_file)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.put("/config", response_model=StrategySaveResponse)
async def save_strategy_config(payload: StrategySaveRequest):
    try:
        return save_strategy(payload.strategy_file, payload.payload, activate=payload.activate)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc


@router.post("/apply-to-run", response_model=StrategyApplyResponse)
async def apply_strategy(payload: StrategyApplyRequest):
    try:
        return apply_strategy_to_run(
            run_id=payload.run_id,
            strategy_file=payload.strategy_file,
            selection_mode=payload.selection_mode,
        )
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

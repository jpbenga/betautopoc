from __future__ import annotations

import json
from datetime import date, timedelta
from pathlib import Path
from typing import Any

from backend.app.api.schemas.bankroll import (
    BankrollAlert,
    BankrollAlertsResponse,
    BankrollExposureItem,
    BankrollExposureResponse,
    BankrollNoDataResponse,
    BankrollSummary,
    BankrollTrendPoint,
    BankrollTrendResponse,
    OpenPosition,
    OpenPositionsResponse,
    RiskLimit,
    RiskLimitsResponse,
)
from backend.app.core.paths import REPO_ROOT
from betauto.runtime_mode import ensure_latest_allowed

ORCHESTRATOR_RUNS_DIR = REPO_ROOT / "data" / "orchestrator_runs"
INITIAL_BANKROLL = 1000.0
STAKE_PER_TICKET = 10.0
MAX_EXPOSURE_PERCENT = 40.0
MAX_PER_TICKET = 10.0
MAX_PARALLEL_TICKETS = 5
STOP_LOSS_DAILY = -100.0
MAX_DRAWDOWN_PERCENT = 10.0


def _summary_files() -> list[Path]:
    if not ORCHESTRATOR_RUNS_DIR.exists():
        return []
    return sorted(
        ORCHESTRATOR_RUNS_DIR.glob("*/run_summary.json"),
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )


def _read_summary(path: Path) -> dict[str, Any]:
    ensure_latest_allowed(path)
    return json.loads(path.read_text(encoding="utf-8"))


def _selection(summary: dict[str, Any]) -> dict[str, Any]:
    selection = summary.get("selection")
    return selection if isinstance(selection, dict) else {}


def _picks_count(summary: dict[str, Any]) -> int:
    picks = _selection(summary).get("picks")
    return len(picks) if isinstance(picks, list) else 0


def _ticket_id(run_id: str) -> str:
    return f"ticket_{run_id}"


def _position_from_summary(path: Path, summary: dict[str, Any]) -> OpenPosition | None:
    selection = _selection(summary)
    picks_count = _picks_count(summary)
    if picks_count <= 0:
        return None
    run_id = str(summary.get("run_id") or path.parent.name)
    odds = selection.get("estimated_combo_odds")
    estimated_odds = float(odds) if isinstance(odds, (int, float)) else None
    potential_return = round(STAKE_PER_TICKET * (estimated_odds or 0), 2)
    ticket_id = _ticket_id(run_id)
    return OpenPosition(
        position_id=f"pos_{run_id}",
        ticket_id=ticket_id,
        run_id=run_id,
        target_date=summary.get("target_date"),
        stake=STAKE_PER_TICKET,
        estimated_odds=estimated_odds,
        potential_return=potential_return,
        risk_level=selection.get("combo_risk_level"),
        picks_count=picks_count,
        source_file=str(path),
    )


def list_positions() -> list[OpenPosition]:
    positions: list[OpenPosition] = []
    for path in _summary_files():
        try:
            position = _position_from_summary(path, _read_summary(path))
        except (json.JSONDecodeError, OSError, RuntimeError):
            continue
        if position:
            positions.append(position)
    return positions


def no_data() -> BankrollNoDataResponse:
    return BankrollNoDataResponse()


def _total_exposure(positions: list[OpenPosition]) -> float:
    return round(sum(position.stake for position in positions), 2)


def _exposure_percent(exposure: float) -> float:
    return round((exposure / INITIAL_BANKROLL) * 100, 2) if INITIAL_BANKROLL else 0


def summary_response() -> BankrollSummary | BankrollNoDataResponse:
    positions = list_positions()
    if not positions:
        return no_data()
    exposure = _total_exposure(positions)
    return BankrollSummary(
        total_bankroll=INITIAL_BANKROLL,
        available_capital=round(INITIAL_BANKROLL - exposure, 2),
        total_exposure=exposure,
        exposure_percent=_exposure_percent(exposure),
        estimated_roi=0.0,
        simulated_pnl=0.0,
        open_positions_count=len(positions),
        stake_per_ticket=STAKE_PER_TICKET,
        simulation_mode="Simulated bankroll (no real bets): open tickets reserve stake only; no win/loss result is inferred.",
    )


def trend_response(window: str = "7d") -> BankrollTrendResponse | BankrollNoDataResponse:
    positions = list_positions()
    if not positions:
        return no_data()
    days = 7
    if window.endswith("d"):
        try:
            days = max(1, min(30, int(window[:-1])))
        except ValueError:
            days = 7
    start = date.today() - timedelta(days=days - 1)
    exposure = _total_exposure(positions)
    points = [
        BankrollTrendPoint(
            date=(start + timedelta(days=offset)).isoformat(),
            bankroll=INITIAL_BANKROLL,
            exposure=exposure,
            available_capital=round(INITIAL_BANKROLL - exposure, 2),
        )
        for offset in range(days)
    ]
    return BankrollTrendResponse(window=window, points=points)


def exposure_response() -> BankrollExposureResponse | BankrollNoDataResponse:
    positions = list_positions()
    if not positions:
        return no_data()
    exposure = _total_exposure(positions)
    items = [
        BankrollExposureItem(
            ticket_id=position.ticket_id,
            run_id=position.run_id,
            target_date=position.target_date,
            exposure=position.stake,
            bankroll_percent=_exposure_percent(position.stake),
            estimated_odds=position.estimated_odds,
            potential_return=position.potential_return,
            risk_level=position.risk_level,
            picks_count=position.picks_count,
            source_file=position.source_file,
        )
        for position in positions
    ]
    return BankrollExposureResponse(
        total_exposure=exposure,
        exposure_percent=_exposure_percent(exposure),
        items=items,
    )


def open_positions_response() -> OpenPositionsResponse | BankrollNoDataResponse:
    positions = list_positions()
    if not positions:
        return no_data()
    return OpenPositionsResponse(positions=positions)


def risk_limits_response() -> RiskLimitsResponse:
    return RiskLimitsResponse(
        limits=[
            RiskLimit(key="initial_bankroll", value=INITIAL_BANKROLL, unit="EUR", status="simulated"),
            RiskLimit(key="stake_per_ticket", value=STAKE_PER_TICKET, unit="EUR", status="active"),
            RiskLimit(key="max_exposure_percent", value=MAX_EXPOSURE_PERCENT, unit="percent", status="active"),
            RiskLimit(key="max_per_ticket", value=MAX_PER_TICKET, unit="EUR", status="active"),
            RiskLimit(key="max_parallel_tickets", value=MAX_PARALLEL_TICKETS, unit="tickets", status="watch"),
            RiskLimit(key="stop_loss_daily", value=STOP_LOSS_DAILY, unit="EUR", status="armed"),
        ]
    )


def alerts_response() -> BankrollAlertsResponse | BankrollNoDataResponse:
    positions = list_positions()
    if not positions:
        return no_data()
    exposure = _total_exposure(positions)
    exposure_percent = _exposure_percent(exposure)
    drawdown_percent = 0.0
    alerts: list[BankrollAlert] = []
    if exposure_percent > MAX_EXPOSURE_PERCENT:
        alerts.append(
            BankrollAlert(
                level="warning",
                title="Exposure above limit",
                detail=f"Exposure is {exposure_percent:.1f}% of bankroll, above {MAX_EXPOSURE_PERCENT:.1f}%.",
                metric="exposure_percent",
                threshold=MAX_EXPOSURE_PERCENT,
                value=exposure_percent,
            )
        )
    if drawdown_percent > MAX_DRAWDOWN_PERCENT:
        alerts.append(
            BankrollAlert(
                level="danger",
                title="Drawdown above limit",
                detail=f"Simulated drawdown is {drawdown_percent:.1f}%, above {MAX_DRAWDOWN_PERCENT:.1f}%.",
                metric="drawdown_percent",
                threshold=MAX_DRAWDOWN_PERCENT,
                value=drawdown_percent,
            )
        )
    if len(positions) > MAX_PARALLEL_TICKETS:
        alerts.append(
            BankrollAlert(
                level="warning",
                title="Parallel tickets above guardrail",
                detail=f"{len(positions)} open positions exceed the guardrail of {MAX_PARALLEL_TICKETS}.",
                metric="open_positions_count",
                threshold=float(MAX_PARALLEL_TICKETS),
                value=float(len(positions)),
            )
        )
    return BankrollAlertsResponse(alerts=alerts)

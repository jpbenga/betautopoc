from __future__ import annotations

import json
from collections import defaultdict
from datetime import UTC, date, datetime, timedelta
from pathlib import Path
from typing import Any

from backend.app.api.schemas.costs import (
    CostAlert,
    CostAlertsResponse,
    CostBreakdownItem,
    CostBreakdownResponse,
    CostNoDataResponse,
    CostRunItem,
    CostRunListResponse,
    CostSummary,
    CostTrendPoint,
    CostTrendResponse,
)
from backend.app.core.paths import REPO_ROOT
from betauto.runtime_mode import ensure_latest_allowed

ORCHESTRATOR_RUNS_DIR = REPO_ROOT / "data" / "orchestrator_runs"
DAILY_COST_THRESHOLD = 5.0
RUN_COST_THRESHOLD = 0.5
OPENAI_COST_PER_1K_TOKENS = 0.005
API_FOOTBALL_COST_PER_MATCH_ESTIMATE = 0.002
BROWSER_USE_COST_PER_RUN_ESTIMATE = 0.02


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


def _parse_datetime(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
    except ValueError:
        return None
    if parsed.tzinfo is None:
        return parsed.replace(tzinfo=UTC)
    return parsed.astimezone(UTC)


def _duration_seconds(summary: dict[str, Any]) -> int | None:
    started = _parse_datetime(summary.get("started_at"))
    finished = _parse_datetime(summary.get("finished_at"))
    if not started or not finished:
        return None
    return max(0, int((finished - started).total_seconds()))


def _duration_label(seconds: int | None) -> str:
    if seconds is None:
        return "running"
    minutes, remainder = divmod(seconds, 60)
    return f"{minutes}m {remainder:02d}s"


def _selection(summary: dict[str, Any]) -> dict[str, Any]:
    selection = summary.get("selection")
    return selection if isinstance(selection, dict) else {}


def _picks_count(summary: dict[str, Any]) -> int:
    picks = _selection(summary).get("picks")
    return len(picks) if isinstance(picks, list) else 0


def _completed_steps(summary: dict[str, Any]) -> int:
    steps = summary.get("steps")
    if not isinstance(steps, dict):
        return 0
    return sum(1 for status in steps.values() if str(status).lower() in {"completed", "done", "success"})


def _matches_estimate(summary: dict[str, Any]) -> int:
    # run_summary does not expose the exact match count yet. This is a lower-bound estimate from selection output.
    picks_count = _picks_count(summary)
    if summary.get("status") == "completed_no_data":
        return 0
    return max(picks_count, 1 if _completed_steps(summary) else 0)


def _estimated_tokens(summary: dict[str, Any]) -> int:
    matches = _matches_estimate(summary)
    picks = _picks_count(summary)
    steps = _completed_steps(summary)
    return 6000 + (matches * 9000) + (picks * 3000) + (steps * 2000)


def _costs(summary: dict[str, Any]) -> tuple[float, float, float, float]:
    tokens = _estimated_tokens(summary)
    matches = _matches_estimate(summary)
    openai = round((tokens / 1000) * OPENAI_COST_PER_1K_TOKENS, 4)
    api_football = round(matches * API_FOOTBALL_COST_PER_MATCH_ESTIMATE, 4)
    browser = round(BROWSER_USE_COST_PER_RUN_ESTIMATE if summary.get("with_browser") else 0, 4)
    total = round(openai + api_football + browser, 4)
    return total, openai, api_football, browser


def _run_item(path: Path, summary: dict[str, Any]) -> CostRunItem:
    total, openai, api_football, browser = _costs(summary)
    duration = _duration_seconds(summary)
    return CostRunItem(
        run_id=str(summary.get("run_id") or path.parent.name),
        target_date=summary.get("target_date"),
        status=summary.get("status"),
        started_at=summary.get("started_at"),
        finished_at=summary.get("finished_at"),
        duration_seconds=duration,
        duration_label=_duration_label(duration),
        matches_analyzed_estimate=_matches_estimate(summary),
        estimated_tokens=_estimated_tokens(summary),
        estimated_cost=total,
        openai_estimated_cost=openai,
        api_football_estimated_cost=api_football,
        browser_use_estimated_cost=browser,
        source_file=str(path),
    )


def _execution_date(run: CostRunItem) -> date | None:
    value = run.finished_at or run.started_at
    parsed = _parse_datetime(value)
    return parsed.date() if parsed else None


def list_cost_runs() -> list[CostRunItem]:
    runs: list[CostRunItem] = []
    for path in _summary_files():
        try:
            runs.append(_run_item(path, _read_summary(path)))
        except (json.JSONDecodeError, OSError, RuntimeError):
            continue
    return runs


def no_data() -> CostNoDataResponse:
    return CostNoDataResponse()


def runs_response() -> CostRunListResponse | CostNoDataResponse:
    runs = list_cost_runs()
    if not runs:
        return no_data()
    return CostRunListResponse(runs=runs)


def summary_response() -> CostSummary | CostNoDataResponse:
    runs = list_cost_runs()
    if not runs:
        return no_data()
    today = date.today().isoformat()
    seven_days_ago = date.today() - timedelta(days=6)
    today_cost = sum(run.estimated_cost for run in runs if (_execution_date(run) or date.min).isoformat() == today)
    seven_day_runs = [
        run
        for run in runs
        if (_execution_date(run) or date.min) >= seven_days_ago
    ]
    seven_day_cost = sum(run.estimated_cost for run in seven_day_runs)
    total_cost = sum(run.estimated_cost for run in runs)
    total_tokens = sum(run.estimated_tokens for run in runs)
    return CostSummary(
        total_cost_today=round(today_cost, 4),
        total_cost_7d=round(seven_day_cost, 4),
        runs_count=len(runs),
        average_cost_per_run=round(total_cost / len(runs), 4),
        total_estimated_tokens=total_tokens,
        estimation_method="Heuristic from run_summary.json only: duration, completed steps, selection picks, with_browser flag.",
    )


def trend_response(window: str = "7d") -> CostTrendResponse | CostNoDataResponse:
    runs = list_cost_runs()
    if not runs:
        return no_data()
    days = 7
    if window.endswith("d"):
        try:
            days = max(1, min(30, int(window[:-1])))
        except ValueError:
            days = 7
    start = date.today() - timedelta(days=days - 1)
    totals: dict[str, float] = defaultdict(float)
    for run in runs:
        run_date = _execution_date(run)
        if not run_date:
            continue
        if run_date >= start:
            totals[run_date.isoformat()] += run.estimated_cost
    points = [
        CostTrendPoint(date=(start + timedelta(days=offset)).isoformat(), cost=round(totals[(start + timedelta(days=offset)).isoformat()], 4))
        for offset in range(days)
    ]
    return CostTrendResponse(window=window, points=points)


def breakdown_response() -> CostBreakdownResponse | CostNoDataResponse:
    runs = list_cost_runs()
    if not runs:
        return no_data()
    openai_cost = sum(run.openai_estimated_cost for run in runs)
    api_cost = sum(run.api_football_estimated_cost for run in runs)
    browser_cost = sum(run.browser_use_estimated_cost for run in runs)
    token_requests = sum(run.estimated_tokens for run in runs)
    match_requests = sum(run.matches_analyzed_estimate for run in runs)
    browser_requests = sum(1 for run in runs if run.browser_use_estimated_cost > 0)
    return CostBreakdownResponse(
        services=[
            _breakdown_item("openai", token_requests, openai_cost),
            _breakdown_item("api_football", match_requests, api_cost),
            _breakdown_item("browser_use", browser_requests, browser_cost, status="placeholder"),
        ]
    )


def _breakdown_item(service: str, requests: int, cost: float, status: str = "estimated") -> CostBreakdownItem:
    average = round(cost / requests, 6) if requests else 0
    return CostBreakdownItem(
        service=service,
        estimated_requests=requests,
        estimated_cost=round(cost, 4),
        average_cost_per_request=average,
        status=status,
    )


def alerts_response() -> CostAlertsResponse | CostNoDataResponse:
    runs = list_cost_runs()
    if not runs:
        return no_data()
    alerts: list[CostAlert] = []
    today = date.today().isoformat()
    today_cost = round(sum(run.estimated_cost for run in runs if (_execution_date(run) or date.min).isoformat() == today), 4)
    if today_cost > DAILY_COST_THRESHOLD:
        alerts.append(
            CostAlert(
                level="warning",
                title="Daily cost threshold exceeded",
                detail=f"Estimated daily cost is ${today_cost:.2f}, above ${DAILY_COST_THRESHOLD:.2f}.",
                metric="total_cost_today",
                threshold=DAILY_COST_THRESHOLD,
                value=today_cost,
            )
        )
    for run in runs:
        if run.estimated_cost > RUN_COST_THRESHOLD:
            alerts.append(
                CostAlert(
                    level="warning",
                    title="Run cost threshold exceeded",
                    detail=f"Run {run.run_id} is estimated at ${run.estimated_cost:.2f}.",
                    metric="estimated_cost",
                    threshold=RUN_COST_THRESHOLD,
                    value=run.estimated_cost,
                )
            )
    return CostAlertsResponse(alerts=alerts)

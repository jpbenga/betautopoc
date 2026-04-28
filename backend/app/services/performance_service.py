from __future__ import annotations

import json
from collections import Counter, defaultdict
from pathlib import Path
from typing import Any

from backend.app.api.schemas.performance import (
    CalibrationBucket,
    DistributionItem,
    DriftSignal,
    MarketPerformanceItem,
    MarketsPerformanceResponse,
    PerformanceAccuracyResponse,
    PerformanceCalibrationResponse,
    PerformanceDataQualityResponse,
    PerformanceDriftResponse,
    PerformanceLogEntry,
    PerformanceLogsResponse,
    PerformanceNoDataResponse,
    PerformanceRoiResponse,
    PerformanceSummaryResponse,
    StrategiesCompareResponse,
    StrategyPerformanceItem,
)
from backend.app.core.paths import REPO_ROOT
from betauto.runtime_mode import ensure_latest_allowed

ORCHESTRATOR_RUNS_DIR = REPO_ROOT / "data" / "orchestrator_runs"
STAKE_PER_TICKET = 10.0


def _summary_files() -> list[Path]:
    if not ORCHESTRATOR_RUNS_DIR.exists():
        return []
    return sorted(
        ORCHESTRATOR_RUNS_DIR.glob("*/run_summary.json"),
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )


def _read_json(path: Path) -> dict[str, Any]:
    ensure_latest_allowed(path)
    return json.loads(path.read_text(encoding="utf-8"))


def _safe_float(value: Any) -> float | None:
    try:
        return float(value)
    except (TypeError, ValueError):
        return None


def _safe_int(value: Any) -> int | None:
    try:
        return int(value)
    except (TypeError, ValueError):
        return None


def _avg(values: list[float | int]) -> float | None:
    return round(sum(values) / len(values), 2) if values else None


def _percent(part: int | float, total: int | float) -> float:
    return round((part / total) * 100, 2) if total else 0.0


def _tier(confidence: int) -> str:
    if confidence >= 90:
        return "elite"
    if confidence >= 80:
        return "very_strong"
    if confidence >= 70:
        return "strong"
    if confidence >= 60:
        return "medium"
    if confidence >= 50:
        return "weak"
    return "very_weak"


def _risk(confidence: int, data_quality: str) -> str:
    if data_quality == "low":
        return "high"
    if confidence >= 85:
        return "low"
    if confidence >= 70:
        return "medium"
    return "high"


def _market_key(value: Any) -> str:
    market = str(value or "unknown").lower()
    if market.startswith("match_winner"):
        return "match_winner"
    if market.startswith("goals_over_under") or "over_under" in market:
        return "goals_over_under"
    if market.startswith("both_teams_score") or market.startswith("both_teams_to_score"):
        return "both_teams_to_score"
    return market


def _selection(summary: dict[str, Any], run_dir: Path) -> dict[str, Any]:
    selection = summary.get("selection")
    if isinstance(selection, dict):
        return selection
    selection_file = run_dir / "selection.json"
    if selection_file.exists():
        try:
            return _read_json(selection_file)
        except (json.JSONDecodeError, OSError, RuntimeError):
            return {}
    return {}


def _picks(summary: dict[str, Any], run_dir: Path) -> list[dict[str, Any]]:
    picks = _selection(summary, run_dir).get("picks")
    return picks if isinstance(picks, list) else []


def _candidates_from_aggregation(run_dir: Path) -> list[dict[str, Any]]:
    path = run_dir / "aggregation_candidates.json"
    if not path.exists():
        return []
    try:
        payload = _read_json(path)
    except (json.JSONDecodeError, OSError, RuntimeError):
        return []
    candidates = payload.get("candidates")
    return candidates if isinstance(candidates, list) else []


def _candidates_from_match_analysis(run_dir: Path) -> list[dict[str, Any]]:
    path = run_dir / "match_analysis.json"
    if not path.exists():
        return []
    try:
        payload = _read_json(path)
    except (json.JSONDecodeError, OSError, RuntimeError):
        return []
    results = payload.get("results") if isinstance(payload.get("results"), list) else []
    candidates: list[dict[str, Any]] = []
    for result in results:
        if not isinstance(result, dict):
            continue
        analysis = result.get("analysis") if isinstance(result.get("analysis"), dict) else {}
        global_confidence = _safe_int(analysis.get("global_confidence")) or 0
        data_quality = str(analysis.get("data_quality") or "low")
        predicted = analysis.get("predicted_markets") if isinstance(analysis.get("predicted_markets"), list) else []
        for market in predicted:
            if not isinstance(market, dict):
                continue
            predicted_confidence = _safe_int(market.get("confidence")) or 0
            confidence = min(predicted_confidence, global_confidence or predicted_confidence)
            candidates.append(
                {
                    "run_id": run_dir.name,
                    "market_canonical_id": market.get("market_canonical_id"),
                    "confidence_score": confidence,
                    "confidence_tier": _tier(confidence),
                    "risk_level": _risk(confidence, data_quality),
                    "data_quality": data_quality,
                    "expected_odds_min": None,
                    "odds": None,
                    "source": "match_analysis_derived",
                }
            )
    return candidates


def _filtered_payload(run_dir: Path) -> dict[str, Any]:
    path = run_dir / "filtered_candidates.json"
    if not path.exists():
        return {}
    try:
        return _read_json(path)
    except (json.JSONDecodeError, OSError, RuntimeError):
        return {}


def _runs() -> list[dict[str, Any]]:
    runs: list[dict[str, Any]] = []
    for summary_path in _summary_files():
        run_dir = summary_path.parent
        try:
            summary = _read_json(summary_path)
        except (json.JSONDecodeError, OSError, RuntimeError):
            continue
        aggregation_candidates = _candidates_from_aggregation(run_dir)
        candidates = aggregation_candidates or _candidates_from_match_analysis(run_dir)
        filtered_payload = _filtered_payload(run_dir)
        filtered = filtered_payload.get("candidates") if isinstance(filtered_payload.get("candidates"), list) else []
        rejected = (
            filtered_payload.get("rejected_candidates")
            if isinstance(filtered_payload.get("rejected_candidates"), list)
            else []
        )
        runs.append(
            {
                "run_id": str(summary.get("run_id") or run_dir.name),
                "run_dir": run_dir,
                "summary": summary,
                "selection": _selection(summary, run_dir),
                "picks": _picks(summary, run_dir),
                "candidates": candidates,
                "filtered": filtered,
                "rejected": rejected,
                "has_filtered_artifact": bool(filtered_payload),
            }
        )
    return runs


def _all_candidates(runs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [candidate for run in runs for candidate in run["candidates"] if isinstance(candidate, dict)]


def _all_filtered(runs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [candidate for run in runs for candidate in run["filtered"] if isinstance(candidate, dict)]


def _all_rejected(runs: list[dict[str, Any]]) -> list[dict[str, Any]]:
    return [candidate for run in runs for candidate in run["rejected"] if isinstance(candidate, dict)]


def _distribution(values: list[str]) -> list[DistributionItem]:
    counter = Counter(value or "unknown" for value in values)
    total = sum(counter.values())
    return [
        DistributionItem(key=key, count=count, percent=_percent(count, total))
        for key, count in sorted(counter.items())
    ]


def _confidence(candidate: dict[str, Any]) -> int | None:
    return _safe_int(candidate.get("confidence_score") or candidate.get("confidence"))


def _odds(candidate: dict[str, Any]) -> float | None:
    return _safe_float(candidate.get("odds") or candidate.get("expected_odds_min") or candidate.get("estimated_odds"))


def no_data() -> PerformanceNoDataResponse:
    return PerformanceNoDataResponse()


def summary_response() -> PerformanceSummaryResponse | PerformanceNoDataResponse:
    runs = _runs()
    if not runs:
        return no_data()
    candidates = _all_candidates(runs)
    filtered = _all_filtered(runs)
    filtered_count = len(filtered)
    tickets = [run for run in runs if run["picks"]]
    status = "available" if candidates and all(run["has_filtered_artifact"] for run in runs if run["candidates"]) else "partial"
    confidence_values = [value for candidate in candidates if (value := _confidence(candidate)) is not None]
    filtered_confidence = [value for candidate in filtered if (value := _confidence(candidate)) is not None]
    odds_values = [value for candidate in candidates + [pick for run in runs for pick in run["picks"]] if (value := _odds(candidate)) is not None]
    return PerformanceSummaryResponse(
        status=status,
        total_runs=len(runs),
        total_tickets=len(tickets),
        total_candidates=len(candidates),
        filtered_candidates_count=filtered_count,
        average_confidence_score=_avg(confidence_values),
        average_confidence_score_filtered=_avg(filtered_confidence),
        average_estimated_odds=_avg(odds_values),
        data_quality_distribution=_distribution([str(candidate.get("data_quality") or "unknown") for candidate in candidates]),
        confidence_tier_distribution=_distribution([
            str(candidate.get("confidence_tier") or _tier(_confidence(candidate) or 0)) for candidate in candidates
        ]),
        risk_level_distribution=_distribution([str(candidate.get("risk_level") or "unknown") for candidate in candidates]),
    )


def accuracy_response() -> PerformanceAccuracyResponse | PerformanceNoDataResponse:
    runs = _runs()
    if not runs:
        return no_data()
    candidates = _all_candidates(runs)
    filtered = _all_filtered(runs)
    accepted = len(filtered) if filtered else sum(len(run["picks"]) for run in runs)
    return PerformanceAccuracyResponse(
        status="partial",
        accuracy_not_available_reason="Outcome-based accuracy is not available because settled match/bet results are not stored.",
        proxy_acceptance_rate=_percent(accepted, len(candidates)) if candidates else None,
        total_candidates=len(candidates),
        accepted_candidates=accepted,
    )


def roi_response() -> PerformanceRoiResponse | PerformanceNoDataResponse:
    runs = _runs()
    if not runs:
        return no_data()
    tickets = [run for run in runs if run["picks"]]
    estimated_potential = 0.0
    for run in tickets:
        odds = _safe_float(run["selection"].get("estimated_combo_odds")) or 0
        estimated_potential += odds * STAKE_PER_TICKET
    return PerformanceRoiResponse(
        status="partial",
        message="No real ROI until settlement/results capability exists. Values are exposure/potential-return proxies only.",
        estimated_exposure=round(len(tickets) * STAKE_PER_TICKET, 2),
        estimated_potential_return=round(estimated_potential, 2),
        simulated_pnl=0.0,
    )


def calibration_response() -> PerformanceCalibrationResponse | PerformanceNoDataResponse:
    runs = _runs()
    if not runs:
        return no_data()
    candidates = _all_candidates(runs)
    filtered = _all_filtered(runs)
    rejected = _all_rejected(runs)
    if not candidates:
        return PerformanceCalibrationResponse(
            status="partial",
            message="Proxy calibration unavailable because no candidates were found.",
            buckets=[],
        )
    buckets: list[CalibrationBucket] = []
    for tier in ["elite", "very_strong", "strong", "medium", "weak", "very_weak"]:
        tier_candidates = [c for c in candidates if str(c.get("confidence_tier") or _tier(_confidence(c) or 0)) == tier]
        tier_filtered = [c for c in filtered if str(c.get("confidence_tier") or _tier(_confidence(c) or 0)) == tier]
        tier_rejected = [c for c in rejected if str(c.get("confidence_tier") or _tier(_confidence(c) or 0)) == tier]
        if tier_candidates or tier_filtered or tier_rejected:
            buckets.append(
                CalibrationBucket(
                    bucket=tier,
                    candidates_count=len(tier_candidates),
                    filtered_count=len(tier_filtered),
                    rejected_count=len(tier_rejected),
                    filtered_rate=_percent(len(tier_filtered), len(tier_candidates)),
                )
            )
    return PerformanceCalibrationResponse(
        status="partial",
        message="Proxy calibration derived from candidate filtering, not real outcomes.",
        buckets=buckets,
    )


def strategies_compare_response() -> StrategiesCompareResponse | PerformanceNoDataResponse:
    runs = _runs()
    if not runs:
        return no_data()
    groups: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for run in runs:
        summary = run["summary"]
        key = str(summary.get("strategy_file") or summary.get("strategy_id") or "unknown")
        groups[key].append(run)
    items: list[StrategyPerformanceItem] = []
    for key, group_runs in groups.items():
        candidates = _all_candidates(group_runs)
        filtered_counts = [len(run["filtered"]) for run in group_runs if run["has_filtered_artifact"]]
        confidence_values = [value for candidate in candidates if (value := _confidence(candidate)) is not None]
        odds_values = [value for run in group_runs for pick in run["picks"] if (value := _odds(pick)) is not None]
        items.append(
            StrategyPerformanceItem(
                strategy_key=key,
                runs_count=len(group_runs),
                tickets_count=sum(1 for run in group_runs if run["picks"]),
                avg_confidence=_avg(confidence_values),
                avg_filtered_candidates=_avg(filtered_counts),
                avg_estimated_odds=_avg(odds_values),
            )
        )
    return StrategiesCompareResponse(status="partial", strategies=items)


def markets_response() -> MarketsPerformanceResponse | PerformanceNoDataResponse:
    runs = _runs()
    if not runs:
        return no_data()
    candidates = _all_candidates(runs)
    filtered = _all_filtered(runs)
    rejected = _all_rejected(runs)
    markets = sorted({_market_key(candidate.get("market_canonical_id") or candidate.get("market")) for candidate in candidates})
    items: list[MarketPerformanceItem] = []
    for market in markets:
        market_candidates = [c for c in candidates if _market_key(c.get("market_canonical_id") or c.get("market")) == market]
        market_filtered = [c for c in filtered if _market_key(c.get("market_canonical_id") or c.get("market")) == market]
        market_rejected = [c for c in rejected if _market_key(c.get("market_canonical_id") or c.get("market")) == market]
        confidence_values = [value for candidate in market_candidates if (value := _confidence(candidate)) is not None]
        odds_values = [value for candidate in market_candidates if (value := _odds(candidate)) is not None]
        items.append(
            MarketPerformanceItem(
                market=market,
                candidates_count=len(market_candidates),
                filtered_count=len(market_filtered),
                rejected_count=len(market_rejected),
                avg_confidence=_avg(confidence_values),
                avg_estimated_odds=_avg(odds_values),
                filtered_rate=_percent(len(market_filtered), len(market_candidates)),
            )
        )
    return MarketsPerformanceResponse(status="partial", markets=items)


def drift_response() -> PerformanceDriftResponse | PerformanceNoDataResponse:
    runs = list(reversed(_runs()))
    if not runs:
        return no_data()
    if len(runs) < 4:
        return PerformanceDriftResponse(status="partial", message="Not enough runs for drift detection.", signals=[])
    mid = len(runs) // 2
    early = _all_candidates(runs[:mid])
    recent = _all_candidates(runs[mid:])
    signals = [
        _drift_signal("confidence_tier", early, recent),
        _drift_signal("risk_level", early, recent),
        _drift_signal("data_quality", early, recent),
    ]
    return PerformanceDriftResponse(
        status="partial",
        message="Simple distribution drift proxy; not a statistical model drift test.",
        signals=signals,
    )


def _drift_signal(dimension: str, early: list[dict[str, Any]], recent: list[dict[str, Any]]) -> DriftSignal:
    early_counter = Counter(str(item.get(dimension) or "unknown") for item in early)
    recent_counter = Counter(str(item.get(dimension) or "unknown") for item in recent)
    keys = set(early_counter) | set(recent_counter)
    score = sum(abs(_percent(early_counter[key], len(early)) - _percent(recent_counter[key], len(recent))) for key in keys)
    status = "watch" if score >= 50 else "stable"
    return DriftSignal(
        dimension=dimension,
        status=status,
        variation_score=round(score, 2),
        message=f"{dimension} distribution variation is {score:.2f} percentage points.",
    )


def data_quality_response() -> PerformanceDataQualityResponse | PerformanceNoDataResponse:
    runs = _runs()
    if not runs:
        return no_data()
    candidates = _all_candidates(runs)
    rejected = _all_rejected(runs)
    with_odds = len([candidate for candidate in candidates if _odds(candidate) is not None])
    missing_odds_rejected = len([
        candidate for candidate in rejected if "missing_odds" in (candidate.get("rejection_reasons") or candidate.get("filter_reasons") or [])
    ])
    no_data_runs = len([run for run in runs if str(run["summary"].get("status")) == "completed_no_data"])
    return PerformanceDataQualityResponse(
        status="partial" if candidates else "no_data",
        data_quality_distribution=_distribution([str(candidate.get("data_quality") or "unknown") for candidate in candidates]),
        candidates_with_odds_percent=_percent(with_odds, len(candidates)),
        missing_odds_rejected_percent=_percent(missing_odds_rejected, len(rejected)),
        completed_no_data_runs_percent=_percent(no_data_runs, len(runs)),
    )


def logs_response() -> PerformanceLogsResponse | PerformanceNoDataResponse:
    runs = _runs()
    if not runs:
        return no_data()
    summary = summary_response()
    logs = [
        PerformanceLogEntry(message="Outcome-based accuracy not available yet.", level="warning"),
        PerformanceLogEntry(message="Proxy calibration derived from candidate filtering.", level="info"),
        PerformanceLogEntry(message="No real ROI until settlement/results capability exists.", level="warning"),
    ]
    if isinstance(summary, PerformanceSummaryResponse):
        logs.append(
            PerformanceLogEntry(
                message=f"Loaded {summary.total_runs} runs, {summary.total_candidates} candidates, {summary.total_tickets} tickets.",
                level="success",
            )
        )
    return PerformanceLogsResponse(status="partial", logs=logs)

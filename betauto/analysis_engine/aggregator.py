from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from betauto.runtime_mode import ensure_latest_allowed

from .models import AnalysisCandidate


def _confidence_tier(confidence: int) -> str:
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


def _risk_level(confidence: int, data_quality: str) -> str:
    if data_quality == "low":
        return "high"
    if confidence >= 85:
        return "low"
    if confidence >= 70:
        return "medium"
    return "high"


def _safe_int(value: Any, default: int = 0) -> int:
    try:
        return int(value)
    except (TypeError, ValueError):
        return default


def _normalize_market_id(value: str) -> str:
    market = str(value or "").lower()
    if market in {"1x2", "winner", "match_winner_1x2"} or market.startswith("match_winner"):
        return "match_winner"
    if market == "btts" or market.startswith("both_teams_score") or market.startswith("both_teams_to_score"):
        return "both_teams_to_score"
    if "over_under" in market or "total_goals" in market or market.startswith("goals_over_under"):
        return "goals_over_under"
    return market


def _load_json(path: Path) -> dict[str, Any]:
    ensure_latest_allowed(path)
    return json.loads(path.read_text(encoding="utf-8"))


def _context_matches(context_file: str | None, run_dir: Path) -> dict[int, dict[str, Any]]:
    if not context_file:
        return {}
    path = Path(context_file)
    if not path.is_absolute():
        path = Path.cwd() / path
    path = path.resolve()
    if not path.is_relative_to(run_dir.resolve()) or not path.exists():
        return {}
    payload = _load_json(path)
    matches = payload.get("matches") if isinstance(payload.get("matches"), list) else []
    return {int(match.get("fixture_id")): match for match in matches if isinstance(match, dict) and match.get("fixture_id")}


def _market_label(market_canonical_id: str) -> str:
    normalized = market_canonical_id.lower()
    if "match_winner" in normalized:
        return "Match Winner"
    if "goals_over_under" in normalized:
        return "Goals Over/Under"
    if "both_teams" in normalized:
        return "Both Teams Score"
    return market_canonical_id


def _pick_label(selection_canonical_id: str) -> str:
    normalized = selection_canonical_id.lower()
    if normalized.endswith("/home") or normalized == "home":
        return "Home"
    if normalized.endswith("/away") or normalized == "away":
        return "Away"
    if normalized.endswith("/draw") or normalized == "draw":
        return "Draw"
    if "under_2_5" in normalized or "under_2.5" in normalized:
        return "Under 2.5"
    if "over_2_5" in normalized or "over_2.5" in normalized:
        return "Over 2.5"
    if normalized.endswith("/yes") or normalized == "yes":
        return "Yes"
    if normalized.endswith("/no") or normalized == "no":
        return "No"
    return selection_canonical_id


def _odds_for_candidate(match_context: dict[str, Any] | None, market_label: str, pick_label: str) -> float | None:
    if not match_context:
        return None
    odds = match_context.get("odds") if isinstance(match_context.get("odds"), dict) else {}
    markets = odds.get("markets") if isinstance(odds.get("markets"), list) else []
    for market in markets:
        if not isinstance(market, dict) or str(market.get("name")).lower() != market_label.lower():
            continue
        values = market.get("values") if isinstance(market.get("values"), list) else []
        for value in values:
            if not isinstance(value, dict):
                continue
            if str(value.get("value")).lower() == pick_label.lower():
                try:
                    return float(value.get("odd"))
                except (TypeError, ValueError):
                    return None
    return None


def aggregate_candidates(match_analysis: dict[str, Any], *, run_dir: Path) -> dict[str, Any]:
    context_matches = _context_matches(match_analysis.get("context_file"), run_dir)
    results = match_analysis.get("results") if isinstance(match_analysis.get("results"), list) else []
    candidates: list[dict[str, Any]] = []
    errors: list[str] = []

    for result in results:
        if not isinstance(result, dict):
            continue
        analysis = result.get("analysis") if isinstance(result.get("analysis"), dict) else {}
        fixture_id = _safe_int(analysis.get("fixture_id"))
        predicted_markets = (
            analysis.get("predicted_markets") if isinstance(analysis.get("predicted_markets"), list) else []
        )
        for index, market in enumerate(predicted_markets, start=1):
            if not isinstance(market, dict):
                continue
            predicted_confidence = max(0, min(100, _safe_int(market.get("confidence"))))
            global_confidence = max(0, min(100, _safe_int(analysis.get("global_confidence"), predicted_confidence)))
            effective_confidence = min(predicted_confidence, global_confidence)
            data_quality = str(analysis.get("data_quality") or "low")
            market_canonical_id = _normalize_market_id(str(market.get("market_canonical_id") or "unknown_market"))
            selection_canonical_id = str(market.get("selection_canonical_id") or "unknown_selection")
            market_label = _market_label(market_canonical_id)
            pick_label = _pick_label(selection_canonical_id)
            odd = _odds_for_candidate(context_matches.get(fixture_id), market_label, pick_label)
            odds_source = "analysis_context" if odd is not None else None
            try:
                candidate = AnalysisCandidate(
                    candidate_id=f"fixture_{fixture_id}_candidate_{index:03d}",
                    fixture_id=fixture_id,
                    event=str(analysis.get("event") or "Unknown event"),
                    pick=pick_label,
                    market=market_label,
                    market_canonical_id=market_canonical_id,
                    selection_canonical_id=selection_canonical_id,
                    confidence_score=effective_confidence,
                    confidence_tier=_confidence_tier(effective_confidence),
                    risk_level=_risk_level(effective_confidence, data_quality),
                    reasoning=str(market.get("reason") or analysis.get("analysis_summary") or ""),
                    data_quality=data_quality,
                    odds=odd,
                    odds_source=odds_source,
                    expected_odds_min=odd,
                    expected_odds_max=odd,
                    competition=analysis.get("competition"),
                    kickoff=analysis.get("kickoff"),
                    source_match_analysis_id=f"fixture_{fixture_id}",
                    source_status=str(result.get("status") or "unknown"),
                )
                candidates.append(candidate.model_dump())
            except Exception as exc:  # noqa: BLE001
                errors.append(f"fixture_id={fixture_id} candidate={index}: {exc}")

    return {
        "generated_at": match_analysis.get("generated_at"),
        "target_date": match_analysis.get("target_date"),
        "source_file": match_analysis.get("source_file"),
        "context_file": match_analysis.get("context_file"),
        "status": "completed",
        "candidates": candidates,
        "candidate_count": len(candidates),
        "errors": errors,
    }


def aggregate_candidates_from_file(match_analysis_file: Path, output_file: Path) -> dict[str, Any]:
    run_dir = match_analysis_file.parent.resolve()
    payload = _load_json(match_analysis_file.resolve())
    payload["source_file"] = str(match_analysis_file)
    result = aggregate_candidates(payload, run_dir=run_dir)
    output_file.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    return result

from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from betauto.runtime_mode import ensure_latest_allowed
from betauto.strategy import ResolvedStrategyConfig

QUALITY_RANK = {"low": 0, "medium": 1, "high": 2}


def _market_key(value: Any) -> str:
    market = str(value or "").lower()
    if market.startswith("match_winner"):
        return "match_winner"
    if market.startswith("goals_over_under"):
        return "goals_over_under"
    if market.startswith("both_teams_score") or market.startswith("both_teams_to_score"):
        return "both_teams_to_score"
    return market


def _market_allowed(candidate: dict[str, Any], strategy: ResolvedStrategyConfig) -> bool:
    if strategy.market_mode == "all":
        return True
    market = _market_key(candidate.get("market_canonical_id") or candidate.get("market"))
    allowed_markets = {_market_key(item) for item in strategy.allowed_markets}
    excluded_markets = {_market_key(item) for item in strategy.excluded_markets}
    if strategy.market_mode == "allowlist":
        return not allowed_markets or market in allowed_markets
    if strategy.market_mode == "blocklist":
        return market not in excluded_markets
    return True


def _quality_allowed(candidate: dict[str, Any], strategy: ResolvedStrategyConfig) -> bool:
    quality = str(candidate.get("data_quality") or "low")
    min_quality = strategy.min_data_quality or "medium"
    return QUALITY_RANK.get(quality, 0) >= QUALITY_RANK.get(min_quality, 1)


def _strategy_requires_odds(strategy: ResolvedStrategyConfig) -> bool:
    return bool(
        getattr(strategy, "requires_odds", None)
        if getattr(strategy, "requires_odds", None) is not None
        else strategy.require_odds_available
    )


def _candidate_has_odds(candidate: dict[str, Any]) -> bool:
    return candidate.get("odds") is not None or candidate.get("expected_odds_min") is not None


def filter_candidates(candidates_payload: dict[str, Any], strategy: ResolvedStrategyConfig) -> dict[str, Any]:
    candidates = candidates_payload.get("candidates") if isinstance(candidates_payload.get("candidates"), list) else []
    filtered: list[dict[str, Any]] = []
    rejected: list[dict[str, Any]] = []

    for candidate in candidates:
        if not isinstance(candidate, dict):
            continue
        reasons: list[str] = []
        if int(candidate.get("confidence_score") or 0) < strategy.min_pick_confidence:
            reasons.append("low_confidence")
        if not _market_allowed(candidate, strategy):
            reasons.append("disallowed_market")
        if not _quality_allowed(candidate, strategy):
            reasons.append("low_data_quality")
        if _strategy_requires_odds(strategy) and not _candidate_has_odds(candidate):
            reasons.append("missing_odds")

        item = dict(candidate)
        item["filter_reasons"] = reasons
        item["rejection_reasons"] = reasons
        if reasons:
            rejected.append(item)
        else:
            filtered.append(item)

    return {
        "generated_at": candidates_payload.get("generated_at"),
        "target_date": candidates_payload.get("target_date"),
        "source_file": candidates_payload.get("source_file"),
        "status": "completed",
        "filter_config": {
            "min_confidence": strategy.min_pick_confidence,
            "allowed_markets": strategy.allowed_markets,
            "market_mode": strategy.market_mode,
            "min_data_quality": strategy.min_data_quality,
            "require_odds_available": strategy.require_odds_available,
            "requires_odds": _strategy_requires_odds(strategy),
        },
        "candidates": filtered,
        "candidate_count": len(filtered),
        "rejected_candidates": rejected,
        "rejected_count": len(rejected),
    }


def filter_candidates_from_file(candidates_file: Path, output_file: Path, strategy: ResolvedStrategyConfig) -> dict[str, Any]:
    ensure_latest_allowed(candidates_file)
    payload = json.loads(candidates_file.read_text(encoding="utf-8"))
    result = filter_candidates(payload, strategy)
    result["source_file"] = str(candidates_file)
    output_file.write_text(json.dumps(result, ensure_ascii=False, indent=2), encoding="utf-8")
    return result

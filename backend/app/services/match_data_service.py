from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from backend.app.api.schemas.match_data import (
    FixtureSummary,
    MarketOddsSummary,
    MatchContextSummary,
    MatchDataNoDataResponse,
    OddsSummary,
    TeamSummary,
)
from backend.app.core.paths import REPO_ROOT
from betauto.runtime_mode import ensure_latest_allowed

ORCHESTRATOR_RUNS_DIR = REPO_ROOT / "data" / "orchestrator_runs"


def _context_files() -> list[Path]:
    if not ORCHESTRATOR_RUNS_DIR.exists():
        return []
    return sorted(
        ORCHESTRATOR_RUNS_DIR.glob("*/analysis_context.json"),
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )


def _load_context(path: Path) -> dict[str, Any]:
    ensure_latest_allowed(path)
    return json.loads(path.read_text(encoding="utf-8"))


def find_context_for_date(target_date: str) -> tuple[Path, dict[str, Any]] | None:
    for path in _context_files():
        payload = _load_context(path)
        if payload.get("target_date") == target_date:
            return path, payload
    return None


def find_recent_context() -> tuple[Path, dict[str, Any]] | None:
    for path in _context_files():
        payload = _load_context(path)
        if payload.get("target_date"):
            return path, payload
    return None


def _run_id(path: Path) -> str:
    return path.parent.name


def _league(payload: dict[str, Any]) -> dict[str, Any]:
    league = payload.get("league")
    return league if isinstance(league, dict) else {}


def _team(value: Any) -> TeamSummary:
    data = value if isinstance(value, dict) else {}
    return TeamSummary(id=data.get("id"), name=str(data.get("name") or "Unknown"))


def _fixture(path: Path, payload: dict[str, Any], match: dict[str, Any]) -> FixtureSummary:
    target_date = str(payload.get("target_date") or "")
    league = _league(payload)
    markets = ((match.get("odds") or {}).get("markets") or [])
    return FixtureSummary(
        target_date=target_date,
        source_run_id=_run_id(path),
        source_file=str(path),
        league_id=league.get("id"),
        league_name=league.get("name"),
        fixture_id=int(match.get("fixture_id") or 0),
        home_team=_team(match.get("home_team")),
        away_team=_team(match.get("away_team")),
        kickoff=match.get("kickoff_time"),
        odds_markets_count=len(markets) if isinstance(markets, list) else 0,
    )


def no_data(target_date: str | None, message: str | None = None) -> MatchDataNoDataResponse:
    return MatchDataNoDataResponse(
        target_date=target_date,
        message=message or f"No match data found for target date {target_date}",
    )


def context_summary_for_date(target_date: str) -> MatchContextSummary | MatchDataNoDataResponse:
    found = find_context_for_date(target_date)
    if found is None:
        return no_data(target_date)
    path, payload = found
    matches = [match for match in payload.get("matches", []) if isinstance(match, dict)]
    if not matches:
        return no_data(target_date, f"No matches found for target date {target_date}")
    league = _league(payload)
    fixtures = [_fixture(path, payload, match) for match in matches]
    return MatchContextSummary(
        target_date=target_date,
        source_run_id=_run_id(path),
        source_file=str(path),
        league_id=league.get("id"),
        league_name=league.get("name"),
        matches_count=len(fixtures),
        fixtures=fixtures,
    )


def fixtures_for_date(target_date: str, league_id: int | None = None) -> list[FixtureSummary] | MatchDataNoDataResponse:
    summary = context_summary_for_date(target_date)
    if isinstance(summary, MatchDataNoDataResponse):
        return summary
    if league_id is None:
        return summary.fixtures
    fixtures = [fixture for fixture in summary.fixtures if fixture.league_id == league_id]
    if not fixtures:
        return no_data(target_date, f"No fixtures found for target date {target_date} and league_id {league_id}")
    return fixtures


def odds_for_fixture(fixture_id: int, target_date: str | None = None) -> OddsSummary | MatchDataNoDataResponse:
    found = find_context_for_date(target_date) if target_date else find_recent_context()
    if found is None:
        return no_data(target_date, "No strict run artifact found. Provide a date after creating a run.")
    path, payload = found
    for match in payload.get("matches", []):
        if not isinstance(match, dict) or int(match.get("fixture_id") or 0) != fixture_id:
            continue
        odds = match.get("odds") if isinstance(match.get("odds"), dict) else {}
        bookmaker = odds.get("bookmaker") if isinstance(odds.get("bookmaker"), dict) else {}
        markets = [
            MarketOddsSummary(
                market_id=market.get("id"),
                name=str(market.get("name") or "Unknown"),
                values=market.get("values") if isinstance(market.get("values"), list) else [],
            )
            for market in odds.get("markets", [])
            if isinstance(market, dict)
        ]
        return OddsSummary(
            fixture_id=fixture_id,
            target_date=str(payload.get("target_date") or ""),
            source_run_id=_run_id(path),
            source_file=str(path),
            bookmaker_id=bookmaker.get("id"),
            bookmaker_name=bookmaker.get("name"),
            markets=markets,
            status="available" if markets else "no_odds",
        )
    return no_data(target_date or payload.get("target_date"), f"No odds found for fixture_id {fixture_id}")

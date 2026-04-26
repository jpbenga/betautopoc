from __future__ import annotations

import os
from datetime import date, datetime, timezone
from typing import Any

from dotenv import load_dotenv
import requests

from .api_football_client import ApiFootballClient
from .models import AnalysisContext, MatchContext, QuantitativeContext
from .normalizer import (
    normalize_fixture,
    normalize_head_to_head,
    normalize_injuries,
    normalize_lineups,
    normalize_odds,
    normalize_predictions,
    normalize_recent_form,
    normalize_standings_for_team,
    normalize_team,
    normalize_team_statistics,
)
from .qualitative import empty_qualitative_context


class AnalysisContextBuilder:
    def __init__(
        self,
        api_key: str | None = None,
        base_url: str | None = None,
        league_id: int | None = None,
        season: int | None = None,
        bookmaker_id: int | None = None,
        bookmaker_name: str | None = None,
    ) -> None:
        load_dotenv()
        self.api_key = api_key or os.getenv("API_FOOTBALL_KEY", "")
        self.base_url = base_url or os.getenv("API_FOOTBALL_BASE_URL", "https://v3.football.api-sports.io")
        self.league_id = league_id or int(os.getenv("API_FOOTBALL_LEAGUE_ID", "39"))
        self.season = season or int(os.getenv("API_FOOTBALL_SEASON", "2025"))
        self.bookmaker_id = bookmaker_id or int(os.getenv("API_FOOTBALL_BOOKMAKER_ID", "16"))
        self.bookmaker_name = bookmaker_name or os.getenv("API_FOOTBALL_BOOKMAKER_NAME", "Unibet")

        self.client = ApiFootballClient(api_key=self.api_key, base_url=self.base_url)

    def _safe_call(self, fn: Any, *args: Any, **kwargs: Any) -> dict[str, Any]:
        try:
            return fn(*args, **kwargs)
        except requests.RequestException:
            return {"response": []}
        except ValueError:
            return {"response": []}

    def _readiness(self, fixture_exists: bool, standings_ready: bool, team_stats_ready: bool, odds_ready: bool) -> dict[str, Any]:
        missing: list[str] = []
        warnings: list[str] = []
        if not fixture_exists:
            missing.append("fixture")
        if not standings_ready:
            missing.append("standings")
        if not team_stats_ready:
            missing.append("team_statistics")
        if not odds_ready:
            missing.append("odds")

        if fixture_exists and standings_ready and team_stats_ready and odds_ready:
            status = "ready"
        elif fixture_exists and odds_ready:
            status = "partial"
            warnings.append("Some quantitative sources are missing.")
        else:
            status = "insufficient"
            warnings.append("Missing fixture or odds prevents reliable analysis.")

        return {"status": status, "missing_data": missing, "warnings": warnings}

    def build(self, target_date: str | None = None) -> dict[str, Any]:
        if target_date is None:
            target_date = os.getenv("ANALYSIS_CONTEXT_DATE") or date.today().isoformat()

        fixtures_raw = self._safe_call(self.client.get_fixtures, target_date, self.league_id, self.season)
        fixtures = fixtures_raw.get("response", [])
        standings_raw = self._safe_call(self.client.get_standings, self.league_id, self.season)

        matches: list[MatchContext] = []

        for fixture_item in fixtures:
            fixture_data = normalize_fixture(fixture_item)
            fixture_id = fixture_data.get("fixture_id")
            home_data = fixture_data.get("home_team", {})
            away_data = fixture_data.get("away_team", {})
            home_team = normalize_team(home_data)
            away_team = normalize_team(away_data)

            home_team.standings = normalize_standings_for_team(standings_raw, home_team.id)
            away_team.standings = normalize_standings_for_team(standings_raw, away_team.id)

            home_stats_raw = self._safe_call(self.client.get_team_statistics, home_team.id, self.league_id, self.season)
            away_stats_raw = self._safe_call(self.client.get_team_statistics, away_team.id, self.league_id, self.season)
            home_team.season_statistics = normalize_team_statistics(home_stats_raw)
            away_team.season_statistics = normalize_team_statistics(away_stats_raw)

            home_recent_raw = self._safe_call(self.client.get_recent_fixtures, home_team.id, 5)
            away_recent_raw = self._safe_call(self.client.get_recent_fixtures, away_team.id, 5)
            home_team.recent_form = normalize_recent_form(home_recent_raw, home_team.id)
            away_team.recent_form = normalize_recent_form(away_recent_raw, away_team.id)

            head_to_head_raw = self._safe_call(self.client.get_head_to_head, home_team.id, away_team.id, 10)
            injuries_raw = self._safe_call(self.client.get_injuries, fixture_id)
            lineups_raw = self._safe_call(self.client.get_lineups, fixture_id)
            predictions_raw = self._safe_call(self.client.get_predictions, fixture_id)
            odds_raw = self._safe_call(self.client.get_odds, fixture_id, self.bookmaker_id)
            fixture_stats_raw = self._safe_call(self.client.get_fixture_statistics, fixture_id)
            fixture_events_raw = self._safe_call(self.client.get_fixture_events, fixture_id)

            home_team.injuries = normalize_injuries(injuries_raw, home_team.id)
            away_team.injuries = normalize_injuries(injuries_raw, away_team.id)
            home_team.lineup = normalize_lineups(lineups_raw, home_team.id)
            away_team.lineup = normalize_lineups(lineups_raw, away_team.id)

            odds = normalize_odds(odds_raw, self.bookmaker_id, self.bookmaker_name)
            predictions = normalize_predictions(predictions_raw)

            standings_ready = bool(home_team.standings and away_team.standings)
            team_stats_ready = bool(home_team.season_statistics and away_team.season_statistics)
            odds_ready = bool(odds.markets)
            readiness = self._readiness(bool(fixture_id), standings_ready, team_stats_ready, odds_ready)

            quantitative_notes: list[str] = []
            if not standings_ready:
                quantitative_notes.append("Standings missing for one or both teams.")
            if not team_stats_ready:
                quantitative_notes.append("Team statistics missing for one or both teams.")
            if not odds_ready:
                quantitative_notes.append("No odds available for the configured bookmaker.")

            match = MatchContext(
                fixture_id=fixture_id,
                kickoff_time=fixture_data.get("kickoff_time", ""),
                competition=fixture_data.get("competition", "Unknown competition"),
                home_team=home_team,
                away_team=away_team,
                head_to_head=normalize_head_to_head(head_to_head_raw),
                predictions=predictions,
                odds=odds,
                fixture_statistics=fixture_stats_raw.get("response", []),
                fixture_events=fixture_events_raw.get("response", []),
                quantitative_summary=QuantitativeContext(available=odds_ready, notes=quantitative_notes),
                qualitative_context=empty_qualitative_context(),
                analysis_readiness=readiness,
            )
            matches.append(match)

        context = AnalysisContext(
            generated_at=datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
            target_date=target_date,
            source={"api_football": True, "qualitative_sources": False},
            league={"id": self.league_id, "name": "Premier League", "season": self.season},
            matches=matches,
            api_calls=self.client.call_logs,
        )
        return context.to_dict()

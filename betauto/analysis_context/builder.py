from __future__ import annotations

import os
from datetime import date, datetime, timezone
from typing import Any, Callable

from dotenv import load_dotenv
import requests

from betauto.api_clients.errors import ExternalApiError

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
        league_ids: list[int] | None = None,
        league_metadata: list[dict[str, Any]] | None = None,
        season: int | None = None,
        bookmaker_id: int | None = None,
        bookmaker_name: str | None = None,
        log_callback: Callable[[str], None] | None = None,
    ) -> None:
        load_dotenv()
        self.api_key = api_key or os.getenv("API_FOOTBALL_KEY", "")
        self.base_url = base_url or os.getenv("API_FOOTBALL_BASE_URL", "https://v3.football.api-sports.io")
        self.league_id = league_id if league_id is not None else int(os.getenv("API_FOOTBALL_LEAGUE_ID", "39"))
        self.league_ids = league_ids or [self.league_id]
        self.league_metadata = league_metadata or []
        self.season = season
        self.bookmaker_id = (
            bookmaker_id if bookmaker_id is not None else int(os.getenv("API_FOOTBALL_BOOKMAKER_ID", "16"))
        )
        self.bookmaker_name = bookmaker_name or os.getenv("API_FOOTBALL_BOOKMAKER_NAME", "Unibet")
        self.log_callback = log_callback

        self.client = ApiFootballClient(api_key=self.api_key, base_url=self.base_url)

    def _emit(self, message: str) -> None:
        if self.log_callback:
            self.log_callback(message)

    def _league_meta(self, league_id: int) -> dict[str, Any]:
        for item in self.league_metadata:
            if item.get("league_id") == league_id:
                return item
        return {"league_id": league_id, "competition_name": f"League {league_id}", "country": None}

    def _safe_call(self, fn: Any, *args: Any, **kwargs: Any) -> dict[str, Any]:
        try:
            return fn(*args, **kwargs)
        except (requests.RequestException, ExternalApiError):
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

        matches: list[MatchContext] = []
        trace: dict[str, Any] = {
            "active_leagues_count": len(self.league_ids),
            "active_league_ids": self.league_ids,
            "fixture_fetch_mode": "date_first_then_local_league_filter",
            "fixture_fetch_uses_season": False,
            "season_source": "fixture_response",
            "configured_season": self.season,
            "fixtures_fetched_for_date_total": 0,
            "fixtures_fetched_by_league": [],
            "fixtures_fetched_total": 0,
            "fixtures_in_context_count": 0,
            "matches_skipped_count": 0,
            "matches_skipped_reasons": [],
        }
        active_league_ids = set(self.league_ids)
        fixtures_by_league: dict[int, list[dict[str, Any]]] = {league_id: [] for league_id in self.league_ids}
        self._emit(f"[coverage] récupération des fixtures par date: {target_date}")
        fixtures_raw = self._safe_call(self.client.get_fixtures_by_date, target_date)
        date_fixtures = fixtures_raw.get("response", [])
        if not isinstance(date_fixtures, list):
            date_fixtures = []
        trace["fixtures_fetched_for_date_total"] = len(date_fixtures)
        self._emit(f"[coverage] {len(date_fixtures)} fixtures retournées par API-Football pour {target_date}")
        for fixture_item in date_fixtures:
            if not isinstance(fixture_item, dict):
                continue
            league = fixture_item.get("league") if isinstance(fixture_item.get("league"), dict) else {}
            league_id = league.get("id")
            if isinstance(league_id, int) and league_id in active_league_ids:
                fixtures_by_league.setdefault(league_id, []).append(fixture_item)
        matched_total = sum(len(items) for items in fixtures_by_league.values())
        self._emit(
            f"[coverage] {matched_total} fixtures correspondent aux {len(self.league_ids)} ligues actives BetAuto"
        )

        for league_id in self.league_ids:
            league_meta = self._league_meta(league_id)
            fixtures = fixtures_by_league.get(league_id, [])
            self._emit(
                "[coverage] "
                f"{len(fixtures)} fixtures candidates pour {league_meta.get('competition_name') or f'League {league_id}'} "
                f"({league_meta.get('country') or 'Unknown country'}, league_id={league_id})"
            )
            standings_by_season: dict[int, dict[str, Any]] = {}
            league_trace = {
                "league_id": league_id,
                "competition_name": league_meta.get("competition_name"),
                "country": league_meta.get("country"),
                "fixtures_fetched": len(fixtures),
                "fixtures_in_context": 0,
                "seasons_from_fixtures": [],
                "matches_skipped_count": 0,
                "matches_skipped_reasons": [],
            }
            trace["fixtures_fetched_total"] += len(fixtures)

            for fixture_item in fixtures:
                fixture_data = normalize_fixture(fixture_item)
                fixture_id = fixture_data.get("fixture_id")
                if not fixture_id:
                    reason = {"league_id": league_id, "reason": "missing_fixture_id"}
                    league_trace["matches_skipped_count"] += 1
                    league_trace["matches_skipped_reasons"].append(reason)
                    trace["matches_skipped_count"] += 1
                    trace["matches_skipped_reasons"].append(reason)
                    continue
                season_for_match = fixture_data.get("season")
                if not isinstance(season_for_match, int):
                    season_for_match = None
                if season_for_match not in league_trace["seasons_from_fixtures"]:
                    league_trace["seasons_from_fixtures"].append(season_for_match)
                if season_for_match is not None and season_for_match not in standings_by_season:
                    standings_by_season[season_for_match] = self._safe_call(
                        self.client.get_standings,
                        league_id,
                        season_for_match,
                    )
                standings_raw = standings_by_season.get(season_for_match, {"response": []})

                home_data = fixture_data.get("home_team", {})
                away_data = fixture_data.get("away_team", {})
                home_team = normalize_team(home_data)
                away_team = normalize_team(away_data)

                home_team.standings = normalize_standings_for_team(standings_raw, home_team.id)
                away_team.standings = normalize_standings_for_team(standings_raw, away_team.id)

                if season_for_match is None:
                    home_stats_raw = {"response": {}}
                    away_stats_raw = {"response": {}}
                else:
                    home_stats_raw = self._safe_call(self.client.get_team_statistics, home_team.id, league_id, season_for_match)
                    away_stats_raw = self._safe_call(self.client.get_team_statistics, away_team.id, league_id, season_for_match)
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
                readiness = self._readiness(True, standings_ready, team_stats_ready, odds_ready)

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
                    league_id=league_id,
                    season=season_for_match,
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
                league_trace["fixtures_in_context"] += 1

            trace["fixtures_fetched_by_league"].append(league_trace)

        trace["fixtures_in_context_count"] = len(matches)

        context = AnalysisContext(
            generated_at=datetime.now(timezone.utc).replace(microsecond=0).isoformat(),
            target_date=target_date,
            source={"api_football": True, "qualitative_sources": False},
            league={
                "id": self.league_ids[0] if self.league_ids else None,
                "name": "multiple" if len(self.league_ids) > 1 else self._league_meta(self.league_ids[0]).get("competition_name"),
                "season": None,
                "season_source": "fixture_response",
            },
            leagues=[
                {
                    "id": league_id,
                    "name": self._league_meta(league_id).get("competition_name"),
                    "country": self._league_meta(league_id).get("country"),
                    "season_source": "fixture_response",
                }
                for league_id in self.league_ids
            ],
            matches=matches,
            api_calls=self.client.call_logs,
            pipeline_trace=trace,
        )
        return context.to_dict()

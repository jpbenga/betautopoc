from __future__ import annotations

from dataclasses import asdict
from typing import Any

import requests

from .models import ApiCallLog


class ApiFootballClient:
    def __init__(self, api_key: str, base_url: str) -> None:
        if not api_key:
            raise ValueError("API_FOOTBALL_KEY is required.")
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.timeout = 20
        self.call_logs: list[ApiCallLog] = []

    def _request(self, endpoint: str, params: dict[str, Any]) -> dict[str, Any]:
        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        headers = {
            "x-apisports-key": self.api_key,
        }
        log = ApiCallLog(endpoint=endpoint, params=params)
        try:
            response = requests.get(url, headers=headers, params=params, timeout=self.timeout)
            log.status_code = response.status_code
            response.raise_for_status()
            payload = response.json()
            if isinstance(payload, dict):
                response_items = payload.get("response")
                if isinstance(response_items, list):
                    log.response_items = len(response_items)
            log.success = True
            return payload
        except requests.RequestException as error:
            log.error = str(error)
            raise
        except ValueError as error:
            log.error = f"Invalid JSON response: {error}"
            raise
        finally:
            self.call_logs.append(log)

    def export_logs(self) -> list[dict[str, Any]]:
        return [asdict(item) for item in self.call_logs]

    def get_fixtures(self, date: str, league_id: int, season: int) -> dict[str, Any]:
        return self._request("fixtures", {"date": date, "league": league_id, "season": season})

    def get_standings(self, league_id: int, season: int) -> dict[str, Any]:
        return self._request("standings", {"league": league_id, "season": season})

    def get_team_statistics(self, team_id: int, league_id: int, season: int) -> dict[str, Any]:
        return self._request("teams/statistics", {"team": team_id, "league": league_id, "season": season})

    def get_recent_fixtures(self, team_id: int, last: int = 5) -> dict[str, Any]:
        return self._request("fixtures", {"team": team_id, "last": last})

    def get_head_to_head(self, home_team_id: int, away_team_id: int, last: int = 10) -> dict[str, Any]:
        h2h = f"{home_team_id}-{away_team_id}"
        return self._request("fixtures/headtohead", {"h2h": h2h, "last": last})

    def get_injuries(self, fixture_id: int) -> dict[str, Any]:
        return self._request("injuries", {"fixture": fixture_id})

    def get_lineups(self, fixture_id: int) -> dict[str, Any]:
        return self._request("fixtures/lineups", {"fixture": fixture_id})

    def get_predictions(self, fixture_id: int) -> dict[str, Any]:
        return self._request("predictions", {"fixture": fixture_id})

    def get_odds(self, fixture_id: int, bookmaker_id: int) -> dict[str, Any]:
        return self._request("odds", {"fixture": fixture_id, "bookmaker": bookmaker_id})

    def get_fixture_statistics(self, fixture_id: int) -> dict[str, Any]:
        return self._request("fixtures/statistics", {"fixture": fixture_id})

    def get_fixture_events(self, fixture_id: int) -> dict[str, Any]:
        return self._request("fixtures/events", {"fixture": fixture_id})

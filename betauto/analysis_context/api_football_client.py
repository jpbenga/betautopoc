from __future__ import annotations

import logging
import os
import time
from dataclasses import asdict
from typing import Any

import requests

from betauto.api_clients.errors import (
    ExternalApiClientError,
    ExternalApiError,
    ExternalApiPermanentError,
    ExternalApiRateLimitError,
    ExternalApiServerError,
    ExternalApiTimeoutError,
)
from betauto.api_clients.retry import retry_with_backoff

from .models import ApiCallLog

logger = logging.getLogger(__name__)


class ApiFootballClient:
    def __init__(self, api_key: str, base_url: str) -> None:
        if not api_key:
            raise ValueError("API_FOOTBALL_KEY is required.")
        self.api_key = api_key
        self.base_url = base_url.rstrip("/")
        self.timeout = float(os.getenv("API_FOOTBALL_TIMEOUT_SECONDS", "30"))
        self.max_retries = int(os.getenv("API_FOOTBALL_MAX_RETRIES", "4"))
        self.initial_backoff = float(os.getenv("API_FOOTBALL_INITIAL_BACKOFF_SECONDS", "1"))
        self.max_backoff = float(os.getenv("API_FOOTBALL_MAX_BACKOFF_SECONDS", "30"))
        self.sleep_between_requests = float(os.getenv("API_FOOTBALL_SLEEP_BETWEEN_REQUESTS_SECONDS", "0.25"))
        self.call_logs: list[ApiCallLog] = []

    def _extract_retry_after(self, response: requests.Response | None) -> float | None:
        if response is None:
            return None
        retry_after = response.headers.get("Retry-After") or response.headers.get("retry-after")
        if retry_after:
            try:
                return float(retry_after)
            except (TypeError, ValueError):
                return None
        return None

    def _map_requests_error(self, endpoint: str, error: Exception) -> ExternalApiError:
        if isinstance(error, requests.Timeout):
            return ExternalApiTimeoutError(
                provider="api_football",
                operation=endpoint,
                message="Timeout while calling API-Football.",
                raw_error=error,
            )

        if isinstance(error, requests.HTTPError):
            response = error.response
            status_code = response.status_code if response is not None else None
            retry_after = self._extract_retry_after(response)

            if status_code == 429:
                return ExternalApiRateLimitError(
                    provider="api_football",
                    operation=endpoint,
                    message="API-Football rate limited request.",
                    status_code=status_code,
                    retry_after_seconds=retry_after,
                    raw_error=error,
                )

            if status_code in {500, 502, 503, 504}:
                return ExternalApiServerError(
                    provider="api_football",
                    operation=endpoint,
                    message="Temporary API-Football server error.",
                    status_code=status_code,
                    retry_after_seconds=retry_after,
                    raw_error=error,
                )

            if status_code in {400, 401, 403, 404}:
                return ExternalApiPermanentError(
                    provider="api_football",
                    operation=endpoint,
                    message="Non-retryable API-Football client error.",
                    status_code=status_code,
                    raw_error=error,
                )

            return ExternalApiClientError(
                provider="api_football",
                operation=endpoint,
                message=str(error),
                status_code=status_code,
                retry_after_seconds=retry_after,
                raw_error=error,
            )

        if isinstance(error, requests.RequestException):
            return ExternalApiServerError(
                provider="api_football",
                operation=endpoint,
                message="Network error while calling API-Football.",
                raw_error=error,
            )

        return ExternalApiClientError(
            provider="api_football",
            operation=endpoint,
            message=str(error),
            raw_error=error,
        )

    def _should_retry(self, error: Exception) -> bool:
        return isinstance(error, (ExternalApiRateLimitError, ExternalApiTimeoutError, ExternalApiServerError))

    def _request(self, endpoint: str, params: dict[str, Any]) -> dict[str, Any]:
        if self.sleep_between_requests > 0:
            time.sleep(self.sleep_between_requests)

        url = f"{self.base_url}/{endpoint.lstrip('/')}"
        headers = {
            "x-apisports-key": self.api_key,
        }

        log = ApiCallLog(endpoint=endpoint, params=dict(params))
        start = time.perf_counter()
        retry_count = 0

        def _operation() -> dict[str, Any]:
            nonlocal retry_count
            try:
                response = requests.get(url, headers=headers, params=params, timeout=self.timeout)
                log.status_code = response.status_code
                log.requests_remaining = int(response.headers.get("X-RateLimit-Requests-Remaining", "0") or 0) or None
                log.requests_limit = int(response.headers.get("X-RateLimit-Requests-Limit", "0") or 0) or None
                log.quota_reset = response.headers.get("X-RateLimit-Reset")
                response.raise_for_status()
                payload = response.json()
                if isinstance(payload, dict):
                    response_items = payload.get("response")
                    if isinstance(response_items, list):
                        log.response_items = len(response_items)
                return payload
            except requests.RequestException as exc:
                retry_count += 1
                raise self._map_requests_error(endpoint, exc) from exc

        try:
            payload = retry_with_backoff(
                _operation,
                should_retry=self._should_retry,
                max_retries=self.max_retries,
                initial_backoff=self.initial_backoff,
                max_backoff=self.max_backoff,
                logger=logger,
                operation_name=f"api_football.{endpoint}",
            )
            log.success = True
            return payload
        except ExternalApiError as error:
            log.error = str(error)
            raise
        finally:
            log.retry_count = max(0, retry_count - 1)
            log.duration_seconds = round(time.perf_counter() - start, 3)
            self.call_logs.append(log)
            logger.info(
                "[api_football] GET /%s status=%s duration=%.2fs retries=%s params=%s",
                endpoint,
                log.status_code,
                log.duration_seconds or 0,
                log.retry_count,
                {k: v for k, v in params.items() if "key" not in k.lower()},
            )

    def export_logs(self) -> list[dict[str, Any]]:
        return [asdict(item) for item in self.call_logs]

    def get_fixtures(self, date: str, league_id: int, season: int | None = None) -> dict[str, Any]:
        params: dict[str, Any] = {"date": date, "league": league_id}
        if season is not None:
            params["season"] = season
        return self._request("fixtures", params)

    def get_fixtures_by_date(self, date: str) -> dict[str, Any]:
        return self._request("fixtures", {"date": date})

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

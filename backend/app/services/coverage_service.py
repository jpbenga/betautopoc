from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

from backend.app.api.schemas.coverage import (
    FootballLeagueRegistryEntry,
    FootballLeagueRegistryResponse,
    FootballLeagueToggleResponse,
)
from backend.app.core.paths import REPO_ROOT
from betauto.runtime_mode import ensure_latest_allowed

REGISTRY_PATH = REPO_ROOT / "config" / "coverage" / "football_leagues.json"


def _read_registry(path: Path = REGISTRY_PATH) -> dict[str, Any] | None:
    if not path.exists():
        return None
    ensure_latest_allowed(path)
    payload = json.loads(path.read_text(encoding="utf-8"))
    return payload if isinstance(payload, dict) else None


def football_leagues_response() -> FootballLeagueRegistryResponse:
    payload = _read_registry()
    if not payload:
        return FootballLeagueRegistryResponse(
            status="no_data",
            source="api-football",
            notes=f"Football coverage registry not found at {REGISTRY_PATH}.",
        )

    raw_leagues = payload.get("leagues")
    if not isinstance(raw_leagues, list):
        raw_leagues = []

    leagues = [FootballLeagueRegistryEntry(**item) for item in raw_leagues if isinstance(item, dict)]
    return FootballLeagueRegistryResponse(
        status="available" if leagues else "no_data",
        version=payload.get("version") if isinstance(payload.get("version"), int) else None,
        source=str(payload.get("source") or "api-football"),
        generated_at=payload.get("generated_at") if isinstance(payload.get("generated_at"), str) else None,
        verification_status=payload.get("verification_status")
        if isinstance(payload.get("verification_status"), str)
        else None,
        notes=payload.get("notes") if isinstance(payload.get("notes"), str) else None,
        leagues=leagues,
        total_count=len(leagues),
        enabled_count=sum(1 for league in leagues if league.enabled),
        verified_count=sum(1 for league in leagues if league.league_id is not None),
    )


def update_football_league_enabled(league_id: int, enabled: bool, path: Path = REGISTRY_PATH) -> FootballLeagueToggleResponse:
    payload = _read_registry(path)
    if not payload:
        raise FileNotFoundError(f"Football coverage registry not found at {path}.")

    raw_leagues = payload.get("leagues")
    if not isinstance(raw_leagues, list):
        raise ValueError("Football coverage registry is invalid: 'leagues' must be a list.")

    updated_entry: dict[str, Any] | None = None
    for item in raw_leagues:
        if not isinstance(item, dict):
            continue
        if item.get("league_id") == league_id:
            item["enabled"] = enabled
            updated_entry = item
            break

    if updated_entry is None:
        raise LookupError(f"League with league_id={league_id} was not found in coverage registry.")

    payload["updated_at"] = datetime.now(timezone.utc).isoformat()
    path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

    leagues = [FootballLeagueRegistryEntry(**item) for item in raw_leagues if isinstance(item, dict)]
    updated_model = FootballLeagueRegistryEntry(**updated_entry)
    return FootballLeagueToggleResponse(
        status="updated",
        league=updated_model,
        total_count=len(leagues),
        enabled_count=sum(1 for league in leagues if league.enabled),
    )

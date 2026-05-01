from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from backend.app.api.schemas.coverage import (
    FootballLeagueRegistryEntry,
    FootballLeagueRegistryResponse,
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

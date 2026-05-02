from __future__ import annotations

from fastapi import APIRouter, HTTPException

from backend.app.api.schemas.coverage import (
    FootballLeagueRegistryResponse,
    FootballLeagueToggleRequest,
    FootballLeagueToggleResponse,
)
from backend.app.services.coverage_service import football_leagues_response, update_football_league_enabled

router = APIRouter(prefix="/api/coverage", tags=["coverage"])


@router.get("/football/leagues", response_model=FootballLeagueRegistryResponse)
async def get_football_leagues():
    return football_leagues_response()


@router.patch("/football/leagues/{league_id}", response_model=FootballLeagueToggleResponse)
async def patch_football_league(league_id: int, payload: FootballLeagueToggleRequest):
    try:
        return update_football_league_enabled(league_id, payload.enabled)
    except FileNotFoundError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except LookupError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc
    except ValueError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc

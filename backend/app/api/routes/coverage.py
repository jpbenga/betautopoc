from __future__ import annotations

from fastapi import APIRouter

from backend.app.api.schemas.coverage import FootballLeagueRegistryResponse
from backend.app.services.coverage_service import football_leagues_response

router = APIRouter(prefix="/api/coverage", tags=["coverage"])


@router.get("/football/leagues", response_model=FootballLeagueRegistryResponse)
async def get_football_leagues():
    return football_leagues_response()

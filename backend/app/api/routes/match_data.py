from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Query, status

from backend.app.api.schemas.match_data import (
    FixtureSummary,
    MatchContextSummary,
    MatchDataNoDataResponse,
    OddsSummary,
    ProviderQuotaSummary,
    RebuildContextRequest,
    RebuildContextResponse,
)
from backend.app.services.match_data_service import (
    context_summary_for_date,
    fixtures_for_date,
    odds_for_fixture,
)

router = APIRouter(prefix="/api/match-data", tags=["match-data"])


@router.get("/context/latest", response_model=MatchContextSummary | MatchDataNoDataResponse)
async def get_context_latest(date: Annotated[str, Query(min_length=10, max_length=10)]):
    return context_summary_for_date(date)


@router.get("/fixtures", response_model=list[FixtureSummary] | MatchDataNoDataResponse)
async def get_fixtures(
    date: Annotated[str, Query(min_length=10, max_length=10)],
    league_id: int | None = None,
):
    return fixtures_for_date(date, league_id)


@router.get("/odds", response_model=OddsSummary | MatchDataNoDataResponse)
async def get_odds(
    fixture_id: int,
    date: Annotated[str | None, Query(min_length=10, max_length=10)] = None,
):
    return odds_for_fixture(fixture_id, date)


@router.get("/providers/api-football/quota", response_model=ProviderQuotaSummary)
async def get_api_football_quota():
    return ProviderQuotaSummary(
        status="unavailable",
        message="API-Football quota is not exposed by current strict run artifacts.",
        source="run_artifacts",
    )


@router.post(
    "/context/rebuild",
    response_model=RebuildContextResponse,
    status_code=status.HTTP_501_NOT_IMPLEMENTED,
)
async def rebuild_context(request: RebuildContextRequest):
    return RebuildContextResponse(
        status="planned",
        target_date=request.date,
        message="Context rebuild is planned. Use POST /api/run to create strict run artifacts.",
    )

from __future__ import annotations

from fastapi import APIRouter, HTTPException

from backend.app.api.schemas.agents import (
    AgentDetail,
    AgentJobsResponse,
    AgentListResponse,
    AgentLogsResponse,
    AgentResourcesResponse,
    AgentsNoDataResponse,
    BrowserSessionsResponse,
)
from backend.app.services.agents_service import (
    agent_detail,
    agents_response,
    browser_sessions_response,
    jobs_response,
    logs_response,
    resources_response,
)

router = APIRouter(prefix="/api/agents", tags=["agents"])


@router.get("", response_model=AgentListResponse | AgentsNoDataResponse)
async def get_agents():
    return agents_response()


@router.get("/jobs", response_model=AgentJobsResponse | AgentsNoDataResponse)
async def get_agent_jobs():
    return jobs_response()


@router.get("/logs", response_model=AgentLogsResponse | AgentsNoDataResponse)
async def get_agent_logs():
    return logs_response()


@router.get("/resources", response_model=AgentResourcesResponse | AgentsNoDataResponse)
async def get_agent_resources():
    return resources_response()


@router.get("/browser-use/sessions", response_model=BrowserSessionsResponse)
async def get_browser_use_sessions():
    return browser_sessions_response()


@router.get("/{agent_id}", response_model=AgentDetail)
async def get_agent(agent_id: str):
    detail = agent_detail(agent_id)
    if detail is None:
        raise HTTPException(status_code=404, detail="Agent introuvable.")
    return detail

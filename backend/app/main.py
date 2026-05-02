from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles

from backend.app.api.routes.agents import router as agents_router
from backend.app.api.routes.analysis import router as analysis_router
from backend.app.api.routes.bankroll import router as bankroll_router
from backend.app.api.routes.capabilities import router as capabilities_router
from backend.app.api.routes.costs import router as costs_router
from backend.app.api.routes.coverage import router as coverage_router
from backend.app.api.routes.health import router as health_router
from backend.app.api.routes.jobs import router as jobs_router
from backend.app.api.routes.match_data import router as match_data_router
from backend.app.api.routes.performance import router as performance_router
from backend.app.api.routes.runs import router as runs_router
from backend.app.api.routes.settings import router as settings_router
from backend.app.api.routes.strategy import router as strategy_router
from backend.app.api.routes.tickets import router as tickets_router
from backend.app.core.config import APP_TITLE, CORS_ORIGINS
from backend.app.core.paths import STATIC_DIR

app = FastAPI(title=APP_TITLE)
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.mount("/static", StaticFiles(directory=str(STATIC_DIR)), name="static")


@app.get("/", response_class=HTMLResponse)
async def index():
    return FileResponse(STATIC_DIR / "index.html")


app.include_router(health_router)
app.include_router(capabilities_router)
app.include_router(agents_router)
app.include_router(analysis_router)
app.include_router(bankroll_router)
app.include_router(match_data_router)
app.include_router(costs_router)
app.include_router(coverage_router)
app.include_router(performance_router)
app.include_router(runs_router)
app.include_router(settings_router)
app.include_router(strategy_router)
app.include_router(tickets_router)
app.include_router(jobs_router)

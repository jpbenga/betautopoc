from __future__ import annotations

from fastapi import APIRouter, BackgroundTasks, HTTPException

from backend.app.api.schemas.ticket import (
    TicketAuditLog,
    TicketDetail,
    TicketGenerateRequest,
    TicketGenerateResponse,
    TicketSummary,
)
from backend.app.services.job_service import create_job, resolve_target_date
from backend.app.services.run_service import queue_job_run
from backend.app.services.ticket_service import (
    get_ticket,
    get_ticket_audit_log,
    list_tickets,
)

router = APIRouter(prefix="/api/tickets", tags=["tickets"])


@router.get("", response_model=list[TicketSummary])
async def get_tickets():
    return list_tickets()


@router.get("/{ticket_id}", response_model=TicketDetail)
async def get_ticket_detail(ticket_id: str):
    ticket = get_ticket(ticket_id)
    if ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return ticket


@router.get("/{ticket_id}/audit-log", response_model=TicketAuditLog)
async def get_audit_log(ticket_id: str):
    audit_log = get_ticket_audit_log(ticket_id)
    if audit_log is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return audit_log


@router.post("/generate", response_model=TicketGenerateResponse, status_code=202)
async def generate_ticket(request: TicketGenerateRequest, background_tasks: BackgroundTasks):
    job_id = create_job()
    payload = request.model_dump(exclude_none=True)
    try:
        requested_date = resolve_target_date(payload.get("date"))
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=f"Invalid date format: {exc}") from exc
    queue_job_run(job_id=job_id, data=payload, background_tasks=background_tasks, requested_date=requested_date)
    return TicketGenerateResponse(
        job_id=job_id,
        ticket_id=None,
        status="running",
        target_date=requested_date,
        message="Ticket generation started. Poll /api/job/{job_id}; the ticket appears in /api/tickets when the orchestrator run completes.",
    )

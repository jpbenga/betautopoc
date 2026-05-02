from __future__ import annotations

from typing import Any

from pydantic import Field

from backend.app.api.schemas.common import ContractBaseModel


class TicketPick(ContractBaseModel):
    pick_id: str | None = None
    fixture_id: int | None = None
    event: str | None = None
    competition: str | None = None
    kickoff: str | None = None
    market: str | None = None
    market_canonical_id: str | None = None
    pick: str | None = None
    selection_canonical_id: str | None = None
    confidence_score: int | None = None
    expected_odds_min: float | None = None
    expected_odds_max: float | None = None
    risk_level: str | None = None
    reason: str | None = None
    evidence_summary: dict[str, Any] = Field(default_factory=dict)
    source_match_analysis_id: str | None = None


class TicketSummary(ContractBaseModel):
    ticket_id: str
    run_id: str
    target_date: str | None = None
    status: str
    generated_at: str | None = None
    estimated_combo_odds: float | None = None
    global_confidence_score: int | None = None
    combo_risk_level: str | None = None
    combo_in_target_range: bool | None = None
    picks_count: int = 0
    notes_count: int = 0
    errors_count: int = 0
    competitions: list[str] = Field(default_factory=list)
    source_run_dir: str
    selection_file: str
    data_source_mode: str = "run_artifacts"
    date_consistency_status: str | None = None


class TicketDetail(TicketSummary):
    picks: list[TicketPick] = Field(default_factory=list)
    notes: list[str] = Field(default_factory=list)
    errors: list[str] = Field(default_factory=list)
    selection_config: dict[str, Any] = Field(default_factory=dict)
    metadata: dict[str, Any] = Field(default_factory=dict)


class TicketAuditEntry(ContractBaseModel):
    level: str = "info"
    message: str
    code: str | None = None


class TicketAuditLog(ContractBaseModel):
    ticket_id: str
    run_id: str
    entries: list[TicketAuditEntry] = Field(default_factory=list)
    metadata: dict[str, Any] = Field(default_factory=dict)


class TicketGenerateRequest(ContractBaseModel):
    date: str | None = None
    strategy_file: str | None = None
    max_matches: int | None = None
    sleep_between_matches: float | None = None
    with_browser: bool | None = None


class TicketGenerateResponse(ContractBaseModel):
    job_id: str
    ticket_id: str | None = None
    status: str
    target_date: str
    message: str

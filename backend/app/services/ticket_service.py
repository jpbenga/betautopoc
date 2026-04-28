from __future__ import annotations

import json
from pathlib import Path
from typing import Any

from backend.app.api.schemas.ticket import (
    TicketAuditEntry,
    TicketAuditLog,
    TicketDetail,
    TicketPick,
    TicketSummary,
)
from backend.app.core.paths import REPO_ROOT
from betauto.runtime_mode import ensure_latest_allowed

ORCHESTRATOR_RUNS_DIR = REPO_ROOT / "data" / "orchestrator_runs"
TICKET_PREFIX = "ticket_"


def ticket_id_from_run_id(run_id: str) -> str:
    return f"{TICKET_PREFIX}{run_id}"


def run_id_from_ticket_id(ticket_id: str) -> str:
    return ticket_id.removeprefix(TICKET_PREFIX)


def _run_dirs() -> list[Path]:
    if not ORCHESTRATOR_RUNS_DIR.exists():
        return []
    return sorted(
        [path for path in ORCHESTRATOR_RUNS_DIR.iterdir() if path.is_dir()],
        key=lambda path: path.stat().st_mtime,
        reverse=True,
    )


def _read_json(path: Path) -> dict[str, Any]:
    ensure_latest_allowed(path)
    return json.loads(path.read_text(encoding="utf-8"))


def _selection_file(run_dir: Path, summary: dict[str, Any]) -> Path:
    files = summary.get("files") if isinstance(summary.get("files"), dict) else {}
    candidate = files.get("selection") or summary.get("selection_file") or "selection.json"
    path = Path(str(candidate))
    if not path.is_absolute():
        path = REPO_ROOT / path
    path = path.resolve()
    run_dir_resolved = run_dir.resolve()
    if not path.is_relative_to(run_dir_resolved):
        raise RuntimeError("Run data mismatch: selection file is outside current run_dir")
    if path.name != "selection.json":
        raise RuntimeError("Run data mismatch: ticketing only accepts selection.json artifacts")
    return path


def _load_artifacts(run_dir: Path) -> tuple[dict[str, Any], dict[str, Any], Path]:
    summary_path = run_dir / "run_summary.json"
    if not summary_path.exists():
        raise FileNotFoundError(f"Missing run_summary.json for {run_dir.name}")
    summary = _read_json(summary_path)
    selection_path = _selection_file(run_dir, summary)
    if not selection_path.exists():
        raise FileNotFoundError(f"Missing selection.json for {run_dir.name}")
    selection = _read_json(selection_path)
    input_file = selection.get("input_file")
    if input_file:
        input_path = Path(str(input_file))
        if not input_path.is_absolute():
            input_path = REPO_ROOT / input_path
        if not input_path.resolve().is_relative_to(run_dir.resolve()):
            raise RuntimeError("Run data mismatch: selection input_file is outside current run_dir")
    return summary, selection, selection_path


def _pick(payload: dict[str, Any]) -> TicketPick:
    return TicketPick(
        pick_id=payload.get("pick_id"),
        fixture_id=payload.get("fixture_id"),
        event=payload.get("event"),
        competition=payload.get("competition"),
        kickoff=payload.get("kickoff"),
        market=payload.get("market"),
        market_canonical_id=payload.get("market_canonical_id"),
        pick=payload.get("pick"),
        selection_canonical_id=payload.get("selection_canonical_id"),
        confidence_score=payload.get("confidence_score"),
        expected_odds_min=payload.get("expected_odds_min"),
        expected_odds_max=payload.get("expected_odds_max"),
        risk_level=payload.get("risk_level"),
        reason=payload.get("reason"),
        evidence_summary=payload.get("evidence_summary") if isinstance(payload.get("evidence_summary"), dict) else {},
    )


def _summary(run_dir: Path, run_summary: dict[str, Any], selection: dict[str, Any], selection_path: Path) -> TicketSummary:
    run_id = str(run_summary.get("run_id") or run_dir.name)
    picks = selection.get("picks") if isinstance(selection.get("picks"), list) else []
    notes = selection.get("notes") if isinstance(selection.get("notes"), list) else []
    errors = selection.get("errors") if isinstance(selection.get("errors"), list) else []
    return TicketSummary(
        ticket_id=ticket_id_from_run_id(run_id),
        run_id=run_id,
        target_date=run_summary.get("target_date"),
        status=str(selection.get("status") or run_summary.get("status") or "unknown"),
        generated_at=selection.get("generated_at") or run_summary.get("finished_at"),
        estimated_combo_odds=selection.get("estimated_combo_odds"),
        global_confidence_score=selection.get("global_confidence_score"),
        combo_risk_level=selection.get("combo_risk_level"),
        combo_in_target_range=selection.get("combo_in_target_range"),
        picks_count=len(picks),
        notes_count=len(notes),
        errors_count=len(errors),
        source_run_dir=str(run_dir),
        selection_file=str(selection_path),
        date_consistency_status=run_summary.get("date_consistency_status"),
    )


def list_tickets() -> list[TicketSummary]:
    tickets: list[TicketSummary] = []
    for run_dir in _run_dirs():
        try:
            run_summary, selection, selection_path = _load_artifacts(run_dir)
            tickets.append(_summary(run_dir, run_summary, selection, selection_path))
        except (FileNotFoundError, RuntimeError, json.JSONDecodeError):
            continue
    return tickets


def get_ticket(ticket_id: str) -> TicketDetail | None:
    run_id = run_id_from_ticket_id(ticket_id)
    run_dir = ORCHESTRATOR_RUNS_DIR / run_id
    if not run_dir.exists():
        return None
    run_summary, selection, selection_path = _load_artifacts(run_dir)
    summary = _summary(run_dir, run_summary, selection, selection_path)
    raw_picks = selection.get("picks") if isinstance(selection.get("picks"), list) else []
    notes = [str(note) for note in selection.get("notes", []) if note is not None]
    errors = [str(error) for error in selection.get("errors", []) if error is not None]
    return TicketDetail(
        **summary.model_dump(),
        picks=[_pick(pick) for pick in raw_picks if isinstance(pick, dict)],
        notes=notes,
        errors=errors,
        selection_config=selection.get("selection_config") if isinstance(selection.get("selection_config"), dict) else {},
        metadata={
            "run_summary_status": run_summary.get("status"),
            "strategy_file": run_summary.get("strategy_file"),
            "selection_input_file": selection.get("input_file"),
            "run_started_at": run_summary.get("started_at"),
            "run_finished_at": run_summary.get("finished_at"),
        },
    )


def get_ticket_audit_log(ticket_id: str) -> TicketAuditLog | None:
    ticket = get_ticket(ticket_id)
    if ticket is None:
        return None
    entries = [TicketAuditEntry(level="info", message=note) for note in ticket.notes]
    entries.extend(TicketAuditEntry(level="error", message=error) for error in ticket.errors)
    entries.append(
        TicketAuditEntry(
            level="info",
            message=f"Selection file: {ticket.selection_file}",
            code="selection_file",
        )
    )
    return TicketAuditLog(ticket_id=ticket.ticket_id, run_id=ticket.run_id, entries=entries, metadata=ticket.metadata)

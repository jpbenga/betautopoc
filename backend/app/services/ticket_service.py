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
    TicketVariant,
)
from backend.app.core.paths import REPO_ROOT
from betauto.runtime_mode import ensure_latest_allowed

ORCHESTRATOR_RUNS_DIR = REPO_ROOT / "data" / "orchestrator_runs"
TICKET_PREFIX = "ticket_"
STRATEGY_APPLICATION_SEPARATOR = "__app_"
STRATEGY_APPLICATIONS_INDEX = "strategy_applications.json"


def ticket_id_from_run_id(run_id: str) -> str:
    return f"{TICKET_PREFIX}{run_id}"


def ticket_id_from_strategy_application(run_id: str, application_id: str) -> str:
    return f"{TICKET_PREFIX}{run_id}{STRATEGY_APPLICATION_SEPARATOR}{application_id}"


def run_id_from_ticket_id(ticket_id: str) -> str:
    return ticket_id.removeprefix(TICKET_PREFIX)


def _ticket_parts(ticket_id: str) -> tuple[str, str | None]:
    raw_id = run_id_from_ticket_id(ticket_id)
    if STRATEGY_APPLICATION_SEPARATOR not in raw_id:
        return raw_id, None
    run_id, application_id = raw_id.split(STRATEGY_APPLICATION_SEPARATOR, 1)
    return run_id, application_id or None


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
    return _safe_selection_file(run_dir, candidate)


def _safe_selection_file(run_dir: Path, candidate: str | Path) -> Path:
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


def _strategy_application_file(run_dir: Path, application: dict[str, Any]) -> Path:
    files = application.get("files") if isinstance(application.get("files"), dict) else {}
    candidate = files.get("selection")
    if not candidate:
        application_dir = application.get("application_dir")
        if not application_dir:
            raise FileNotFoundError(f"Missing strategy application selection for {run_dir.name}")
        candidate = Path(str(application_dir)) / "selection.json"
    return _safe_selection_file(run_dir, candidate)


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


def _strategy_applications(run_dir: Path) -> list[dict[str, Any]]:
    index_file = run_dir / STRATEGY_APPLICATIONS_INDEX
    if not index_file.exists():
        return []
    payload = _read_json(index_file)
    applications = payload.get("applications") if isinstance(payload.get("applications"), list) else []
    return [application for application in applications if isinstance(application, dict)]


def _load_strategy_application_artifacts(
    run_dir: Path,
    application: dict[str, Any],
) -> tuple[dict[str, Any], dict[str, Any], dict[str, Any], Path]:
    summary_path = run_dir / "run_summary.json"
    run_summary = _read_json(summary_path) if summary_path.exists() else {"run_id": run_dir.name}
    selection_path = _strategy_application_file(run_dir, application)
    if not selection_path.exists():
        raise FileNotFoundError(f"Missing strategy application selection.json for {run_dir.name}")
    selection = _read_json(selection_path)
    input_file = selection.get("input_file")
    if input_file:
        input_path = Path(str(input_file))
        if not input_path.is_absolute():
            input_path = REPO_ROOT / input_path
        if not input_path.resolve().is_relative_to(run_dir.resolve()):
            raise RuntimeError("Run data mismatch: strategy selection input_file is outside current run_dir")
    return run_summary, application, selection, selection_path


def _find_strategy_application(run_dir: Path, application_id: str) -> dict[str, Any] | None:
    for application in _strategy_applications(run_dir):
        if str(application.get("application_id") or "") == application_id:
            return application
    application_dir = run_dir / "strategy_applications" / application_id
    summary_file = application_dir / "application_summary.json"
    if summary_file.exists():
        return _read_json(summary_file)
    return None


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
        source_match_analysis_id=payload.get("source_match_analysis_id"),
    )


def _raw_selected_picks(selection: dict[str, Any]) -> list[dict[str, Any]]:
    picks = selection.get("picks") if isinstance(selection.get("picks"), list) else []
    if picks:
        return [pick for pick in picks if isinstance(pick, dict)]

    selected_variant_id = str(selection.get("selected_variant_id") or "")
    variants = selection.get("variants") if isinstance(selection.get("variants"), list) else []
    for variant in variants:
        if not isinstance(variant, dict):
            continue
        if selected_variant_id and str(variant.get("variant_id") or "") != selected_variant_id:
            continue
        variant_picks = variant.get("picks") if isinstance(variant.get("picks"), list) else []
        return [pick for pick in variant_picks if isinstance(pick, dict)]

    return []


def _selection_variants(selection: dict[str, Any]) -> list[TicketVariant]:
    raw_variants = selection.get("variants") if isinstance(selection.get("variants"), list) else []
    selected_variant_id = str(selection.get("selected_variant_id") or "")
    variants: list[TicketVariant] = []

    for index, raw_variant in enumerate(raw_variants[:3], start=1):
        if not isinstance(raw_variant, dict):
            continue
        variant_id = str(raw_variant.get("variant_id") or f"variant_{index:03d}")
        raw_picks = raw_variant.get("picks") if isinstance(raw_variant.get("picks"), list) else []
        variants.append(
            TicketVariant(
                variant_id=variant_id,
                label=str(raw_variant.get("label") or f"Variant {index}"),
                picks=[_pick(pick) for pick in raw_picks if isinstance(pick, dict)],
                estimated_combo_odds=raw_variant.get("estimated_combo_odds"),
                combo_in_target_range=raw_variant.get("combo_in_target_range"),
                global_confidence_score=raw_variant.get("global_confidence_score"),
                combo_risk_level=raw_variant.get("combo_risk_level"),
                strategy_fit_score=raw_variant.get("strategy_fit_score"),
                reason=raw_variant.get("reason"),
                tradeoffs=[str(item) for item in raw_variant.get("tradeoffs", []) if item is not None]
                if isinstance(raw_variant.get("tradeoffs"), list)
                else [],
                selected=variant_id == selected_variant_id,
            )
        )

    if not variants:
        selected_picks = _raw_selected_picks(selection)
        if selected_picks:
            selected_variant_id = selected_variant_id or "variant_001"
            variants.append(
                TicketVariant(
                    variant_id=selected_variant_id,
                    label="Best ticket",
                    picks=[_pick(pick) for pick in selected_picks],
                    estimated_combo_odds=selection.get("estimated_combo_odds"),
                    combo_in_target_range=selection.get("combo_in_target_range"),
                    global_confidence_score=selection.get("global_confidence_score"),
                    combo_risk_level=selection.get("combo_risk_level"),
                    strategy_fit_score=None,
                    reason=selection.get("selection_reason"),
                    tradeoffs=[],
                    selected=True,
                )
            )

    if variants and not any(variant.selected for variant in variants):
        first = variants[0]
        first.selected = True

    return variants


def _summary(
    run_dir: Path,
    run_summary: dict[str, Any],
    selection: dict[str, Any],
    selection_path: Path,
    *,
    ticket_id: str | None = None,
    target_date: str | None = None,
    status: str | None = None,
    generated_at: str | None = None,
    data_source_mode: str = "run_artifacts",
) -> TicketSummary:
    run_id = str(run_summary.get("run_id") or run_dir.name)
    picks = _raw_selected_picks(selection)
    variants = _selection_variants(selection)
    selected_variant_id = str(selection.get("selected_variant_id") or "")
    if not selected_variant_id:
        selected_variant_id = next((variant.variant_id for variant in variants if variant.selected), None)
    notes = selection.get("notes") if isinstance(selection.get("notes"), list) else []
    errors = selection.get("errors") if isinstance(selection.get("errors"), list) else []
    competitions = sorted(
        {
            str(pick.get("competition")).strip()
            for pick in picks
            if isinstance(pick, dict) and pick.get("competition")
        }
    )
    return TicketSummary(
        ticket_id=ticket_id or ticket_id_from_run_id(run_id),
        run_id=run_id,
        target_date=target_date or run_summary.get("target_date"),
        status=str(status or selection.get("status") or run_summary.get("status") or "unknown"),
        generated_at=generated_at or selection.get("generated_at") or run_summary.get("finished_at"),
        estimated_combo_odds=selection.get("estimated_combo_odds"),
        global_confidence_score=selection.get("global_confidence_score"),
        combo_risk_level=selection.get("combo_risk_level"),
        combo_in_target_range=selection.get("combo_in_target_range"),
        picks_count=len(picks),
        variants_count=len(variants),
        selected_variant_id=selected_variant_id,
        notes_count=len(notes),
        errors_count=len(errors),
        competitions=competitions,
        source_run_dir=str(run_dir),
        selection_file=str(selection_path),
        data_source_mode=data_source_mode,
        date_consistency_status=run_summary.get("date_consistency_status"),
    )


def _strategy_application_status(application: dict[str, Any], selection: dict[str, Any]) -> str:
    status = str(application.get("status") or selection.get("status") or "unknown")
    if status == "completed" and selection.get("combo_in_target_range") is False:
        return "completed_with_warnings"
    return status


def _strategy_application_summary(
    run_dir: Path,
    run_summary: dict[str, Any],
    application: dict[str, Any],
    selection: dict[str, Any],
    selection_path: Path,
) -> TicketSummary:
    run_id = str(application.get("run_id") or run_summary.get("run_id") or run_dir.name)
    application_id = str(application.get("application_id") or selection_path.parent.name)
    return _summary(
        run_dir,
        run_summary,
        selection,
        selection_path,
        ticket_id=ticket_id_from_strategy_application(run_id, application_id),
        target_date=application.get("target_date") or run_summary.get("target_date"),
        status=_strategy_application_status(application, selection),
        generated_at=application.get("generated_at"),
        data_source_mode="strategy_application",
    )


def list_tickets() -> list[TicketSummary]:
    tickets: list[TicketSummary] = []
    for run_dir in _run_dirs():
        try:
            run_summary, selection, selection_path = _load_artifacts(run_dir)
            tickets.append(_summary(run_dir, run_summary, selection, selection_path))
        except (FileNotFoundError, RuntimeError, json.JSONDecodeError):
            pass
        for application in _strategy_applications(run_dir):
            try:
                app_run_summary, app_summary, app_selection, app_selection_path = _load_strategy_application_artifacts(
                    run_dir,
                    application,
                )
                app_picks = app_selection.get("picks") if isinstance(app_selection.get("picks"), list) else []
                if not app_picks:
                    continue
                tickets.append(_strategy_application_summary(run_dir, app_run_summary, app_summary, app_selection, app_selection_path))
            except (FileNotFoundError, RuntimeError, json.JSONDecodeError):
                continue
    return sorted(tickets, key=lambda ticket: ticket.generated_at or "", reverse=True)


def _detail_from_artifacts(
    run_dir: Path,
    run_summary: dict[str, Any],
    selection: dict[str, Any],
    selection_path: Path,
    *,
    summary: TicketSummary,
    application: dict[str, Any] | None = None,
) -> TicketDetail:
    raw_picks = _raw_selected_picks(selection)
    notes = [str(note) for note in selection.get("notes", []) if note is not None]
    errors = [str(error) for error in selection.get("errors", []) if error is not None]
    metadata = {
        "run_summary_status": run_summary.get("status"),
        "strategy_file": run_summary.get("strategy_file"),
        "selection_input_file": selection.get("input_file"),
        "run_started_at": run_summary.get("started_at"),
        "run_finished_at": run_summary.get("finished_at"),
    }
    if application:
        metadata.update(
            {
                "strategy_application_id": application.get("application_id"),
                "strategy_application_status": application.get("status"),
                "strategy_id": application.get("strategy_id"),
                "strategy_file": application.get("strategy_file") or metadata.get("strategy_file"),
                "selection_mode": application.get("selection_mode"),
                "application_dir": application.get("application_dir"),
                "application_generated_at": application.get("generated_at"),
                "aggregation_candidate_count": application.get("aggregation_candidate_count"),
                "filtered_candidate_count": application.get("filtered_candidate_count"),
                "rejected_candidate_count": application.get("rejected_candidate_count"),
            }
        )
    return TicketDetail(
        **summary.model_dump(),
        picks=[_pick(pick) for pick in raw_picks if isinstance(pick, dict)],
        variants=_selection_variants(selection),
        selection_reason=selection.get("selection_reason"),
        notes=notes,
        errors=errors,
        selection_config=selection.get("selection_config") if isinstance(selection.get("selection_config"), dict) else {},
        metadata=metadata,
    )


def get_ticket(ticket_id: str) -> TicketDetail | None:
    run_id, application_id = _ticket_parts(ticket_id)
    run_dir = ORCHESTRATOR_RUNS_DIR / run_id
    if not run_dir.exists():
        return None

    if application_id:
        application = _find_strategy_application(run_dir, application_id)
        if application is None:
            return None
        run_summary, application_summary, selection, selection_path = _load_strategy_application_artifacts(run_dir, application)
        summary = _strategy_application_summary(run_dir, run_summary, application_summary, selection, selection_path)
        return _detail_from_artifacts(
            run_dir,
            run_summary,
            selection,
            selection_path,
            summary=summary,
            application=application_summary,
        )

    run_summary, selection, selection_path = _load_artifacts(run_dir)
    summary = _summary(run_dir, run_summary, selection, selection_path)
    return _detail_from_artifacts(run_dir, run_summary, selection, selection_path, summary=summary)


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
    if ticket.variants_count:
        entries.append(
            TicketAuditEntry(
                level="info",
                message=f"Variants generated: {ticket.variants_count}; selected={ticket.selected_variant_id or 'unknown'}",
                code="selection_variants",
            )
        )
    return TicketAuditLog(ticket_id=ticket.ticket_id, run_id=ticket.run_id, entries=entries, metadata=ticket.metadata)

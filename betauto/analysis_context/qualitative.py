from __future__ import annotations

from .models import QualitativeContext


def empty_qualitative_context() -> QualitativeContext:
    return QualitativeContext()


def build_manual_qualitative_context(manual_notes: list[str] | None = None) -> QualitativeContext:
    context = empty_qualitative_context()
    context.manual_notes = manual_notes or []
    return context

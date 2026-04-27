from __future__ import annotations

from dataclasses import asdict, dataclass, field
from datetime import datetime, timezone
from typing import Any, Literal

StepStatus = Literal["completed", "failed", "skipped"]
RunStatus = Literal["completed", "partial", "failed"]


@dataclass(slots=True)
class StepResult:
    name: str
    status: StepStatus
    duration_seconds: float
    output_file: str | None = None

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class OrchestratorRunSummary:
    run_id: str
    started_at: str
    finished_at: str
    status: RunStatus
    target_date: str
    strategy_id: str
    steps: list[StepResult] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        payload = asdict(self)
        payload["steps"] = [step.to_dict() for step in self.steps]
        return payload


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat(timespec="seconds").replace("+00:00", "Z")

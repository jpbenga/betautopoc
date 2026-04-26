from __future__ import annotations

import json
import os
from pathlib import Path
from typing import Any

from .models import StrategyDefinition

BASE_DIR = Path(__file__).resolve().parents[2]
DEFAULT_STRATEGY_PATH = BASE_DIR / "config" / "strategies" / "default.json"


def _resolve_strategy_path(path: str | None = None) -> Path:
    candidate = path or os.getenv("BETAUTO_STRATEGY_FILE")
    if candidate:
        resolved = Path(candidate)
        if not resolved.is_absolute():
            resolved = BASE_DIR / resolved
        return resolved
    return DEFAULT_STRATEGY_PATH


def load_strategy(path: str | None = None) -> StrategyDefinition:
    strategy_path = _resolve_strategy_path(path)
    if not strategy_path.exists():
        raise FileNotFoundError(f"Strategy file introuvable: {strategy_path}")

    payload = json.loads(strategy_path.read_text(encoding="utf-8"))
    return StrategyDefinition.model_validate(payload)


def load_strategy_as_dict(path: str | None = None) -> dict[str, Any]:
    return load_strategy(path).model_dump(mode="json")

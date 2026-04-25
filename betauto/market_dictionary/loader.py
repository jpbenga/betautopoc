from __future__ import annotations

import glob
import json
from pathlib import Path
from typing import Any


def _sort_key(path: str) -> tuple[float, str]:
    p = Path(path)
    return (p.stat().st_mtime, p.name)


def find_latest_exploration_file(base_dir: Path) -> Path | None:
    pattern = str(base_dir / "api_football_exploration_*.json")
    files = glob.glob(pattern)
    if not files:
        return None
    latest = sorted(files, key=_sort_key)[-1]
    return Path(latest)


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as file:
        return json.load(file)


def load_raw_data(base_dir: Path) -> dict[str, Any]:
    exploration_file = find_latest_exploration_file(base_dir)
    if exploration_file is None:
        raise FileNotFoundError("No api_football_exploration_*.json file found.")

    exploration_data = load_json(exploration_file)
    bookmakers_file = base_dir / "api_football_bookmakers.json"
    bookmakers_data: dict[str, Any] | None = None
    if bookmakers_file.exists():
        bookmakers_data = load_json(bookmakers_file)

    return {
        "exploration_file": exploration_file,
        "exploration_data": exploration_data,
        "bookmakers_file": bookmakers_file if bookmakers_data is not None else None,
        "bookmakers_data": bookmakers_data,
    }

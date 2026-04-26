from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Any


def write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as file:
        json.dump(payload, file, ensure_ascii=False, indent=2, sort_keys=True)
        file.write("\n")


def export_analysis_context(payload: dict[str, Any], output_dir: Path) -> dict[str, Path]:
    output_dir.mkdir(parents=True, exist_ok=True)
    stamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    dated_path = output_dir / f"analysis_context_{stamp}.json"
    latest_path = output_dir / "latest_analysis_context.json"

    write_json(dated_path, payload)
    write_json(latest_path, payload)

    return {"dated": dated_path, "latest": latest_path}

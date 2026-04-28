from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path
from typing import Any

from betauto.runtime_mode import ensure_latest_allowed


def export_selection_result(selection_result: dict[str, Any], output_dir: str) -> tuple[Path, Path]:
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    dated_file = output_path / f"selection_{timestamp}.json"
    latest_file = output_path / "latest_selection.json"

    payload = json.dumps(selection_result, ensure_ascii=False, indent=2)
    ensure_latest_allowed(latest_file)
    dated_file.write_text(payload, encoding="utf-8")
    latest_file.write_text(payload, encoding="utf-8")
    return dated_file, latest_file

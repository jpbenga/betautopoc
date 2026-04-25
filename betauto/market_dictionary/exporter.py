from __future__ import annotations

import json
from pathlib import Path
from typing import Any


def write_json(path: Path, payload: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", encoding="utf-8") as file:
        json.dump(payload, file, ensure_ascii=False, indent=2, sort_keys=True)
        file.write("\n")


def export_market_dictionary(output_dir: Path, payload: dict[str, Any]) -> dict[str, Path]:
    inventory_path = output_dir / "api_football_market_inventory.json"
    dictionary_path = output_dir / "market_dictionary_unibet.json"
    unmapped_path = output_dir / "unmapped_markets.json"

    write_json(inventory_path, payload["inventory"])
    write_json(dictionary_path, payload["market_dictionary"])
    write_json(unmapped_path, payload["unmapped_markets"])

    return {
        "inventory": inventory_path,
        "dictionary": dictionary_path,
        "unmapped": unmapped_path,
    }

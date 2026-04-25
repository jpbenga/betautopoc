from __future__ import annotations

import json
from functools import lru_cache
from pathlib import Path
from typing import Any


BASE_DIR = Path(__file__).resolve().parents[2]
DICTIONARY_PATH = BASE_DIR / "data" / "market_dictionary" / "market_dictionary_unibet.json"


@lru_cache(maxsize=1)
def _load_dictionary() -> dict[str, Any]:
    if not DICTIONARY_PATH.exists():
        return {"markets": []}
    with DICTIONARY_PATH.open("r", encoding="utf-8") as file:
        data = json.load(file)
    if not isinstance(data, dict):
        return {"markets": []}
    return data


def _find_market_entry(market_canonical_id: str | None) -> dict[str, Any] | None:
    if not market_canonical_id:
        return None
    markets = _load_dictionary().get("markets", [])
    if not isinstance(markets, list):
        return None
    for market in markets:
        if not isinstance(market, dict):
            continue
        if market.get("canonical_market_id") == market_canonical_id:
            return market
    return None


def resolve_pick_market_aliases(pick: dict[str, Any]) -> dict[str, Any]:
    enriched_pick = dict(pick)
    notes: list[str] = []
    status = "unmatched"

    market_canonical_id = enriched_pick.get("market_canonical_id")
    selection_canonical_id = enriched_pick.get("selection_canonical_id")

    market_aliases: list[str] = []
    selection_aliases: list[str] = []

    market_entry = _find_market_entry(market_canonical_id)
    if market_entry is None:
        notes.append(
            f"market_canonical_id introuvable dans le dictionnaire: {market_canonical_id!r}"
        )
    else:
        aliases = market_entry.get("browser_use_aliases", [])
        if isinstance(aliases, list):
            market_aliases = [str(alias) for alias in aliases if alias]
        status = "market_matched"

        selection_mapping = market_entry.get("selection_mapping", [])
        matched_selection = None
        if isinstance(selection_mapping, list):
            for selection in selection_mapping:
                if not isinstance(selection, dict):
                    continue
                if selection.get("canonical_selection_id") == selection_canonical_id:
                    matched_selection = selection
                    break

        if selection_canonical_id and matched_selection is None:
            notes.append(
                "selection_canonical_id introuvable pour le marché "
                f"{market_canonical_id!r}: {selection_canonical_id!r}"
            )
        elif matched_selection is not None:
            aliases = matched_selection.get("browser_use_aliases", [])
            if isinstance(aliases, list):
                selection_aliases = [str(alias) for alias in aliases if alias]
            status = "matched"

    enriched_pick["market_aliases"] = market_aliases
    enriched_pick["selection_aliases"] = selection_aliases
    enriched_pick["dictionary_match_status"] = status
    enriched_pick["dictionary_notes"] = notes

    return enriched_pick

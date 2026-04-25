from __future__ import annotations

from collections import defaultdict
from datetime import datetime, timezone
from typing import Any

from .models import (
    ApiFootballMarket,
    BookmakerMarket,
    MarketDictionaryEntry,
    MarketInventory,
    SelectionMapping,
    UnmappedMarket,
)
from .normalizer import (
    CANONICAL_MARKET_MAP,
    canonical_market_name,
    market_category,
    normalize_market_name,
    normalize_selection_value,
)


DOUBLE_CHANCE_SELECTIONS: dict[str, tuple[str, str, list[str], list[str], list[str]]] = {
    "home_or_draw": (
        "home_or_draw",
        "Home or draw",
        ["Home/Draw", "1X"],
        ["Home/Draw", "1X", "1 / N", "1N"],
        ["1X", "1N", "1 / N", "Home or Draw"],
    ),
    "draw_or_away": (
        "draw_or_away",
        "Draw or away",
        ["Draw/Away", "X2"],
        ["Draw/Away", "X2", "N / 2", "N2"],
        ["X2", "N2", "N / 2", "Draw or Away"],
    ),
    "home_or_away": (
        "home_or_away",
        "Home or away",
        ["Home/Away", "12"],
        ["Home/Away", "12", "1 / 2"],
        ["12", "1 / 2", "Home or Away"],
    ),
}


def _now_iso() -> str:
    return datetime.now(timezone.utc).replace(microsecond=0).isoformat()


def _extract_unibet_bookmaker(raw: dict[str, Any], seed: dict[str, Any]) -> tuple[int | None, str]:
    seed_bookmaker = seed.get("bookmaker", {}) if isinstance(seed, dict) else {}
    if seed_bookmaker.get("api_football_bookmaker_id"):
        return int(seed_bookmaker["api_football_bookmaker_id"]), str(seed_bookmaker.get("target_name", "Unibet"))

    odds_all = raw.get("odds_all_for_fixture", {})
    response = odds_all.get("response", []) if isinstance(odds_all, dict) else []
    if response:
        for bookmaker in response[0].get("bookmakers", []):
            if str(bookmaker.get("name", "")).lower() == "unibet":
                return bookmaker.get("id"), bookmaker.get("name", "Unibet")
    return None, "Unibet"


def _extract_unibet_fixture_markets(raw: dict[str, Any]) -> list[dict[str, Any]]:
    odds_all = raw.get("odds_all_for_fixture", {})
    response = odds_all.get("response", []) if isinstance(odds_all, dict) else []
    if not response:
        return []
    for bookmaker in response[0].get("bookmakers", []):
        if str(bookmaker.get("name", "")).lower() == "unibet":
            return bookmaker.get("bets", [])
    return []


def _selection_mapping_for_market(canonical_id: str, values: list[str]) -> tuple[list[SelectionMapping], bool]:
    unique_values = sorted({v.strip() for v in values if v})
    uncertain = False

    if canonical_id in {"match_winner", "first_half_winner", "second_half_winner"}:
        mapping = [
            SelectionMapping("home", "Home", ["Home"], ["Home"], ["Home"]),
            SelectionMapping("draw", "Draw", ["Draw"], ["Draw"], ["Draw"]),
            SelectionMapping("away", "Away", ["Away"], ["Away"], ["Away"]),
        ]
        return mapping, False

    if canonical_id in {"double_chance", "double_chance_first_half", "double_chance_second_half"}:
        mapping: list[SelectionMapping] = []
        for _, data in DOUBLE_CHANCE_SELECTIONS.items():
            mapping.append(SelectionMapping(*data))
        return mapping, False

    if canonical_id in {"both_teams_to_score", "both_teams_score_first_half", "both_teams_score_second_half", "clean_sheet_home", "clean_sheet_away"}:
        return [
            SelectionMapping("yes", "Yes", ["Yes", "Oui"], ["Yes", "Oui"], ["Yes", "Oui"]),
            SelectionMapping("no", "No", ["No", "Non"], ["No", "Non"], ["No", "Non"]),
        ], False

    if canonical_id in {"goals_over_under", "goals_over_under_first_half", "goals_over_under_second_half", "total_home", "total_away"}:
        mapping = []
        for val in unique_values:
            c_id = normalize_selection_value(val)
            mapping.append(SelectionMapping(c_id, val, [val], [val], [val]))
        return mapping, False

    if canonical_id in {"odd_even", "odd_even_first_half", "home_odd_even"}:
        return [
            SelectionMapping("odd", "Odd", ["Odd"], ["Odd"], ["Odd"]),
            SelectionMapping("even", "Even", ["Even"], ["Even"], ["Even"]),
        ], False

    mapping = []
    for val in unique_values:
        c_id = normalize_selection_value(val)
        mapping.append(SelectionMapping(c_id, val, [val], [val], [val]))
    if unique_values:
        uncertain = True
    return mapping, uncertain


def _collect_inventory(raw: dict[str, Any], bookmakers_data: dict[str, Any] | None, source_files: list[str]) -> MarketInventory:
    odds_bets = raw.get("odds_bets", {})
    api_bets_response = odds_bets.get("response", []) if isinstance(odds_bets, dict) else []

    odds_all = raw.get("odds_all_for_fixture", {})
    fixture_response = odds_all.get("response", []) if isinstance(odds_all, dict) else []
    fixture_markets: list[dict[str, Any]] = []
    fixture_bookmakers: list[dict[str, Any]] = []

    if fixture_response:
        fixture_bookmakers = fixture_response[0].get("bookmakers", []) or []
        for bookmaker in fixture_bookmakers:
            for bet in bookmaker.get("bets", []) or []:
                values = sorted({str(value.get("value")) for value in bet.get("values", []) if isinstance(value, dict) and value.get("value") is not None})
                fixture_markets.append(
                    {
                        "bookmaker_id": bookmaker.get("id"),
                        "bookmaker_name": bookmaker.get("name"),
                        "bet_id": bet.get("id"),
                        "bet_name": bet.get("name"),
                        "values": values,
                    }
                )

    bookmakers = []
    if bookmakers_data:
        bookmakers = sorted(bookmakers_data.get("bookmakers", []), key=lambda b: (b.get("id") or 0, b.get("name") or ""))

    inventory = MarketInventory(
        generated_at=_now_iso(),
        source_files=source_files,
        bookmakers=bookmakers,
        api_football_bets=sorted(api_bets_response, key=lambda b: (b.get("id") or 0, b.get("name") or "")),
        fixture_odds_markets=sorted(
            fixture_markets,
            key=lambda m: (
                m.get("bookmaker_id") or 0,
                m.get("bet_id") or 0,
                m.get("bet_name") or "",
            ),
        ),
        summary={
            "api_football_bets_count": len(api_bets_response),
            "fixture_markets_count": len(fixture_markets),
            "bookmakers_count": len(bookmakers),
        },
    )
    return inventory


def build_market_dictionary_payload(loaded_data: dict[str, Any]) -> dict[str, Any]:
    exploration_file = loaded_data["exploration_file"]
    exploration_data = loaded_data["exploration_data"]
    bookmakers_data = loaded_data.get("bookmakers_data")

    raw = exploration_data.get("raw", {}) if isinstance(exploration_data, dict) else {}
    seed = exploration_data.get("market_dictionary_seed", {}) if isinstance(exploration_data, dict) else {}

    source_files = [exploration_file.name]
    if loaded_data.get("bookmakers_file") is not None:
        source_files.append(loaded_data["bookmakers_file"].name)

    inventory = _collect_inventory(raw, bookmakers_data, source_files)

    unibet_id, unibet_name = _extract_unibet_bookmaker(raw, seed)
    unibet_bets = _extract_unibet_fixture_markets(raw)

    values_by_market: dict[tuple[int | None, str], set[str]] = defaultdict(set)
    for bet in unibet_bets:
        key = (bet.get("id"), bet.get("name", ""))
        for v in bet.get("values", []) or []:
            value = v.get("value") if isinstance(v, dict) else None
            if value is not None:
                values_by_market[key].add(str(value))

    mapped_entries: list[MarketDictionaryEntry] = []
    unmapped_entries: list[UnmappedMarket] = []

    all_markets = sorted(
        [(bet.get("id"), bet.get("name", "")) for bet in raw.get("odds_bets", {}).get("response", [])],
        key=lambda x: (x[0] or 0, x[1]),
    )

    fixture = seed.get("fixture", {}) if isinstance(seed, dict) else {}
    fixture_label = f"{fixture.get('home', {}).get('name', 'Home Team')} vs {fixture.get('away', {}).get('name', 'Away Team')}"

    for bet_id, bet_name in all_markets:
        canonical_id = CANONICAL_MARKET_MAP.get(bet_name)
        values = sorted(values_by_market.get((bet_id, bet_name), set()))
        if canonical_id is None:
            unmapped_entries.append(
                UnmappedMarket(
                    api_bet_id=bet_id,
                    api_bet_name=bet_name,
                    reason="No automatic canonical mapping found",
                    values=values,
                )
            )
            continue

        selection_mapping, uncertain = _selection_mapping_for_market(canonical_id, values)

        if canonical_id in {"double_chance", "double_chance_first_half", "double_chance_second_half"}:
            browser_aliases = ["Double Chance", "Double chance", "1N", "N2", "12", "1 / N", "N / 2", "1 / 2"]
        else:
            browser_aliases = sorted({bet_name, canonical_market_name(canonical_id)})

        entry = MarketDictionaryEntry(
            canonical_market_id=canonical_id,
            canonical_market_name=canonical_market_name(canonical_id),
            category=market_category(canonical_id),
            api_football=ApiFootballMarket(bet_id=bet_id, bet_name=bet_name),
            bookmaker=BookmakerMarket(id=unibet_id, name=unibet_name),
            bookmaker_market_label=bet_name,
            browser_use_aliases=browser_aliases,
            selection_mapping=selection_mapping,
            supported_by_api_football=True,
            supported_by_unibet=True,
            supported_by_betclic=None,
            source={
                "from_file": exploration_file.name,
                "fixture_id": fixture.get("fixture_id"),
                "fixture_label": fixture_label,
            },
            requires_manual_review=uncertain,
            notes=[] if not uncertain else ["Selection mapping inferred from raw API labels."],
        )
        mapped_entries.append(entry)

    mapped_entries.sort(key=lambda e: (e.api_football.bet_id or 0, e.api_football.bet_name))
    unmapped_entries.sort(key=lambda e: (e.api_bet_id or 0, e.api_bet_name))

    return {
        "inventory": inventory.to_dict(),
        "market_dictionary": {
            "generated_at": _now_iso(),
            "source_files": source_files,
            "bookmaker": {"id": unibet_id, "name": unibet_name},
            "markets": [entry.to_dict() for entry in mapped_entries],
            "summary": {
                "mapped_markets_count": len(mapped_entries),
                "unmapped_markets_count": len(unmapped_entries),
            },
        },
        "unmapped_markets": {
            "generated_at": _now_iso(),
            "source_files": source_files,
            "markets": [entry.to_dict() for entry in unmapped_entries],
        },
        "stats": {
            "exploration_file": exploration_file.name,
            "bookmakers_count": inventory.summary["bookmakers_count"],
            "api_football_bets_count": inventory.summary["api_football_bets_count"],
            "fixture_markets_count": inventory.summary["fixture_markets_count"],
            "mapped_markets_count": len(mapped_entries),
            "unmapped_markets_count": len(unmapped_entries),
        },
    }

from __future__ import annotations

from dataclasses import asdict, dataclass, field
from typing import Any


@dataclass(slots=True)
class SelectionMapping:
    canonical_selection_id: str
    canonical_selection_name: str
    api_values: list[str] = field(default_factory=list)
    bookmaker_values: list[str] = field(default_factory=list)
    browser_use_aliases: list[str] = field(default_factory=list)


@dataclass(slots=True)
class ApiFootballMarket:
    bet_id: int | None
    bet_name: str


@dataclass(slots=True)
class BookmakerMarket:
    id: int | None
    name: str


@dataclass(slots=True)
class MarketDictionaryEntry:
    canonical_market_id: str
    canonical_market_name: str
    category: str
    api_football: ApiFootballMarket
    bookmaker: BookmakerMarket
    bookmaker_market_label: str
    browser_use_aliases: list[str] = field(default_factory=list)
    selection_mapping: list[SelectionMapping] = field(default_factory=list)
    supported_by_api_football: bool = True
    supported_by_unibet: bool = True
    supported_by_betclic: bool | None = None
    source: dict[str, Any] = field(default_factory=dict)
    requires_manual_review: bool = False
    notes: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class UnmappedMarket:
    api_bet_id: int | None
    api_bet_name: str
    reason: str
    values: list[str] = field(default_factory=list)

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)


@dataclass(slots=True)
class MarketInventory:
    generated_at: str
    source_files: list[str]
    bookmakers: list[dict[str, Any]]
    api_football_bets: list[dict[str, Any]]
    fixture_odds_markets: list[dict[str, Any]]
    summary: dict[str, int]

    def to_dict(self) -> dict[str, Any]:
        return asdict(self)

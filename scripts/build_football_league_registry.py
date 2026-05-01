from __future__ import annotations

import argparse
import json
import os
import sys
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Any

import requests

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


DEFAULT_REGISTRY_PATH = ROOT / "config" / "coverage" / "football_leagues.json"
DEFAULT_API_BASE_URL = "https://v3.football.api-sports.io"
DEFAULT_DOTENV_PATH = ROOT / ".env"


@dataclass(frozen=True)
class LeagueTarget:
    country: str
    competition_name: str
    competition_type: str
    season_mode: str
    tier: int
    priority: int
    agent_profile: str
    strategy_profile: str = "default_football_balanced"
    aliases: tuple[str, ...] = ()


TARGET_LEAGUES: list[LeagueTarget] = [
    LeagueTarget("France", "Ligue 1", "league", "domestic_season", 1, 100, "football_france_ligue1"),
    LeagueTarget("France", "Ligue 2", "league", "domestic_season", 2, 90, "football_france_ligue2"),
    LeagueTarget("Spain", "La Liga", "league", "domestic_season", 1, 100, "football_spain_laliga"),
    LeagueTarget("Spain", "La Liga 2", "league", "domestic_season", 2, 90, "football_spain_laliga2"),
    LeagueTarget("Italy", "Serie A", "league", "domestic_season", 1, 100, "football_italy_seriea"),
    LeagueTarget("Italy", "Serie B", "league", "domestic_season", 2, 90, "football_italy_serieb"),
    LeagueTarget("Germany", "Bundesliga 1", "league", "domestic_season", 1, 100, "football_germany_bundesliga1"),
    LeagueTarget("Germany", "Bundesliga 2", "league", "domestic_season", 2, 90, "football_germany_bundesliga2"),
    LeagueTarget("England", "Premier League", "league", "domestic_season", 1, 100, "football_england_premierleague"),
    LeagueTarget("England", "Championship", "league", "domestic_season", 2, 90, "football_england_championship"),
    LeagueTarget("Portugal", "Primeira Liga", "league", "domestic_season", 1, 90, "football_portugal_primeiraliga"),
    LeagueTarget(
        "Portugal",
        "Liga Portugal 2",
        "league",
        "domestic_season",
        2,
        80,
        "football_portugal_ligaportugal2",
        aliases=("Segunda Liga",),
    ),
    LeagueTarget("Norway", "Eliteserien", "league", "calendar_year", 1, 75, "football_norway_eliteserien"),
    LeagueTarget("Sweden", "Allsvenskan", "league", "calendar_year", 1, 75, "football_sweden_allsvenskan"),
    LeagueTarget("Japan", "J1 League", "league", "calendar_year", 1, 75, "football_japan_j1league"),
    LeagueTarget("Netherlands", "Eredivisie", "league", "domestic_season", 1, 85, "football_netherlands_eredivisie"),
    LeagueTarget("Saudi-Arabia", "Saudi Pro League", "league", "domestic_season", 1, 70, "football_saudiarabia_saudiproleague"),
    LeagueTarget("Austria", "Bundesliga", "league", "domestic_season", 1, 70, "football_austria_bundesliga"),
    LeagueTarget(
        "Turkey",
        "Super Lig",
        "league",
        "domestic_season",
        1,
        80,
        "football_turkey_superlig",
        aliases=("Süper Lig",),
    ),
    LeagueTarget("Scotland", "Premiership", "league", "domestic_season", 1, 70, "football_scotland_premiership"),
    LeagueTarget("Belgium", "Jupiler Pro League", "league", "domestic_season", 1, 75, "football_belgium_jupilerproleague"),
    LeagueTarget("Switzerland", "Super League", "league", "domestic_season", 1, 70, "football_switzerland_superleague"),
    LeagueTarget("South-Korea", "K League 1", "league", "calendar_year", 1, 70, "football_southkorea_kleague1"),
    LeagueTarget(
        "World",
        "Champions League",
        "international",
        "continental_season",
        1,
        100,
        "football_uefa_championsleague",
        aliases=("UEFA Champions League",),
    ),
    LeagueTarget("World", "Europa League", "international", "continental_season", 1, 95, "football_uefa_europaleague"),
    LeagueTarget("World", "Conference League", "international", "continental_season", 1, 90, "football_uefa_conferenceleague"),
    LeagueTarget("World", "UEFA Super Cup", "international", "single_event", 1, 60, "football_uefa_supercup"),
    LeagueTarget("France", "Coupe de France", "cup", "domestic_season", 1, 55, "football_france_coupedefrance"),
    LeagueTarget("Germany", "DFB Pokal", "cup", "domestic_season", 1, 55, "football_germany_dfbpokal"),
    LeagueTarget(
        "Portugal",
        "Taca de Portugal",
        "cup",
        "domestic_season",
        1,
        50,
        "football_portugal_tacadeportugal",
        aliases=("Taça de Portugal",),
    ),
    LeagueTarget("Spain", "Copa del Rey", "cup", "domestic_season", 1, 55, "football_spain_copadelrey"),
    LeagueTarget("England", "FA Cup", "cup", "domestic_season", 1, 55, "football_england_facup"),
    LeagueTarget("Italy", "Coppa Italia", "cup", "domestic_season", 1, 55, "football_italy_coppaitalia"),
]


def _normalize(value: str | None) -> str:
    return "".join(ch.lower() for ch in (value or "") if ch.isalnum())


def _load_dotenv(path: Path = DEFAULT_DOTENV_PATH) -> None:
    if not path.exists():
        return
    for raw_line in path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


def _api_key() -> str:
    return os.getenv("API_FOOTBALL_KEY") or os.getenv("API_FOOTBALL_API_KEY") or ""


def _request_leagues(base_url: str, api_key: str, country: str | None, search: str | None) -> list[dict[str, Any]]:
    params: dict[str, str] = {}
    if country and country != "World":
        params["country"] = country
    if search:
        params["search"] = search

    response = requests.get(
        f"{base_url.rstrip('/')}/leagues",
        headers={"x-apisports-key": api_key},
        params=params,
        timeout=float(os.getenv("API_FOOTBALL_TIMEOUT_SECONDS", "30")),
    )
    response.raise_for_status()
    payload = response.json()
    items = payload.get("response", [])
    return items if isinstance(items, list) else []


def _search_leagues(base_url: str, api_key: str, target: LeagueTarget) -> list[dict[str, Any]]:
    items = _request_leagues(base_url, api_key, target.country, target.competition_name)
    if items:
        return items
    if target.country != "World":
        items = _request_leagues(base_url, api_key, target.country, None)
        if items:
            return items
    return _request_leagues(base_url, api_key, None, target.competition_name)


def _entry(target: LeagueTarget, league_id: int | None, notes: str, enabled: bool = False) -> dict[str, Any]:
    return {
        "sport": "football",
        "country": target.country,
        "competition_name": target.competition_name,
        "competition_type": target.competition_type,
        "league_id": league_id,
        "season_mode": target.season_mode,
        "tier": target.tier,
        "priority": target.priority,
        "enabled": enabled,
        "agent_profile": target.agent_profile,
        "strategy_profile": target.strategy_profile,
        "notes": notes,
    }


def _match_target(target: LeagueTarget, items: list[dict[str, Any]]) -> tuple[int | None, str, list[dict[str, Any]]]:
    expected_names = {_normalize(target.competition_name), *(_normalize(alias) for alias in target.aliases)}
    expected_country = _normalize(target.country)
    exact_matches: list[dict[str, Any]] = []
    loose_matches: list[dict[str, Any]] = []

    for item in items:
        league = item.get("league") if isinstance(item.get("league"), dict) else {}
        country = item.get("country") if isinstance(item.get("country"), dict) else {}
        league_name = str(league.get("name") or "")
        country_name = str(country.get("name") or "")
        normalized_league_name = _normalize(league_name)
        if normalized_league_name in expected_names and (
            target.country == "World" or _normalize(country_name) == expected_country
        ):
            exact_matches.append(item)
        elif any(expected_name in normalized_league_name or normalized_league_name in expected_name for expected_name in expected_names):
            loose_matches.append(item)

    if len(exact_matches) == 1:
        league = exact_matches[0].get("league") if isinstance(exact_matches[0].get("league"), dict) else {}
        league_id = league.get("id")
        if isinstance(league_id, int):
            return league_id, "verified_api_football_exact_match", exact_matches

    candidates = exact_matches or loose_matches or items
    if not candidates:
        return None, "not_found_api_football", []
    if len(candidates) == 1:
        league = candidates[0].get("league") if isinstance(candidates[0].get("league"), dict) else {}
        league_id = league.get("id")
        if isinstance(league_id, int):
            return league_id, "verified_api_football_single_candidate", candidates
    return None, "ambiguous_api_football_candidates", candidates


def _candidate_summary(item: dict[str, Any]) -> dict[str, Any]:
    league = item.get("league") if isinstance(item.get("league"), dict) else {}
    country = item.get("country") if isinstance(item.get("country"), dict) else {}
    seasons = item.get("seasons") if isinstance(item.get("seasons"), list) else []
    return {
        "league_id": league.get("id"),
        "name": league.get("name"),
        "type": league.get("type"),
        "country": country.get("name"),
        "seasons": [season.get("year") for season in seasons if isinstance(season, dict)],
    }


def build_registry(
    *,
    country_filter: str | None = None,
    name_filter: str | None = None,
    api_key: str | None = None,
    base_url: str = DEFAULT_API_BASE_URL,
) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    key = api_key if api_key is not None else _api_key()
    targets = [
        target
        for target in TARGET_LEAGUES
        if (not country_filter or _normalize(target.country) == _normalize(country_filter))
        and (not name_filter or _normalize(name_filter) in _normalize(target.competition_name))
    ]
    ambiguities: list[dict[str, Any]] = []
    entries: list[dict[str, Any]] = []

    for target in targets:
        if not key:
            entries.append(_entry(target, None, "Pending API-Football ID verification: missing API_FOOTBALL_KEY."))
            continue

        try:
            items = _search_leagues(base_url, key, target)
            league_id, status, candidates = _match_target(target, items)
        except requests.RequestException as exc:
            league_id = None
            status = "api_football_request_failed"
            candidates = []
            ambiguities.append(
                {
                    "country": target.country,
                    "competition_name": target.competition_name,
                    "status": status,
                    "error": str(exc),
                }
            )

        if league_id is None and key and status != "api_football_request_failed":
            ambiguities.append(
                {
                    "country": target.country,
                    "competition_name": target.competition_name,
                    "status": status,
                    "candidates": [_candidate_summary(candidate) for candidate in candidates],
                }
            )

        entries.append(_entry(target, league_id, status))

    verification_status = "verified" if key and not ambiguities else "partial" if key else "pending_api_key"
    return (
        {
            "version": 1,
            "source": "api-football",
            "generated_at": datetime.now(timezone.utc).isoformat(),
            "verification_status": verification_status,
            "notes": "IDs are written only when API-Football returns a non-ambiguous match.",
            "leagues": entries,
        },
        ambiguities,
    )


def main() -> int:
    _load_dotenv()
    parser = argparse.ArgumentParser(description="Build the BetAuto football coverage registry from API-Football.")
    parser.add_argument("--country", help="Limit lookup to one country name.")
    parser.add_argument("--name", help="Limit lookup to competition names containing this value.")
    parser.add_argument("--output", default=str(DEFAULT_REGISTRY_PATH), help="Output registry JSON path.")
    parser.add_argument("--base-url", default=os.getenv("API_FOOTBALL_BASE_URL", DEFAULT_API_BASE_URL))
    parser.add_argument("--write", action="store_true", help="Write the generated registry to --output.")
    parser.add_argument("--print", action="store_true", help="Print the generated registry JSON to stdout.")
    args = parser.parse_args()

    registry, ambiguities = build_registry(country_filter=args.country, name_filter=args.name, base_url=args.base_url)

    if args.print or not args.write:
        print(json.dumps(registry, indent=2, ensure_ascii=False))

    if args.write:
        output = Path(args.output)
        output.parent.mkdir(parents=True, exist_ok=True)
        output.write_text(json.dumps(registry, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
        print(f"Wrote football league registry: {output}")

    if ambiguities:
        print("Ambiguities or unresolved competitions:", file=sys.stderr)
        print(json.dumps(ambiguities, indent=2, ensure_ascii=False), file=sys.stderr)

    if not _api_key():
        print("API_FOOTBALL_KEY is missing; league_id values were left null.", file=sys.stderr)
        return 2

    return 1 if ambiguities else 0


if __name__ == "__main__":
    raise SystemExit(main())

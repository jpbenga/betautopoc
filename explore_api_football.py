#!/usr/bin/env python3
"""
explore_api_football.py

Objectif
--------
Explorer API-Football pour préparer l'intégration dans BetAuto.

Ce script :
1. lit la clé API-Football depuis .env ;
2. récupère un match test de Premier League ;
3. récupère les odds / marchés disponibles ;
4. extrait les marchés Betclic si Betclic est présent ;
5. explore les endpoints utiles pour l'analyse IA :
   - fixtures
   - fixture statistics
   - fixture events
   - lineups
   - players statistics
   - injuries
   - predictions
   - standings
   - team statistics
   - recent form home/away
   - head-to-head
   - odds bookmakers
   - odds bets / markets
6. sauvegarde tout dans un fichier JSON horodaté.

Installation
------------
pip install requests python-dotenv

.env attendu
------------
API_FOOTBALL_KEY=ta_cle_api_football

Optionnel :
API_FOOTBALL_BASE_URL=https://v3.football.api-sports.io
API_FOOTBALL_LEAGUE_ID=39
API_FOOTBALL_SEASON=2025
API_FOOTBALL_BOOKMAKER_NAME=Betclic
API_FOOTBALL_EXPLORATION_DATE=2026-04-25

Usage
-----
python explore_api_football.py

Sortie
------
api_football_exploration_YYYYMMDD_HHMMSS.json
"""

from __future__ import annotations

import json
import os
import sys
import time
from dataclasses import dataclass
from datetime import date, datetime, timedelta
from pathlib import Path
from typing import Any

import requests
from dotenv import load_dotenv


# ---------------------------------------------------------------------
# CONFIG
# ---------------------------------------------------------------------

load_dotenv()

API_KEY = os.getenv("API_FOOTBALL_KEY")
BASE_URL = os.getenv("API_FOOTBALL_BASE_URL", "https://v3.football.api-sports.io").rstrip("/")

# Premier League = 39 dans API-Football.
LEAGUE_ID = int(os.getenv("API_FOOTBALL_LEAGUE_ID", "39"))

# Pour une saison 2025/2026, API-Football utilise généralement 2025.
SEASON = int(os.getenv("API_FOOTBALL_SEASON", "2025"))

BOOKMAKER_NAME = os.getenv("API_FOOTBALL_BOOKMAKER_NAME", "Betclic").strip()

# Date de test. Si non fournie, aujourd'hui.
EXPLORATION_DATE = os.getenv("API_FOOTBALL_EXPLORATION_DATE")

OUTPUT_DIR = Path(os.getenv("API_FOOTBALL_OUTPUT_DIR", "."))
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

REQUEST_SLEEP_SECONDS = float(os.getenv("API_FOOTBALL_REQUEST_SLEEP_SECONDS", "0.25"))


if not API_KEY:
    print("Erreur: API_FOOTBALL_KEY manquant dans .env", file=sys.stderr)
    sys.exit(1)


HEADERS = {
    "x-apisports-key": API_KEY,
}


# ---------------------------------------------------------------------
# CLIENT
# ---------------------------------------------------------------------

@dataclass
class ApiCall:
    endpoint: str
    params: dict[str, Any]
    status_code: int | None
    ok: bool
    error: str | None
    response: dict[str, Any] | None


class ApiFootballClient:
    def __init__(self, base_url: str, headers: dict[str, str]):
        self.base_url = base_url
        self.headers = headers
        self.calls: list[ApiCall] = []

    def get(self, endpoint: str, params: dict[str, Any] | None = None) -> dict[str, Any] | None:
        params = {k: v for k, v in (params or {}).items() if v is not None}
        url = f"{self.base_url}/{endpoint.lstrip('/')}"

        try:
            response = requests.get(
                url,
                headers=self.headers,
                params=params,
                timeout=30,
            )

            try:
                payload = response.json()
            except Exception:
                payload = {
                    "raw_text": response.text,
                }

            ok = response.ok and isinstance(payload, dict)

            self.calls.append(
                ApiCall(
                    endpoint=endpoint,
                    params=params,
                    status_code=response.status_code,
                    ok=ok,
                    error=None if ok else f"HTTP {response.status_code}",
                    response=payload if isinstance(payload, dict) else None,
                )
            )

            time.sleep(REQUEST_SLEEP_SECONDS)
            return payload if isinstance(payload, dict) else None

        except Exception as exc:
            self.calls.append(
                ApiCall(
                    endpoint=endpoint,
                    params=params,
                    status_code=None,
                    ok=False,
                    error=str(exc),
                    response=None,
                )
            )
            return None


client = ApiFootballClient(BASE_URL, HEADERS)


# ---------------------------------------------------------------------
# HELPERS
# ---------------------------------------------------------------------

def iso_now() -> str:
    return datetime.now().isoformat(timespec="seconds")


def today_date() -> date:
    if EXPLORATION_DATE:
        return datetime.strptime(EXPLORATION_DATE, "%Y-%m-%d").date()
    return date.today()


def get_response_list(payload: dict[str, Any] | None) -> list[Any]:
    if not payload:
        return []
    value = payload.get("response")
    return value if isinstance(value, list) else []


def safe_get(d: dict[str, Any], *path: str, default=None):
    current: Any = d
    for key in path:
        if not isinstance(current, dict):
            return default
        current = current.get(key)
    return current if current is not None else default


def find_bookmaker_id(bookmakers_payload: dict[str, Any] | None, bookmaker_name: str) -> int | None:
    name = bookmaker_name.lower()

    for row in get_response_list(bookmakers_payload):
        candidate_name = str(row.get("name", "")).lower()
        if name == candidate_name or name in candidate_name:
            try:
                return int(row["id"])
            except Exception:
                return None

    return None


def find_bookmaker_in_odds(odds_payload: dict[str, Any] | None, bookmaker_name: str) -> dict[str, Any] | None:
    name = bookmaker_name.lower()

    for fixture_odds in get_response_list(odds_payload):
        for bookmaker in fixture_odds.get("bookmakers", []):
            candidate_name = str(bookmaker.get("name", "")).lower()
            if name == candidate_name or name in candidate_name:
                return bookmaker

    return None


def summarize_markets_from_bookmaker(bookmaker: dict[str, Any] | None) -> list[dict[str, Any]]:
    if not bookmaker:
        return []

    markets: list[dict[str, Any]] = []

    for bet in bookmaker.get("bets", []):
        values = []

        for value in bet.get("values", []):
            values.append(
                {
                    "value": value.get("value"),
                    "odd": value.get("odd"),
                }
            )

        markets.append(
            {
                "api_bet_id": bet.get("id"),
                "api_bet_name": bet.get("name"),
                "values_count": len(values),
                "values": values,
            }
        )

    return markets


def fixture_summary(fixture_row: dict[str, Any]) -> dict[str, Any]:
    return {
        "fixture_id": safe_get(fixture_row, "fixture", "id"),
        "date": safe_get(fixture_row, "fixture", "date"),
        "status": safe_get(fixture_row, "fixture", "status"),
        "league": safe_get(fixture_row, "league", default={}),
        "home": safe_get(fixture_row, "teams", "home", default={}),
        "away": safe_get(fixture_row, "teams", "away", default={}),
        "goals": safe_get(fixture_row, "goals", default={}),
        "score": safe_get(fixture_row, "score", default={}),
    }


def choose_fixture_for_exploration(start_date: date) -> tuple[dict[str, Any] | None, dict[str, Any]]:
    """
    Cherche un match de Premier League à partir d'une date.
    Si aucun match ce jour-là, cherche dans les 10 jours suivants.
    """
    searched: list[dict[str, Any]] = []

    for offset in range(0, 11):
        target = start_date + timedelta(days=offset)
        payload = client.get(
            "/fixtures",
            {
                "league": LEAGUE_ID,
                "season": SEASON,
                "date": target.isoformat(),
            },
        )

        fixtures = get_response_list(payload)
        searched.append(
            {
                "date": target.isoformat(),
                "fixtures_count": len(fixtures),
                "raw": payload,
            }
        )

        if fixtures:
            return fixtures[0], {
                "selected_date": target.isoformat(),
                "searched": searched,
            }

    return None, {
        "selected_date": None,
        "searched": searched,
    }


def team_recent_fixtures(team_id: int, last: int = 5) -> dict[str, Any] | None:
    return client.get(
        "/fixtures",
        {
            "team": team_id,
            "last": last,
        },
    )


# ---------------------------------------------------------------------
# EXPLORATION
# ---------------------------------------------------------------------

def main() -> None:
    started_at = iso_now()
    exploration_date = today_date()

    print("Exploration API-Football")
    print(f"- Base URL: {BASE_URL}")
    print(f"- League ID: {LEAGUE_ID}")
    print(f"- Season: {SEASON}")
    print(f"- Bookmaker cible: {BOOKMAKER_NAME}")
    print(f"- Date de départ: {exploration_date.isoformat()}")

    # 1. Référentiels odds
    bookmakers_payload = client.get("/odds/bookmakers")
    bets_payload = client.get("/odds/bets")

    bookmaker_id = find_bookmaker_id(bookmakers_payload, BOOKMAKER_NAME)

    # 2. Fixture test
    selected_fixture, fixture_search = choose_fixture_for_exploration(exploration_date)

    if not selected_fixture:
        output = {
            "generated_at": started_at,
            "status": "no_fixture_found",
            "config": {
                "base_url": BASE_URL,
                "league_id": LEAGUE_ID,
                "season": SEASON,
                "bookmaker_name": BOOKMAKER_NAME,
                "bookmaker_id": bookmaker_id,
                "exploration_date": exploration_date.isoformat(),
            },
            "fixture_search": fixture_search,
            "api_calls": [call.__dict__ for call in client.calls],
        }

        out = OUTPUT_DIR / f"api_football_exploration_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
        out.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"Aucun match trouvé. Sortie: {out}")
        return

    selected_summary = fixture_summary(selected_fixture)

    fixture_id = selected_summary["fixture_id"]
    home_team_id = selected_summary["home"].get("id")
    away_team_id = selected_summary["away"].get("id")

    print(f"Match sélectionné: {selected_summary['home'].get('name')} vs {selected_summary['away'].get('name')}")
    print(f"Fixture ID: {fixture_id}")

    # 3. Odds du match
    odds_all_payload = client.get(
        "/odds",
        {
            "fixture": fixture_id,
        },
    )

    odds_betclic_payload = None
    if bookmaker_id:
        odds_betclic_payload = client.get(
            "/odds",
            {
                "fixture": fixture_id,
                "bookmaker": bookmaker_id,
            },
        )

    betclic_bookmaker_from_filtered = find_bookmaker_in_odds(odds_betclic_payload, BOOKMAKER_NAME)
    betclic_bookmaker_from_all = find_bookmaker_in_odds(odds_all_payload, BOOKMAKER_NAME)

    betclic_bookmaker = betclic_bookmaker_from_filtered or betclic_bookmaker_from_all
    betclic_markets = summarize_markets_from_bookmaker(betclic_bookmaker)

    # 4. Endpoints statistiques et contexte
    fixture_statistics = client.get("/fixtures/statistics", {"fixture": fixture_id})
    fixture_events = client.get("/fixtures/events", {"fixture": fixture_id})
    fixture_lineups = client.get("/fixtures/lineups", {"fixture": fixture_id})
    fixture_players = client.get("/fixtures/players", {"fixture": fixture_id})
    fixture_injuries = client.get("/injuries", {"fixture": fixture_id})
    fixture_predictions = client.get("/predictions", {"fixture": fixture_id})
    standings = client.get("/standings", {"league": LEAGUE_ID, "season": SEASON})

    home_team_statistics = None
    away_team_statistics = None
    home_recent_fixtures = None
    away_recent_fixtures = None
    head_to_head = None
    home_squad = None
    away_squad = None

    if home_team_id:
        home_team_statistics = client.get(
            "/teams/statistics",
            {
                "league": LEAGUE_ID,
                "season": SEASON,
                "team": home_team_id,
            },
        )
        home_recent_fixtures = team_recent_fixtures(home_team_id, last=5)
        home_squad = client.get("/players/squads", {"team": home_team_id})

    if away_team_id:
        away_team_statistics = client.get(
            "/teams/statistics",
            {
                "league": LEAGUE_ID,
                "season": SEASON,
                "team": away_team_id,
            },
        )
        away_recent_fixtures = team_recent_fixtures(away_team_id, last=5)
        away_squad = client.get("/players/squads", {"team": away_team_id})

    if home_team_id and away_team_id:
        head_to_head = client.get(
            "/fixtures/headtohead",
            {
                "h2h": f"{home_team_id}-{away_team_id}",
                "last": 10,
            },
        )

    # 5. Pré-dictionnaire Betclic
    market_dictionary_seed = {
        "bookmaker": {
            "target_name": BOOKMAKER_NAME,
            "api_football_bookmaker_id": bookmaker_id,
            "found_in_fixture_odds": betclic_bookmaker is not None,
            "raw_bookmaker_name": betclic_bookmaker.get("name") if betclic_bookmaker else None,
        },
        "fixture": selected_summary,
        "markets": [
            {
                "canonical_market_id": None,
                "canonical_market_name": None,
                "api_football_bet_id": market["api_bet_id"],
                "api_football_bet_name": market["api_bet_name"],
                "betclic_label_candidates": [
                    market["api_bet_name"],
                ],
                "selection_values": market["values"],
                "browser_use_notes": "",
            }
            for market in betclic_markets
        ],
    }

    # 6. Résumé d'exploitabilité
    exploitable_data_inventory = {
        "odds": {
            "endpoint": "/odds",
            "use": "Récupérer les cotes par fixture, bookmaker, marché.",
            "usefulness": "critical",
            "notes": "À appeler proche du moment d'analyse/exécution car les cotes changent.",
        },
        "odds_bookmakers": {
            "endpoint": "/odds/bookmakers",
            "use": "Identifier l'ID API-Football de Betclic et autres bookmakers.",
            "usefulness": "critical",
        },
        "odds_bets": {
            "endpoint": "/odds/bets",
            "use": "Lister les marchés disponibles côté API-Football.",
            "usefulness": "critical",
        },
        "fixtures": {
            "endpoint": "/fixtures",
            "use": "Calendrier, statut, équipes, scores.",
            "usefulness": "critical",
        },
        "fixtures_statistics": {
            "endpoint": "/fixtures/statistics",
            "use": "Statistiques d'un match, surtout utile post-match ou live selon couverture.",
            "usefulness": "high",
            "notes": "Peut inclure tirs, possession, corners, fautes, xG si disponible selon couverture.",
        },
        "fixtures_events": {
            "endpoint": "/fixtures/events",
            "use": "Buts, cartons, remplacements.",
            "usefulness": "medium",
        },
        "fixtures_lineups": {
            "endpoint": "/fixtures/lineups",
            "use": "Compositions. Très utile si disponible avant match.",
            "usefulness": "high",
            "notes": "Souvent disponible proche du coup d'envoi.",
        },
        "fixtures_players": {
            "endpoint": "/fixtures/players",
            "use": "Statistiques joueurs du match.",
            "usefulness": "medium",
            "notes": "Surtout post-match/live.",
        },
        "injuries": {
            "endpoint": "/injuries",
            "use": "Blessures / absences.",
            "usefulness": "high",
        },
        "predictions": {
            "endpoint": "/predictions",
            "use": "Prédictions API-Football, comparaison avec ton modèle.",
            "usefulness": "medium",
            "notes": "À utiliser comme signal, pas comme vérité.",
        },
        "standings": {
            "endpoint": "/standings",
            "use": "Classement, forme, positions.",
            "usefulness": "critical",
        },
        "teams_statistics": {
            "endpoint": "/teams/statistics",
            "use": "Stats saison équipe : buts, clean sheets, forme, domicile/extérieur.",
            "usefulness": "critical",
        },
        "recent_team_fixtures": {
            "endpoint": "/fixtures?team=X&last=5",
            "use": "Forme récente et dynamique.",
            "usefulness": "critical",
        },
        "head_to_head": {
            "endpoint": "/fixtures/headtohead",
            "use": "Historique confrontations.",
            "usefulness": "medium",
        },
        "players_squads": {
            "endpoint": "/players/squads",
            "use": "Effectif pour alias joueurs/équipes, moins prioritaire.",
            "usefulness": "low",
        },
    }

    output = {
        "generated_at": started_at,
        "status": "completed",
        "config": {
            "base_url": BASE_URL,
            "league_id": LEAGUE_ID,
            "season": SEASON,
            "bookmaker_name": BOOKMAKER_NAME,
            "bookmaker_id": bookmaker_id,
            "exploration_date": exploration_date.isoformat(),
        },
        "selected_fixture": selected_summary,
        "fixture_search": fixture_search,
        "market_dictionary_seed": market_dictionary_seed,
        "exploitable_data_inventory": exploitable_data_inventory,
        "raw": {
            "odds_bookmakers": bookmakers_payload,
            "odds_bets": bets_payload,
            "odds_all_for_fixture": odds_all_payload,
            "odds_betclic_for_fixture": odds_betclic_payload,
            "fixture_statistics": fixture_statistics,
            "fixture_events": fixture_events,
            "fixture_lineups": fixture_lineups,
            "fixture_players": fixture_players,
            "fixture_injuries": fixture_injuries,
            "fixture_predictions": fixture_predictions,
            "standings": standings,
            "home_team_statistics": home_team_statistics,
            "away_team_statistics": away_team_statistics,
            "home_recent_fixtures": home_recent_fixtures,
            "away_recent_fixtures": away_recent_fixtures,
            "head_to_head": head_to_head,
            "home_squad": home_squad,
            "away_squad": away_squad,
        },
        "api_calls": [call.__dict__ for call in client.calls],
    }

    out = OUTPUT_DIR / f"api_football_exploration_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
    out.write_text(json.dumps(output, ensure_ascii=False, indent=2), encoding="utf-8")

    print("")
    print("Exploration terminée.")
    print(f"Sortie JSON: {out.resolve()}")
    print(f"Bookmaker ID trouvé pour {BOOKMAKER_NAME}: {bookmaker_id}")
    print(f"Marchés Betclic trouvés sur ce match: {len(betclic_markets)}")

    if not betclic_markets:
        print("")
        print("Attention: aucun marché Betclic trouvé pour ce match.")
        print("Ca peut venir de :")
        print("- Betclic absent de la couverture API-Football pour ce fixture ;")
        print("- bookmaker nommé autrement dans l'API ;")
        print("- odds non disponibles pour ce match ;")
        print("- mauvais season/league/date.")


if __name__ == "__main__":
    main()

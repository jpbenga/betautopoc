from __future__ import annotations

from typing import Any

from .models import MarketContext, OddsContext, TeamContext


def normalize_fixture(item: dict[str, Any]) -> dict[str, Any]:
    fixture = item.get("fixture", {})
    league = item.get("league", {})
    teams = item.get("teams", {})
    return {
        "fixture_id": fixture.get("id"),
        "kickoff_time": fixture.get("date"),
        "competition": league.get("name", "Unknown competition"),
        "home_team": {"id": teams.get("home", {}).get("id"), "name": teams.get("home", {}).get("name", "Home")},
        "away_team": {"id": teams.get("away", {}).get("id"), "name": teams.get("away", {}).get("name", "Away")},
    }


def normalize_team(team_data: dict[str, Any]) -> TeamContext:
    return TeamContext(
        id=int(team_data.get("id", 0)),
        name=team_data.get("name", "Unknown"),
    )


def normalize_standings_for_team(standings_response: dict[str, Any], team_id: int) -> dict[str, Any]:
    for league_block in standings_response.get("response", []):
        league = league_block.get("league", {})
        for standing_group in league.get("standings", []):
            for row in standing_group:
                team = row.get("team", {})
                if team.get("id") == team_id:
                    return {
                        "rank": row.get("rank"),
                        "points": row.get("points"),
                        "goals_diff": row.get("goalsDiff"),
                        "form": row.get("form"),
                        "description": row.get("description"),
                        "all": row.get("all", {}),
                        "home": row.get("home", {}),
                        "away": row.get("away", {}),
                    }
    return {}


def normalize_team_statistics(team_stats_response: dict[str, Any]) -> dict[str, Any]:
    response = team_stats_response.get("response", {})
    if not isinstance(response, dict):
        return {}
    return {
        "form": response.get("form"),
        "fixtures": response.get("fixtures", {}),
        "goals": response.get("goals", {}),
        "clean_sheet": response.get("clean_sheet", {}),
        "failed_to_score": response.get("failed_to_score", {}),
        "biggest": response.get("biggest", {}),
    }


def normalize_recent_form(recent_fixtures_response: dict[str, Any], team_id: int) -> list[dict[str, Any]]:
    output: list[dict[str, Any]] = []
    for item in recent_fixtures_response.get("response", []):
        fixture = item.get("fixture", {})
        teams = item.get("teams", {})
        goals = item.get("goals", {})
        home = teams.get("home", {})
        away = teams.get("away", {})

        side = "home" if home.get("id") == team_id else "away"
        team_goals = goals.get("home") if side == "home" else goals.get("away")
        opponent_goals = goals.get("away") if side == "home" else goals.get("home")
        if team_goals is None or opponent_goals is None:
            result = "N"
        elif team_goals > opponent_goals:
            result = "W"
        elif team_goals < opponent_goals:
            result = "L"
        else:
            result = "D"

        output.append(
            {
                "fixture_id": fixture.get("id"),
                "date": fixture.get("date"),
                "opponent": away.get("name") if side == "home" else home.get("name"),
                "team_goals": team_goals,
                "opponent_goals": opponent_goals,
                "result": result,
            }
        )
    return output


def normalize_injuries(injuries_response: dict[str, Any], team_id: int) -> list[dict[str, Any]]:
    injuries: list[dict[str, Any]] = []
    for item in injuries_response.get("response", []):
        team = item.get("team", {})
        if team.get("id") != team_id:
            continue
        player = item.get("player", {})
        injury = item.get("player", {}).get("injury", {})
        injuries.append(
            {
                "player_id": player.get("id"),
                "name": player.get("name"),
                "type": injury.get("type"),
                "reason": injury.get("reason"),
            }
        )
    return injuries


def normalize_lineups(lineups_response: dict[str, Any], team_id: int) -> dict[str, Any] | None:
    for item in lineups_response.get("response", []):
        team = item.get("team", {})
        if team.get("id") == team_id:
            return {
                "formation": item.get("formation"),
                "start_xi": [player.get("player", {}).get("name") for player in item.get("startXI", [])],
                "substitutes": [player.get("player", {}).get("name") for player in item.get("substitutes", [])],
                "coach": item.get("coach", {}),
            }
    return None


def normalize_head_to_head(head_to_head_response: dict[str, Any]) -> list[dict[str, Any]]:
    output: list[dict[str, Any]] = []
    for item in head_to_head_response.get("response", []):
        fixture = item.get("fixture", {})
        teams = item.get("teams", {})
        goals = item.get("goals", {})
        output.append(
            {
                "fixture_id": fixture.get("id"),
                "date": fixture.get("date"),
                "home": teams.get("home", {}).get("name"),
                "away": teams.get("away", {}).get("name"),
                "score": {"home": goals.get("home"), "away": goals.get("away")},
            }
        )
    return output


def normalize_odds(odds_response: dict[str, Any], bookmaker_id: int, bookmaker_name: str) -> OddsContext:
    markets: list[MarketContext] = []
    for item in odds_response.get("response", []):
        for bookmaker in item.get("bookmakers", []):
            if bookmaker.get("id") != bookmaker_id:
                continue
            for bet in bookmaker.get("bets", []):
                markets.append(
                    MarketContext(
                        id=bet.get("id"),
                        name=bet.get("name", "Unknown market"),
                        values=[
                            {"value": value.get("value"), "odd": value.get("odd")} for value in bet.get("values", []) if isinstance(value, dict)
                        ],
                    )
                )
    return OddsContext(bookmaker={"id": bookmaker_id, "name": bookmaker_name}, markets=markets)


def normalize_predictions(predictions_response: dict[str, Any]) -> dict[str, Any]:
    response = predictions_response.get("response", [])
    if not response:
        return {}
    first = response[0]
    return {
        "winner": first.get("predictions", {}).get("winner"),
        "win_or_draw": first.get("predictions", {}).get("win_or_draw"),
        "advice": first.get("predictions", {}).get("advice"),
        "comparison": first.get("comparison", {}),
    }

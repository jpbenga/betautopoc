from __future__ import annotations

import re
import unicodedata


CANONICAL_MARKET_MAP: dict[str, str] = {
    "Match Winner": "match_winner",
    "Home/Away": "home_away",
    "Double Chance": "double_chance",
    "Both Teams Score": "both_teams_to_score",
    "Goals Over/Under": "goals_over_under",
    "Goals Over/Under First Half": "goals_over_under_first_half",
    "First Half Winner": "first_half_winner",
    "Second Half Winner": "second_half_winner",
    "Team To Score First": "team_to_score_first",
    "Team To Score Last": "team_to_score_last",
    "Clean Sheet - Home": "clean_sheet_home",
    "Clean Sheet - Away": "clean_sheet_away",
    "Win to Nil - Home": "win_to_nil_home",
    "Win to Nil - Away": "win_to_nil_away",
    "Win To Nil": "win_to_nil",
    "Exact Score": "exact_score",
    "Correct Score - First Half": "correct_score_first_half",
    "Handicap Result": "handicap_result",
    "Asian Handicap": "asian_handicap",
    "Asian Handicap First Half": "asian_handicap_first_half",
    "Odd/Even": "odd_even",
    "Odd/Even - First Half": "odd_even_first_half",
    "Home Odd/Even": "home_odd_even",
    "Results/Both Teams Score": "result_both_teams_score",
    "Result/Total Goals": "result_total_goals",
    "HT/FT Double": "ht_ft_double",
    "Highest Scoring Half": "highest_scoring_half",
    "Exact Goals Number": "exact_goals_number",
    "Home Team Exact Goals Number": "home_team_exact_goals_number",
    "Away Team Exact Goals Number": "away_team_exact_goals_number",
    "To Win Either Half": "to_win_either_half",
    "Win Both Halves": "win_both_halves",
    "Home win both halves": "home_win_both_halves",
    "Double Chance - First Half": "double_chance_first_half",
    "Double Chance - Second Half": "double_chance_second_half",
    "Both Teams Score - First Half": "both_teams_score_first_half",
    "Both Teams To Score - Second Half": "both_teams_score_second_half",
    "Total - Home": "total_home",
    "Total - Away": "total_away",
    "Handicap Result - First Half": "handicap_result_first_half",
    "Goals Over/Under - Second Half": "goals_over_under_second_half",
}

CATEGORY_BY_MARKET_ID: dict[str, str] = {
    "match_winner": "main_market",
    "home_away": "main_market",
    "double_chance": "main_market",
    "draw_no_bet": "main_market",
    "both_teams_to_score": "main_market",
    "goals_over_under": "main_market",
    "first_half_winner": "period_market",
    "second_half_winner": "period_market",
    "double_chance_first_half": "period_market",
    "double_chance_second_half": "period_market",
    "goals_over_under_first_half": "period_market",
    "goals_over_under_second_half": "period_market",
    "both_teams_score_first_half": "period_market",
    "both_teams_score_second_half": "period_market",
    "exact_score": "score_market",
    "correct_score_first_half": "score_market",
    "exact_goals_number": "score_market",
    "home_team_exact_goals_number": "score_market",
    "away_team_exact_goals_number": "score_market",
    "handicap_result": "handicap_market",
    "handicap_result_first_half": "handicap_market",
    "asian_handicap": "handicap_market",
    "asian_handicap_first_half": "handicap_market",
    "team_to_score_first": "team_market",
    "team_to_score_last": "team_market",
    "clean_sheet_home": "team_market",
    "clean_sheet_away": "team_market",
    "win_to_nil": "team_market",
    "win_to_nil_home": "team_market",
    "win_to_nil_away": "team_market",
    "total_home": "team_market",
    "total_away": "team_market",
    "ht_ft_double": "combo_market",
    "result_total_goals": "combo_market",
    "result_both_teams_score": "combo_market",
    "highest_scoring_half": "combo_market",
    "to_win_either_half": "combo_market",
    "win_both_halves": "combo_market",
    "home_win_both_halves": "combo_market",
}


def _slugify(text: str) -> str:
    raw = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    raw = re.sub(r"[^a-zA-Z0-9]+", "_", raw).strip("_").lower()
    return re.sub(r"_+", "_", raw)


def normalize_market_name(market_name: str) -> str:
    return CANONICAL_MARKET_MAP.get(market_name, _slugify(market_name))


def canonical_market_name(canonical_market_id: str) -> str:
    return canonical_market_id.replace("_", " ").capitalize()


def market_category(canonical_market_id: str) -> str:
    return CATEGORY_BY_MARKET_ID.get(canonical_market_id, "other")


def normalize_selection_value(value: str) -> str:
    cleaned = value.strip()
    lower = cleaned.lower()
    if lower in {"yes", "oui"}:
        return "yes"
    if lower in {"no", "non"}:
        return "no"
    if lower == "home":
        return "home"
    if lower == "draw":
        return "draw"
    if lower == "away":
        return "away"
    if lower in {"odd", "even"}:
        return lower

    match = re.match(r"^(over|under)\s+([0-9]+(?:\.[0-9]+)?)$", cleaned, flags=re.IGNORECASE)
    if match:
        kind = match.group(1).lower()
        number = match.group(2).replace(".", "_")
        return f"{kind}_{number}"

    if cleaned in {"Home/Draw", "1X", "1N", "1 / N"}:
        return "home_or_draw"
    if cleaned in {"Draw/Away", "X2", "N2", "N / 2"}:
        return "draw_or_away"
    if cleaned in {"Home/Away", "12", "1 / 2"}:
        return "home_or_away"

    return _slugify(cleaned)

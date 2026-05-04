# API-SPORTS Baseball integration notes

Date d'exploration: 2026-05-02

Base URL: `https://v1.baseball.api-sports.io`

Header requis: `x-apisports-key`

## Constats API verifies

- La cle locale chargee via `.env` fonctionne avec API-SPORTS Baseball.
- `/seasons` retourne les saisons `2008` a `2026`.
- `/countries` retourne 31 pays/zones, dont USA `id=1`, Japan `id=2`, South-Korea `id=3`.
- `/leagues?season=2026` retourne 30 competitions.
- Ligues cibles 2026:
  - MLB: `league_id=1`, USA, current=true, 2026-03-26 -> 2026-09-07.
  - NPB: `league_id=2`, Japan, current=true, 2026-02-21 -> 2026-09-29.
  - KBO: `league_id=5`, South-Korea, current=true, 2026-03-12 -> 2026-09-06.
- `/games` accepte `league`, `season`, `date` et retourne `id`, `date`, `status`, `country`, `league`, `teams`, `scores`.
- `/games?id=<game_id>` retourne le meme shape detaille que la liste par date.
- `/games/h2h?h2h=<home_id>-<away_id>` retourne les confrontations historiques.
- `/teams/statistics?league=<id>&season=<yyyy>&team=<id>` retourne les bilans home/away/all et points for/against.
- `/standings?league=<id>&season=<yyyy>` retourne un tableau imbrique par groupes/stages.
- `/odds/bookmakers` retourne 30 bookmakers; Unibet est `bookmaker_id=11` en baseball.
- `/odds/bets` retourne 83 marches baseball.
- `/odds?game=<game_id>&bookmaker=11` retourne les odds Unibet pour un match lorsque disponibles.
- Les odds pre-match sont annoncees entre 1 et 7 jours avant le match, avec historique 7 jours et mise a jour une fois par jour.

## Marches baseball principaux

Mapping MVP recommande:

| Canonical id | API bet id | API label |
| --- | ---: | --- |
| `moneyline` | 1 | `Home/Away` |
| `run_line` | 2 | `Asian Handicap` |
| `first_5_run_line` | 3 | `Asian Handicap (1st 5 Innings)` |
| `first_5_moneyline` | 4 | `Money Line (1st 5 Innings)` |
| `total_runs` | 5 | `Over/Under` |
| `first_5_total_runs` | 6 | `Over/Under (1st 5 Innings)` |
| `team_total_home` | 43 | `Home Team Total Goals (Including OT)` |
| `team_total_away` | 44 | `Away Team Total Goals (Including OT)` |

Notes:
- API-SPORTS utilise parfois des labels herites du football (`Goals`, `Asian Handicap`). Le dictionnaire BetAuto doit les renommer en concepts baseball.
- NPB/KBO peuvent avoir des regles de nul differentes de MLB. Ne pas supposer que `Home/Away` couvre tous les cas sans verification odds par ligue.

## Donnees absentes ou insuffisantes

Tests effectues:

- `/players?team=34&season=2026` repond: endpoint inexistant.
- `/injuries?team=34&season=2026` repond: endpoint inexistant.
- `/games?id=<game_id>` ne contient pas de lanceurs probables/confirmes.

Consequence:
- API-SPORTS Baseball suffit pour un MVP odds + equipes + classement + H2H.
- Elle ne suffit pas seule pour une analyse baseball serieuse centree sur les starting pitchers.
- Il faut ajouter au moins une source complementaire pour:
  - `pitcher_home`
  - `pitcher_away`
  - statut probable/confirmed/TBD/changed
  - stats pitcher: ERA, WHIP, IP, K, BB, recent starts
  - blessures et lineups si on veut une qualite d'analyse elevee.

## Architecture multi-sport proposee

Principe: separer le pipeline commun des adaptateurs sport/provider.

Couche commune:

- `SportContextBuilder` interface.
- `ProviderClient` interface.
- modele de contexte commun avec `sport`, `event_id`, `provider`, `league`, `season`, `home_team`, `away_team`, `odds`, `analysis_readiness`.
- dictionnaires de marches par sport.
- prompts d'analyse par sport.
- agregateur odds base sur le dictionnaire, pas sur des labels football hardcodes.

Couche football:

- conserver API-Football et les comportements strict-mode existants.
- garder les IDs football et la coverage registry football separes.

Couche baseball:

- client `ApiSportsBaseballClient`.
- builder `BaseballAnalysisContextBuilder`.
- registry `config/coverage/baseball_leagues.json`.
- dictionnaire `data/market_dictionary/baseball_markets.json`.
- strategie `config/strategies/baseball_mlb.json`.
- prompt `prompts/baseball_match_analysis_prompt.txt`.

## Decisions a trancher

1. MVP baseball:
   - MLB uniquement au depart, ou MLB + NPB + KBO des le premier passage ?
2. Source pitchers:
   - accepter MVP sans pitcher mais data_quality souvent `low/medium`, ou ajouter directement une source externe.
3. Fournisseur secondaire:
   - MLB.com probable pitchers / Stats API pour MLB uniquement.
   - SportsDataIO/Sportsradar/FantasyData/Balldontlie pour lineups, pitchers, injuries et player stats selon budget et couverture.
4. Frequence orchestrateur:
   - baseball pre-match daily odds: au moins 1 run catalogue/jour.
   - contexte matchday: refresh plus frequent le jour J, surtout pour pitcher status.
   - apres changement pitcher: invalider ou degrader les picks impactes.
5. Multi-sport tickets:
   - garder `allow_multi_sport=false` au debut pour eviter de melanger football/baseball dans un meme ticket.

## Donnees minimales pour analyser un match baseball

Obligatoires:

- game id, date, status, league, season.
- home/away teams.
- standings des deux equipes.
- team statistics home/away/all.
- recent form via derniers games des deux equipes.
- H2H recent limite.
- odds bookmaker cible.
- readiness explicite.

Fortement recommandees:

- pitchers probables/confirmes.
- ERA, WHIP, recent starts, handedness.
- bullpen fatigue / games back-to-back.
- meteo: vent, temperature, humidite, stade si disponible.
- injuries / lineup.


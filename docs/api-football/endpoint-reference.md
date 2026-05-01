# Reference rapide des endpoints API-Football

Base URL: `https://v3.football.api-sports.io`

Header obligatoire: `x-apisports-key`

Cette reference est une mise en forme locale des extraits officiels fournis dans les fichiers `*-raw.md`. Pour un comportement exact, verifier aussi le bloc brut correspondant.

## Catalogue

| Sujet | Endpoint | Parametres principaux | Frequence officielle | Notes |
| --- | --- | --- | --- | --- |
| Timezones | `/timezone` | aucun | non mis a jour | Appel ponctuel. |
| Countries | `/countries` | `name`, `code`, `search` | a chaque nouveau pays couvert | Appel quotidien conseille. |
| Leagues/Cups | `/leagues` | `id`, `name`, `country`, `code`, `season`, `team`, `type`, `current`, `search`, `last` | plusieurs fois par jour | Retourne le champ `coverage`. |
| League seasons | `/leagues/seasons` | aucun | a chaque nouvelle ligue | Saison = `YYYY`, meme pour `YYYY-YYYY+1`. |
| Teams countries | `/teams/countries` | aucun | plusieurs fois par semaine | Catalogue pour `/teams`. |
| Players seasons | `/players/seasons` | `player` | quotidien | Liste des saisons disponibles pour les stats joueurs. |
| Bookmakers | `/odds/bookmakers` | `id`, `search` | plusieurs fois par semaine | IDs utilisables avec `/odds`. |
| Pre-match bets | `/odds/bets` | `id`, `search` | plusieurs fois par semaine | Non compatible avec `/odds/live`. |
| Live bets | `/odds/live/bets` | `id`, `search` | toutes les 60 secondes | Non compatible avec `/odds`. |

## Equipes, stades et classements

| Sujet | Endpoint | Parametres principaux | Frequence officielle | Notes |
| --- | --- | --- | --- | --- |
| Teams information | `/teams` | `id`, `name`, `league`, `season`, `country`, `code`, `venue`, `search` | plusieurs fois par semaine | Au moins un parametre requis. |
| Team statistics | `/teams/statistics` | `league` requis, `season` requis, `team` requis, `date` | deux fois par jour | Stats d'une equipe sur competition+saison. |
| Teams seasons | `/teams/seasons` | `team` requis | plusieurs fois par semaine | Saisons disponibles pour une equipe. |
| Venues | `/venues` | `id`, `name`, `city`, `country`, `search` | plusieurs fois par semaine | Au moins un parametre requis. |
| Standings | `/standings` | `season` requis, `league`, `team` | toutes les heures | Certains tournois ont plusieurs groupes/rounds. |
| Rounds | `/fixtures/rounds` | `league` requis, `season` requis, `current`, `dates`, `timezone` | quotidien | `round` est reutilisable dans `/fixtures`. |

## Fixtures

| Sujet | Endpoint | Parametres principaux | Frequence officielle | Notes |
| --- | --- | --- | --- | --- |
| Fixtures | `/fixtures` | `id`, `ids`, `live`, `date`, `league`, `season`, `team`, `last`, `next`, `from`, `to`, `round`, `status`, `venue`, `timezone` | donnees mises a jour toutes les 15 secondes | Appels recommandes: 1/minute en live, sinon 1/jour. |
| Head to head | `/fixtures/headtohead` | `h2h` requis, `date`, `league`, `season`, `last`, `next`, `from`, `to`, `status`, `venue`, `timezone` | toutes les 15 secondes | `h2h` au format `teamId-teamId`. |
| Fixture statistics | `/fixtures/statistics` | `fixture` requis, `team`, `type`, `half` | toutes les minutes | `half=true` disponible a partir des donnees 2024. |
| Fixture events | `/fixtures/events` | `fixture` requis, `team`, `player`, `type` | toutes les 15 secondes | VAR disponible depuis la saison 2020-2021. |
| Fixture lineups | `/fixtures/lineups` | `fixture` requis, `team`, `player`, `type` | toutes les 15 minutes | Lineups generalement 20 a 40 minutes avant le match si couvert. |
| Fixture players | `/fixtures/players` | `fixture` requis, `team` | toutes les minutes | Statistiques joueurs d'un match. |

### Statuts fixture

| Type | Statuts |
| --- | --- |
| Programme | `TBD`, `NS` |
| Live | `1H`, `HT`, `2H`, `ET`, `BT`, `P`, `SUSP`, `INT`, `LIVE` |
| Termine | `FT`, `AET`, `PEN` |
| Reporte/annule | `PST`, `CANC` |
| Non joue/autre | `ABD`, `AWD`, `WO` |

## Predictions et blessures

| Sujet | Endpoint | Parametres principaux | Frequence officielle | Notes |
| --- | --- | --- | --- | --- |
| Injuries | `/injuries` | `league`, `season`, `fixture`, `team`, `player`, `date`, `ids`, `timezone` | toutes les 4 heures | Donnees disponibles depuis avril 2021; au moins un parametre requis. |
| Predictions | `/predictions` | `fixture` requis | toutes les heures | Les cotes bookmakers ne sont pas utilisees par l'API pour ces predictions. |

## Joueurs et staff

| Sujet | Endpoint | Parametres principaux | Frequence officielle | Notes |
| --- | --- | --- | --- | --- |
| Coachs | `/coachs` | `id`, `team`, `search` | quotidien | Orthographe endpoint officielle: `coachs`. |
| Player profiles | `/players/profiles` | `player`, `search`, `page` | plusieurs fois par semaine | Pagination: 250 resultats/page. |
| Player statistics | `/players` | `id`, `team`, `league`, `season`, `search`, `page` | plusieurs fois par semaine | Pagination: 20 resultats/page. |
| Squads | `/players/squads` | `team`, `player` | plusieurs fois par semaine | Preferer cet endpoint pour l'effectif courant. |
| Player teams | `/players/teams` | `player` requis | plusieurs fois par semaine | Carrieres/equipes associees au joueur. |
| Top scorers | `/players/topscorers` | `league` requis, `season` requis | plusieurs fois par semaine | Top 20. |
| Top assists | `/players/topassists` | `league` requis, `season` requis | plusieurs fois par semaine | Top 20. |
| Top yellow cards | `/players/topyellowcards` | `league` requis, `season` requis | plusieurs fois par semaine | Top 20. |
| Top red cards | `/players/topredcards` | `league` requis, `season` requis | plusieurs fois par semaine | Top 20. |
| Transfers | `/transfers` | `player`, `team` | plusieurs fois par semaine | Transferts joueurs/equipes. |
| Trophies | `/trophies` | `player`, `players`, `coach`, `coachs` | plusieurs fois par semaine | IDs multiples avec `id-id`. |
| Sidelined | `/sidelined` | `player`, `players`, `coach`, `coachs` | plusieurs fois par semaine | Absences historiques joueur/coach. |

## Odds

| Sujet | Endpoint | Parametres principaux | Frequence officielle | Notes |
| --- | --- | --- | --- | --- |
| Live odds | `/odds/live` | `fixture`, `league`, `bet` | toutes les 5 a 60 secondes | Pas d'historique; fixtures ajoutees peu avant le coup d'envoi et retirees peu apres. |
| Pre-match odds | `/odds` | `fixture`, `league`, `season`, `date`, `timezone`, `page`, `bookmaker`, `bet` | toutes les 3 heures | Pagination: 10 resultats/page; donnees 1 a 14 jours avant match; historique limite 7 jours. |
| Odds mapping | `/odds/mapping` | `page` | quotidien | Pagination: 100 resultats/page. |

## URLs media documentees

| Ressource | URL |
| --- | --- |
| Drapeau pays | `https://media.api-sports.io/flags/{country_code}.svg` |
| Logo ligue | `https://media.api-sports.io/football/leagues/{league_id}.png` |
| Logo equipe | `https://media.api-sports.io/football/teams/{team_id}.png` |
| Image stade | `https://media.api-sports.io/football/venues/{venue_id}.png` |
| Photo joueur | `https://media.api-sports.io/football/players/{player_id}.png` |
| Photo coach | `https://media.api-sports.io/football/coachs/{coach_id}.png` |

## Fichiers sources

- `01-partie-1-raw.md`: endpoints catalogue, equipes, standings, rounds et fixtures.
- `02-partie-2-raw.md`: endpoints fixture details, injuries, predictions, coachs et players profiles.
- `03-partie-3-raw.md`: endpoints players stats/squads, transfers, trophies, sidelined et odds.

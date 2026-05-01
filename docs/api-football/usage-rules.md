# Regles d'utilisation API-Football pour BetAuto

Ces regles s'appliquent a toute modification de `betauto/analysis_context/api_football_client.py`, des normalizers, des builders et des scripts de coverage football.

## Source de verite

- Avant d'ajouter ou modifier un appel API-Football, verifier l'endpoint dans [endpoint-reference.md](endpoint-reference.md), puis dans le fichier `*-raw.md` correspondant si un detail manque.
- Ne pas extrapoler un parametre a partir d'un endpoint voisin: API-Football reutilise des noms similaires avec des contraintes differentes.
- Ne pas introduire de fallback de type `latest_*`, ID suppose, saison supposee ou endpoint alternatif silencieux. En cas d'ambiguite, remonter une erreur explicite.

## Authentification et base URL

- Base URL: `https://v3.football.api-sports.io`.
- Header obligatoire: `x-apisports-key`.
- Ne jamais logger la cle API.

## IDs et saisons

- Les IDs de ligues, equipes, fixtures et joueurs sont stables dans API-Football.
- Une saison est toujours une cle `YYYY` sur 4 chiffres. Pour une saison sportive `2018-2019`, l'API utilise `2018`.
- Les IDs de ligue doivent venir de l'endpoint `/leagues`, du registre `config/coverage/football_leagues.json`, ou d'une validation utilisateur explicite.

## Coverage et disponibilite

- Lire le champ `coverage` de `/leagues` avant de supposer que `events`, `lineups`, `statistics_fixtures`, `statistics_players`, `injuries`, `predictions` ou `odds` existent.
- `coverage = true` signifie "fonctionnalite couverte en principe", pas "donnee disponible pour chaque match".
- Les matchs amicaux et certaines competitions peuvent diverger du coverage annonce.
- Pour une competition non demarree, les coverage peuvent etre `false` puis changer apres le debut de la competition.

## Frequences et cache

- Respecter les frequences recommandees dans la reference. Les endpoints live peuvent se mettre a jour toutes les 5 a 15 secondes, mais les appels recommandes sont souvent moins frequents.
- Ne pas appeler les endpoints a forte frequence pour des matchs non live.
- Mettre en cache les endpoints de catalogue: timezones, countries, seasons, teams countries, bookmakers, bets.
- Les endpoints pagines doivent etre traites comme des collectes multi-pages, pas comme une page unique.

## Pagination

Endpoints pagines dans les extraits:

- `/players`: 20 resultats par page.
- `/players/profiles`: 250 resultats par page.
- `/odds`: 10 resultats par page.
- `/odds/mapping`: 100 resultats par page.

Le client doit exposer clairement si une methode retourne une page ou l'ensemble des pages.

## Fixtures et statuts

- Pour `/fixtures`, ajouter `timezone` si l'affichage ou l'analyse depend d'un fuseau.
- Statuts utiles:
  - Pre-match: `TBD`, `NS`, `PST`, `CANC`.
  - Live: `1H`, `HT`, `2H`, `ET`, `BT`, `P`, `SUSP`, `INT`, `LIVE`.
  - Termines: `FT`, `AET`, `PEN`.
  - Non joues: `ABD`, `AWD`, `WO`.
- Le statut `TBD` peut indiquer une date ou heure non definitive.
- Certaines competitions sans livescore peuvent rester `NS` jusqu'a une mise a jour tardive apres le match.

## Odds

- `/odds/live` ne conserve pas d'historique. Les fixtures apparaissent autour du coup d'envoi et disparaissent peu apres la fin.
- Les bets de `/odds/live/bets` ne sont pas compatibles avec `/odds`.
- Les bets de `/odds/bets` ne sont pas compatibles avec `/odds/live`.
- `/odds` pre-match est disponible environ entre 1 et 14 jours avant la fixture et garde un historique limite de 7 jours.

## Donnees joueurs et staff

- Pour l'effectif courant d'une equipe, preferer `/players/squads` a `/players`.
- `/players` retourne des statistiques calculees par equipe, ligue et saison; un joueur transfere peut apparaitre avec plusieurs equipes dans la meme saison.
- Les photos joueurs/coachs/equipes/ligues/stades sont servies via les URLs media indiquees dans la reference; ne pas deduire une URL non documentee.

## Checklist avant merge

- L'endpoint et ses parametres obligatoires ont ete verifies dans cette documentation.
- Les contraintes de saison, pagination et timezone sont gerees explicitement.
- Le code respecte les frequences d'appel via cache, planification ou rate limiting.
- Les erreurs API et les donnees absentes sont visibles dans les logs/metadonnees sans masquer le probleme.
- Aucun ID football n'a ete saisi manuellement sans note de validation.

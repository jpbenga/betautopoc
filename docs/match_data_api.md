# Match Data API - BetAuto Lot 2

Date: 2026-04-28

## Objectif

La capability Match Data expose au frontend les fixtures, odds et résumés de contexte issus des artefacts orchestrés stricts.

Elle ne lance pas de rebuild externe, ne crée pas de base de données et ne lit aucun fichier `latest_*`.

## Source des données

Les endpoints lisent uniquement:

```text
data/orchestrator_runs/<run_id>/analysis_context.json
```

Chaque contexte doit déclarer un `target_date` cohérent avec la requête.

## Endpoints

### GET `/api/match-data/context/latest?date=YYYY-MM-DD`

Retourne le contexte strict le plus récent pour la date demandée.

Si aucun contexte n'existe:

```json
{
  "status": "no_data",
  "message": "No match data found for target date 2026-01-15",
  "target_date": "2026-01-15",
  "data_source_mode": "run_artifacts",
  "date_consistency_status": "no_data"
}
```

### GET `/api/match-data/fixtures?date=YYYY-MM-DD&league_id=optional`

Retourne les fixtures normalisées depuis le contexte strict de la date.

`league_id` filtre la liste si fourni.

### GET `/api/match-data/odds?fixture_id=ID&date=optional`

Retourne les odds disponibles pour une fixture.

Si `date` est fournie, la recherche est limitée à cette date. Si `date` est absente, l'API recherche uniquement dans les artefacts stricts récents.

### GET `/api/match-data/providers/api-football/quota`

Retourne actuellement:

```json
{
  "provider": "api-football",
  "status": "unavailable",
  "message": "API-Football quota is not exposed by current strict run artifacts.",
  "source": "run_artifacts"
}
```

### POST `/api/match-data/context/rebuild`

Contrat réservé. Retourne `501` pour l'instant afin d'éviter tout rebuild partiel qui contournerait le mode strict.

## Frontend

Le service Angular dédié est:

```text
frontend/src/app/core/api/match-data-api.service.ts
```

Méthodes exposées:

- `getContext(date)`
- `getFixtures(date, leagueId?)`
- `getOdds(fixtureId, date?)`
- `getApiFootballQuota()`
- `rebuildContext(request)`

Les pages restent mockées dans le Lot 2.

# API Contracts - BetAuto Lot 0

Date: 2026-04-28

## Objectif

Le Lot 0 stabilise le contrat minimal entre le backend FastAPI et le frontend Angular sans modifier la logique métier, sans brancher les pages mockées et sans ajouter de persistance.

## Endpoints actuellement disponibles

| Méthode | Endpoint | Statut | Rôle |
|---|---|---|---|
| GET | `/health` | disponible | Healthcheck API |
| GET | `/api/capabilities` | disponible | Index des capabilities et endpoints réels |
| POST | `/api/run` | disponible | Démarre un job orchestrateur/legacy |
| GET | `/api/analysis/runs` | disponible | Liste simplifiée des runs/jobs |
| GET | `/api/analysis/runs/{run_id}` | disponible | Détail d'un run via façade analysis |
| GET | `/api/analysis/runs/{run_id}/timeline` | disponible | Timeline frontend-friendly d'un run |
| GET | `/api/analysis/logs` | disponible | Logs de run, filtrables par `run_id` |
| GET | `/api/match-data/context/latest` | partiel | Contexte match strict pour une date |
| GET | `/api/match-data/fixtures` | partiel | Fixtures issues d'un contexte strict |
| GET | `/api/match-data/odds` | partiel | Odds disponibles pour une fixture |
| GET | `/api/match-data/providers/api-football/quota` | partiel | Statut quota provider, quota réel non exposé |
| POST | `/api/match-data/context/rebuild` | planifié | Rebuild context, retourne 501 pour l'instant |
| GET | `/api/tickets` | partiel | Liste des tickets depuis les artefacts orchestrés |
| GET | `/api/tickets/{ticket_id}` | partiel | Détail ticket depuis `selection.json` |
| GET | `/api/tickets/{ticket_id}/audit-log` | partiel | Notes, erreurs et métadonnées de sélection |
| POST | `/api/tickets/generate` | partiel | Démarre un run orchestré pour générer un ticket |
| GET | `/api/job/{job_id}` | disponible | Retourne l’état complet d’un job |
| GET | `/api/job/{job_id}/file/{filename}` | disponible | Télécharge un fichier autorisé du job |
| POST | `/api/cache/clear` | disponible | Vide le cache généré legacy |

Fichiers job autorisés:

- `picks.json`
- `unibet_verification.json`
- `gpt_raw_output.txt`
- `browser_raw_output.txt`
- `prompt_used.txt`

## DTOs principaux

### ApiStatus

```json
{
  "status": "ok",
  "version": "v1"
}
```

### ApiError

```json
{
  "error": "Request failed",
  "detail": "Optional human-readable detail",
  "code": "OPTIONAL_CODE"
}
```

### RunRequest

```json
{
  "date": "2026-04-25",
  "force": false,
  "strategy_file": "config/strategies/default.json",
  "max_matches": 10,
  "sleep_between_matches": 0.5,
  "with_browser": false
}
```

Tous les champs sont optionnels. `date` garde le comportement existant: si absent, le backend résout la prochaine date cible.

### RunStartResponse

```json
{
  "job_id": "f6f68d92",
  "status": "running"
}
```

### JobStep

```json
{
  "label": "Analyse GPT",
  "status": "running",
  "message": "Lancement de l'orchestrateur V1.",
  "updated_at": "2026-04-28T13:40:00+02:00"
}
```

### JobLogEntry

```json
{
  "at": "2026-04-28T13:40:00+02:00",
  "message": "[analysis] orchestrator started",
  "level": "info"
}
```

`level` est optionnel pour rester compatible avec les logs existants.

### JobResponse

`GET /api/job/{job_id}` conserve les champs historiques:

- `job_id`
- `status`
- `error`
- `created_at`
- `completed_at`
- `target_date`
- `steps`
- `logs`
- `picks`
- `verification`
- `orchestrator_run_id`
- `orchestrator_run_dir`
- `run_summary`
- `selection_file`
- `selection`

### PickSummary

```json
{
  "pick_id": "pick_001",
  "event": "Fulham vs Aston Villa",
  "market": "Under 2.5",
  "pick": "Under 2.5",
  "confidence_score": 77,
  "risk_level": "medium"
}
```

### SelectionSummary

```json
{
  "picks": [],
  "estimated_combo_odds": 3.06,
  "global_confidence_score": 80,
  "combo_risk_level": "medium"
}
```

### RunSummary

```json
{
  "run_id": "run_81c06778",
  "run_dir": "runs/run_81c06778",
  "target_date": "2026-04-25",
  "status": "completed",
  "files": {}
}
```

## Capabilities

`GET /api/capabilities` retourne:

| Capability | Statut actuel |
|---|---|
| `analysis` | `available` |
| `match_data` | `partial` |
| `ticketing` | `partial` |
| `costs` | `planned` |
| `bankroll` | `planned` |
| `agents` | `planned` |
| `performance` | `planned` |
| `settings` | `planned` |

## Règles de compatibilité

- Les URLs publiques existantes ne doivent pas changer.
- Les champs existants ne doivent pas être supprimés.
- Les nouveaux champs doivent être optionnels ou rétrocompatibles.
- Les pages frontend restent mockées tant que les capabilities ne sont pas branchées explicitement.
- Le frontend doit consommer les endpoints via `BetautoApiService`, pas directement via `HttpClient` dans les pages.
- Les DTOs backend Pydantic et les interfaces TypeScript doivent évoluer ensemble.
- Les statuts backend doivent être normalisés côté UI via les mappers frontend avant affichage.

## CORS local development

Le backend FastAPI autorise les origines frontend locales suivantes par défaut:

- `http://localhost:4200`
- `http://127.0.0.1:4200`

La liste est configurable avec `BETAUTO_CORS_ORIGINS`, au format CSV:

```bash
BETAUTO_CORS_ORIGINS=http://localhost:4200,http://127.0.0.1:4200
```

Le middleware CORS accepte les credentials, toutes les méthodes et tous les headers afin que les preflights `OPTIONS` Angular passent en développement local.

## Lot 2 - Match Data Core

La capability `match_data` expose les données match déjà présentes dans les artefacts stricts de l'orchestrateur. Elle ne déclenche aucun appel externe et ne lit jamais les fichiers historiques `latest_*`.

Endpoints:

- `GET /api/match-data/context/latest?date=YYYY-MM-DD`
  - cherche un `analysis_context.json` sous `data/orchestrator_runs/<run_id>/` dont `target_date` correspond exactement à la date demandée.
  - retourne `status: no_data` si aucun artefact strict ne correspond.
- `GET /api/match-data/fixtures?date=YYYY-MM-DD&league_id=optional`
  - extrait les fixtures depuis le contexte strict de la date.
  - filtre par `league_id` si fourni.
- `GET /api/match-data/odds?fixture_id=ID&date=optional`
  - extrait les odds disponibles depuis un contexte strict.
  - si `date` est fournie, la recherche est limitée à cette date.
  - si `date` est absente, la recherche utilise uniquement les artefacts stricts récents, sans fallback `latest_*`.
- `GET /api/match-data/providers/api-football/quota`
  - retourne actuellement `status: unavailable` car le quota réel provider n'est pas encore exposé dans les artefacts stricts.
- `POST /api/match-data/context/rebuild`
  - retourne actuellement `501` avec `status: planned`.
  - le rebuild sera branché plus tard sans contourner le mode strict.

DTOs principaux:

- `MatchContextSummary`: résumé d'un contexte de date, run source, fichier source, fixtures.
- `FixtureSummary`: fixture normalisée, équipes, ligue, kickoff, nombre de marchés odds.
- `OddsSummary`: odds disponibles par fixture, bookmaker, marchés et valeurs.
- `ProviderQuotaSummary`: statut quota provider.
- `MatchDataNoDataResponse`: réponse explicite quand aucune donnée stricte n'existe pour la date.
- `RebuildContextRequest` / `RebuildContextResponse`: contrat de rebuild planifié.

Règles strictes:

- `target_date` reste obligatoire pour les lectures de contexte et fixtures.
- Les fichiers `latest_analysis_context.json`, `latest_match_analysis.json` et `latest_selection.json` restent interdits sauf legacy explicite.
- Une date sans artefact retourne `no_data`; elle ne recycle jamais un contexte d'une autre date.

## Ticketing Core

La capability `ticketing` expose les propositions de tickets déjà produites par l'orchestrateur. Elle lit uniquement les artefacts de run:

- `data/orchestrator_runs/<run_id>/run_summary.json`
- `data/orchestrator_runs/<run_id>/selection.json`

Endpoints:

- `GET /api/tickets`
  - liste les tickets disponibles, un ticket par run contenant un `selection.json` valide.
- `GET /api/tickets/{ticket_id}`
  - retourne le détail du ticket, les picks, les notes, les erreurs et la configuration de sélection.
- `GET /api/tickets/{ticket_id}/audit-log`
  - retourne les notes, erreurs et métadonnées sous forme de journal d'audit.
- `POST /api/tickets/generate`
  - démarre un run orchestré comme `POST /api/run`.
  - retourne `202` avec `job_id` et `target_date`.
  - le vrai `ticket_id` apparaît dans `GET /api/tickets` après complétion du run, car le `run_id` est créé par l'orchestrateur en arrière-plan.

Règles strictes:

- Aucun fichier `latest_*` n'est lu.
- `selection.json` doit appartenir au `run_dir` courant.
- `selection.input_file` doit aussi rester dans le même `run_dir`.
- Aucune persistance additionnelle n'est ajoutée; la source de vérité reste l'artefact orchestré.

## Frontend adapter

Le service Angular `BetautoApiService` expose uniquement les endpoints réels du Lot 0:

- `health()`
- `getCapabilities()`
- `runPipeline(request)`
- `getJob(jobId)`
- `getJobFile(jobId, filename)`
- `clearCache()`

Les anciens appels non supportés par le backend ne font plus partie de l’adapter:

- `getLatestSelection`
- `getLatestAnalysis`
- `getStrategy`
- `updateStrategy`

## Roadmap lots 1 à 8

1. **Lot 1 - Run Core / Analysis**
   - Listing runs, détail run, timeline, logs, scans schedule.
   - Brancher `/analysis` en premier avec loading/error/empty réels.

2. **Lot 2 - Match Data Core**
   - Fixtures, odds, context latest/rebuild, quota API-Football.
   - Alimente analysis, tickets, overview et costs.

3. **Lot 3 - Ticketing Core**
   - Proposals, picks, rejected candidates, validate/reject, audit log.
   - Dépend de analysis + match data + strategy rules.

4. **Lot 4 - Costs & Quotas**
   - Summary, trends, breakdown, run costs, alerts, logs.
   - Exploite les métadonnées run et providers.

5. **Lot 5 - Bankroll & Risk**
   - Summary, trend, exposure, positions, risk limits, alerts, logs.
   - Dépend des tickets/positions actives.

6. **Lot 6 - Agents Observability**
   - Agents registry, jobs, resources, logs, Browser Use sessions.
   - Sert Live Operations et Platform Agents.

7. **Lot 7 - Settings**
   - Lecture config, validation, intégrations, puis écriture contrôlée.
   - À stabiliser après les schémas risk/cost/agents.

8. **Lot 8 - Performance**
   - Accuracy, ROI, calibration, strategy benchmarks, drift, data quality.
   - Repose sur l’historique consolidé.

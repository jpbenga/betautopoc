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

| Capability | Statut Lot 0 |
|---|---|
| `analysis` | `available` |
| `match_data` | `planned` |
| `ticketing` | `planned` |
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

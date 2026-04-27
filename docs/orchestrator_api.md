# Orchestrator API mode

## Rôle

Le mode orchestré API branche `POST /api/run` sur l'orchestrateur V1 pour exécuter la chaîne:

1. Strategy
2. Analysis Context
3. Match Analysis
4. Selection

Le flux conserve le système de jobs existant (job_id, logs horodatés, statut, polling via `GET /api/job/{job_id}`).

## Endpoint `/api/run`

Exemple:

```bash
curl -X POST http://localhost:8000/api/run \
  -H "Content-Type: application/json" \
  -d '{"date":"2026-04-25"}'
```

Paramètres utiles:

- `date` (optionnel, format `YYYY-MM-DD`)
- `strategy_file` (optionnel)
- `max_matches` (optionnel)
- `sleep_between_matches` (optionnel)
- `with_browser` (optionnel, ignoré pour l'exécution navigateur)

## Variables techniques

- `ORCHESTRATOR_ENABLED=true` (par défaut si absent)
  - `true`: `/api/run` utilise l'orchestrateur V1
  - `false`: `/api/run` utilise le pipeline legacy
- `ORCHESTRATOR_WITH_BROWSER=false` (par défaut)
  - Si activé, l'API loggue: `Browser execution is not implemented in orchestrator API mode yet.`

La stratégie est résolue depuis:

- `strategy_file` de la requête si fourni, sinon
- `BETAUTO_STRATEGY_FILE`, sinon
- `config/strategies/default.json`

## Fichiers générés

Chaque run orchestré génère un dossier:

- `data/orchestrator_runs/<run_id>/`

Contenu principal:

- `run_summary.json`
- `resolved_strategy.json`
- `analysis_context.json`
- `match_analysis.json`
- `selection.json`

Le job API expose ensuite:

- `orchestrator_run_id`
- `orchestrator_run_dir`
- `run_summary`
- `selection_file`
- `selection` (contenu JSON chargé si disponible)

## Limitation actuelle

Browser Use n'est **pas** branché dans le mode orchestrateur API.
L'orchestrateur s'arrête volontairement à l'étape de sélection.

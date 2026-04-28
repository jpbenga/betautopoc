# Orchestrator API mode

## Rôle

Le mode orchestré API branche `POST /api/run` sur l'orchestrateur V1 pour exécuter la chaîne:

1. Strategy
2. Analysis Context
3. Match Analysis
4. Aggregation
5. Filtering
6. Selection

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
- `BETAUTO_STRICT_MODE=true` (par défaut)
  - interdit les artefacts `latest_*`
  - impose les artefacts du `run_dir` courant
- `BETAUTO_ALLOW_LEGACY=false` (par défaut)
  - doit être explicitement défini à `true` pour autoriser les anciens scripts qui lisent/écrivent `latest_*`
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
- `aggregation_candidates.json`
- `filtered_candidates.json`
- `selection.json`

Le job API expose ensuite:

- `orchestrator_run_id`
- `orchestrator_run_dir`
- `run_summary`
- `selection_file`
- `selection` (contenu JSON chargé si disponible)

## Cohérence de date et artefacts de run

En mode strict, la date transmise au run est la source de vérité. Le mode API et le script `scripts/run_orchestrated_pipeline.py` utilisent le même orchestrateur et doivent produire le même comportement.

Règles appliquées:

- `target_date` est conservée dans `run_summary`.
- `analysis_context.json` doit déclarer la même `target_date`.
- `match_analysis.json` déclare aussi `target_date`.
- `aggregation_candidates.json` transforme les `predicted_markets` de `match_analysis.json` en candidats normalisés.
- `filtered_candidates.json` applique les règles de stratégie (`min_confidence`, marchés autorisés, qualité de données, présence de cote).
- `selection.input_file` doit pointer vers le `filtered_candidates.json` du dossier `data/orchestrator_runs/<run_id>/`.
- Les fallbacks historiques `latest_analysis_context.json`, `latest_match_analysis.json` et `latest_selection.json` sont interdits sauf si `BETAUTO_ALLOW_LEGACY=true`.
- Les scripts legacy `build_analysis_context.py`, `run_match_analysis_batch.py` et `run_selection_engine.py` sont bloqués en mode strict.

Métadonnées exposées dans `run_summary`:

- `target_date`
- `effective_context_date`
- `match_analysis_target_date`
- `analysis_context_file`
- `match_analysis_file`
- `aggregation_candidates_file`
- `filtered_candidates_file`
- `selection_file`
- `selection_input_file`
- `data_source_mode`
- `date_consistency_status`

En mode orchestrateur API, `data_source_mode` doit être `run_artifacts`.
`date_consistency_status` vaut:

- `ok` si tous les artefacts correspondent à la date et au dossier du run.
- `no_data` si API-Football ne retourne aucun match pour la date cible.
- `mismatch` si une incohérence est détectée.

## Date sans données

Si aucun match n'est trouvé pour la date cible, le run ne recycle aucun ancien résultat.
Il se termine avec:

- `status: completed_no_data`
- `date_consistency_status: no_data`
- message: `No matches found for target date YYYY-MM-DD`

Les étapes `match_analysis`, `aggregation`, `filtering` et `selection` sont alors marquées comme ignorées, et `selection.picks` reste vide.

## Couche intermédiaire candidates

`aggregation_candidates.json` contient une liste de candidats normalisés au format:

```json
{
  "fixture_id": 123456,
  "event": "Team A vs Team B",
  "pick": "Home",
  "market": "Match Winner",
  "confidence_score": 74,
  "confidence_tier": "strong",
  "risk_level": "medium",
  "reasoning": "Forme récente favorable.",
  "data_quality": "high",
  "odds": 1.75,
  "odds_source": "analysis_context"
}
```

Champs additionnels utiles:

- `candidate_id`
- `market_canonical_id`
- `selection_canonical_id`
- `expected_odds_min`
- `expected_odds_max`
- `competition`
- `kickoff`
- `source_match_analysis_id`
- `source_status`
- `rejection_reasons`

`filtered_candidates.json` conserve le même format de candidat et ajoute:

- `filter_config`
- `rejected_candidates`
- `filter_reasons`
- `rejection_reasons`

Règles de scoring:

- `confidence_score` est la confiance effective: `min(predicted_market.confidence, analysis.global_confidence)`.
- `confidence_tier`: `elite` (>=90), `very_strong` (80-89), `strong` (70-79), `medium` (60-69), `weak` (50-59), `very_weak` (<50).
- `risk_level`: `high` si `data_quality` est `low`, sinon `low` pour score >=85, `medium` pour score >=70, `high` sinon.
- Si la stratégie exige des cotes, tout candidat sans `odds` est rejeté avec `missing_odds`.
- Les raisons de rejet standard sont `low_confidence`, `missing_odds`, `low_data_quality`, `disallowed_market`.

La sélection finale garde le format historique `selection.json`; seule son entrée change de `match_analysis.json` vers `filtered_candidates.json`.

## Scripts

Le script supporté en mode strict est:

```bash
python scripts/run_orchestrated_pipeline.py --date 2026-04-25
```

Les scripts historiques restent disponibles uniquement en mode legacy explicite:

```bash
BETAUTO_ALLOW_LEGACY=true python scripts/build_analysis_context.py --date 2026-04-25
BETAUTO_ALLOW_LEGACY=true python scripts/run_match_analysis_batch.py
BETAUTO_ALLOW_LEGACY=true python scripts/run_selection_engine.py
```

Quand le mode strict bloque un usage `latest_*`, le log contient:

- `STRICT MODE ENABLED`
- `FORBIDDEN latest_* usage blocked`

Quand le legacy est autorisé, le log contient:

- `LEGACY MODE ENABLED`

## Limitation actuelle

Browser Use n'est **pas** branché dans le mode orchestrateur API.
L'orchestrateur s'arrête volontairement à l'étape de sélection.

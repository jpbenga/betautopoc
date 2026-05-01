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
| GET | `/api/costs/summary` | partiel | Résumé des coûts estimés depuis `run_summary.json` |
| GET | `/api/costs/runs` | partiel | Coûts estimés par run orchestré |
| GET | `/api/costs/trend` | partiel | Série temporelle coût estimé |
| GET | `/api/costs/breakdown` | partiel | Répartition estimée par service |
| GET | `/api/costs/alerts` | partiel | Alertes simples sur seuils locaux |
| GET | `/api/coverage/football/leagues` | partiel | Registre football read-only des compétitions suivies |
| GET | `/api/bankroll/summary` | partiel | Résumé bankroll simulé depuis tickets |
| GET | `/api/bankroll/trend` | partiel | Courbe bankroll simulée |
| GET | `/api/bankroll/exposure` | partiel | Exposition par ticket |
| GET | `/api/bankroll/positions/open` | partiel | Positions ouvertes simulées |
| GET | `/api/bankroll/risk-limits` | partiel | Limites de risque simulées |
| GET | `/api/bankroll/alerts` | partiel | Alertes simples exposition/drawdown |
| GET | `/api/agents` | partiel | Agents logiques dérivés des runs/jobs |
| GET | `/api/agents/{agent_id}` | partiel | Détail agent et jobs liés |
| GET | `/api/agents/jobs` | partiel | Jobs agents récents et actifs |
| GET | `/api/agents/logs` | partiel | Logs techniques agents |
| GET | `/api/agents/resources` | partiel | Ressources simulées depuis l'activité jobs |
| GET | `/api/agents/browser-use/sessions` | partiel | Placeholder Browser Use désactivé |
| GET | `/api/settings` | partiel | Configuration runtime consolidée en lecture seule |
| GET | `/api/settings/integrations` | partiel | Etat des intégrations runtime |
| POST | `/api/settings/validate` | partiel | Validation sans application d'une payload settings |
| PUT | `/api/settings` | planifié | Ecriture désactivée, retourne 501 |
| GET | `/api/settings/logs` | partiel | Journal settings placeholder |
| GET | `/api/performance/summary` | partiel | Synthèse performance descriptive depuis artefacts |
| GET | `/api/performance/accuracy` | partiel | Accuracy proxy, outcomes réels indisponibles |
| GET | `/api/performance/roi` | partiel | ROI proxy, settlement réel indisponible |
| GET | `/api/performance/calibration` | partiel | Calibration proxy via filtrage candidats |
| GET | `/api/performance/strategies/compare` | partiel | Comparaison descriptive par stratégie |
| GET | `/api/performance/markets` | partiel | Métriques descriptives par marché |
| GET | `/api/performance/drift` | partiel | Drift proxy sur distributions |
| GET | `/api/performance/data-quality` | partiel | Qualité des artefacts/candidats |
| GET | `/api/performance/logs` | partiel | Logs analytiques synthétiques |
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
| `costs` | `partial` |
| `coverage` | `partial` |
| `bankroll` | `partial` |
| `agents` | `partial` |
| `performance` | `partial` |
| `settings` | `partial` |

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

Le pipeline strict produit désormais une couche intermédiaire avant sélection:

- `match_analysis.json`: résultats bruts des agents d'analyse match par match.
- `aggregation_candidates.json`: candidats normalisés, un candidat par `predicted_market`.
- `filtered_candidates.json`: candidats retenus après règles configurables.
- `selection.json`: ticket final, format historique conservé.

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
- `selection.input_file` doit pointer vers `filtered_candidates.json` du même `run_dir`.
- Chaque candidat porte `confidence_tier`, `risk_level` déterministe, `odds`, `odds_source` et `rejection_reasons`.
- `confidence_score` est la confiance effective: `min(predicted_market.confidence, analysis.global_confidence)`.
- Les règles de filtrage appliquées sont `min_confidence`, `allowed_markets`, `data_quality != low` via `min_data_quality`, et présence de cote si la stratégie l'exige.
- Les raisons de rejet standard sont `low_confidence`, `missing_odds`, `low_data_quality`, `disallowed_market`.
- Aucune persistance additionnelle n'est ajoutée; la source de vérité reste l'artefact orchestré.

## Costs & Quotas Core

La capability `costs` expose des estimations locales à partir des artefacts stricts:

- `data/orchestrator_runs/<run_id>/run_summary.json`

Elle ne fait aucun appel réel à OpenAI, API-Football ou Browser Use et ne lit aucun fichier `latest_*`.

Endpoints:

- `GET /api/costs/summary`
  - coût estimé du jour, coût estimé sur 7 jours, nombre de runs, coût moyen par run.
- `GET /api/costs/runs`
  - liste les runs avec durée, matches estimés, tokens estimés et coût estimé.
- `GET /api/costs/trend?window=7d`
  - série temporelle `date -> coût estimé`.
- `GET /api/costs/breakdown`
  - répartition estimée `openai`, `api_football`, `browser_use`.
- `GET /api/costs/alerts`
  - alertes simples sur seuils locaux.

Règles d'estimation:

- Les dates de coûts utilisent `finished_at` puis `started_at`, pas la `target_date` sportive.
- Les tokens sont une heuristique basée sur les étapes complétées et les picks dans `run_summary.selection`.
- Le nombre de matches analysés n'est pas encore exposé précisément dans `run_summary`; l'API retourne donc `matches_analyzed_estimate`.
- `browser_use` reste un placeholder tant que Browser Use n'est pas branché dans le mode orchestrateur API.
- Si aucun `run_summary.json` n'est disponible, les endpoints retournent `status: no_data`.

## Bankroll & Risk Core

La capability `bankroll` expose une simulation locale, sans pari réel, à partir des artefacts stricts:

- `data/orchestrator_runs/<run_id>/run_summary.json`
- `run_summary.selection.picks`

Endpoints:

- `GET /api/bankroll/summary`
  - bankroll initiale simulée, capital disponible, exposition, ROI et P&L neutres.
- `GET /api/bankroll/trend?window=7d`
  - courbe de bankroll simulée.
- `GET /api/bankroll/exposure`
  - exposition par ticket, avec `run_id` source.
- `GET /api/bankroll/positions/open`
  - positions ouvertes simulées, une par ticket avec picks.
- `GET /api/bankroll/risk-limits`
  - limites locales simples.
- `GET /api/bankroll/alerts`
  - alertes simples sur exposition et drawdown.

Règles de simulation:

- Bankroll initiale: `1000 EUR`.
- Stake fixe par ticket: `10 EUR`.
- Chaque ticket avec picks devient une position ouverte simulée.
- Gain potentiel: `estimated_combo_odds * stake`.
- Aucun résultat réel n'est inféré: `simulated_pnl = 0`, `estimated_roi = 0`.
- Aucun appel externe, aucune DB, aucun fichier `latest_*`.

## Football Coverage Registry

La capability `coverage` expose le registre des compétitions football que BetAuto pourra suivre progressivement.

Source:

- `config/coverage/football_leagues.json`

Endpoint:

- `GET /api/coverage/football/leagues`
  - retourne la liste normalisée des compétitions football configurées.
  - n'appelle pas API-Football.
  - ne déclenche aucun run.

Règles:

- API-Football reste la source de vérité pour les `league_id`.
- Les IDs restent `null` tant qu'ils n'ont pas été vérifiés avec `scripts/build_football_league_registry.py`.
- Le registre est read-only côté API dans cette phase.
- Les compétitions `enabled: false` ne sont pas encore intégrées au pipeline automatique.

## Agents Observability Core

La capability `agents` expose une vue d'observabilité simulée à partir des données strictement locales:

- jobs en mémoire (`JOBS`)
- steps et logs de jobs
- `data/orchestrator_runs/<run_id>/run_summary.json`

Endpoints:

- `GET /api/agents`
  - liste des agents logiques dérivés du pipeline.
- `GET /api/agents/{agent_id}`
  - détail d'un agent et jobs récents liés.
- `GET /api/agents/jobs`
  - jobs récents et actifs, dérivés des steps de jobs et run summaries.
- `GET /api/agents/logs`
  - logs techniques agrégés depuis les jobs et logs synthétiques depuis les run summaries.
- `GET /api/agents/resources`
  - métriques simulées `cpu_usage`, `memory_usage`, `jobs_running`, `active_sessions`.
- `GET /api/agents/browser-use/sessions`
  - placeholder propre `status: disabled`, car Browser Use n'est pas implémenté en mode orchestrateur API.

Agents logiques:

- `orchestrator`
- `analysis`
- `aggregation`
- `filtering`
- `selection`
- `browser_use`
- `ticketing`

Règles strictes:

- Aucun appel externe.
- Aucune DB, aucun cache global.
- Aucun fichier `latest_*`.
- Les métriques resources sont simulées et doivent être affichées comme telles côté frontend.
- Si aucune donnée run/job n'existe, les endpoints retournent `status: no_data` sauf Browser Use qui retourne `status: disabled`.

## Settings Core

La capability `settings` expose la configuration runtime en lecture structurée. Elle ne crée aucune persistance et ne modifie pas les fichiers de stratégie dans cette passe.

Sources:

- variables d'environnement (`ORCHESTRATOR_ENABLED`, `ORCHESTRATOR_WITH_BROWSER`, `BETAUTO_STRICT_MODE`, `BETAUTO_ALLOW_LEGACY`, `BETAUTO_STRATEGY_FILE`, `BETAUTO_CORS_ORIGINS`)
- `config/strategies/default.json` ou le fichier indiqué par `BETAUTO_STRATEGY_FILE`
- constantes de configuration backend existantes

Endpoints:

- `GET /api/settings`
  - retourne `strategy`, `runtime`, `selection`, `risk`, `integrations`, `notifications`, `metadata`.
- `GET /api/settings/integrations`
  - retourne l'état `openai`, `api_football`, `browser_use`, `strict_mode`, `legacy_mode`.
- `POST /api/settings/validate`
  - valide une payload sans l'appliquer.
  - retourne `errors`, `warnings`, `normalized`, `writable: false`.
- `PUT /api/settings`
  - retourne `501` tant qu'un contrat de persistance/rollback n'existe pas.
- `GET /api/settings/logs`
  - retourne un journal placeholder expliquant le mode read-only.

Règles strictes:

- Tous les champs exposés sont `read_only`.
- Aucune écriture réelle n'est effectuée.
- Aucun fallback `latest_*`.
- Les secrets ne sont pas exposés; seules les présences/absences de clés d'intégration sont indiquées.
- Le frontend doit afficher clairement que `Save Changes` est désactivé.

## Performance Core

La capability `performance` expose des métriques analytiques descriptives depuis les artefacts stricts:

- `data/orchestrator_runs/<run_id>/run_summary.json`
- `match_analysis.json`
- `aggregation_candidates.json`
- `filtered_candidates.json`
- `selection.json`

Endpoints:

- `GET /api/performance/summary`
  - total runs, tickets, candidats, candidats filtrés, confiance moyenne, distributions qualité/tier/risque.
- `GET /api/performance/accuracy`
  - retourne `status: partial`; aucune accuracy outcome-based n'est calculée sans résultats/settlement.
  - expose `proxy_acceptance_rate = accepted / candidates`.
- `GET /api/performance/roi`
  - retourne `status: partial`; ROI réel indisponible sans settlement.
  - expose uniquement exposition et potentiel estimés.
- `GET /api/performance/calibration`
  - calibration proxy par `confidence_tier`, basée sur filtered/rejected.
- `GET /api/performance/strategies/compare`
  - comparaison descriptive par `strategy_file`/`strategy_id`.
- `GET /api/performance/markets`
  - métriques descriptives par marché: counts, confidence, odds, filtered rate.
- `GET /api/performance/drift`
  - drift proxy sur distributions `confidence_tier`, `risk_level`, `data_quality`.
- `GET /api/performance/data-quality`
  - distribution qualité, % candidats avec odds, % rejets `missing_odds`, % runs `completed_no_data`.
- `GET /api/performance/logs`
  - logs synthétiques et caveats.

Règles strictes:

- Aucun fichier `latest_*`.
- Toutes les métriques sont rattachées à des artefacts de run stricts.
- Les métriques non fondées sur des outcomes réels sont marquées `partial`, `proxy` ou `estimated`.
- Aucune performance réelle de pari n'est inférée tant que la capability settlement/results n'existe pas.

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

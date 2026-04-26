# Strategy layer (`betauto/strategy`)

## Pourquoi cette couche existe

La stratégie est la **source de vérité métier** pour BetAuto. Elle centralise les règles de décision (ligues, marchés, seuils de confiance, type de ticket, risque) dans un JSON métier, versionnable et modifiable par une future interface.

Le fichier `.env` reste dédié aux paramètres techniques et secrets (clés API, timeouts, modèles, chemins).

## Flux cible

```text
Strategy JSON
→ Strategy Loader
→ Strategy Validator
→ Strategy Resolver
→ ResolvedStrategyConfig
→ moteurs (selection, puis analysis/execution)
```

## Modèles

- `StrategyDefinition` : représentation métier complète de la stratégie (scope, ticket policy, market policy, confidence, risk, analysis, **data_policy**, execution, bankroll).
- `ResolvedStrategyConfig` : configuration runtime aplatie, directement consommable par les moteurs.

Exemples de champs runtime :

- `league_ids_allowed`
- `combo_min_odds` / `combo_max_odds`
- `min_pick_confidence`
- `min_global_match_confidence`
- `allowed_markets` / `excluded_markets`
- `execution_platform`
- `season`
- `bookmaker_id` / `bookmaker_name`
- `data_provider`

## Chargement et résolution

Le loader suit l’ordre suivant :

1. `--strategy-file` (quand fourni par CLI)
2. `BETAUTO_STRATEGY_FILE`
3. `config/strategies/default.json`

Fonctions disponibles :

- `load_strategy(path: str | None = None)`
- `load_strategy_as_dict(path: str | None = None)`
- `validate_strategy(strategy)` (warnings)
- `raise_if_strategy_invalid(strategy)` (erreurs critiques)
- `resolve_strategy(strategy)`
- `load_and_resolve_strategy(path: str | None = None)`

## Priorité de configuration (Selection Engine)

Pour le Selection Engine, la priorité est :

1. **CLI overrides** (`--combo-min-odds`, `--combo-max-odds`, `--max-picks`, `--min-pick-confidence`, `--min-global-match-confidence`)
2. **Strategy** (`ResolvedStrategyConfig`)
3. **Legacy env/default fallback** (pour compatibilité)

> Les variables métier dans `.env` sont considérées comme héritées. Préférer les fichiers de stratégie.

## Priorité de configuration (Analysis Context)

Pour `scripts/build_analysis_context.py`, la priorité est :

1. **CLI overrides** (`--league-id`, `--season`, `--bookmaker-id`)
2. **Strategy** (`scope.leagues` + `data_policy`)
3. **Legacy env/default fallback**

`data_policy` remplace les valeurs métier API-Football historiquement portées dans `.env`.

Exemple :

```json
"data_policy": {
  "provider": "api_football",
  "season": 2025,
  "odds_source": {
    "bookmaker_id": 16,
    "bookmaker_name": "Unibet"
  },
  "refresh_policy": {
    "use_cache": true,
    "force_refresh": false
  }
}
```

## Exemple de stratégie

Le fichier par défaut est : `config/strategies/default.json`.

Il contient une stratégie football équilibrée, avec :

- ligues activées (Premier League, Ligue 1, La Liga)
- combinés autorisés avec cible de cotes
- marchés robustes en allowlist
- seuils de confiance à 65
- exécution `unibet` avec validation humaine

## Utilisation CLI

```bash
PYTHONPATH=. python scripts/run_selection_engine.py \
  --strategy-file config/strategies/default.json \
  --input-file data/analysis_results/latest_match_analysis.json \
  --output-dir data/selection_results
```

Override CLI (prioritaire sur stratégie) :

```bash
PYTHONPATH=. python scripts/run_selection_engine.py \
  --strategy-file config/strategies/default.json \
  --combo-min-odds 3.00 \
  --combo-max-odds 4.00 \
  --max-picks 4 \
  --input-file data/analysis_results/latest_match_analysis.json \
  --output-dir data/selection_results
```

## Projection UI

La future interface pourra éditer directement les champs de `StrategyDefinition` (JSON stocké en fichier, API ou base dédiée plus tard) puis déclencher le pipeline de résolution sans modifier le code des moteurs.

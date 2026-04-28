# Orchestrator CLI (V1)

## Rôle

L’orchestrateur CLI exécute la chaîne V1 complète, pilotée par la stratégie métier, sans dépendance UI ni API `/api/run`.

Flux V1 :

1. chargement/résolution de stratégie ;
2. construction du contexte d’analyse ;
3. analyse match par match ;
4. sélection combo ;
5. export consolidé d’un run unique.

## Flux complet

```text
Strategy
→ Analysis Context Builder
→ Analysis Engine (match par match)
→ Selection Engine
→ data/orchestrator_runs/<run_id>/
```

Chaque run écrit :

- `strategy.json`
- `analysis_context.json`
- `match_analysis.json`
- `selection.json` (si non skippé)
- `run_summary.json`

## Commandes

Commande standard :

```bash
PYTHONPATH=. python scripts/run_orchestrated_pipeline.py \
  --strategy-file config/strategies/default.json \
  --date 2026-04-25
```

Aide :

```bash
PYTHONPATH=. python scripts/run_orchestrated_pipeline.py --help
```

## Options

- `--strategy-file` : fichier stratégie.
- `--date` : date cible (`YYYY-MM-DD`).
- `--output-dir` : dossier racine des runs (défaut `data/orchestrator_runs`).
- `--max-matches` : limite le nombre de matchs transmis à l’Analysis Engine.
- `--sleep-between-matches` : délai (secondes) entre deux analyses.
- `--with-browser` : flag réservé (non implémenté V1).

Le mode strict interdit les réutilisations `latest_*`. Chaque run doit utiliser uniquement ses artefacts `data/orchestrator_runs/<run_id>/`.

## Pourquoi Browser Use n’est pas lancé par défaut

La V1 se concentre sur un pipeline déterministe et testable basé sur les briques existantes Strategy / Analysis / Selection.

Même si `--with-browser` est accepté, l’orchestrateur affiche explicitement :

> Browser execution is not implemented in orchestrator v1.

Aucun lancement Browser Use automatique n’est effectué.

## Étape suivante

Après validation CLI locale :

1. brancher l’orchestrateur sur `/api/run` ;
2. exposer l’exécution et le suivi depuis le front.

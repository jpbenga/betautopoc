# Selection Engine v1

## Rôle
Le **Selection Engine** consomme les analyses individuelles déjà générées par l'Analysis Engine. En mode strict, il est appelé par l'orchestrateur avec le `match_analysis.json` du `run_dir` courant et exporte `selection.json` dans ce même dossier.

## Pourquoi ce module est séparé
- Séparation claire des responsabilités :
  - **Analysis Engine** = analyser un match à la fois.
  - **Selection Engine** = sélectionner les meilleurs picks pour un combiné global.
- Permet d'itérer sur la logique de sélection sans toucher à l'analyse match par match.
- Facilite les tests CLI indépendants et le futur branchement Browser Use.

## Flux
1. Lecture du fichier d'analyses individuelles.
2. Construction d'un prompt de sélection avec contraintes métier.
3. Appel LLM unique pour proposer le combiné final.
4. Validation du JSON de sortie.
5. Export :
   - `selection_YYYYMMDD_HHMMSS.json`
   - `latest_selection.json` uniquement en mode legacy explicite

## Configuration (.env + CLI)
Priorité des valeurs : **CLI > .env > defaults**.

Variables supportées :
- `COMBO_MIN_ODDS` (défaut `2.80`)
- `COMBO_MAX_ODDS` (défaut `3.50`)
- `MAX_PICKS` (défaut `5`)
- `MIN_PICK_CONFIDENCE` (défaut `65`)
- `MIN_GLOBAL_MATCH_CONFIDENCE` (défaut `65`)
- `SELECTION_ENGINE_MODEL` (fallback `OPENAI_ANALYSIS_MODEL`)
- `SELECTION_OUTPUT_DIR` (défaut `data/selection_results`)

## Commandes d'exécution

En mode strict par défaut:

```bash
PYTHONPATH=. python scripts/run_orchestrated_pipeline.py --date 2026-04-26
```

Le script historique est réservé au mode legacy:

```bash
BETAUTO_ALLOW_LEGACY=true PYTHONPATH=. python scripts/run_selection_engine.py \
  --input-file data/analysis_results/latest_match_analysis.json \
  --combo-min-odds 2.80 \
  --combo-max-odds 3.50 \
  --max-picks 5 \
  --min-pick-confidence 65 \
  --min-global-match-confidence 65 \
  --output-dir data/selection_results
```

## Structure de sortie
Le JSON suit `SelectionResult` et inclut notamment :
- statut (`completed`, `partial`, `failed`)
- picks retenus
- estimation de cote combinée
- score de confiance global
- candidats rejetés
- notes et erreurs

## Mode strict

`latest_selection.json` est interdit par défaut. Toute tentative de lecture ou écriture est bloquée sauf si `BETAUTO_ALLOW_LEGACY=true`.

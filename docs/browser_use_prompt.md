# Prompt Browser Use Unibet

## Rôle du prompt Browser Use

Le prompt `prompts/browser_use_unibet_prompt.txt` pilote l'agent Browser Use chargé de vérifier les picks sur Unibet France, de lire les cotes et de préparer le betslip sans validation finale.

## Pourquoi il est externalisé

Le prompt est externalisé pour séparer clairement :
- la logique applicative Python (`main.py`) ;
- les règles métier de navigation Browser Use (fichier texte dédié).

Cela facilite la maintenance, la revue des règles, et les ajustements de formulation sans toucher au code du pipeline.

## Comment modifier le prompt sans toucher `main.py`

1. Éditer uniquement `prompts/browser_use_unibet_prompt.txt`.
2. Conserver la structure, les contraintes absolues et le format de sortie attendu.
3. Ne pas modifier la logique de chargement dans `build_unibet_task`.

`main.py` lit ce fichier à l'exécution et injecte dynamiquement le JSON des picks.

## Placeholder disponible

Le placeholder supporté est :

- `{{PICKS_JSON}}` : remplacé automatiquement par le JSON formaté des picks (`json.dumps(..., ensure_ascii=False, indent=2)`).

## Contrat de sortie

La sortie de l'agent doit rester strictement compatible avec le modèle `VerificationOutput` (schéma Pydantic), afin de ne pas casser le pipeline existant.

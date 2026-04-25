# Market Dictionary (Unibet as source of truth)

Le *Market Dictionary* harmonise les noms de marchés/sélections entre :
- API-Football,
- le moteur d'analyse IA,
- Browser Use,
- la future couche Betclic.

## Génération

Depuis la racine du projet :

```bash
python scripts/build_market_dictionary_from_json.py
```

Le script :
1. détecte automatiquement le fichier `api_football_exploration_*.json` le plus récent ;
2. charge `api_football_bookmakers.json` si présent ;
3. construit l'inventaire des marchés ;
4. mappe automatiquement les marchés canoniques connus ;
5. exporte les JSON dans `data/market_dictionary/`.

## Fichiers générés

- `data/market_dictionary/api_football_market_inventory.json`
- `data/market_dictionary/market_dictionary_unibet.json`
- `data/market_dictionary/unmapped_markets.json`

## Ajouter un mapping manuel

1. Ouvrir `betauto/market_dictionary/normalizer.py`.
2. Ajouter l'entrée dans `CANONICAL_MARKET_MAP`.
3. Si nécessaire, classer le marché dans `CATEGORY_BY_MARKET_ID`.
4. Ajuster les règles de sélection dans `betauto/market_dictionary/builder.py`.
5. Rejouer le script de build.

## Betclic (étape future)

Betclic n'étant pas exposé dans API-Football, la couche Betclic sera alimentée plus tard via Browser Use / interface web. Le dictionnaire actuel prépare les identifiants canoniques et alias nécessaires pour ce futur mapping.

## Utilisation dans le pipeline principal

### 1) Master prompt (génération IA)

Le prompt `prompts/master_prompt.txt` demande maintenant explicitement ces champs pour chaque pick :
- `market_canonical_id`
- `selection_canonical_id`

Les champs texte existants (`market`, `pick`) restent inchangés pour lisibilité humaine.

### 2) Enrichissement backend (resolver)

Le module `betauto/market_dictionary/resolver.py` charge `data/market_dictionary/market_dictionary_unibet.json` et enrichit chaque pick avec :
- `market_aliases`
- `selection_aliases`
- `dictionary_match_status`
- `dictionary_notes`

Fonction exposée : `resolve_pick_market_aliases(pick: dict) -> dict`.

### 3) Browser Use

Le prompt Browser Use (construit dans `main.py`) utilise en priorité :
- `market_canonical_id` / `selection_canonical_id`
- `market_aliases` / `selection_aliases`

Puis seulement en fallback :
- `market`
- `pick`

### Exemple avant/après enrichissement

Avant :

```json
{
  "pick_id": "pick_001",
  "market": "Double chance",
  "pick": "N2",
  "market_canonical_id": "double_chance",
  "selection_canonical_id": "draw_or_away"
}
```

Après :

```json
{
  "pick_id": "pick_001",
  "market": "Double chance",
  "pick": "N2",
  "market_canonical_id": "double_chance",
  "selection_canonical_id": "draw_or_away",
  "market_aliases": ["Double Chance", "Double chance", "1X", "X2", "12"],
  "selection_aliases": ["X2", "N2", "N / 2", "Draw or Away"],
  "dictionary_match_status": "matched",
  "dictionary_notes": []
}
```

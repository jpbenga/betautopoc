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

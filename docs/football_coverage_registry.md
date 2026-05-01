# Football Coverage Registry

## But

Le registre `config/coverage/football_leagues.json` définit les compétitions football que BetAuto pourra suivre progressivement.

Il ne branche pas encore le pipeline de run automatique. Son rôle est de préparer une liste activable, vérifiable et traçable de compétitions, avec API-Football comme source de vérité pour les `league_id`.

Les IDs peuvent être alimentés de deux façons:

- par vérification directe via l'API API-Football;
- par une liste d'IDs API-Football confirmés manuellement par l'utilisateur.

Dans les deux cas, le registre JSON reste la source de vérité lue par le backend.

## Structure

Chaque entrée contient:

- `sport`: toujours `football` pour cette phase.
- `country`: pays API-Football attendu, ou `World` pour les compétitions UEFA/internationales.
- `competition_name`: nom fonctionnel de la compétition.
- `competition_type`: `league`, `cup` ou `international`.
- `league_id`: identifiant API-Football, `null` tant qu'il n'a pas été vérifié.
- `season_mode`: `domestic_season`, `calendar_year`, `continental_season` ou `single_event`.
- `tier`: niveau sportif relatif.
- `priority`: priorité métier de couverture.
- `enabled`: activation côté BetAuto. Garder `false` tant que l'ID n'est pas vérifié.
- `agent_profile`: profil d'agent cible à utiliser plus tard.
- `strategy_profile`: stratégie cible à utiliser plus tard.
- `notes`: état de vérification ou point d'attention. La note `verified_manual_user_confirmed_id` indique un ID fourni dans une liste confirmée manuellement par l'utilisateur.

## Types de compétition

- `league`: championnat régulier national, par exemple Ligue 1 ou Premier League.
- `cup`: coupe nationale, par exemple Coupe de France ou FA Cup.
- `international`: compétition continentale/internationale, par exemple Champions League.

Dans API-Football, ces compétitions sont toutes exposées via l'endpoint `/leagues`; le champ `competition_type` sert à BetAuto pour piloter l'activation, les agents et les stratégies.

## Rafraîchir les IDs API-Football

Le script dédié est:

```bash
python scripts/build_football_league_registry.py --print
```

Le script charge automatiquement le fichier `.env` à la racine si la variable n'est pas déjà présente dans l'environnement.

Sans clé API, le script produit le registre cible avec `league_id: null` et retourne un code indiquant que la vérification n'a pas pu être faite.

Avec une clé API:

```bash
API_FOOTBALL_KEY=... python scripts/build_football_league_registry.py --write
```

Options utiles:

```bash
python scripts/build_football_league_registry.py --country France --print
python scripts/build_football_league_registry.py --name "Ligue 1" --print
python scripts/build_football_league_registry.py --output /tmp/football_leagues.json --write
```

Le script n'écrit un `league_id` que lorsqu'API-Football retourne une correspondance non ambiguë. Les ambiguïtés sont affichées sur stderr avec les candidats trouvés.

## Alimenter depuis une liste confirmée manuellement

Pour un lot large validé hors script, le registre peut aussi être mis à jour depuis une liste d'IDs API-Football confirmés par l'utilisateur.

Règles:

1. Ne pas réinterroger API-Football pendant cette opération.
2. Corriger les entrées existantes avec les IDs confirmés.
3. Ajouter les compétitions manquantes avec les mêmes champs que les entrées existantes.
4. Mettre `notes` à `verified_manual_user_confirmed_id` pour les entrées issues de cette validation.
5. Garder les entrées hors liste si elles restent utiles au catalogue, mais ne pas les activer sans validation explicite.

## Activer ou désactiver une compétition

Pour activer une compétition:

1. Vérifier que `league_id` est non nul et provient du script ou d'une liste d'IDs confirmés manuellement.
2. Vérifier que le nom, le pays et le type correspondent à l'usage attendu.
3. Passer `enabled` à `true`.
4. Garder une note de validation dans `notes`.

Ne pas activer une compétition avec un `league_id` non vérifié.

## Route read-only

Le backend expose le registre courant via:

```bash
curl http://localhost:8000/api/coverage/football/leagues
```

Cette route lit uniquement `config/coverage/football_leagues.json`. Elle ne contacte pas API-Football et ne déclenche aucun run.

## Bonnes pratiques avant run réel

- Ne jamais saisir manuellement un ID "supposé".
- Vérifier les compétitions ambiguës une par une.
- Garder `enabled: false` pour les coupes tant que la logique de calendrier n'est pas validée.
- Commencer par une petite couverture prioritaire, puis élargir.
- Conserver `BETAUTO_STRICT_MODE=true`; ce registre ne doit pas réintroduire de fallback `latest_*`.

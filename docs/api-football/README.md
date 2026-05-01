# Documentation API-Football

Ce dossier contient la documentation officielle API-Football fournie pour BetAuto. Les fichiers `*-raw.md` conservent les extraits bruts tels qu'ils ont ete transmis; ils servent de source de verite locale lorsque l'on modifie le client API-Football, le normalizer ou le pipeline d'analyse football.

## A lire avant de coder

1. Consulter d'abord [usage-rules.md](usage-rules.md) pour les regles anti-erreurs: parametres obligatoires, pagination, frequence d'appel, coverage et absence de fallback.
2. Utiliser [endpoint-reference.md](endpoint-reference.md) comme index rapide des endpoints, chemins, filtres et frequences.
3. Revenir aux fichiers bruts pour verifier un detail exact de l'API avant d'implementer ou de corriger un mapping.

## Fichiers

- [endpoint-reference.md](endpoint-reference.md): reference structuree des endpoints presents dans les extraits officiels.
- [usage-rules.md](usage-rules.md): regles de developpement BetAuto pour eviter les erreurs recurrentes avec API-Football.
- [01-partie-1-raw.md](01-partie-1-raw.md): timezones, pays, ligues, saisons, equipes, stades, standings, rounds, fixtures.
- [02-partie-2-raw.md](02-partie-2-raw.md): head-to-head, details fixture, injuries, predictions, coachs, players seasons/profiles.
- [03-partie-3-raw.md](03-partie-3-raw.md): statistiques joueurs, squads, transfers, trophies, sidelined, odds live et pre-match.

## Points critiques

- Les IDs `league`, `team`, `fixture`, `player`, `coach`, `bookmaker` et `bet` sont des IDs API-Football; ne pas les inventer.
- Une valeur `coverage.* = true` indique une disponibilite possible, pas une garantie pour 100% des matchs.
- Beaucoup d'endpoints ont des frequences d'appel recommandees: le code doit respecter le cache/rate limiting au lieu de repoller agressivement.
- Les endpoints pagines doivent etre parcourus avec `page` tant que l'API annonce des pages restantes.
- Les donnees live et odds live sont temporaires; ne pas supposer qu'un historique existe.

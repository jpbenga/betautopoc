# Architecture backend BetAuto (cible v1)

## Objectif

Structurer le backend en couches explicites sans modifier le comportement fonctionnel actuel des endpoints publics (`/api/run`, `/api/job/{job_id}`, etc.).

## Nouvelle structure

```text
backend/
  app/
    main.py
    api/
      routes/
        health.py
        runs.py
        jobs.py
        strategy.py
      schemas/
        run_schemas.py
        job_schemas.py
    core/
      config.py
      paths.py
      logging.py
      security.py
    domain/
      strategy/
      analysis/
      selection/
      orchestration/
      execution/
      bankroll/
      learning/
      users/
    infrastructure/
      openai/
      api_football/
      browser_use/
      storage/
    services/
      job_service.py
      run_service.py
    repositories/
    workers/
```

## Rôle de chaque couche

- **API (`backend/app/api`)**
  - Expose le contrat HTTP FastAPI.
  - Ne contient pas de logique métier lourde.
  - Délègue vers `services`.

- **Services applicatifs (`backend/app/services`)**
  - Orchestration applicative des cas d’usage API.
  - Gestion des jobs en mémoire (`job_service.py`).
  - Lancement du pipeline/orchestrateur (`run_service.py`).

- **Domain (`backend/app/domain`)**
  - Espace métier cible par sous-domaines : analysis, selection, orchestration, execution, bankroll, learning, users.
  - Les modules historiques `betauto/*` restent la source active actuelle de la logique métier.

- **Infrastructure (`backend/app/infrastructure`)**
  - Adaptateurs externes (OpenAI, API-Football, Browser Use, stockage futur).
  - Prépare la séparation des dépendances tierces.

- **Core (`backend/app/core`)**
  - Configuration applicative globale, chemins, sécurité et logging transverses.

- **Repositories (`backend/app/repositories`)**
  - Réservé à la persistance future (fichiers/DB).

- **Workers (`backend/app/workers`)**
  - Réservé à l’exécution asynchrone/background future (queue, cron, etc.).

## Pourquoi `main.py` doit rester léger

`main.py` racine est désormais un **wrapper de compatibilité** :

```python
from backend.app.main import app
```

Avantages :
- démarrage explicite via `backend.app.main:app` ;
- compatibilité temporaire avec `main:app` ;
- évite de concentrer API + orchestration + utilitaires dans un seul fichier.

## Compatibilité conservée

- Endpoints publics existants conservés :
  - `POST /api/run`
  - `GET /api/job/{job_id}`
  - `GET /api/job/{job_id}/file/{filename}`
  - `POST /api/cache/clear`
- Frontend inchangé (`frontend/` non touché).
- Modules `betauto/*` inchangés et toujours utilisés.
- Scripts CLI existants non modifiés.

## Roadmap recommandée

1. **Users/Auth**
   - Ajouter `domain/users` + `api/routes/auth.py`.
   - Introduire JWT/session + rôles.

2. **Database / Repositories**
   - Ajouter une couche persistence (PostgreSQL) et migrer les jobs en mémoire.
   - Créer repositories dédiés (`jobs`, `runs`, `strategies`).

3. **Bankroll management**
   - Isoler le money management dans `domain/bankroll`.

4. **Learning agent**
   - Ajouter feedback loop post-runs dans `domain/learning`.

5. **Execution platforms**
   - Migrer Browser Use / bookmakers dans `domain/execution` + `infrastructure/browser_use`.

6. **Stitch MCP / frontend**
   - Intégration ultérieure, sans coupler au cœur métier backend.

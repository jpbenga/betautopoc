# Audit Stitch MCP → Angular/Tailwind (BetAuto)

_Date de l'audit : 2026-04-27 (UTC)_

## A. Statut MCP

### Vérifications exécutées
- `list_mcp_resources` → aucun serveur exposant de ressources (`resources: []`).
- `list_mcp_resource_templates` → aucun template MCP disponible (`resourceTemplates: []`).
- Vérification des variables d'environnement liées à Stitch/Google/MCP/OAuth/token/API key → aucune variable détectée.

### Conclusion d'accès
- **Serveur MCP `stitch` non disponible dans cet environnement agent** (serveur absent/non configuré côté session).
- **Authentification non vérifiable** : absence d'indices d'API key/OAuth/token dans l'environnement courant.
- **Tools read-only Stitch non détectés** (`list_projects`, `get_project`, `list_screens`, `get_screen`, `list_design_systems` indisponibles ici).

> Conformément à la consigne, l'audit Stitch est donc **partiel** et limité à l'état d'intégration actuel du frontend Angular (sans extraction depuis Stitch).

---

## B. Projet Stitch

Aucun projet Stitch n'a pu être listé car le serveur `stitch` n'est pas accessible.

| Champ | Valeur |
|---|---|
| projectId | N/A (MCP inaccessible) |
| project name/title | N/A |
| owned/shared | N/A |
| ambiguïtés | Impossible à évaluer sans `list_projects` |

---

## C. Écrans détectés

Impossible de lister les écrans Stitch (`list_screens` indisponible).

| screen title | screen id | resource name | device type | screen type | width/height | group |
|---|---|---|---|---|---|---|
| N/A | N/A | N/A | N/A | N/A | N/A | N/A |

---

## D. Design tokens observés

### Depuis Stitch MCP
Non disponible (pas d'accès à `get_screen` / `list_design_systems`).

### Depuis le frontend Angular/Tailwind existant (proxy temporaire)
- Palette tokenisée utilisée dans les classes utilitaires : `background`, `text`, `surface`, `border`, `accent`, `muted`, `success`, `warning`, `danger`.
- Rayons observés via utilitaires : `rounded-md`, `rounded-lg`, `rounded-full`.
- Typographie observée : hiérarchie standard (`text-xs/sm/2xl`, `font-medium/semibold`).
- Mode sombre/clair : non explicitement documenté ici (dépend de la config Tailwind globale, non auditée en profondeur dans cette tâche).
- Spacing : grille utilitaire (`p-4`, `p-6`, `gap-*`, `mb-*`, etc.).

### designMd
- Non disponible (absence de payload Stitch).

---

## E. Composants réutilisables identifiés

### Déjà présents
- **AppShell** (`ShellComponent`) : structure globale écran desktop/mobile.
- **Sidebar** (`SidebarComponent`).
- **MobileNav** (`MobileNavComponent`).
- **Topbar** (`TopbarComponent`).
- **KpiCard** (`KpiCardComponent`).
- **StatusBadge** (`StatusBadgeComponent`).
- **SectionCard** (`SectionCardComponent`).
- **EmptyState** (`EmptyStateComponent`).
- **LoadingState** (`LoadingStateComponent`).
- **ErrorState** (`ErrorStateComponent`).
- **PageHeader** (`PageHeaderComponent`) (utilitaire complémentaire).

### À créer (probable, à confirmer après accès Stitch)
- Timeline
- LogConsole
- TicketCard
- PickCard
- StrategyConfigCard
- QuotaGauge
- ChartCard
- DataTable / CardList avancés
- AlertCard

---

## F. Mapping Stitch → Angular (pré-audit, en attente des écrans Stitch)

> Mapping préparatoire basé sur les modules déjà scaffoldés dans `frontend/src/app/features`.

| Écran Stitch cible | Feature Angular cible | Shared/UI requis (minimum) | Layout requis | Complexité estimée | Ordre recommandé |
|---|---|---|---|---|---|
| Overview / Cockpit | `features/overview` | KpiCard, SectionCard, StatusBadge, ChartCard* | Shell + Topbar + Sidebar + MobileNav | M | 1 |
| Live Operations | `features/live-operations` | SectionCard, DataTable/CardList*, StatusBadge, AlertCard* | Shell | M/H | 2 |
| Analysis Queue | `features/analysis` | DataTable/CardList*, StatusBadge, Empty/Loading/Error | Shell | M | 3 |
| Match Analysis Detail | `features/analysis` (detail route à créer) | SectionCard, PickCard*, Timeline* | Shell | H | 4 |
| Tickets | `features/tickets` | TicketCard*, StatusBadge, DataTable/CardList* | Shell | M | 5 |
| Ticket Detail | `features/tickets` (detail route à créer) | SectionCard, Timeline*, PickCard* | Shell | M/H | 6 |
| Strategy Settings | `features/strategy` | StrategyConfigCard*, StatusBadge, forms partagés* | Shell | H | 7 |
| API & Costs | `features/api-costs` | KpiCard, ChartCard*, DataTable* | Shell | M | 8 |
| Bankroll | `features/bankroll` | KpiCard, ChartCard*, SectionCard | Shell | M | 9 |
| Performance | `features/performance` | KpiCard, ChartCard*, DataTable* | Shell | M | 10 |
| Market Dictionary | `features/market-dictionary` | DataTable/CardList*, Search/Filter bar* | Shell | M | 11 |
| Platform Agents | `features/platform-agents` | StatusBadge, SectionCard, AgentCard* | Shell | M | 12 |
| Logs / Audit | `features/logs-audit` | LogConsole*, Timeline*, DataTable* | Shell | M/H | 13 |
| Alerts / Notifications | feature dédié à créer (ou extension logs) | AlertCard*, StatusBadge, filters* | Shell | M | 14 |

`*` = composant absent actuellement, à confirmer/affiner avec Stitch.

---

## G. Écarts avec le frontend actuel

## 1) `frontend/src/app/shared/ui`
- **À conserver** : `KpiCard`, `StatusBadge`, `SectionCard`, `EmptyState`, `LoadingState`, `ErrorState`, `PageHeader`.
- **À créer** : `ChartCard`, `DataTable`, `Timeline`, `LogConsole`, `TicketCard`, `PickCard`, `StrategyConfigCard`, `QuotaGauge`, `AlertCard`, filtres réutilisables.
- **À refactorer/renommer potentiellement** :
  - `SectionCard` pourrait devenir base commune de plusieurs cartes spécialisées.
  - `StatusBadge` pourrait intégrer un mapping sémantique plus riche (sync avec statuts Stitch).

## 2) `frontend/src/app/layout`
- **À conserver** : shell responsive déjà propre (sidebar desktop + nav mobile + topbar).
- **À enrichir** : topbar (actions, contexte page, alertes), navigation groupée si Stitch impose des sections.

## 3) `frontend/src/app/features`
- Toutes les pages sont **placeholders** avec structure homogène.
- Risque principal : implémentation écran par écran sans extraction de composants communs → duplication.

---

## H. Roadmap UI recommandée

1. **Design tokens Tailwind** (aligner couleurs/typo/radius/spacing sur Stitch une fois accessible).
2. **Layout shell** (ajustements structurels finaux si nécessaires).
3. **Shared UI components** (lot de base + composants data-rich).
4. **Overview**.
5. **Live Operations**.
6. **Strategy Settings**.
7. **Tickets**.
8. **API & Costs**.
9. **Logs / Audit**.
10. **Autres écrans** (Bankroll, Performance, Market Dictionary, Platform Agents, Alerts).

---

## I. Risques / limites

- Les écrans Stitch fournissent souvent du HTML complet, pas un découpage composant prêt Angular.
- Conversion Angular/Tailwind à réaliser manuellement (ou assistée agent) pour éviter le copier-coller brut.
- Risque de duplication si les primitives shared/ui ne sont pas stabilisées tôt.
- Risque responsive mobile/desktop si les patterns ne sont pas harmonisés globalement.
- Attention aux assets/images : ne pas versionner des exports binaires non nécessaires.
- Attention aux secrets d'accès MCP (API keys/tokens) hors repo.
- **Limite bloquante actuelle** : serveur MCP `stitch` absent/non configuré dans la session.

---

## Annexe — état des modules Angular existants (référence de mapping)

- Layout en place : `Shell`, `Sidebar`, `Topbar`, `MobileNav`.
- Shared UI en place : `PageHeader`, `SectionCard`, `KpiCard`, `StatusBadge`, `EmptyState`, `LoadingState`, `ErrorState`.
- Features scaffoldées : `overview`, `live-operations`, `analysis`, `tickets`, `strategy`, `bankroll`, `performance`, `api-costs`, `market-dictionary`, `platform-agents`, `logs-audit`.


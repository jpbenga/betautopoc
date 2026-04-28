# Audit MCP Stitch - BetAuto Operations Dashboard

_Date de l'audit : 2026-04-28_

## A. Statut MCP (maintenant connecté)

Le serveur MCP Stitch est connecté et exploitable dans cette session.

Commandes MCP executees :

- `list_projects` : projet `projects/9571412506981100719` confirme dans la liste des projets Stitch.
- `list_screens` avec `projectId=9571412506981100719` : 9 ecrans applicatifs retournes.
- `get_screen` : appele pour chacun des 9 ecrans retournes par `list_screens`.

Limite observee : `htmlCode` et `screenshot` sont disponibles sous forme de ressources Stitch (`projects/.../files/...`) avec URL de telechargement, mais le contenu HTML inline n'est pas renvoye par `get_screen`. L'audit ci-dessous n'invente donc pas de HTML et ne commit aucune image.

## B. Projet Stitch (reel)

| Champ | Valeur |
|---|---|
| Titre | BetAuto Operations Dashboard |
| Resource | `projects/9571412506981100719` |
| Type | `TEXT_TO_UI_PRO` |
| Origine | `STITCH` |
| Visibilite | `PRIVATE` |
| Role utilisateur | `OWNER` |
| Device principal | `DESKTOP` |
| Creation | `2026-04-25T19:13:13.233541Z` |
| Derniere mise a jour | `2026-04-27T10:57:49.762781Z` |
| Theme | BetAuto Analytical Interface |

## C. Liste complete des ecrans

| # | Title | Resource | Device | Dimensions | htmlCode | Screenshot |
|---|---|---|---|---|---|---|
| 1 | Overview - BetAuto Cockpit | `projects/9571412506981100719/screens/5d37c29d1b484de2a2c3eda3acb0f364` | DESKTOP | 2560 x 2048 | `projects/9571412506981100719/files/9624df6e4b794a369da9a6f332da99c9` | `projects/9571412506981100719/files/a63272e195cb440699e9625f4bc78ebb` |
| 2 | Betting Tickets - AI Proposals | `projects/9571412506981100719/screens/41ee9d7737bc49b796d683236d12c553` | DESKTOP | 3040 x 2048 | `projects/9571412506981100719/files/d0e1584efd284cec91126b5886a58741` | `projects/9571412506981100719/files/cee8ae20703f4fe685af810828ed076c` |
| 3 | API & Cost Control - Usage & Quotas | `projects/9571412506981100719/screens/77db906e3dd24832ac8762f2178e627b` | DESKTOP | 2560 x 2058 | `projects/9571412506981100719/files/4403f2e716e74cb18492c7d740509273` | `projects/9571412506981100719/files/d860c3ebf58542c3a0c472660d6394f1` |
| 4 | Live Operations - Active Agents | `projects/9571412506981100719/screens/3dbdd1b90d5a47c997b75ba9288de6bb` | DESKTOP | 3040 x 2048 | `projects/9571412506981100719/files/afe6838d21ea485dafb9654fa9838ce1` | `projects/9571412506981100719/files/2f1b62c382b04ff09a4958fff5c8756f` |
| 5 | Bankroll & Risk Management | `projects/9571412506981100719/screens/4bff7d2e46454b6f90f850d19328fe8a` | DESKTOP | 2560 x 2406 | `projects/9571412506981100719/files/020f0612bb914503bf83d3a2400b358e` | `projects/9571412506981100719/files/a625cafac3ea48179517894479890b48` |
| 6 | Advanced Performance - AI Calibration & Analytics | `projects/9571412506981100719/screens/e017d53fe5164f47b8c1867a4e4add7c` | DESKTOP | 2560 x 2866 | `projects/9571412506981100719/files/26fb46dc19314d8ab33b852a3e903ec8` | `projects/9571412506981100719/files/c1d0df8d5da5404c99f10de245328afb` |
| 7 | Analysis Queue - Scheduled Scans | `projects/9571412506981100719/screens/0e2d597f57c944bca48401b6ba021a3e` | DESKTOP | 2560 x 2048 | `projects/9571412506981100719/files/80686ef17576481e934390d1d334e18b` | `projects/9571412506981100719/files/2bcd2a3a64fb4b74bd318a5a16c06330` |
| 8 | Platform Agents - Browser-Use Monitoring | `projects/9571412506981100719/screens/b9f856fca954499d9e509ab42edffde4` | DESKTOP | 2560 x 2048 | `projects/9571412506981100719/files/6e362bac68f242bd8cef2491dabe5fe0` | `projects/9571412506981100719/files/4c16ec6ebb2844f4912cd23ae9cd53ff` |
| 9 | Global Settings - System Configuration | `projects/9571412506981100719/screens/718d4cb10fec49aa9efee28c97b0b481` | DESKTOP | 2560 x 2048 | `projects/9571412506981100719/files/8353c82220724cd78f17fa66a171b325` | `projects/9571412506981100719/files/221a6e2f41334ff2a4cb66ec67d6aa9b` |

## D. Analyse detaillee de chaque ecran

Cette analyse se base sur les metadonnees MCP reelles, les titres d'ecrans, les dimensions, la presence de ressources HTML/screenshot et le design system du projet. Elle ne pretend pas decrire du contenu HTML non lu inline.

### 1. Overview - BetAuto Cockpit

- Role UI : cockpit principal desktop.
- Sections attendues d'apres le titre et le theme : shell global, header de page, KPI de synthese, cartes d'etat, zones de monitoring et visualisations.
- Composants reutilisables : `PageHeader`, `KpiCard`, `SectionCard`, `StatusBadge`, carte de chart a creer, table/list de signaux a creer.
- Patterns : dashboard dense, grille fluide 12 colonnes, cartes avec bordure 1px, hierarchie par surfaces sombres, cyan comme couleur d'action/signal.
- Mapping Angular : `frontend/src/app/features/overview/overview.page.ts`.

### 2. Betting Tickets - AI Proposals

- Role UI : suivi des tickets et propositions IA.
- Sections attendues d'apres le titre : liste/table de propositions, cartes de ticket, statuts d'approbation, scores ou deltas, actions sur proposition.
- Composants reutilisables : `StatusBadge`, `SectionCard`, `TicketCard` a creer, `DataTable` a creer, boutons primaire/secondaire a normaliser.
- Patterns : ecran large 3040px, probablement plus dense que les vues 2560px, adapte aux comparaisons horizontales.
- Mapping Angular : `frontend/src/app/features/tickets/tickets.page.ts`.

### 3. API & Cost Control - Usage & Quotas

- Role UI : suivi consommation API, quotas et couts.
- Sections attendues d'apres le titre : KPI de cout, jauges/quota, tableaux d'usage, alertes de limite.
- Composants reutilisables : `KpiCard`, `StatusBadge`, `QuotaGauge` a creer, `ChartCard` a creer, `DataTable` a creer.
- Patterns : numeriques tabulaires, couleurs warning/error pour depassements, cartes de synthese compactes.
- Mapping Angular : `frontend/src/app/features/api-costs/api-costs.page.ts`.

### 4. Live Operations - Active Agents

- Role UI : supervision operationnelle des agents actifs.
- Sections attendues d'apres le titre : liste d'agents, statut live, logs courts, files ou jobs actifs, actions d'intervention.
- Composants reutilisables : `StatusBadge`, `SectionCard`, `AgentCard` a creer, `LogConsole` a creer, `DataTable` a creer.
- Patterns : ecran large 3040px, forte densite, status pips avec glow, navigation/shell fixe.
- Mapping Angular : `frontend/src/app/features/live-operations/live-operations.page.ts`.

### 5. Bankroll & Risk Management

- Role UI : pilotage bankroll et risque.
- Sections attendues d'apres le titre : KPI bankroll, limites, exposition, alertes risque, graphiques ou series.
- Composants reutilisables : `KpiCard`, `SectionCard`, `StatusBadge`, `ChartCard` a creer, `RiskCard` a creer.
- Patterns : hauteur 2406px, contenu plus vertical; amber reserve aux risques, emerald aux deltas positifs.
- Mapping Angular : `frontend/src/app/features/bankroll/bankroll.page.ts`.

### 6. Advanced Performance - AI Calibration & Analytics

- Role UI : analytics avancees et calibration IA.
- Sections attendues d'apres le titre : performance modeles, graphiques, tableaux de calibration, matrices ou evaluations.
- Composants reutilisables : `KpiCard`, `ChartCard` a creer, `DataTable` a creer, `CalibrationPanel` a creer.
- Patterns : ecran le plus haut (2866px), probablement plusieurs bandes analytiques verticales; typographie numerique et charting importants.
- Mapping Angular : `frontend/src/app/features/performance/performance.page.ts`.

### 7. Analysis Queue - Scheduled Scans

- Role UI : file d'analyse et scans planifies.
- Sections attendues d'apres le titre : queue de jobs, planning, progression, filtres, etats empty/loading/error.
- Composants reutilisables : `StatusBadge`, `SectionCard`, `DataTable` a creer, `Timeline` a creer.
- Patterns : table horizontale sans bordures verticales, lignes separees par bordures subtiles, etats hover.
- Mapping Angular : `frontend/src/app/features/analysis/analysis.page.ts`.

### 8. Platform Agents - Browser-Use Monitoring

- Role UI : monitoring des agents platform/browser-use.
- Sections attendues d'apres le titre : agents, sessions browser-use, erreurs, logs, usage ressources.
- Composants reutilisables : `StatusBadge`, `AgentCard` a creer, `LogConsole` a creer, `DataTable` a creer.
- Patterns : monitoring technique, donnees en police de type data, badges de statut et surfaces superposees.
- Mapping Angular : `frontend/src/app/features/platform-agents/platform-agents.page.ts`.

### 9. Global Settings - System Configuration

- Role UI : configuration globale systeme.
- Sections attendues d'apres le titre : preferences systeme, seuils, integrations, toggles, formulaires.
- Composants reutilisables : `SectionCard`, composants de formulaire partages a creer, `StatusBadge`, boutons d'action.
- Patterns : formulaire dashboard, petits rayons pour inputs/boutons, focus cyan, hierarchie par cards.
- Mapping Angular : aucune feature `settings` dediee actuellement. A creer sous `frontend/src/app/features/settings` ou rattacher temporairement a `strategy` seulement si le produit le justifie.

## E. Design tokens

Tokens Stitch globaux observes dans `designTheme` du projet `BetAuto Operations Dashboard`.

### Couleurs

| Token | Valeur |
|---|---|
| `background` / `surface` / `surface-dim` | `#12131a` |
| `surface-container-lowest` | `#0d0e15` |
| `surface-container-low` | `#1a1b22` |
| `surface-container` | `#1e1f26` |
| `surface-container-high` | `#292931` |
| `surface-container-highest` / `surface-variant` | `#33343c` |
| `surface-bright` | `#383941` |
| `on-surface` / `on-background` | `#e3e1ec` |
| `on-surface-variant` | `#bcc9cd` |
| `outline` | `#869397` |
| `outline-variant` | `#3d494c` |
| `primary` / `surface-tint` | `#4cd7f6` |
| `primary-container` | `#06b6d4` |
| `secondary` | `#4edea3` |
| `secondary-container` | `#00a572` |
| `tertiary` | `#ffb873` |
| `tertiary-container` | `#e89337` |
| `error` | `#ffb4ab` |
| `error-container` | `#93000a` |

Intentions de style fournies par Stitch :

- Deep Night dark UI pour reduire la fatigue visuelle.
- Cyan electrique pour actions et signaux IA.
- Emerald reserve aux deltas positifs et etats actifs.
- Amber reserve aux avertissements et risques.
- Surfaces sombres superposees avec bordures discretes.

### Typographie

| Token | Famille | Taille | Poids | Line-height | Letter spacing |
|---|---|---:|---:|---:|---:|
| `h1` | Inter | 24px | 600 | 32px | -0.02em |
| `h2` | Inter | 20px | 600 | 28px | -0.01em |
| `body-main` | Inter | 14px | 400 | 20px | n/a |
| `body-sm` | Inter | 12px | 400 | 16px | n/a |
| `label-caps` | Work Sans | 11px | 600 | 16px | 0.05em |
| `mono-data` | Space Grotesk | 13px | 500 | 18px | n/a |

### Spacing et radius

| Token | Valeur |
|---|---|
| `spacing.base` | 4px |
| `spacing.xs` | 8px |
| `spacing.sm` | 12px |
| `spacing.md` | 16px |
| `spacing.lg` | 24px |
| `spacing.xl` | 32px |
| `spacing.gutter` | 16px |
| `spacing.margin` | 24px |
| `rounded.sm` | 0.25rem |
| `rounded.DEFAULT` | 0.5rem |
| `rounded.md` | 0.75rem |
| `rounded.lg` | 1rem |
| `rounded.xl` | 1.5rem |
| `rounded.full` | 9999px |

### Styles repetitifs

- Layout fixed-fluid hybrid : sidebar fixe, navigation secondaire possible, contenu en grille fluide.
- Cartes : fond `surface-container-low` ou `surface-container`, bordure 1px `outline-variant`/gris sombre, radius cible 12px.
- Headers de cartes : separation visuelle par bordure basse ou contraste de surface.
- Tables : pas de bordures verticales, lignes horizontales subtiles, hover de ligne sur surface plus claire.
- Charts : trait cyan, remplissage cyan vers transparent, grid lines tres discretes.
- Inputs : fond sombre, bordure 1px, focus cyan + ring faible.
- Elements live : status pips circulaires avec glow emerald/amber/slate.

## F. Composants reutilisables

### Deja presents dans `frontend/src/app/shared/ui`

- `PageHeaderComponent` : titre, sous-titre, slot d'action.
- `SectionCardComponent` : container simple `rounded-lg border bg-surface p-4`.
- `KpiCardComponent` : label, value, statut optionnel.
- `StatusBadgeComponent` : badge `default/success/warning/danger`.
- `EmptyStateComponent`, `LoadingStateComponent`, `ErrorStateComponent`.

### A creer pour rapprocher Angular de Stitch

- `DataTableComponent` : lignes horizontales, colonnes denses, hover state, slots status/actions.
- `ChartCardComponent` : card analytique avec header, chart body, legend compacte.
- `QuotaGaugeComponent` : usage API/couts/limites.
- `TicketCardComponent` : proposition IA, statut, odds/score, actions.
- `AgentCardComponent` : agent actif, etat, job courant, dernier event.
- `LogConsoleComponent` : logs techniques denses en police data.
- `TimelineComponent` : queue, scheduled scans, audit trail.
- `RiskCardComponent` : exposition, seuils, alertes bankroll.
- `CalibrationPanelComponent` : metriques de calibration IA et performance.
- `FormFieldComponent` / primitives de settings : labels compacts, inputs dark, toggles, selects.

## G. Mapping Angular

| Ecran Stitch | Feature Angular existante | Etat actuel | Composants cibles |
|---|---|---|---|
| Overview - BetAuto Cockpit | `frontend/src/app/features/overview/overview.page.ts` | Placeholder | `PageHeader`, `KpiCard`, `SectionCard`, `ChartCard`, `DataTable` |
| Live Operations - Active Agents | `frontend/src/app/features/live-operations/live-operations.page.ts` | Placeholder | `AgentCard`, `StatusBadge`, `LogConsole`, `DataTable` |
| Analysis Queue - Scheduled Scans | `frontend/src/app/features/analysis/analysis.page.ts` | Placeholder | `DataTable`, `Timeline`, `StatusBadge`, etats loading/error/empty |
| Betting Tickets - AI Proposals | `frontend/src/app/features/tickets/tickets.page.ts` | Placeholder | `TicketCard`, `DataTable`, `StatusBadge`, actions |
| Bankroll & Risk Management | `frontend/src/app/features/bankroll/bankroll.page.ts` | Placeholder | `KpiCard`, `RiskCard`, `ChartCard`, `StatusBadge` |
| Advanced Performance - AI Calibration & Analytics | `frontend/src/app/features/performance/performance.page.ts` | Placeholder | `KpiCard`, `ChartCard`, `CalibrationPanel`, `DataTable` |
| API & Cost Control - Usage & Quotas | `frontend/src/app/features/api-costs/api-costs.page.ts` | Placeholder | `KpiCard`, `QuotaGauge`, `ChartCard`, `DataTable` |
| Platform Agents - Browser-Use Monitoring | `frontend/src/app/features/platform-agents/platform-agents.page.ts` | Placeholder | `AgentCard`, `LogConsole`, `StatusBadge`, `DataTable` |
| Global Settings - System Configuration | Non present | Route/feature manquante | `SettingsPage`, primitives de formulaire, `SectionCard` |

Layout cible :

- `frontend/src/app/layout/shell/shell.component.ts` existe et fournit shell desktop/mobile.
- `frontend/src/app/layout/sidebar/sidebar.component.ts` existe avec sidebar desktop `w-64`.
- `frontend/src/app/layout/topbar/topbar.component.ts` existe mais reste minimal.
- `frontend/src/app/layout/mobile-nav/mobile-nav.component.ts` existe pour mobile.

## H. Ecarts avec le frontend actuel

### Tokens

- Stitch utilise `#12131a`, `#1a1b22`, `#1e1f26`, `#292931`, `#33343c`, cyan `#06b6d4/#4cd7f6`, emerald `#10b981/#4edea3`, amber `#f59e0b/#ffb873`.
- Angular/Tailwind actuel expose des variables plus generiques dans `frontend/src/styles.css` : background `2 6 23`, surface `15 23 42`, border `30 41 59`, accent bleu `59 130 246`.
- Ecart : la palette actuelle est slate/blue generique, pas encore alignee sur BetAuto Analytical Interface.

### Structure UI

- Stitch decrit une experience dashboard dense et operationnelle.
- Les pages Angular de `frontend/src/app/features` sont toutes des placeholders avec un `PageHeader` et un `SectionCard`.
- Les routes principales existent deja pour 8 des 9 ecrans Stitch; `Global Settings` manque comme feature dediee.

### Composants

- Les bases existent (`SectionCard`, `KpiCard`, `StatusBadge`) mais elles sont trop simples pour les ecrans Stitch.
- Il manque les composants data-rich : tables, charts, gauges, consoles de logs, cartes agents, cartes tickets, panels de calibration.
- `StatusBadge` ne couvre pas encore les pips/glow live et la semantique operationnelle riche.

### Layout

- Le shell Angular correspond partiellement au pattern Stitch : sidebar fixe desktop, topbar, nav mobile.
- La topbar actuelle n'integre pas encore actions, contexte de page, alertes ou indicateurs live.
- Le design Stitch mentionne 240px et 64px comme dimensions de navigation; Angular utilise actuellement `w-64` (256px).

## I. Roadmap UI priorisee

1. Aligner les design tokens Tailwind sur Stitch : couleurs, fonts Inter/Work Sans/Space Grotesk, spacing 4px, radius, semantic aliases.
2. Renforcer les primitives `shared/ui` : `SectionCard`, `KpiCard`, `StatusBadge`, boutons, inputs, table de base.
3. Ajouter les composants data-rich communs : `DataTable`, `ChartCard`, `QuotaGauge`, `LogConsole`, `Timeline`.
4. Implementer `Overview - BetAuto Cockpit` en premier pour valider shell, grille, cartes, KPI, charts et tokens.
5. Implementer `Live Operations - Active Agents` et `Platform Agents - Browser-Use Monitoring` avec composants agents/logs/status.
6. Implementer `Analysis Queue - Scheduled Scans` avec table, progression, filtres et etats.
7. Implementer `Betting Tickets - AI Proposals` avec `TicketCard` et actions de validation.
8. Implementer `API & Cost Control - Usage & Quotas` avec `QuotaGauge` et vues de couts.
9. Implementer `Bankroll & Risk Management` puis `Advanced Performance - AI Calibration & Analytics`.
10. Ajouter une feature `settings` pour `Global Settings - System Configuration` et l'integrer a `app.routes.ts`/`nav-items.ts`.

Priorite technique : stabiliser les composants et tokens avant de remplir toutes les pages, sinon les 9 ecrans risquent de diverger visuellement et de dupliquer leurs patterns.

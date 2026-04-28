# Frontend Design System - BetAuto Analytical Interface

_Source de verite : `docs/frontend_stitch_mcp_audit.md`._

Ce design system applique les tokens Stitch MCP audites sans copier de HTML Stitch. Les composants sont Angular standalone, generiques, pilotables par `@Input`, et prets a etre reutilises dans les futures pages BetAuto.

## Tokens appliques

Les tokens sont exposes dans `frontend/src/styles.css` sous forme de variables RGB, puis consommes par Tailwind dans `frontend/tailwind.config.js`.

| Usage | Token Tailwind | Valeur |
|---|---|---|
| App background | `bg-background` | `#12131a` |
| Surface low | `bg-surface-low` | `#1a1b22` |
| Surface | `bg-surface` | `#1e1f26` |
| Surface high | `bg-surface-high` | `#292931` |
| Surface highest | `bg-surface-highest` | `#33343c` |
| Text | `text-text` | `#e3e1ec` |
| Muted text | `text-muted` | `#bcc9cd` |
| Outline | `outline` / `border-outline` | `#869397` |
| Border | `border-border` | `#3d494c` |
| Primary cyan | `text-accent` / `bg-accent` | `#4cd7f6` |
| Primary container | `bg-accent-strong` | `#06b6d4` |
| Secondary emerald | `text-success` / `bg-success` | `#4edea3` |
| Warning amber | `text-warning` / `bg-warning` | `#ffb873` |
| Danger/error | `text-danger` / `bg-danger` | `#ffb4ab` |

Shared utility classes:

- `.ba-card` : dark surface, 1px discreet border, 12px radius.
- `.ba-card-header` : compact card header with bottom border.
- `.ba-label` : uppercase Work Sans-style label.
- `.ba-data` : Space Grotesk-style numeric/data text.
- `.ba-tool` : shared input/select/button surface with cyan focus.

## Fonts

Tailwind font families are configured as:

- `font-sans`: `Inter`, then system sans fallback.
- `font-label`: `Work Sans`, then Inter/system fallback.
- `font-data`: `Space Grotesk`, then monospace fallback.

No external font import is added in this task, to avoid network/runtime coupling. If brand fidelity requires exact fonts, add self-hosted font files or an approved font import later.

## Refactored components

- `ba-section-card`: base card shell aligned with Stitch surfaces and borders.
- `ba-kpi-card`: compact KPI with optional status, tone and delta.
- `ba-status-badge`: semantic badges including `live` tone with status pip/glow.
- `ba-page-header`: page title, eyebrow, subtitle and projected actions.
- `ba-empty-state`: bordered empty placeholder.
- `ba-loading-state`: compact cyan pulse.
- `ba-error-state`: danger surface with label and message.

## New shared components

### `ba-data-table`

Use for dense operational tables.

Inputs:

- `title`, `subtitle`
- `columns: DataTableColumn[]`
- `rows: DataTableRow[]`
- `showStatus`
- `emptyMessage`

### `ba-chart-card`

Use as a generic chart container. It includes a simple bar preview for design-system/demo usage; future feature pages can replace the body with a chart library if needed.

Inputs:

- `label`, `title`, `value`, `caption`
- `points: ChartPoint[]`

### `ba-quota-gauge`

Use for API usage, cost limits and quotas.

Inputs:

- `label`, `used`, `limit`, `caption`

Tone is derived from percentage: success below 70%, warning from 70%, danger from 90%.

### `ba-ticket-card`

Use for AI betting proposals.

Inputs:

- `title`, `market`, `status`, `tone`
- `odds`, `confidence`, `stake`, `summary`

### `ba-agent-card`

Use for live/platform/browser-use agents.

Inputs:

- `name`, `role`, `status`, `tone`
- `currentJob`, `lastEvent`

### `ba-log-console`

Use for technical logs and monitoring.

Inputs:

- `label`, `title`
- `entries: LogEntry[]`

### `ba-timeline`

Use for queues, scheduled scans, audit events and workflow history.

Inputs:

- `title`
- `items: TimelineItem[]`

### `ba-risk-card`

Use for bankroll, exposure and risk thresholds.

Inputs:

- `label`, `value`, `status`, `tone`
- `exposure`, `description`

### `ba-calibration-panel`

Use for AI calibration and performance analytics.

Inputs:

- `label`, `title`
- `metrics: CalibrationMetric[]`

### `ba-form-field`

Use to wrap inputs/selects/toggles with compact labels and validation text.

Inputs:

- `label`
- `hint`
- `error`

Project form controls inside the component and apply `.ba-tool` to the control.

## Demo route

Route added:

- `/design-system`

The route renders `frontend/src/app/features/design-system/design-system.page.ts` with mock data only. It is also present in the primary nav for discoverability during implementation.

## Conventions

- Use Angular standalone components only.
- Keep data components input-driven; do not bind them directly to backend services.
- Use `font-data` for metrics, identifiers, odds, percentages and log values.
- Use `ba-label` for compact uppercase section metadata.
- Use `tone` values consistently: `default`, `success`, `warning`, `danger`, `live`.
- Prefer `surface-low` for page-level cards and `surface`/`surface-high` for nested surfaces.
- Use `border-border/60` or `border-border/80` for structural separation; reserve `border-outline` for stronger hover/focus.

## Recommended screen implementation order

1. Overview - BetAuto Cockpit.
2. Live Operations - Active Agents.
3. Platform Agents - Browser-Use Monitoring.
4. Analysis Queue - Scheduled Scans.
5. Betting Tickets - AI Proposals.
6. API & Cost Control - Usage & Quotas.
7. Bankroll & Risk Management.
8. Advanced Performance - AI Calibration & Analytics.
9. Global Settings - System Configuration.

Before implementing those screens, stabilize any component API changes in `frontend/src/app/shared/ui` so the pages do not duplicate tables, badges, cards or chart containers.

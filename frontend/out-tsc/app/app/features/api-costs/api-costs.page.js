import { Component, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { CostsApiService } from '../../core/api/costs-api.service';
import { ChartCardComponent } from '../../shared/ui/chart-card/chart-card.component';
import { DataTableComponent } from '../../shared/ui/data-table/data-table.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { LogConsoleComponent } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { QuotaGaugeComponent } from '../../shared/ui/quota-gauge/quota-gauge.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.label;
const _forTrack1 = ($index, $item) => $item.title + $item.metric;
function ApiCostsPage_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 4);
    i0.ɵɵelement(1, "ba-loading-state", 6);
    i0.ɵɵelementEnd();
} }
function ApiCostsPage_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 5);
    i0.ɵɵelement(1, "ba-error-state", 7);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("message", ctx_r0.error);
} }
function ApiCostsPage_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 5);
    i0.ɵɵelement(1, "ba-empty-state", 8);
    i0.ɵɵelementEnd();
} }
function ApiCostsPage_Conditional_9_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-kpi-card", 10);
} if (rf & 2) {
    const kpi_r2 = ctx.$implicit;
    i0.ɵɵproperty("label", kpi_r2.label)("value", kpi_r2.value)("status", kpi_r2.status)("tone", kpi_r2.tone);
} }
function ApiCostsPage_Conditional_9_For_26_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 24)(1, "div")(2, "p", 29);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 30);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(6, "ba-status-badge", 31);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const alert_r3 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(alert_r3.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(alert_r3.detail);
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", alert_r3.level)("tone", ctx_r0.alertTone(alert_r3));
} }
function ApiCostsPage_Conditional_9_ForEmpty_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-status-badge", 25);
} }
function ApiCostsPage_Conditional_9_Conditional_31_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 28);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.summary == null ? null : ctx_r0.summary.estimation_method);
} }
function ApiCostsPage_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 9);
    i0.ɵɵrepeaterCreate(1, ApiCostsPage_Conditional_9_For_2_Template, 1, 4, "ba-kpi-card", 10, _forTrack0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "section", 11)(4, "div", 12);
    i0.ɵɵelement(5, "ba-quota-gauge", 13)(6, "ba-quota-gauge", 14)(7, "ba-quota-gauge", 15);
    i0.ɵɵelementEnd();
    i0.ɵɵelement(8, "ba-chart-card", 16);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "section", 17)(10, "ba-section-card")(11, "div", 18)(12, "p", 19);
    i0.ɵɵtext(13, "Cost breakdown");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "h3", 20);
    i0.ɵɵtext(15, "Service-level estimates");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "div", 21);
    i0.ɵɵelement(17, "ba-data-table", 22);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(18, "ba-section-card")(19, "div", 18)(20, "p", 19);
    i0.ɵɵtext(21, "Alerts");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "h3", 20);
    i0.ɵɵtext(23, "Simple threshold checks");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(24, "div", 23);
    i0.ɵɵrepeaterCreate(25, ApiCostsPage_Conditional_9_For_26_Template, 7, 4, "div", 24, _forTrack1, false, ApiCostsPage_Conditional_9_ForEmpty_27_Template, 1, 0, "ba-status-badge", 25);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(28, "section", 17);
    i0.ɵɵelement(29, "ba-data-table", 26)(30, "ba-log-console", 27);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(31, ApiCostsPage_Conditional_9_Conditional_31_Template, 2, 1, "p", 28);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.kpis);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("used", ctx_r0.openAiCostCents)("limit", ctx_r0.openAiBudgetCents);
    i0.ɵɵadvance();
    i0.ɵɵproperty("used", ctx_r0.apiFootballRequests)("limit", 10000);
    i0.ɵɵadvance();
    i0.ɵɵproperty("used", ctx_r0.browserUseRuns)("limit", 500);
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", ctx_r0.formatMoney(ctx_r0.summary == null ? null : ctx_r0.summary.total_cost_today))("points", ctx_r0.costTrend);
    i0.ɵɵadvance(9);
    i0.ɵɵproperty("columns", ctx_r0.breakdownColumns)("rows", ctx_r0.breakdownRows);
    i0.ɵɵadvance(8);
    i0.ɵɵrepeater(ctx_r0.alerts);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("columns", ctx_r0.runCostColumns)("rows", ctx_r0.runCostRows);
    i0.ɵɵadvance();
    i0.ɵɵproperty("entries", ctx_r0.logs);
    i0.ɵɵadvance();
    i0.ɵɵconditional((ctx_r0.summary == null ? null : ctx_r0.summary.estimation_method) ? 31 : -1);
} }
export class ApiCostsPage {
    constructor() {
        this.costsApi = inject(CostsApiService);
        this.isLoading = true;
        this.error = '';
        this.isNoData = false;
        this.summary = null;
        this.runs = [];
        this.trend = null;
        this.breakdown = [];
        this.alerts = [];
        this.breakdownColumns = [
            { key: 'service', label: 'Service' },
            { key: 'requests', label: 'Estimated requests', align: 'right', data: true },
            { key: 'cost', label: 'Estimated cost', align: 'right', data: true },
            { key: 'average', label: 'Avg cost/request', align: 'right', data: true }
        ];
        this.runCostColumns = [
            { key: 'id', label: 'Run ID', data: true },
            { key: 'target', label: 'Target', data: true },
            { key: 'matches', label: 'Matches', align: 'right', data: true },
            { key: 'tokens', label: 'Tokens', align: 'right', data: true },
            { key: 'cost', label: 'Cost', align: 'right', data: true },
            { key: 'duration', label: 'Duration', align: 'right', data: true }
        ];
    }
    ngOnInit() {
        this.loadCosts();
    }
    loadCosts() {
        this.isLoading = true;
        this.error = '';
        this.isNoData = false;
        forkJoin({
            summary: this.costsApi.getSummary(),
            runs: this.costsApi.getRuns(),
            trend: this.costsApi.getTrend('7d'),
            breakdown: this.costsApi.getBreakdown(),
            alerts: this.costsApi.getAlerts()
        }).subscribe({
            next: ({ summary, runs, trend, breakdown, alerts }) => {
                if (this.noData(summary) || this.noData(runs)) {
                    this.isNoData = true;
                    this.isLoading = false;
                    return;
                }
                this.summary = summary;
                this.runs = runs.runs;
                this.trend = this.noData(trend) ? null : trend;
                this.breakdown = this.noData(breakdown) ? [] : breakdown.services;
                this.alerts = this.noData(alerts) ? [] : alerts.alerts;
                this.isLoading = false;
            },
            error: (error) => {
                this.error = this.errorMessage(error);
                this.isLoading = false;
            }
        });
    }
    get kpis() {
        return [
            { label: 'Cost today', value: this.formatMoney(this.summary?.total_cost_today), status: 'Estimate', tone: 'default' },
            { label: 'Cost 7d', value: this.formatMoney(this.summary?.total_cost_7d), status: 'Estimate', tone: 'default' },
            { label: 'Runs', value: String(this.summary?.runs_count || 0), status: 'Artifacts', tone: 'success' },
            { label: 'Avg cost/run', value: this.formatMoney(this.summary?.average_cost_per_run), status: 'Heuristic', tone: 'success' },
            { label: 'Estimated tokens', value: this.formatNumber(this.summary?.total_estimated_tokens || 0), status: 'Approx', tone: 'warning' },
            { label: 'Alerts', value: String(this.alerts.length), status: this.alerts.length ? 'Review' : 'Clear', tone: this.alerts.length ? 'warning' : 'success' }
        ];
    }
    get costTrend() {
        return (this.trend?.points || []).map((point) => ({
            label: point.date.slice(5),
            value: point.cost
        }));
    }
    get breakdownRows() {
        return this.breakdown.map((item) => ({
            cells: {
                service: item.service,
                requests: this.formatNumber(item.estimated_requests),
                cost: this.formatMoney(item.estimated_cost),
                average: this.formatMoney(item.average_cost_per_request)
            },
            status: item.status,
            statusTone: item.status === 'placeholder' ? 'warning' : 'success'
        }));
    }
    get runCostRows() {
        return this.runs.map((run) => ({
            cells: {
                id: run.run_id,
                target: run.target_date || '—',
                matches: run.matches_analyzed_estimate,
                tokens: this.compactTokens(run.estimated_tokens),
                cost: this.formatMoney(run.estimated_cost),
                duration: run.duration_label
            },
            status: run.status || 'unknown',
            statusTone: this.statusTone(run.status)
        }));
    }
    get logs() {
        const alertEntries = this.alerts.map((alert, index) => ({
            time: String(index + 1).padStart(2, '0'),
            level: alert.level === 'error' ? 'danger' : 'warning',
            message: `[cost] ${alert.title}: ${alert.detail}`
        }));
        if (alertEntries.length) {
            return alertEntries;
        }
        return [{ time: '01', level: 'success', message: '[cost] no threshold alert triggered' }];
    }
    get openAiCostCents() {
        return Math.round((this.breakdown.find((item) => item.service === 'openai')?.estimated_cost || 0) * 100);
    }
    get openAiBudgetCents() {
        return 5000;
    }
    get apiFootballRequests() {
        return this.breakdown.find((item) => item.service === 'api_football')?.estimated_requests || 0;
    }
    get browserUseRuns() {
        return this.breakdown.find((item) => item.service === 'browser_use')?.estimated_requests || 0;
    }
    alertTone(alert) {
        if (alert.level === 'error') {
            return 'danger';
        }
        if (alert.level === 'warning') {
            return 'warning';
        }
        return 'default';
    }
    noData(value) {
        return Boolean(value && typeof value === 'object' && 'status' in value && value.status === 'no_data');
    }
    statusTone(status) {
        const normalized = String(status || '').toLowerCase();
        if (['completed', 'done', 'success'].includes(normalized)) {
            return 'success';
        }
        if (['running', 'active'].includes(normalized)) {
            return 'live';
        }
        if (['failed', 'error'].includes(normalized)) {
            return 'danger';
        }
        return 'default';
    }
    formatMoney(value) {
        const amount = typeof value === 'number' && Number.isFinite(value) ? value : 0;
        return `$${amount.toFixed(2)}`;
    }
    formatNumber(value) {
        return new Intl.NumberFormat('en-US').format(value);
    }
    compactTokens(value) {
        if (value >= 1000) {
            return `${Math.round(value / 1000)}k`;
        }
        return String(value);
    }
    errorMessage(error) {
        if (error && typeof error === 'object' && 'message' in error) {
            return String(error.message || 'Unexpected costs API error.');
        }
        return 'Unexpected costs API error.';
    }
    static { this.ɵfac = function ApiCostsPage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ApiCostsPage)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ApiCostsPage, selectors: [["ba-api-costs-page"]], decls: 10, vars: 1, consts: [["eyebrow", "Infrastructure & Costs", "title", "API Usage & Cost Control", "subtitle", "Suivi des co\u00FBts, quotas et consommation des APIs utilis\u00E9es par BetAuto."], [1, "flex", "flex-wrap", "gap-2"], ["type", "button", 1, "ba-tool", "border-accent/60", "bg-accent", "text-background", "hover:bg-accent-strong", 3, "click"], ["type", "button", 1, "ba-tool"], [1, "mt-4", "rounded-card", "border", "border-border", "bg-surface-low", "p-4"], [1, "mt-4"], ["message", "Loading estimated costs from run artifacts..."], ["label", "Costs API error", 3, "message"], ["label", "No cost data available yet", "message", "No run_summary.json artifact was found under data/orchestrator_runs."], [1, "mt-4", "grid", "gap-4", "sm:grid-cols-2", "xl:grid-cols-3", "2xl:grid-cols-6"], [3, "label", "value", "status", "tone"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-[0.85fr_1.15fr]"], [1, "grid", "gap-4", "md:grid-cols-3", "xl:grid-cols-1"], ["label", "OpenAI estimate", "caption", "Estimated cents versus local monthly guardrail.", 3, "used", "limit"], ["label", "API-Football estimate", "caption", "Estimated match-context requests from run_summary only.", 3, "used", "limit"], ["label", "Browser Use estimate", "caption", "Placeholder because Browser Use is not active in orchestrator API mode.", 3, "used", "limit"], ["label", "Cost trend", "title", "Artifact estimate", "caption", "Estimated from run_summary.json only. No provider billing call is made.", 3, "value", "points"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-[1.1fr_0.9fr]"], [1, "ba-card-header"], [1, "ba-label"], [1, "mt-1", "text-sm", "font-semibold", "text-text"], [1, "p-4"], [3, "columns", "rows"], [1, "space-y-3", "p-4"], [1, "flex", "items-start", "justify-between", "gap-4", "rounded-card", "border", "border-border/60", "bg-background/60", "p-3"], ["label", "no alerts", "tone", "success"], ["title", "Cost per run", "subtitle", "Estimated cost profile for strict orchestrator run artifacts.", 3, "columns", "rows"], ["label", "Cost logs", "title", "Estimator events", 3, "entries"], [1, "mt-4", "text-xs", "text-muted"], [1, "text-sm", "font-medium", "text-text"], [1, "mt-1", "text-xs", "text-muted"], [3, "label", "tone"]], template: function ApiCostsPage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "ba-page-header", 0)(1, "div", 1)(2, "button", 2);
            i0.ɵɵlistener("click", function ApiCostsPage_Template_button_click_2_listener() { return ctx.loadCosts(); });
            i0.ɵɵtext(3, " Refresh ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "button", 3);
            i0.ɵɵtext(5, " Export report ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵconditionalCreate(6, ApiCostsPage_Conditional_6_Template, 2, 0, "section", 4)(7, ApiCostsPage_Conditional_7_Template, 2, 1, "section", 5)(8, ApiCostsPage_Conditional_8_Template, 2, 0, "section", 5)(9, ApiCostsPage_Conditional_9_Template, 32, 15);
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵconditional(ctx.isLoading ? 6 : ctx.error ? 7 : ctx.isNoData ? 8 : 9);
        } }, dependencies: [ChartCardComponent,
            DataTableComponent,
            EmptyStateComponent,
            ErrorStateComponent,
            KpiCardComponent,
            LoadingStateComponent,
            LogConsoleComponent,
            PageHeaderComponent,
            QuotaGaugeComponent,
            SectionCardComponent,
            StatusBadgeComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ApiCostsPage, [{
        type: Component,
        args: [{
                selector: 'ba-api-costs-page',
                standalone: true,
                imports: [
                    ChartCardComponent,
                    DataTableComponent,
                    EmptyStateComponent,
                    ErrorStateComponent,
                    KpiCardComponent,
                    LoadingStateComponent,
                    LogConsoleComponent,
                    PageHeaderComponent,
                    QuotaGaugeComponent,
                    SectionCardComponent,
                    StatusBadgeComponent
                ],
                template: `
    <ba-page-header
      eyebrow="Infrastructure & Costs"
      title="API Usage & Cost Control"
      subtitle="Suivi des coûts, quotas et consommation des APIs utilisées par BetAuto."
    >
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="ba-tool border-accent/60 bg-accent text-background hover:bg-accent-strong"
          (click)="loadCosts()"
        >
          Refresh
        </button>
        <button type="button" class="ba-tool">
          Export report
        </button>
      </div>
    </ba-page-header>

    @if (isLoading) {
      <section class="mt-4 rounded-card border border-border bg-surface-low p-4">
        <ba-loading-state message="Loading estimated costs from run artifacts..."></ba-loading-state>
      </section>
    } @else if (error) {
      <section class="mt-4">
        <ba-error-state label="Costs API error" [message]="error"></ba-error-state>
      </section>
    } @else if (isNoData) {
      <section class="mt-4">
        <ba-empty-state
          label="No cost data available yet"
          message="No run_summary.json artifact was found under data/orchestrator_runs."
        ></ba-empty-state>
      </section>
    } @else {
      <section class="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        @for (kpi of kpis; track kpi.label) {
          <ba-kpi-card
            [label]="kpi.label"
            [value]="kpi.value"
            [status]="kpi.status"
            [tone]="kpi.tone"
          ></ba-kpi-card>
        }
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <div class="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
          <ba-quota-gauge
            label="OpenAI estimate"
            [used]="openAiCostCents"
            [limit]="openAiBudgetCents"
            caption="Estimated cents versus local monthly guardrail."
          ></ba-quota-gauge>
          <ba-quota-gauge
            label="API-Football estimate"
            [used]="apiFootballRequests"
            [limit]="10000"
            caption="Estimated match-context requests from run_summary only."
          ></ba-quota-gauge>
          <ba-quota-gauge
            label="Browser Use estimate"
            [used]="browserUseRuns"
            [limit]="500"
            caption="Placeholder because Browser Use is not active in orchestrator API mode."
          ></ba-quota-gauge>
        </div>

        <ba-chart-card
          label="Cost trend"
          title="Artifact estimate"
          [value]="formatMoney(summary?.total_cost_today)"
          caption="Estimated from run_summary.json only. No provider billing call is made."
          [points]="costTrend"
        ></ba-chart-card>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Cost breakdown</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Service-level estimates</h3>
          </div>
          <div class="p-4">
            <ba-data-table
              [columns]="breakdownColumns"
              [rows]="breakdownRows"
            ></ba-data-table>
          </div>
        </ba-section-card>

        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Alerts</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Simple threshold checks</h3>
          </div>
          <div class="space-y-3 p-4">
            @for (alert of alerts; track alert.title + alert.metric) {
              <div class="flex items-start justify-between gap-4 rounded-card border border-border/60 bg-background/60 p-3">
                <div>
                  <p class="text-sm font-medium text-text">{{ alert.title }}</p>
                  <p class="mt-1 text-xs text-muted">{{ alert.detail }}</p>
                </div>
                <ba-status-badge [label]="alert.level" [tone]="alertTone(alert)"></ba-status-badge>
              </div>
            } @empty {
              <ba-status-badge label="no alerts" tone="success"></ba-status-badge>
            }
          </div>
        </ba-section-card>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ba-data-table
          title="Cost per run"
          subtitle="Estimated cost profile for strict orchestrator run artifacts."
          [columns]="runCostColumns"
          [rows]="runCostRows"
        ></ba-data-table>

        <ba-log-console
          label="Cost logs"
          title="Estimator events"
          [entries]="logs"
        ></ba-log-console>
      </section>

      @if (summary?.estimation_method) {
        <p class="mt-4 text-xs text-muted">{{ summary?.estimation_method }}</p>
      }
    }
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ApiCostsPage, { className: "ApiCostsPage", filePath: "src/app/features/api-costs/api-costs.page.ts", lineNumber: 187 }); })();
//# sourceMappingURL=api-costs.page.js.map
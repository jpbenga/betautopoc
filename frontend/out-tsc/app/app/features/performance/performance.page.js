import { Component, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { PerformanceApiService } from '../../core/api/performance-api.service';
import { CalibrationPanelComponent } from '../../shared/ui/calibration-panel/calibration-panel.component';
import { ChartCardComponent } from '../../shared/ui/chart-card/chart-card.component';
import { DataTableComponent } from '../../shared/ui/data-table/data-table.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { LogConsoleComponent } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.label;
const _forTrack1 = ($index, $item) => $item.dimension;
function PerformancePage_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ba-section-card")(1, "div", 6);
    i0.ɵɵelement(2, "ba-loading-state", 7);
    i0.ɵɵelementEnd()();
} }
function PerformancePage_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-error-state", 4);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("message", ctx_r0.error);
} }
function PerformancePage_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-empty-state", 5);
} }
function PerformancePage_Conditional_9_For_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-kpi-card", 15);
} if (rf & 2) {
    const kpi_r2 = ctx.$implicit;
    i0.ɵɵproperty("label", kpi_r2.label)("value", kpi_r2.value)("status", kpi_r2.status || "")("tone", kpi_r2.tone || "default");
} }
function PerformancePage_Conditional_9_For_34_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 26)(1, "div")(2, "p", 22);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 37);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 38);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(8, "ba-status-badge", 39);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const signal_r3 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(signal_r3.dimension);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(signal_r3.variation_score);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(signal_r3.message);
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", signal_r3.status)("tone", signal_r3.status === "watch" ? "warning" : "success");
} }
function PerformancePage_Conditional_9_ForEmpty_35_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 27);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate((ctx_r0.drift == null ? null : ctx_r0.drift.message) || "No drift signal available.");
} }
function PerformancePage_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 8)(1, "div", 9)(2, "p", 10);
    i0.ɵɵtext(3, "Outcome-based accuracy not available yet");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 11);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "div", 9)(7, "p", 10);
    i0.ɵɵtext(8, "No real ROI until settlement/results capability exists");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "p", 11);
    i0.ɵɵtext(10);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(11, "div", 12)(12, "p", 13);
    i0.ɵɵtext(13, "Proxy calibration");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "p", 11);
    i0.ɵɵtext(15);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(16, "section", 14);
    i0.ɵɵrepeaterCreate(17, PerformancePage_Conditional_9_For_18_Template, 1, 4, "ba-kpi-card", 15, _forTrack0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(19, "section", 16);
    i0.ɵɵelement(20, "ba-chart-card", 17)(21, "ba-chart-card", 18);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(22, "section", 19);
    i0.ɵɵelement(23, "ba-calibration-panel", 20);
    i0.ɵɵelementStart(24, "ba-section-card")(25, "div", 21)(26, "div")(27, "p", 22);
    i0.ɵɵtext(28, "Drift detection");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(29, "h3", 23);
    i0.ɵɵtext(30, "Distribution drift proxy");
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(31, "ba-status-badge", 24);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(32, "div", 25);
    i0.ɵɵrepeaterCreate(33, PerformancePage_Conditional_9_For_34_Template, 9, 5, "div", 26, _forTrack1, false, PerformancePage_Conditional_9_ForEmpty_35_Template, 2, 1, "p", 27);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(36, "section", 16);
    i0.ɵɵelement(37, "ba-data-table", 28)(38, "ba-data-table", 29);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(39, "section", 30)(40, "ba-section-card")(41, "div", 31)(42, "p", 22);
    i0.ɵɵtext(43, "Data quality");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(44, "h3", 23);
    i0.ɵɵtext(45, "Artifact health");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(46, "div", 32);
    i0.ɵɵelement(47, "ba-kpi-card", 33)(48, "ba-kpi-card", 34)(49, "ba-kpi-card", 35);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(50, "ba-log-console", 36);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.accuracyMessage);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.roiMessage);
    i0.ɵɵadvance(5);
    i0.ɵɵtextInterpolate(ctx_r0.calibrationMessage);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r0.kpis);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("value", ctx_r0.summary ? ctx_r0.summary.total_candidates + " candidates" : "\u2014")("points", ctx_r0.confidenceTierPoints);
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", ctx_r0.dataQuality ? ctx_r0.dataQuality.candidates_with_odds_percent + "% with odds" : "\u2014")("points", ctx_r0.dataQualityPoints);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("metrics", ctx_r0.calibrationMetrics);
    i0.ɵɵadvance(8);
    i0.ɵɵproperty("label", (ctx_r0.drift == null ? null : ctx_r0.drift.status) || "partial");
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r0.driftSignals);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("columns", ctx_r0.strategyColumns)("rows", ctx_r0.strategyRows);
    i0.ɵɵadvance();
    i0.ɵɵproperty("columns", ctx_r0.marketColumns)("rows", ctx_r0.marketRows);
    i0.ɵɵadvance(9);
    i0.ɵɵproperty("value", ctx_r0.dataQuality ? ctx_r0.dataQuality.candidates_with_odds_percent + "%" : "\u2014");
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", ctx_r0.dataQuality ? ctx_r0.dataQuality.missing_odds_rejected_percent + "%" : "\u2014");
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", ctx_r0.dataQuality ? ctx_r0.dataQuality.completed_no_data_runs_percent + "%" : "\u2014");
    i0.ɵɵadvance();
    i0.ɵɵproperty("entries", ctx_r0.logs);
} }
export class PerformancePage {
    constructor() {
        this.performanceApi = inject(PerformanceApiService);
        this.loading = true;
        this.error = '';
        this.empty = false;
        this.summary = null;
        this.accuracy = null;
        this.roi = null;
        this.calibration = null;
        this.strategies = null;
        this.markets = null;
        this.drift = null;
        this.dataQuality = null;
        this.performanceLogs = [];
        this.strategyColumns = [
            { key: 'strategy', label: 'Strategy' },
            { key: 'runs', label: 'Runs', align: 'right', data: true },
            { key: 'tickets', label: 'Tickets', align: 'right', data: true },
            { key: 'confidence', label: 'Avg conf.', align: 'right', data: true },
            { key: 'odds', label: 'Avg odds', align: 'right', data: true }
        ];
        this.marketColumns = [
            { key: 'market', label: 'Market' },
            { key: 'count', label: 'Candidates', align: 'right', data: true },
            { key: 'filtered', label: 'Filtered', align: 'right', data: true },
            { key: 'confidence', label: 'Avg conf.', align: 'right', data: true },
            { key: 'rate', label: 'Filtered rate', align: 'right', data: true }
        ];
    }
    ngOnInit() {
        this.loadPerformance();
    }
    get kpis() {
        return [
            { label: 'Total runs', value: this.value(this.summary?.total_runs), status: 'real', tone: 'success' },
            { label: 'Tickets', value: this.value(this.summary?.total_tickets), status: 'real', tone: 'success' },
            { label: 'Candidates', value: this.value(this.summary?.total_candidates), status: 'artifact', tone: 'default' },
            { label: 'Filtered candidates', value: this.value(this.summary?.filtered_candidates_count), status: 'partial', tone: 'warning' },
            { label: 'Avg confidence', value: this.percentValue(this.summary?.average_confidence_score), status: 'proxy', tone: 'warning' },
            { label: 'Acceptance proxy', value: this.percentValue(this.accuracy?.proxy_acceptance_rate), status: 'proxy', tone: 'warning' }
        ];
    }
    get accuracyMessage() {
        return this.accuracy?.accuracy_not_available_reason || 'No settled outcomes are available.';
    }
    get roiMessage() {
        return this.roi?.message || 'No real ROI until settlement/results capability exists.';
    }
    get calibrationMessage() {
        return this.calibration?.message || 'Proxy calibration derived from candidate filtering.';
    }
    get confidenceTierPoints() {
        return (this.summary?.confidence_tier_distribution || []).map((item) => ({ label: item.key, value: item.count }));
    }
    get dataQualityPoints() {
        return (this.dataQuality?.data_quality_distribution || this.summary?.data_quality_distribution || []).map((item) => ({
            label: item.key,
            value: item.count
        }));
    }
    get calibrationMetrics() {
        return (this.calibration?.buckets || []).map((bucket) => ({
            label: bucket.bucket,
            value: `${bucket.filtered_rate}% filtered`,
            hint: `${bucket.filtered_count}/${bucket.candidates_count} kept, ${bucket.rejected_count} rejected`
        }));
    }
    get driftSignals() {
        return this.drift?.signals || [];
    }
    get strategyRows() {
        return (this.strategies?.strategies || []).map((strategy) => ({
            cells: {
                strategy: strategy.strategy_key,
                runs: strategy.runs_count,
                tickets: strategy.tickets_count,
                confidence: this.percentValue(strategy.avg_confidence),
                odds: this.value(strategy.avg_estimated_odds)
            },
            status: strategy.status,
            statusTone: 'warning'
        }));
    }
    get marketRows() {
        return (this.markets?.markets || []).map((market) => ({
            cells: {
                market: market.market,
                count: market.candidates_count,
                filtered: market.filtered_count,
                confidence: this.percentValue(market.avg_confidence),
                rate: this.percentValue(market.filtered_rate)
            },
            status: market.status,
            statusTone: 'warning'
        }));
    }
    get logs() {
        return this.performanceLogs.map((entry, index) => ({
            time: `#${index + 1}`,
            level: this.logLevel(entry.level),
            message: `[${entry.source}] ${entry.message}`
        }));
    }
    loadPerformance() {
        this.loading = true;
        this.error = '';
        forkJoin({
            summary: this.performanceApi.getSummary(),
            accuracy: this.performanceApi.getAccuracy(),
            roi: this.performanceApi.getRoi(),
            calibration: this.performanceApi.getCalibration(),
            strategies: this.performanceApi.getStrategiesCompare(),
            markets: this.performanceApi.getMarkets(),
            drift: this.performanceApi.getDrift(),
            dataQuality: this.performanceApi.getDataQuality(),
            logs: this.performanceApi.getLogs()
        }).subscribe({
            next: (response) => {
                this.summary = this.isNoData(response.summary) ? null : response.summary;
                this.accuracy = this.isNoData(response.accuracy) ? null : response.accuracy;
                this.roi = this.isNoData(response.roi) ? null : response.roi;
                this.calibration = this.isNoData(response.calibration) ? null : response.calibration;
                this.strategies = this.isNoData(response.strategies) ? null : response.strategies;
                this.markets = this.isNoData(response.markets) ? null : response.markets;
                this.drift = this.isNoData(response.drift) ? null : response.drift;
                this.dataQuality = this.isNoData(response.dataQuality) ? null : response.dataQuality;
                this.performanceLogs = this.isNoData(response.logs) ? [] : response.logs.logs;
                this.empty = !this.summary;
                this.loading = false;
            },
            error: (error) => {
                this.error = error instanceof Error ? error.message : 'Unable to load performance metrics.';
                this.loading = false;
            }
        });
    }
    isNoData(response) {
        return !!response && typeof response === 'object' && 'status' in response && response.status === 'no_data';
    }
    value(value) {
        if (value === null || value === undefined || value === '') {
            return '—';
        }
        return String(value);
    }
    percentValue(value) {
        if (value === null || value === undefined) {
            return '—';
        }
        return `${value}%`;
    }
    logLevel(level) {
        if (level === 'error') {
            return 'danger';
        }
        if (level === 'success' || level === 'warning') {
            return level;
        }
        return 'info';
    }
    static { this.ɵfac = function PerformancePage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PerformancePage)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PerformancePage, selectors: [["ba-performance-page"]], decls: 10, vars: 1, consts: [["eyebrow", "AI Performance", "title", "Model Calibration & Analytics", "subtitle", "M\u00E9triques descriptives et proxys d\u00E9riv\u00E9s des artefacts stricts."], [1, "flex", "flex-wrap", "gap-2"], ["type", "button", "disabled", "", 1, "ba-tool", "border-border/60", "text-muted"], ["type", "button", 1, "ba-tool"], ["label", "Performance API error", 3, "message"], ["label", "No performance data available yet", "message", "Run analyses first. Performance is derived only from strict run artifacts."], [1, "p-4"], ["message", "Loading performance metrics..."], [1, "mb-4", "grid", "gap-3", "lg:grid-cols-3"], [1, "rounded-card", "border", "border-warning/30", "bg-warning/10", "p-3", "text-sm", "text-muted"], [1, "ba-label", "text-warning"], [1, "mt-1"], [1, "rounded-card", "border", "border-accent/30", "bg-accent/10", "p-3", "text-sm", "text-muted"], [1, "ba-label", "text-accent"], [1, "grid", "gap-4", "sm:grid-cols-2", "xl:grid-cols-3", "2xl:grid-cols-6"], [3, "label", "value", "status", "tone"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-2"], ["label", "Confidence tiers", "title", "Candidate distribution", "caption", "Proxy distribution from aggregation candidates or match_analysis-derived candidates.", 3, "value", "points"], ["label", "Data quality", "title", "Input quality distribution", "caption", "Odds coverage and quality are descriptive, not outcome-based.", 3, "value", "points"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-[1.05fr_0.95fr]"], ["label", "Calibration panel", "title", "Confidence tier \u2192 filtering rate", 3, "metrics"], [1, "ba-card-header", "flex", "items-center", "justify-between", "gap-4"], [1, "ba-label"], [1, "mt-1", "text-sm", "font-semibold", "text-text"], ["tone", "warning", 3, "label"], [1, "grid", "gap-3", "p-4", "sm:grid-cols-3", "xl:grid-cols-1"], [1, "flex", "items-start", "justify-between", "gap-4", "rounded-card", "border", "border-border/60", "bg-background/60", "p-3"], [1, "p-4", "text-sm", "text-muted"], ["title", "Strategy comparison", "subtitle", "Proxy metrics grouped by strategy file/id.", "emptyMessage", "No strategy comparison available.", 3, "columns", "rows"], ["title", "Market performance", "subtitle", "Descriptive candidate metrics by market; no real accuracy/ROI.", "emptyMessage", "No market metrics available.", 3, "columns", "rows"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-[0.85fr_1.15fr]"], [1, "ba-card-header"], [1, "grid", "gap-4", "p-4", "sm:grid-cols-3", "xl:grid-cols-1"], ["label", "Candidates with odds", "status", "proxy", "tone", "warning", 3, "value"], ["label", "Missing odds rejected", "status", "proxy", "tone", "warning", 3, "value"], ["label", "Completed no data", "status", "real run status", "tone", "default", 3, "value"], ["label", "Performance logs", "title", "Analytics caveats", "emptyMessage", "No performance logs available.", 3, "entries"], [1, "ba-data", "mt-2", "text-text"], [1, "mt-1", "text-xs", "text-muted"], [3, "label", "tone"]], template: function PerformancePage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "ba-page-header", 0)(1, "div", 1)(2, "button", 2);
            i0.ɵɵtext(3, " Recalibrate unavailable ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "button", 3);
            i0.ɵɵtext(5, " Export Analytics ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵconditionalCreate(6, PerformancePage_Conditional_6_Template, 3, 0, "ba-section-card")(7, PerformancePage_Conditional_7_Template, 1, 1, "ba-error-state", 4)(8, PerformancePage_Conditional_8_Template, 1, 0, "ba-empty-state", 5)(9, PerformancePage_Conditional_9_Template, 51, 18);
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵconditional(ctx.loading ? 6 : ctx.error ? 7 : ctx.empty ? 8 : 9);
        } }, dependencies: [CalibrationPanelComponent,
            ChartCardComponent,
            DataTableComponent,
            EmptyStateComponent,
            ErrorStateComponent,
            KpiCardComponent,
            LoadingStateComponent,
            LogConsoleComponent,
            PageHeaderComponent,
            SectionCardComponent,
            StatusBadgeComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PerformancePage, [{
        type: Component,
        args: [{
                selector: 'ba-performance-page',
                standalone: true,
                imports: [
                    CalibrationPanelComponent,
                    ChartCardComponent,
                    DataTableComponent,
                    EmptyStateComponent,
                    ErrorStateComponent,
                    KpiCardComponent,
                    LoadingStateComponent,
                    LogConsoleComponent,
                    PageHeaderComponent,
                    SectionCardComponent,
                    StatusBadgeComponent
                ],
                template: `
    <ba-page-header
      eyebrow="AI Performance"
      title="Model Calibration & Analytics"
      subtitle="Métriques descriptives et proxys dérivés des artefacts stricts."
    >
      <div class="flex flex-wrap gap-2">
        <button type="button" class="ba-tool border-border/60 text-muted" disabled>
          Recalibrate unavailable
        </button>
        <button type="button" class="ba-tool">
          Export Analytics
        </button>
      </div>
    </ba-page-header>

    @if (loading) {
      <ba-section-card>
        <div class="p-4">
          <ba-loading-state message="Loading performance metrics..."></ba-loading-state>
        </div>
      </ba-section-card>
    } @else if (error) {
      <ba-error-state label="Performance API error" [message]="error"></ba-error-state>
    } @else if (empty) {
      <ba-empty-state
        label="No performance data available yet"
        message="Run analyses first. Performance is derived only from strict run artifacts."
      ></ba-empty-state>
    } @else {
      <section class="mb-4 grid gap-3 lg:grid-cols-3">
        <div class="rounded-card border border-warning/30 bg-warning/10 p-3 text-sm text-muted">
          <p class="ba-label text-warning">Outcome-based accuracy not available yet</p>
          <p class="mt-1">{{ accuracyMessage }}</p>
        </div>
        <div class="rounded-card border border-warning/30 bg-warning/10 p-3 text-sm text-muted">
          <p class="ba-label text-warning">No real ROI until settlement/results capability exists</p>
          <p class="mt-1">{{ roiMessage }}</p>
        </div>
        <div class="rounded-card border border-accent/30 bg-accent/10 p-3 text-sm text-muted">
          <p class="ba-label text-accent">Proxy calibration</p>
          <p class="mt-1">{{ calibrationMessage }}</p>
        </div>
      </section>

      <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        @for (kpi of kpis; track kpi.label) {
          <ba-kpi-card
            [label]="kpi.label"
            [value]="kpi.value"
            [status]="kpi.status || ''"
            [tone]="kpi.tone || 'default'"
          ></ba-kpi-card>
        }
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-2">
        <ba-chart-card
          label="Confidence tiers"
          title="Candidate distribution"
          [value]="summary ? summary.total_candidates + ' candidates' : '—'"
          caption="Proxy distribution from aggregation candidates or match_analysis-derived candidates."
          [points]="confidenceTierPoints"
        ></ba-chart-card>

        <ba-chart-card
          label="Data quality"
          title="Input quality distribution"
          [value]="dataQuality ? dataQuality.candidates_with_odds_percent + '% with odds' : '—'"
          caption="Odds coverage and quality are descriptive, not outcome-based."
          [points]="dataQualityPoints"
        ></ba-chart-card>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <ba-calibration-panel
          label="Calibration panel"
          title="Confidence tier → filtering rate"
          [metrics]="calibrationMetrics"
        ></ba-calibration-panel>

        <ba-section-card>
          <div class="ba-card-header flex items-center justify-between gap-4">
            <div>
              <p class="ba-label">Drift detection</p>
              <h3 class="mt-1 text-sm font-semibold text-text">Distribution drift proxy</h3>
            </div>
            <ba-status-badge [label]="drift?.status || 'partial'" tone="warning"></ba-status-badge>
          </div>
          <div class="grid gap-3 p-4 sm:grid-cols-3 xl:grid-cols-1">
            @for (signal of driftSignals; track signal.dimension) {
              <div class="flex items-start justify-between gap-4 rounded-card border border-border/60 bg-background/60 p-3">
                <div>
                  <p class="ba-label">{{ signal.dimension }}</p>
                  <p class="ba-data mt-2 text-text">{{ signal.variation_score }}</p>
                  <p class="mt-1 text-xs text-muted">{{ signal.message }}</p>
                </div>
                <ba-status-badge [label]="signal.status" [tone]="signal.status === 'watch' ? 'warning' : 'success'"></ba-status-badge>
              </div>
            } @empty {
              <p class="p-4 text-sm text-muted">{{ drift?.message || 'No drift signal available.' }}</p>
            }
          </div>
        </ba-section-card>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-2">
        <ba-data-table
          title="Strategy comparison"
          subtitle="Proxy metrics grouped by strategy file/id."
          [columns]="strategyColumns"
          [rows]="strategyRows"
          emptyMessage="No strategy comparison available."
        ></ba-data-table>

        <ba-data-table
          title="Market performance"
          subtitle="Descriptive candidate metrics by market; no real accuracy/ROI."
          [columns]="marketColumns"
          [rows]="marketRows"
          emptyMessage="No market metrics available."
        ></ba-data-table>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Data quality</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Artifact health</h3>
          </div>
          <div class="grid gap-4 p-4 sm:grid-cols-3 xl:grid-cols-1">
            <ba-kpi-card
              label="Candidates with odds"
              [value]="dataQuality ? dataQuality.candidates_with_odds_percent + '%' : '—'"
              status="proxy"
              tone="warning"
            ></ba-kpi-card>
            <ba-kpi-card
              label="Missing odds rejected"
              [value]="dataQuality ? dataQuality.missing_odds_rejected_percent + '%' : '—'"
              status="proxy"
              tone="warning"
            ></ba-kpi-card>
            <ba-kpi-card
              label="Completed no data"
              [value]="dataQuality ? dataQuality.completed_no_data_runs_percent + '%' : '—'"
              status="real run status"
              tone="default"
            ></ba-kpi-card>
          </div>
        </ba-section-card>

        <ba-log-console
          label="Performance logs"
          title="Analytics caveats"
          [entries]="logs"
          emptyMessage="No performance logs available."
        ></ba-log-console>
      </section>
    }
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PerformancePage, { className: "PerformancePage", filePath: "src/app/features/performance/performance.page.ts", lineNumber: 215 }); })();
//# sourceMappingURL=performance.page.js.map
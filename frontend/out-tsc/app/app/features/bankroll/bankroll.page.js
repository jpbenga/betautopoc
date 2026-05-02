import { Component, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { BankrollApiService } from '../../core/api/bankroll-api.service';
import { ChartCardComponent } from '../../shared/ui/chart-card/chart-card.component';
import { DataTableComponent } from '../../shared/ui/data-table/data-table.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { LogConsoleComponent } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { RiskCardComponent } from '../../shared/ui/risk-card/risk-card.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.label;
const _forTrack1 = ($index, $item) => $item.key;
const _forTrack2 = ($index, $item) => $item.title + $item.metric;
function BankrollPage_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 5);
    i0.ɵɵelement(1, "ba-loading-state", 7);
    i0.ɵɵelementEnd();
} }
function BankrollPage_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 6);
    i0.ɵɵelement(1, "ba-error-state", 8);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵproperty("message", ctx_r0.error);
} }
function BankrollPage_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 6);
    i0.ɵɵelement(1, "ba-empty-state", 9);
    i0.ɵɵelementEnd();
} }
function BankrollPage_Conditional_11_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-kpi-card", 11);
} if (rf & 2) {
    const kpi_r2 = ctx.$implicit;
    i0.ɵɵproperty("label", kpi_r2.label)("value", kpi_r2.value)("status", kpi_r2.status)("tone", kpi_r2.tone);
} }
function BankrollPage_Conditional_11_For_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 28)(1, "div")(2, "p", 15);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 33);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(6, "ba-status-badge", 17);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const limit_r3 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(limit_r3.key);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate2("", limit_r3.value, " ", limit_r3.unit);
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", limit_r3.status)("tone", ctx_r0.limitTone(limit_r3));
} }
function BankrollPage_Conditional_11_For_38_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 28)(1, "div")(2, "p", 34);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 35);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(6, "ba-status-badge", 17);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const alert_r4 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(alert_r4.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(alert_r4.detail);
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", alert_r4.level)("tone", ctx_r0.alertTone(alert_r4));
} }
function BankrollPage_Conditional_11_ForEmpty_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-status-badge", 30);
} }
function BankrollPage_Conditional_11_Conditional_42_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 32);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.summary == null ? null : ctx_r0.summary.simulation_mode);
} }
function BankrollPage_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 10);
    i0.ɵɵrepeaterCreate(1, BankrollPage_Conditional_11_For_2_Template, 1, 4, "ba-kpi-card", 11, _forTrack0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "section", 12);
    i0.ɵɵelement(4, "ba-chart-card", 13);
    i0.ɵɵelementStart(5, "ba-section-card")(6, "div", 14)(7, "div")(8, "p", 15);
    i0.ɵɵtext(9, "Risk exposure");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(10, "h3", 16);
    i0.ɵɵtext(11, "Current open ticket envelope");
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(12, "ba-status-badge", 17);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(13, "div", 18);
    i0.ɵɵelement(14, "ba-risk-card", 19)(15, "ba-kpi-card", 20)(16, "ba-kpi-card", 21);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(17, "section", 22);
    i0.ɵɵelement(18, "ba-data-table", 23)(19, "ba-data-table", 24);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "section", 25)(21, "ba-section-card")(22, "div", 26)(23, "p", 15);
    i0.ɵɵtext(24, "Risk limits");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(25, "h3", 16);
    i0.ɵɵtext(26, "Simulated guardrails");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(27, "div", 27);
    i0.ɵɵrepeaterCreate(28, BankrollPage_Conditional_11_For_29_Template, 7, 5, "div", 28, _forTrack1);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(30, "ba-section-card")(31, "div", 26)(32, "p", 15);
    i0.ɵɵtext(33, "Alerts");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "h3", 16);
    i0.ɵɵtext(35, "Risk monitoring");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(36, "div", 29);
    i0.ɵɵrepeaterCreate(37, BankrollPage_Conditional_11_For_38_Template, 7, 4, "div", 28, _forTrack2, false, BankrollPage_Conditional_11_ForEmpty_39_Template, 1, 0, "ba-status-badge", 30);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(40, "section", 6);
    i0.ɵɵelement(41, "ba-log-console", 31);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(42, BankrollPage_Conditional_11_Conditional_42_Template, 2, 1, "p", 32);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.kpis);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("value", ctx_r0.formatMoney(ctx_r0.summary == null ? null : ctx_r0.summary.total_bankroll))("points", ctx_r0.bankrollTrend);
    i0.ɵɵadvance(8);
    i0.ɵɵproperty("label", ctx_r0.riskLabel)("tone", ctx_r0.riskTone(ctx_r0.summary == null ? null : ctx_r0.summary.exposure_percent));
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("value", ctx_r0.formatPercent(ctx_r0.summary == null ? null : ctx_r0.summary.exposure_percent))("status", ctx_r0.riskLabel)("tone", ctx_r0.riskTone(ctx_r0.summary == null ? null : ctx_r0.summary.exposure_percent))("exposure", (ctx_r0.summary == null ? null : ctx_r0.summary.exposure_percent) || 0);
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", ctx_r0.formatMoney(ctx_r0.summary == null ? null : ctx_r0.summary.stake_per_ticket));
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", ctx_r0.openPositionsCount);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("columns", ctx_r0.exposureColumns)("rows", ctx_r0.exposureRows);
    i0.ɵɵadvance();
    i0.ɵɵproperty("columns", ctx_r0.activeBetColumns)("rows", ctx_r0.activeBetRows);
    i0.ɵɵadvance(9);
    i0.ɵɵrepeater(ctx_r0.riskLimits);
    i0.ɵɵadvance(9);
    i0.ɵɵrepeater(ctx_r0.alerts);
    i0.ɵɵadvance(4);
    i0.ɵɵproperty("entries", ctx_r0.logs);
    i0.ɵɵadvance();
    i0.ɵɵconditional((ctx_r0.summary == null ? null : ctx_r0.summary.simulation_mode) ? 42 : -1);
} }
export class BankrollPage {
    constructor() {
        this.bankrollApi = inject(BankrollApiService);
        this.isLoading = true;
        this.error = '';
        this.isNoData = false;
        this.summary = null;
        this.trend = null;
        this.exposure = [];
        this.positions = [];
        this.riskLimits = [];
        this.alerts = [];
        this.exposureColumns = [
            { key: 'ticket', label: 'Ticket' },
            { key: 'exposure', label: 'Exposure', align: 'right', data: true },
            { key: 'bankroll', label: '% bankroll', align: 'right', data: true },
            { key: 'risk', label: 'Risk' }
        ];
        this.activeBetColumns = [
            { key: 'ticket', label: 'Ticket' },
            { key: 'stake', label: 'Stake', align: 'right', data: true },
            { key: 'odds', label: 'Odds', align: 'right', data: true },
            { key: 'return', label: 'Potential Return', align: 'right', data: true },
            { key: 'result', label: 'Result' }
        ];
    }
    ngOnInit() {
        this.loadBankroll();
    }
    loadBankroll() {
        this.isLoading = true;
        this.error = '';
        this.isNoData = false;
        forkJoin({
            summary: this.bankrollApi.getSummary(),
            trend: this.bankrollApi.getTrend('7d'),
            exposure: this.bankrollApi.getExposure(),
            positions: this.bankrollApi.getOpenPositions(),
            limits: this.bankrollApi.getRiskLimits(),
            alerts: this.bankrollApi.getAlerts()
        }).subscribe({
            next: ({ summary, trend, exposure, positions, limits, alerts }) => {
                if (this.noData(summary) || this.noData(exposure) || this.noData(positions)) {
                    this.isNoData = true;
                    this.isLoading = false;
                    return;
                }
                this.summary = summary;
                this.trend = this.noData(trend) ? null : trend;
                this.exposure = exposure.items;
                this.positions = positions.positions;
                this.riskLimits = limits.limits;
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
            { label: 'Total bankroll', value: this.formatMoney(this.summary?.total_bankroll), status: 'Simulated', tone: 'default' },
            { label: 'Available capital', value: this.formatMoney(this.summary?.available_capital), status: 'After exposure', tone: 'success' },
            { label: 'Active exposure', value: this.formatMoney(this.summary?.total_exposure), status: this.riskLabel, tone: this.riskTone(this.summary?.exposure_percent) },
            { label: 'Simulated P&L', value: this.formatMoney(this.summary?.simulated_pnl), status: 'No result', tone: 'default' },
            { label: 'ROI estimate', value: this.formatPercent(this.summary?.estimated_roi), status: 'Neutral', tone: 'default' },
            { label: 'Open positions', value: String(this.summary?.open_positions_count || 0), status: 'Tickets', tone: 'warning' }
        ];
    }
    get bankrollTrend() {
        return (this.trend?.points || []).map((point) => ({
            label: point.date.slice(5),
            value: point.bankroll
        }));
    }
    get exposureRows() {
        return this.exposure.map((item) => ({
            cells: {
                ticket: item.ticket_id,
                exposure: this.formatMoney(item.exposure),
                bankroll: this.formatPercent(item.bankroll_percent),
                risk: item.risk_level || '—'
            },
            status: item.risk_level || 'open',
            statusTone: this.riskLevelTone(item.risk_level)
        }));
    }
    get activeBetRows() {
        return this.positions.map((position) => ({
            cells: {
                ticket: position.ticket_id,
                stake: this.formatMoney(position.stake),
                odds: this.formatOdds(position.estimated_odds),
                return: this.formatMoney(position.potential_return),
                result: position.result_status
            },
            status: position.status,
            statusTone: 'live'
        }));
    }
    get logs() {
        const entries = [
            { time: '01', level: 'info', message: `[risk] simulated positions loaded: ${this.positions.length}` },
            { time: '02', level: 'info', message: `[risk] fixed stake per ticket: ${this.formatMoney(this.summary?.stake_per_ticket)}` },
            { time: '03', level: this.alerts.length ? 'warning' : 'success', message: `[risk] alerts: ${this.alerts.length}` }
        ];
        return entries;
    }
    get riskLabel() {
        const exposure = this.summary?.exposure_percent || 0;
        if (exposure >= 40) {
            return 'High';
        }
        if (exposure >= 25) {
            return 'Medium';
        }
        return 'Low';
    }
    get openPositionsCount() {
        return String(this.summary?.open_positions_count || 0);
    }
    riskTone(value) {
        const exposure = value || 0;
        if (exposure >= 40) {
            return 'danger';
        }
        if (exposure >= 25) {
            return 'warning';
        }
        return 'success';
    }
    riskLevelTone(risk) {
        const normalized = String(risk || '').toLowerCase();
        if (normalized === 'high') {
            return 'danger';
        }
        if (normalized === 'medium') {
            return 'warning';
        }
        if (normalized === 'low') {
            return 'success';
        }
        return 'default';
    }
    alertTone(alert) {
        if (alert.level === 'danger' || alert.level === 'error') {
            return 'danger';
        }
        if (alert.level === 'warning') {
            return 'warning';
        }
        return 'default';
    }
    limitTone(limit) {
        if (limit.status === 'armed' || limit.status === 'watch') {
            return 'warning';
        }
        if (limit.status === 'active') {
            return 'success';
        }
        return 'default';
    }
    formatMoney(value) {
        const amount = typeof value === 'number' && Number.isFinite(value) ? value : 0;
        return `${amount.toFixed(2)} €`;
    }
    formatPercent(value) {
        const amount = typeof value === 'number' && Number.isFinite(value) ? value : 0;
        return `${amount.toFixed(1)}%`;
    }
    formatOdds(value) {
        return typeof value === 'number' && Number.isFinite(value) ? value.toFixed(2) : '—';
    }
    noData(value) {
        return Boolean(value && typeof value === 'object' && 'status' in value && value.status === 'no_data');
    }
    errorMessage(error) {
        if (error && typeof error === 'object' && 'message' in error) {
            return String(error.message || 'Unexpected bankroll API error.');
        }
        return 'Unexpected bankroll API error.';
    }
    static { this.ɵfac = function BankrollPage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || BankrollPage)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: BankrollPage, selectors: [["ba-bankroll-page"]], decls: 12, vars: 1, consts: [["eyebrow", "Risk & Capital", "title", "Bankroll & Risk Management", "subtitle", "Suivi du capital, de l\u2019exposition et des limites de risque du syst\u00E8me."], [1, "flex", "flex-wrap", "gap-2"], ["type", "button", 1, "ba-tool", "border-accent/60", "bg-accent", "text-background", "hover:bg-accent-strong", 3, "click"], ["type", "button", 1, "ba-tool"], [1, "mt-4", "rounded-card", "border", "border-warning/30", "bg-warning/10", "p-4", "text-sm", "text-warning"], [1, "mt-4", "rounded-card", "border", "border-border", "bg-surface-low", "p-4"], [1, "mt-4"], ["message", "Loading simulated bankroll from run artifacts..."], ["label", "Bankroll API error", 3, "message"], ["label", "No bankroll data available yet", "message", "No ticket positions were found in data/orchestrator_runs. Complete an orchestrated selection run first."], [1, "mt-4", "grid", "gap-4", "sm:grid-cols-2", "xl:grid-cols-3", "2xl:grid-cols-6"], [3, "label", "value", "status", "tone"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-[1.15fr_0.85fr]"], ["label", "Bankroll evolution", "title", "7-day simulated capital curve", "caption", "Neutral simulation: no real win/loss result is inferred.", 3, "value", "points"], [1, "ba-card-header", "flex", "items-center", "justify-between", "gap-4"], [1, "ba-label"], [1, "mt-1", "text-sm", "font-semibold", "text-text"], [3, "label", "tone"], [1, "grid", "gap-4", "p-4", "md:grid-cols-3", "xl:grid-cols-1"], ["label", "Exposure %", "description", "Open tickets reserve fixed simulated stake only.", 3, "value", "status", "tone", "exposure"], ["label", "Stake per ticket", "status", "Fixed", "tone", "default", 3, "value"], ["label", "Open positions", "status", "Simulated", "tone", "warning", 3, "value"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-[1fr_1fr]"], ["title", "Exposure by ticket", "subtitle", "Every ticket with picks becomes one simulated open position.", 3, "columns", "rows"], ["title", "Open positions", "subtitle", "No result is inferred; positions remain no_result.", 3, "columns", "rows"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-[0.9fr_1.1fr]"], [1, "ba-card-header"], [1, "grid", "gap-3", "p-4", "sm:grid-cols-2", "xl:grid-cols-1"], [1, "flex", "items-start", "justify-between", "gap-4", "rounded-card", "border", "border-border/60", "bg-background/60", "p-3"], [1, "space-y-3", "p-4"], ["label", "no alerts", "tone", "success"], ["label", "Risk logs", "title", "Bankroll simulation events", 3, "entries"], [1, "mt-4", "text-xs", "text-muted"], [1, "ba-data", "mt-2", "text-text"], [1, "text-sm", "font-medium", "text-text"], [1, "mt-1", "text-xs", "text-muted"]], template: function BankrollPage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "ba-page-header", 0)(1, "div", 1)(2, "button", 2);
            i0.ɵɵlistener("click", function BankrollPage_Template_button_click_2_listener() { return ctx.loadBankroll(); });
            i0.ɵɵtext(3, " Refresh ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "button", 3);
            i0.ɵɵtext(5, " View History ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(6, "div", 4);
            i0.ɵɵtext(7, " Simulated bankroll (no real bets) ");
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(8, BankrollPage_Conditional_8_Template, 2, 0, "section", 5)(9, BankrollPage_Conditional_9_Template, 2, 1, "section", 6)(10, BankrollPage_Conditional_10_Template, 2, 0, "section", 6)(11, BankrollPage_Conditional_11_Template, 43, 17);
        } if (rf & 2) {
            i0.ɵɵadvance(8);
            i0.ɵɵconditional(ctx.isLoading ? 8 : ctx.error ? 9 : ctx.isNoData ? 10 : 11);
        } }, dependencies: [ChartCardComponent,
            DataTableComponent,
            EmptyStateComponent,
            ErrorStateComponent,
            KpiCardComponent,
            LoadingStateComponent,
            LogConsoleComponent,
            PageHeaderComponent,
            RiskCardComponent,
            SectionCardComponent,
            StatusBadgeComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(BankrollPage, [{
        type: Component,
        args: [{
                selector: 'ba-bankroll-page',
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
                    RiskCardComponent,
                    SectionCardComponent,
                    StatusBadgeComponent
                ],
                template: `
    <ba-page-header
      eyebrow="Risk & Capital"
      title="Bankroll & Risk Management"
      subtitle="Suivi du capital, de l’exposition et des limites de risque du système."
    >
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="ba-tool border-accent/60 bg-accent text-background hover:bg-accent-strong"
          (click)="loadBankroll()"
        >
          Refresh
        </button>
        <button type="button" class="ba-tool">
          View History
        </button>
      </div>
    </ba-page-header>

    <div class="mt-4 rounded-card border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
      Simulated bankroll (no real bets)
    </div>

    @if (isLoading) {
      <section class="mt-4 rounded-card border border-border bg-surface-low p-4">
        <ba-loading-state message="Loading simulated bankroll from run artifacts..."></ba-loading-state>
      </section>
    } @else if (error) {
      <section class="mt-4">
        <ba-error-state label="Bankroll API error" [message]="error"></ba-error-state>
      </section>
    } @else if (isNoData) {
      <section class="mt-4">
        <ba-empty-state
          label="No bankroll data available yet"
          message="No ticket positions were found in data/orchestrator_runs. Complete an orchestrated selection run first."
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

      <section class="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <ba-chart-card
          label="Bankroll evolution"
          title="7-day simulated capital curve"
          [value]="formatMoney(summary?.total_bankroll)"
          caption="Neutral simulation: no real win/loss result is inferred."
          [points]="bankrollTrend"
        ></ba-chart-card>

        <ba-section-card>
          <div class="ba-card-header flex items-center justify-between gap-4">
            <div>
              <p class="ba-label">Risk exposure</p>
              <h3 class="mt-1 text-sm font-semibold text-text">Current open ticket envelope</h3>
            </div>
            <ba-status-badge [label]="riskLabel" [tone]="riskTone(summary?.exposure_percent)"></ba-status-badge>
          </div>
          <div class="grid gap-4 p-4 md:grid-cols-3 xl:grid-cols-1">
            <ba-risk-card
              label="Exposure %"
              [value]="formatPercent(summary?.exposure_percent)"
              [status]="riskLabel"
              [tone]="riskTone(summary?.exposure_percent)"
              [exposure]="summary?.exposure_percent || 0"
              description="Open tickets reserve fixed simulated stake only."
            ></ba-risk-card>
            <ba-kpi-card label="Stake per ticket" [value]="formatMoney(summary?.stake_per_ticket)" status="Fixed" tone="default"></ba-kpi-card>
            <ba-kpi-card label="Open positions" [value]="openPositionsCount" status="Simulated" tone="warning"></ba-kpi-card>
          </div>
        </ba-section-card>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <ba-data-table
          title="Exposure by ticket"
          subtitle="Every ticket with picks becomes one simulated open position."
          [columns]="exposureColumns"
          [rows]="exposureRows"
        ></ba-data-table>

        <ba-data-table
          title="Open positions"
          subtitle="No result is inferred; positions remain no_result."
          [columns]="activeBetColumns"
          [rows]="activeBetRows"
        ></ba-data-table>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Risk limits</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Simulated guardrails</h3>
          </div>
          <div class="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-1">
            @for (limit of riskLimits; track limit.key) {
              <div class="flex items-start justify-between gap-4 rounded-card border border-border/60 bg-background/60 p-3">
                <div>
                  <p class="ba-label">{{ limit.key }}</p>
                  <p class="ba-data mt-2 text-text">{{ limit.value }} {{ limit.unit }}</p>
                </div>
                <ba-status-badge [label]="limit.status" [tone]="limitTone(limit)"></ba-status-badge>
              </div>
            }
          </div>
        </ba-section-card>

        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Alerts</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Risk monitoring</h3>
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

      <section class="mt-4">
        <ba-log-console
          label="Risk logs"
          title="Bankroll simulation events"
          [entries]="logs"
        ></ba-log-console>
      </section>

      @if (summary?.simulation_mode) {
        <p class="mt-4 text-xs text-muted">{{ summary?.simulation_mode }}</p>
      }
    }
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(BankrollPage, { className: "BankrollPage", filePath: "src/app/features/bankroll/bankroll.page.ts", lineNumber: 208 }); })();
//# sourceMappingURL=bankroll.page.js.map
import { Component } from '@angular/core';
import { AgentCardComponent } from '../../shared/ui/agent-card/agent-card.component';
import { ChartCardComponent } from '../../shared/ui/chart-card/chart-card.component';
import { DataTableComponent } from '../../shared/ui/data-table/data-table.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LogConsoleComponent } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { QuotaGaugeComponent } from '../../shared/ui/quota-gauge/quota-gauge.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';
import { TicketCardComponent } from '../../shared/ui/ticket-card/ticket-card.component';
import { TimelineComponent } from '../../shared/ui/timeline/timeline.component';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.label;
const _forTrack1 = ($index, $item) => $item.name;
function OverviewPage_For_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-kpi-card", 5);
} if (rf & 2) {
    const kpi_r1 = ctx.$implicit;
    i0.ɵɵproperty("label", kpi_r1.label)("value", kpi_r1.value)("status", kpi_r1.status || "")("tone", kpi_r1.tone || "default")("delta", kpi_r1.delta || "")("deltaTone", kpi_r1.deltaTone || "muted");
} }
function OverviewPage_For_37_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-agent-card", 23);
} if (rf & 2) {
    const agent_r2 = ctx.$implicit;
    i0.ɵɵproperty("name", agent_r2.name)("role", agent_r2.role)("status", agent_r2.status)("tone", agent_r2.tone)("currentJob", agent_r2.currentJob)("lastEvent", agent_r2.lastEvent);
} }
export class OverviewPage {
    constructor() {
        this.kpis = [
            { label: 'Bankroll', value: '2 500 €', status: 'Stable', tone: 'success' },
            { label: 'P&L today', value: '+48 €', status: 'Positive', tone: 'success', delta: '+1.9%', deltaTone: 'success' },
            { label: 'ROI global', value: '6.8 %', status: 'Tracked', tone: 'default', delta: '30d window', deltaTone: 'muted' },
            { label: 'Active run', value: '1', status: 'Live', tone: 'live' },
            { label: 'OpenAI cost today', value: '3.42 €', status: 'Budget OK', tone: 'success', delta: '17% used', deltaTone: 'muted' },
            { label: 'API-Football quota', value: '1 284 / 7 500', status: 'Healthy', tone: 'success' }
        ];
        this.pipelineItems = [
            { title: 'Strategy loaded', meta: '09:12', description: 'Core bankroll and market filters loaded.', tone: 'success' },
            { title: 'Analysis context built', meta: '09:13', description: 'Fixtures, odds and context normalized.', tone: 'success' },
            { title: 'Match analysis completed', meta: '09:16', description: '5 matches analyzed by the AI engine.', tone: 'success' },
            { title: 'Selection completed', meta: '09:18', description: '2 picks selected for the draft ticket.', tone: 'success' },
            { title: 'Browser Use skipped', meta: '09:18', description: 'Operator review required before browser automation.', tone: 'warning' }
        ];
        this.costTrend = [
            { label: 'Mon', value: 2.1 },
            { label: 'Tue', value: 2.8 },
            { label: 'Wed', value: 3.4 },
            { label: 'Thu', value: 2.9 },
            { label: 'Fri', value: 3.42 }
        ];
        this.agents = [
            {
                name: 'Analysis Agent',
                role: 'AI analysis',
                status: 'Completed',
                tone: 'success',
                currentJob: 'No active job',
                lastEvent: '5 matches analyzed'
            },
            {
                name: 'Selection Agent',
                role: 'Pick selection',
                status: 'Completed',
                tone: 'success',
                currentJob: 'Draft ticket ready',
                lastEvent: '2 picks selected'
            },
            {
                name: 'Browser Agent',
                role: 'Browser-use',
                status: 'Idle',
                tone: 'default',
                currentJob: 'Awaiting operator approval',
                lastEvent: 'Browser Use skipped'
            },
            {
                name: 'Strategy Engine',
                role: 'Execution core',
                status: 'Active',
                tone: 'live',
                currentJob: 'Monitoring next scheduled run',
                lastEvent: 'Strategy loaded'
            }
        ];
        this.logs = [
            { time: '09:12', level: 'info', message: 'strategy loaded' },
            { time: '09:13', level: 'success', message: 'context built' },
            { time: '09:16', level: 'success', message: '5 matches analyzed' },
            { time: '09:18', level: 'success', message: '2 picks selected' },
            { time: '09:18', level: 'warning', message: 'browser skipped' }
        ];
        this.runColumns = [
            { key: 'date', label: 'Date', data: true },
            { key: 'strategy', label: 'Strategy' },
            { key: 'matches', label: 'Matches', align: 'right', data: true },
            { key: 'picks', label: 'Picks', align: 'right', data: true },
            { key: 'odds', label: 'Odds', align: 'right', data: true }
        ];
        this.runRows = [
            {
                cells: { date: '2026-04-28 09:18', strategy: 'Core value v1', matches: 5, picks: 2, odds: '3.06' },
                status: 'Proposed',
                statusTone: 'warning'
            },
            {
                cells: { date: '2026-04-27 21:40', strategy: 'Conservative away filter', matches: 8, picks: 1, odds: '1.82' },
                status: 'Completed',
                statusTone: 'success'
            },
            {
                cells: { date: '2026-04-27 18:05', strategy: 'Totals scanner', matches: 12, picks: 3, odds: '4.44' },
                status: 'Completed',
                statusTone: 'success'
            },
            {
                cells: { date: '2026-04-27 13:22', strategy: 'High-confidence singles', matches: 6, picks: 0, odds: '-' },
                status: 'Skipped',
                statusTone: 'default'
            }
        ];
    }
    static { this.ɵfac = function OverviewPage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || OverviewPage)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: OverviewPage, selectors: [["ba-overview-page"]], decls: 41, vars: 9, consts: [["eyebrow", "BetAuto Cockpit", "title", "Operations Overview", "subtitle", "Vue consolid\u00E9e du moteur IA, des runs, tickets et co\u00FBts."], [1, "flex", "flex-wrap", "gap-2"], ["type", "button", 1, "ba-tool", "border-accent/60", "bg-accent", "text-background", "hover:bg-accent-strong"], ["type", "button", 1, "ba-tool"], [1, "grid", "gap-4", "sm:grid-cols-2", "xl:grid-cols-3", "2xl:grid-cols-6"], [3, "label", "value", "status", "tone", "delta", "deltaTone"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-[1.1fr_0.9fr]"], [1, "ba-card-header", "flex", "flex-col", "gap-3", "sm:flex-row", "sm:items-center", "sm:justify-between"], [1, "ba-label"], [1, "mt-1", "text-sm", "font-semibold", "text-text"], ["label", "Active run", "tone", "live"], ["label", "Browser skipped", "tone", "warning"], [1, "p-4"], [3, "items"], ["title", "2-pick AI ticket", "market", "Draft / medium risk", "status", "Proposed", "tone", "warning", "odds", "3.06", "confidence", "80%", "stake", "Risk medium", "summary", "Draft ticket with 2 selected picks. Estimated odds are ready for operator review."], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-[0.85fr_1.15fr]"], [1, "grid", "gap-4", "md:grid-cols-2", "xl:grid-cols-1"], ["label", "API-Football quota", "caption", "Daily provider usage.", 3, "used", "limit"], ["label", "OpenAI daily budget", "caption", "Spend guardrail for today's run window.", 3, "used", "limit"], ["label", "Usage / Costs", "title", "OpenAI cost trend", "value", "3.42 \u20AC", "caption", "Mocked daily cost trend for cockpit layout validation.", 3, "points"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-[1fr_1fr]"], [1, "ba-card-header"], [1, "grid", "gap-4", "p-4", "md:grid-cols-2"], [3, "name", "role", "status", "tone", "currentJob", "lastEvent"], ["label", "Recent logs", "title", "Run telemetry", 3, "entries"], [1, "mt-4"], ["title", "Recent runs", "subtitle", "Mocked operational history for the cockpit overview.", 3, "columns", "rows"]], template: function OverviewPage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "ba-page-header", 0)(1, "div", 1)(2, "button", 2);
            i0.ɵɵtext(3, " Run Strategy ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "button", 3);
            i0.ɵɵtext(5, " View Logs ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(6, "section", 4);
            i0.ɵɵrepeaterCreate(7, OverviewPage_For_8_Template, 1, 6, "ba-kpi-card", 5, _forTrack0);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "section", 6)(10, "ba-section-card")(11, "div", 7)(12, "div")(13, "p", 8);
            i0.ɵɵtext(14, "Live pipeline");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "h3", 9);
            i0.ɵɵtext(16, "Run BA-RUN-0428-01");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(17, "div", 1);
            i0.ɵɵelement(18, "ba-status-badge", 10)(19, "ba-status-badge", 11);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(20, "div", 12);
            i0.ɵɵelement(21, "ba-timeline", 13);
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(22, "ba-ticket-card", 14);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(23, "section", 15)(24, "div", 16);
            i0.ɵɵelement(25, "ba-quota-gauge", 17)(26, "ba-quota-gauge", 18);
            i0.ɵɵelementEnd();
            i0.ɵɵelement(27, "ba-chart-card", 19);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(28, "section", 20)(29, "ba-section-card")(30, "div", 21)(31, "p", 8);
            i0.ɵɵtext(32, "Live agents");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(33, "h3", 9);
            i0.ɵɵtext(34, "Execution status");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(35, "div", 22);
            i0.ɵɵrepeaterCreate(36, OverviewPage_For_37_Template, 1, 6, "ba-agent-card", 23, _forTrack1);
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(38, "ba-log-console", 24);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(39, "section", 25);
            i0.ɵɵelement(40, "ba-data-table", 26);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(7);
            i0.ɵɵrepeater(ctx.kpis);
            i0.ɵɵadvance(14);
            i0.ɵɵproperty("items", ctx.pipelineItems);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("used", 1284)("limit", 7500);
            i0.ɵɵadvance();
            i0.ɵɵproperty("used", 3.42)("limit", 20);
            i0.ɵɵadvance();
            i0.ɵɵproperty("points", ctx.costTrend);
            i0.ɵɵadvance(9);
            i0.ɵɵrepeater(ctx.agents);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("entries", ctx.logs);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("columns", ctx.runColumns)("rows", ctx.runRows);
        } }, dependencies: [AgentCardComponent,
            ChartCardComponent,
            DataTableComponent,
            KpiCardComponent,
            LogConsoleComponent,
            PageHeaderComponent,
            QuotaGaugeComponent,
            SectionCardComponent,
            StatusBadgeComponent,
            TicketCardComponent,
            TimelineComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(OverviewPage, [{
        type: Component,
        args: [{
                selector: 'ba-overview-page',
                standalone: true,
                imports: [
                    AgentCardComponent,
                    ChartCardComponent,
                    DataTableComponent,
                    KpiCardComponent,
                    LogConsoleComponent,
                    PageHeaderComponent,
                    QuotaGaugeComponent,
                    SectionCardComponent,
                    StatusBadgeComponent,
                    TicketCardComponent,
                    TimelineComponent
                ],
                template: `
    <ba-page-header
      eyebrow="BetAuto Cockpit"
      title="Operations Overview"
      subtitle="Vue consolidée du moteur IA, des runs, tickets et coûts."
    >
      <div class="flex flex-wrap gap-2">
        <button type="button" class="ba-tool border-accent/60 bg-accent text-background hover:bg-accent-strong">
          Run Strategy
        </button>
        <button type="button" class="ba-tool">
          View Logs
        </button>
      </div>
    </ba-page-header>

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
      @for (kpi of kpis; track kpi.label) {
        <ba-kpi-card
          [label]="kpi.label"
          [value]="kpi.value"
          [status]="kpi.status || ''"
          [tone]="kpi.tone || 'default'"
          [delta]="kpi.delta || ''"
          [deltaTone]="kpi.deltaTone || 'muted'"
        ></ba-kpi-card>
      }
    </section>

    <section class="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <ba-section-card>
        <div class="ba-card-header flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="ba-label">Live pipeline</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Run BA-RUN-0428-01</h3>
          </div>
          <div class="flex flex-wrap gap-2">
            <ba-status-badge label="Active run" tone="live"></ba-status-badge>
            <ba-status-badge label="Browser skipped" tone="warning"></ba-status-badge>
          </div>
        </div>
        <div class="p-4">
          <ba-timeline [items]="pipelineItems"></ba-timeline>
        </div>
      </ba-section-card>

      <ba-ticket-card
        title="2-pick AI ticket"
        market="Draft / medium risk"
        status="Proposed"
        tone="warning"
        odds="3.06"
        confidence="80%"
        stake="Risk medium"
        summary="Draft ticket with 2 selected picks. Estimated odds are ready for operator review."
      ></ba-ticket-card>
    </section>

    <section class="mt-4 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
        <ba-quota-gauge
          label="API-Football quota"
          [used]="1284"
          [limit]="7500"
          caption="Daily provider usage."
        ></ba-quota-gauge>
        <ba-quota-gauge
          label="OpenAI daily budget"
          [used]="3.42"
          [limit]="20"
          caption="Spend guardrail for today's run window."
        ></ba-quota-gauge>
      </div>

      <ba-chart-card
        label="Usage / Costs"
        title="OpenAI cost trend"
        value="3.42 €"
        caption="Mocked daily cost trend for cockpit layout validation."
        [points]="costTrend"
      ></ba-chart-card>
    </section>

    <section class="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
      <ba-section-card>
        <div class="ba-card-header">
          <p class="ba-label">Live agents</p>
          <h3 class="mt-1 text-sm font-semibold text-text">Execution status</h3>
        </div>
        <div class="grid gap-4 p-4 md:grid-cols-2">
          @for (agent of agents; track agent.name) {
            <ba-agent-card
              [name]="agent.name"
              [role]="agent.role"
              [status]="agent.status"
              [tone]="agent.tone"
              [currentJob]="agent.currentJob"
              [lastEvent]="agent.lastEvent"
            ></ba-agent-card>
          }
        </div>
      </ba-section-card>

      <ba-log-console
        label="Recent logs"
        title="Run telemetry"
        [entries]="logs"
      ></ba-log-console>
    </section>

    <section class="mt-4">
      <ba-data-table
        title="Recent runs"
        subtitle="Mocked operational history for the cockpit overview."
        [columns]="runColumns"
        [rows]="runRows"
      ></ba-data-table>
    </section>
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(OverviewPage, { className: "OverviewPage", filePath: "src/app/features/overview/overview.page.ts", lineNumber: 168 }); })();
//# sourceMappingURL=overview.page.js.map
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
import { TimelineComponent } from '../../shared/ui/timeline/timeline.component';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.label;
const _forTrack1 = ($index, $item) => $item.name;
function LiveOperationsPage_For_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-kpi-card", 5);
} if (rf & 2) {
    const kpi_r1 = ctx.$implicit;
    i0.ɵɵproperty("label", kpi_r1.label)("value", kpi_r1.value)("status", kpi_r1.status || "")("tone", kpi_r1.tone || "default")("delta", kpi_r1.delta || "")("deltaTone", kpi_r1.deltaTone || "muted");
} }
function LiveOperationsPage_For_53_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 23)(1, "div")(2, "p", 37);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 38);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(6, "ba-status-badge", 39);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const alert_r2 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(alert_r2.label);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(alert_r2.detail);
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", alert_r2.tone === "success" ? "OK" : alert_r2.tone)("tone", alert_r2.tone);
} }
function LiveOperationsPage_For_63_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-agent-card", 26);
} if (rf & 2) {
    const agent_r3 = ctx.$implicit;
    i0.ɵɵproperty("name", agent_r3.name)("role", agent_r3.role)("status", agent_r3.status)("tone", agent_r3.tone)("currentJob", agent_r3.currentJob)("lastEvent", agent_r3.lastEvent);
} }
export class LiveOperationsPage {
    constructor() {
        this.kpis = [
            { label: 'Active agents', value: '4', status: 'Live', tone: 'live' },
            { label: 'Running jobs', value: '1', status: 'Running', tone: 'live' },
            { label: 'Queue depth', value: '7', status: 'Normal', tone: 'default' },
            { label: 'Last run duration', value: '2m 43s', status: 'Healthy', tone: 'success' },
            { label: 'Error rate', value: '0.8 %', status: 'Low', tone: 'success', delta: '-0.2%', deltaTone: 'success' },
            { label: 'API latency', value: '420 ms', status: 'Watch', tone: 'warning' }
        ];
        this.pipelineItems = [
            { title: 'Strategy loaded', meta: 'completed', description: 'default_football_balanced loaded for target date.', tone: 'success' },
            { title: 'Context builder', meta: 'completed', description: 'API-Football context built and normalized.', tone: 'success' },
            { title: 'Match analysis', meta: 'running', description: 'Active analysis job is processing match candidates.', tone: 'live' },
            { title: 'Selection engine', meta: 'pending', description: 'Waiting for analysis outputs.', tone: 'default' },
            { title: 'Browser Use', meta: 'skipped', description: 'Disabled in orchestrator mode.', tone: 'warning' }
        ];
        this.agents = [
            {
                name: 'Strategy Engine',
                role: 'Run orchestration',
                status: 'Active',
                tone: 'live',
                currentJob: 'Driving run_81c06778',
                lastEvent: 'Strategy loaded'
            },
            {
                name: 'Context Builder',
                role: 'Data preparation',
                status: 'Completed',
                tone: 'success',
                currentJob: 'No active job',
                lastEvent: 'API-Football context built'
            },
            {
                name: 'Match Analysis Agent',
                role: 'AI match analysis',
                status: 'Running',
                tone: 'live',
                currentJob: 'Analyzing match candidates',
                lastEvent: 'match 2 analyzed'
            },
            {
                name: 'Selection Agent',
                role: 'Pick selection',
                status: 'Pending',
                tone: 'default',
                currentJob: 'Waiting for analysis output',
                lastEvent: 'selection pending'
            },
            {
                name: 'Browser Use Agent',
                role: 'Browser automation',
                status: 'Idle',
                tone: 'default',
                currentJob: 'Automation disabled',
                lastEvent: 'browser skipped'
            },
            {
                name: 'Risk Manager',
                role: 'Bankroll guardrails',
                status: 'Watching',
                tone: 'warning',
                currentJob: 'Monitoring exposure',
                lastEvent: 'No critical errors'
            }
        ];
        this.logs = [
            { time: '10:04', level: 'info', message: 'strategy loaded' },
            { time: '10:05', level: 'success', message: 'API-Football context built' },
            { time: '10:06', level: 'success', message: 'match 1 analyzed' },
            { time: '10:07', level: 'success', message: 'match 2 analyzed' },
            { time: '10:07', level: 'success', message: 'OpenAI retry avoided' },
            { time: '10:08', level: 'info', message: 'selection pending' },
            { time: '10:08', level: 'warning', message: 'browser skipped' }
        ];
        this.jobColumns = [
            { key: 'id', label: 'Job ID', data: true },
            { key: 'type', label: 'Type' },
            { key: 'strategy', label: 'Strategy' },
            { key: 'target', label: 'Target', data: true },
            { key: 'eta', label: 'ETA', align: 'right', data: true }
        ];
        this.jobRows = [
            {
                cells: { id: 'run_81c06778', type: 'run active', strategy: 'default_football_balanced', target: '2026-04-25', eta: '01:12' },
                status: 'Running',
                statusTone: 'live'
            },
            {
                cells: { id: 'scan_4217', type: 'scheduled scan', strategy: 'market-refresh', target: 'Ligue 1', eta: '08:00' },
                status: 'Queued',
                statusTone: 'default'
            },
            {
                cells: { id: 'analysis_5520', type: 'retry-safe analysis', strategy: 'balanced', target: '5 matches', eta: '12:30' },
                status: 'Ready',
                statusTone: 'success'
            },
            {
                cells: { id: 'browser_0091', type: 'browser verification skipped', strategy: 'orchestrator-mode', target: 'ticket draft', eta: '-' },
                status: 'Skipped',
                statusTone: 'warning'
            }
        ];
        this.latencyTrend = [
            { label: 'T-5', value: 390 },
            { label: 'T-4', value: 410 },
            { label: 'T-3', value: 438 },
            { label: 'T-2', value: 416 },
            { label: 'Now', value: 420 }
        ];
        this.retryTrend = [
            { label: 'Context', value: 0 },
            { label: 'M1', value: 1 },
            { label: 'M2', value: 0 },
            { label: 'Select', value: 0 },
            { label: 'Browser', value: 0 }
        ];
        this.alerts = [
            {
                label: 'Selection output validated',
                detail: 'Schema and confidence thresholds passed.',
                tone: 'success'
            },
            {
                label: 'Browser Use disabled in orchestrator mode',
                detail: 'Automation will remain idle until explicitly enabled.',
                tone: 'warning'
            },
            {
                label: 'API quota healthy',
                detail: 'API-Football usage remains below daily guardrails.',
                tone: 'success'
            },
            {
                label: 'No critical errors',
                detail: 'Error rate is below the operational threshold.',
                tone: 'success'
            }
        ];
    }
    static { this.ɵfac = function LiveOperationsPage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LiveOperationsPage)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: LiveOperationsPage, selectors: [["ba-live-operations-page"]], decls: 74, vars: 10, consts: [["eyebrow", "Live Operations", "title", "Active Agents", "subtitle", "Suivi temps r\u00E9el des agents IA, runs actifs, logs op\u00E9rationnels et \u00E9tat du pipeline."], [1, "flex", "flex-wrap", "gap-2"], ["type", "button", 1, "ba-tool", "border-accent/60", "bg-accent", "text-background", "hover:bg-accent-strong"], ["type", "button", 1, "ba-tool", "border-warning/40", "text-warning", "hover:bg-warning/10"], [1, "grid", "gap-4", "sm:grid-cols-2", "xl:grid-cols-3", "2xl:grid-cols-6"], [3, "label", "value", "status", "tone", "delta", "deltaTone"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-[1.15fr_0.85fr]"], [1, "ba-card-header", "flex", "flex-col", "gap-3", "lg:flex-row", "lg:items-center", "lg:justify-between"], [1, "ba-label"], [1, "mt-1", "text-sm", "font-semibold", "text-text"], ["label", "running", "tone", "live"], ["label", "60% progress", "tone", "default"], [1, "grid", "gap-4", "p-4", "lg:grid-cols-[0.7fr_1.3fr]"], [1, "rounded-card", "border", "border-border/60", "bg-background/60", "p-4"], [1, "space-y-4"], [1, "ba-data", "mt-1", "text-text"], [1, "ba-data", "mt-1", "text-accent"], [1, "mt-2"], [1, "h-2", "overflow-hidden", "rounded-full", "bg-surface-high"], [1, "h-full", "w-[60%]", "rounded-full", "bg-accent", "shadow-glow"], [3, "items"], [1, "ba-card-header"], [1, "space-y-3", "p-4"], [1, "flex", "items-start", "justify-between", "gap-4", "rounded-card", "border", "border-border/60", "bg-background/60", "p-3"], [1, "mt-4"], [1, "grid", "gap-4", "p-4", "md:grid-cols-2", "2xl:grid-cols-3"], [3, "name", "role", "status", "tone", "currentJob", "lastEvent"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-[0.95fr_1.05fr]"], ["label", "Operations log", "title", "Agent telemetry", 3, "entries"], ["title", "Queue / Scheduled jobs", "subtitle", "Mocked queue depth and scheduled automation work.", 3, "columns", "rows"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-[0.8fr_1.2fr]"], [1, "grid", "gap-4", "md:grid-cols-2", "xl:grid-cols-1"], ["label", "OpenAI TPM usage", "caption", "Current token-per-minute pressure.", 3, "used", "limit"], ["label", "API-Football daily", "caption", "Provider quota remains healthy.", 3, "used", "limit"], [1, "grid", "gap-4", "lg:grid-cols-2"], ["label", "Runtime health", "title", "Latency trend", "value", "420 ms", "caption", "Mocked runtime latency across recent pipeline steps.", 3, "points"], ["label", "Retry / backoff", "title", "Retry-safe activity", "value", "0 retries", "caption", "OpenAI retry avoided; no active backoff window.", 3, "points"], [1, "text-sm", "font-medium", "text-text"], [1, "mt-1", "text-xs", "text-muted"], [3, "label", "tone"]], template: function LiveOperationsPage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "ba-page-header", 0)(1, "div", 1)(2, "button", 2);
            i0.ɵɵtext(3, " Start Run ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "button", 3);
            i0.ɵɵtext(5, " Pause Automation ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(6, "section", 4);
            i0.ɵɵrepeaterCreate(7, LiveOperationsPage_For_8_Template, 1, 6, "ba-kpi-card", 5, _forTrack0);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(9, "section", 6)(10, "ba-section-card")(11, "div", 7)(12, "div")(13, "p", 8);
            i0.ɵɵtext(14, "Current pipeline run");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(15, "h3", 9);
            i0.ɵɵtext(16, "run_81c06778");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(17, "div", 1);
            i0.ɵɵelement(18, "ba-status-badge", 10)(19, "ba-status-badge", 11);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(20, "div", 12)(21, "div", 13)(22, "dl", 14)(23, "div")(24, "dt", 8);
            i0.ɵɵtext(25, "Target date");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(26, "dd", 15);
            i0.ɵɵtext(27, "2026-04-25");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(28, "div")(29, "dt", 8);
            i0.ɵɵtext(30, "Strategy");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(31, "dd", 16);
            i0.ɵɵtext(32, "default_football_balanced");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(33, "div")(34, "dt", 8);
            i0.ɵɵtext(35, "Progress");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(36, "dd", 17)(37, "div", 18);
            i0.ɵɵelement(38, "div", 19);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(39, "div")(40, "dt", 8);
            i0.ɵɵtext(41, "Status");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(42, "dd", 17);
            i0.ɵɵelement(43, "ba-status-badge", 10);
            i0.ɵɵelementEnd()()()();
            i0.ɵɵelement(44, "ba-timeline", 20);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(45, "ba-section-card")(46, "div", 21)(47, "p", 8);
            i0.ɵɵtext(48, "Alerts");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(49, "h3", 9);
            i0.ɵɵtext(50, "Operational guardrails");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(51, "div", 22);
            i0.ɵɵrepeaterCreate(52, LiveOperationsPage_For_53_Template, 7, 4, "div", 23, _forTrack0);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(54, "section", 24)(55, "ba-section-card")(56, "div", 21)(57, "p", 8);
            i0.ɵɵtext(58, "Active agents grid");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(59, "h3", 9);
            i0.ɵɵtext(60, "Agent execution states");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(61, "div", 25);
            i0.ɵɵrepeaterCreate(62, LiveOperationsPage_For_63_Template, 1, 6, "ba-agent-card", 26, _forTrack1);
            i0.ɵɵelementEnd()()();
            i0.ɵɵelementStart(64, "section", 27);
            i0.ɵɵelement(65, "ba-log-console", 28)(66, "ba-data-table", 29);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(67, "section", 30)(68, "div", 31);
            i0.ɵɵelement(69, "ba-quota-gauge", 32)(70, "ba-quota-gauge", 33);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(71, "div", 34);
            i0.ɵɵelement(72, "ba-chart-card", 35)(73, "ba-chart-card", 36);
            i0.ɵɵelementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(7);
            i0.ɵɵrepeater(ctx.kpis);
            i0.ɵɵadvance(37);
            i0.ɵɵproperty("items", ctx.pipelineItems);
            i0.ɵɵadvance(8);
            i0.ɵɵrepeater(ctx.alerts);
            i0.ɵɵadvance(10);
            i0.ɵɵrepeater(ctx.agents);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("entries", ctx.logs);
            i0.ɵɵadvance();
            i0.ɵɵproperty("columns", ctx.jobColumns)("rows", ctx.jobRows);
            i0.ɵɵadvance(3);
            i0.ɵɵproperty("used", 15777)("limit", 30000);
            i0.ɵɵadvance();
            i0.ɵɵproperty("used", 1284)("limit", 7500);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("points", ctx.latencyTrend);
            i0.ɵɵadvance();
            i0.ɵɵproperty("points", ctx.retryTrend);
        } }, dependencies: [AgentCardComponent,
            ChartCardComponent,
            DataTableComponent,
            KpiCardComponent,
            LogConsoleComponent,
            PageHeaderComponent,
            QuotaGaugeComponent,
            SectionCardComponent,
            StatusBadgeComponent,
            TimelineComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LiveOperationsPage, [{
        type: Component,
        args: [{
                selector: 'ba-live-operations-page',
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
                    TimelineComponent
                ],
                template: `
    <ba-page-header
      eyebrow="Live Operations"
      title="Active Agents"
      subtitle="Suivi temps réel des agents IA, runs actifs, logs opérationnels et état du pipeline."
    >
      <div class="flex flex-wrap gap-2">
        <button type="button" class="ba-tool border-accent/60 bg-accent text-background hover:bg-accent-strong">
          Start Run
        </button>
        <button type="button" class="ba-tool border-warning/40 text-warning hover:bg-warning/10">
          Pause Automation
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

    <section class="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <ba-section-card>
        <div class="ba-card-header flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="ba-label">Current pipeline run</p>
            <h3 class="mt-1 text-sm font-semibold text-text">run_81c06778</h3>
          </div>
          <div class="flex flex-wrap gap-2">
            <ba-status-badge label="running" tone="live"></ba-status-badge>
            <ba-status-badge label="60% progress" tone="default"></ba-status-badge>
          </div>
        </div>
        <div class="grid gap-4 p-4 lg:grid-cols-[0.7fr_1.3fr]">
          <div class="rounded-card border border-border/60 bg-background/60 p-4">
            <dl class="space-y-4">
              <div>
                <dt class="ba-label">Target date</dt>
                <dd class="ba-data mt-1 text-text">2026-04-25</dd>
              </div>
              <div>
                <dt class="ba-label">Strategy</dt>
                <dd class="ba-data mt-1 text-accent">default_football_balanced</dd>
              </div>
              <div>
                <dt class="ba-label">Progress</dt>
                <dd class="mt-2">
                  <div class="h-2 overflow-hidden rounded-full bg-surface-high">
                    <div class="h-full w-[60%] rounded-full bg-accent shadow-glow"></div>
                  </div>
                </dd>
              </div>
              <div>
                <dt class="ba-label">Status</dt>
                <dd class="mt-2">
                  <ba-status-badge label="running" tone="live"></ba-status-badge>
                </dd>
              </div>
            </dl>
          </div>
          <ba-timeline [items]="pipelineItems"></ba-timeline>
        </div>
      </ba-section-card>

      <ba-section-card>
        <div class="ba-card-header">
          <p class="ba-label">Alerts</p>
          <h3 class="mt-1 text-sm font-semibold text-text">Operational guardrails</h3>
        </div>
        <div class="space-y-3 p-4">
          @for (alert of alerts; track alert.label) {
            <div class="flex items-start justify-between gap-4 rounded-card border border-border/60 bg-background/60 p-3">
              <div>
                <p class="text-sm font-medium text-text">{{ alert.label }}</p>
                <p class="mt-1 text-xs text-muted">{{ alert.detail }}</p>
              </div>
              <ba-status-badge [label]="alert.tone === 'success' ? 'OK' : alert.tone" [tone]="alert.tone"></ba-status-badge>
            </div>
          }
        </div>
      </ba-section-card>
    </section>

    <section class="mt-4">
      <ba-section-card>
        <div class="ba-card-header">
          <p class="ba-label">Active agents grid</p>
          <h3 class="mt-1 text-sm font-semibold text-text">Agent execution states</h3>
        </div>
        <div class="grid gap-4 p-4 md:grid-cols-2 2xl:grid-cols-3">
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
    </section>

    <section class="mt-4 grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
      <ba-log-console
        label="Operations log"
        title="Agent telemetry"
        [entries]="logs"
      ></ba-log-console>

      <ba-data-table
        title="Queue / Scheduled jobs"
        subtitle="Mocked queue depth and scheduled automation work."
        [columns]="jobColumns"
        [rows]="jobRows"
      ></ba-data-table>
    </section>

    <section class="mt-4 grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
      <div class="grid gap-4 md:grid-cols-2 xl:grid-cols-1">
        <ba-quota-gauge
          label="OpenAI TPM usage"
          [used]="15777"
          [limit]="30000"
          caption="Current token-per-minute pressure."
        ></ba-quota-gauge>
        <ba-quota-gauge
          label="API-Football daily"
          [used]="1284"
          [limit]="7500"
          caption="Provider quota remains healthy."
        ></ba-quota-gauge>
      </div>

      <div class="grid gap-4 lg:grid-cols-2">
        <ba-chart-card
          label="Runtime health"
          title="Latency trend"
          value="420 ms"
          caption="Mocked runtime latency across recent pipeline steps."
          [points]="latencyTrend"
        ></ba-chart-card>
        <ba-chart-card
          label="Retry / backoff"
          title="Retry-safe activity"
          value="0 retries"
          caption="OpenAI retry avoided; no active backoff window."
          [points]="retryTrend"
        ></ba-chart-card>
      </div>
    </section>
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(LiveOperationsPage, { className: "LiveOperationsPage", filePath: "src/app/features/live-operations/live-operations.page.ts", lineNumber: 214 }); })();
//# sourceMappingURL=live-operations.page.js.map
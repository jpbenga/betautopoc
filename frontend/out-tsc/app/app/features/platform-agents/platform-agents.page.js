import { Component, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AgentsApiService } from '../../core/api/agents-api.service';
import { AgentCardComponent } from '../../shared/ui/agent-card/agent-card.component';
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
import { TimelineComponent } from '../../shared/ui/timeline/timeline.component';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.label;
const _forTrack1 = ($index, $item) => $item.agent_id;
const _forTrack2 = ($index, $item) => $item.session_id;
function PlatformAgentsPage_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ba-section-card")(1, "div", 6);
    i0.ɵɵelement(2, "ba-loading-state", 7);
    i0.ɵɵelementEnd()();
} }
function PlatformAgentsPage_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-error-state", 4);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("message", ctx_r0.error);
} }
function PlatformAgentsPage_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-empty-state", 5);
} }
function PlatformAgentsPage_Conditional_9_For_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-kpi-card", 15);
} if (rf & 2) {
    const kpi_r2 = ctx.$implicit;
    i0.ɵɵproperty("label", kpi_r2.label)("value", kpi_r2.value)("status", kpi_r2.status || "")("tone", kpi_r2.tone || "default");
} }
function PlatformAgentsPage_Conditional_9_For_27_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-agent-card", 23);
} if (rf & 2) {
    const agent_r3 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵproperty("name", agent_r3.label)("role", agent_r3.agent_id)("status", agent_r3.status)("tone", ctx_r0.toneForStatus(agent_r3.status))("currentJob", agent_r3.current_job_id || "\u2014")("lastEvent", agent_r3.last_message || "No recent event");
} }
function PlatformAgentsPage_Conditional_9_For_54_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 37)(1, "div")(2, "p", 18);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 40);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(6, "ba-status-badge", 21);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const session_r4 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(session_r4.session_id);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(session_r4.reason);
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", session_r4.status);
} }
function PlatformAgentsPage_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 8)(1, "div", 9)(2, "p", 10);
    i0.ɵɵtext(3, "Simulated agents");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 11);
    i0.ɵɵtext(5, "Simulated agents (derived from pipeline runs). No external agent runtime is queried.");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(6, "div", 12)(7, "p", 13);
    i0.ɵɵtext(8, "Browser Use");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "p", 11);
    i0.ɵɵtext(10, "Browser Use disabled in orchestrator API mode.");
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(11, "section", 14);
    i0.ɵɵrepeaterCreate(12, PlatformAgentsPage_Conditional_9_For_13_Template, 1, 4, "ba-kpi-card", 15, _forTrack0);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "section", 16)(15, "ba-section-card")(16, "div", 17)(17, "div")(18, "p", 18);
    i0.ɵɵtext(19, "Active agents");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(20, "h3", 19);
    i0.ɵɵtext(21, "Pipeline-derived execution layer");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(22, "div", 1);
    i0.ɵɵelement(23, "ba-status-badge", 20)(24, "ba-status-badge", 21);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(25, "div", 22);
    i0.ɵɵrepeaterCreate(26, PlatformAgentsPage_Conditional_9_For_27_Template, 1, 6, "ba-agent-card", 23, _forTrack1);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(28, "section", 24);
    i0.ɵɵelement(29, "ba-data-table", 25);
    i0.ɵɵelementStart(30, "ba-section-card")(31, "div", 26)(32, "p", 18);
    i0.ɵɵtext(33, "Task timeline");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(34, "h3", 19);
    i0.ɵɵtext(35, "Latest pipeline activity");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(36, "div", 6);
    i0.ɵɵelement(37, "ba-timeline", 27);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(38, "section", 28)(39, "div", 29);
    i0.ɵɵelement(40, "ba-chart-card", 30)(41, "ba-chart-card", 31);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(42, "div", 32);
    i0.ɵɵelement(43, "ba-kpi-card", 33)(44, "ba-kpi-card", 34);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(45, "section", 35)(46, "ba-section-card")(47, "div", 26)(48, "p", 18);
    i0.ɵɵtext(49, "Browser-use sessions");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(50, "h3", 19);
    i0.ɵɵtext(51, "Runtime availability");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(52, "div", 36);
    i0.ɵɵrepeaterCreate(53, PlatformAgentsPage_Conditional_9_For_54_Template, 7, 3, "div", 37, _forTrack2);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(55, "ba-log-console", 38);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(56, "section", 16);
    i0.ɵɵelement(57, "ba-data-table", 39);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(12);
    i0.ɵɵrepeater(ctx_r0.kpis);
    i0.ɵɵadvance(11);
    i0.ɵɵproperty("label", ctx_r0.activeAgentsLabel);
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", ctx_r0.browserStatusLabel);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r0.agents);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("columns", ctx_r0.jobColumns)("rows", ctx_r0.jobRows);
    i0.ɵɵadvance(8);
    i0.ɵɵproperty("items", ctx_r0.taskTimeline);
    i0.ɵɵadvance(3);
    i0.ɵɵproperty("value", ctx_r0.resources ? ctx_r0.resources.cpu_usage + "%" : "\u2014")("points", ctx_r0.cpuTrend);
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", ctx_r0.resources ? ctx_r0.resources.active_sessions + " active" : "0 active")("caption", ctx_r0.browserReason)("points", ctx_r0.sessionTrend);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("value", ctx_r0.resources ? ctx_r0.resources.memory_usage + " MB" : "\u2014");
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", ctx_r0.resources ? ctx_r0.resources.jobs_running.toString() : "0")("tone", ctx_r0.resources && ctx_r0.resources.jobs_running > 0 ? "live" : "default");
    i0.ɵɵadvance(9);
    i0.ɵɵrepeater(ctx_r0.browserSessions.sessions);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("entries", ctx_r0.logs);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("columns", ctx_r0.agentColumns)("rows", ctx_r0.agentRows);
} }
export class PlatformAgentsPage {
    constructor() {
        this.agentsApi = inject(AgentsApiService);
        this.loading = true;
        this.error = '';
        this.empty = false;
        this.agents = [];
        this.jobs = [];
        this.agentLogs = [];
        this.resources = null;
        this.browserSessions = {
            status: 'disabled',
            reason: 'Browser Use is not implemented in orchestrator API mode',
            sessions: []
        };
        this.jobColumns = [
            { key: 'job', label: 'Job ID', data: true },
            { key: 'agent', label: 'Agent' },
            { key: 'step', label: 'Step' },
            { key: 'target', label: 'Target', data: true },
            { key: 'activity', label: 'Activity', align: 'right', data: true }
        ];
        this.agentColumns = [
            { key: 'agent', label: 'Agent' },
            { key: 'currentJob', label: 'Current Job', data: true },
            { key: 'processed', label: 'Processed', align: 'right', data: true },
            { key: 'errors', label: 'Errors', align: 'right', data: true },
            { key: 'activity', label: 'Last Activity', align: 'right', data: true }
        ];
    }
    ngOnInit() {
        this.loadAgents();
    }
    get kpis() {
        const running = this.jobs.filter((job) => this.isRunning(job.status)).length;
        const failed = this.jobs.filter((job) => this.isFailed(job.status)).length;
        const processed = this.agents.reduce((total, agent) => total + agent.jobs_processed_count, 0);
        const errors = this.agents.reduce((total, agent) => total + agent.error_count, 0);
        const successRate = processed > 0 ? Math.max(0, Math.round(((processed - errors) / processed) * 100)) : 0;
        return [
            { label: 'Logical agents', value: this.agents.length.toString(), status: 'derived', tone: 'default' },
            { label: 'Running jobs', value: running.toString(), status: 'live', tone: running > 0 ? 'live' : 'default' },
            { label: 'Failed jobs', value: failed.toString(), status: failed > 0 ? 'review' : 'clear', tone: failed > 0 ? 'danger' : 'success' },
            { label: 'Jobs processed', value: processed.toString(), status: 'all runs', tone: 'success' },
            { label: 'Success rate', value: `${successRate}%`, status: 'estimated', tone: successRate >= 90 ? 'success' : 'warning' },
            { label: 'Active sessions', value: (this.resources?.active_sessions || 0).toString(), status: 'browser-use', tone: 'warning' }
        ];
    }
    get activeAgentsLabel() {
        return `${this.agents.filter((agent) => agent.status === 'running').length} running`;
    }
    get browserStatusLabel() {
        return this.browserSessions.status;
    }
    get browserReason() {
        return this.browserSessions.reason || 'Browser Use disabled in orchestrator API mode.';
    }
    get jobRows() {
        return this.jobs.slice(0, 20).map((job) => ({
            cells: {
                job: job.job_id,
                agent: job.agent_id,
                step: job.current_step || '—',
                target: job.target_date || '—',
                activity: this.formatDate(job.finished_at || job.started_at)
            },
            status: job.status,
            statusTone: this.toneForStatus(job.status)
        }));
    }
    get agentRows() {
        return this.agents.map((agent) => ({
            cells: {
                agent: agent.label,
                currentJob: agent.current_job_id || '—',
                processed: agent.jobs_processed_count,
                errors: agent.error_count,
                activity: this.formatDate(agent.last_activity_at)
            },
            status: agent.status,
            statusTone: this.toneForStatus(agent.status)
        }));
    }
    get taskTimeline() {
        return this.jobs.slice(0, 6).map((job) => ({
            title: `${job.agent_id} / ${job.current_step || 'job'}`,
            meta: job.status,
            description: job.last_message || `Job ${job.job_id}`,
            tone: this.timelineTone(job.status)
        }));
    }
    get logs() {
        return this.agentLogs.slice(0, 80).map((entry) => ({
            time: this.formatDate(entry.at),
            level: this.logLevel(entry.level),
            message: `[${entry.agent_id}] ${entry.message}`
        }));
    }
    get cpuTrend() {
        const value = this.resources?.cpu_usage || 0;
        return [
            { label: 'T-4', value: Math.max(0, value - 12) },
            { label: 'T-3', value: Math.max(0, value - 8) },
            { label: 'T-2', value: Math.max(0, value - 4) },
            { label: 'T-1', value },
            { label: 'Now', value }
        ];
    }
    get sessionTrend() {
        const value = this.resources?.active_sessions || 0;
        return [
            { label: 'T-4', value },
            { label: 'T-3', value },
            { label: 'T-2', value },
            { label: 'T-1', value },
            { label: 'Now', value }
        ];
    }
    loadAgents() {
        this.loading = true;
        this.error = '';
        forkJoin({
            agents: this.agentsApi.getAgents(),
            jobs: this.agentsApi.getJobs(),
            logs: this.agentsApi.getLogs(),
            resources: this.agentsApi.getResources(),
            browserSessions: this.agentsApi.getBrowserSessions()
        }).subscribe({
            next: ({ agents, jobs, logs, resources, browserSessions }) => {
                this.agents = this.isNoData(agents) ? [] : agents.agents;
                this.jobs = this.isNoData(jobs) ? [] : jobs.jobs;
                this.agentLogs = this.isNoData(logs) ? [] : logs.logs;
                this.resources = this.isNoData(resources) ? null : resources;
                this.browserSessions = browserSessions;
                this.empty = this.agents.length === 0 && this.jobs.length === 0;
                this.loading = false;
            },
            error: (error) => {
                this.error = error instanceof Error ? error.message : 'Unable to load agent observability.';
                this.loading = false;
            }
        });
    }
    toneForStatus(status) {
        const normalized = status.toLowerCase();
        if (['running', 'active', 'pending'].includes(normalized)) {
            return 'live';
        }
        if (['completed', 'done', 'success', 'succeeded', 'completed_no_data'].includes(normalized)) {
            return 'success';
        }
        if (['failed', 'error'].includes(normalized)) {
            return 'danger';
        }
        if (['disabled', 'skipped'].includes(normalized)) {
            return 'warning';
        }
        return 'default';
    }
    timelineTone(status) {
        const tone = this.toneForStatus(status);
        return tone === 'live' ? 'warning' : tone;
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
    isRunning(status) {
        return ['running', 'active', 'pending'].includes(status.toLowerCase());
    }
    isFailed(status) {
        return ['failed', 'error'].includes(status.toLowerCase());
    }
    isNoData(response) {
        return !!response && typeof response === 'object' && 'status' in response && response.status === 'no_data';
    }
    formatDate(value) {
        if (!value) {
            return '—';
        }
        const date = new Date(value);
        if (Number.isNaN(date.getTime())) {
            return value;
        }
        return date.toLocaleString('fr-FR', {
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    static { this.ɵfac = function PlatformAgentsPage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PlatformAgentsPage)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PlatformAgentsPage, selectors: [["ba-platform-agents-page"]], decls: 10, vars: 1, consts: [["eyebrow", "Automation Layer", "title", "Platform Agents", "subtitle", "Supervision des agents d\u00E9riv\u00E9s des runs, jobs, steps et logs du pipeline."], [1, "flex", "flex-wrap", "gap-2"], ["type", "button", 1, "ba-tool", "border-accent/60", "bg-accent", "text-background", "hover:bg-accent-strong"], ["type", "button", 1, "ba-tool"], ["label", "Agents API error", 3, "message"], ["label", "No agent data available yet", "message", "Run an analysis first. Agents are derived from pipeline runs, jobs, steps and logs."], [1, "p-4"], ["message", "Loading agent observability..."], [1, "mb-4", "grid", "gap-3", "lg:grid-cols-2"], [1, "rounded-card", "border", "border-accent/30", "bg-accent/10", "p-3", "text-sm", "text-text"], [1, "ba-label", "text-accent"], [1, "mt-1", "text-muted"], [1, "rounded-card", "border", "border-warning/30", "bg-warning/10", "p-3", "text-sm", "text-text"], [1, "ba-label", "text-warning"], [1, "grid", "gap-4", "sm:grid-cols-2", "xl:grid-cols-3", "2xl:grid-cols-6"], [3, "label", "value", "status", "tone"], [1, "mt-4"], [1, "ba-card-header", "flex", "flex-col", "gap-3", "lg:flex-row", "lg:items-center", "lg:justify-between"], [1, "ba-label"], [1, "mt-1", "text-sm", "font-semibold", "text-text"], ["tone", "live", 3, "label"], ["tone", "warning", 3, "label"], [1, "grid", "gap-4", "p-4", "lg:grid-cols-3"], [3, "name", "role", "status", "tone", "currentJob", "lastEvent"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-[1.15fr_0.85fr]"], ["title", "Agent jobs", "subtitle", "Recent and active jobs derived from pipeline runs.", "emptyMessage", "No agent jobs available.", 3, "columns", "rows"], [1, "ba-card-header"], [3, "items"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-[1.2fr_0.8fr]"], [1, "grid", "gap-4", "lg:grid-cols-2"], ["label", "Resources", "title", "CPU usage", "caption", "Simulated from running pipeline jobs.", 3, "value", "points"], ["label", "Sessions", "title", "Browser sessions", 3, "value", "caption", "points"], [1, "grid", "gap-4", "sm:grid-cols-2", "xl:grid-cols-1"], ["label", "Memory", "status", "simulated", "tone", "default", 3, "value"], ["label", "Running jobs", "status", "from jobs", 3, "value", "tone"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-[0.85fr_1.15fr]"], [1, "space-y-3", "p-4"], [1, "flex", "items-start", "justify-between", "gap-4", "rounded-card", "border", "border-border/60", "bg-background/60", "p-3"], ["label", "Agent logs", "title", "Pipeline telemetry", "emptyMessage", "No agent logs available.", 3, "entries"], ["title", "Agent status table", "subtitle", "Current projection per logical agent.", "emptyMessage", "No agent rows available.", 3, "columns", "rows"], [1, "mt-2", "text-sm", "text-muted"]], template: function PlatformAgentsPage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "ba-page-header", 0)(1, "div", 1)(2, "button", 2);
            i0.ɵɵtext(3, " Restart Agents ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "button", 3);
            i0.ɵɵtext(5, " View Logs ");
            i0.ɵɵelementEnd()()();
            i0.ɵɵconditionalCreate(6, PlatformAgentsPage_Conditional_6_Template, 3, 0, "ba-section-card")(7, PlatformAgentsPage_Conditional_7_Template, 1, 1, "ba-error-state", 4)(8, PlatformAgentsPage_Conditional_8_Template, 1, 0, "ba-empty-state", 5)(9, PlatformAgentsPage_Conditional_9_Template, 58, 16);
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵconditional(ctx.loading ? 6 : ctx.error ? 7 : ctx.empty ? 8 : 9);
        } }, dependencies: [AgentCardComponent,
            ChartCardComponent,
            DataTableComponent,
            EmptyStateComponent,
            ErrorStateComponent,
            KpiCardComponent,
            LoadingStateComponent,
            LogConsoleComponent,
            PageHeaderComponent,
            SectionCardComponent,
            StatusBadgeComponent,
            TimelineComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PlatformAgentsPage, [{
        type: Component,
        args: [{
                selector: 'ba-platform-agents-page',
                standalone: true,
                imports: [
                    AgentCardComponent,
                    ChartCardComponent,
                    DataTableComponent,
                    EmptyStateComponent,
                    ErrorStateComponent,
                    KpiCardComponent,
                    LoadingStateComponent,
                    LogConsoleComponent,
                    PageHeaderComponent,
                    SectionCardComponent,
                    StatusBadgeComponent,
                    TimelineComponent
                ],
                template: `
    <ba-page-header
      eyebrow="Automation Layer"
      title="Platform Agents"
      subtitle="Supervision des agents dérivés des runs, jobs, steps et logs du pipeline."
    >
      <div class="flex flex-wrap gap-2">
        <button type="button" class="ba-tool border-accent/60 bg-accent text-background hover:bg-accent-strong">
          Restart Agents
        </button>
        <button type="button" class="ba-tool">
          View Logs
        </button>
      </div>
    </ba-page-header>

    @if (loading) {
      <ba-section-card>
        <div class="p-4">
          <ba-loading-state message="Loading agent observability..."></ba-loading-state>
        </div>
      </ba-section-card>
    } @else if (error) {
      <ba-error-state label="Agents API error" [message]="error"></ba-error-state>
    } @else if (empty) {
      <ba-empty-state
        label="No agent data available yet"
        message="Run an analysis first. Agents are derived from pipeline runs, jobs, steps and logs."
      ></ba-empty-state>
    } @else {
      <section class="mb-4 grid gap-3 lg:grid-cols-2">
        <div class="rounded-card border border-accent/30 bg-accent/10 p-3 text-sm text-text">
          <p class="ba-label text-accent">Simulated agents</p>
          <p class="mt-1 text-muted">Simulated agents (derived from pipeline runs). No external agent runtime is queried.</p>
        </div>
        <div class="rounded-card border border-warning/30 bg-warning/10 p-3 text-sm text-text">
          <p class="ba-label text-warning">Browser Use</p>
          <p class="mt-1 text-muted">Browser Use disabled in orchestrator API mode.</p>
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

      <section class="mt-4">
        <ba-section-card>
          <div class="ba-card-header flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p class="ba-label">Active agents</p>
              <h3 class="mt-1 text-sm font-semibold text-text">Pipeline-derived execution layer</h3>
            </div>
            <div class="flex flex-wrap gap-2">
              <ba-status-badge [label]="activeAgentsLabel" tone="live"></ba-status-badge>
              <ba-status-badge [label]="browserStatusLabel" tone="warning"></ba-status-badge>
            </div>
          </div>
          <div class="grid gap-4 p-4 lg:grid-cols-3">
            @for (agent of agents; track agent.agent_id) {
              <ba-agent-card
                [name]="agent.label"
                [role]="agent.agent_id"
                [status]="agent.status"
                [tone]="toneForStatus(agent.status)"
                [currentJob]="agent.current_job_id || '—'"
                [lastEvent]="agent.last_message || 'No recent event'"
              ></ba-agent-card>
            }
          </div>
        </ba-section-card>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <ba-data-table
          title="Agent jobs"
          subtitle="Recent and active jobs derived from pipeline runs."
          [columns]="jobColumns"
          [rows]="jobRows"
          emptyMessage="No agent jobs available."
        ></ba-data-table>

        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Task timeline</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Latest pipeline activity</h3>
          </div>
          <div class="p-4">
            <ba-timeline [items]="taskTimeline"></ba-timeline>
          </div>
        </ba-section-card>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div class="grid gap-4 lg:grid-cols-2">
          <ba-chart-card
            label="Resources"
            title="CPU usage"
            [value]="resources ? resources.cpu_usage + '%' : '—'"
            caption="Simulated from running pipeline jobs."
            [points]="cpuTrend"
          ></ba-chart-card>
          <ba-chart-card
            label="Sessions"
            title="Browser sessions"
            [value]="resources ? resources.active_sessions + ' active' : '0 active'"
            [caption]="browserReason"
            [points]="sessionTrend"
          ></ba-chart-card>
        </div>

        <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
          <ba-kpi-card
            label="Memory"
            [value]="resources ? resources.memory_usage + ' MB' : '—'"
            status="simulated"
            tone="default"
          ></ba-kpi-card>
          <ba-kpi-card
            label="Running jobs"
            [value]="resources ? resources.jobs_running.toString() : '0'"
            status="from jobs"
            [tone]="resources && resources.jobs_running > 0 ? 'live' : 'default'"
          ></ba-kpi-card>
        </div>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Browser-use sessions</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Runtime availability</h3>
          </div>
          <div class="space-y-3 p-4">
            @for (session of browserSessions.sessions; track session.session_id) {
              <div class="flex items-start justify-between gap-4 rounded-card border border-border/60 bg-background/60 p-3">
                <div>
                  <p class="ba-label">{{ session.session_id }}</p>
                  <p class="mt-2 text-sm text-muted">{{ session.reason }}</p>
                </div>
                <ba-status-badge [label]="session.status" tone="warning"></ba-status-badge>
              </div>
            }
          </div>
        </ba-section-card>

        <ba-log-console
          label="Agent logs"
          title="Pipeline telemetry"
          [entries]="logs"
          emptyMessage="No agent logs available."
        ></ba-log-console>
      </section>

      <section class="mt-4">
        <ba-data-table
          title="Agent status table"
          subtitle="Current projection per logical agent."
          [columns]="agentColumns"
          [rows]="agentRows"
          emptyMessage="No agent rows available."
        ></ba-data-table>
      </section>
    }
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PlatformAgentsPage, { className: "PlatformAgentsPage", filePath: "src/app/features/platform-agents/platform-agents.page.ts", lineNumber: 223 }); })();
//# sourceMappingURL=platform-agents.page.js.map
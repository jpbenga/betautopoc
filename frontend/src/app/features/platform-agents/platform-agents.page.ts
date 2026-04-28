import { Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import {
  AgentJob,
  AgentLogEntry,
  AgentResourcesResponse,
  AgentSummary,
  AgentsNoDataResponse,
  BrowserSessionsResponse
} from '../../core/api/api.types';
import { AgentsApiService } from '../../core/api/agents-api.service';
import { AgentCardComponent } from '../../shared/ui/agent-card/agent-card.component';
import { ChartCardComponent, ChartPoint } from '../../shared/ui/chart-card/chart-card.component';
import { DataTableColumn, DataTableComponent, DataTableRow } from '../../shared/ui/data-table/data-table.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { LogConsoleComponent, LogEntry } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';
import { TimelineComponent, TimelineItem } from '../../shared/ui/timeline/timeline.component';

type UiTone = 'default' | 'success' | 'warning' | 'danger' | 'live';

interface PlatformKpi {
  label: string;
  value: string;
  status?: string;
  tone?: UiTone;
}

@Component({
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
})
export class PlatformAgentsPage implements OnInit {
  private readonly agentsApi = inject(AgentsApiService);

  protected loading = true;
  protected error = '';
  protected empty = false;
  protected agents: AgentSummary[] = [];
  protected jobs: AgentJob[] = [];
  protected agentLogs: AgentLogEntry[] = [];
  protected resources: AgentResourcesResponse | null = null;
  protected browserSessions: BrowserSessionsResponse = {
    status: 'disabled',
    reason: 'Browser Use is not implemented in orchestrator API mode',
    sessions: []
  };

  protected readonly jobColumns: DataTableColumn[] = [
    { key: 'job', label: 'Job ID', data: true },
    { key: 'agent', label: 'Agent' },
    { key: 'step', label: 'Step' },
    { key: 'target', label: 'Target', data: true },
    { key: 'activity', label: 'Activity', align: 'right', data: true }
  ];

  protected readonly agentColumns: DataTableColumn[] = [
    { key: 'agent', label: 'Agent' },
    { key: 'currentJob', label: 'Current Job', data: true },
    { key: 'processed', label: 'Processed', align: 'right', data: true },
    { key: 'errors', label: 'Errors', align: 'right', data: true },
    { key: 'activity', label: 'Last Activity', align: 'right', data: true }
  ];

  ngOnInit(): void {
    this.loadAgents();
  }

  protected get kpis(): PlatformKpi[] {
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

  protected get activeAgentsLabel(): string {
    return `${this.agents.filter((agent) => agent.status === 'running').length} running`;
  }

  protected get browserStatusLabel(): string {
    return this.browserSessions.status;
  }

  protected get browserReason(): string {
    return this.browserSessions.reason || 'Browser Use disabled in orchestrator API mode.';
  }

  protected get jobRows(): DataTableRow[] {
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

  protected get agentRows(): DataTableRow[] {
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

  protected get taskTimeline(): TimelineItem[] {
    return this.jobs.slice(0, 6).map((job) => ({
      title: `${job.agent_id} / ${job.current_step || 'job'}`,
      meta: job.status,
      description: job.last_message || `Job ${job.job_id}`,
      tone: this.timelineTone(job.status)
    }));
  }

  protected get logs(): LogEntry[] {
    return this.agentLogs.slice(0, 80).map((entry) => ({
      time: this.formatDate(entry.at),
      level: this.logLevel(entry.level),
      message: `[${entry.agent_id}] ${entry.message}`
    }));
  }

  protected get cpuTrend(): ChartPoint[] {
    const value = this.resources?.cpu_usage || 0;
    return [
      { label: 'T-4', value: Math.max(0, value - 12) },
      { label: 'T-3', value: Math.max(0, value - 8) },
      { label: 'T-2', value: Math.max(0, value - 4) },
      { label: 'T-1', value },
      { label: 'Now', value }
    ];
  }

  protected get sessionTrend(): ChartPoint[] {
    const value = this.resources?.active_sessions || 0;
    return [
      { label: 'T-4', value },
      { label: 'T-3', value },
      { label: 'T-2', value },
      { label: 'T-1', value },
      { label: 'Now', value }
    ];
  }

  private loadAgents(): void {
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
      error: (error: unknown) => {
        this.error = error instanceof Error ? error.message : 'Unable to load agent observability.';
        this.loading = false;
      }
    });
  }

  protected toneForStatus(status: string): UiTone {
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

  private timelineTone(status: string): TimelineItem['tone'] {
    const tone = this.toneForStatus(status);
    return tone === 'live' ? 'warning' : tone;
  }

  private logLevel(level: string): LogEntry['level'] {
    if (level === 'error') {
      return 'danger';
    }
    if (level === 'success' || level === 'warning') {
      return level;
    }
    return 'info';
  }

  private isRunning(status: string): boolean {
    return ['running', 'active', 'pending'].includes(status.toLowerCase());
  }

  private isFailed(status: string): boolean {
    return ['failed', 'error'].includes(status.toLowerCase());
  }

  private isNoData(response: unknown): response is AgentsNoDataResponse {
    return !!response && typeof response === 'object' && 'status' in response && response.status === 'no_data';
  }

  private formatDate(value?: string | null): string {
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
}

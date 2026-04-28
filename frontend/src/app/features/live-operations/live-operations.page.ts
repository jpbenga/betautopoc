import { Component } from '@angular/core';
import { AgentCardComponent } from '../../shared/ui/agent-card/agent-card.component';
import { ChartCardComponent, ChartPoint } from '../../shared/ui/chart-card/chart-card.component';
import { DataTableColumn, DataTableComponent, DataTableRow } from '../../shared/ui/data-table/data-table.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LogConsoleComponent, LogEntry } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { QuotaGaugeComponent } from '../../shared/ui/quota-gauge/quota-gauge.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';
import { TimelineComponent, TimelineItem } from '../../shared/ui/timeline/timeline.component';

interface OperationsKpi {
  label: string;
  value: string;
  status?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'live';
  delta?: string;
  deltaTone?: 'muted' | 'success' | 'warning' | 'danger';
}

interface ActiveAgent {
  name: string;
  role: string;
  status: string;
  tone: 'default' | 'success' | 'warning' | 'danger' | 'live';
  currentJob: string;
  lastEvent: string;
}

interface OperationAlert {
  label: string;
  detail: string;
  tone: 'default' | 'success' | 'warning' | 'danger' | 'live';
}

@Component({
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
})
export class LiveOperationsPage {
  protected readonly kpis: OperationsKpi[] = [
    { label: 'Active agents', value: '4', status: 'Live', tone: 'live' },
    { label: 'Running jobs', value: '1', status: 'Running', tone: 'live' },
    { label: 'Queue depth', value: '7', status: 'Normal', tone: 'default' },
    { label: 'Last run duration', value: '2m 43s', status: 'Healthy', tone: 'success' },
    { label: 'Error rate', value: '0.8 %', status: 'Low', tone: 'success', delta: '-0.2%', deltaTone: 'success' },
    { label: 'API latency', value: '420 ms', status: 'Watch', tone: 'warning' }
  ];

  protected readonly pipelineItems: TimelineItem[] = [
    { title: 'Strategy loaded', meta: 'completed', description: 'default_football_balanced loaded for target date.', tone: 'success' },
    { title: 'Context builder', meta: 'completed', description: 'API-Football context built and normalized.', tone: 'success' },
    { title: 'Match analysis', meta: 'running', description: 'Active analysis job is processing match candidates.', tone: 'live' },
    { title: 'Selection engine', meta: 'pending', description: 'Waiting for analysis outputs.', tone: 'default' },
    { title: 'Browser Use', meta: 'skipped', description: 'Disabled in orchestrator mode.', tone: 'warning' }
  ];

  protected readonly agents: ActiveAgent[] = [
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

  protected readonly logs: LogEntry[] = [
    { time: '10:04', level: 'info', message: 'strategy loaded' },
    { time: '10:05', level: 'success', message: 'API-Football context built' },
    { time: '10:06', level: 'success', message: 'match 1 analyzed' },
    { time: '10:07', level: 'success', message: 'match 2 analyzed' },
    { time: '10:07', level: 'success', message: 'OpenAI retry avoided' },
    { time: '10:08', level: 'info', message: 'selection pending' },
    { time: '10:08', level: 'warning', message: 'browser skipped' }
  ];

  protected readonly jobColumns: DataTableColumn[] = [
    { key: 'id', label: 'Job ID', data: true },
    { key: 'type', label: 'Type' },
    { key: 'strategy', label: 'Strategy' },
    { key: 'target', label: 'Target', data: true },
    { key: 'eta', label: 'ETA', align: 'right', data: true }
  ];

  protected readonly jobRows: DataTableRow[] = [
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

  protected readonly latencyTrend: ChartPoint[] = [
    { label: 'T-5', value: 390 },
    { label: 'T-4', value: 410 },
    { label: 'T-3', value: 438 },
    { label: 'T-2', value: 416 },
    { label: 'Now', value: 420 }
  ];

  protected readonly retryTrend: ChartPoint[] = [
    { label: 'Context', value: 0 },
    { label: 'M1', value: 1 },
    { label: 'M2', value: 0 },
    { label: 'Select', value: 0 },
    { label: 'Browser', value: 0 }
  ];

  protected readonly alerts: OperationAlert[] = [
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

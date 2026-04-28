import { Component } from '@angular/core';
import { AgentCardComponent } from '../../shared/ui/agent-card/agent-card.component';
import { ChartCardComponent, ChartPoint } from '../../shared/ui/chart-card/chart-card.component';
import { DataTableColumn, DataTableComponent, DataTableRow } from '../../shared/ui/data-table/data-table.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LogConsoleComponent, LogEntry } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';
import { TimelineComponent, TimelineItem } from '../../shared/ui/timeline/timeline.component';

interface PlatformKpi {
  label: string;
  value: string;
  status?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'live';
  delta?: string;
  deltaTone?: 'muted' | 'success' | 'warning' | 'danger';
}

interface PlatformAgent {
  name: string;
  role: string;
  status: string;
  tone: 'default' | 'success' | 'warning' | 'danger' | 'live';
  currentJob: string;
  lastEvent: string;
}

interface ErrorMetric {
  label: string;
  value: string;
  status: string;
  tone: 'default' | 'success' | 'warning' | 'danger' | 'live';
}

@Component({
  selector: 'ba-platform-agents-page',
  standalone: true,
  imports: [
    AgentCardComponent,
    ChartCardComponent,
    DataTableComponent,
    KpiCardComponent,
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
      subtitle="Supervision des agents d’automatisation (browser-use, scraping, intégrations)."
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

    <section class="mt-4">
      <ba-section-card>
        <div class="ba-card-header flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="ba-label">Active agents</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Automation execution layer</h3>
          </div>
          <div class="flex flex-wrap gap-2">
            <ba-status-badge label="3 active" tone="live"></ba-status-badge>
            <ba-status-badge label="1 failed" tone="danger"></ba-status-badge>
          </div>
        </div>
        <div class="grid gap-4 p-4 lg:grid-cols-3">
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

    <section class="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <ba-data-table
        title="Agent status table"
        subtitle="Runtime state, task volume and recent activity."
        [columns]="agentColumns"
        [rows]="agentRows"
      ></ba-data-table>

      <ba-section-card>
        <div class="ba-card-header">
          <p class="ba-label">Task timeline</p>
          <h3 class="mt-1 text-sm font-semibold text-text">Browser verification flow</h3>
        </div>
        <div class="p-4">
          <ba-timeline [items]="taskTimeline"></ba-timeline>
        </div>
      </ba-section-card>
    </section>

    <section class="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <div class="grid gap-4 lg:grid-cols-2">
        <ba-chart-card
          label="Resource usage"
          title="Requests/sec"
          value="18 rps"
          caption="Mocked throughput across active automation sessions."
          [points]="requestTrend"
        ></ba-chart-card>
        <ba-chart-card
          label="Active sessions"
          title="Session trend"
          value="3 live"
          caption="Browser and scraper sessions over recent intervals."
          [points]="sessionTrend"
        ></ba-chart-card>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
        <ba-kpi-card label="CPU usage" value="45%" status="Normal" tone="success"></ba-kpi-card>
        <ba-kpi-card label="Memory" value="1.2GB" status="Stable" tone="success"></ba-kpi-card>
      </div>
    </section>

    <section class="mt-4 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
      <ba-section-card>
        <div class="ba-card-header">
          <p class="ba-label">Error monitoring</p>
          <h3 class="mt-1 text-sm font-semibold text-text">Browser-use exceptions</h3>
        </div>
        <div class="grid gap-3 p-4 sm:grid-cols-3 xl:grid-cols-1">
          @for (metric of errorMetrics; track metric.label) {
            <div class="flex items-start justify-between gap-4 rounded-card border border-border/60 bg-background/60 p-3">
              <div>
                <p class="ba-label">{{ metric.label }}</p>
                <p class="ba-data mt-2 text-text">{{ metric.value }}</p>
              </div>
              <ba-status-badge [label]="metric.status" [tone]="metric.tone"></ba-status-badge>
            </div>
          }
        </div>
      </ba-section-card>

      <ba-log-console
        label="Agent logs"
        title="Browser-use telemetry"
        [entries]="logs"
      ></ba-log-console>
    </section>

    <section class="mt-4">
      <ba-data-table
        title="Queue / Pending tasks"
        subtitle="Pending automation work not connected to a real API yet."
        [columns]="taskColumns"
        [rows]="taskRows"
      ></ba-data-table>
    </section>
  `
})
export class PlatformAgentsPage {
  protected readonly kpis: PlatformKpi[] = [
    { label: 'Active agents', value: '3', status: 'Live', tone: 'live' },
    { label: 'Idle agents', value: '2', status: 'Ready', tone: 'default' },
    { label: 'Failed agents', value: '1', status: 'Review', tone: 'danger' },
    { label: 'Tasks processed', value: '148', status: 'Today', tone: 'success' },
    { label: 'Success rate', value: '94%', status: 'Healthy', tone: 'success' },
    { label: 'Avg execution time', value: '3.2s', status: 'Stable', tone: 'success' }
  ];

  protected readonly agents: PlatformAgent[] = [
    {
      name: 'Browser-Use Agent',
      role: 'browser-use',
      status: 'running',
      tone: 'live',
      currentJob: 'verifying ticket on Unibet',
      lastEvent: 'navigation success'
    },
    {
      name: 'Scraper Agent',
      role: 'scraping',
      status: 'running',
      tone: 'live',
      currentJob: 'fetching fixtures',
      lastEvent: 'data updated'
    },
    {
      name: 'Notifier Agent',
      role: 'integrations',
      status: 'idle',
      tone: 'default',
      currentJob: '—',
      lastEvent: 'waiting for trigger'
    }
  ];

  protected readonly agentColumns: DataTableColumn[] = [
    { key: 'agent', label: 'Agent' },
    { key: 'job', label: 'Current Job' },
    { key: 'tasks', label: 'Tasks', align: 'right', data: true },
    { key: 'errors', label: 'Errors', align: 'right', data: true },
    { key: 'activity', label: 'Last Activity', align: 'right', data: true }
  ];

  protected readonly agentRows: DataTableRow[] = [
    {
      cells: { agent: 'browser-use', job: 'verify ticket', tasks: 42, errors: 1, activity: '2s ago' },
      status: 'running',
      statusTone: 'live'
    },
    {
      cells: { agent: 'scraper', job: 'fetch fixtures', tasks: 65, errors: 0, activity: '5s ago' },
      status: 'running',
      statusTone: 'live'
    },
    {
      cells: { agent: 'notifier', job: '—', tasks: 20, errors: 0, activity: '1m ago' },
      status: 'idle',
      statusTone: 'default'
    },
    {
      cells: { agent: 'executor', job: 'submit bet', tasks: 21, errors: 3, activity: '10m ago' },
      status: 'failed',
      statusTone: 'danger'
    }
  ];

  protected readonly taskTimeline: TimelineItem[] = [
    { title: 'job received', meta: 'completed', description: 'Ticket verification task accepted.', tone: 'success' },
    { title: 'browser opened', meta: 'completed', description: 'Browser session started.', tone: 'success' },
    { title: 'navigation', meta: 'completed', description: 'Unibet navigation completed.', tone: 'success' },
    { title: 'data extraction', meta: 'completed', description: 'Target ticket state extracted.', tone: 'success' },
    { title: 'verification', meta: 'completed', description: 'Ticket verification passed.', tone: 'success' },
    { title: 'success / failure', meta: 'mixed', description: 'Latest run succeeded; executor has prior timeout.', tone: 'warning' }
  ];

  protected readonly requestTrend: ChartPoint[] = [
    { label: 'T-5', value: 8 },
    { label: 'T-4', value: 11 },
    { label: 'T-3', value: 13 },
    { label: 'T-2', value: 17 },
    { label: 'Now', value: 18 }
  ];

  protected readonly sessionTrend: ChartPoint[] = [
    { label: 'T-5', value: 1 },
    { label: 'T-4', value: 2 },
    { label: 'T-3', value: 2 },
    { label: 'T-2', value: 3 },
    { label: 'Now', value: 3 }
  ];

  protected readonly errorMetrics: ErrorMetric[] = [
    { label: 'last error', value: 'browser timeout', status: 'watch', tone: 'warning' },
    { label: 'frequency', value: 'low', status: 'OK', tone: 'success' },
    { label: 'severity', value: 'medium', status: 'medium', tone: 'warning' }
  ];

  protected readonly logs: LogEntry[] = [
    { time: '15:02', level: 'info', message: '[agent] browser started' },
    { time: '15:03', level: 'info', message: '[agent] navigating to unibet' },
    { time: '15:03', level: 'success', message: '[agent] element found' },
    { time: '15:04', level: 'success', message: '[agent] verification success' },
    { time: '15:08', level: 'warning', message: '[agent] timeout detected' },
    { time: '15:08', level: 'info', message: '[agent] retry triggered' }
  ];

  protected readonly taskColumns: DataTableColumn[] = [
    { key: 'id', label: 'Task ID', data: true },
    { key: 'type', label: 'Type' },
    { key: 'priority', label: 'Priority' }
  ];

  protected readonly taskRows: DataTableRow[] = [
    {
      cells: { id: 'task_9081', type: 'browser verification', priority: 'high' },
      status: 'queued',
      statusTone: 'warning'
    },
    {
      cells: { id: 'task_9082', type: 'fixture scrape', priority: 'medium' },
      status: 'pending',
      statusTone: 'default'
    },
    {
      cells: { id: 'task_9083', type: 'notification dispatch', priority: 'low' },
      status: 'waiting',
      statusTone: 'default'
    }
  ];
}

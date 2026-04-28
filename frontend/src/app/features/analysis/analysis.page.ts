import { Component } from '@angular/core';
import { DataTableColumn, DataTableComponent, DataTableRow } from '../../shared/ui/data-table/data-table.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LogConsoleComponent, LogEntry } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';
import { TimelineComponent, TimelineItem } from '../../shared/ui/timeline/timeline.component';

interface AnalysisKpi {
  label: string;
  value: string;
  status?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'live';
  delta?: string;
  deltaTone?: 'muted' | 'success' | 'warning' | 'danger';
}

interface ActiveRun {
  id: string;
  status: string;
  tone: 'default' | 'success' | 'warning' | 'danger' | 'live';
  progress: number;
  matchesAnalysed?: string;
  picks?: number;
  started?: string;
  duration?: string;
}

interface ScheduledScan {
  label: string;
  time: string;
  status: string;
  tone: 'default' | 'success' | 'warning' | 'danger' | 'live';
}

@Component({
  selector: 'ba-analysis-page',
  standalone: true,
  imports: [
    DataTableComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    KpiCardComponent,
    LogConsoleComponent,
    PageHeaderComponent,
    SectionCardComponent,
    StatusBadgeComponent,
    TimelineComponent
  ],
  template: `
    <ba-page-header
      eyebrow="AI Analysis Pipeline"
      title="Analysis Queue"
      subtitle="Suivi des analyses programmées et des runs d’orchestrateur."
    >
      <div class="flex flex-wrap gap-2">
        <button type="button" class="ba-tool border-accent/60 bg-accent text-background hover:bg-accent-strong">
          Run Analysis
        </button>
        <button type="button" class="ba-tool">
          View Logs
        </button>
      </div>
    </ba-page-header>

    <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
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

    <section class="mt-4 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <ba-section-card>
        <div class="ba-card-header flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="ba-label">Active runs</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Orchestrator execution queue</h3>
          </div>
          <div class="flex flex-wrap gap-2">
            <ba-status-badge label="2 active" tone="live"></ba-status-badge>
            <ba-status-badge label="1 failed today" tone="danger"></ba-status-badge>
          </div>
        </div>

        @if (activeRuns.length > 0) {
          <div class="grid gap-4 p-4 md:grid-cols-2">
            @for (run of activeRuns; track run.id) {
              <article class="rounded-card border border-border/60 bg-background/60 p-4">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="ba-label">Run ID</p>
                    <h4 class="ba-data mt-2 text-base text-text">{{ run.id }}</h4>
                  </div>
                  <ba-status-badge [label]="run.status" [tone]="run.tone"></ba-status-badge>
                </div>
                <div class="mt-4 h-2 overflow-hidden rounded-full bg-surface-high">
                  <div class="h-full rounded-full bg-accent shadow-glow" [style.width.%]="run.progress"></div>
                </div>
                <dl class="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <dt class="ba-label">Progress</dt>
                    <dd class="ba-data mt-1 text-text">{{ run.progress }}%</dd>
                  </div>
                  @if (run.matchesAnalysed) {
                    <div>
                      <dt class="ba-label">Matches</dt>
                      <dd class="ba-data mt-1 text-text">{{ run.matchesAnalysed }}</dd>
                    </div>
                  }
                  @if (run.started) {
                    <div>
                      <dt class="ba-label">Started</dt>
                      <dd class="mt-1 text-muted">{{ run.started }}</dd>
                    </div>
                  }
                  @if (run.picks !== undefined) {
                    <div>
                      <dt class="ba-label">Picks</dt>
                      <dd class="ba-data mt-1 text-success">{{ run.picks }}</dd>
                    </div>
                  }
                  @if (run.duration) {
                    <div>
                      <dt class="ba-label">Duration</dt>
                      <dd class="ba-data mt-1 text-text">{{ run.duration }}</dd>
                    </div>
                  }
                </dl>
              </article>
            }
          </div>
        } @else {
          <div class="p-4">
            <ba-empty-state
              label="No active runs"
              message="No orchestrator run is currently active."
            ></ba-empty-state>
          </div>
        }
      </ba-section-card>

      <ba-section-card>
        <div class="ba-card-header">
          <p class="ba-label">Analysis timeline</p>
          <h3 class="mt-1 text-sm font-semibold text-text">Complete and in-progress run states</h3>
        </div>
        <div class="grid gap-4 p-4 lg:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
          <ba-timeline title="run_dba43175 completed" [items]="completedTimeline"></ba-timeline>
          <ba-timeline title="run_f6f68d92 running" [items]="runningTimeline"></ba-timeline>
        </div>
      </ba-section-card>
    </section>

    <section class="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
      <div class="space-y-4">
        <ba-data-table
          title="Runs table"
          subtitle="Recent analysis runs and orchestrator outcomes."
          [columns]="runColumns"
          [rows]="runRows"
        ></ba-data-table>

        @if (hasFailedRun) {
          <ba-error-state
            label="Failed run detected"
            message="Run cc98dd12 failed before ticket generation. The row remains visible for audit and retry planning."
          ></ba-error-state>
        }
      </div>

      <ba-section-card>
        <div class="ba-card-header">
          <p class="ba-label">Scheduled scans</p>
          <h3 class="mt-1 text-sm font-semibold text-text">Today’s scan windows</h3>
        </div>
        <div class="space-y-3 p-4">
          @for (scan of scheduledScans; track scan.label) {
            <div class="flex items-center justify-between gap-4 rounded-card border border-border/60 bg-background/60 p-3">
              <div>
                <p class="text-sm font-medium text-text">{{ scan.label }}</p>
                <p class="ba-data mt-1 text-muted">{{ scan.time }}</p>
              </div>
              <ba-status-badge [label]="scan.status" [tone]="scan.tone"></ba-status-badge>
            </div>
          }
        </div>
      </ba-section-card>
    </section>

    <section class="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <ba-section-card>
        <div class="ba-card-header">
          <p class="ba-label">Filters</p>
          <h3 class="mt-1 text-sm font-semibold text-text">Mock queue filters</h3>
        </div>
        <div class="grid gap-3 p-4 sm:grid-cols-3 xl:grid-cols-1">
          <button type="button" class="ba-tool text-left">Status: all</button>
          <button type="button" class="ba-tool text-left">Date: today</button>
          <button type="button" class="ba-tool text-left">Strategy: any</button>
        </div>
      </ba-section-card>

      <ba-log-console
        label="Recent logs"
        title="Analysis pipeline output"
        [entries]="logs"
      ></ba-log-console>
    </section>
  `
})
export class AnalysisPage {
  protected readonly kpis: AnalysisKpi[] = [
    { label: 'Active runs', value: '2', status: 'Live', tone: 'live' },
    { label: 'Scheduled today', value: '6', status: 'Planned', tone: 'default' },
    { label: 'Completed today', value: '14', status: 'Healthy', tone: 'success' },
    { label: 'Failed runs', value: '1', status: 'Review', tone: 'danger' },
    { label: 'Avg duration', value: '2m 10s', status: 'Stable', tone: 'success' }
  ];

  protected readonly activeRuns: ActiveRun[] = [
    {
      id: 'run_f6f68d92',
      status: 'running',
      tone: 'live',
      progress: 75,
      matchesAnalysed: '8/10',
      started: '2 min ago'
    },
    {
      id: 'run_dba43175',
      status: 'completed',
      tone: 'success',
      progress: 100,
      picks: 2,
      duration: '2m17s'
    }
  ];

  protected readonly completedTimeline: TimelineItem[] = [
    { title: 'Strategy loaded', meta: 'completed', description: 'default_football_balanced loaded.', tone: 'success' },
    { title: 'Context built', meta: 'completed', description: 'API-Football context normalized.', tone: 'success' },
    { title: 'Match analysis', meta: 'completed', description: '10 matches analysed.', tone: 'success' },
    { title: 'Selection engine', meta: 'completed', description: '2 picks selected.', tone: 'success' },
    { title: 'Ticket generated', meta: 'completed', description: 'Draft ticket created for review.', tone: 'success' }
  ];

  protected readonly runningTimeline: TimelineItem[] = [
    { title: 'Strategy loaded', meta: 'completed', description: 'Strategy loaded for live run.', tone: 'success' },
    { title: 'Context built', meta: 'completed', description: 'Context builder finished.', tone: 'success' },
    { title: 'Match analysis', meta: 'running', description: '8 of 10 matches analysed.', tone: 'live' },
    { title: 'Selection engine', meta: 'pending', description: 'Waiting for match analysis output.', tone: 'default' },
    { title: 'Ticket generated', meta: 'pending', description: 'No ticket generated yet.', tone: 'default' }
  ];

  protected readonly runColumns: DataTableColumn[] = [
    { key: 'id', label: 'Run ID', data: true },
    { key: 'date', label: 'Date', data: true },
    { key: 'matches', label: 'Matches', align: 'right', data: true },
    { key: 'picks', label: 'Picks', align: 'right', data: true },
    { key: 'duration', label: 'Duration', align: 'right', data: true }
  ];

  protected readonly runRows: DataTableRow[] = [
    {
      cells: { id: 'f6f68d92', date: '2026-04-25', matches: 10, picks: 2, duration: '2m17s' },
      status: 'completed',
      statusTone: 'success'
    },
    {
      cells: { id: 'dba43175', date: '2026-04-25', matches: 12, picks: 2, duration: '2m30s' },
      status: 'completed',
      statusTone: 'success'
    },
    {
      cells: { id: 'aa12bb34', date: '2026-04-26', matches: 8, picks: 1, duration: '1m50s' },
      status: 'running',
      statusTone: 'live'
    },
    {
      cells: { id: 'cc98dd12', date: '2026-04-26', matches: 15, picks: 0, duration: '—' },
      status: 'failed',
      statusTone: 'danger'
    }
  ];

  protected readonly scheduledScans: ScheduledScan[] = [
    { label: 'Daily scan', time: '08:00', status: 'completed', tone: 'success' },
    { label: 'Midday scan', time: '14:00', status: 'next run', tone: 'live' },
    { label: 'Evening scan', time: '20:00', status: 'pending', tone: 'default' }
  ];

  protected readonly logs: LogEntry[] = [
    { time: '10:31', level: 'info', message: '[analysis] orchestrator started' },
    { time: '10:31', level: 'info', message: '[orchestrator] loading strategy' },
    { time: '10:32', level: 'success', message: '[orchestrator] building context' },
    { time: '10:33', level: 'success', message: '[orchestrator] match analysis' },
    { time: '10:35', level: 'info', message: '[orchestrator] selection' },
    { time: '10:36', level: 'success', message: '[analysis] completed' }
  ];

  protected get hasFailedRun(): boolean {
    return this.runRows.some((row) => row.statusTone === 'danger');
  }
}

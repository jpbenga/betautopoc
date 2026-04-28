import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription, catchError, forkJoin, interval, of } from 'rxjs';
import { AnalysisApiService } from '../../core/api/analysis-api.service';
import { formatApiDate, statusToTone } from '../../core/api/api.mappers';
import { AnalysisLogEntry, AnalysisRun, AnalysisRunListItem, AnalysisTimelineStep } from '../../core/api/api.types';
import { BetautoApiService } from '../../core/api/betauto-api.service';
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

interface AnalysisKpi {
  label: string;
  value: string;
  status?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'live';
}

@Component({
  selector: 'ba-analysis-page',
  standalone: true,
  imports: [
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
      eyebrow="AI Analysis Pipeline"
      title="Analysis Queue"
      subtitle="Suivi des analyses programmées et des runs d’orchestrateur."
    >
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="ba-tool border-accent/60 bg-accent text-background hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
          [disabled]="isStartingRun"
          (click)="startRun()"
        >
          {{ isStartingRun ? 'Starting...' : 'Run Analysis' }}
        </button>
        <button type="button" class="ba-tool">
          View Logs
        </button>
      </div>
    </ba-page-header>

    @if (selectedRunId || isPolling || lastUpdatedAt || startRunError) {
      <section class="mb-4 grid gap-3 md:grid-cols-3">
        <div class="rounded-card border border-border/60 bg-surface-low p-3">
          <p class="ba-label">Active run</p>
          <p class="ba-data mt-2 text-text">{{ selectedRunId || '—' }}</p>
        </div>
        <div class="rounded-card border border-border/60 bg-surface-low p-3">
          <p class="ba-label">Polling</p>
          <div class="mt-2 flex items-center gap-2">
            <ba-status-badge
              [label]="isPolling ? 'Live polling active' : 'Polling stopped'"
              [tone]="isPolling ? 'live' : 'default'"
            ></ba-status-badge>
          </div>
        </div>
        <div class="rounded-card border border-border/60 bg-surface-low p-3">
          <p class="ba-label">Last updated</p>
          <p class="ba-data mt-2 text-text">{{ lastUpdatedAt || '—' }}</p>
        </div>
      </section>
    }

    @if (startRunError) {
      <div class="mb-4">
        <ba-error-state
          label="Run start failed"
          [message]="startRunError"
        ></ba-error-state>
      </div>
    }

    @if (isLoading) {
      <ba-section-card>
        <div class="p-4">
          <ba-loading-state message="Chargement des runs d’analyse..."></ba-loading-state>
        </div>
      </ba-section-card>
    } @else if (errorMessage) {
      <ba-error-state
        label="Analysis API unavailable"
        [message]="errorMessage"
      ></ba-error-state>
    } @else if (runs.length === 0) {
      <ba-empty-state
        label="No analysis runs"
        message="Aucun job n’est présent en mémoire. Lance un run via l’API pour alimenter cette page."
      ></ba-empty-state>
    } @else {
      <section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        @for (kpi of kpis; track kpi.label) {
          <ba-kpi-card
            [label]="kpi.label"
            [value]="kpi.value"
            [status]="kpi.status || ''"
            [tone]="kpi.tone || 'default'"
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
              <ba-status-badge [label]="activeRuns.length + ' active'" tone="live"></ba-status-badge>
              <ba-status-badge [label]="failedRuns.length + ' failed'" tone="danger"></ba-status-badge>
            </div>
          </div>

          @if (activeRuns.length > 0) {
            <div class="grid gap-4 p-4 md:grid-cols-2">
              @for (run of activeRuns; track run.run_id) {
                <article class="rounded-card border border-border/60 bg-background/60 p-4">
                  <div class="flex items-start justify-between gap-4">
                    <div>
                      <p class="ba-label">Run ID</p>
                      <h4 class="ba-data mt-2 text-base text-text">{{ run.run_id }}</h4>
                    </div>
                    <ba-status-badge [label]="run.status" [tone]="toneFor(run.status)"></ba-status-badge>
                  </div>
                  <div class="mt-4 h-2 overflow-hidden rounded-full bg-surface-high">
                    <div class="h-full rounded-full bg-accent shadow-glow" [style.width.%]="run.progress"></div>
                  </div>
                  <dl class="mt-4 grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt class="ba-label">Progress</dt>
                      <dd class="ba-data mt-1 text-text">{{ run.progress }}%</dd>
                    </div>
                    <div>
                      <dt class="ba-label">Steps</dt>
                      <dd class="ba-data mt-1 text-text">{{ run.completed_steps }} / {{ run.step_count }}</dd>
                    </div>
                    <div>
                      <dt class="ba-label">Target</dt>
                      <dd class="mt-1 text-muted">{{ run.target_date || '—' }}</dd>
                    </div>
                    <div>
                      <dt class="ba-label">Picks</dt>
                      <dd class="ba-data mt-1 text-success">{{ run.picks_count ?? '—' }}</dd>
                    </div>
                  </dl>
                </article>
              }
            </div>
          } @else {
            <div class="p-4">
              <ba-empty-state
                label="No active runs"
                message="Les runs connus sont terminés, échoués ou en attente."
              ></ba-empty-state>
            </div>
          }
        </ba-section-card>

        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Analysis timeline</p>
            <h3 class="mt-1 text-sm font-semibold text-text">{{ selectedRunTitle }}</h3>
          </div>
          <div class="p-4">
            @if (timeline.length > 0) {
              <ba-timeline [items]="timeline"></ba-timeline>
            } @else {
              <ba-empty-state
                label="No timeline"
                message="Ce run ne contient pas encore d’étapes."
              ></ba-empty-state>
            }
          </div>
        </ba-section-card>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <div class="space-y-4">
          <ba-data-table
            title="Runs table"
            subtitle="Runs exposés par la façade analysis au-dessus des jobs existants."
            [columns]="runColumns"
            [rows]="runRows"
          ></ba-data-table>

          @if (failedRuns.length > 0) {
            <ba-error-state
              label="Failed run detected"
              [message]="failedRuns.length + ' run(s) en erreur ou échoués dans les jobs connus.'"
            ></ba-error-state>
          }
        </div>

        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Scheduled scans</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Planned for a later Lot 1 slice</h3>
          </div>
          <div class="p-4">
            <ba-empty-state
              label="Schedule API planned"
              message="La façade actuelle couvre runs, timeline et logs. Les scans planifiés seront ajoutés ensuite."
            ></ba-empty-state>
          </div>
        </ba-section-card>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Filters</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Client-side view</h3>
          </div>
          <div class="grid gap-3 p-4 sm:grid-cols-3 xl:grid-cols-1">
            <button type="button" class="ba-tool text-left">Status: all</button>
            <button type="button" class="ba-tool text-left">Runs: {{ runs.length }}</button>
            <button type="button" class="ba-tool text-left">Selected: {{ selectedRunId || 'none' }}</button>
          </div>
        </ba-section-card>

        <ba-log-console
          label="Recent logs"
          title="Analysis pipeline output"
          [entries]="logs"
        ></ba-log-console>
      </section>
    }
  `
})
export class AnalysisPage implements OnInit, OnDestroy {
  private readonly analysisApi = inject(AnalysisApiService);
  private readonly betautoApi = inject(BetautoApiService);
  private pollingSubscription?: Subscription;

  protected isLoading = true;
  protected isStartingRun = false;
  protected isPolling = false;
  protected errorMessage = '';
  protected startRunError = '';
  protected lastUpdatedAt = '';
  protected runs: AnalysisRunListItem[] = [];
  protected selectedRun?: AnalysisRun;
  protected selectedRunId = '';
  protected timeline: TimelineItem[] = [];
  protected logs: LogEntry[] = [];

  protected readonly runColumns: DataTableColumn[] = [
    { key: 'id', label: 'Run ID', data: true },
    { key: 'date', label: 'Created', data: true },
    { key: 'target', label: 'Target', data: true },
    { key: 'progress', label: 'Progress', align: 'right', data: true },
    { key: 'steps', label: 'Steps', align: 'right', data: true },
    { key: 'picks', label: 'Picks', align: 'right', data: true }
  ];

  ngOnInit(): void {
    this.loadRuns();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  protected get activeRuns(): AnalysisRunListItem[] {
    return this.runs.filter((run) => ['running', 'active'].includes(run.status.toLowerCase()));
  }

  protected get failedRuns(): AnalysisRunListItem[] {
    return this.runs.filter((run) => ['failed', 'error'].includes(run.status.toLowerCase()) || run.failed_steps > 0);
  }

  protected get kpis(): AnalysisKpi[] {
    const completed = this.runs.filter((run) => ['completed', 'done', 'success', 'succeeded'].includes(run.status.toLowerCase()));
    const averageProgress = this.runs.length
      ? Math.round(this.runs.reduce((sum, run) => sum + run.progress, 0) / this.runs.length)
      : 0;

    return [
      { label: 'Known runs', value: String(this.runs.length), status: 'API', tone: 'default' },
      { label: 'Active runs', value: String(this.activeRuns.length), status: 'Live', tone: this.activeRuns.length ? 'live' : 'default' },
      { label: 'Completed', value: String(completed.length), status: 'Done', tone: 'success' },
      { label: 'Failed runs', value: String(this.failedRuns.length), status: this.failedRuns.length ? 'Review' : 'Clear', tone: this.failedRuns.length ? 'danger' : 'success' },
      { label: 'Avg progress', value: `${averageProgress}%`, status: 'Jobs', tone: 'default' }
    ];
  }

  protected get runRows(): DataTableRow[] {
    return this.runs.map((run) => ({
      cells: {
        id: run.run_id,
        date: formatApiDate(run.created_at),
        target: run.target_date || '—',
        progress: `${run.progress}%`,
        steps: `${run.completed_steps}/${run.step_count}`,
        picks: run.picks_count ?? '—'
      },
      status: run.status,
      statusTone: this.toneFor(run.status)
    }));
  }

  protected get selectedRunTitle(): string {
    if (!this.selectedRunId) {
      return 'No run selected';
    }

    return this.selectedRun ? `${this.selectedRunId} · ${this.selectedRun.status}` : `${this.selectedRunId} timeline`;
  }

  protected toneFor(status: string): 'default' | 'success' | 'warning' | 'danger' | 'live' {
    return statusToTone(status);
  }

  protected startRun(): void {
    if (this.isStartingRun) {
      return;
    }

    this.isStartingRun = true;
    this.startRunError = '';

    this.betautoApi.runPipeline({ date: '2026-04-25' }).pipe(
      catchError((error: unknown) => {
        this.startRunError = this.errorToMessage(error);
        return of(null);
      })
    ).subscribe((response) => {
      this.isStartingRun = false;

      if (!response) {
        return;
      }

      this.selectedRunId = response.job_id;
      this.loadRuns(response.job_id, false);
    });
  }

  private loadRuns(preferredRunId = '', showLoading = true): void {
    this.isLoading = showLoading;
    this.errorMessage = '';

    this.analysisApi.getRuns().pipe(
      catchError((error: unknown) => {
        this.errorMessage = this.errorToMessage(error);
        return of([]);
      })
    ).subscribe((runs) => {
      this.runs = runs;
      const preferredRun = preferredRunId ? runs.find((run) => run.run_id === preferredRunId) : undefined;
      const currentRun = this.selectedRunId ? runs.find((run) => run.run_id === this.selectedRunId) : undefined;
      this.selectedRunId = preferredRun?.run_id || currentRun?.run_id || runs[0]?.run_id || '';

      if (!this.selectedRunId || this.errorMessage) {
        this.isLoading = false;
        this.stopPolling();
        return;
      }

      this.loadSelectedRunDetails(this.selectedRunId);
    });
  }

  private loadSelectedRunDetails(runId: string): void {
    forkJoin({
      run: this.analysisApi.getRun(runId),
      timeline: this.analysisApi.getTimeline(runId),
      logs: this.analysisApi.getLogs(runId)
    }).pipe(
      catchError((error: unknown) => {
        this.errorMessage = this.errorToMessage(error);
        return of({ run: undefined, timeline: [], logs: [] });
      })
    ).subscribe(({ run, timeline, logs }) => {
      this.selectedRun = run;
      this.timeline = timeline.map((step) => this.toTimelineItem(step));
      this.logs = logs.map((entry) => this.toLogEntry(entry));
      this.lastUpdatedAt = formatApiDate(new Date().toISOString());
      this.isLoading = false;
      this.updatePollingState(run?.status);
    });
  }

  private refreshSelectedRun(): void {
    if (!this.selectedRunId) {
      this.stopPolling();
      return;
    }

    forkJoin({
      runs: this.analysisApi.getRuns(),
      run: this.analysisApi.getRun(this.selectedRunId),
      timeline: this.analysisApi.getTimeline(this.selectedRunId),
      logs: this.analysisApi.getLogs(this.selectedRunId)
    }).pipe(
      catchError((error: unknown) => {
        this.errorMessage = this.errorToMessage(error);
        this.stopPolling();
        return of(null);
      })
    ).subscribe((snapshot) => {
      if (!snapshot) {
        return;
      }

      this.runs = snapshot.runs;
      this.selectedRun = snapshot.run;
      this.timeline = snapshot.timeline.map((step) => this.toTimelineItem(step));
      this.logs = snapshot.logs.map((entry) => this.toLogEntry(entry));
      this.lastUpdatedAt = formatApiDate(new Date().toISOString());
      this.updatePollingState(snapshot.run.status);
    });
  }

  private updatePollingState(status: string | undefined): void {
    const normalized = String(status || '').toLowerCase();
    if (['running', 'active', 'pending'].includes(normalized)) {
      this.startPolling();
      return;
    }

    if (['completed', 'done', 'success', 'succeeded', 'failed', 'error', 'skipped'].includes(normalized)) {
      this.stopPolling();
    }
  }

  private startPolling(): void {
    if (this.pollingSubscription) {
      this.isPolling = true;
      return;
    }

    this.isPolling = true;
    this.pollingSubscription = interval(3000).subscribe(() => this.refreshSelectedRun());
  }

  private stopPolling(): void {
    this.pollingSubscription?.unsubscribe();
    this.pollingSubscription = undefined;
    this.isPolling = false;
  }

  private toTimelineItem(step: AnalysisTimelineStep): TimelineItem {
    return {
      title: step.title,
      meta: step.status,
      description: step.message || 'No message.',
      tone: statusToTone(step.status)
    };
  }

  private toLogEntry(entry: AnalysisLogEntry): LogEntry {
    return {
      time: formatApiDate(entry.at),
      level: this.logLevel(entry.level),
      message: entry.message
    };
  }

  private logLevel(level: string): LogEntry['level'] {
    if (level === 'success' || level === 'warning') {
      return level;
    }

    if (level === 'error') {
      return 'danger';
    }

    return 'info';
  }

  private errorToMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }

    return 'Impossible de charger les runs analysis depuis l’API.';
  }
}

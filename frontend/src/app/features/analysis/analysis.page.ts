import { Component, ElementRef, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription, catchError, forkJoin, interval, of } from 'rxjs';
import { AnalysisApiService } from '../../core/api/analysis-api.service';
import { formatApiDate, statusToTone } from '../../core/api/api.mappers';
import { AnalysisLogEntry, AnalysisRun, AnalysisRunListItem, AnalysisRunOutputs, AnalysisTimelineStep } from '../../core/api/api.types';
import { BetautoApiService } from '../../core/api/betauto-api.service';
import { DataTableColumn, DataTableRow } from '../../shared/ui/data-table/data-table.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { LogConsoleComponent, LogEntry } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { RunOutputInspectorComponent } from '../../shared/ui/run-output-inspector/run-output-inspector.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';
import { TimelineComponent, TimelineItem } from '../../shared/ui/timeline/timeline.component';

interface AnalysisKpi {
  label: string;
  value: string;
  status?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'live';
}

type UiTone = 'default' | 'success' | 'warning' | 'danger' | 'live';

@Component({
  selector: 'ba-analysis-page',
  standalone: true,
  imports: [
    EmptyStateComponent,
    ErrorStateComponent,
    KpiCardComponent,
    LoadingStateComponent,
    LogConsoleComponent,
    PageHeaderComponent,
    RunOutputInspectorComponent,
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
        <label class="ba-tool flex items-center gap-2">
          <span class="ba-label normal-case tracking-normal">Target</span>
          <input
            class="bg-transparent font-data text-text outline-none"
            type="date"
            [value]="targetDate"
            (change)="setTargetDate($event)"
            aria-label="Analysis target date"
          />
        </label>
        <button
          type="button"
          class="ba-tool border-accent/60 bg-accent text-background hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
          [disabled]="isStartingRun"
          (click)="startRun()"
        >
          {{ isStartingRun ? 'Starting run...' : 'Run Analysis' }}
        </button>
        <button type="button" class="ba-tool" (click)="viewLogs()">
          View Logs
        </button>
      </div>
    </ba-page-header>

    @if (selectedRunId || isPolling || lastUpdatedAt || startRunError) {
      <section class="mb-4 grid gap-3 md:grid-cols-4">
        <div class="rounded-card border border-border/60 bg-surface-low p-3">
          <p class="ba-label">Target date</p>
          <p class="ba-data mt-2 text-text">{{ targetDate }}</p>
        </div>
        <div class="rounded-card border border-border/60 bg-surface-low p-3">
          <p class="ba-label">Active run</p>
          <p class="ba-data mt-2 text-text">{{ selectedRunId || '—' }}</p>
        </div>
        <div class="rounded-card border border-border/60 bg-surface-low p-3">
          <p class="ba-label">Polling</p>
          <div class="mt-2 flex items-center gap-2">
            <ba-status-badge
              [label]="isPolling ? 'Polling every 3s' : 'Polling stopped'"
              [tone]="isPolling ? 'live' : 'default'"
              [pulse]="isPolling"
              [showPip]="true"
            ></ba-status-badge>
          </div>
        </div>
        <div class="rounded-card border border-border/60 bg-surface-low p-3">
          <p class="ba-label">Last updated</p>
          <p class="ba-data mt-2 text-text">{{ lastUpdatedAt || '—' }}</p>
        </div>
      </section>
    }

    @if (selectedRunId || isStartingRun) {
      <section
        class="mb-4 overflow-hidden rounded-card border bg-surface-low"
        [class.border-accent/60]="isSelectedRunLive || isStartingRun"
        [class.border-success/50]="isSelectedRunSuccess"
        [class.border-danger/50]="isSelectedRunFailed"
        [class.border-border/70]="!isSelectedRunLive && !isStartingRun && !isSelectedRunSuccess && !isSelectedRunFailed"
      >
        <div class="flex flex-col gap-4 p-4 lg:flex-row lg:items-center lg:justify-between">
          <div class="flex min-w-0 items-start gap-3">
            <span class="relative mt-1 flex h-3 w-3 shrink-0">
              @if (isSelectedRunLive || isStartingRun) {
                <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-30"></span>
              }
              <span class="relative h-3 w-3 rounded-full" [class]="selectedRunPipClass"></span>
            </span>
            <div class="min-w-0">
              <p class="ba-label">{{ selectedRunEyebrow }}</p>
              <h2 class="mt-1 text-base font-semibold text-text">{{ selectedRunHeadline }}</h2>
              <p class="mt-1 text-sm text-muted">{{ selectedRunDescription }}</p>
              @if (selectedRunId) {
                <p class="ba-data mt-2 truncate text-muted">job_id {{ selectedRunId }}</p>
              }
            </div>
          </div>
          <div class="flex flex-wrap items-center gap-2">
            <ba-status-badge
              [label]="selectedRunStatusLabel"
              [tone]="selectedRunTone"
              [pulse]="isSelectedRunLive || isStartingRun"
              [showPip]="true"
            ></ba-status-badge>
            @if (selectedRun?.orchestrator_run_id) {
              <ba-status-badge [label]="'run ' + selectedRun?.orchestrator_run_id" tone="default"></ba-status-badge>
            }
            @if (selectedRun?.stop_requested) {
              <ba-status-badge label="stop requested" tone="warning" [showPip]="true"></ba-status-badge>
            }
            <ba-status-badge [label]="lastUpdatedAt ? 'Updated ' + lastUpdatedAt : 'Waiting for first update'" tone="default"></ba-status-badge>
            @if (canStopSelectedRun) {
              <button
                type="button"
                class="ba-tool border-danger/60 text-danger hover:bg-danger/10 disabled:cursor-not-allowed disabled:opacity-60"
                [disabled]="isStoppingRun"
                (click)="stopAnalysis()"
              >
                {{ isStoppingRun ? 'Stop requested...' : 'Stop Analysis' }}
              </button>
            }
          </div>
        </div>
        @if (isSelectedRunLive || isStartingRun) {
          <div class="h-1 overflow-hidden bg-background">
            <div class="h-full w-1/2 animate-pulse rounded-full bg-accent shadow-glow"></div>
          </div>
        }
      </section>
    }

    @if (selectedRunId) {
      <section class="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
        <div class="rounded-card border border-border/60 bg-surface-low p-3">
          <p class="ba-label">Matches found</p>
          <p class="ba-data mt-2 text-text">{{ totalMatchesLabel }}</p>
        </div>
        <div class="rounded-card border border-border/60 bg-surface-low p-3">
          <p class="ba-label">Analyzed</p>
          <p class="ba-data mt-2 text-text">{{ analyzedMatchesLabel }}</p>
        </div>
        <div class="rounded-card border border-border/60 bg-surface-low p-3">
          <p class="ba-label">Remaining</p>
          <p class="ba-data mt-2 text-text">{{ remainingMatchesLabel }}</p>
        </div>
        <div class="rounded-card border border-border/60 bg-surface-low p-3">
          <p class="ba-label">Current match</p>
          <p class="mt-2 truncate text-sm text-text">{{ currentMatchLabel }}</p>
        </div>
        <div class="rounded-card border border-border/60 bg-surface-low p-3">
          <p class="ba-label">Leagues / fixtures</p>
          <p class="ba-data mt-2 text-text">{{ activeLeaguesLabel }} / {{ fixturesFetchedLabel }}</p>
        </div>
      </section>
    }

    @if (stopRunError) {
      <div class="mb-4">
        <ba-error-state
          label="Stop request failed"
          [message]="stopRunError"
        ></ba-error-state>
      </div>
    }

    <section class="mb-4 rounded-card border border-border/60 bg-surface-low p-3">
      <div class="flex flex-wrap items-center gap-2">
        <span class="ba-label mr-2">State vocabulary</span>
        @for (state of stateBadges; track state.label) {
          <ba-status-badge
            [label]="state.label"
            [tone]="state.tone"
            [showPip]="true"
            [pulse]="state.label === 'running'"
          ></ba-status-badge>
        }
      </div>
    </section>

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
          <ba-loading-state
            message="Chargement des runs d’analyse..."
            detail="Lecture des jobs, timelines et logs stricts."
            [showShimmer]="true"
          ></ba-loading-state>
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
                    <ba-status-badge
                      [label]="run.status"
                      [tone]="toneFor(run.status)"
                      [pulse]="isLiveStatus(run.status)"
                      [showPip]="true"
                    ></ba-status-badge>
                  </div>
                  <div class="mt-4 h-2 overflow-hidden rounded-full bg-surface-high">
                    <div
                      class="h-full rounded-full bg-accent shadow-glow"
                      [class.animate-pulse]="isLiveStatus(run.status)"
                      [style.width.%]="run.progress"
                    ></div>
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
          <ba-section-card>
            <div class="ba-card-header">
              <h3 class="text-sm font-semibold text-text">Runs table</h3>
              <p class="mt-1 text-xs text-muted">Clique une ligne pour charger son détail, sa timeline et ses logs.</p>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full min-w-[760px] border-collapse text-left text-sm">
                <thead class="bg-surface text-muted">
                  <tr>
                    @for (column of runColumns; track column.key) {
                      <th class="ba-label px-4 py-3" [class.text-right]="column.align === 'right'">
                        {{ column.label }}
                      </th>
                    }
                    <th class="ba-label px-4 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody>
                  @for (row of runRows; track row.runId) {
                    <tr
                      class="cursor-pointer border-t border-border/60 transition hover:bg-surface-high/70"
                      [class.bg-accent/10]="row.runId === selectedRunId"
                      [class.outline]="row.runId === selectedRunId"
                      [class.outline-1]="row.runId === selectedRunId"
                      [class.outline-accent/40]="row.runId === selectedRunId"
                      (click)="selectRun(row.runId)"
                    >
                      <td class="px-4 py-3 font-data text-text">{{ row.cells['id'] }}</td>
                      <td class="px-4 py-3 font-data text-text">{{ row.cells['date'] }}</td>
                      <td class="px-4 py-3 font-data text-text">{{ row.cells['target'] }}</td>
                      <td class="px-4 py-3 text-right font-data text-text">{{ row.cells['progress'] }}</td>
                      <td class="px-4 py-3 text-right font-data text-text">{{ row.cells['steps'] }}</td>
                      <td class="px-4 py-3 text-right font-data text-text">{{ row.cells['picks'] }}</td>
                      <td class="px-4 py-3 text-right">
                        <ba-status-badge
                          [label]="row.status || 'unknown'"
                          [tone]="row.statusTone || 'default'"
                          [pulse]="isLiveStatus(row.status)"
                          [showPip]="true"
                        ></ba-status-badge>
                      </td>
                    </tr>
                  } @empty {
                    <tr>
                      <td class="px-4 py-8 text-center text-sm text-muted" colspan="7">
                        No rows available.
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </ba-section-card>

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

        <div
          #logsSection
          class="rounded-card transition"
          [class.ring-2]="isLogsFocused"
          [class.ring-accent/50]="isLogsFocused"
        >
          <ba-log-console
            label="Recent logs"
            title="Analysis pipeline output"
            [entries]="logs"
            emptyMessage="No logs yet"
            [highlightNewest]="isSelectedRunLive"
          ></ba-log-console>
        </div>
      </section>

      @if (selectedRunId) {
        <section class="mt-4">
          <ba-run-output-inspector
            [outputs]="runOutputs"
            [loading]="isOutputsLoading"
            [error]="outputsError"
          ></ba-run-output-inspector>
        </section>
      }
    }
  `
})
export class AnalysisPage implements OnInit, OnDestroy {
  private readonly analysisApi = inject(AnalysisApiService);
  private readonly betautoApi = inject(BetautoApiService);
  private readonly route = inject(ActivatedRoute);
  private pollingSubscription?: Subscription;
  private readonly visibilityHandler = () => this.handleVisibilityChange();
  private logsFocusTimeout?: ReturnType<typeof setTimeout>;
  private isRefreshingSelectedRun = false;
  private runsSignature = '';
  private selectedRunSignature = '';
  private timelineSignature = '';
  private logsSignature = '';
  private outputsSignature = '';

  @ViewChild('logsSection') private logsSection?: ElementRef<HTMLElement>;

  protected isLoading = true;
  protected isStartingRun = false;
  protected isStoppingRun = false;
  protected isPolling = false;
  protected isLogsFocused = false;
  protected errorMessage = '';
  protected startRunError = '';
  protected stopRunError = '';
  protected lastUpdatedAt = '';
  protected targetDate = this.todayIsoDate();
  protected runs: AnalysisRunListItem[] = [];
  protected selectedRun?: AnalysisRun;
  protected selectedRunId = '';
  protected timeline: TimelineItem[] = [];
  protected logs: LogEntry[] = [];
  protected runOutputs: AnalysisRunOutputs | null = null;
  protected isOutputsLoading = false;
  protected outputsError = '';

  protected readonly runColumns: DataTableColumn[] = [
    { key: 'id', label: 'Run ID', data: true },
    { key: 'date', label: 'Created', data: true },
    { key: 'target', label: 'Target', data: true },
    { key: 'progress', label: 'Progress', align: 'right', data: true },
    { key: 'steps', label: 'Steps', align: 'right', data: true },
    { key: 'picks', label: 'Picks', align: 'right', data: true }
  ];

  protected readonly stateBadges: Array<{ label: string; tone: UiTone }> = [
    { label: 'idle', tone: 'default' },
    { label: 'pending', tone: 'warning' },
    { label: 'running', tone: 'live' },
    { label: 'completed', tone: 'success' },
    { label: 'completed_no_data', tone: 'default' },
    { label: 'failed', tone: 'danger' },
    { label: 'stopped', tone: 'warning' },
    { label: 'partial', tone: 'warning' },
    { label: 'proxy', tone: 'warning' },
    { label: 'estimated', tone: 'warning' },
    { label: 'unavailable', tone: 'default' }
  ];

  ngOnInit(): void {
    document.addEventListener('visibilitychange', this.visibilityHandler);
    const runId = this.route.snapshot.queryParamMap.get('run_id') || '';
    if (runId) {
      this.selectedRunId = runId;
    }
    this.loadRuns(runId);
  }

  ngOnDestroy(): void {
    this.stopPolling();
    document.removeEventListener('visibilitychange', this.visibilityHandler);
    if (this.logsFocusTimeout) {
      clearTimeout(this.logsFocusTimeout);
    }
  }

  protected get activeRuns(): AnalysisRunListItem[] {
    return this.runs.filter((run) => ['running', 'active', 'pending'].includes(run.status.toLowerCase()));
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

  protected get runRows(): Array<DataTableRow & { runId: string }> {
    return this.runs.map((run) => ({
      runId: run.run_id,
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

  protected get selectedRunStatusLabel(): string {
    return this.isStartingRun ? 'starting' : this.selectedRun?.status || 'idle';
  }

  protected get canStopSelectedRun(): boolean {
    return Boolean(this.selectedRunId && this.isSelectedRunLive && !this.selectedRun?.stop_requested);
  }

  protected get runProgress(): Record<string, unknown> {
    return this.runOutputs?.progress || {};
  }

  protected get totalMatchesLabel(): string {
    return this.progressNumberLabel('total_matches');
  }

  protected get analyzedMatchesLabel(): string {
    return this.progressNumberLabel('analyzed_matches');
  }

  protected get remainingMatchesLabel(): string {
    const pending = this.progressNumber('pending_matches');
    const running = this.progressNumber('running_matches');
    if (pending === null && running === null) {
      return '—';
    }
    return String((pending || 0) + (running || 0));
  }

  protected get currentMatchLabel(): string {
    return String(this.runProgress['current_match_label'] || '—');
  }

  protected get activeLeaguesLabel(): string {
    const trace = this.progressObject('upstream_trace');
    const value = trace['active_leagues_count'];
    return typeof value === 'number' ? String(value) : '—';
  }

  protected get fixturesFetchedLabel(): string {
    const trace = this.progressObject('upstream_trace');
    const value = trace['fixtures_fetched_total'];
    return typeof value === 'number' ? String(value) : '—';
  }

  protected get selectedRunTone(): UiTone {
    return this.isStartingRun ? 'live' : this.toneFor(this.selectedRunStatusLabel);
  }

  protected get isSelectedRunLive(): boolean {
    return this.isLiveStatus(this.selectedRun?.status);
  }

  protected get isSelectedRunSuccess(): boolean {
    return ['completed', 'done', 'success', 'succeeded'].includes(String(this.selectedRun?.status || '').toLowerCase());
  }

  protected get isSelectedRunFailed(): boolean {
    return ['failed', 'error'].includes(String(this.selectedRun?.status || '').toLowerCase());
  }

  protected get isSelectedRunNoData(): boolean {
    return ['completed_no_data', 'no_data', 'unavailable'].includes(String(this.selectedRun?.status || '').toLowerCase());
  }

  protected get selectedRunEyebrow(): string {
    if (this.isStartingRun || this.isSelectedRunLive) {
      return 'Process active';
    }
    if (this.isSelectedRunSuccess) {
      return 'Process completed';
    }
    if (this.isSelectedRunFailed) {
      return 'Process failed';
    }
    if (this.selectedRunStatusLabel.toLowerCase() === 'stopped') {
      return 'Process stopped';
    }
    if (this.isSelectedRunNoData) {
      return 'Process completed with no data';
    }
    return 'Process state';
  }

  protected get selectedRunHeadline(): string {
    if (this.isStartingRun) {
      return 'Starting analysis run';
    }
    if (this.isSelectedRunLive) {
      return 'Analysis is actively running';
    }
    if (this.isSelectedRunSuccess) {
      return 'Analysis completed successfully';
    }
    if (this.isSelectedRunFailed) {
      return 'Analysis needs attention';
    }
    if (this.selectedRunStatusLabel.toLowerCase() === 'stopped') {
      return 'Analysis stopped by user';
    }
    if (this.isSelectedRunNoData) {
      return 'Run finished without eligible data';
    }
    return this.selectedRunId ? 'Run selected' : 'No run selected';
  }

  protected get selectedRunDescription(): string {
    if (this.isStartingRun) {
      return 'The run request has been sent; the queue will update as soon as the job is visible.';
    }
    if (this.isSelectedRunLive) {
      return 'Polling is active. Timeline and logs continue to refresh while the orchestrator works.';
    }
    if (this.isSelectedRunSuccess) {
      return 'All known steps are settled. Review the summary, picks and generated artifacts below.';
    }
    if (this.isSelectedRunFailed) {
      return this.selectedRun?.error || 'A step failed. Inspect the failed timeline entry and recent logs.';
    }
    if (this.selectedRunStatusLabel.toLowerCase() === 'stopped') {
      return 'The run stopped at a safe point. Completed match analyses remain available below.';
    }
    if (this.isSelectedRunNoData) {
      return 'The process ended normally, but no eligible fixtures, odds or selections were available for this target.';
    }
    return 'Select a run to inspect status, progression, logs and generated artifacts.';
  }

  protected get selectedRunPipClass(): string {
    const map: Record<UiTone, string> = {
      default: 'bg-muted',
      success: 'bg-success shadow-glow-success',
      warning: 'bg-warning shadow-glow-warning',
      danger: 'bg-danger',
      live: 'bg-accent shadow-glow'
    };

    return map[this.selectedRunTone];
  }

  protected toneFor(status: string): UiTone {
    return statusToTone(status);
  }

  protected startRun(): void {
    if (this.isStartingRun) {
      return;
    }

    this.isStartingRun = true;
    this.startRunError = '';

    this.betautoApi.runPipeline({ date: this.targetDate }).pipe(
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

  protected stopAnalysis(): void {
    if (!this.canStopSelectedRun || this.isStoppingRun) {
      return;
    }

    this.isStoppingRun = true;
    this.stopRunError = '';
    this.analysisApi.stopRun(this.selectedRunId).pipe(
      catchError((error: unknown) => {
        this.stopRunError = this.errorToMessage(error);
        return of(null);
      })
    ).subscribe(() => {
      this.isStoppingRun = false;
      this.refreshSelectedRun();
    });
  }

  protected selectRun(runId: string): void {
    if (runId === this.selectedRunId) {
      return;
    }

    this.selectedRunId = runId;
    this.selectedRun = undefined;
    this.timeline = [];
    this.logs = [];
    this.runOutputs = null;
    this.outputsError = '';
    this.resetSelectedRunSignatures();
    this.stopPolling();
    this.loadSelectedRunDetails(runId);
  }

  private clearSelectedRun(): void {
    this.selectedRunId = '';
    this.selectedRun = undefined;
    this.timeline = [];
    this.logs = [];
    this.runOutputs = null;
    this.outputsError = '';
    this.isOutputsLoading = false;
    this.resetSelectedRunSignatures();
    this.stopPolling();
  }

  protected viewLogs(): void {
    this.logsSection?.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    this.isLogsFocused = true;

    if (this.logsFocusTimeout) {
      clearTimeout(this.logsFocusTimeout);
    }

    this.logsFocusTimeout = setTimeout(() => {
      this.isLogsFocused = false;
    }, 1400);
  }

  protected setTargetDate(event: Event): void {
    const input = event.target as HTMLInputElement | null;
    if (input?.value) {
      this.targetDate = input.value;
    }
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
      this.setRuns(runs);
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
      run: this.analysisApi.getRun(runId).pipe(catchError(() => of(undefined))),
      timeline: this.analysisApi.getTimeline(runId).pipe(catchError(() => of([]))),
      logs: this.analysisApi.getLogs(runId).pipe(catchError(() => of([])))
    }).pipe(
      catchError((error: unknown) => {
        this.errorMessage = this.errorToMessage(error);
        return of({ run: undefined, timeline: [], logs: [] });
      })
    ).subscribe(({ run, timeline, logs }) => {
      if (this.selectedRunId !== runId) {
        return;
      }

      if (!run) {
        if (this.selectedRunId === runId) {
          this.clearSelectedRun();
        }
        this.isLoading = false;
        return;
      }

      this.setSelectedRun(run);
      this.setTimeline(timeline);
      this.setLogs(logs);
      this.lastUpdatedAt = formatApiDate(new Date().toISOString());
      this.isLoading = false;
      this.updatePollingState(run?.status);
      this.loadRunOutputs(runId);
    });
  }

  private loadRunOutputs(runId: string, options: { silent?: boolean } = {}): void {
    if (!options.silent) {
      this.isOutputsLoading = true;
      this.outputsError = '';
    }

    this.analysisApi.getRunOutputs(runId).pipe(
      catchError((error: unknown) => {
        if (!options.silent) {
          this.outputsError = this.errorToMessage(error);
        }
        return of(null);
      })
    ).subscribe((outputs) => {
      if (this.selectedRunId !== runId) {
        return;
      }

      if (outputs) {
        this.setRunOutputs(outputs);
        this.outputsError = '';
      }
      if (!options.silent) {
        this.isOutputsLoading = false;
      }
    });
  }

  private refreshSelectedRun(): void {
    if (!this.selectedRunId || document.hidden) {
      this.stopPolling();
      return;
    }

    if (this.isRefreshingSelectedRun) {
      return;
    }

    const requestedRunId = this.selectedRunId;
    this.isRefreshingSelectedRun = true;

    this.analysisApi.getRuns().pipe(
      catchError((error: unknown) => {
        this.errorMessage = this.errorToMessage(error);
        this.stopPolling();
        return of([]);
      })
    ).subscribe((runs) => {
      this.setRuns(runs);
      const selectedStillExists = runs.some((run) => run.run_id === this.selectedRunId);
      if (!selectedStillExists) {
        const fallbackRunId = runs[0]?.run_id || '';
        if (!fallbackRunId) {
          this.clearSelectedRun();
          this.isRefreshingSelectedRun = false;
          return;
        }
        this.selectedRunId = fallbackRunId;
      }

      if (!this.selectedRunId) {
        this.clearSelectedRun();
        this.isRefreshingSelectedRun = false;
        return;
      }

      this.refreshSelectedRunDetails(this.selectedRunId, requestedRunId);
    });
  }

  private refreshSelectedRunDetails(runId: string, requestedRunId: string): void {
    forkJoin({
      run: this.analysisApi.getRun(runId).pipe(catchError(() => of(undefined))),
      timeline: this.analysisApi.getTimeline(runId).pipe(catchError(() => of([]))),
      logs: this.analysisApi.getLogs(runId).pipe(catchError(() => of([]))),
      outputs: this.analysisApi.getRunOutputs(runId).pipe(catchError(() => of(null)))
    }).subscribe(({ run, timeline, logs, outputs }) => {
      this.isRefreshingSelectedRun = false;
      if (this.selectedRunId !== runId && this.selectedRunId !== requestedRunId) {
        return;
      }
      if (!run) {
        if (this.selectedRunId === runId) {
          this.clearSelectedRun();
        }
        return;
      }

      this.setSelectedRun(run);
      this.setTimeline(timeline);
      this.setLogs(logs);
      if (outputs) {
        this.setRunOutputs(outputs);
        this.outputsError = '';
      }
      this.lastUpdatedAt = formatApiDate(new Date().toISOString());
      this.updatePollingState(run.status);
    });
  }

  private updatePollingState(status: string | undefined): void {
    const normalized = String(status || '').toLowerCase();
    if (['running', 'active', 'pending'].includes(normalized) && !document.hidden) {
      this.startPolling();
      return;
    }

    if (['completed', 'done', 'success', 'succeeded', 'failed', 'error', 'skipped', 'stopped', 'cancelled', 'interrupted'].includes(normalized)) {
      this.stopPolling();
    }
  }

  private startPolling(): void {
    if (!this.selectedRunId || document.hidden) {
      this.isPolling = false;
      return;
    }

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

  private handleVisibilityChange(): void {
    if (document.hidden) {
      this.stopPolling();
      return;
    }

    if (this.selectedRunId && this.isLiveStatus(this.selectedRun?.status)) {
      this.refreshSelectedRun();
      this.startPolling();
    }
  }

  protected isLiveStatus(status: string | undefined): boolean {
    return ['running', 'active', 'pending'].includes(String(status || '').toLowerCase());
  }

  private progressNumber(key: string): number | null {
    const value = this.runProgress[key];
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  }

  private progressNumberLabel(key: string): string {
    const value = this.progressNumber(key);
    return value === null ? '—' : String(value);
  }

  private progressObject(key: string): Record<string, unknown> {
    const value = this.runProgress[key];
    return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
  }

  private todayIsoDate(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private toTimelineItem(step: AnalysisTimelineStep): TimelineItem {
    return {
      id: step.id || `${step.title}:${step.status}`,
      title: step.title,
      meta: step.status,
      description: step.message || 'No message.',
      tone: statusToTone(step.status)
    };
  }

  private toLogEntry(entry: AnalysisLogEntry): LogEntry {
    return {
      id: `${entry.at || ''}:${entry.level}:${entry.message}`,
      time: formatApiDate(entry.at),
      level: this.logLevel(entry.level),
      message: entry.message
    };
  }

  private toRecentLogEntries(entries: AnalysisLogEntry[]): LogEntry[] {
    return [...entries]
      .filter((entry) => String(entry.message || '').trim().length > 0)
      .map((entry) => this.toLogEntry(entry))
      .reverse();
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

  private setRuns(runs: AnalysisRunListItem[]): void {
    const signature = this.stringifyStable(runs);
    if (signature === this.runsSignature) {
      return;
    }
    this.runsSignature = signature;
    this.runs = runs;
  }

  private setSelectedRun(run: AnalysisRun): void {
    const signature = this.stringifyStable(run);
    if (signature === this.selectedRunSignature) {
      return;
    }
    this.selectedRunSignature = signature;
    this.selectedRun = run;
  }

  private setTimeline(steps: AnalysisTimelineStep[]): void {
    const signature = this.stringifyStable(steps);
    if (signature === this.timelineSignature) {
      return;
    }
    this.timelineSignature = signature;
    this.timeline = steps.map((step) => this.toTimelineItem(step));
  }

  private setLogs(entries: AnalysisLogEntry[]): void {
    const visibleEntries = entries.filter((entry) => String(entry.message || '').trim().length > 0);
    const signature = this.stringifyStable(visibleEntries);
    if (signature === this.logsSignature) {
      return;
    }
    this.logsSignature = signature;
    this.logs = this.toRecentLogEntries(visibleEntries);
  }

  private setRunOutputs(outputs: AnalysisRunOutputs | null): void {
    const signature = this.stringifyStable(outputs);
    if (signature === this.outputsSignature) {
      return;
    }
    this.outputsSignature = signature;
    this.runOutputs = outputs;
  }

  private resetSelectedRunSignatures(): void {
    this.selectedRunSignature = '';
    this.timelineSignature = '';
    this.logsSignature = '';
    this.outputsSignature = '';
  }

  private stringifyStable(value: unknown): string {
    return JSON.stringify(value ?? null);
  }
}

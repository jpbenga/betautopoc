import { Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';

import { CostsApiService } from '../../core/api/costs-api.service';
import {
  CostAlert,
  CostAlertsResponse,
  CostBreakdownItem,
  CostBreakdownResponse,
  CostNoDataResponse,
  CostRunItem,
  CostRunListResponse,
  CostSummary,
  CostTrendResponse
} from '../../core/api/api.types';
import { ChartCardComponent, ChartPoint } from '../../shared/ui/chart-card/chart-card.component';
import { DataTableColumn, DataTableComponent, DataTableRow } from '../../shared/ui/data-table/data-table.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { LogConsoleComponent, LogEntry } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { QuotaGaugeComponent } from '../../shared/ui/quota-gauge/quota-gauge.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';

type UiTone = 'default' | 'success' | 'warning' | 'danger' | 'live';

interface CostKpi {
  label: string;
  value: string;
  status: string;
  tone: UiTone;
}

@Component({
  selector: 'ba-api-costs-page',
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
    QuotaGaugeComponent,
    SectionCardComponent,
    StatusBadgeComponent
  ],
  template: `
    <ba-page-header
      eyebrow="Infrastructure & Costs"
      title="API Usage & Cost Control"
      subtitle="Suivi des coûts, quotas et consommation des APIs utilisées par BetAuto."
    >
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="ba-tool border-accent/60 bg-accent text-background hover:bg-accent-strong"
          (click)="loadCosts()"
        >
          Refresh
        </button>
        <button type="button" class="ba-tool">
          Export report
        </button>
      </div>
    </ba-page-header>

    @if (isLoading) {
      <section class="mt-4 rounded-card border border-border bg-surface-low p-4">
        <ba-loading-state message="Loading estimated costs from run artifacts..."></ba-loading-state>
      </section>
    } @else if (error) {
      <section class="mt-4">
        <ba-error-state label="Costs API error" [message]="error"></ba-error-state>
      </section>
    } @else if (isNoData) {
      <section class="mt-4">
        <ba-empty-state
          label="No cost data available yet"
          message="No run_summary.json artifact was found under data/orchestrator_runs."
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

      <section class="mt-4 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <div class="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
          <ba-quota-gauge
            label="OpenAI estimate"
            [used]="openAiCostCents"
            [limit]="openAiBudgetCents"
            caption="Estimated cents versus local monthly guardrail."
          ></ba-quota-gauge>
          <ba-quota-gauge
            label="API-Football estimate"
            [used]="apiFootballRequests"
            [limit]="10000"
            caption="Estimated match-context requests from run_summary only."
          ></ba-quota-gauge>
          <ba-quota-gauge
            label="Browser Use estimate"
            [used]="browserUseRuns"
            [limit]="500"
            caption="Placeholder because Browser Use is not active in orchestrator API mode."
          ></ba-quota-gauge>
        </div>

        <ba-chart-card
          label="Cost trend"
          title="Artifact estimate"
          [value]="formatMoney(summary?.total_cost_today)"
          caption="Estimated from run_summary.json only. No provider billing call is made."
          [points]="costTrend"
        ></ba-chart-card>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Cost breakdown</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Service-level estimates</h3>
          </div>
          <div class="p-4">
            <ba-data-table
              [columns]="breakdownColumns"
              [rows]="breakdownRows"
            ></ba-data-table>
          </div>
        </ba-section-card>

        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Alerts</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Simple threshold checks</h3>
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

      <section class="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ba-data-table
          title="Cost per run"
          subtitle="Estimated cost profile for strict orchestrator run artifacts."
          [columns]="runCostColumns"
          [rows]="runCostRows"
        ></ba-data-table>

        <ba-log-console
          label="Cost logs"
          title="Estimator events"
          [entries]="logs"
        ></ba-log-console>
      </section>

      @if (summary?.estimation_method) {
        <p class="mt-4 text-xs text-muted">{{ summary?.estimation_method }}</p>
      }
    }
  `
})
export class ApiCostsPage implements OnInit {
  private readonly costsApi = inject(CostsApiService);

  protected isLoading = true;
  protected error = '';
  protected isNoData = false;
  protected summary: CostSummary | null = null;
  protected runs: CostRunItem[] = [];
  protected trend: CostTrendResponse | null = null;
  protected breakdown: CostBreakdownItem[] = [];
  protected alerts: CostAlert[] = [];

  protected readonly breakdownColumns: DataTableColumn[] = [
    { key: 'service', label: 'Service' },
    { key: 'requests', label: 'Estimated requests', align: 'right', data: true },
    { key: 'cost', label: 'Estimated cost', align: 'right', data: true },
    { key: 'average', label: 'Avg cost/request', align: 'right', data: true }
  ];

  protected readonly runCostColumns: DataTableColumn[] = [
    { key: 'id', label: 'Run ID', data: true },
    { key: 'target', label: 'Target', data: true },
    { key: 'matches', label: 'Matches', align: 'right', data: true },
    { key: 'tokens', label: 'Tokens', align: 'right', data: true },
    { key: 'cost', label: 'Cost', align: 'right', data: true },
    { key: 'duration', label: 'Duration', align: 'right', data: true }
  ];

  ngOnInit(): void {
    this.loadCosts();
  }

  protected loadCosts(): void {
    this.isLoading = true;
    this.error = '';
    this.isNoData = false;
    forkJoin({
      summary: this.costsApi.getSummary(),
      runs: this.costsApi.getRuns(),
      trend: this.costsApi.getTrend('7d'),
      breakdown: this.costsApi.getBreakdown(),
      alerts: this.costsApi.getAlerts()
    }).subscribe({
      next: ({ summary, runs, trend, breakdown, alerts }) => {
        if (this.noData(summary) || this.noData(runs)) {
          this.isNoData = true;
          this.isLoading = false;
          return;
        }
        this.summary = summary;
        this.runs = (runs as CostRunListResponse).runs;
        this.trend = this.noData(trend) ? null : trend;
        this.breakdown = this.noData(breakdown) ? [] : (breakdown as CostBreakdownResponse).services;
        this.alerts = this.noData(alerts) ? [] : (alerts as CostAlertsResponse).alerts;
        this.isLoading = false;
      },
      error: (error: unknown) => {
        this.error = this.errorMessage(error);
        this.isLoading = false;
      }
    });
  }

  protected get kpis(): CostKpi[] {
    return [
      { label: 'Cost today', value: this.formatMoney(this.summary?.total_cost_today), status: 'Estimate', tone: 'default' },
      { label: 'Cost 7d', value: this.formatMoney(this.summary?.total_cost_7d), status: 'Estimate', tone: 'default' },
      { label: 'Runs', value: String(this.summary?.runs_count || 0), status: 'Artifacts', tone: 'success' },
      { label: 'Avg cost/run', value: this.formatMoney(this.summary?.average_cost_per_run), status: 'Heuristic', tone: 'success' },
      { label: 'Estimated tokens', value: this.formatNumber(this.summary?.total_estimated_tokens || 0), status: 'Approx', tone: 'warning' },
      { label: 'Alerts', value: String(this.alerts.length), status: this.alerts.length ? 'Review' : 'Clear', tone: this.alerts.length ? 'warning' : 'success' }
    ];
  }

  protected get costTrend(): ChartPoint[] {
    return (this.trend?.points || []).map((point) => ({
      label: point.date.slice(5),
      value: point.cost
    }));
  }

  protected get breakdownRows(): DataTableRow[] {
    return this.breakdown.map((item) => ({
      cells: {
        service: item.service,
        requests: this.formatNumber(item.estimated_requests),
        cost: this.formatMoney(item.estimated_cost),
        average: this.formatMoney(item.average_cost_per_request)
      },
      status: item.status,
      statusTone: item.status === 'placeholder' ? 'warning' : 'success'
    }));
  }

  protected get runCostRows(): DataTableRow[] {
    return this.runs.map((run) => ({
      cells: {
        id: run.run_id,
        target: run.target_date || '—',
        matches: run.matches_analyzed_estimate,
        tokens: this.compactTokens(run.estimated_tokens),
        cost: this.formatMoney(run.estimated_cost),
        duration: run.duration_label
      },
      status: run.status || 'unknown',
      statusTone: this.statusTone(run.status)
    }));
  }

  protected get logs(): LogEntry[] {
    const alertEntries: LogEntry[] = this.alerts.map((alert, index) => ({
      time: String(index + 1).padStart(2, '0'),
      level: alert.level === 'error' ? 'danger' : 'warning',
      message: `[cost] ${alert.title}: ${alert.detail}`
    }));
    if (alertEntries.length) {
      return alertEntries;
    }
    return [{ time: '01', level: 'success', message: '[cost] no threshold alert triggered' }];
  }

  protected get openAiCostCents(): number {
    return Math.round((this.breakdown.find((item) => item.service === 'openai')?.estimated_cost || 0) * 100);
  }

  protected get openAiBudgetCents(): number {
    return 5000;
  }

  protected get apiFootballRequests(): number {
    return this.breakdown.find((item) => item.service === 'api_football')?.estimated_requests || 0;
  }

  protected get browserUseRuns(): number {
    return this.breakdown.find((item) => item.service === 'browser_use')?.estimated_requests || 0;
  }

  protected alertTone(alert: CostAlert): UiTone {
    if (alert.level === 'error') {
      return 'danger';
    }
    if (alert.level === 'warning') {
      return 'warning';
    }
    return 'default';
  }

  private noData(value: unknown): value is CostNoDataResponse {
    return Boolean(value && typeof value === 'object' && 'status' in value && (value as { status?: unknown }).status === 'no_data');
  }

  private statusTone(status: string | null | undefined): UiTone {
    const normalized = String(status || '').toLowerCase();
    if (['completed', 'done', 'success'].includes(normalized)) {
      return 'success';
    }
    if (['running', 'active'].includes(normalized)) {
      return 'live';
    }
    if (['failed', 'error'].includes(normalized)) {
      return 'danger';
    }
    return 'default';
  }

  protected formatMoney(value: number | null | undefined): string {
    const amount = typeof value === 'number' && Number.isFinite(value) ? value : 0;
    return `$${amount.toFixed(2)}`;
  }

  private formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US').format(value);
  }

  private compactTokens(value: number): string {
    if (value >= 1000) {
      return `${Math.round(value / 1000)}k`;
    }
    return String(value);
  }

  private errorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as { message?: unknown }).message || 'Unexpected costs API error.');
    }
    return 'Unexpected costs API error.';
  }
}

import { Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import {
  MarketsPerformanceResponse,
  PerformanceAccuracyResponse,
  PerformanceCalibrationResponse,
  PerformanceDataQualityResponse,
  PerformanceDriftResponse,
  PerformanceLogEntry,
  PerformanceNoDataResponse,
  PerformanceRoiResponse,
  PerformanceSummaryResponse,
  StrategiesCompareResponse
} from '../../core/api/api.types';
import { PerformanceApiService } from '../../core/api/performance-api.service';
import { CalibrationMetric, CalibrationPanelComponent } from '../../shared/ui/calibration-panel/calibration-panel.component';
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

type UiTone = 'default' | 'success' | 'warning' | 'danger' | 'live';

interface PerformanceKpi {
  label: string;
  value: string;
  status?: string;
  tone?: UiTone;
}

@Component({
  selector: 'ba-performance-page',
  standalone: true,
  imports: [
    CalibrationPanelComponent,
    ChartCardComponent,
    DataTableComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    KpiCardComponent,
    LoadingStateComponent,
    LogConsoleComponent,
    PageHeaderComponent,
    SectionCardComponent,
    StatusBadgeComponent
  ],
  template: `
    <ba-page-header
      eyebrow="AI Performance"
      title="Model Calibration & Analytics"
      subtitle="Métriques descriptives et proxys dérivés des artefacts stricts."
    >
      <div class="flex flex-wrap gap-2">
        <button type="button" class="ba-tool border-border/60 text-muted" disabled>
          Recalibrate unavailable
        </button>
        <button type="button" class="ba-tool">
          Export Analytics
        </button>
      </div>
    </ba-page-header>

    @if (loading) {
      <ba-section-card>
        <div class="p-4">
          <ba-loading-state message="Loading performance metrics..."></ba-loading-state>
        </div>
      </ba-section-card>
    } @else if (error) {
      <ba-error-state label="Performance API error" [message]="error"></ba-error-state>
    } @else if (empty) {
      <ba-empty-state
        label="No performance data available yet"
        message="Run analyses first. Performance is derived only from strict run artifacts."
      ></ba-empty-state>
    } @else {
      <section class="mb-4 grid gap-3 lg:grid-cols-3">
        <div class="rounded-card border border-warning/30 bg-warning/10 p-3 text-sm text-muted">
          <p class="ba-label text-warning">Outcome-based accuracy not available yet</p>
          <p class="mt-1">{{ accuracyMessage }}</p>
        </div>
        <div class="rounded-card border border-warning/30 bg-warning/10 p-3 text-sm text-muted">
          <p class="ba-label text-warning">No real ROI until settlement/results capability exists</p>
          <p class="mt-1">{{ roiMessage }}</p>
        </div>
        <div class="rounded-card border border-accent/30 bg-accent/10 p-3 text-sm text-muted">
          <p class="ba-label text-accent">Proxy calibration</p>
          <p class="mt-1">{{ calibrationMessage }}</p>
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

      <section class="mt-4 grid gap-4 xl:grid-cols-2">
        <ba-chart-card
          label="Confidence tiers"
          title="Candidate distribution"
          [value]="summary ? summary.total_candidates + ' candidates' : '—'"
          caption="Proxy distribution from aggregation candidates or match_analysis-derived candidates."
          [points]="confidenceTierPoints"
        ></ba-chart-card>

        <ba-chart-card
          label="Data quality"
          title="Input quality distribution"
          [value]="dataQuality ? dataQuality.candidates_with_odds_percent + '% with odds' : '—'"
          caption="Odds coverage and quality are descriptive, not outcome-based."
          [points]="dataQualityPoints"
        ></ba-chart-card>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
        <ba-calibration-panel
          label="Calibration panel"
          title="Confidence tier → filtering rate"
          [metrics]="calibrationMetrics"
        ></ba-calibration-panel>

        <ba-section-card>
          <div class="ba-card-header flex items-center justify-between gap-4">
            <div>
              <p class="ba-label">Drift detection</p>
              <h3 class="mt-1 text-sm font-semibold text-text">Distribution drift proxy</h3>
            </div>
            <ba-status-badge [label]="drift?.status || 'partial'" tone="warning"></ba-status-badge>
          </div>
          <div class="grid gap-3 p-4 sm:grid-cols-3 xl:grid-cols-1">
            @for (signal of driftSignals; track signal.dimension) {
              <div class="flex items-start justify-between gap-4 rounded-card border border-border/60 bg-background/60 p-3">
                <div>
                  <p class="ba-label">{{ signal.dimension }}</p>
                  <p class="ba-data mt-2 text-text">{{ signal.variation_score }}</p>
                  <p class="mt-1 text-xs text-muted">{{ signal.message }}</p>
                </div>
                <ba-status-badge [label]="signal.status" [tone]="signal.status === 'watch' ? 'warning' : 'success'"></ba-status-badge>
              </div>
            } @empty {
              <p class="p-4 text-sm text-muted">{{ drift?.message || 'No drift signal available.' }}</p>
            }
          </div>
        </ba-section-card>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-2">
        <ba-data-table
          title="Strategy comparison"
          subtitle="Proxy metrics grouped by strategy file/id."
          [columns]="strategyColumns"
          [rows]="strategyRows"
          emptyMessage="No strategy comparison available."
        ></ba-data-table>

        <ba-data-table
          title="Market performance"
          subtitle="Descriptive candidate metrics by market; no real accuracy/ROI."
          [columns]="marketColumns"
          [rows]="marketRows"
          emptyMessage="No market metrics available."
        ></ba-data-table>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Data quality</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Artifact health</h3>
          </div>
          <div class="grid gap-4 p-4 sm:grid-cols-3 xl:grid-cols-1">
            <ba-kpi-card
              label="Candidates with odds"
              [value]="dataQuality ? dataQuality.candidates_with_odds_percent + '%' : '—'"
              status="proxy"
              tone="warning"
            ></ba-kpi-card>
            <ba-kpi-card
              label="Missing odds rejected"
              [value]="dataQuality ? dataQuality.missing_odds_rejected_percent + '%' : '—'"
              status="proxy"
              tone="warning"
            ></ba-kpi-card>
            <ba-kpi-card
              label="Completed no data"
              [value]="dataQuality ? dataQuality.completed_no_data_runs_percent + '%' : '—'"
              status="real run status"
              tone="default"
            ></ba-kpi-card>
          </div>
        </ba-section-card>

        <ba-log-console
          label="Performance logs"
          title="Analytics caveats"
          [entries]="logs"
          emptyMessage="No performance logs available."
        ></ba-log-console>
      </section>
    }
  `
})
export class PerformancePage implements OnInit {
  private readonly performanceApi = inject(PerformanceApiService);

  protected loading = true;
  protected error = '';
  protected empty = false;
  protected summary: PerformanceSummaryResponse | null = null;
  protected accuracy: PerformanceAccuracyResponse | null = null;
  protected roi: PerformanceRoiResponse | null = null;
  protected calibration: PerformanceCalibrationResponse | null = null;
  protected strategies: StrategiesCompareResponse | null = null;
  protected markets: MarketsPerformanceResponse | null = null;
  protected drift: PerformanceDriftResponse | null = null;
  protected dataQuality: PerformanceDataQualityResponse | null = null;
  protected performanceLogs: PerformanceLogEntry[] = [];

  protected readonly strategyColumns: DataTableColumn[] = [
    { key: 'strategy', label: 'Strategy' },
    { key: 'runs', label: 'Runs', align: 'right', data: true },
    { key: 'tickets', label: 'Tickets', align: 'right', data: true },
    { key: 'confidence', label: 'Avg conf.', align: 'right', data: true },
    { key: 'odds', label: 'Avg odds', align: 'right', data: true }
  ];

  protected readonly marketColumns: DataTableColumn[] = [
    { key: 'market', label: 'Market' },
    { key: 'count', label: 'Candidates', align: 'right', data: true },
    { key: 'filtered', label: 'Filtered', align: 'right', data: true },
    { key: 'confidence', label: 'Avg conf.', align: 'right', data: true },
    { key: 'rate', label: 'Filtered rate', align: 'right', data: true }
  ];

  ngOnInit(): void {
    this.loadPerformance();
  }

  protected get kpis(): PerformanceKpi[] {
    return [
      { label: 'Total runs', value: this.value(this.summary?.total_runs), status: 'real', tone: 'success' },
      { label: 'Tickets', value: this.value(this.summary?.total_tickets), status: 'real', tone: 'success' },
      { label: 'Candidates', value: this.value(this.summary?.total_candidates), status: 'artifact', tone: 'default' },
      { label: 'Filtered candidates', value: this.value(this.summary?.filtered_candidates_count), status: 'partial', tone: 'warning' },
      { label: 'Avg confidence', value: this.percentValue(this.summary?.average_confidence_score), status: 'proxy', tone: 'warning' },
      { label: 'Acceptance proxy', value: this.percentValue(this.accuracy?.proxy_acceptance_rate), status: 'proxy', tone: 'warning' }
    ];
  }

  protected get accuracyMessage(): string {
    return this.accuracy?.accuracy_not_available_reason || 'No settled outcomes are available.';
  }

  protected get roiMessage(): string {
    return this.roi?.message || 'No real ROI until settlement/results capability exists.';
  }

  protected get calibrationMessage(): string {
    return this.calibration?.message || 'Proxy calibration derived from candidate filtering.';
  }

  protected get confidenceTierPoints(): ChartPoint[] {
    return (this.summary?.confidence_tier_distribution || []).map((item) => ({ label: item.key, value: item.count }));
  }

  protected get dataQualityPoints(): ChartPoint[] {
    return (this.dataQuality?.data_quality_distribution || this.summary?.data_quality_distribution || []).map((item) => ({
      label: item.key,
      value: item.count
    }));
  }

  protected get calibrationMetrics(): CalibrationMetric[] {
    return (this.calibration?.buckets || []).map((bucket) => ({
      label: bucket.bucket,
      value: `${bucket.filtered_rate}% filtered`,
      hint: `${bucket.filtered_count}/${bucket.candidates_count} kept, ${bucket.rejected_count} rejected`
    }));
  }

  protected get driftSignals() {
    return this.drift?.signals || [];
  }

  protected get strategyRows(): DataTableRow[] {
    return (this.strategies?.strategies || []).map((strategy) => ({
      cells: {
        strategy: strategy.strategy_key,
        runs: strategy.runs_count,
        tickets: strategy.tickets_count,
        confidence: this.percentValue(strategy.avg_confidence),
        odds: this.value(strategy.avg_estimated_odds)
      },
      status: strategy.status,
      statusTone: 'warning'
    }));
  }

  protected get marketRows(): DataTableRow[] {
    return (this.markets?.markets || []).map((market) => ({
      cells: {
        market: market.market,
        count: market.candidates_count,
        filtered: market.filtered_count,
        confidence: this.percentValue(market.avg_confidence),
        rate: this.percentValue(market.filtered_rate)
      },
      status: market.status,
      statusTone: 'warning'
    }));
  }

  protected get logs(): LogEntry[] {
    return this.performanceLogs.map((entry, index) => ({
      time: `#${index + 1}`,
      level: this.logLevel(entry.level),
      message: `[${entry.source}] ${entry.message}`
    }));
  }

  private loadPerformance(): void {
    this.loading = true;
    this.error = '';
    forkJoin({
      summary: this.performanceApi.getSummary(),
      accuracy: this.performanceApi.getAccuracy(),
      roi: this.performanceApi.getRoi(),
      calibration: this.performanceApi.getCalibration(),
      strategies: this.performanceApi.getStrategiesCompare(),
      markets: this.performanceApi.getMarkets(),
      drift: this.performanceApi.getDrift(),
      dataQuality: this.performanceApi.getDataQuality(),
      logs: this.performanceApi.getLogs()
    }).subscribe({
      next: (response) => {
        this.summary = this.isNoData(response.summary) ? null : response.summary;
        this.accuracy = this.isNoData(response.accuracy) ? null : response.accuracy;
        this.roi = this.isNoData(response.roi) ? null : response.roi;
        this.calibration = this.isNoData(response.calibration) ? null : response.calibration;
        this.strategies = this.isNoData(response.strategies) ? null : response.strategies;
        this.markets = this.isNoData(response.markets) ? null : response.markets;
        this.drift = this.isNoData(response.drift) ? null : response.drift;
        this.dataQuality = this.isNoData(response.dataQuality) ? null : response.dataQuality;
        this.performanceLogs = this.isNoData(response.logs) ? [] : response.logs.logs;
        this.empty = !this.summary;
        this.loading = false;
      },
      error: (error: unknown) => {
        this.error = error instanceof Error ? error.message : 'Unable to load performance metrics.';
        this.loading = false;
      }
    });
  }

  private isNoData(response: unknown): response is PerformanceNoDataResponse {
    return !!response && typeof response === 'object' && 'status' in response && response.status === 'no_data';
  }

  private value(value: string | number | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return '—';
    }
    return String(value);
  }

  private percentValue(value: number | null | undefined): string {
    if (value === null || value === undefined) {
      return '—';
    }
    return `${value}%`;
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
}

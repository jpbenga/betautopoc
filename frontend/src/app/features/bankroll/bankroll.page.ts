import { Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';

import { BankrollApiService } from '../../core/api/bankroll-api.service';
import {
  BankrollAlert,
  BankrollAlertsResponse,
  BankrollExposureItem,
  BankrollExposureResponse,
  BankrollNoDataResponse,
  BankrollSummary,
  BankrollTrendResponse,
  OpenPosition,
  OpenPositionsResponse,
  RiskLimit,
  RiskLimitsResponse
} from '../../core/api/api.types';
import { ChartCardComponent, ChartPoint } from '../../shared/ui/chart-card/chart-card.component';
import { DataTableColumn, DataTableComponent, DataTableRow } from '../../shared/ui/data-table/data-table.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { LogConsoleComponent, LogEntry } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { RiskCardComponent } from '../../shared/ui/risk-card/risk-card.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';

type UiTone = 'default' | 'success' | 'warning' | 'danger' | 'live';

interface BankrollKpi {
  label: string;
  value: string;
  status: string;
  tone: UiTone;
}

@Component({
  selector: 'ba-bankroll-page',
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
    RiskCardComponent,
    SectionCardComponent,
    StatusBadgeComponent
  ],
  template: `
    <ba-page-header
      eyebrow="Risk & Capital"
      title="Bankroll & Risk Management"
      subtitle="Suivi du capital, de l’exposition et des limites de risque du système."
    >
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="ba-tool border-accent/60 bg-accent text-background hover:bg-accent-strong"
          (click)="loadBankroll()"
        >
          Refresh
        </button>
        <button type="button" class="ba-tool">
          View History
        </button>
      </div>
    </ba-page-header>

    <div class="mt-4 rounded-card border border-warning/30 bg-warning/10 p-4 text-sm text-warning">
      Simulated bankroll (no real bets)
    </div>

    @if (isLoading) {
      <section class="mt-4 rounded-card border border-border bg-surface-low p-4">
        <ba-loading-state message="Loading simulated bankroll from run artifacts..."></ba-loading-state>
      </section>
    } @else if (error) {
      <section class="mt-4">
        <ba-error-state label="Bankroll API error" [message]="error"></ba-error-state>
      </section>
    } @else if (isNoData) {
      <section class="mt-4">
        <ba-empty-state
          label="No bankroll data available yet"
          message="No ticket positions were found in data/orchestrator_runs. Complete an orchestrated selection run first."
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

      <section class="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <ba-chart-card
          label="Bankroll evolution"
          title="7-day simulated capital curve"
          [value]="formatMoney(summary?.total_bankroll)"
          caption="Neutral simulation: no real win/loss result is inferred."
          [points]="bankrollTrend"
        ></ba-chart-card>

        <ba-section-card>
          <div class="ba-card-header flex items-center justify-between gap-4">
            <div>
              <p class="ba-label">Risk exposure</p>
              <h3 class="mt-1 text-sm font-semibold text-text">Current open ticket envelope</h3>
            </div>
            <ba-status-badge [label]="riskLabel" [tone]="riskTone(summary?.exposure_percent)"></ba-status-badge>
          </div>
          <div class="grid gap-4 p-4 md:grid-cols-3 xl:grid-cols-1">
            <ba-risk-card
              label="Exposure %"
              [value]="formatPercent(summary?.exposure_percent)"
              [status]="riskLabel"
              [tone]="riskTone(summary?.exposure_percent)"
              [exposure]="summary?.exposure_percent || 0"
              description="Open tickets reserve fixed simulated stake only."
            ></ba-risk-card>
            <ba-kpi-card label="Stake per ticket" [value]="formatMoney(summary?.stake_per_ticket)" status="Fixed" tone="default"></ba-kpi-card>
            <ba-kpi-card label="Open positions" [value]="openPositionsCount" status="Simulated" tone="warning"></ba-kpi-card>
          </div>
        </ba-section-card>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <ba-data-table
          title="Exposure by ticket"
          subtitle="Every ticket with picks becomes one simulated open position."
          [columns]="exposureColumns"
          [rows]="exposureRows"
        ></ba-data-table>

        <ba-data-table
          title="Open positions"
          subtitle="No result is inferred; positions remain no_result."
          [columns]="activeBetColumns"
          [rows]="activeBetRows"
        ></ba-data-table>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Risk limits</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Simulated guardrails</h3>
          </div>
          <div class="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-1">
            @for (limit of riskLimits; track limit.key) {
              <div class="flex items-start justify-between gap-4 rounded-card border border-border/60 bg-background/60 p-3">
                <div>
                  <p class="ba-label">{{ limit.key }}</p>
                  <p class="ba-data mt-2 text-text">{{ limit.value }} {{ limit.unit }}</p>
                </div>
                <ba-status-badge [label]="limit.status" [tone]="limitTone(limit)"></ba-status-badge>
              </div>
            }
          </div>
        </ba-section-card>

        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Alerts</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Risk monitoring</h3>
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

      <section class="mt-4">
        <ba-log-console
          label="Risk logs"
          title="Bankroll simulation events"
          [entries]="logs"
        ></ba-log-console>
      </section>

      @if (summary?.simulation_mode) {
        <p class="mt-4 text-xs text-muted">{{ summary?.simulation_mode }}</p>
      }
    }
  `
})
export class BankrollPage implements OnInit {
  private readonly bankrollApi = inject(BankrollApiService);

  protected isLoading = true;
  protected error = '';
  protected isNoData = false;
  protected summary: BankrollSummary | null = null;
  protected trend: BankrollTrendResponse | null = null;
  protected exposure: BankrollExposureItem[] = [];
  protected positions: OpenPosition[] = [];
  protected riskLimits: RiskLimit[] = [];
  protected alerts: BankrollAlert[] = [];

  protected readonly exposureColumns: DataTableColumn[] = [
    { key: 'ticket', label: 'Ticket' },
    { key: 'exposure', label: 'Exposure', align: 'right', data: true },
    { key: 'bankroll', label: '% bankroll', align: 'right', data: true },
    { key: 'risk', label: 'Risk' }
  ];

  protected readonly activeBetColumns: DataTableColumn[] = [
    { key: 'ticket', label: 'Ticket' },
    { key: 'stake', label: 'Stake', align: 'right', data: true },
    { key: 'odds', label: 'Odds', align: 'right', data: true },
    { key: 'return', label: 'Potential Return', align: 'right', data: true },
    { key: 'result', label: 'Result' }
  ];

  ngOnInit(): void {
    this.loadBankroll();
  }

  protected loadBankroll(): void {
    this.isLoading = true;
    this.error = '';
    this.isNoData = false;
    forkJoin({
      summary: this.bankrollApi.getSummary(),
      trend: this.bankrollApi.getTrend('7d'),
      exposure: this.bankrollApi.getExposure(),
      positions: this.bankrollApi.getOpenPositions(),
      limits: this.bankrollApi.getRiskLimits(),
      alerts: this.bankrollApi.getAlerts()
    }).subscribe({
      next: ({ summary, trend, exposure, positions, limits, alerts }) => {
        if (this.noData(summary) || this.noData(exposure) || this.noData(positions)) {
          this.isNoData = true;
          this.isLoading = false;
          return;
        }
        this.summary = summary;
        this.trend = this.noData(trend) ? null : trend;
        this.exposure = (exposure as BankrollExposureResponse).items;
        this.positions = (positions as OpenPositionsResponse).positions;
        this.riskLimits = (limits as RiskLimitsResponse).limits;
        this.alerts = this.noData(alerts) ? [] : (alerts as BankrollAlertsResponse).alerts;
        this.isLoading = false;
      },
      error: (error: unknown) => {
        this.error = this.errorMessage(error);
        this.isLoading = false;
      }
    });
  }

  protected get kpis(): BankrollKpi[] {
    return [
      { label: 'Total bankroll', value: this.formatMoney(this.summary?.total_bankroll), status: 'Simulated', tone: 'default' },
      { label: 'Available capital', value: this.formatMoney(this.summary?.available_capital), status: 'After exposure', tone: 'success' },
      { label: 'Active exposure', value: this.formatMoney(this.summary?.total_exposure), status: this.riskLabel, tone: this.riskTone(this.summary?.exposure_percent) },
      { label: 'Simulated P&L', value: this.formatMoney(this.summary?.simulated_pnl), status: 'No result', tone: 'default' },
      { label: 'ROI estimate', value: this.formatPercent(this.summary?.estimated_roi), status: 'Neutral', tone: 'default' },
      { label: 'Open positions', value: String(this.summary?.open_positions_count || 0), status: 'Tickets', tone: 'warning' }
    ];
  }

  protected get bankrollTrend(): ChartPoint[] {
    return (this.trend?.points || []).map((point) => ({
      label: point.date.slice(5),
      value: point.bankroll
    }));
  }

  protected get exposureRows(): DataTableRow[] {
    return this.exposure.map((item) => ({
      cells: {
        ticket: item.ticket_id,
        exposure: this.formatMoney(item.exposure),
        bankroll: this.formatPercent(item.bankroll_percent),
        risk: item.risk_level || '—'
      },
      status: item.risk_level || 'open',
      statusTone: this.riskLevelTone(item.risk_level)
    }));
  }

  protected get activeBetRows(): DataTableRow[] {
    return this.positions.map((position) => ({
      cells: {
        ticket: position.ticket_id,
        stake: this.formatMoney(position.stake),
        odds: this.formatOdds(position.estimated_odds),
        return: this.formatMoney(position.potential_return),
        result: position.result_status
      },
      status: position.status,
      statusTone: 'live'
    }));
  }

  protected get logs(): LogEntry[] {
    const entries: LogEntry[] = [
      { time: '01', level: 'info', message: `[risk] simulated positions loaded: ${this.positions.length}` },
      { time: '02', level: 'info', message: `[risk] fixed stake per ticket: ${this.formatMoney(this.summary?.stake_per_ticket)}` },
      { time: '03', level: this.alerts.length ? 'warning' : 'success', message: `[risk] alerts: ${this.alerts.length}` }
    ];
    return entries;
  }

  protected get riskLabel(): string {
    const exposure = this.summary?.exposure_percent || 0;
    if (exposure >= 40) {
      return 'High';
    }
    if (exposure >= 25) {
      return 'Medium';
    }
    return 'Low';
  }

  protected get openPositionsCount(): string {
    return String(this.summary?.open_positions_count || 0);
  }

  protected riskTone(value: number | null | undefined): UiTone {
    const exposure = value || 0;
    if (exposure >= 40) {
      return 'danger';
    }
    if (exposure >= 25) {
      return 'warning';
    }
    return 'success';
  }

  protected riskLevelTone(risk: string | null | undefined): UiTone {
    const normalized = String(risk || '').toLowerCase();
    if (normalized === 'high') {
      return 'danger';
    }
    if (normalized === 'medium') {
      return 'warning';
    }
    if (normalized === 'low') {
      return 'success';
    }
    return 'default';
  }

  protected alertTone(alert: BankrollAlert): UiTone {
    if (alert.level === 'danger' || alert.level === 'error') {
      return 'danger';
    }
    if (alert.level === 'warning') {
      return 'warning';
    }
    return 'default';
  }

  protected limitTone(limit: RiskLimit): UiTone {
    if (limit.status === 'armed' || limit.status === 'watch') {
      return 'warning';
    }
    if (limit.status === 'active') {
      return 'success';
    }
    return 'default';
  }

  protected formatMoney(value: number | null | undefined): string {
    const amount = typeof value === 'number' && Number.isFinite(value) ? value : 0;
    return `${amount.toFixed(2)} €`;
  }

  protected formatPercent(value: number | null | undefined): string {
    const amount = typeof value === 'number' && Number.isFinite(value) ? value : 0;
    return `${amount.toFixed(1)}%`;
  }

  protected formatOdds(value: number | null | undefined): string {
    return typeof value === 'number' && Number.isFinite(value) ? value.toFixed(2) : '—';
  }

  private noData(value: unknown): value is BankrollNoDataResponse {
    return Boolean(value && typeof value === 'object' && 'status' in value && (value as { status?: unknown }).status === 'no_data');
  }

  private errorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as { message?: unknown }).message || 'Unexpected bankroll API error.');
    }
    return 'Unexpected bankroll API error.';
  }
}

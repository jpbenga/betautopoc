import { Component } from '@angular/core';
import { ChartCardComponent, ChartPoint } from '../../shared/ui/chart-card/chart-card.component';
import { DataTableColumn, DataTableComponent, DataTableRow } from '../../shared/ui/data-table/data-table.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LogConsoleComponent, LogEntry } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { RiskCardComponent } from '../../shared/ui/risk-card/risk-card.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';

interface BankrollKpi {
  label: string;
  value: string;
  status?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'live';
  delta?: string;
  deltaTone?: 'muted' | 'success' | 'warning' | 'danger';
}

interface RiskLimit {
  label: string;
  value: string;
  status: string;
  tone: 'default' | 'success' | 'warning' | 'danger' | 'live';
}

interface RiskAlert {
  title: string;
  detail: string;
  status: string;
  tone: 'default' | 'success' | 'warning' | 'danger' | 'live';
}

@Component({
  selector: 'ba-bankroll-page',
  standalone: true,
  imports: [
    ChartCardComponent,
    DataTableComponent,
    KpiCardComponent,
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
        <button type="button" class="ba-tool border-accent/60 bg-accent text-background hover:bg-accent-strong">
          Adjust Limits
        </button>
        <button type="button" class="ba-tool">
          View History
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
      <ba-chart-card
        label="Bankroll evolution"
        title="7-day capital curve"
        value="$12,500"
        caption="Mocked curve with steady growth and controlled fluctuations."
        [points]="bankrollTrend"
      ></ba-chart-card>

      <ba-section-card>
        <div class="ba-card-header flex items-center justify-between gap-4">
          <div>
            <p class="ba-label">Risk exposure</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Current exposure envelope</h3>
          </div>
          <ba-status-badge label="Medium" tone="warning"></ba-status-badge>
        </div>
        <div class="grid gap-4 p-4 md:grid-cols-3 xl:grid-cols-1">
          <ba-risk-card
            label="Exposure %"
            value="26%"
            status="Medium"
            tone="warning"
            [exposure]="26"
            description="Active exposure is below the configured max, but close enough to monitor."
          ></ba-risk-card>
          <ba-kpi-card label="Max allowed" value="35%" status="Limit" tone="default"></ba-kpi-card>
          <ba-kpi-card label="Risk level" value="Medium" status="Watch" tone="warning"></ba-kpi-card>
        </div>
      </ba-section-card>
    </section>

    <section class="mt-4 grid gap-4 xl:grid-cols-[1fr_1fr]">
      <ba-data-table
        title="Exposure breakdown"
        subtitle="Exposure distribution by market family."
        [columns]="exposureColumns"
        [rows]="exposureRows"
      ></ba-data-table>

      <ba-data-table
        title="Active bets"
        subtitle="Open ticket positions and potential returns."
        [columns]="activeBetColumns"
        [rows]="activeBetRows"
      ></ba-data-table>
    </section>

    <section class="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <ba-section-card>
        <div class="ba-card-header">
          <p class="ba-label">Risk limits</p>
          <h3 class="mt-1 text-sm font-semibold text-text">Configured guardrails</h3>
        </div>
        <div class="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-1">
          @for (limit of riskLimits; track limit.label) {
            <div class="flex items-start justify-between gap-4 rounded-card border border-border/60 bg-background/60 p-3">
              <div>
                <p class="ba-label">{{ limit.label }}</p>
                <p class="ba-data mt-2 text-text">{{ limit.value }}</p>
              </div>
              <ba-status-badge [label]="limit.status" [tone]="limit.tone"></ba-status-badge>
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
          @for (alert of alerts; track alert.title) {
            <div class="flex items-start justify-between gap-4 rounded-card border border-border/60 bg-background/60 p-3">
              <div>
                <p class="text-sm font-medium text-text">{{ alert.title }}</p>
                <p class="mt-1 text-xs text-muted">{{ alert.detail }}</p>
              </div>
              <ba-status-badge [label]="alert.status" [tone]="alert.tone"></ba-status-badge>
            </div>
          }
        </div>
      </ba-section-card>
    </section>

    <section class="mt-4">
      <ba-log-console
        label="Risk logs"
        title="Bankroll guardrail events"
        [entries]="logs"
      ></ba-log-console>
    </section>
  `
})
export class BankrollPage {
  protected readonly kpis: BankrollKpi[] = [
    { label: 'Total bankroll', value: '$12,500', status: 'Tracked', tone: 'default' },
    { label: 'Available balance', value: '$9,200', status: 'Healthy', tone: 'success' },
    { label: 'Active exposure', value: '$3,300', status: 'Medium', tone: 'warning' },
    { label: 'Daily P&L', value: '+$420', status: 'Positive', tone: 'success', delta: '+3.4%', deltaTone: 'success' },
    { label: 'ROI (7d)', value: '+6.8%', status: 'Positive', tone: 'success' },
    { label: 'Max drawdown', value: '-4.2%', status: 'Watch', tone: 'warning' }
  ];

  protected readonly bankrollTrend: ChartPoint[] = [
    { label: 'D-6', value: 11980 },
    { label: 'D-5', value: 12120 },
    { label: 'D-4', value: 12040 },
    { label: 'D-3', value: 12280 },
    { label: 'D-2', value: 12190 },
    { label: 'D-1', value: 12340 },
    { label: 'Today', value: 12500 }
  ];

  protected readonly exposureColumns: DataTableColumn[] = [
    { key: 'market', label: 'Market' },
    { key: 'exposure', label: 'Exposure', align: 'right', data: true },
    { key: 'bankroll', label: '% bankroll', align: 'right', data: true },
    { key: 'risk', label: 'Risk' }
  ];

  protected readonly exposureRows: DataTableRow[] = [
    {
      cells: { market: 'Match Winner', exposure: '$1,500', bankroll: '12%', risk: 'medium' },
      status: 'medium',
      statusTone: 'warning'
    },
    {
      cells: { market: 'Over/Under', exposure: '$900', bankroll: '7%', risk: 'low' },
      status: 'low',
      statusTone: 'success'
    },
    {
      cells: { market: 'BTTS', exposure: '$600', bankroll: '5%', risk: 'low' },
      status: 'low',
      statusTone: 'success'
    },
    {
      cells: { market: 'Specials', exposure: '$300', bankroll: '2%', risk: 'high' },
      status: 'high',
      statusTone: 'danger'
    }
  ];

  protected readonly activeBetColumns: DataTableColumn[] = [
    { key: 'match', label: 'Match' },
    { key: 'pick', label: 'Pick' },
    { key: 'stake', label: 'Stake', align: 'right', data: true },
    { key: 'odds', label: 'Odds', align: 'right', data: true },
    { key: 'return', label: 'Potential Return', align: 'right', data: true }
  ];

  protected readonly activeBetRows: DataTableRow[] = [
    {
      cells: { match: 'Fulham vs Aston Villa', pick: 'Under 2.5', stake: '$320', odds: '1.72', return: '$550' },
      status: 'open',
      statusTone: 'live'
    },
    {
      cells: { match: 'Wolves vs Tottenham', pick: 'Tottenham vainqueur', stake: '$280', odds: '1.78', return: '$498' },
      status: 'open',
      statusTone: 'live'
    },
    {
      cells: { match: 'Arsenal vs Newcastle', pick: 'Match Winner', stake: '$500', odds: '1.91', return: '$955' },
      status: 'watch',
      statusTone: 'warning'
    }
  ];

  protected readonly riskLimits: RiskLimit[] = [
    { label: 'max_exposure_per_day', value: '40%', status: 'configured', tone: 'default' },
    { label: 'max_per_ticket', value: '$500', status: 'active', tone: 'success' },
    { label: 'max_parallel_tickets', value: '5', status: 'active', tone: 'success' },
    { label: 'stop_loss_daily', value: '-$1,000', status: 'armed', tone: 'warning' }
  ];

  protected readonly alerts: RiskAlert[] = [
    {
      title: 'Exposure nearing limit',
      detail: 'Active exposure is 26% against a 35% warning band.',
      status: 'watch',
      tone: 'warning'
    },
    {
      title: 'High-risk market detected',
      detail: 'Specials market currently carries elevated variance.',
      status: 'high',
      tone: 'danger'
    },
    {
      title: 'Drawdown threshold close',
      detail: 'Max drawdown is approaching the internal watch threshold.',
      status: '-4.2%',
      tone: 'warning'
    }
  ];

  protected readonly logs: LogEntry[] = [
    { time: '13:04', level: 'warning', message: '[risk] exposure increased to 26%' },
    { time: '13:08', level: 'success', message: '[risk] new ticket accepted' },
    { time: '13:09', level: 'success', message: '[risk] exposure limit check passed' },
    { time: '13:12', level: 'warning', message: '[risk] warning: high odds variance detected' }
  ];
}

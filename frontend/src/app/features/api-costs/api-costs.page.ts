import { Component } from '@angular/core';
import { ChartCardComponent, ChartPoint } from '../../shared/ui/chart-card/chart-card.component';
import { DataTableColumn, DataTableComponent, DataTableRow } from '../../shared/ui/data-table/data-table.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LogConsoleComponent, LogEntry } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { QuotaGaugeComponent } from '../../shared/ui/quota-gauge/quota-gauge.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';

interface CostKpi {
  label: string;
  value: string;
  status?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'live';
  delta?: string;
  deltaTone?: 'muted' | 'success' | 'warning' | 'danger';
}

interface CostAlert {
  title: string;
  detail: string;
  tone: 'default' | 'success' | 'warning' | 'danger' | 'live';
  status: string;
}

@Component({
  selector: 'ba-api-costs-page',
  standalone: true,
  imports: [
    ChartCardComponent,
    DataTableComponent,
    KpiCardComponent,
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
        <button type="button" class="ba-tool border-accent/60 bg-accent text-background hover:bg-accent-strong">
          Refresh
        </button>
        <button type="button" class="ba-tool">
          Export report
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

    <section class="mt-4 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
      <div class="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
        <ba-quota-gauge
          label="OpenAI quota"
          [used]="84"
          [limit]="100"
          caption="USD monthly budget guardrail."
        ></ba-quota-gauge>
        <ba-quota-gauge
          label="API-Football quota"
          [used]="7800"
          [limit]="10000"
          caption="Daily provider request quota."
        ></ba-quota-gauge>
        <ba-quota-gauge
          label="Browser Use quota"
          [used]="120"
          [limit]="500"
          caption="Automation session allowance."
        ></ba-quota-gauge>
      </div>

      <ba-chart-card
        label="Cost trend"
        title="Last 7 days"
        value="$3.42 today"
        caption="Mocked progression highlights today's cost increase."
        [points]="costTrend"
      ></ba-chart-card>
    </section>

    <section class="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <ba-section-card>
        <div class="ba-card-header">
          <p class="ba-label">Cost breakdown</p>
          <h3 class="mt-1 text-sm font-semibold text-text">Service-level consumption</h3>
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
          <h3 class="mt-1 text-sm font-semibold text-text">Quota and drift guardrails</h3>
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

    <section class="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
      <ba-data-table
        title="Cost per run"
        subtitle="Mocked cost profile for recent orchestrator runs."
        [columns]="runCostColumns"
        [rows]="runCostRows"
      ></ba-data-table>

      <ba-log-console
        label="Cost logs"
        title="Quota events"
        [entries]="logs"
      ></ba-log-console>
    </section>
  `
})
export class ApiCostsPage {
  protected readonly kpis: CostKpi[] = [
    { label: 'OpenAI cost today', value: '$3.42', status: 'Spike', tone: 'warning', delta: '+18%', deltaTone: 'warning' },
    { label: 'OpenAI cost month', value: '$84.12', status: 'Warning', tone: 'warning' },
    { label: 'API-Football usage', value: '78%', status: 'High', tone: 'warning' },
    { label: 'Total requests today', value: '12,340', status: 'Tracked', tone: 'default' },
    { label: 'Cost per run', value: '$0.12', status: 'Stable', tone: 'success' },
    { label: 'Estimated monthly cost', value: '$112', status: 'Projected', tone: 'default' }
  ];

  protected readonly costTrend: ChartPoint[] = [
    { label: 'D-6', value: 1.7 },
    { label: 'D-5', value: 1.9 },
    { label: 'D-4', value: 2.2 },
    { label: 'D-3', value: 2.4 },
    { label: 'D-2', value: 2.8 },
    { label: 'D-1', value: 3.1 },
    { label: 'Today', value: 3.42 }
  ];

  protected readonly breakdownColumns: DataTableColumn[] = [
    { key: 'service', label: 'Service' },
    { key: 'requests', label: 'Requests', align: 'right', data: true },
    { key: 'cost', label: 'Cost', align: 'right', data: true },
    { key: 'average', label: 'Avg cost/request', align: 'right', data: true }
  ];

  protected readonly breakdownRows: DataTableRow[] = [
    {
      cells: { service: 'OpenAI', requests: '8,200', cost: '$84.12', average: '$0.010' },
      status: 'warning',
      statusTone: 'warning'
    },
    {
      cells: { service: 'API-Football', requests: '3,900', cost: '$12.00', average: '$0.003' },
      status: 'success',
      statusTone: 'success'
    },
    {
      cells: { service: 'Browser Use', requests: '240', cost: '$4.20', average: '$0.017' },
      status: 'success',
      statusTone: 'success'
    }
  ];

  protected readonly runCostColumns: DataTableColumn[] = [
    { key: 'id', label: 'Run ID', data: true },
    { key: 'matches', label: 'Matches', align: 'right', data: true },
    { key: 'tokens', label: 'Tokens', align: 'right', data: true },
    { key: 'cost', label: 'Cost', align: 'right', data: true },
    { key: 'duration', label: 'Duration', align: 'right', data: true }
  ];

  protected readonly runCostRows: DataTableRow[] = [
    {
      cells: { id: 'f6f68d92', matches: 10, tokens: '45k', cost: '$0.18', duration: '2m17s' },
      status: 'completed',
      statusTone: 'success'
    },
    {
      cells: { id: 'dba43175', matches: 12, tokens: '52k', cost: '$0.21', duration: '2m30s' },
      status: 'completed',
      statusTone: 'success'
    },
    {
      cells: { id: 'aa12bb34', matches: 8, tokens: '30k', cost: '$0.12', duration: 'running' },
      status: 'running',
      statusTone: 'live'
    }
  ];

  protected readonly alerts: CostAlert[] = [
    {
      title: 'OpenAI quota nearing limit',
      detail: 'Monthly spend is at 84% of the configured budget.',
      tone: 'warning',
      status: '84%'
    },
    {
      title: 'API-Football usage high',
      detail: 'Daily quota is above the 70% warning threshold.',
      tone: 'warning',
      status: '78%'
    },
    {
      title: 'Cost spike detected today',
      detail: 'OpenAI usage increased versus the trailing seven-day baseline.',
      tone: 'danger',
      status: 'spike'
    }
  ];

  protected readonly logs: LogEntry[] = [
    { time: '12:04', level: 'warning', message: '[cost] openai usage increased' },
    { time: '12:08', level: 'warning', message: '[cost] api-football threshold reached' },
    { time: '12:11', level: 'success', message: '[cost] run f6f68d92 cost $0.18' },
    { time: '12:12', level: 'warning', message: '[cost] quota warning triggered' }
  ];
}

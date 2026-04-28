import { Component } from '@angular/core';
import { CalibrationMetric, CalibrationPanelComponent } from '../../shared/ui/calibration-panel/calibration-panel.component';
import { ChartCardComponent, ChartPoint } from '../../shared/ui/chart-card/chart-card.component';
import { DataTableColumn, DataTableComponent, DataTableRow } from '../../shared/ui/data-table/data-table.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LogConsoleComponent, LogEntry } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';

interface PerformanceKpi {
  label: string;
  value: string;
  status?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'live';
  delta?: string;
  deltaTone?: 'muted' | 'success' | 'warning' | 'danger';
}

interface DriftMetric {
  label: string;
  value: string;
  status: string;
  tone: 'default' | 'success' | 'warning' | 'danger' | 'live';
}

@Component({
  selector: 'ba-performance-page',
  standalone: true,
  imports: [
    CalibrationPanelComponent,
    ChartCardComponent,
    DataTableComponent,
    KpiCardComponent,
    LogConsoleComponent,
    PageHeaderComponent,
    SectionCardComponent,
    StatusBadgeComponent
  ],
  template: `
    <ba-page-header
      eyebrow="AI Performance"
      title="Model Calibration & Analytics"
      subtitle="Analyse des performances du modèle et calibration des prédictions."
    >
      <div class="flex flex-wrap gap-2">
        <button type="button" class="ba-tool border-accent/60 bg-accent text-background hover:bg-accent-strong">
          Recalibrate Model
        </button>
        <button type="button" class="ba-tool">
          Export Analytics
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

    <section class="mt-4 grid gap-4 xl:grid-cols-2">
      <ba-chart-card
        label="Accuracy trend"
        title="7-day prediction accuracy"
        value="68%"
        caption="Mocked accuracy trend with mild variation from 60% to 70%."
        [points]="accuracyTrend"
      ></ba-chart-card>

      <ba-chart-card
        label="ROI trend"
        title="7-day strategy ROI"
        value="+5.2%"
        caption="Mocked ROI trend with controlled positive and negative variation."
        [points]="roiTrend"
      ></ba-chart-card>
    </section>

    <section class="mt-4 grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
      <ba-calibration-panel
        label="Calibration panel"
        title="Confidence → real win rate"
        [metrics]="calibrationMetrics"
      ></ba-calibration-panel>

      <ba-section-card>
        <div class="ba-card-header flex items-center justify-between gap-4">
          <div>
            <p class="ba-label">Model drift detection</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Current drift posture</h3>
          </div>
          <ba-status-badge label="low drift" tone="success"></ba-status-badge>
        </div>
        <div class="grid gap-3 p-4 sm:grid-cols-3 xl:grid-cols-1">
          @for (metric of driftMetrics; track metric.label) {
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
    </section>

    <section class="mt-4 grid gap-4 xl:grid-cols-2">
      <ba-data-table
        title="Strategy performance"
        subtitle="Model results grouped by active strategy."
        [columns]="strategyColumns"
        [rows]="strategyRows"
      ></ba-data-table>

      <ba-data-table
        title="Market performance"
        subtitle="Accuracy and ROI by market family."
        [columns]="marketColumns"
        [rows]="marketRows"
      ></ba-data-table>
    </section>

    <section class="mt-4 grid gap-4 xl:grid-cols-[0.85fr_1.15fr]">
      <ba-section-card>
        <div class="ba-card-header">
          <p class="ba-label">Data quality</p>
          <h3 class="mt-1 text-sm font-semibold text-text">Input health</h3>
        </div>
        <div class="grid gap-4 p-4 sm:grid-cols-3 xl:grid-cols-1">
          <ba-kpi-card label="Data completeness" value="96%" status="High" tone="success"></ba-kpi-card>
          <ba-kpi-card label="Missing fixtures" value="2%" status="Low" tone="success"></ba-kpi-card>
          <ba-kpi-card label="API reliability" value="High" status="Stable" tone="success"></ba-kpi-card>
        </div>
      </ba-section-card>

      <ba-log-console
        label="Performance logs"
        title="Model analytics events"
        [entries]="logs"
      ></ba-log-console>
    </section>
  `
})
export class PerformancePage {
  protected readonly kpis: PerformanceKpi[] = [
    { label: 'Prediction accuracy', value: '68%', status: 'Tracked', tone: 'success' },
    { label: 'ROI global', value: '+5.2%', status: 'Positive', tone: 'success' },
    { label: 'Avg confidence', value: '78%', status: 'Slight high', tone: 'warning' },
    { label: 'Calibration score', value: '0.81', status: 'Good', tone: 'success' },
    { label: 'Winning streak', value: '6', status: 'Active', tone: 'live' },
    { label: 'Losing streak', value: '2', status: 'Contained', tone: 'default' }
  ];

  protected readonly accuracyTrend: ChartPoint[] = [
    { label: 'D-6', value: 60 },
    { label: 'D-5', value: 63 },
    { label: 'D-4', value: 61 },
    { label: 'D-3', value: 66 },
    { label: 'D-2', value: 64 },
    { label: 'D-1', value: 70 },
    { label: 'Today', value: 68 }
  ];

  protected readonly roiTrend: ChartPoint[] = [
    { label: 'D-6', value: 2.1 },
    { label: 'D-5', value: 3.4 },
    { label: 'D-4', value: 1.2 },
    { label: 'D-3', value: 4.8 },
    { label: 'D-2', value: 3.1 },
    { label: 'D-1', value: 6.0 },
    { label: 'Today', value: 5.2 }
  ];

  protected readonly calibrationMetrics: CalibrationMetric[] = [
    { label: '60% confidence', value: '58% real', hint: 'Near calibrated' },
    { label: '70% confidence', value: '65% real', hint: 'Slight overconfidence' },
    { label: '80% confidence', value: '74% real', hint: 'Overconfident band' },
    { label: '90% confidence', value: '82% real', hint: 'Needs recalibration' }
  ];

  protected readonly driftMetrics: DriftMetric[] = [
    { label: 'drift level', value: 'low', status: 'OK', tone: 'success' },
    { label: 'last recalibration', value: '3 days ago', status: 'fresh', tone: 'success' },
    { label: 'anomaly detected', value: 'false', status: 'clear', tone: 'success' }
  ];

  protected readonly strategyColumns: DataTableColumn[] = [
    { key: 'strategy', label: 'Strategy' },
    { key: 'picks', label: 'Picks', align: 'right', data: true },
    { key: 'accuracy', label: 'Accuracy', align: 'right', data: true },
    { key: 'roi', label: 'ROI', align: 'right', data: true }
  ];

  protected readonly strategyRows: DataTableRow[] = [
    {
      cells: { strategy: 'default_balanced', picks: 120, accuracy: '68%', roi: '+5.2%' },
      status: 'good',
      statusTone: 'success'
    },
    {
      cells: { strategy: 'aggressive', picks: 80, accuracy: '61%', roi: '+7.8%' },
      status: 'volatile',
      statusTone: 'warning'
    },
    {
      cells: { strategy: 'safe_low_risk', picks: 150, accuracy: '72%', roi: '+3.1%' },
      status: 'stable',
      statusTone: 'success'
    }
  ];

  protected readonly marketColumns: DataTableColumn[] = [
    { key: 'market', label: 'Market' },
    { key: 'accuracy', label: 'Accuracy', align: 'right', data: true },
    { key: 'roi', label: 'ROI', align: 'right', data: true },
    { key: 'volume', label: 'Volume' }
  ];

  protected readonly marketRows: DataTableRow[] = [
    {
      cells: { market: 'Match Winner', accuracy: '70%', roi: '+4.5%', volume: 'high' },
      status: 'good',
      statusTone: 'success'
    },
    {
      cells: { market: 'Over/Under', accuracy: '65%', roi: '+6.2%', volume: 'medium' },
      status: 'watch',
      statusTone: 'warning'
    },
    {
      cells: { market: 'BTTS', accuracy: '60%', roi: '+2.1%', volume: 'low' },
      status: 'thin data',
      statusTone: 'default'
    }
  ];

  protected readonly logs: LogEntry[] = [
    { time: '14:02', level: 'success', message: '[model] calibration score updated' },
    { time: '14:04', level: 'success', message: '[model] drift check passed' },
    { time: '14:07', level: 'info', message: '[model] new data batch processed' },
    { time: '14:10', level: 'success', message: '[model] performance stable' }
  ];
}

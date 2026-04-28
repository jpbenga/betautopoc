import { Component } from '@angular/core';
import { AgentCardComponent } from '../../shared/ui/agent-card/agent-card.component';
import { CalibrationMetric, CalibrationPanelComponent } from '../../shared/ui/calibration-panel/calibration-panel.component';
import { ChartCardComponent, ChartPoint } from '../../shared/ui/chart-card/chart-card.component';
import { DataTableColumn, DataTableComponent, DataTableRow } from '../../shared/ui/data-table/data-table.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { FormFieldComponent } from '../../shared/ui/form-field/form-field.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { LogConsoleComponent, LogEntry } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { QuotaGaugeComponent } from '../../shared/ui/quota-gauge/quota-gauge.component';
import { RiskCardComponent } from '../../shared/ui/risk-card/risk-card.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';
import { TicketCardComponent } from '../../shared/ui/ticket-card/ticket-card.component';
import { TimelineComponent, TimelineItem } from '../../shared/ui/timeline/timeline.component';

@Component({
  selector: 'ba-design-system-page',
  standalone: true,
  imports: [
    AgentCardComponent,
    CalibrationPanelComponent,
    ChartCardComponent,
    DataTableComponent,
    EmptyStateComponent,
    ErrorStateComponent,
    FormFieldComponent,
    KpiCardComponent,
    LoadingStateComponent,
    LogConsoleComponent,
    PageHeaderComponent,
    QuotaGaugeComponent,
    RiskCardComponent,
    SectionCardComponent,
    StatusBadgeComponent,
    TicketCardComponent,
    TimelineComponent
  ],
  template: `
    <ba-page-header
      eyebrow="Design system"
      title="BetAuto Analytical Interface"
      subtitle="Internal preview for the Angular/Tailwind components derived from the Stitch MCP audit."
    >
      <ba-status-badge label="Internal" tone="live"></ba-status-badge>
    </ba-page-header>

    <div class="grid gap-4 lg:grid-cols-4">
      <ba-kpi-card label="Signals" value="128" status="Live" tone="live" delta="+12.4%" deltaTone="success"></ba-kpi-card>
      <ba-kpi-card label="Exposure" value="18.2%" status="Watch" tone="warning" delta="+2.1%" deltaTone="warning"></ba-kpi-card>
      <ba-quota-gauge label="API quota" [used]="72" [limit]="100" caption="Daily usage window"></ba-quota-gauge>
      <ba-risk-card label="Risk limit" value="$4,820" status="Stable" tone="success" [exposure]="42" description="Exposure remains inside configured bankroll limits."></ba-risk-card>
    </div>

    <div class="mt-4 grid gap-4 xl:grid-cols-2">
      <ba-chart-card
        label="Performance"
        title="Signal quality"
        value="91.8%"
        caption="Compact bar preview; production screens can replace the body with a charting library."
        [points]="chartPoints"
      ></ba-chart-card>

      <ba-data-table
        title="Scheduled scans"
        subtitle="Dense rows with horizontal separators and status slot."
        [columns]="tableColumns"
        [rows]="tableRows"
      ></ba-data-table>
    </div>

    <div class="mt-4 grid gap-4 xl:grid-cols-3">
      <ba-ticket-card
        title="PSG moneyline"
        market="Football / Ligue 1"
        status="AI proposal"
        tone="default"
        odds="1.74"
        confidence="72%"
        stake="1.2u"
        summary="Reusable proposal card for future ticket screens."
      ></ba-ticket-card>

      <ba-agent-card
        name="Browser Agent 03"
        role="Browser-use"
        status="Live"
        tone="live"
        currentJob="Odds reconciliation"
        lastEvent="Navigation completed"
      ></ba-agent-card>

      <ba-timeline title="Queue timeline" [items]="timelineItems"></ba-timeline>
    </div>

    <div class="mt-4 grid gap-4 xl:grid-cols-2">
      <ba-log-console title="Browser-use monitoring" [entries]="logEntries"></ba-log-console>
      <ba-calibration-panel [metrics]="calibrationMetrics"></ba-calibration-panel>
    </div>

    <div class="mt-4 grid gap-4 xl:grid-cols-2">
      <ba-section-card>
        <div class="ba-card-header">
          <h3 class="text-sm font-semibold text-text">Forms</h3>
        </div>
        <div class="space-y-4 p-4">
          <ba-form-field label="Risk threshold" hint="Uses the shared tool input surface.">
            <input class="ba-tool w-full" value="12%" aria-label="Risk threshold" />
          </ba-form-field>
          <ba-form-field label="Provider" error="Example validation state.">
            <select class="ba-tool w-full" aria-label="Provider">
              <option>Primary odds feed</option>
            </select>
          </ba-form-field>
        </div>
      </ba-section-card>

      <ba-section-card>
        <div class="space-y-4 p-4">
          <ba-empty-state label="No tickets" message="Empty states inherit BetAuto surfaces and borders."></ba-empty-state>
          <ba-loading-state message="Synchronizing agent telemetry..."></ba-loading-state>
          <ba-error-state label="Quota warning" message="The warning body can be used for API or provider issues."></ba-error-state>
        </div>
      </ba-section-card>
    </div>
  `
})
export class DesignSystemPage {
  protected readonly chartPoints: ChartPoint[] = [
    { label: 'Mon', value: 42 },
    { label: 'Tue', value: 58 },
    { label: 'Wed', value: 49 },
    { label: 'Thu', value: 76 },
    { label: 'Fri', value: 68 }
  ];

  protected readonly tableColumns: DataTableColumn[] = [
    { key: 'id', label: 'Scan', data: true },
    { key: 'market', label: 'Market' },
    { key: 'eta', label: 'ETA', align: 'right', data: true }
  ];

  protected readonly tableRows: DataTableRow[] = [
    { cells: { id: 'SCAN-1082', market: 'Football totals', eta: '02:14' }, status: 'Live', statusTone: 'live' },
    { cells: { id: 'SCAN-1083', market: 'Tennis props', eta: '08:40' }, status: 'Queued', statusTone: 'default' },
    { cells: { id: 'SCAN-1084', market: 'Basketball spread', eta: '12:05' }, status: 'Watch', statusTone: 'warning' }
  ];

  protected readonly timelineItems: TimelineItem[] = [
    { title: 'Scan created', meta: '09:42', description: 'Scheduled by model policy.', tone: 'success' },
    { title: 'Provider wait', meta: '09:45', description: 'Awaiting odds refresh.', tone: 'warning' },
    { title: 'Agent assigned', meta: '09:48', description: 'Browser Agent 03 is active.', tone: 'live' }
  ];

  protected readonly logEntries: LogEntry[] = [
    { time: '09:42', level: 'info', message: 'Scan queued' },
    { time: '09:44', level: 'success', message: 'Provider session opened' },
    { time: '09:45', level: 'warning', message: 'Quota at 72%' }
  ];

  protected readonly calibrationMetrics: CalibrationMetric[] = [
    { label: 'Brier', value: '0.184', hint: 'Lower is better' },
    { label: 'CLV hit', value: '61.2%', hint: 'Last 7 days' },
    { label: 'Drift', value: 'Low', hint: 'Stable input mix' }
  ];
}

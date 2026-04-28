import { Component } from '@angular/core';
import { ChartCardComponent, ChartPoint } from '../../shared/ui/chart-card/chart-card.component';
import { DataTableColumn, DataTableComponent, DataTableRow } from '../../shared/ui/data-table/data-table.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LogConsoleComponent, LogEntry } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { QuotaGaugeComponent } from '../../shared/ui/quota-gauge/quota-gauge.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';
import { TicketCardComponent } from '../../shared/ui/ticket-card/ticket-card.component';
import { TimelineComponent, TimelineItem } from '../../shared/ui/timeline/timeline.component';

interface TicketKpi {
  label: string;
  value: string;
  status?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'live';
  delta?: string;
  deltaTone?: 'muted' | 'success' | 'warning' | 'danger';
}

interface FeaturedPick {
  match: string;
  market: string;
  confidence: number;
}

interface StrategyMetric {
  label: string;
  value: string;
}

@Component({
  selector: 'ba-tickets-page',
  standalone: true,
  imports: [
    ChartCardComponent,
    DataTableComponent,
    KpiCardComponent,
    LogConsoleComponent,
    PageHeaderComponent,
    QuotaGaugeComponent,
    SectionCardComponent,
    StatusBadgeComponent,
    TicketCardComponent,
    TimelineComponent
  ],
  template: `
    <ba-page-header
      eyebrow="AI Betting Tickets"
      title="Ticket Proposals"
      subtitle="Propositions de tickets générées par l’IA selon la stratégie active."
    >
      <div class="flex flex-wrap gap-2">
        <button type="button" class="ba-tool border-accent/60 bg-accent text-background hover:bg-accent-strong">
          Generate Ticket
        </button>
        <button type="button" class="ba-tool">
          View Strategy
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
      <ba-section-card>
        <div class="ba-card-header flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="ba-label">Featured proposal</p>
            <h3 class="mt-1 text-sm font-semibold text-text">ticket_001</h3>
          </div>
          <div class="flex flex-wrap gap-2">
            <ba-status-badge label="draft" tone="warning"></ba-status-badge>
            <ba-status-badge label="strategy valid" tone="success"></ba-status-badge>
          </div>
        </div>
        <div class="grid gap-4 p-4 lg:grid-cols-[0.9fr_1.1fr]">
          <ba-ticket-card
            title="2-pick balanced combo"
            market="default_football_balanced"
            status="Draft"
            tone="warning"
            odds="3.06"
            confidence="80%"
            stake="Medium risk"
            summary="Combiné équilibré respectant la fourchette cible."
          ></ba-ticket-card>

          <div class="space-y-3">
            @for (pick of featuredPicks; track pick.match + pick.market) {
              <div class="rounded-card border border-border/60 bg-background/60 p-4">
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="text-sm font-semibold text-text">{{ pick.match }}</p>
                    <p class="mt-1 text-sm text-muted">{{ pick.market }}</p>
                  </div>
                  <ba-status-badge [label]="pick.confidence + '%'" tone="success"></ba-status-badge>
                </div>
              </div>
            }
          </div>
        </div>
      </ba-section-card>

      <ba-section-card>
        <div class="ba-card-header">
          <p class="ba-label">Strategy snapshot</p>
          <h3 class="mt-1 text-sm font-semibold text-text">default_football_balanced</h3>
        </div>
        <div class="grid gap-3 p-4 sm:grid-cols-2 xl:grid-cols-1">
          @for (metric of strategyMetrics; track metric.label) {
            <div class="rounded-card border border-border/60 bg-background/60 p-3">
              <p class="ba-label">{{ metric.label }}</p>
              <p class="ba-data mt-2 text-text">{{ metric.value }}</p>
            </div>
          }
          <ba-quota-gauge
            label="Confidence guardrail"
            [used]="80"
            [limit]="100"
            caption="Featured proposal average confidence."
          ></ba-quota-gauge>
        </div>
      </ba-section-card>
    </section>

    <section class="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <ba-section-card>
        <div class="ba-card-header">
          <p class="ba-label">Ticket pipeline</p>
          <h3 class="mt-1 text-sm font-semibold text-text">Proposal generation steps</h3>
        </div>
        <div class="p-4">
          <ba-timeline [items]="pipelineItems"></ba-timeline>
        </div>
      </ba-section-card>

      <ba-chart-card
        label="Proposal quality"
        title="Confidence distribution"
        value="81%"
        caption="Mocked confidence profile across proposed tickets."
        [points]="confidenceTrend"
      ></ba-chart-card>
    </section>

    <section class="mt-4 grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
      <ba-data-table
        title="Proposals table"
        subtitle="Candidate tickets generated by the active strategy."
        [columns]="proposalColumns"
        [rows]="proposalRows"
      ></ba-data-table>

      <ba-section-card>
        <div class="ba-card-header">
          <p class="ba-label">Selection notes</p>
          <h3 class="mt-1 text-sm font-semibold text-text">AI audit trail</h3>
        </div>
        <div class="p-4">
          <ba-log-console
            label="Selection notes"
            title="Proposal reasoning"
            [entries]="selectionNotes"
          ></ba-log-console>
        </div>
      </ba-section-card>
    </section>

    <section class="mt-4">
      <ba-data-table
        title="Rejected candidates"
        subtitle="Rejected picks are retained for audit and future calibration."
        [columns]="rejectedColumns"
        [rows]="rejectedRows"
        [showStatus]="false"
      ></ba-data-table>
    </section>
  `
})
export class TicketsPage {
  protected readonly kpis: TicketKpi[] = [
    { label: 'Tickets proposed', value: '4', status: 'Generated', tone: 'success' },
    { label: 'Verified', value: '2', status: 'Checked', tone: 'success' },
    { label: 'Avg confidence', value: '81 %', status: 'Healthy', tone: 'success' },
    { label: 'Target odds', value: '2.80 - 3.50', status: 'Strategy', tone: 'default' },
    { label: 'Best estimated odds', value: '3.06', status: 'In range', tone: 'success' },
    { label: 'Risk level', value: 'Medium', status: 'Watch', tone: 'warning' }
  ];

  protected readonly featuredPicks: FeaturedPick[] = [
    { match: 'Fulham vs Aston Villa', market: 'Under 2.5', confidence: 77 },
    { match: 'Wolves vs Tottenham', market: 'Tottenham vainqueur', confidence: 84 }
  ];

  protected readonly strategyMetrics: StrategyMetric[] = [
    { label: 'strategy_id', value: 'default_football_balanced' },
    { label: 'combo_min_odds', value: '2.80' },
    { label: 'combo_max_odds', value: '3.50' },
    { label: 'max_picks', value: '5' },
    { label: 'min_pick_confidence', value: '65' },
    { label: 'allowed markets', value: 'match_winner, double_chance, goals_over_under' }
  ];

  protected readonly pipelineItems: TimelineItem[] = [
    { title: 'Match analyses completed', meta: 'completed', description: 'All candidate matches received AI analysis.', tone: 'success' },
    { title: 'Candidates filtered by strategy', meta: 'completed', description: 'Market and confidence guardrails applied.', tone: 'success' },
    { title: 'Odds range checked', meta: 'completed', description: 'Combination checked against 2.80 - 3.50 target.', tone: 'success' },
    { title: 'Risk policy applied', meta: 'completed', description: 'Medium-risk exposure accepted for draft review.', tone: 'warning' },
    { title: 'Ticket proposed', meta: 'draft', description: 'ticket_001 is ready for human validation.', tone: 'warning' },
    { title: 'Browser verification', meta: 'pending/skipped', description: 'Browser Use not launched in orchestrated mode.', tone: 'default' }
  ];

  protected readonly confidenceTrend: ChartPoint[] = [
    { label: 'ticket_001', value: 80 },
    { label: 'ticket_002', value: 76 },
    { label: 'ticket_003', value: 88 },
    { label: 'ticket_004', value: 84 }
  ];

  protected readonly proposalColumns: DataTableColumn[] = [
    { key: 'id', label: 'Ticket ID', data: true },
    { key: 'picks', label: 'Picks', align: 'right', data: true },
    { key: 'odds', label: 'Estimated Odds', align: 'right', data: true },
    { key: 'confidence', label: 'Confidence', align: 'right', data: true },
    { key: 'risk', label: 'Risk' }
  ];

  protected readonly proposalRows: DataTableRow[] = [
    {
      cells: { id: 'ticket_001', picks: '2 picks', odds: '3.06', confidence: '80%', risk: 'medium' },
      status: 'draft',
      statusTone: 'warning'
    },
    {
      cells: { id: 'ticket_002', picks: '3 picks', odds: '3.42', confidence: '76%', risk: 'medium' },
      status: 'proposed',
      statusTone: 'success'
    },
    {
      cells: { id: 'ticket_003', picks: '1 pick', odds: '1.85', confidence: '88%', risk: 'low' },
      status: 'rejected strategy',
      statusTone: 'danger'
    },
    {
      cells: { id: 'ticket_004', picks: '2 picks', odds: '2.13', confidence: '84%', risk: 'low' },
      status: 'out of range',
      statusTone: 'warning'
    }
  ];

  protected readonly rejectedColumns: DataTableColumn[] = [
    { key: 'match', label: 'Match' },
    { key: 'market', label: 'Market' },
    { key: 'reason', label: 'Reason' },
    { key: 'confidence', label: 'Confidence', align: 'right', data: true }
  ];

  protected readonly rejectedRows: DataTableRow[] = [
    {
      cells: { match: 'Arsenal vs Newcastle', market: '1X2', reason: 'odds too low', confidence: '72%' }
    },
    {
      cells: { match: 'Liverpool vs Palace', market: '1X2', reason: 'combo outside range', confidence: '79%' }
    },
    {
      cells: { match: 'Match X', market: 'BTTS', reason: 'insufficient confidence', confidence: '58%' }
    }
  ];

  protected readonly selectionNotes: LogEntry[] = [
    { time: '11:14', level: 'success', message: 'Seuil de confiance respecté.' },
    { time: '11:15', level: 'info', message: 'Les picks hors range sont conservés en audit.' },
    { time: '11:16', level: 'warning', message: 'Browser Use non lancé en mode orchestré.' },
    { time: '11:16', level: 'info', message: 'Validation humaine requise avant exécution réelle.' }
  ];
}

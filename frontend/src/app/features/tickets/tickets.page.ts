import { Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';

import { TicketApiService } from '../../core/api/ticket-api.service';
import { statusToTone } from '../../core/api/api.mappers';
import { TicketAuditLog, TicketDetail, TicketSummary } from '../../core/api/api.types';
import { DataTableColumn, DataTableComponent, DataTableRow } from '../../shared/ui/data-table/data-table.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { LogConsoleComponent, LogEntry } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';
import { TicketCardComponent } from '../../shared/ui/ticket-card/ticket-card.component';

type UiTone = 'default' | 'success' | 'warning' | 'danger' | 'live';

interface TicketKpi {
  label: string;
  value: string;
  status: string;
  tone: UiTone;
}

@Component({
  selector: 'ba-tickets-page',
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
    TicketCardComponent
  ],
  template: `
    <ba-page-header
      eyebrow="AI Betting Tickets"
      title="Ticket Proposals"
      subtitle="Propositions de tickets générées par l’IA selon la stratégie active."
    >
      <div class="flex flex-wrap items-center gap-2">
        <input
          type="date"
          class="h-10 w-[9.75rem] rounded-card border border-border bg-surface-low px-3 text-sm text-text outline-none transition focus:border-accent focus:ring-2 focus:ring-accent/20"
          [value]="targetDate"
          (input)="targetDate = inputValue($event)"
          aria-label="Target date"
        />
        <button
          type="button"
          class="ba-tool border-accent/60 bg-accent text-background hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
          [disabled]="isGenerating"
          (click)="generateTicket()"
        >
          {{ isGenerating ? 'Generating...' : 'Generate Ticket' }}
        </button>
        <button type="button" class="ba-tool" (click)="refreshTickets()">
          Refresh
        </button>
      </div>
    </ba-page-header>

    @if (generateMessage) {
      <div class="mt-4 rounded-card border border-accent/30 bg-accent/10 p-4 text-sm text-accent">
        {{ generateMessage }}
      </div>
    }

    @if (generateError) {
      <div class="mt-4">
        <ba-error-state label="Generation failed" [message]="generateError"></ba-error-state>
      </div>
    }

    @if (isLoading) {
      <section class="mt-4 rounded-card border border-border bg-surface-low p-4">
        <ba-loading-state message="Loading tickets from strict run artifacts..."></ba-loading-state>
      </section>
    } @else if (error) {
      <section class="mt-4">
        <ba-error-state label="Ticketing API error" [message]="error"></ba-error-state>
      </section>
    } @else if (!tickets.length) {
      <section class="mt-4">
        <ba-empty-state
          label="No tickets yet"
          message="No selection.json artifact was found under data/orchestrator_runs. Generate or complete an orchestrated run first."
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

      <section class="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <ba-section-card>
          <div class="ba-card-header flex items-center justify-between gap-3">
            <div>
              <p class="ba-label">Tickets from artifacts</p>
              <h3 class="mt-1 text-sm font-semibold text-text">Strict orchestrator selections</h3>
            </div>
            <ba-status-badge label="run_artifacts" tone="success"></ba-status-badge>
          </div>
          <div class="space-y-3 p-4">
            @for (ticket of tickets; track ticket.ticket_id) {
              <button
                type="button"
                class="w-full rounded-card border p-4 text-left transition hover:border-accent/60 hover:bg-surface-high/50"
                [class.border-accent]="ticket.ticket_id === selectedTicketId"
                [class.bg-accent]="ticket.ticket_id === selectedTicketId"
                [class.text-background]="ticket.ticket_id === selectedTicketId"
                [class.border-border]="ticket.ticket_id !== selectedTicketId"
                [class.bg-background]="ticket.ticket_id !== selectedTicketId"
                (click)="selectTicket(ticket.ticket_id)"
              >
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <p class="ba-data">{{ ticket.ticket_id }}</p>
                    <p class="mt-1 text-xs opacity-80">Run {{ ticket.run_id }} · {{ ticket.target_date || 'no date' }}</p>
                  </div>
                  <ba-status-badge [label]="ticket.status" [tone]="toneFor(ticket.status)"></ba-status-badge>
                </div>
                <div class="mt-3 grid grid-cols-3 gap-3 text-xs">
                  <span>{{ ticket.picks_count }} picks</span>
                  <span>{{ formatOdds(ticket.estimated_combo_odds) }} odds</span>
                  <span>{{ formatPercent(ticket.global_confidence_score) }}</span>
                </div>
              </button>
            }
          </div>
        </ba-section-card>

        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Selected ticket</p>
            <h3 class="mt-1 text-sm font-semibold text-text">{{ selectedTicket?.ticket_id || 'No ticket selected' }}</h3>
          </div>
          <div class="p-4">
            @if (isDetailLoading) {
              <ba-loading-state message="Loading selected ticket..."></ba-loading-state>
            } @else if (selectedTicket) {
              <ba-ticket-card
                [title]="selectedTicket.picks_count + '-pick AI proposal'"
                [market]="selectedTicket.target_date || 'Target date unknown'"
                [status]="selectedTicket.status"
                [tone]="toneFor(selectedTicket.status)"
                [odds]="formatOdds(selectedTicket.estimated_combo_odds)"
                [confidence]="formatPercent(selectedTicket.global_confidence_score)"
                [stake]="selectedTicket.combo_risk_level || 'unknown risk'"
                [summary]="targetRangeSummary(selectedTicket)"
              ></ba-ticket-card>

              <div class="mt-4 grid gap-3 sm:grid-cols-2">
                <div class="rounded-card border border-border/60 bg-background/60 p-3">
                  <p class="ba-label">Data source</p>
                  <p class="mt-2 text-sm text-text">{{ selectedTicket.data_source_mode }}</p>
                </div>
                <div class="rounded-card border border-border/60 bg-background/60 p-3">
                  <p class="ba-label">Date consistency</p>
                  <p class="mt-2 text-sm text-text">{{ selectedTicket.date_consistency_status || 'unknown' }}</p>
                </div>
              </div>
            } @else {
              <ba-empty-state label="No selected ticket" message="Select a ticket from the artifact list."></ba-empty-state>
            }
          </div>
        </ba-section-card>
      </section>

      <section class="mt-4">
        <ba-data-table
          title="Ticket proposals"
          subtitle="Selection artifacts exposed by the Ticketing API."
          [columns]="ticketColumns"
          [rows]="ticketRows"
        ></ba-data-table>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ba-data-table
          title="Selected picks"
          subtitle="Picks read directly from selection.json."
          [columns]="pickColumns"
          [rows]="pickRows"
        ></ba-data-table>

        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Audit log</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Notes, errors and metadata</h3>
          </div>
          <div class="p-4">
            @if (isAuditLoading) {
              <ba-loading-state message="Loading audit log..."></ba-loading-state>
            } @else {
              <ba-log-console
                label="Selection audit"
                [title]="selectedTicketId || 'No ticket'"
                [entries]="auditEntries"
              ></ba-log-console>
            }
          </div>
        </ba-section-card>
      </section>
    }
  `
})
export class TicketsPage implements OnInit {
  private readonly ticketApi = inject(TicketApiService);

  protected tickets: TicketSummary[] = [];
  protected selectedTicketId = '';
  protected selectedTicket: TicketDetail | null = null;
  protected auditLog: TicketAuditLog | null = null;
  protected targetDate = this.today();
  protected isLoading = true;
  protected isDetailLoading = false;
  protected isAuditLoading = false;
  protected isGenerating = false;
  protected error = '';
  protected generateError = '';
  protected generateMessage = '';

  protected readonly ticketColumns: DataTableColumn[] = [
    { key: 'id', label: 'Ticket ID', data: true },
    { key: 'date', label: 'Date', data: true },
    { key: 'picks', label: 'Picks', align: 'right', data: true },
    { key: 'odds', label: 'Odds', align: 'right', data: true },
    { key: 'confidence', label: 'Confidence', align: 'right', data: true },
    { key: 'risk', label: 'Risk' }
  ];

  protected readonly pickColumns: DataTableColumn[] = [
    { key: 'event', label: 'Match' },
    { key: 'market', label: 'Market' },
    { key: 'pick', label: 'Pick' },
    { key: 'odds', label: 'Odds', align: 'right', data: true },
    { key: 'confidence', label: 'Confidence', align: 'right', data: true },
    { key: 'risk', label: 'Risk' }
  ];

  ngOnInit(): void {
    this.refreshTickets();
  }

  protected refreshTickets(): void {
    this.isLoading = true;
    this.error = '';
    this.ticketApi.getTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.isLoading = false;
        if (tickets.length && !this.selectedTicketId) {
          this.selectTicket(tickets[0].ticket_id);
        } else if (this.selectedTicketId && tickets.some((ticket) => ticket.ticket_id === this.selectedTicketId)) {
          this.selectTicket(this.selectedTicketId);
        }
      },
      error: (error: unknown) => {
        this.error = this.errorMessage(error);
        this.isLoading = false;
      }
    });
  }

  protected selectTicket(ticketId: string): void {
    this.selectedTicketId = ticketId;
    this.isDetailLoading = true;
    this.isAuditLoading = true;
    forkJoin({
      ticket: this.ticketApi.getTicket(ticketId),
      auditLog: this.ticketApi.getAuditLog(ticketId)
    }).subscribe({
      next: ({ ticket, auditLog }) => {
        this.selectedTicket = ticket;
        this.auditLog = auditLog;
        this.isDetailLoading = false;
        this.isAuditLoading = false;
      },
      error: (error: unknown) => {
        this.error = this.errorMessage(error);
        this.isDetailLoading = false;
        this.isAuditLoading = false;
      }
    });
  }

  protected generateTicket(): void {
    if (this.isGenerating) {
      return;
    }
    this.isGenerating = true;
    this.generateError = '';
    this.generateMessage = '';
    this.ticketApi.generateTicket({ date: this.targetDate }).subscribe({
      next: (response) => {
        this.isGenerating = false;
        this.generateMessage = `${response.message} Job ${response.job_id} started for ${response.target_date}.`;
        this.refreshTickets();
      },
      error: (error: unknown) => {
        this.isGenerating = false;
        this.generateError = this.errorMessage(error);
      }
    });
  }

  protected get kpis(): TicketKpi[] {
    const bestOdds = Math.max(...this.tickets.map((ticket) => ticket.estimated_combo_odds || 0));
    const avgConfidence = this.average(this.tickets.map((ticket) => ticket.global_confidence_score || 0));
    const validRange = this.tickets.filter((ticket) => ticket.combo_in_target_range).length;
    const withErrors = this.tickets.filter((ticket) => ticket.errors_count > 0).length;
    return [
      { label: 'Tickets proposed', value: String(this.tickets.length), status: 'Artifacts', tone: 'success' },
      { label: 'In target range', value: String(validRange), status: 'Strategy', tone: validRange ? 'success' : 'warning' },
      { label: 'Avg confidence', value: this.formatPercent(avgConfidence), status: 'Selection', tone: 'success' },
      { label: 'Best estimated odds', value: this.formatOdds(bestOdds), status: 'Combo', tone: bestOdds ? 'success' : 'default' },
      { label: 'Errors', value: String(withErrors), status: 'Audit', tone: withErrors ? 'danger' : 'success' },
      { label: 'Selected risk', value: this.selectedTicket?.combo_risk_level || '—', status: 'Current', tone: this.riskTone(this.selectedTicket?.combo_risk_level) }
    ];
  }

  protected get ticketRows(): DataTableRow[] {
    return this.tickets.map((ticket) => ({
      cells: {
        id: ticket.ticket_id,
        date: ticket.target_date || '—',
        picks: ticket.picks_count,
        odds: this.formatOdds(ticket.estimated_combo_odds),
        confidence: this.formatPercent(ticket.global_confidence_score),
        risk: ticket.combo_risk_level || '—'
      },
      status: ticket.status,
      statusTone: this.toneFor(ticket.status)
    }));
  }

  protected get pickRows(): DataTableRow[] {
    return (this.selectedTicket?.picks || []).map((pick) => ({
      cells: {
        event: pick.event || '—',
        market: pick.market || '—',
        pick: pick.pick || '—',
        odds: this.pickOdds(pick.expected_odds_min, pick.expected_odds_max),
        confidence: this.formatPercent(pick.confidence_score),
        risk: pick.risk_level || '—'
      },
      status: pick.pick_id || 'pick',
      statusTone: this.riskTone(pick.risk_level)
    }));
  }

  protected get auditEntries(): LogEntry[] {
    return (this.auditLog?.entries || []).map((entry, index) => ({
      time: String(index + 1).padStart(2, '0'),
      level: this.logLevel(entry.level),
      message: entry.message
    }));
  }

  protected toneFor(status: string | null | undefined): UiTone {
    return statusToTone(status || '');
  }

  protected riskTone(risk: string | null | undefined): UiTone {
    const normalized = String(risk || '').toLowerCase();
    if (normalized === 'low') {
      return 'success';
    }
    if (normalized === 'medium') {
      return 'warning';
    }
    if (normalized === 'high') {
      return 'danger';
    }
    return 'default';
  }

  protected formatOdds(value: number | null | undefined): string {
    return typeof value === 'number' && Number.isFinite(value) ? value.toFixed(2) : '—';
  }

  protected formatPercent(value: number | null | undefined): string {
    return typeof value === 'number' && Number.isFinite(value) ? `${Math.round(value)}%` : '—';
  }

  protected pickOdds(min: number | null | undefined, max: number | null | undefined): string {
    if (typeof min === 'number' && typeof max === 'number') {
      return `${min.toFixed(2)} - ${max.toFixed(2)}`;
    }
    return this.formatOdds(min || max);
  }

  protected targetRangeSummary(ticket: TicketDetail): string {
    const range = ticket.combo_in_target_range ? 'within target range' : 'outside target range';
    return `${ticket.picks_count} picks, ${range}. Source: ${ticket.selection_file}`;
  }

  protected inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private average(values: number[]): number {
    const usable = values.filter((value) => Number.isFinite(value) && value > 0);
    if (!usable.length) {
      return 0;
    }
    return usable.reduce((total, value) => total + value, 0) / usable.length;
  }

  private logLevel(level: string): LogEntry['level'] {
    if (level === 'error' || level === 'danger') {
      return 'danger';
    }
    if (level === 'warning') {
      return 'warning';
    }
    if (level === 'success') {
      return 'success';
    }
    return 'info';
  }

  private errorMessage(error: unknown): string {
    if (error && typeof error === 'object' && 'message' in error) {
      return String((error as { message?: unknown }).message || 'Unexpected ticketing error.');
    }
    return 'Unexpected ticketing error.';
  }
}

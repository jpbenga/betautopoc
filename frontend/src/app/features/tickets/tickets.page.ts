import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { catchError, forkJoin, of } from 'rxjs';

import { AnalysisApiService } from '../../core/api/analysis-api.service';
import { TicketApiService } from '../../core/api/ticket-api.service';
import { UiTone, confidenceScoreToTone, statusToTone } from '../../core/api/api.mappers';
import { AnalysisRun, AnalysisRunOutputs, TicketAuditLog, TicketDetail, TicketPick, TicketSummary, TicketVariant } from '../../core/api/api.types';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { LogConsoleComponent, LogEntry } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';

interface TicketKpi {
  label: string;
  value: string;
  status: string;
  tone: UiTone;
}

interface TicketMatchAnalysisDetail {
  id: string;
  fixtureId: number | null;
  sourceId: string;
  event: string;
  competition: string;
  kickoff: string;
  kickoffDisplay: string;
  summary: string;
  keyFactors: string[];
  risks: string[];
  globalConfidence: number;
  globalConfidenceLabel: string;
  dataQuality: string;
  confidenceTier: string;
  predictedMarkets: Array<{
    marketCanonicalId: string;
    selectionCanonicalId: string;
    confidence: number;
    confidenceLabel: string;
    reason: string;
  }>;
}

@Component({
  selector: 'ba-tickets-page',
  standalone: true,
  imports: [
    EmptyStateComponent,
    ErrorStateComponent,
    KpiCardComponent,
    LoadingStateComponent,
    LogConsoleComponent,
    PageHeaderComponent,
    RouterLink,
    SectionCardComponent,
    StatusBadgeComponent
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
        <div class="flex flex-col">
          <button
            type="button"
            class="ba-tool border-accent/60 bg-accent text-background hover:bg-accent-strong disabled:cursor-not-allowed disabled:border-accent/30 disabled:bg-accent/20 disabled:text-accent"
            [disabled]="isGeneratingTicket"
            [title]="isGeneratingTicket ? 'Ticket generation is already running for job ' + generatedRunId : 'Generate a ticket for the selected date'"
            (click)="generateTicket()"
          >
            {{ isGeneratingTicket ? 'Generation in progress' : 'Generate Ticket' }}
          </button>
          @if (isGeneratingTicket) {
            <span class="mt-1 text-[11px] text-muted">Disabled while job {{ generatedRunId || 'is starting' }} runs.</span>
          }
        </div>
        <button type="button" class="ba-tool" (click)="refreshTickets()">
          Refresh
        </button>
      </div>
    </ba-page-header>

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

    @if (isGeneratingTicket || generatedRunId || generationStatus || generationError) {
      <section class="mt-4">
        <ba-section-card>
          <div class="ba-card-header flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p class="ba-label">Ticket generation</p>
              <h3 class="mt-1 text-sm font-semibold text-text">{{ generationMessage }}</h3>
              <p class="mt-1 text-xs text-muted">{{ generationDetail }}</p>
            </div>
            <div class="flex flex-wrap gap-2">
              @if (generatedRunId) {
                <ba-status-badge [label]="'job ' + generatedRunId" tone="default"></ba-status-badge>
              }
              @if (generationStatus) {
                <ba-status-badge
                  [label]="generationStatus"
                  [tone]="generationTone"
                  [pulse]="isGenerationLive"
                  [showPip]="true"
                ></ba-status-badge>
              }
              @if (isGenerationPolling) {
                <ba-status-badge label="polling every 3s" tone="live" [pulse]="true" [showPip]="true"></ba-status-badge>
              }
              @if (showViewRunLink) {
                <a
                  class="ba-tool border-accent/50 text-accent hover:bg-accent/10"
                  routerLink="/analysis"
                  [queryParams]="{ run_id: generatedRunId }"
                >
                  View run
                </a>
              }
            </div>
          </div>
          <div
            class="border-b border-border/60 px-4 py-3"
            [class.bg-accent/5]="isGenerationLive"
            [class.bg-success/5]="isGenerationSuccess"
            [class.bg-danger/5]="isGenerationFailed"
            [class.bg-surface]="!isGenerationLive && !isGenerationSuccess && !isGenerationFailed"
          >
            <div class="flex items-center gap-3">
              <span class="relative flex h-3 w-3 shrink-0">
                @if (isGenerationLive) {
                  <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-30"></span>
                }
                <span class="relative h-3 w-3 rounded-full" [class]="generationPipClass"></span>
              </span>
              <div class="h-2 flex-1 overflow-hidden rounded-full bg-background">
                <div
                  class="h-full rounded-full"
                  [class.bg-accent]="isGenerationLive"
                  [class.bg-success]="isGenerationSuccess"
                  [class.bg-danger]="isGenerationFailed"
                  [class.bg-warning]="isGenerationNoTicket"
                  [class.bg-muted]="!isGenerationLive && !isGenerationSuccess && !isGenerationFailed && !isGenerationNoTicket"
                  [class.animate-pulse]="isGenerationLive"
                  [style.width.%]="generationProgress"
                ></div>
              </div>
              <span class="ba-data text-muted">{{ generationProgress }}%</span>
            </div>
          </div>
          <div class="grid gap-3 p-4 md:grid-cols-3">
            <div class="rounded-card border border-border/60 bg-background/60 p-3">
              <p class="ba-label">Target date</p>
              <p class="mt-2 text-sm text-text">{{ generationTargetDate || targetDate }}</p>
            </div>
            <div class="rounded-card border border-border/60 bg-background/60 p-3">
              <p class="ba-label">Orchestrator run</p>
              <p class="mt-2 text-sm text-text">{{ generatedOrchestratorRunId || 'Waiting for run artifact' }}</p>
            </div>
            <div class="rounded-card border border-border/60 bg-background/60 p-3">
              <p class="ba-label">Last updated</p>
              <p class="mt-2 text-sm text-text">{{ ticketGenerationLastUpdatedAt || '—' }}</p>
            </div>
          </div>
          @if (generationError) {
            <div class="px-4 pb-4">
              <ba-error-state label="Generation issue" [message]="generationError"></ba-error-state>
            </div>
          } @else if (isGenerationNoTicket) {
            <div class="px-4 pb-4">
              <ba-empty-state
                label="Run completed but no ticket was generated"
                message="The orchestration finished, but no usable selection artifact appeared for this target."
                [meta]="generatedRunId ? 'job_id ' + generatedRunId : ''"
                tone="warning"
              ></ba-empty-state>
            </div>
          }
        </ba-section-card>
      </section>
    }

    @if (isLoading) {
      <section class="mt-4 rounded-card border border-border bg-surface-low p-4">
        <ba-loading-state
          message="Loading tickets from strict run artifacts..."
          detail="Reading selection artifacts without latest_* fallback."
          [showShimmer]="true"
        ></ba-loading-state>
      </section>
    } @else if (error) {
      <section class="mt-4">
        <ba-error-state label="Ticketing API error" [message]="error"></ba-error-state>
      </section>
    } @else if (!tickets.length) {
      <section class="mt-4">
        <ba-empty-state
          label="No tickets yet"
          message="Aucun selection.json de run ou d'application de stratégie n'a été trouvé sous data/orchestrator_runs."
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

      <section class="mt-4 grid gap-4 xl:grid-cols-[minmax(18rem,0.8fr)_minmax(0,1.2fr)]">
        <ba-section-card>
          <div class="ba-card-header flex items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="ba-label">Tickets sauvegardés</p>
              <h3 class="mt-1 truncate text-sm font-semibold text-text">{{ tickets.length }} tickets disponibles</h3>
            </div>
            <ba-status-badge label="persisted" tone="success"></ba-status-badge>
          </div>
          <div class="max-h-[28rem] space-y-2 overflow-y-auto p-3">
            @for (ticket of tickets; track ticket.ticket_id) {
              <button
                type="button"
                class="w-full rounded-card border px-3 py-2 text-left transition hover:border-accent/60 hover:bg-surface-high/50"
                [class.border-accent]="ticket.ticket_id === selectedTicketId"
                [class.bg-accent/10]="ticket.ticket_id === selectedTicketId"
                [class.border-border]="ticket.ticket_id !== selectedTicketId"
                [class.bg-background]="ticket.ticket_id !== selectedTicketId"
                (click)="selectTicket(ticket.ticket_id)"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="ba-data truncate text-text">{{ shortId(ticket.ticket_id) }}</p>
                    <p class="mt-1 truncate text-xs text-muted">{{ ticket.target_date || 'no date' }} · {{ competitionSummary(ticket.competitions) }}</p>
                  </div>
                  <ba-status-badge [label]="ticket.status" [tone]="toneFor(ticket.status)"></ba-status-badge>
                </div>
                <div class="mt-2 flex flex-wrap items-center gap-2">
                  <span class="text-xs text-muted">{{ ticket.picks_count }} picks</span>
                  <span class="text-xs text-muted">{{ ticket.variants_count || 0 }} variants</span>
                  <span class="text-xs text-muted">{{ formatOdds(ticket.estimated_combo_odds) }} odds</span>
                  <ba-status-badge
                    [label]="formatPercent(ticket.global_confidence_score)"
                    [tone]="confidenceTone(ticket.global_confidence_score)"
                  ></ba-status-badge>
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
              <div class="rounded-card border border-border/60 bg-background/60 p-3">
                <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div class="min-w-0">
                    <p class="ba-label">{{ selectedTicket.target_date || 'Target date unknown' }}</p>
                    <h4 class="mt-1 truncate text-base font-semibold text-text">{{ shortId(selectedTicket.ticket_id) }}</h4>
                    <p class="mt-1 text-sm text-muted">{{ competitionSummary(selectedTicket.competitions) }}</p>
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <ba-status-badge [label]="selectedTicket.status" [tone]="toneFor(selectedTicket.status)"></ba-status-badge>
                    <ba-status-badge [label]="formatPercent(selectedTicket.global_confidence_score)" [tone]="confidenceTone(selectedTicket.global_confidence_score)"></ba-status-badge>
                  </div>
                </div>
                <div class="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-5">
                  <div>
                    <p class="ba-label">Picks</p>
                    <p class="mt-1 text-sm text-text">{{ selectedTicket.picks_count }}</p>
                  </div>
                  <div>
                    <p class="ba-label">Variants</p>
                    <p class="mt-1 text-sm text-text">{{ selectedTicket.variants_count || 0 }}</p>
                  </div>
                  <div>
                    <p class="ba-label">Odds</p>
                    <p class="mt-1 text-sm text-text">{{ formatOdds(selectedTicket.estimated_combo_odds) }}</p>
                  </div>
                  <div>
                    <p class="ba-label">Risk</p>
                    <p class="mt-1 text-sm text-text">{{ selectedTicket.combo_risk_level || 'unknown' }}</p>
                  </div>
                  <div>
                    <p class="ba-label">Target</p>
                    <p class="mt-1 text-sm text-text">{{ comboTargetLabel(selectedTicket) }}</p>
                  </div>
                </div>
              </div>
            } @else {
              <ba-empty-state label="No selected ticket" message="Select a ticket from the artifact list."></ba-empty-state>
            }
          </div>
        </ba-section-card>
      </section>

      <section class="mt-4">
        <ba-section-card>
          <div class="ba-card-header flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="ba-label">Ticket proposals</p>
              <h3 class="mt-1 text-sm font-semibold text-text">Résumé compact des sélections</h3>
            </div>
            <ba-status-badge [label]="tickets.length + ' proposals'" tone="default"></ba-status-badge>
          </div>
          <div class="grid max-h-[24rem] gap-2 overflow-y-auto p-3 sm:grid-cols-2 xl:grid-cols-3">
            @for (ticket of tickets; track ticket.ticket_id) {
              <button
                type="button"
                class="rounded-card border border-border/60 bg-background/60 p-3 text-left transition hover:border-accent/60 hover:bg-surface-high/50"
                [class.border-accent]="ticket.ticket_id === selectedTicketId"
                [class.bg-accent/10]="ticket.ticket_id === selectedTicketId"
                (click)="selectTicket(ticket.ticket_id)"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-text">{{ ticket.target_date || 'No date' }}</p>
                    <p class="mt-1 truncate text-xs text-muted">{{ competitionSummary(ticket.competitions) }}</p>
                  </div>
                  <ba-status-badge [label]="formatPercent(ticket.global_confidence_score)" [tone]="confidenceTone(ticket.global_confidence_score)"></ba-status-badge>
                </div>
                <div class="mt-3 flex flex-wrap gap-2 text-xs text-muted">
                  <span>{{ ticket.picks_count }} picks</span>
                  <span>{{ ticket.variants_count || 0 }} variants</span>
                  <span>{{ formatOdds(ticket.estimated_combo_odds) }} odds</span>
                  <span>{{ ticket.combo_risk_level || 'risk —' }}</span>
                </div>
              </button>
            }
          </div>
        </ba-section-card>
      </section>

      <section class="mt-4">
        <ba-section-card>
          <div class="ba-card-header flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p class="ba-label">Ticket variants</p>
              <h3 class="mt-1 text-sm font-semibold text-text">Jusqu'à 3 propositions générées par l'agent</h3>
              @if (selectedTicket?.selection_reason) {
                <p class="mt-1 text-xs leading-5 text-muted">{{ selectedTicket?.selection_reason }}</p>
              }
            </div>
            <ba-status-badge [label]="ticketVariants.length + ' variants'" [tone]="ticketVariants.length ? 'success' : 'default'"></ba-status-badge>
          </div>
          <div class="grid gap-3 p-3 xl:grid-cols-3">
            @for (variant of ticketVariants; track variant.variant_id) {
              <article
                class="rounded-card border p-3"
                [class.border-accent/60]="variant.selected"
                [class.bg-accent/5]="variant.selected"
                [class.border-border/60]="!variant.selected"
                [class.bg-background/60]="!variant.selected"
              >
                <div class="flex items-start justify-between gap-3">
                  <div class="min-w-0">
                    <p class="ba-label">{{ variant.variant_id }}</p>
                    <h4 class="mt-1 truncate text-sm font-semibold text-text">{{ variant.label || 'Variant' }}</h4>
                  </div>
                  <div class="flex shrink-0 flex-wrap justify-end gap-2">
                    @if (variant.selected) {
                      <ba-status-badge label="best" tone="live"></ba-status-badge>
                    }
                    <ba-status-badge [label]="formatPercent(variant.strategy_fit_score)" [tone]="confidenceTone(variant.strategy_fit_score)"></ba-status-badge>
                  </div>
                </div>

                <div class="mt-3 grid grid-cols-2 gap-2 text-xs text-muted">
                  <span>{{ variant.picks.length }} picks</span>
                  <span>{{ formatOdds(variant.estimated_combo_odds) }} odds</span>
                  <span>{{ formatPercent(variant.global_confidence_score) }} confidence</span>
                  <span>{{ variant.combo_risk_level || 'risk —' }}</span>
                </div>

                <p class="mt-3 text-sm leading-6 text-text">{{ variant.reason || 'No variant reason provided.' }}</p>

                @if (variant.tradeoffs.length) {
                  <div class="mt-3 rounded-card border border-border/60 bg-surface-low p-2">
                    <p class="ba-label">Tradeoffs</p>
                    @for (tradeoff of variant.tradeoffs; track tradeoff + $index) {
                      <p class="mt-1 text-xs leading-5 text-muted">{{ tradeoff }}</p>
                    }
                  </div>
                }

                <div class="mt-3 grid gap-2">
                  @for (pick of variant.picks; track pick.pick_id || $index) {
                    <button
                      type="button"
                      class="rounded-card border border-border/60 bg-surface-low p-2 text-left transition hover:border-accent/60 hover:bg-surface-high/50"
                      (click)="openPickModal(pick)"
                    >
                      <p class="truncate text-xs font-semibold text-text">{{ pick.event || 'Event unknown' }}</p>
                      <p class="mt-1 truncate text-[11px] text-muted">{{ pick.market || 'Market unknown' }} · {{ pick.pick || 'Pick unknown' }}</p>
                      <div class="mt-2 flex flex-wrap gap-2">
                        <ba-status-badge [label]="formatPercent(pick.confidence_score)" [tone]="confidenceTone(pick.confidence_score)"></ba-status-badge>
                        <ba-status-badge [label]="pick.risk_level || 'risk —'" [tone]="riskTone(pick.risk_level)"></ba-status-badge>
                      </div>
                    </button>
                  }
                </div>
              </article>
            } @empty {
              <div class="p-4 xl:col-span-3">
                <ba-empty-state
                  label="No variants"
                  message="Cette sélection vient probablement d'un ancien artifact ou aucune variante exploitable n'a été produite."
                  tone="warning"
                ></ba-empty-state>
              </div>
            }
          </div>
        </ba-section-card>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Selected picks</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Picks de la meilleure variante</h3>
          </div>
          <div class="grid gap-2 p-3">
            @for (pick of selectedTicket?.picks || []; track pick.pick_id || $index) {
              <button
                type="button"
                class="rounded-card border border-border/60 bg-background/60 p-3 text-left transition hover:border-accent/60 hover:bg-surface-high/50"
                (click)="openPickModal(pick)"
              >
                <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div class="min-w-0">
                    <p class="truncate text-sm font-semibold text-text">{{ pick.event || 'Event unknown' }}</p>
                    <p class="mt-1 truncate text-xs text-muted">{{ pick.competition || 'Competition unknown' }} · {{ compactDate(pick.kickoff) }}</p>
                    <p class="mt-1 truncate text-xs text-muted">{{ pick.market || 'Market unknown' }} · {{ pick.pick || 'Pick unknown' }}</p>
                  </div>
                  <div class="flex flex-wrap gap-2 sm:justify-end">
                    <ba-status-badge [label]="formatPercent(pick.confidence_score)" [tone]="confidenceTone(pick.confidence_score)"></ba-status-badge>
                    <ba-status-badge [label]="pick.risk_level || 'risk —'" [tone]="riskTone(pick.risk_level)"></ba-status-badge>
                  </div>
                </div>
              </button>
            } @empty {
              <div class="p-4">
                <ba-empty-state label="No selected picks" message="The selected ticket contains no pick."></ba-empty-state>
              </div>
            }
          </div>
        </ba-section-card>

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
                [highlightNewest]="isGeneratingTicket"
              ></ba-log-console>
            }
          </div>
        </ba-section-card>
      </section>
    }

    @if (selectedPickForModal) {
      <div
        class="fixed inset-0 z-50 flex items-end bg-background/80 p-3 backdrop-blur-sm sm:items-center sm:justify-center sm:p-6"
        role="dialog"
        aria-modal="true"
        (click)="closePickModal()"
      >
        <section
          class="max-h-[92vh] w-full overflow-y-auto rounded-card border border-border/80 bg-surface-low shadow-glow sm:max-w-5xl"
          (click)="$event.stopPropagation()"
        >
          <div class="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border/60 bg-surface-low px-4 py-3">
            <div class="min-w-0">
              <p class="ba-label">{{ selectedPickForModal.competition || 'Competition unknown' }} · {{ compactDate(selectedPickForModal.kickoff) }}</p>
              <h3 class="mt-1 truncate text-base font-semibold text-text">{{ selectedPickForModal.event || 'Event unknown' }}</h3>
              <p class="mt-1 text-sm text-muted">{{ selectedPickForModal.market || 'Market unknown' }} · {{ selectedPickForModal.pick || 'Pick unknown' }}</p>
            </div>
            <button type="button" class="ba-tool shrink-0" (click)="closePickModal()">Close</button>
          </div>

          <div class="grid gap-3 p-4">
            @if (selectedPickMatchAnalysis; as matchAnalysis) {
              <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div class="min-w-0">
                  <p class="ba-label">{{ matchAnalysis.competition }}</p>
                  <h4 class="mt-1 text-base font-semibold text-text">{{ matchAnalysis.event }}</h4>
                  <p class="mt-1 text-sm text-muted">{{ matchAnalysis.kickoffDisplay }}</p>
                </div>
                <div class="flex flex-wrap gap-2">
                  <ba-status-badge [label]="matchAnalysis.confidenceTier" [tone]="confidenceTierTone(matchAnalysis.confidenceTier)"></ba-status-badge>
                  <ba-status-badge [label]="matchAnalysis.globalConfidenceLabel" [tone]="confidenceTone(matchAnalysis.globalConfidence)"></ba-status-badge>
                  <ba-status-badge [label]="matchAnalysis.dataQuality" [tone]="qualityTone(matchAnalysis.dataQuality)"></ba-status-badge>
                </div>
              </div>

              <div class="grid gap-3 xl:grid-cols-3">
                <div class="rounded-card border border-border/60 bg-background/60 p-3">
                  <p class="ba-label">Event</p>
                  <p class="mt-2 text-sm text-text">{{ matchAnalysis.event }}</p>
                </div>
                <div class="rounded-card border border-border/60 bg-background/60 p-3">
                  <p class="ba-label">Competition</p>
                  <p class="mt-2 text-sm text-text">{{ matchAnalysis.competition }}</p>
                </div>
                <div class="rounded-card border border-border/60 bg-background/60 p-3">
                  <p class="ba-label">Kickoff</p>
                  <p class="mt-2 text-sm text-text">{{ matchAnalysis.kickoffDisplay }}</p>
                </div>
              </div>

              <div class="rounded-card border border-accent/30 bg-accent/5 p-3">
                <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p class="ba-label">Selected pick</p>
                    <p class="mt-2 text-sm font-semibold text-text">{{ selectedPickForModal.market || 'Market unknown' }} · {{ selectedPickForModal.pick || 'Pick unknown' }}</p>
                    <p class="mt-2 text-sm leading-6 text-text">{{ selectedPickForModal.reason || 'No reason provided in selection.json.' }}</p>
                  </div>
                  <div class="flex shrink-0 flex-wrap gap-2">
                    <ba-status-badge [label]="formatPercent(selectedPickForModal.confidence_score)" [tone]="confidenceTone(selectedPickForModal.confidence_score)"></ba-status-badge>
                    <ba-status-badge [label]="selectedPickForModal.risk_level || 'risk unknown'" [tone]="riskTone(selectedPickForModal.risk_level)"></ba-status-badge>
                    <ba-status-badge [label]="pickOdds(selectedPickForModal.expected_odds_min, selectedPickForModal.expected_odds_max)" tone="default"></ba-status-badge>
                  </div>
                </div>
              </div>

              <div class="rounded-card border border-border/60 bg-background/60 p-3">
                <p class="ba-label">Analysis summary</p>
                <p class="mt-2 text-sm leading-6 text-text">{{ matchAnalysis.summary }}</p>
              </div>

              <div class="grid gap-3 xl:grid-cols-2">
                <div class="rounded-card border border-border/60 bg-background/60 p-3">
                  <p class="ba-label">Key factors</p>
                  @for (factor of matchAnalysis.keyFactors; track factor + $index) {
                    <p class="mt-2 text-sm leading-6 text-text">{{ factor }}</p>
                  } @empty {
                    <p class="mt-2 text-sm text-muted">No key factors returned.</p>
                  }
                </div>
                <div class="rounded-card border border-border/60 bg-background/60 p-3">
                  <p class="ba-label">Risks</p>
                  @for (risk of matchAnalysis.risks; track risk + $index) {
                    <p class="mt-2 text-sm leading-6 text-text">{{ risk }}</p>
                  } @empty {
                    <p class="mt-2 text-sm text-muted">No explicit risks returned.</p>
                  }
                </div>
              </div>

              <div class="grid gap-3 sm:grid-cols-2">
                <div class="rounded-card border border-border/60 bg-background/60 p-3">
                  <p class="ba-label">Global confidence</p>
                  <div class="mt-2">
                    <ba-status-badge [label]="matchAnalysis.globalConfidenceLabel" [tone]="confidenceTone(matchAnalysis.globalConfidence)"></ba-status-badge>
                  </div>
                </div>
                <div class="rounded-card border border-border/60 bg-background/60 p-3">
                  <p class="ba-label">Data quality</p>
                  <div class="mt-2">
                    <ba-status-badge [label]="matchAnalysis.dataQuality" [tone]="qualityTone(matchAnalysis.dataQuality)"></ba-status-badge>
                  </div>
                </div>
              </div>

              <div class="rounded-card border border-border/60 bg-background/60 p-3">
                <p class="ba-label">Tous les predicted markets</p>
                <div class="mt-3 grid gap-3">
                  @for (market of matchAnalysis.predictedMarkets; track market.marketCanonicalId + market.selectionCanonicalId + $index) {
                    <article
                      class="rounded-card border p-3"
                      [class.border-accent/60]="isSelectedPredictedMarket(selectedPickForModal, market.marketCanonicalId, market.selectionCanonicalId)"
                      [class.bg-accent/5]="isSelectedPredictedMarket(selectedPickForModal, market.marketCanonicalId, market.selectionCanonicalId)"
                      [class.border-border/60]="!isSelectedPredictedMarket(selectedPickForModal, market.marketCanonicalId, market.selectionCanonicalId)"
                      [class.bg-surface-low]="!isSelectedPredictedMarket(selectedPickForModal, market.marketCanonicalId, market.selectionCanonicalId)"
                    >
                      <div class="flex flex-col gap-2 lg:flex-row lg:items-start lg:justify-between">
                        <div class="min-w-0">
                          <p class="break-words text-sm font-medium text-text">{{ market.marketCanonicalId }}</p>
                          <p class="mt-1 break-words text-xs text-muted">{{ market.selectionCanonicalId }}</p>
                        </div>
                        <div class="flex shrink-0 flex-wrap gap-2">
                          @if (isSelectedPredictedMarket(selectedPickForModal, market.marketCanonicalId, market.selectionCanonicalId)) {
                            <ba-status-badge label="selected" tone="live"></ba-status-badge>
                          }
                          <ba-status-badge [label]="market.confidenceLabel" [tone]="confidenceTone(market.confidence)"></ba-status-badge>
                        </div>
                      </div>
                      <p class="mt-3 text-sm leading-6 text-text">{{ market.reason }}</p>
                    </article>
                  } @empty {
                    <p class="text-sm text-muted">No predicted market returned for this match.</p>
                  }
                </div>
              </div>

              <div class="rounded-card border border-border/60 bg-background/60 p-3">
                <p class="ba-label">Evidence summary</p>
                <div class="mt-2 grid gap-2 text-sm text-muted sm:grid-cols-2">
                  <p>Market IDs: <span class="break-words text-text">{{ selectedPickForModal.market_canonical_id || '—' }} · {{ selectedPickForModal.selection_canonical_id || '—' }}</span></p>
                  <p>Source analysis: <span class="text-text">{{ selectedPickForModal.source_match_analysis_id || matchAnalysis.sourceId || '—' }}</span></p>
                  <p>Evidence confidence: <span class="text-text">{{ formatPercent(evidenceNumber(selectedPickForModal.evidence_summary, 'global_confidence')) }}</span></p>
                  <p>Data quality: <span class="text-text">{{ evidenceText(selectedPickForModal.evidence_summary, 'data_quality') }}</span></p>
                  <p>Odds source: <span class="text-text">{{ evidenceText(selectedPickForModal.evidence_summary, 'odds_source') }}</span></p>
                  <p>Expected odds: <span class="text-text">{{ pickOdds(evidenceNumber(selectedPickForModal.evidence_summary, 'expected_odds_min'), evidenceNumber(selectedPickForModal.evidence_summary, 'expected_odds_max')) }}</span></p>
                </div>
              </div>
            } @else {
              <ba-empty-state
                label="Match analysis unavailable"
                [message]="selectedTicketOutputsError || 'No matching match_analysis entry was found for this pick in the ticket run outputs.'"
                tone="warning"
              ></ba-empty-state>
            }
          </div>
        </section>
      </div>
    }
  `
})
export class TicketsPage implements OnInit, OnDestroy {
  private readonly ticketApi = inject(TicketApiService);
  private readonly analysisApi = inject(AnalysisApiService);
  private readonly route = inject(ActivatedRoute);
  private generationPollId: ReturnType<typeof setInterval> | null = null;
  private generationPollInFlight = false;
  private generationStartedAt = 0;
  private readonly generationTimeoutMs = 10 * 60 * 1000;
  private requestedTicketId = '';

  protected tickets: TicketSummary[] = [];
  protected selectedTicketId = '';
  protected selectedTicket: TicketDetail | null = null;
  protected selectedTicketRunOutputs: AnalysisRunOutputs | null = null;
  protected selectedTicketOutputsError = '';
  protected auditLog: TicketAuditLog | null = null;
  protected targetDate = this.today();
  protected isLoading = true;
  protected isDetailLoading = false;
  protected isAuditLoading = false;
  protected isGeneratingTicket = false;
  protected isGenerationPolling = false;
  protected generatedRunId = '';
  protected generatedOrchestratorRunId = '';
  protected generationStatus = '';
  protected generationTargetDate = '';
  protected generationError = '';
  protected generationMessage = '';
  protected generationOutcome: 'idle' | 'ticket_ready' | 'no_ticket' | 'failed' = 'idle';
  protected ticketGenerationLastUpdatedAt = '';
  protected selectedPickForModal: TicketPick | null = null;
  protected error = '';

  protected readonly stateBadges: Array<{ label: string; tone: UiTone }> = [
    { label: 'idle', tone: 'default' },
    { label: 'pending', tone: 'warning' },
    { label: 'running', tone: 'live' },
    { label: 'completed', tone: 'success' },
    { label: 'completed_no_data', tone: 'default' },
    { label: 'failed', tone: 'danger' },
    { label: 'partial', tone: 'warning' },
    { label: 'proxy', tone: 'warning' },
    { label: 'estimated', tone: 'warning' },
    { label: 'unavailable', tone: 'default' }
  ];

  ngOnInit(): void {
    this.requestedTicketId = this.route.snapshot.queryParamMap.get('ticket_id') || '';
    this.refreshTickets();
  }

  ngOnDestroy(): void {
    this.stopGenerationPolling();
  }

  protected refreshTickets(): void {
    this.loadTickets(true);
  }

  private loadTickets(showLoading: boolean): void {
    this.isLoading = showLoading;
    this.error = '';
    this.ticketApi.getTickets().subscribe({
      next: (tickets) => {
        this.tickets = tickets;
        this.isLoading = false;
        const requestedTicket = this.requestedTicketId
          ? tickets.find((ticket) => ticket.ticket_id === this.requestedTicketId)
          : undefined;
        if (requestedTicket) {
          this.requestedTicketId = '';
          this.selectTicket(requestedTicket.ticket_id);
        } else if (tickets.length && !this.selectedTicketId) {
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
    this.selectedTicketRunOutputs = null;
    this.selectedTicketOutputsError = '';
    const runId = this.tickets.find((ticket) => ticket.ticket_id === ticketId)?.run_id || '';
    forkJoin({
      ticket: this.ticketApi.getTicket(ticketId),
      auditLog: this.ticketApi.getAuditLog(ticketId),
      outputs: runId
        ? this.analysisApi.getRunOutputs(runId).pipe(
          catchError((error: unknown) => {
            this.selectedTicketOutputsError = this.errorMessage(error);
            return of(null);
          })
        )
        : of(null)
    }).subscribe({
      next: ({ ticket, auditLog, outputs }) => {
        this.selectedTicket = ticket;
        this.auditLog = auditLog;
        this.selectedTicketRunOutputs = outputs;
        const visiblePicks = [...ticket.picks, ...ticket.variants.flatMap((variant) => variant.picks)];
        if (this.selectedPickForModal && !visiblePicks.some((pick) => pick.pick_id === this.selectedPickForModal?.pick_id)) {
          this.selectedPickForModal = null;
        }
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
    if (this.isGeneratingTicket) {
      return;
    }
    this.stopGenerationPolling();
    this.isGeneratingTicket = true;
    this.isGenerationPolling = false;
    this.generatedRunId = '';
    this.generatedOrchestratorRunId = '';
    this.generationStatus = 'starting';
    this.generationTargetDate = this.targetDate;
    this.generationError = '';
    this.generationMessage = 'Generating ticket...';
    this.generationOutcome = 'idle';
    this.ticketGenerationLastUpdatedAt = this.nowLabel();
    this.ticketApi.generateTicket({ date: this.targetDate }).subscribe({
      next: (response) => {
        this.generatedRunId = response.job_id;
        this.generationTargetDate = response.target_date;
        this.generationStatus = response.status;
        this.generationMessage = 'Generating ticket...';
        this.generationStartedAt = Date.now();
        this.ticketGenerationLastUpdatedAt = this.nowLabel();
        this.startGenerationPolling(response.job_id);
        this.pollGenerationOnce();
      },
      error: (error: unknown) => {
        this.isGeneratingTicket = false;
        this.generationStatus = 'error';
        this.generationError = this.errorMessage(error);
        this.generationMessage = 'Ticket generation failed to start';
        this.generationOutcome = 'failed';
        this.ticketGenerationLastUpdatedAt = this.nowLabel();
      }
    });
  }

  private startGenerationPolling(runId: string): void {
    this.stopGenerationPolling();
    this.generatedRunId = runId;
    this.isGenerationPolling = true;
    this.generationPollId = setInterval(() => this.pollGenerationOnce(), 3000);
  }

  private pollGenerationOnce(): void {
    if (!this.generatedRunId) {
      return;
    }
    if (this.generationPollInFlight) {
      return;
    }

    if (Date.now() - this.generationStartedAt > this.generationTimeoutMs) {
      this.isGeneratingTicket = false;
      this.generationStatus = 'timeout';
      this.generationError = 'Ticket generation timed out after 10 minutes. The run may still finish server-side; refresh tickets later.';
      this.generationMessage = 'Ticket generation timed out';
      this.generationOutcome = 'failed';
      this.ticketGenerationLastUpdatedAt = this.nowLabel();
      this.stopGenerationPolling();
      return;
    }

    this.generationPollInFlight = true;
    forkJoin({
      run: this.analysisApi.getRun(this.generatedRunId),
      tickets: this.ticketApi.getTickets()
    }).subscribe({
      next: ({ run, tickets }) => {
        this.generationPollInFlight = false;
        this.tickets = tickets;
        this.generationStatus = run.status;
        this.generatedOrchestratorRunId = run.orchestrator_run_id || this.extractRunId(run) || this.generatedOrchestratorRunId;
        this.ticketGenerationLastUpdatedAt = this.nowLabel();
        const generatedTicket = this.findGeneratedTicket(tickets, run);
        if (generatedTicket && generatedTicket.picks_count > 0) {
          this.generationMessage = 'Ticket generated successfully';
          this.generationOutcome = 'ticket_ready';
          this.isGeneratingTicket = false;
          this.stopGenerationPolling();
          this.selectTicket(generatedTicket.ticket_id);
          return;
        }

        if (this.isTerminalStatus(run.status)) {
          this.isGeneratingTicket = false;
          this.generationMessage = 'Run completed but no ticket was generated';
          this.generationOutcome = this.isFailureStatus(run.status) ? 'failed' : 'no_ticket';
          if (generatedTicket) {
            this.selectTicket(generatedTicket.ticket_id);
          }
          if (this.isFailureStatus(run.status)) {
            this.generationError = run.error || 'Run finished with an error before a ticket artifact appeared.';
          }
          this.stopGenerationPolling();
          return;
        }

        this.generationMessage = 'Generating ticket...';
      },
      error: (error: unknown) => {
        this.generationPollInFlight = false;
        this.isGeneratingTicket = false;
        this.generationStatus = 'error';
        this.generationError = this.errorMessage(error);
        this.generationMessage = 'Ticket generation polling failed';
        this.generationOutcome = 'failed';
        this.ticketGenerationLastUpdatedAt = this.nowLabel();
        this.stopGenerationPolling();
      }
    });
  }

  private stopGenerationPolling(): void {
    if (this.generationPollId) {
      clearInterval(this.generationPollId);
      this.generationPollId = null;
    }
    this.generationPollInFlight = false;
    this.isGenerationPolling = false;
  }

  private findGeneratedTicket(tickets: TicketSummary[], run: AnalysisRun): TicketSummary | undefined {
    const orchestratorRunId = run.orchestrator_run_id || this.extractRunId(run);
    if (!orchestratorRunId) {
      return undefined;
    }
    return tickets.find((ticket) => ticket.run_id === orchestratorRunId);
  }

  private extractRunId(run: AnalysisRun): string {
    const summary = run.run_summary;
    if (summary && typeof summary === 'object' && 'run_id' in summary) {
      return String((summary as { run_id?: unknown }).run_id || '');
    }
    return '';
  }

  private isTerminalStatus(status: string): boolean {
    return ['completed', 'done', 'failed', 'error', 'skipped', 'completed_no_data'].includes(String(status).toLowerCase());
  }

  private isFailureStatus(status: string): boolean {
    return ['failed', 'error'].includes(String(status).toLowerCase());
  }

  protected get showViewRunLink(): boolean {
    return Boolean(this.generatedRunId && (this.isGeneratingTicket || this.isFailureStatus(this.generationStatus) || this.generationError || this.generationOutcome === 'no_ticket'));
  }

  protected get isGenerationLive(): boolean {
    return this.isGeneratingTicket || ['starting', 'pending', 'running', 'active'].includes(String(this.generationStatus || '').toLowerCase());
  }

  protected get isGenerationSuccess(): boolean {
    return this.generationOutcome === 'ticket_ready';
  }

  protected get isGenerationFailed(): boolean {
    return Boolean(this.generationError) || this.generationOutcome === 'failed' || this.isFailureStatus(this.generationStatus);
  }

  protected get isGenerationNoTicket(): boolean {
    return this.generationOutcome === 'no_ticket';
  }

  protected get generationTone(): UiTone {
    if (this.isGenerationSuccess) {
      return 'success';
    }
    if (this.isGenerationFailed) {
      return 'danger';
    }
    if (this.isGenerationLive) {
      return 'live';
    }
    if (this.isGenerationNoTicket) {
      return 'warning';
    }
    return this.toneFor(this.generationStatus);
  }

  protected get generationProgress(): number {
    if (this.isGenerationSuccess || this.isGenerationFailed || this.isGenerationNoTicket) {
      return 100;
    }
    if (this.isGenerationLive) {
      return this.generatedOrchestratorRunId ? 68 : this.generatedRunId ? 38 : 16;
    }
    return this.generationStatus ? 24 : 0;
  }

  protected get generationDetail(): string {
    if (this.isGenerationSuccess) {
      return 'The ticket artifact is ready and selected below.';
    }
    if (this.isGenerationFailed) {
      return 'The generation job stopped before a usable ticket was available.';
    }
    if (this.isGenerationNoTicket) {
      return 'The run is visible for inspection, but no ticket card should be shown for this attempt.';
    }
    if (this.isGenerationLive) {
      return 'Auto-refresh is on. BetAuto is polling the run until a ticket artifact appears or the job settles.';
    }
    return 'Generation status will appear here after a ticket request is started.';
  }

  protected get generationPipClass(): string {
    const map: Record<UiTone, string> = {
      default: 'bg-muted',
      success: 'bg-success shadow-glow-success',
      warning: 'bg-warning shadow-glow-warning',
      danger: 'bg-danger',
      live: 'bg-accent shadow-glow',
      'score-70': 'bg-[#d97d68]',
      'score-75': 'bg-[#e5a155]',
      'score-80': 'bg-[#d4c45a]',
      'score-85': 'bg-[#86c86d]',
      'score-90': 'bg-[#41c7a5]',
      'score-95-plus': 'bg-[#4cd7f6] shadow-glow'
    };

    return map[this.generationTone];
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

  protected get auditEntries(): LogEntry[] {
    return (this.auditLog?.entries || []).map((entry, index) => ({
      time: String(index + 1).padStart(2, '0'),
      level: this.logLevel(entry.level),
      message: entry.message
    }));
  }

  protected get ticketVariants(): TicketVariant[] {
    return this.selectedTicket?.variants || [];
  }

  protected get selectedPickMatchAnalysis(): TicketMatchAnalysisDetail | null {
    return this.matchAnalysisForPick(this.selectedPickForModal);
  }

  protected openPickModal(pick: TicketPick): void {
    this.selectedPickForModal = pick;
  }

  protected closePickModal(): void {
    this.selectedPickForModal = null;
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

  protected confidenceTone(value: number | null | undefined): UiTone {
    return confidenceScoreToTone(value);
  }

  protected confidenceTierTone(value: string): UiTone {
    if (value === 'elite') {
      return 'live';
    }
    if (value === 'very_strong') {
      return 'success';
    }
    if (value === 'strong') {
      return 'warning';
    }
    if (value === 'medium_or_low') {
      return 'danger';
    }
    return 'default';
  }

  protected qualityTone(value: string): UiTone {
    const normalized = value.toLowerCase();
    if (normalized === 'high') {
      return 'success';
    }
    if (normalized === 'medium') {
      return 'warning';
    }
    if (normalized === 'low') {
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

  protected compactDate(value: string | null | undefined): string {
    if (!value) {
      return 'Kickoff unknown';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'short',
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  protected shortId(value: string | null | undefined): string {
    const text = String(value || '');
    if (text.length <= 28) {
      return text || '—';
    }
    return `${text.slice(0, 14)}…${text.slice(-10)}`;
  }

  protected targetRangeSummary(ticket: TicketDetail): string {
    const range = ticket.combo_in_target_range ? 'dans la cible de cote' : 'hors cible de cote';
    return `${ticket.picks_count} picks, ${range}.`;
  }

  protected competitionSummary(competitions: string[] | null | undefined): string {
    const items = (competitions || []).filter(Boolean);
    if (!items.length) {
      return 'Ligues non disponibles';
    }
    if (items.length <= 2) {
      return items.join(' · ');
    }
    return `${items.slice(0, 2).join(' · ')} +${items.length - 2}`;
  }

  protected selectionModeLabel(ticket: TicketDetail): string {
    return this.metadataLabel(ticket, 'selection_mode');
  }

  protected comboTargetLabel(ticket: TicketDetail): string {
    const config = ticket.selection_config || {};
    const min = typeof config['combo_min_odds'] === 'number' ? Number(config['combo_min_odds']).toFixed(2) : '—';
    const max = typeof config['combo_max_odds'] === 'number' ? Number(config['combo_max_odds']).toFixed(2) : '—';
    return `${min} - ${max}`;
  }

  protected metadataLabel(ticket: TicketDetail, key: string): string {
    const value = ticket.metadata?.[key];
    return value === null || value === undefined || value === '' ? '—' : String(value);
  }

  protected evidenceText(source: Record<string, unknown> | null | undefined, key: string): string {
    const value = source?.[key];
    return value === null || value === undefined || value === '' ? '—' : String(value);
  }

  protected evidenceNumber(source: Record<string, unknown> | null | undefined, key: string): number | null {
    const value = source?.[key];
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  }

  protected sourceLabel(mode: string | null | undefined): string {
    if (mode === 'strategy_application') {
      return 'Application stratégie';
    }
    if (mode === 'run_artifacts') {
      return 'Run principal';
    }
    return mode || 'Source inconnue';
  }

  protected inputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected isSelectedPredictedMarket(pick: TicketPick | null, marketCanonicalId: string, selectionCanonicalId: string): boolean {
    if (!pick) {
      return false;
    }
    const pickMarket = String(pick.market_canonical_id || '');
    const pickSelection = String(pick.selection_canonical_id || '');
    return Boolean(
      pickMarket
      && pickSelection
      && pickMarket === marketCanonicalId
      && pickSelection === selectionCanonicalId
    );
  }

  private matchAnalysisForPick(pick: TicketPick | null): TicketMatchAnalysisDetail | null {
    if (!pick) {
      return null;
    }

    const rows = this.matchAnalysisRows();
    const sourceId = pick.source_match_analysis_id || (pick.fixture_id ? `fixture_${pick.fixture_id}` : '');
    const bySource = sourceId ? rows.find((row) => row.sourceId === sourceId) : undefined;
    if (bySource) {
      return bySource;
    }

    const byFixture = pick.fixture_id
      ? rows.find((row) => row.fixtureId === pick.fixture_id)
      : undefined;
    if (byFixture) {
      return byFixture;
    }

    const event = String(pick.event || '').toLowerCase();
    const kickoff = String(pick.kickoff || '');
    return rows.find((row) => row.event.toLowerCase() === event && row.kickoff === kickoff) || null;
  }

  private matchAnalysisRows(): TicketMatchAnalysisDetail[] {
    const artifact = this.selectedTicketRunOutputs?.artifacts?.['match_analysis'];
    if (artifact?.status !== 'available') {
      return [];
    }

    return this.arrayFrom(artifact.data, 'results').map((item, index) => {
      const analysis = this.objectValue(item, 'analysis');
      const fixtureId = this.numberOrNull(this.value(analysis, 'fixture_id'));
      const globalConfidence = this.numberValue(analysis, 'global_confidence');
      const sourceId = fixtureId ? `fixture_${fixtureId}` : String(this.value(analysis, 'id') || index);
      return {
        id: sourceId,
        fixtureId,
        sourceId,
        event: this.text(analysis, 'event'),
        competition: this.text(analysis, 'competition'),
        kickoff: this.text(analysis, 'kickoff'),
        kickoffDisplay: this.formatKickoffLong(this.text(analysis, 'kickoff')),
        summary: this.text(analysis, 'analysis_summary'),
        keyFactors: this.arrayFrom(analysis, 'key_factors').map((factor) => String(factor)),
        risks: this.arrayFrom(analysis, 'risks').map((risk) => String(risk)),
        globalConfidence,
        globalConfidenceLabel: `${this.formatPercent(globalConfidence)} confidence`,
        dataQuality: this.text(analysis, 'data_quality'),
        confidenceTier: this.matchConfidenceTier(globalConfidence),
        predictedMarkets: this.arrayFrom(analysis, 'predicted_markets').map((market) => {
          const confidence = this.numberValue(market, 'confidence');
          return {
            marketCanonicalId: this.text(market, 'market_canonical_id'),
            selectionCanonicalId: this.text(market, 'selection_canonical_id'),
            confidence,
            confidenceLabel: this.formatPercent(confidence),
            reason: this.text(market, 'reason')
          };
        })
      };
    });
  }

  private matchConfidenceTier(value: number): string {
    if (value >= 90) {
      return 'elite';
    }
    if (value >= 80) {
      return 'very_strong';
    }
    if (value >= 70) {
      return 'strong';
    }
    if (value > 0) {
      return 'medium_or_low';
    }
    return 'unknown';
  }

  private arrayFrom(source: unknown, key: string): unknown[] {
    const obj = this.objectOrEmpty(source);
    return Array.isArray(obj[key]) ? obj[key] as unknown[] : [];
  }

  private objectValue(source: unknown, key: string): Record<string, unknown> {
    return this.objectOrEmpty(this.value(source, key));
  }

  private objectOrEmpty(source: unknown): Record<string, unknown> {
    return source && typeof source === 'object' && !Array.isArray(source) ? source as Record<string, unknown> : {};
  }

  private value(source: unknown, key: string): unknown {
    return this.objectOrEmpty(source)[key];
  }

  private numberValue(source: unknown, key: string): number {
    return this.numberOrNull(this.value(source, key)) ?? 0;
  }

  private numberOrNull(value: unknown): number | null {
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  }

  private text(source: unknown, key: string): string {
    const value = this.value(source, key);
    return value === null || value === undefined || value === '' ? '—' : String(value);
  }

  private formatKickoffLong(value: string): string {
    if (!value || value === '—') {
      return '—';
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }
    return new Intl.DateTimeFormat('fr-FR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  }

  private today(): string {
    return new Date().toISOString().slice(0, 10);
  }

  private nowLabel(): string {
    return new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date());
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

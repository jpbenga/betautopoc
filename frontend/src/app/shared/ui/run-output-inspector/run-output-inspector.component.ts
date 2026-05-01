import { Component, Input } from '@angular/core';
import { AnalysisRunArtifact, AnalysisRunOutputs } from '../../../core/api/api.types';
import { EmptyStateComponent } from '../empty-state/empty-state.component';
import { ErrorStateComponent } from '../error-state/error-state.component';
import { LoadingStateComponent } from '../loading-state/loading-state.component';
import { SectionCardComponent } from '../section-card/section-card.component';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

type ArtifactKey = 'match_analysis' | 'aggregation_candidates' | 'filtered_candidates' | 'selection';
type InspectorSection = ArtifactKey | 'raw_json';
type UiTone = 'default' | 'success' | 'warning' | 'danger' | 'live';

interface SummaryCard {
  label: string;
  value: string;
  tone: UiTone;
  detail: string;
}

interface MatchAnalysisRow {
  id: string;
  event: string;
  competition: string;
  kickoff: string;
  summary: string;
  global_confidence: string;
  data_quality: string;
  predicted_markets: string[];
}

interface CandidateRow {
  id: string;
  event: string;
  market: string;
  pick: string;
  confidence: string;
  tier: string;
  risk: string;
  odds: string;
  odds_source: string;
  reasons: string;
  retained: boolean;
}

interface SelectionPickRow {
  id: string;
  event: string;
  competition: string;
  kickoff: string;
  market: string;
  pick: string;
  confidence: string;
  risk: string;
}

interface SelectionSummaryView {
  status: string;
  estimated_combo_odds: string;
  global_confidence_score: string;
  combo_risk_level: string;
}

interface MatchProgressRow {
  id: string;
  index: string;
  status: string;
  event: string;
  competition: string;
  kickoff: string;
}

@Component({
  selector: 'ba-run-output-inspector',
  standalone: true,
  imports: [
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingStateComponent,
    SectionCardComponent,
    StatusBadgeComponent
  ],
  template: `
    <ba-section-card>
      <div class="ba-card-header flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p class="ba-label">Run outputs</p>
          <h3 class="mt-1 text-sm font-semibold text-text">Produced artifacts</h3>
          <p class="mt-1 text-xs text-muted">
            Inspecte les fichiers stricts du run sélectionné, sans fallback latest_*.
          </p>
        </div>
        <div class="flex flex-wrap gap-2">
          @if (outputs?.run_dir) {
            <ba-status-badge [label]="outputs?.run_dir || ''" tone="default"></ba-status-badge>
          }
          <ba-status-badge [label]="availableCount + ' available'" [tone]="availableCount ? 'success' : 'default'"></ba-status-badge>
          <ba-status-badge [label]="missingCount + ' missing'" [tone]="missingCount ? 'warning' : 'default'"></ba-status-badge>
          @if (progressPartial) {
            <ba-status-badge label="partial" tone="warning" [showPip]="true"></ba-status-badge>
          }
        </div>
      </div>

      <div class="p-4">
        @if (loading) {
          <ba-loading-state
            message="Loading run outputs..."
            detail="Reading match analysis, candidates, filtering and selection artifacts."
            [showShimmer]="true"
          ></ba-loading-state>
        } @else if (error) {
          <ba-error-state label="Run outputs unavailable" [message]="error"></ba-error-state>
        } @else if (!outputs) {
          <ba-empty-state
            label="No run selected"
            message="Select a run to inspect produced artifacts."
          ></ba-empty-state>
        } @else {
          <section class="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            @for (card of summaryCards; track card.label) {
              <div class="rounded-card border border-border/60 bg-background/60 p-3">
                <p class="ba-label">{{ card.label }}</p>
                <p class="ba-data mt-2 text-lg text-text">{{ card.value }}</p>
                <p class="mt-1 truncate text-xs text-muted">{{ card.detail }}</p>
              </div>
            }
          </section>

          @if (progressRows.length) {
            <section class="mt-4 rounded-card border border-border/70 bg-background/50 p-3">
              <div class="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p class="ba-label">Live match progress</p>
                  <h4 class="mt-1 text-sm font-semibold text-text">{{ progressSummary }}</h4>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <select
                    class="ba-tool max-w-44 bg-background text-xs"
                    [value]="statusFilter"
                    (change)="setStatusFilter($event)"
                    aria-label="Progress status filter"
                  >
                    <option value="all">All statuses</option>
                    @for (status of progressStatusOptions; track status) {
                      <option [value]="status">{{ status }}</option>
                    }
                  </select>
                  <ba-status-badge [label]="progressStatus" [tone]="progressTone(progressStatus)" [showPip]="true" [pulse]="progressStatus === 'running'"></ba-status-badge>
                </div>
              </div>
              <div class="mt-3 grid gap-2 lg:grid-cols-2">
                @for (row of visibleProgressRows; track row.id) {
                  <article class="flex items-center justify-between gap-3 rounded-card border border-border/60 bg-surface-low px-3 py-2">
                    <div class="min-w-0">
                      <p class="truncate text-sm font-medium text-text">{{ row.index }} · {{ row.event }}</p>
                      <p class="truncate text-xs text-muted">{{ row.competition }} · {{ row.kickoff }}</p>
                    </div>
                    <ba-status-badge
                      [label]="row.status"
                      [tone]="progressTone(row.status)"
                      [showPip]="true"
                      [pulse]="row.status === 'running'"
                    ></ba-status-badge>
                  </article>
                } @empty {
                  <p class="rounded-card border border-border/60 bg-surface-low p-3 text-sm text-muted">No progress row matches this filter.</p>
                }
              </div>
              @if (filteredProgressRows.length > progressLimit) {
                <button type="button" class="ba-tool mt-3" (click)="toggleShowAll('progress')">
                  {{ showAllProgress ? 'Show less' : 'Show all ' + filteredProgressRows.length }}
                </button>
              }
            </section>
          }

          <div class="mt-4 space-y-3">
            <section class="rounded-card border border-border/70 bg-background/50">
              <button
                type="button"
                class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                (click)="toggleSection('match_analysis')"
              >
                <span>
                  <span class="ba-label">Match Analysis</span>
                  <span class="mt-1 block text-sm font-semibold text-text">{{ matchRows.length }} analyzed matches</span>
                </span>
                <ba-status-badge [label]="sectionStateLabel('match_analysis')" [tone]="artifactTone(artifact('match_analysis'))" [showPip]="true"></ba-status-badge>
              </button>
              @if (isSectionOpen('match_analysis')) {
                <div class="border-t border-border/60 p-4">
                  @if (!isAvailable(artifact('match_analysis'))) {
                    <ba-empty-state
                      label="match_analysis.json"
                      [message]="artifact('match_analysis')?.error || 'Artifact missing for this run.'"
                      tone="warning"
                    ></ba-empty-state>
                  } @else {
                    <div class="mb-3 flex flex-wrap gap-2">
                      <select
                        class="ba-tool max-w-56 bg-background text-xs"
                        [value]="competitionFilter"
                        (change)="setCompetitionFilter($event)"
                        aria-label="Competition filter"
                      >
                        <option value="all">All competitions</option>
                        @for (competition of competitionOptions; track competition) {
                          <option [value]="competition">{{ competition }}</option>
                        }
                      </select>
                    </div>

                    <div class="grid gap-2">
                      @for (match of visibleMatchRows; track match.id) {
                        <article class="rounded-card border border-border/60 bg-surface-low">
                          <button
                            type="button"
                            class="flex w-full flex-col gap-2 p-3 text-left lg:flex-row lg:items-start lg:justify-between"
                            (click)="toggleRow('match:' + match.id)"
                          >
                            <span class="min-w-0">
                              <span class="ba-label">{{ match.competition }} · {{ match.kickoff }}</span>
                              <span class="mt-1 block truncate text-sm font-semibold text-text">{{ match.event }}</span>
                            </span>
                            <span class="flex flex-wrap gap-2">
                              <ba-status-badge [label]="match.data_quality" [tone]="qualityTone(match.data_quality)"></ba-status-badge>
                              <ba-status-badge [label]="match.global_confidence" tone="success"></ba-status-badge>
                            </span>
                          </button>
                          @if (isRowOpen('match:' + match.id)) {
                            <div class="border-t border-border/60 p-3">
                              <p class="text-sm leading-6 text-muted">{{ match.summary }}</p>
                              <div class="mt-3 flex flex-wrap gap-2">
                                @for (market of match.predicted_markets; track market + $index) {
                                  <span class="rounded-full border border-border/70 bg-background px-2 py-1 text-xs text-muted">{{ market }}</span>
                                }
                              </div>
                            </div>
                          }
                        </article>
                      } @empty {
                        <ba-empty-state label="No match analysis" message="No match matches the current filters."></ba-empty-state>
                      }
                    </div>

                    @if (filteredMatchRows.length > rowLimit) {
                      <button type="button" class="ba-tool mt-3" (click)="toggleShowAll('matches')">
                        {{ showAllMatches ? 'Show less' : 'Show more matches (' + filteredMatchRows.length + ')' }}
                      </button>
                    }
                  }
                </div>
              }
            </section>

            <section class="rounded-card border border-border/70 bg-background/50">
              <button
                type="button"
                class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                (click)="toggleSection('aggregation_candidates')"
              >
                <span>
                  <span class="ba-label">Aggregated Candidates</span>
                  <span class="mt-1 block text-sm font-semibold text-text">{{ aggregationRows.length }} candidates</span>
                </span>
                <ba-status-badge [label]="sectionStateLabel('aggregation_candidates')" [tone]="artifactTone(artifact('aggregation_candidates'))" [showPip]="true"></ba-status-badge>
              </button>
              @if (isSectionOpen('aggregation_candidates')) {
                <div class="border-t border-border/60 p-4">
                  @if (!isAvailable(artifact('aggregation_candidates'))) {
                    <ba-empty-state
                      label="aggregation_candidates.json"
                      [message]="artifact('aggregation_candidates')?.error || 'Artifact missing for this run.'"
                      tone="warning"
                    ></ba-empty-state>
                  } @else {
                    <div class="mb-3 flex flex-wrap gap-2">
                      <select class="ba-tool max-w-56 bg-background text-xs" [value]="marketFilter" (change)="setMarketFilter($event)" aria-label="Market filter">
                        <option value="all">All markets</option>
                        @for (market of marketOptions; track market) {
                          <option [value]="market">{{ market }}</option>
                        }
                      </select>
                      <select class="ba-tool max-w-48 bg-background text-xs" [value]="tierFilter" (change)="setTierFilter($event)" aria-label="Confidence tier filter">
                        <option value="all">All confidence tiers</option>
                        @for (tier of tierOptions; track tier) {
                          <option [value]="tier">{{ tier }}</option>
                        }
                      </select>
                    </div>

                    <div class="grid gap-2">
                      @for (candidate of visibleAggregationRows; track candidate.id) {
                        <article class="rounded-card border border-border/60 bg-surface-low">
                          <button
                            type="button"
                            class="grid w-full gap-2 p-3 text-left lg:grid-cols-[1.5fr_1fr_auto]"
                            (click)="toggleRow('candidate:' + candidate.id)"
                          >
                            <span class="min-w-0">
                              <span class="block truncate text-sm font-medium text-text">{{ candidate.event }}</span>
                              <span class="mt-1 block truncate text-xs text-muted">{{ candidate.market }} · {{ candidate.pick }}</span>
                            </span>
                            <span class="flex flex-wrap gap-2">
                              <ba-status-badge [label]="candidate.tier" tone="default"></ba-status-badge>
                              <ba-status-badge [label]="candidate.risk" [tone]="riskTone(candidate.risk)"></ba-status-badge>
                            </span>
                            <span class="ba-data text-right text-text">{{ candidate.confidence }}</span>
                          </button>
                          @if (isRowOpen('candidate:' + candidate.id)) {
                            <dl class="grid gap-3 border-t border-border/60 p-3 text-sm sm:grid-cols-4">
                              <div><dt class="ba-label">Odds</dt><dd class="mt-1 text-text">{{ candidate.odds }}</dd></div>
                              <div><dt class="ba-label">Source</dt><dd class="mt-1 text-muted">{{ candidate.odds_source }}</dd></div>
                              <div><dt class="ba-label">Risk</dt><dd class="mt-1 text-muted">{{ candidate.risk }}</dd></div>
                              <div><dt class="ba-label">Tier</dt><dd class="mt-1 text-muted">{{ candidate.tier }}</dd></div>
                            </dl>
                          }
                        </article>
                      } @empty {
                        <ba-empty-state label="No aggregated candidates" message="No candidate matches the current filters."></ba-empty-state>
                      }
                    </div>

                    @if (filteredAggregationRows.length > rowLimit) {
                      <button type="button" class="ba-tool mt-3" (click)="toggleShowAll('aggregation')">
                        {{ showAllAggregation ? 'Show less' : 'Show more candidates (' + filteredAggregationRows.length + ')' }}
                      </button>
                    }
                  }
                </div>
              }
            </section>

            <section class="rounded-card border border-border/70 bg-background/50">
              <button
                type="button"
                class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                (click)="toggleSection('filtered_candidates')"
              >
                <span>
                  <span class="ba-label">Filtered Candidates</span>
                  <span class="mt-1 block text-sm font-semibold text-text">{{ retainedRows.length }} retained · {{ rejectedRows.length }} rejected</span>
                </span>
                <ba-status-badge [label]="sectionStateLabel('filtered_candidates')" [tone]="artifactTone(artifact('filtered_candidates'))" [showPip]="true"></ba-status-badge>
              </button>
              @if (isSectionOpen('filtered_candidates')) {
                <div class="border-t border-border/60 p-4">
                  @if (!isAvailable(artifact('filtered_candidates'))) {
                    <ba-empty-state
                      label="filtered_candidates.json"
                      [message]="artifact('filtered_candidates')?.error || 'Artifact missing for this run.'"
                      tone="warning"
                    ></ba-empty-state>
                  } @else {
                    <div class="mb-3 flex flex-wrap gap-2">
                      <select class="ba-tool max-w-44 bg-background text-xs" [value]="retainedFilter" (change)="setRetainedFilter($event)" aria-label="Retained rejected filter">
                        <option value="all">Retained + rejected</option>
                        <option value="retained">Retained only</option>
                        <option value="rejected">Rejected only</option>
                      </select>
                      <select class="ba-tool max-w-56 bg-background text-xs" [value]="marketFilter" (change)="setMarketFilter($event)" aria-label="Market filter">
                        <option value="all">All markets</option>
                        @for (market of marketOptions; track market) {
                          <option [value]="market">{{ market }}</option>
                        }
                      </select>
                      <select class="ba-tool max-w-48 bg-background text-xs" [value]="tierFilter" (change)="setTierFilter($event)" aria-label="Confidence tier filter">
                        <option value="all">All confidence tiers</option>
                        @for (tier of tierOptions; track tier) {
                          <option [value]="tier">{{ tier }}</option>
                        }
                      </select>
                    </div>

                    <div class="grid gap-2">
                      @for (candidate of visibleFilteredCandidateRows; track candidate.id) {
                        <article class="rounded-card border border-border/60 bg-surface-low">
                          <button
                            type="button"
                            class="grid w-full gap-2 p-3 text-left lg:grid-cols-[1.5fr_1fr_auto]"
                            (click)="toggleRow('filtered:' + candidate.id)"
                          >
                            <span class="min-w-0">
                              <span class="block truncate text-sm font-medium text-text">{{ candidate.event }} · {{ candidate.pick }}</span>
                              <span class="mt-1 block truncate text-xs text-muted">{{ candidate.market }}</span>
                            </span>
                            <span class="flex flex-wrap gap-2">
                              <ba-status-badge [label]="candidate.retained ? 'retained' : 'rejected'" [tone]="candidate.retained ? 'success' : 'warning'"></ba-status-badge>
                              <ba-status-badge [label]="candidate.risk" [tone]="riskTone(candidate.risk)"></ba-status-badge>
                            </span>
                            <span class="ba-data text-right text-text">{{ candidate.confidence }}</span>
                          </button>
                          @if (isRowOpen('filtered:' + candidate.id)) {
                            <div class="border-t border-border/60 p-3">
                              <p class="text-sm text-muted">Reasons: {{ candidate.reasons }}</p>
                              <p class="mt-2 text-xs text-muted">Odds {{ candidate.odds }} · {{ candidate.odds_source }} · {{ candidate.tier }}</p>
                            </div>
                          }
                        </article>
                      } @empty {
                        <ba-empty-state label="No filtered candidates" message="No candidate matches the current filters."></ba-empty-state>
                      }
                    </div>

                    @if (filteredCandidateRows.length > rowLimit) {
                      <button type="button" class="ba-tool mt-3" (click)="toggleShowAll('filtered')">
                        {{ showAllFiltered ? 'Show less' : 'Show more filtered candidates (' + filteredCandidateRows.length + ')' }}
                      </button>
                    }
                  }
                </div>
              }
            </section>

            <section class="rounded-card border border-border/70 bg-background/50">
              <button
                type="button"
                class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                (click)="toggleSection('selection')"
              >
                <span>
                  <span class="ba-label">Final Selection</span>
                  <span class="mt-1 block text-sm font-semibold text-text">{{ selectionPicks.length }} final picks · {{ selectionSummary.status }}</span>
                </span>
                <ba-status-badge [label]="sectionStateLabel('selection')" [tone]="artifactTone(artifact('selection'))" [showPip]="true"></ba-status-badge>
              </button>
              @if (isSectionOpen('selection')) {
                <div class="border-t border-border/60 p-4">
                  @if (!isAvailable(artifact('selection'))) {
                    <ba-empty-state
                      label="selection.json"
                      [message]="artifact('selection')?.error || 'Artifact missing for this run.'"
                      tone="warning"
                    ></ba-empty-state>
                  } @else {
                    <div class="grid gap-3 lg:grid-cols-4">
                      <div class="rounded-card border border-border/60 bg-surface-low p-3">
                        <p class="ba-label">Estimated odds</p>
                        <p class="ba-data mt-2 text-text">{{ selectionSummary.estimated_combo_odds }}</p>
                      </div>
                      <div class="rounded-card border border-border/60 bg-surface-low p-3">
                        <p class="ba-label">Confidence</p>
                        <p class="ba-data mt-2 text-text">{{ selectionSummary.global_confidence_score }}</p>
                      </div>
                      <div class="rounded-card border border-border/60 bg-surface-low p-3">
                        <p class="ba-label">Risk</p>
                        <p class="ba-data mt-2 text-text">{{ selectionSummary.combo_risk_level }}</p>
                      </div>
                      <div class="rounded-card border border-border/60 bg-surface-low p-3">
                        <p class="ba-label">Status</p>
                        <p class="ba-data mt-2 text-text">{{ selectionSummary.status }}</p>
                      </div>
                    </div>

                    <div class="mt-3 grid gap-2">
                      @for (pick of visibleSelectionPicks; track pick.id) {
                        <article class="rounded-card border border-border/60 bg-surface-low">
                          <button
                            type="button"
                            class="flex w-full flex-col gap-2 p-3 text-left lg:flex-row lg:items-start lg:justify-between"
                            (click)="toggleRow('pick:' + pick.id)"
                          >
                            <span class="min-w-0">
                              <span class="ba-label">{{ pick.competition }} · {{ pick.kickoff }}</span>
                              <span class="mt-1 block truncate text-sm font-semibold text-text">{{ pick.event }}</span>
                              <span class="mt-1 block truncate text-xs text-muted">{{ pick.market }} · {{ pick.pick }}</span>
                            </span>
                            <span class="flex flex-wrap gap-2">
                              <ba-status-badge [label]="pick.confidence" tone="success"></ba-status-badge>
                              <ba-status-badge [label]="pick.risk" [tone]="riskTone(pick.risk)"></ba-status-badge>
                            </span>
                          </button>
                        </article>
                      } @empty {
                        <ba-empty-state label="No final picks" message="selection.json contains no retained picks." tone="warning"></ba-empty-state>
                      }
                    </div>

                    @if (selectionPicks.length > rowLimit) {
                      <button type="button" class="ba-tool mt-3" (click)="toggleShowAll('selection')">
                        {{ showAllSelection ? 'Show less' : 'Show more picks (' + selectionPicks.length + ')' }}
                      </button>
                    }

                    @if (selectionNotes.length || selectionErrors.length) {
                      <div class="mt-4 grid gap-4 lg:grid-cols-2">
                        <div class="rounded-card border border-border/60 bg-surface-low p-4">
                          <p class="ba-label">Notes</p>
                          @for (note of selectionNotes; track note + $index) {
                            <p class="mt-2 text-sm text-muted">{{ note }}</p>
                          } @empty {
                            <p class="mt-2 text-sm text-muted">No notes.</p>
                          }
                        </div>
                        <div class="rounded-card border border-danger/30 bg-danger/5 p-4">
                          <p class="ba-label text-danger">Errors</p>
                          @for (error of selectionErrors; track error + $index) {
                            <p class="mt-2 text-sm text-danger">{{ error }}</p>
                          } @empty {
                            <p class="mt-2 text-sm text-muted">No errors.</p>
                          }
                        </div>
                      </div>
                    }
                  }
                </div>
              }
            </section>

            <section class="rounded-card border border-border/70 bg-background/50">
              <button
                type="button"
                class="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
                (click)="toggleSection('raw_json')"
              >
                <span>
                  <span class="ba-label">Raw JSON</span>
                  <span class="mt-1 block text-sm font-semibold text-text">{{ rawArtifactTitle }}</span>
                </span>
                <ba-status-badge [label]="isSectionOpen('raw_json') ? 'open' : 'closed'" tone="default"></ba-status-badge>
              </button>
              @if (isSectionOpen('raw_json')) {
                <div class="border-t border-border/60 p-4">
                  <div class="mb-3 flex flex-wrap gap-2">
                    @for (tab of artifactTabs; track tab.key) {
                      <button
                        type="button"
                        class="ba-tool"
                        [class.border-accent]="rawArtifactKey === tab.key"
                        [class.bg-accent]="rawArtifactKey === tab.key"
                        [class.text-background]="rawArtifactKey === tab.key"
                        (click)="rawArtifactKey = tab.key"
                      >
                        {{ tab.label }}
                      </button>
                    }
                  </div>
                  @if (!isAvailable(rawArtifact)) {
                    <ba-empty-state
                      [label]="rawArtifact?.filename || rawArtifactKey"
                      [message]="rawArtifact?.error || 'Artifact missing for this run.'"
                      tone="warning"
                    ></ba-empty-state>
                  } @else {
                    <pre class="max-h-96 overflow-auto whitespace-pre-wrap rounded-card border border-border/60 bg-background p-3 text-xs text-muted">{{ rawJson(rawArtifact?.data) }}</pre>
                  }
                </div>
              }
            </section>
          </div>
        }
      </div>
    </ba-section-card>
  `
})
export class RunOutputInspectorComponent {
  @Input() outputs: AnalysisRunOutputs | null = null;
  @Input() loading = false;
  @Input() error = '';

  protected readonly rowLimit = 6;
  protected readonly progressLimit = 6;
  protected rawArtifactKey: ArtifactKey = 'match_analysis';
  protected competitionFilter = 'all';
  protected statusFilter = 'all';
  protected marketFilter = 'all';
  protected tierFilter = 'all';
  protected retainedFilter: 'all' | 'retained' | 'rejected' = 'all';
  protected showAllProgress = false;
  protected showAllMatches = false;
  protected showAllAggregation = false;
  protected showAllFiltered = false;
  protected showAllSelection = false;
  protected expandedSections: Record<InspectorSection, boolean> = {
    match_analysis: true,
    aggregation_candidates: false,
    filtered_candidates: false,
    selection: false,
    raw_json: false
  };
  protected expandedRows: Record<string, boolean> = {};
  protected readonly artifactTabs: Array<{ key: ArtifactKey; label: string }> = [
    { key: 'match_analysis', label: 'Match Analysis' },
    { key: 'aggregation_candidates', label: 'Aggregated Candidates' },
    { key: 'filtered_candidates', label: 'Filtered Candidates' },
    { key: 'selection', label: 'Final Selection' }
  ];

  protected get availableCount(): number {
    return Object.values(this.outputs?.artifacts || {}).filter((artifact) => artifact.status === 'available').length;
  }

  protected get missingCount(): number {
    return Object.values(this.outputs?.artifacts || {}).filter((artifact) => artifact.status !== 'available').length;
  }

  protected get summaryCards(): SummaryCard[] {
    const skipped = this.progressNumber('skipped_matches');
    const failed = this.progressNumber('failed_matches');
    const errors = this.selectionErrors.length + (failed || 0);
    return [
      { label: 'Matches found', value: this.progressLabel('total_matches', this.matchRows.length), tone: 'default', detail: `${this.progressStatus} run status` },
      { label: 'Matches analyzed', value: this.progressLabel('analyzed_matches', this.matchRows.length), tone: 'success', detail: `${this.filteredMatchRows.length} visible after filters` },
      { label: 'Aggregated candidates', value: String(this.aggregationRows.length), tone: 'default', detail: `${this.filteredAggregationRows.length} visible` },
      { label: 'Filtered candidates', value: String(this.retainedRows.length + this.rejectedRows.length), tone: 'warning', detail: `${this.retainedRows.length} retained · ${this.rejectedRows.length} rejected` },
      { label: 'Final picks', value: String(this.selectionPicks.length), tone: this.selectionPicks.length ? 'success' : 'default', detail: this.selectionSummary.status },
      { label: 'Errors / skips', value: String(errors + (skipped || 0)), tone: errors || skipped ? 'danger' : 'success', detail: `${errors} errors · ${skipped || 0} skips` }
    ];
  }

  protected get progressRows(): MatchProgressRow[] {
    return this.arrayFrom(this.outputs?.progress, 'matches').map((item, fallbackIndex) => ({
      id: String(this.value(item, 'fixture_id') || fallbackIndex),
      index: String(this.value(item, 'index') || fallbackIndex + 1),
      status: String(this.value(item, 'status') || 'pending'),
      event: this.text(item, 'event'),
      competition: this.text(item, 'competition'),
      kickoff: this.text(item, 'kickoff')
    }));
  }

  protected get progressStatusOptions(): string[] {
    return this.unique(this.progressRows.map((row) => row.status));
  }

  protected get filteredProgressRows(): MatchProgressRow[] {
    return this.statusFilter === 'all'
      ? this.progressRows
      : this.progressRows.filter((row) => row.status === this.statusFilter);
  }

  protected get visibleProgressRows(): MatchProgressRow[] {
    return this.showAllProgress ? this.filteredProgressRows : this.filteredProgressRows.slice(0, this.progressLimit);
  }

  protected get progressStatus(): string {
    return String(this.objectOrEmpty(this.outputs?.progress)['status'] || 'pending');
  }

  protected get progressPartial(): boolean {
    return this.objectOrEmpty(this.outputs?.progress)['partial'] === true;
  }

  protected get progressSummary(): string {
    const progress = this.objectOrEmpty(this.outputs?.progress);
    const analyzed = progress['analyzed_matches'];
    const total = progress['total_matches'];
    const current = progress['current_match_label'];
    const base = typeof analyzed === 'number' && typeof total === 'number'
      ? `${analyzed}/${total} analyses settled`
      : 'Progress pending';
    return current ? `${base} · current ${current}` : base;
  }

  protected get matchRows(): MatchAnalysisRow[] {
    const results = this.arrayFrom(this.artifact('match_analysis')?.data, 'results');
    return results.map((item, index) => {
      const analysis = this.objectValue(item, 'analysis');
      const predicted = this.arrayFrom(analysis, 'predicted_markets');
      return {
        id: String(this.value(analysis, 'fixture_id') || index),
        event: this.text(analysis, 'event'),
        competition: this.text(analysis, 'competition'),
        kickoff: this.text(analysis, 'kickoff'),
        summary: this.text(analysis, 'analysis_summary'),
        global_confidence: `${this.value(analysis, 'global_confidence') ?? '—'}% confidence`,
        data_quality: this.text(analysis, 'data_quality'),
        predicted_markets: predicted.map((market) => `${this.text(market, 'market_canonical_id')} · ${this.value(market, 'confidence') ?? '—'}%`)
      };
    });
  }

  protected get competitionOptions(): string[] {
    return this.unique([
      ...this.matchRows.map((row) => row.competition),
      ...this.selectionPicks.map((pick) => pick.competition)
    ]);
  }

  protected get filteredMatchRows(): MatchAnalysisRow[] {
    return this.competitionFilter === 'all'
      ? this.matchRows
      : this.matchRows.filter((row) => row.competition === this.competitionFilter);
  }

  protected get visibleMatchRows(): MatchAnalysisRow[] {
    return this.showAllMatches ? this.filteredMatchRows : this.filteredMatchRows.slice(0, this.rowLimit);
  }

  protected get aggregationRows(): CandidateRow[] {
    return this.candidateRows(this.arrayFrom(this.artifact('aggregation_candidates')?.data, 'candidates'), true);
  }

  protected get retainedRows(): CandidateRow[] {
    return this.candidateRows(this.arrayFrom(this.artifact('filtered_candidates')?.data, 'candidates'), true);
  }

  protected get rejectedRows(): CandidateRow[] {
    return this.candidateRows(this.arrayFrom(this.artifact('filtered_candidates')?.data, 'rejected_candidates'), false);
  }

  protected get marketOptions(): string[] {
    return this.unique([
      ...this.aggregationRows.map((row) => row.market),
      ...this.retainedRows.map((row) => row.market),
      ...this.rejectedRows.map((row) => row.market)
    ]);
  }

  protected get tierOptions(): string[] {
    return this.unique([
      ...this.aggregationRows.map((row) => row.tier),
      ...this.retainedRows.map((row) => row.tier),
      ...this.rejectedRows.map((row) => row.tier)
    ]);
  }

  protected get filteredAggregationRows(): CandidateRow[] {
    return this.applyCandidateFilters(this.aggregationRows);
  }

  protected get visibleAggregationRows(): CandidateRow[] {
    return this.showAllAggregation ? this.filteredAggregationRows : this.filteredAggregationRows.slice(0, this.rowLimit);
  }

  protected get filteredCandidateRows(): CandidateRow[] {
    const rows = [...this.retainedRows, ...this.rejectedRows].filter((row) => {
      if (this.retainedFilter === 'retained') {
        return row.retained;
      }
      if (this.retainedFilter === 'rejected') {
        return !row.retained;
      }
      return true;
    });
    return this.applyCandidateFilters(rows);
  }

  protected get visibleFilteredCandidateRows(): CandidateRow[] {
    return this.showAllFiltered ? this.filteredCandidateRows : this.filteredCandidateRows.slice(0, this.rowLimit);
  }

  protected get selectionSummary(): SelectionSummaryView {
    const data = this.objectOrEmpty(this.artifact('selection')?.data);
    return {
      status: String(data['status'] ?? 'unknown'),
      estimated_combo_odds: this.formatNumber(data['estimated_combo_odds']),
      global_confidence_score: this.formatPercent(data['global_confidence_score']),
      combo_risk_level: String(data['combo_risk_level'] ?? '—')
    };
  }

  protected get selectionPicks(): SelectionPickRow[] {
    return this.arrayFrom(this.artifact('selection')?.data, 'picks').map((pick, index) => ({
      id: this.text(pick, 'pick_id') || String(index),
      event: this.text(pick, 'event'),
      competition: this.text(pick, 'competition'),
      kickoff: this.text(pick, 'kickoff'),
      market: this.text(pick, 'market'),
      pick: this.text(pick, 'pick'),
      confidence: this.formatPercent(this.value(pick, 'confidence_score')),
      risk: this.text(pick, 'risk_level')
    }));
  }

  protected get visibleSelectionPicks(): SelectionPickRow[] {
    return this.showAllSelection ? this.selectionPicks : this.selectionPicks.slice(0, this.rowLimit);
  }

  protected get selectionNotes(): string[] {
    return this.arrayFrom(this.artifact('selection')?.data, 'notes').map((note) => String(note));
  }

  protected get selectionErrors(): string[] {
    return this.arrayFrom(this.artifact('selection')?.data, 'errors').map((error) => String(error));
  }

  protected get rawArtifact(): AnalysisRunArtifact | undefined {
    return this.artifact(this.rawArtifactKey);
  }

  protected get rawArtifactTitle(): string {
    return this.artifactTabs.find((tab) => tab.key === this.rawArtifactKey)?.label || this.rawArtifactKey;
  }

  protected artifact(key: ArtifactKey): AnalysisRunArtifact | undefined {
    return this.outputs?.artifacts?.[key];
  }

  protected isAvailable(artifact: AnalysisRunArtifact | undefined): boolean {
    return artifact?.status === 'available';
  }

  protected sectionStateLabel(section: ArtifactKey): string {
    const artifact = this.artifact(section);
    if (!artifact) {
      return 'missing';
    }
    return this.isSectionOpen(section) ? `${artifact.status} · open` : `${artifact.status} · closed`;
  }

  protected isSectionOpen(section: InspectorSection): boolean {
    return this.expandedSections[section];
  }

  protected toggleSection(section: InspectorSection): void {
    this.expandedSections[section] = !this.expandedSections[section];
  }

  protected isRowOpen(rowId: string): boolean {
    return this.expandedRows[rowId] === true;
  }

  protected toggleRow(rowId: string): void {
    this.expandedRows[rowId] = !this.expandedRows[rowId];
  }

  protected toggleShowAll(kind: 'progress' | 'matches' | 'aggregation' | 'filtered' | 'selection'): void {
    if (kind === 'progress') {
      this.showAllProgress = !this.showAllProgress;
    }
    if (kind === 'matches') {
      this.showAllMatches = !this.showAllMatches;
    }
    if (kind === 'aggregation') {
      this.showAllAggregation = !this.showAllAggregation;
    }
    if (kind === 'filtered') {
      this.showAllFiltered = !this.showAllFiltered;
    }
    if (kind === 'selection') {
      this.showAllSelection = !this.showAllSelection;
    }
  }

  protected setCompetitionFilter(event: Event): void {
    this.competitionFilter = this.selectValue(event);
    this.showAllMatches = false;
  }

  protected setStatusFilter(event: Event): void {
    this.statusFilter = this.selectValue(event);
    this.showAllProgress = false;
  }

  protected setMarketFilter(event: Event): void {
    this.marketFilter = this.selectValue(event);
    this.showAllAggregation = false;
    this.showAllFiltered = false;
  }

  protected setTierFilter(event: Event): void {
    this.tierFilter = this.selectValue(event);
    this.showAllAggregation = false;
    this.showAllFiltered = false;
  }

  protected setRetainedFilter(event: Event): void {
    const value = this.selectValue(event);
    this.retainedFilter = value === 'retained' || value === 'rejected' ? value : 'all';
    this.showAllFiltered = false;
  }

  protected artifactTone(artifact: AnalysisRunArtifact | undefined): UiTone {
    if (!artifact) {
      return 'default';
    }
    if (artifact.status === 'available') {
      return 'success';
    }
    if (artifact.status === 'error') {
      return 'danger';
    }
    return 'warning';
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

  protected riskTone(value: string): UiTone {
    const normalized = value.toLowerCase();
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

  protected progressTone(value: string): UiTone {
    const normalized = value.toLowerCase();
    if (normalized === 'completed') {
      return 'success';
    }
    if (normalized === 'running') {
      return 'live';
    }
    if (normalized === 'failed') {
      return 'danger';
    }
    if (['pending', 'stopped'].includes(normalized)) {
      return 'warning';
    }
    return 'default';
  }

  protected rawJson(value: unknown): string {
    return JSON.stringify(value ?? {}, null, 2);
  }

  private applyCandidateFilters(rows: CandidateRow[]): CandidateRow[] {
    return rows.filter((row) => {
      const marketMatches = this.marketFilter === 'all' || row.market === this.marketFilter;
      const tierMatches = this.tierFilter === 'all' || row.tier === this.tierFilter;
      return marketMatches && tierMatches;
    });
  }

  private candidateRows(items: unknown[], retained: boolean): CandidateRow[] {
    return items.map((candidate, index) => ({
      id: this.text(candidate, 'candidate_id') || `${retained ? 'retained' : 'rejected'}-${index}`,
      event: this.text(candidate, 'event'),
      market: this.text(candidate, 'market'),
      pick: this.text(candidate, 'pick'),
      confidence: this.formatPercent(this.value(candidate, 'confidence_score')),
      tier: this.text(candidate, 'confidence_tier'),
      risk: this.text(candidate, 'risk_level'),
      odds: this.formatNumber(this.value(candidate, 'odds')),
      odds_source: this.text(candidate, 'odds_source'),
      reasons: this.arrayFrom(candidate, 'rejection_reasons').join(', ') || '—',
      retained
    }));
  }

  private progressNumber(key: string): number | null {
    const value = this.objectOrEmpty(this.outputs?.progress)[key];
    return typeof value === 'number' && Number.isFinite(value) ? value : null;
  }

  private progressLabel(key: string, fallback: number): string {
    const value = this.progressNumber(key);
    return String(value ?? fallback);
  }

  private arrayFrom(source: unknown, key: string): unknown[] {
    const obj = this.objectOrEmpty(source);
    return Array.isArray(obj[key]) ? obj[key] as unknown[] : [];
  }

  private objectValue(source: unknown, key: string): Record<string, unknown> {
    const obj = this.objectOrEmpty(source);
    return this.objectOrEmpty(obj[key]);
  }

  private objectOrEmpty(source: unknown): Record<string, unknown> {
    return source && typeof source === 'object' && !Array.isArray(source) ? source as Record<string, unknown> : {};
  }

  private value(source: unknown, key: string): unknown {
    return this.objectOrEmpty(source)[key];
  }

  private text(source: unknown, key: string): string {
    const value = this.value(source, key);
    return value === null || value === undefined || value === '' ? '—' : String(value);
  }

  private formatNumber(value: unknown): string {
    return typeof value === 'number' && Number.isFinite(value) ? value.toFixed(2) : '—';
  }

  private formatPercent(value: unknown): string {
    return typeof value === 'number' && Number.isFinite(value) ? `${Math.round(value)}%` : '—';
  }

  private selectValue(event: Event): string {
    return (event.target as HTMLSelectElement | null)?.value || 'all';
  }

  private unique(values: string[]): string[] {
    return Array.from(new Set(values.filter((value) => value && value !== '—'))).sort((a, b) => a.localeCompare(b));
  }
}

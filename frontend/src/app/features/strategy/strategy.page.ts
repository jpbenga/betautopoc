import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AnalysisApiService } from '../../core/api/analysis-api.service';
import { CoverageApiService } from '../../core/api/coverage-api.service';
import { StrategyApiService } from '../../core/api/strategy-api.service';
import {
  AnalysisRunOutputs,
  AnalysisRunListItem,
  FootballLeagueRegistryEntry,
  FootballLeagueRegistryResponse,
  StrategyApplyResponse,
  StrategyCatalogItem,
  StrategyCatalogResponse,
  StrategyDetailResponse
} from '../../core/api/api.types';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';

type RiskLevel = 'low' | 'medium' | 'high';
type TicketType = 'single' | 'combo' | 'mixed';
type DataQuality = 'low' | 'medium' | 'high';
type StakingMethod = 'manual' | 'flat' | 'percentage' | 'kelly_fractional' | 'cycle_rollover';

interface StrategyForm {
  name: string;
  description: string;
  enabled: boolean;
  preferredTicketType: TicketType;
  allowSingle: boolean;
  allowCombo: boolean;
  minPicks: number;
  maxPicks: number;
  targetOddsEnabled: boolean;
  targetOddsMin: number;
  targetOddsMax: number;
  minMatchConfidence: number;
  minPickConfidence: number;
  minComboConfidence: number;
  riskAppetite: RiskLevel;
  maxPickRisk: RiskLevel;
  maxComboRisk: RiskLevel;
  minDataQuality: DataQuality;
  requireOddsAvailable: boolean;
  allowedMarketsText: string;
  excludedMarketsText: string;
  bankrollEnabled: boolean;
  stakingMethod: StakingMethod;
  initialStake: number;
  targetBankroll: number;
  resetOnGoal: boolean;
  lossRule: string;
  maxCycleSteps: number;
  maxStakePercentPerTicket: number;
  dailyLossLimitPercent: number;
  weeklyLossLimitPercent: number;
}

interface ScoredMarketOption {
  id: string;
  label: string;
  count: number;
  averageConfidence: number;
  withOddsCount: number;
  examples: string[];
}

const MARKET_LABELS_FR: Record<string, string> = {
  match_winner: 'Résultat du match',
  home_away: 'Domicile ou extérieur, sans nul',
  double_chance: 'Double chance',
  draw_no_bet: 'Remboursé si nul',
  both_teams_to_score: 'Les deux équipes marquent',
  goals_over_under: 'Total de buts',
  goals_over_under_first_half: 'Total de buts en 1re mi-temps',
  goals_over_under_second_half: 'Total de buts en 2e mi-temps',
  first_half_winner: 'Résultat 1re mi-temps',
  second_half_winner: 'Résultat 2e mi-temps',
  double_chance_first_half: 'Double chance 1re mi-temps',
  double_chance_second_half: 'Double chance 2e mi-temps',
  both_teams_score_first_half: 'Les deux équipes marquent en 1re mi-temps',
  both_teams_score_second_half: 'Les deux équipes marquent en 2e mi-temps',
  asian_handicap: 'Handicap asiatique',
  asian_handicap_first_half: 'Handicap asiatique 1re mi-temps',
  handicap_result: 'Résultat avec handicap',
  total_home: 'Total de buts équipe domicile',
  total_away: 'Total de buts équipe extérieur',
  team_to_score_first: 'Première équipe à marquer',
  team_to_score_last: 'Dernière équipe à marquer',
  clean_sheet_home: 'Domicile sans encaisser',
  clean_sheet_away: 'Extérieur sans encaisser',
  win_to_nil: 'Gagner sans encaisser',
  win_to_nil_home: 'Domicile gagne sans encaisser',
  win_to_nil_away: 'Extérieur gagne sans encaisser',
  exact_score: 'Score exact',
  correct_score_first_half: 'Score exact 1re mi-temps',
  exact_goals_number: 'Nombre exact de buts',
  odd_even: 'Total de buts pair / impair',
  odd_even_first_half: 'Pair / impair 1re mi-temps',
  ht_ft_double: 'Mi-temps / fin de match',
  result_total_goals: 'Résultat + total de buts',
  result_both_teams_score: 'Résultat + les deux équipes marquent',
  unknown_market: 'Marché inconnu'
};

@Component({
  selector: 'ba-strategy-page',
  standalone: true,
  imports: [
    EmptyStateComponent,
    ErrorStateComponent,
    LoadingStateComponent,
    PageHeaderComponent,
    RouterLink,
    SectionCardComponent,
    StatusBadgeComponent
  ],
  template: `
    <ba-page-header
      eyebrow="Admin stratégie"
      title="Stratégie & couverture"
      subtitle="Configure une stratégie avec des champs bornés, puis applique-la à une analyse déjà sauvegardée."
    >
      <div class="flex flex-wrap gap-2">
        <button type="button" class="ba-tool" (click)="reload()" [disabled]="strategyLoading || coverageLoading">
          {{ strategyLoading || coverageLoading ? 'Actualisation...' : 'Actualiser' }}
        </button>
      </div>
    </ba-page-header>

    <div class="grid min-w-0 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(18rem,0.72fr)]">
      <ba-section-card class="block">
        <div class="ba-card-header flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div class="min-w-0">
            <p class="ba-label">Formulaire stratégie</p>
            <h3 class="mt-1 truncate text-sm font-semibold text-text">{{ selectedStrategy?.name || 'Aucune stratégie chargée' }}</h3>
            <p class="mt-1 truncate text-xs text-muted">{{ selectedStrategyFile || 'config/strategies/default.json' }}</p>
          </div>
          <div class="flex flex-wrap gap-2">
            <ba-status-badge [label]="selectedStrategy?.active ? 'active' : 'brouillon'" [tone]="selectedStrategy?.active ? 'success' : 'default'"></ba-status-badge>
            <ba-status-badge [label]="selectedStrategy?.valid ? 'valide' : 'invalide'" [tone]="selectedStrategy?.valid ? 'success' : 'danger'"></ba-status-badge>
          </div>
        </div>

        <div class="border-t border-border/60 p-4">
          @if (strategyLoading) {
            <ba-loading-state message="Chargement des stratégies..." [showShimmer]="true"></ba-loading-state>
          } @else if (strategyError) {
            <ba-error-state label="Erreur API stratégie" [message]="strategyError"></ba-error-state>
          } @else {
            <div class="grid gap-4 lg:grid-cols-2">
              <label class="block lg:col-span-2">
                <span class="ba-label">Profil de stratégie</span>
                <select
                  class="ba-tool mt-2 w-full bg-background"
                  [value]="selectedStrategyFile"
                  (change)="selectStrategy(($any($event.target).value || '').toString())"
                >
                  @for (strategy of strategies; track strategy.strategy_file) {
                    <option [value]="strategy.strategy_file">
                      {{ strategy.active ? '● ' : '' }}{{ strategy.name || strategy.strategy_id || strategy.strategy_file }}
                    </option>
                  }
                </select>
              </label>

              <label class="block">
                <span class="ba-label">Nom</span>
                <input class="ba-tool mt-2 w-full" type="text" [value]="form.name" (input)="form.name = textValue($event)" />
              </label>

              <label class="block">
                <span class="ba-label">Activation</span>
                <button
                  type="button"
                  class="ba-tool mt-2 w-full justify-center"
                  [class.border-success]="form.enabled"
                  [class.text-success]="form.enabled"
                  (click)="form.enabled = !form.enabled"
                >
                  {{ form.enabled ? 'Activée' : 'Désactivée' }}
                </button>
              </label>

              <label class="block lg:col-span-2">
                <span class="ba-label">Description</span>
                <textarea
                  class="mt-2 min-h-20 w-full rounded-card border border-border/70 bg-background p-3 text-sm text-text outline-none focus:border-accent"
                  [value]="form.description"
                  (input)="form.description = textValue($event)"
                ></textarea>
              </label>

              <div class="rounded-card border border-border/60 bg-background/50 p-3 lg:col-span-2">
                <div class="grid gap-3 md:grid-cols-3">
                  <label class="block">
                    <span class="ba-label">Type de ticket</span>
                    <select class="ba-tool mt-2 w-full bg-background" [value]="form.preferredTicketType" (change)="form.preferredTicketType = ticketTypeValue($event)">
                      <option value="single">Simple</option>
                      <option value="combo">Combiné</option>
                      <option value="mixed">Mixte</option>
                    </select>
                  </label>
                  <label class="block">
                    <span class="ba-label">Sélections min</span>
                    <input class="ba-tool mt-2 w-full" type="number" min="1" [value]="form.minPicks" (input)="form.minPicks = numberValue($event)" />
                  </label>
                  <label class="block">
                    <span class="ba-label">Sélections max</span>
                    <input class="ba-tool mt-2 w-full" type="number" min="1" [value]="form.maxPicks" (input)="form.maxPicks = numberValue($event)" />
                  </label>
                </div>
                <div class="mt-3 flex flex-wrap gap-2">
                  <button type="button" class="ba-tool" [class.border-success]="form.allowSingle" [class.text-success]="form.allowSingle" (click)="form.allowSingle = !form.allowSingle">
                    {{ form.allowSingle ? 'Tickets simples autorisés' : 'Tickets simples bloqués' }}
                  </button>
                  <button type="button" class="ba-tool" [class.border-success]="form.allowCombo" [class.text-success]="form.allowCombo" (click)="form.allowCombo = !form.allowCombo">
                    {{ form.allowCombo ? 'Combinés autorisés' : 'Combinés bloqués' }}
                  </button>
                  <button type="button" class="ba-tool" [class.border-success]="form.targetOddsEnabled" [class.text-success]="form.targetOddsEnabled" (click)="form.targetOddsEnabled = !form.targetOddsEnabled">
                    {{ form.targetOddsEnabled ? 'Cible de cote active' : 'Cible de cote inactive' }}
                  </button>
                </div>
                @if (form.targetOddsEnabled) {
                  <div class="mt-3 grid gap-3 md:grid-cols-2">
                    <label class="block">
                      <span class="ba-label">Cote totale min</span>
                      <input class="ba-tool mt-2 w-full" type="number" min="1.01" step="0.01" [value]="form.targetOddsMin" (input)="form.targetOddsMin = numberValue($event)" />
                    </label>
                    <label class="block">
                      <span class="ba-label">Cote totale max</span>
                      <input class="ba-tool mt-2 w-full" type="number" min="1.01" step="0.01" [value]="form.targetOddsMax" (input)="form.targetOddsMax = numberValue($event)" />
                    </label>
                  </div>
                }
              </div>

              <div class="rounded-card border border-border/60 bg-background/50 p-3 lg:col-span-2">
                <div class="grid gap-3 md:grid-cols-3">
                  <label class="block">
                    <span class="ba-label">Confiance match</span>
                    <input class="ba-tool mt-2 w-full" type="number" min="0" max="100" [value]="form.minMatchConfidence" (input)="form.minMatchConfidence = numberValue($event)" />
                  </label>
                  <label class="block">
                    <span class="ba-label">Confiance pari</span>
                    <input class="ba-tool mt-2 w-full" type="number" min="0" max="100" [value]="form.minPickConfidence" (input)="form.minPickConfidence = numberValue($event)" />
                  </label>
                  <label class="block">
                    <span class="ba-label">Confiance ticket</span>
                    <input class="ba-tool mt-2 w-full" type="number" min="0" max="100" [value]="form.minComboConfidence" (input)="form.minComboConfidence = numberValue($event)" />
                  </label>
                </div>
                <div class="mt-3 grid gap-3 md:grid-cols-4">
                  <label class="block">
                    <span class="ba-label">Tolérance au risque</span>
                    <select class="ba-tool mt-2 w-full bg-background" [value]="form.riskAppetite" (change)="form.riskAppetite = riskValue($event)">
                      <option value="low">Faible</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Élevée</option>
                    </select>
                  </label>
                  <label class="block">
                    <span class="ba-label">Risque max par pari</span>
                    <select class="ba-tool mt-2 w-full bg-background" [value]="form.maxPickRisk" (change)="form.maxPickRisk = riskValue($event)">
                      <option value="low">Faible</option>
                      <option value="medium">Moyen</option>
                      <option value="high">Élevé</option>
                    </select>
                  </label>
                  <label class="block">
                    <span class="ba-label">Risque max du ticket</span>
                    <select class="ba-tool mt-2 w-full bg-background" [value]="form.maxComboRisk" (change)="form.maxComboRisk = riskValue($event)">
                      <option value="low">Faible</option>
                      <option value="medium">Moyen</option>
                      <option value="high">Élevé</option>
                    </select>
                  </label>
                  <label class="block">
                    <span class="ba-label">Qualité data min</span>
                    <select class="ba-tool mt-2 w-full bg-background" [value]="form.minDataQuality" (change)="form.minDataQuality = dataQualityValue($event)">
                      <option value="low">Faible</option>
                      <option value="medium">Moyenne</option>
                      <option value="high">Haute</option>
                    </select>
                  </label>
                </div>
                <button type="button" class="ba-tool mt-3" [class.border-success]="form.requireOddsAvailable" [class.text-success]="form.requireOddsAvailable" (click)="form.requireOddsAvailable = !form.requireOddsAvailable">
                  {{ form.requireOddsAvailable ? 'Cote obligatoire' : 'Cote optionnelle' }}
                </button>
              </div>

              <div class="rounded-card border border-border/60 bg-background/50 p-3 lg:col-span-2">
                <div class="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div class="min-w-0">
                    <p class="ba-label">Marchés notés dans l’analyse sélectionnée</p>
                    <p class="mt-1 text-sm text-muted">{{ scoredMarketsSummary }}</p>
                  </div>
                  @if (selectedRunId) {
                    <ba-status-badge [label]="selectedRunId" tone="default"></ba-status-badge>
                  }
                </div>

                @if (scoredMarketsLoading) {
                  <div class="mt-3">
                    <ba-loading-state message="Lecture des marchés notés..."></ba-loading-state>
                  </div>
                } @else if (scoredMarketsError) {
                  <p class="mt-3 text-sm text-danger">{{ scoredMarketsError }}</p>
                } @else if (!scoredMarketOptions.length) {
                  <p class="mt-3 rounded-card border border-warning/40 bg-warning/10 p-3 text-sm text-warning">
                    Aucun marché noté trouvé dans l’analyse sélectionnée.
                  </p>
                } @else {
                  <div class="mt-3 grid max-h-[22rem] gap-2 overflow-y-auto pr-1 xl:grid-cols-2">
                    @for (market of scoredMarketOptions; track market.id) {
                      <label
                        class="flex cursor-pointer items-start gap-3 rounded-card border p-3 transition"
                        [class.border-success/50]="isAllowedMarket(market.id)"
                        [class.bg-success/10]="isAllowedMarket(market.id)"
                        [class.border-border/60]="!isAllowedMarket(market.id)"
                        [class.bg-surface-low]="!isAllowedMarket(market.id)"
                      >
                        <input
                          class="mt-1 accent-current"
                          type="checkbox"
                          [checked]="isAllowedMarket(market.id)"
                          (change)="toggleAllowedMarket(market.id, $any($event.target).checked)"
                        />
                        <span class="min-w-0">
                          <span class="block truncate text-sm font-semibold text-text" [title]="market.label">{{ market.label }}</span>
                          <span class="mt-1 block text-xs text-muted">
                            {{ market.count }} candidat(s) noté(s) · moyenne {{ market.averageConfidence }} · {{ market.withOddsCount }} avec cote
                          </span>
                          @if (market.examples.length) {
                            <span class="mt-1 block truncate text-xs text-muted">{{ market.examples.join(' · ') }}</span>
                          }
                          <span class="mt-1 block truncate font-mono text-[11px] text-muted" [title]="market.id">{{ market.id }}</span>
                        </span>
                      </label>
                    }
                  </div>
                }

                @if (configuredMarketsOutsideRun.length) {
                  <div class="mt-3 rounded-card border border-warning/40 bg-warning/10 p-3 text-xs text-warning">
                    <p class="font-medium">Configurés mais non notés dans cette analyse :</p>
                    <p class="mt-1">{{ configuredMarketsOutsideRun.join(', ') }}</p>
                  </div>
                }

                <details class="mt-3 rounded-card border border-border/60 bg-background/60 p-3">
                  <summary class="cursor-pointer text-xs font-medium uppercase tracking-wide text-muted">
                    Marchés exclus avancés
                  </summary>
                  <textarea
                    class="mt-3 min-h-20 w-full rounded-card border border-border/70 bg-background p-3 font-mono text-xs text-text outline-none focus:border-accent"
                    [value]="form.excludedMarketsText"
                    (input)="form.excludedMarketsText = textValue($event)"
                  ></textarea>
                </details>
              </div>

              <div class="rounded-card border border-border/60 bg-background/50 p-3 lg:col-span-2">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <div class="min-w-0">
                    <p class="ba-label">Gestion de bankroll</p>
                    <p class="mt-1 truncate text-sm text-muted">{{ form.bankrollEnabled ? form.stakingMethod : 'Désactivée' }}</p>
                  </div>
                  <button type="button" class="ba-tool" [class.border-success]="form.bankrollEnabled" [class.text-success]="form.bankrollEnabled" (click)="form.bankrollEnabled = !form.bankrollEnabled">
                    {{ form.bankrollEnabled ? 'Activée' : 'Désactivée' }}
                  </button>
                </div>
                @if (form.bankrollEnabled) {
                  <div class="mt-3 grid gap-3 md:grid-cols-4">
                    <label class="block">
                      <span class="ba-label">Staking</span>
                      <select class="ba-tool mt-2 w-full bg-background" [value]="form.stakingMethod" (change)="form.stakingMethod = stakingValue($event)">
                        <option value="manual">Manual</option>
                        <option value="flat">Flat</option>
                        <option value="percentage">Percentage</option>
                        <option value="kelly_fractional">Kelly fractional</option>
                        <option value="cycle_rollover">Cycle rollover</option>
                      </select>
                    </label>
                    <label class="block">
                      <span class="ba-label">Initial stake</span>
                      <input class="ba-tool mt-2 w-full" type="number" min="0" step="0.01" [value]="form.initialStake" (input)="form.initialStake = numberValue($event)" />
                    </label>
                    <label class="block">
                      <span class="ba-label">Target bankroll</span>
                      <input class="ba-tool mt-2 w-full" type="number" min="0" step="0.01" [value]="form.targetBankroll" (input)="form.targetBankroll = numberValue($event)" />
                    </label>
                    <label class="block">
                      <span class="ba-label">Max steps</span>
                      <input class="ba-tool mt-2 w-full" type="number" min="1" [value]="form.maxCycleSteps" (input)="form.maxCycleSteps = numberValue($event)" />
                    </label>
                  </div>
                  <div class="mt-3 grid gap-3 md:grid-cols-4">
                    <label class="block">
                      <span class="ba-label">Plafond de mise %</span>
                      <input class="ba-tool mt-2 w-full" type="number" min="0" max="100" [value]="form.maxStakePercentPerTicket" (input)="form.maxStakePercentPerTicket = numberValue($event)" />
                    </label>
                    <label class="block">
                      <span class="ba-label">Daily loss %</span>
                      <input class="ba-tool mt-2 w-full" type="number" min="0" max="100" [value]="form.dailyLossLimitPercent" (input)="form.dailyLossLimitPercent = numberValue($event)" />
                    </label>
                    <label class="block">
                      <span class="ba-label">Weekly loss %</span>
                      <input class="ba-tool mt-2 w-full" type="number" min="0" max="100" [value]="form.weeklyLossLimitPercent" (input)="form.weeklyLossLimitPercent = numberValue($event)" />
                    </label>
                    <label class="block">
                      <span class="ba-label">Loss rule</span>
                      <input class="ba-tool mt-2 w-full" type="text" [value]="form.lossRule" (input)="form.lossRule = textValue($event)" />
                    </label>
                  </div>
                  <button type="button" class="ba-tool mt-3" [class.border-success]="form.resetOnGoal" [class.text-success]="form.resetOnGoal" (click)="form.resetOnGoal = !form.resetOnGoal">
                    {{ form.resetOnGoal ? 'Reset à l’objectif' : 'Pas de reset automatique' }}
                  </button>
                }
              </div>
            </div>

            @if (formErrors.length) {
              <div class="mt-4 rounded-card border border-danger/40 bg-danger/10 p-3 text-sm text-danger">
                @for (errorItem of formErrors; track errorItem) {
                  <p>{{ errorItem }}</p>
                }
              </div>
            }
            @if (strategyMessage) {
              <p class="mt-3 text-sm" [class]="strategyMessageClass">{{ strategyMessage }}</p>
            }

            <div class="mt-4 flex flex-wrap gap-2">
              <button type="button" class="ba-tool" (click)="activateSelected()" [disabled]="!canActivate">
                {{ activating ? 'Activation...' : 'Définir active' }}
              </button>
              <button type="button" class="ba-tool border-accent/60 bg-accent text-background hover:bg-accent-strong" (click)="saveStrategy(false)" [disabled]="!canSave">
                {{ saving ? 'Sauvegarde...' : 'Sauvegarder' }}
              </button>
              <button type="button" class="ba-tool" (click)="saveStrategy(true)" [disabled]="!canSave">
                Sauvegarder & activer
              </button>
            </div>
          }
        </div>
      </ba-section-card>

      <div class="min-w-0 space-y-4">
        <ba-section-card class="block">
          <div class="ba-card-header">
            <p class="ba-label">Utiliser la stratégie</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Appliquer à une analyse sauvegardée</h3>
            <p class="mt-1 text-xs text-muted">Relance seulement le filtrage et la sélection sur les artefacts existants.</p>
          </div>
          <div class="border-t border-border/60 p-4">
            @if (runsLoading) {
              <ba-loading-state message="Chargement des analyses sauvegardées..."></ba-loading-state>
            } @else if (!analysisRuns.length) {
              <ba-empty-state label="Aucune analyse sauvegardée" message="Lance d’abord une analyse, puis applique une stratégie ici."></ba-empty-state>
            } @else {
              <label class="block">
                <span class="ba-label">Analyse sauvegardée</span>
                <select class="ba-tool mt-2 w-full bg-background" [value]="selectedRunId" (change)="selectAnalysisRun(textValue($event))">
                  @for (run of analysisRuns; track run.run_id) {
                    <option [value]="runArtifactId(run)">{{ runOptionLabel(run) }}</option>
                  }
                </select>
              </label>
              <label class="mt-3 block">
                <span class="ba-label">Mode d’application</span>
                <select class="ba-tool mt-2 w-full bg-background" [value]="selectionMode" (change)="selectionMode = selectionModeValue($event)">
                  <option value="filter_and_select">Filtrer puis générer un ticket</option>
                  <option value="filter_only">Filtrer uniquement</option>
                </select>
              </label>
              <button
                type="button"
                class="ba-tool mt-4 w-full justify-center border-accent/60 bg-accent text-background hover:bg-accent-strong"
                [disabled]="!canApplyStrategy"
                (click)="applyStrategyToRun()"
              >
                {{ applyingStrategy ? 'Application...' : 'Appliquer la stratégie à cette analyse' }}
              </button>
            }

            @if (applyingStrategy) {
              <div class="mt-4 rounded-card border border-accent/50 bg-accent/10 p-3">
                <div class="flex items-center gap-3">
                  <span class="h-2.5 w-2.5 animate-pulse rounded-full bg-accent"></span>
                  <div>
                    <p class="text-sm font-semibold text-text">Application de la stratégie en cours</p>
                    <p class="mt-1 text-xs text-muted">{{ applyingStatusLabel }}</p>
                  </div>
                </div>
              </div>
            }
            @if (applicationError) {
              <p class="mt-3 text-sm text-danger">{{ applicationError }}</p>
            }
            @if (applicationResult) {
              <div
                class="mt-4 rounded-card border p-3"
                [class]="applicationPanelClass"
              >
                <div class="flex flex-wrap items-center justify-between gap-2">
                  <div class="min-w-0">
                    <p
                      class="ba-label"
                      [class.text-success]="applicationTone === 'success'"
                      [class.text-warning]="applicationTone === 'warning'"
                      [class.text-danger]="applicationTone === 'danger'"
                    >
                      Application sauvegardée
                    </p>
                    <p class="mt-1 truncate text-sm font-semibold text-text" [title]="applicationResult.application_id">{{ shortId(applicationResult.application_id) }}</p>
                  </div>
                  <div class="flex flex-wrap items-center gap-2">
                    @if (applicationResult.picks_count > 0) {
                      <a
                        class="ba-tool border-accent/50 bg-background/70 text-accent hover:bg-accent/10"
                        routerLink="/tickets"
                        [queryParams]="{ ticket_id: applicationTicketId }"
                      >
                        Voir le ticket
                      </a>
                    }
                    <ba-status-badge [label]="applicationResult.selection_status || applicationResult.status" [tone]="applicationTone"></ba-status-badge>
                  </div>
                </div>
                <div class="mt-3 grid gap-2 sm:grid-cols-2">
                  <p class="text-sm text-muted">Agrégés : <span class="text-text">{{ applicationResult.aggregation_candidate_count }}</span></p>
                  <p class="text-sm text-muted">Retenus : <span class="text-text">{{ applicationResult.filtered_candidate_count }}</span></p>
                  <p class="text-sm text-muted">Rejetés : <span class="text-text">{{ applicationResult.rejected_candidate_count }}</span></p>
                  <p class="text-sm text-muted">Picks : <span class="text-text">{{ applicationResult.picks_count }}</span></p>
                  <p class="text-sm text-muted">Variants : <span class="text-text">{{ applicationResult.variants_count || 0 }}</span></p>
                  <p class="truncate text-sm text-muted">Meilleure variante : <span class="text-text">{{ applicationResult.selected_variant_id || '—' }}</span></p>
                </div>
                @if (applicationResult.selection_reason) {
                  <div class="mt-3 rounded-card border border-accent/30 bg-accent/10 p-2 text-xs leading-5 text-text">
                    {{ applicationResult.selection_reason }}
                  </div>
                }
                @if (applicationResult.errors.length) {
                  <div class="mt-3 rounded-card border border-danger/40 bg-danger/10 p-2 text-xs text-danger">
                    @for (error of applicationResult.errors; track error) {
                      <p>{{ error }}</p>
                    }
                  </div>
                }
                @if (applicationResult.notes.length) {
                  <div class="mt-3 rounded-card border border-border/60 bg-background/60 p-2 text-xs text-muted">
                    @for (note of applicationResult.notes; track note) {
                      <p>{{ note }}</p>
                    }
                  </div>
                }
                <details class="mt-3 rounded-card border border-border/60 bg-background/60 p-2 text-xs text-muted">
                  <summary class="cursor-pointer select-none text-text">Détails techniques</summary>
                  <p class="mt-2 truncate">{{ applicationResult.application_dir }}</p>
                  <p class="ba-label mt-3">Fichiers générés</p>
                  @for (file of applicationFiles; track file.label) {
                    <p class="mt-1 truncate">{{ file.label }} · {{ file.path }}</p>
                  }
                </details>
              </div>
            }
          </div>
        </ba-section-card>

        <ba-section-card class="block">
          <div class="ba-card-header">
            <p class="ba-label">Stratégie active</p>
            <h3 class="mt-1 text-sm font-semibold text-text">{{ activeStrategy?.name || 'Aucune stratégie active' }}</h3>
            <p class="mt-1 truncate text-xs text-muted">{{ strategyCatalog?.active_strategy_file || '—' }}</p>
          </div>
          <div class="border-t border-border/60 p-4">
            <div class="grid gap-3 sm:grid-cols-2">
              <div class="rounded-card border border-border/60 bg-background/60 p-3">
                <p class="ba-label">Ticket</p>
                <p class="ba-data mt-2 text-text">{{ resolvedValue('preferred_ticket_type') }}</p>
              </div>
              <div class="rounded-card border border-border/60 bg-background/60 p-3">
                <p class="ba-label">Cible de cote</p>
                <p class="ba-data mt-2 text-text">{{ oddsTargetLabel }}</p>
              </div>
              <div class="rounded-card border border-border/60 bg-background/60 p-3">
                <p class="ba-label">Mise</p>
                <p class="ba-data mt-2 text-text">{{ bankrollLabel }}</p>
              </div>
              <div class="rounded-card border border-border/60 bg-background/60 p-3">
                <p class="ba-label">Fichier d’état</p>
                <p class="mt-2 truncate text-xs text-muted">{{ strategyCatalog?.state_file || '—' }}</p>
              </div>
            </div>
          </div>
        </ba-section-card>
      </div>
    </div>

    <div class="mt-4">
      @if (coverageLoading) {
        <ba-section-card>
          <div class="p-4">
            <ba-loading-state message="Chargement de la couverture des compétitions..."></ba-loading-state>
          </div>
        </ba-section-card>
      } @else if (coverageError) {
        <ba-error-state label="Erreur API couverture" [message]="coverageError"></ba-error-state>
      } @else if (!registry || !registry.leagues.length) {
        <ba-empty-state label="Aucun registre de compétitions" message="Aucune couverture football n’est disponible."></ba-empty-state>
      } @else {
        <ba-section-card class="block">
          <div class="ba-card-header">
            <p class="ba-label">Compétitions</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Liste des ligues suivies</h3>
          </div>
          <div class="border-b border-border/60 p-4">
            <label class="block">
              <span class="ba-label">Rechercher une ligue</span>
              <input class="ba-tool mt-2 w-full" type="text" [value]="searchTerm" (input)="onSearch(textValue($event))" placeholder="Ligue ou pays..." />
            </label>
          </div>

          <div class="min-h-10 border-b border-border/60 px-4 py-3 text-sm">
            @if (coverageSaveMessage) {
              <p [class]="coverageSaveMessageClass">{{ coverageSaveMessage }}</p>
            }
          </div>

          <div class="max-h-[34rem] divide-y divide-border/60 overflow-y-auto">
            @for (league of filteredLeagues; track trackLeague(league)) {
              <article class="grid gap-3 p-3 md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
                <div class="min-w-0">
                  <h4 class="truncate text-sm font-semibold text-text" [title]="league.competition_name">{{ league.competition_name }}</h4>
                  <p class="mt-1 truncate text-sm text-muted">
                    {{ league.country }} @if (league.league_id == null) {
                      <span class="text-warning">· ID API-Football non verifie</span>
                    }
                  </p>
                </div>
                <button
                  type="button"
                  class="inline-flex w-full items-center justify-center gap-2 rounded-card border px-3 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60 md:w-auto md:min-w-[8rem]"
                  [class]="league.enabled
                    ? 'border-success/40 bg-success/10 text-success hover:border-success/60 hover:bg-success/15'
                    : 'border-danger/40 bg-danger/10 text-danger hover:border-danger/60 hover:bg-danger/15'"
                  (click)="setEnabled(league, !league.enabled)"
                  [disabled]="league.league_id == null || isPending(league)"
                  [title]="statusActionTitle(league)"
                  [attr.aria-pressed]="league.enabled"
                >
                  <span class="inline-block h-2.5 w-2.5 rounded-full border border-current" [class]="isPending(league) ? 'animate-pulse opacity-70' : ''" [attr.aria-hidden]="true"></span>
                  <span aria-hidden="true">{{ league.enabled ? '✓' : '✕' }}</span>
                  <span>{{ league.enabled ? 'Active' : 'Inactive' }}</span>
                </button>
              </article>
            }
          </div>
        </ba-section-card>
      }
    </div>
  `
})
export class StrategyPage implements OnInit {
  private readonly analysisApi = inject(AnalysisApiService);
  private readonly coverageApi = inject(CoverageApiService);
  private readonly strategyApi = inject(StrategyApiService);

  protected strategyLoading = true;
  protected coverageLoading = true;
  protected runsLoading = true;
  protected strategyError = '';
  protected coverageError = '';
  protected strategyCatalog: StrategyCatalogResponse | null = null;
  protected activeStrategy: StrategyDetailResponse | null = null;
  protected selectedStrategy: StrategyDetailResponse | null = null;
  protected selectedStrategyFile = '';
  protected form: StrategyForm = this.emptyForm();
  protected strategyMessage = '';
  protected strategyMessageTone: 'success' | 'danger' = 'success';
  protected saving = false;
  protected activating = false;

  protected analysisRuns: AnalysisRunListItem[] = [];
  protected selectedRunId = '';
  protected selectionMode: 'filter_only' | 'filter_and_select' = 'filter_and_select';
  protected applyingStrategy = false;
  protected applicationResult: StrategyApplyResponse | null = null;
  protected applicationError = '';
  protected scoredMarketsLoading = false;
  protected scoredMarketsError = '';
  protected scoredMarketOptions: ScoredMarketOption[] = [];

  protected registry: FootballLeagueRegistryResponse | null = null;
  protected searchTerm = '';
  protected coverageSaveMessage = '';
  protected coverageSaveMessageTone: 'success' | 'danger' = 'success';
  protected pendingLeagueIds = new Set<number>();

  ngOnInit(): void {
    this.reload();
  }

  protected get strategies(): StrategyCatalogItem[] {
    return this.strategyCatalog?.strategies ?? [];
  }

  protected get canActivate(): boolean {
    return Boolean(this.selectedStrategyFile && this.selectedStrategy?.valid && !this.selectedStrategy.active && !this.activating);
  }

  protected get canSave(): boolean {
    return Boolean(this.selectedStrategyFile && !this.saving && !this.formErrors.length);
  }

  protected get canApplyStrategy(): boolean {
    return Boolean(this.selectedRunId && this.selectedStrategyFile && !this.applyingStrategy);
  }

  protected get applicationTicketId(): string {
    if (!this.applicationResult?.application_id || !this.applicationResult?.run_id) {
      return '';
    }
    return `ticket_${this.applicationResult.run_id}__app_${this.applicationResult.application_id}`;
  }

  protected get strategyMessageClass(): string {
    return this.strategyMessageTone === 'success' ? 'text-success' : 'text-danger';
  }

  protected get coverageSaveMessageClass(): string {
    return this.coverageSaveMessageTone === 'success' ? 'text-success' : 'text-danger';
  }

  protected get oddsTargetLabel(): string {
    return this.form.targetOddsEnabled ? `${this.form.targetOddsMin} - ${this.form.targetOddsMax}` : 'Aucune cible';
  }

  protected get bankrollLabel(): string {
    return this.form.bankrollEnabled ? `${this.form.stakingMethod} · ${this.form.initialStake || 0} EUR` : 'Désactivée';
  }

  protected get scoredMarketsSummary(): string {
    if (!this.selectedRunId) {
      return 'Sélectionne une analyse sauvegardée pour voir uniquement les marchés que le moteur a réellement notés.';
    }
    if (this.scoredMarketsLoading) {
      return 'Chargement des marchés notés...';
    }
    const candidatesCount = this.scoredMarketOptions.reduce((sum, market) => sum + market.count, 0);
    const withOddsCount = this.scoredMarketOptions.reduce((sum, market) => sum + market.withOddsCount, 0);
    return `${this.scoredMarketOptions.length} marché(s) noté(s) · ${candidatesCount} candidat(s) · ${withOddsCount} avec cote`;
  }

  protected get configuredMarketsOutsideRun(): string[] {
    const scored = new Set(this.scoredMarketOptions.map((market) => market.id));
    return this.marketList(this.form.allowedMarketsText)
      .map((market) => this.normalizeMarketId(market))
      .filter((market, index, list) => market && !scored.has(market) && list.indexOf(market) === index)
      .map((market) => `${this.marketLabel(market)} (${market})`);
  }

  protected get applyingStatusLabel(): string {
    if (this.selectionMode === 'filter_only') {
      return 'Filtrage des candidats existants et écriture des artefacts de stratégie...';
    }
    return 'Filtrage des candidats existants, puis demande de proposition de ticket au moteur de sélection...';
  }

  protected get applicationHasErrors(): boolean {
    const result = this.applicationResult;
    if (!result) {
      return false;
    }
    const statusText = `${result.status || ''} ${result.selection_status || ''}`.toLowerCase();
    return Boolean(result.errors.length || statusText.includes('error') || statusText.includes('failed'));
  }

  protected get applicationTone(): 'success' | 'warning' | 'danger' {
    if (this.applicationHasErrors) {
      return 'danger';
    }
    const statusText = `${this.applicationResult?.status || ''} ${this.applicationResult?.selection_status || ''}`.toLowerCase();
    return statusText.includes('skipped') || statusText.includes('filter_only') ? 'warning' : 'success';
  }

  protected get applicationPanelClass(): string {
    if (this.applicationTone === 'danger') {
      return 'border-danger/40 bg-danger/10';
    }
    if (this.applicationTone === 'warning') {
      return 'border-warning/40 bg-warning/10';
    }
    return 'border-success/40 bg-success/10';
  }

  protected get applicationFiles(): Array<{ label: string; path: string }> {
    const files = this.applicationResult?.files || {};
    const order = [
      'application_summary',
      'strategy_applications_index',
      'selection',
      'filtered_candidates',
      'aggregation_candidates',
      'resolved_strategy'
    ];
    const known = order
      .filter((label) => files[label])
      .map((label) => ({ label, path: files[label] }));
    const extras = Object.entries(files)
      .filter(([label]) => !order.includes(label))
      .map(([label, path]) => ({ label, path }));
    return [...known, ...extras];
  }

  protected get formErrors(): string[] {
    const errors: string[] = [];
    if (!this.form.name.trim()) {
      errors.push('Le nom est obligatoire.');
    }
    if (!this.form.allowSingle && !this.form.allowCombo) {
      errors.push('Au moins un type de ticket doit être autorisé.');
    }
    if (this.form.maxPicks < this.form.minPicks) {
      errors.push('Le nombre max de sélections doit être supérieur ou égal au minimum.');
    }
    if (!this.form.allowSingle && this.form.allowCombo && this.form.minPicks < 2) {
      errors.push('Une stratégie combiné uniquement doit demander au moins 2 sélections.');
    }
    if (this.form.targetOddsEnabled && this.form.targetOddsMax <= this.form.targetOddsMin) {
      errors.push('La cote totale max doit être supérieure à la cote totale min.');
    }
    for (const [label, value] of [
      ['Confiance match', this.form.minMatchConfidence],
      ['Confiance pari', this.form.minPickConfidence],
      ['Confiance ticket', this.form.minComboConfidence],
      ['Plafond de mise en %', this.form.maxStakePercentPerTicket],
      ['Limite de perte quotidienne', this.form.dailyLossLimitPercent],
      ['Limite de perte hebdomadaire', this.form.weeklyLossLimitPercent]
    ] as Array<[string, number]>) {
      if (value < 0 || value > 100) {
        errors.push(`${label} doit être entre 0 et 100.`);
      }
    }
    if (!this.marketList(this.form.allowedMarketsText).length) {
      errors.push('Au moins un marché autorisé est obligatoire.');
    }
    return errors;
  }

  protected get filteredLeagues(): FootballLeagueRegistryEntry[] {
    const leagues = this.registry?.leagues ?? [];
    const search = this.searchTerm.trim().toLowerCase();
    return leagues.filter((league) => {
      if (!search) {
        return true;
      }
      const haystack = [league.competition_name, league.country, league.league_id?.toString() ?? ''].join(' ').toLowerCase();
      return haystack.includes(search);
    });
  }

  protected reload(): void {
    this.reloadStrategy();
    this.reloadCoverage();
    this.reloadRuns();
  }

  protected selectStrategy(strategyFile: string): void {
    if (!strategyFile || strategyFile === this.selectedStrategyFile) {
      return;
    }
    this.selectedStrategyFile = strategyFile;
    this.strategyMessage = '';
    this.applicationResult = null;
    this.strategyLoading = true;
    this.strategyApi.getDetail(strategyFile).subscribe({
      next: (response) => {
        this.setSelectedStrategy(response);
        this.strategyLoading = false;
      },
      error: (err) => {
        this.strategyError = this.errorToMessage(err, 'Impossible de charger le détail de la stratégie.');
        this.strategyLoading = false;
      }
    });
  }

  protected activateSelected(): void {
    if (!this.canActivate) {
      return;
    }
    this.activating = true;
    this.strategyMessage = '';
    this.strategyApi.activate({ strategy_file: this.selectedStrategyFile }).subscribe({
      next: (response) => {
        this.activeStrategy = response.active_strategy;
        this.setSelectedStrategy(response.active_strategy);
        this.markActive(response.active_strategy_file);
        this.strategyMessageTone = 'success';
        this.strategyMessage = 'Stratégie active sauvegardée.';
        this.activating = false;
      },
      error: (err) => {
        this.strategyMessageTone = 'danger';
        this.strategyMessage = this.errorToMessage(err, 'Impossible d’activer la stratégie.');
        this.activating = false;
      }
    });
  }

  protected saveStrategy(activate: boolean): void {
    if (!this.canSave || !this.selectedStrategy) {
      return;
    }
    const payload = this.payloadFromForm();
    this.saving = true;
    this.strategyMessage = '';
    this.strategyApi.save({ strategy_file: this.selectedStrategyFile, payload, activate }).subscribe({
      next: (response) => {
        this.setSelectedStrategy(response.strategy);
        if (activate) {
          this.activeStrategy = response.strategy;
          this.markActive(response.active_strategy_file);
        }
        this.strategyMessageTone = 'success';
        this.strategyMessage = activate ? 'Stratégie sauvegardée et active.' : 'Stratégie sauvegardée.';
        this.saving = false;
      },
      error: (err) => {
        this.strategyMessageTone = 'danger';
        this.strategyMessage = this.errorToMessage(err, 'Impossible de sauvegarder la stratégie.');
        this.saving = false;
      }
    });
  }

  protected applyStrategyToRun(): void {
    if (!this.canApplyStrategy) {
      return;
    }
    this.applyingStrategy = true;
    this.applicationError = '';
    this.applicationResult = null;
    this.strategyApi.applyToRun({
      run_id: this.selectedRunId,
      strategy_file: this.selectedStrategyFile,
      selection_mode: this.selectionMode
    }).subscribe({
      next: (response) => {
        this.applicationResult = response;
        this.applyingStrategy = false;
      },
      error: (err) => {
        this.applicationError = this.errorToMessage(err, 'Impossible d’appliquer la stratégie à cette analyse.');
        this.applyingStrategy = false;
      }
    });
  }

  protected selectAnalysisRun(runId: string): void {
    if (!runId || runId === this.selectedRunId) {
      return;
    }
    this.selectedRunId = runId;
    this.applicationResult = null;
    this.applicationError = '';
    this.loadScoredMarketsForRun(runId);
  }

  protected isAllowedMarket(marketId: string): boolean {
    const normalized = this.normalizeMarketId(marketId);
    return this.marketList(this.form.allowedMarketsText)
      .map((market) => this.normalizeMarketId(market))
      .includes(normalized);
  }

  protected toggleAllowedMarket(marketId: string, enabled: boolean): void {
    const normalized = this.normalizeMarketId(marketId);
    const current = this.marketList(this.form.allowedMarketsText).map((market) => this.normalizeMarketId(market));
    const next = enabled
      ? [...current, normalized]
      : current.filter((market) => market !== normalized);
    this.form.allowedMarketsText = Array.from(new Set(next.filter(Boolean))).sort().join('\n');
  }

  protected shortId(value: string | null | undefined): string {
    const text = String(value || '');
    if (!text) {
      return '—';
    }
    if (text.length <= 28) {
      return text;
    }
    return `${text.slice(0, 14)}…${text.slice(-10)}`;
  }

  protected runArtifactId(run: AnalysisRunListItem): string {
    return run.orchestrator_run_id || run.run_id;
  }

  protected runOptionLabel(run: AnalysisRunListItem): string {
    const artifactId = this.runArtifactId(run);
    const jobLabel = run.orchestrator_run_id && run.run_id !== run.orchestrator_run_id
      ? ` · job ${this.shortId(run.run_id)}`
      : '';
    return `${this.shortId(artifactId)} · ${run.target_date || 'no date'} · ${run.status}${jobLabel}`;
  }

  protected textValue(event: Event): string {
    return (($eventTarget(event).value || '') as string).toString();
  }

  protected numberValue(event: Event): number {
    const value = Number(($eventTarget(event).value || 0));
    return Number.isFinite(value) ? value : 0;
  }

  protected riskValue(event: Event): RiskLevel {
    const value = this.textValue(event);
    return value === 'low' || value === 'medium' || value === 'high' ? value : 'medium';
  }

  protected ticketTypeValue(event: Event): TicketType {
    const value = this.textValue(event);
    return value === 'single' || value === 'combo' || value === 'mixed' ? value : 'combo';
  }

  protected dataQualityValue(event: Event): DataQuality {
    const value = this.textValue(event);
    return value === 'low' || value === 'medium' || value === 'high' ? value : 'medium';
  }

  protected stakingValue(event: Event): StakingMethod {
    const value = this.textValue(event);
    return value === 'manual' || value === 'flat' || value === 'percentage' || value === 'kelly_fractional' || value === 'cycle_rollover'
      ? value
      : 'manual';
  }

  protected selectionModeValue(event: Event): 'filter_only' | 'filter_and_select' {
    return this.textValue(event) === 'filter_only' ? 'filter_only' : 'filter_and_select';
  }

  protected resolvedValue(key: string): string {
    const value = this.selectedStrategy?.resolved?.[key];
    return value == null || value === '' ? '—' : String(value);
  }

  protected onSearch(value: string): void {
    this.searchTerm = value;
  }

  protected statusActionTitle(league: FootballLeagueRegistryEntry): string {
    if (league.league_id == null) {
      return 'This league has no verified API-Football ID yet.';
    }
    if (this.isPending(league)) {
      return 'Sauvegarde du statut de couverture...';
    }
    return league.enabled ? 'Cliquer pour désactiver cette ligue.' : 'Cliquer pour activer cette ligue.';
  }

  protected trackLeague(league: FootballLeagueRegistryEntry): number | string {
    return league.league_id ?? `${league.country}-${league.competition_name}`;
  }

  protected isPending(league: FootballLeagueRegistryEntry): boolean {
    return league.league_id != null && this.pendingLeagueIds.has(league.league_id);
  }

  protected setEnabled(league: FootballLeagueRegistryEntry, enabled: boolean): void {
    if (league.league_id == null || this.pendingLeagueIds.has(league.league_id)) {
      return;
    }
    const leagueId = league.league_id;
    const previousEnabled = league.enabled;
    this.pendingLeagueIds.add(leagueId);
    this.coverageSaveMessage = '';
    this.updateLeagueEnabled(leagueId, enabled);

    this.coverageApi.updateFootballLeague(leagueId, { enabled }).subscribe({
      next: () => {
        this.pendingLeagueIds.delete(leagueId);
      },
      error: (err) => {
        this.updateLeagueEnabled(leagueId, previousEnabled);
        this.coverageSaveMessageTone = 'danger';
        this.coverageSaveMessage = this.errorToMessage(err, 'Impossible de mettre à jour la couverture.');
        this.pendingLeagueIds.delete(leagueId);
      }
    });
  }

  private reloadStrategy(): void {
    this.strategyLoading = true;
    this.strategyError = '';
    this.strategyApi.getCatalog().subscribe({
      next: (response) => {
        this.strategyCatalog = response;
        this.activeStrategy = response.active_strategy || null;
        this.setSelectedStrategy(response.active_strategy || null);
        this.strategyLoading = false;
      },
      error: (err) => {
        this.strategyError = this.errorToMessage(err, 'Impossible de charger le catalogue de stratégies.');
        this.strategyLoading = false;
      }
    });
  }

  private reloadRuns(): void {
    this.runsLoading = true;
    this.analysisApi.getRuns().subscribe({
      next: (runs) => {
        this.analysisRuns = runs.filter((run) => ['completed', 'stopped'].includes(String(run.status || '').toLowerCase()));
        const selectedRun = this.analysisRuns.find((run) =>
          run.run_id === this.selectedRunId || run.orchestrator_run_id === this.selectedRunId
        );
        const nextRunId = selectedRun
          ? this.runArtifactId(selectedRun)
          : this.analysisRuns[0]
            ? this.runArtifactId(this.analysisRuns[0])
            : '';
        this.selectedRunId = nextRunId;
        if (nextRunId) {
          this.loadScoredMarketsForRun(nextRunId);
        }
        this.runsLoading = false;
      },
      error: () => {
        this.analysisRuns = [];
        this.runsLoading = false;
      }
    });
  }

  private loadScoredMarketsForRun(runId: string): void {
    this.scoredMarketsLoading = true;
    this.scoredMarketsError = '';
    this.analysisApi.getRunOutputs(runId).subscribe({
      next: (outputs) => {
        this.scoredMarketOptions = this.scoredMarketsFromOutputs(outputs);
        this.scoredMarketsLoading = false;
      },
      error: (err) => {
        this.scoredMarketOptions = [];
        this.scoredMarketsError = this.errorToMessage(err, 'Impossible de charger les marchés notés pour cette analyse.');
        this.scoredMarketsLoading = false;
      }
    });
  }

  private scoredMarketsFromOutputs(outputs: AnalysisRunOutputs): ScoredMarketOption[] {
    const candidates = this.scoredCandidatesFromOutputs(outputs);
    const grouped = new Map<string, { count: number; confidenceTotal: number; withOddsCount: number; examples: string[] }>();
    for (const candidate of candidates) {
      const marketId = this.normalizeMarketId(textFromUnknown(candidate['market_canonical_id'] || candidate['market'] || 'unknown_market'));
      const confidence = numberFromUnknown(candidate['confidence_score'] ?? candidate['confidence']);
      const hasOdds = candidate['expected_odds_min'] != null || candidate['odds'] != null;
      const event = textFromUnknown(candidate['event']);
      const pick = textFromUnknown(candidate['pick'] || candidate['selection_canonical_id']);
      const entry = grouped.get(marketId) || { count: 0, confidenceTotal: 0, withOddsCount: 0, examples: [] };
      entry.count += 1;
      entry.confidenceTotal += confidence;
      entry.withOddsCount += hasOdds ? 1 : 0;
      if (event && entry.examples.length < 2) {
        entry.examples.push(pick ? `${event} (${pick})` : event);
      }
      grouped.set(marketId, entry);
    }

    return Array.from(grouped.entries())
      .map(([id, entry]) => ({
        id,
        label: this.marketLabel(id),
        count: entry.count,
        averageConfidence: Math.round(entry.confidenceTotal / Math.max(1, entry.count)),
        withOddsCount: entry.withOddsCount,
        examples: entry.examples
      }))
      .sort((left, right) => right.count - left.count || left.label.localeCompare(right.label));
  }

  private scoredCandidatesFromOutputs(outputs: AnalysisRunOutputs): Array<Record<string, unknown>> {
    const aggregation = recordFromUnknown(outputs.artifacts['aggregation_candidates']?.data);
    const aggregationCandidates = arrayFromUnknown(aggregation['candidates']).filter(isRecord);
    if (aggregationCandidates.length) {
      return aggregationCandidates;
    }

    const matchAnalysis = recordFromUnknown(outputs.artifacts['match_analysis']?.data);
    const results = arrayFromUnknown(matchAnalysis['results']).filter(isRecord);
    const candidates: Array<Record<string, unknown>> = [];
    for (const result of results) {
      const analysis = recordFromUnknown(result['analysis']);
      const markets = arrayFromUnknown(analysis['predicted_markets']).filter(isRecord);
      for (const market of markets) {
        candidates.push({
          ...market,
          event: analysis['event'],
          confidence_score: market['confidence']
        });
      }
    }
    return candidates;
  }

  protected normalizeMarketId(value: string): string {
    const market = String(value || '').trim().toLowerCase();
    if (!market) {
      return 'unknown_market';
    }
    if (['1x2', 'winner', 'match_winner_1x2'].includes(market) || market.startsWith('match_winner')) {
      return 'match_winner';
    }
    if (market === 'btts' || market.includes('both_teams')) {
      return 'both_teams_to_score';
    }
    if (market.includes('over_under') || market.includes('total_goals') || market.startsWith('goals_over_under')) {
      return 'goals_over_under';
    }
    return market;
  }

  protected marketLabel(marketId: string): string {
    const normalized = this.normalizeMarketId(marketId);
    return MARKET_LABELS_FR[normalized] || normalized.replace(/_/g, ' ');
  }

  private reloadCoverage(): void {
    this.coverageLoading = true;
    this.coverageError = '';
    this.coverageApi.getFootballLeagues().subscribe({
      next: (response) => {
        this.registry = response;
        this.coverageLoading = false;
      },
      error: (err) => {
        this.coverageError = this.errorToMessage(err, 'Impossible de charger le registre de couverture.');
        this.coverageLoading = false;
      }
    });
  }

  private setSelectedStrategy(strategy: StrategyDetailResponse | null): void {
    this.selectedStrategy = strategy;
    this.selectedStrategyFile = strategy?.strategy_file || '';
    this.form = this.formFromPayload(strategy?.payload || {});
  }

  private formFromPayload(payload: Record<string, unknown>): StrategyForm {
    const ticket = objectAt(payload, 'ticket_policy');
    const targetOdds = objectAt(ticket, 'target_odds');
    const confidence = objectAt(payload, 'confidence_policy');
    const risk = objectAt(payload, 'risk_policy');
    const analysis = objectAt(payload, 'analysis_policy');
    const market = objectAt(payload, 'market_policy');
    const bankroll = objectAt(payload, 'bankroll_policy');
    return {
      name: stringAt(payload, 'name'),
      description: stringAt(payload, 'description'),
      enabled: booleanAt(payload, 'enabled', true),
      preferredTicketType: ticketTypeAt(ticket, 'preferred_ticket_type', 'combo'),
      allowSingle: booleanAt(ticket, 'allow_single', true),
      allowCombo: booleanAt(ticket, 'allow_combo', true),
      minPicks: numberAt(ticket, 'min_picks', 1),
      maxPicks: numberAt(ticket, 'max_picks', 5),
      targetOddsEnabled: booleanAt(targetOdds, 'enabled', true),
      targetOddsMin: numberAt(targetOdds, 'min', 2.8),
      targetOddsMax: numberAt(targetOdds, 'max', 3.5),
      minMatchConfidence: numberAt(confidence, 'min_match_analysis_confidence', 65),
      minPickConfidence: numberAt(confidence, 'min_pick_confidence', 65),
      minComboConfidence: numberAt(confidence, 'min_combo_confidence', 65),
      riskAppetite: riskAt(risk, 'risk_appetite', 'medium'),
      maxPickRisk: riskAt(risk, 'max_pick_risk', 'medium'),
      maxComboRisk: riskAt(risk, 'max_combo_risk', 'medium'),
      minDataQuality: dataQualityAt(analysis, 'min_data_quality', 'medium'),
      requireOddsAvailable: booleanAt(analysis, 'require_odds_available', true),
      allowedMarketsText: listAt(market, 'allowed_markets').join('\n'),
      excludedMarketsText: listAt(market, 'excluded_markets').join('\n'),
      bankrollEnabled: booleanAt(bankroll, 'enabled', false),
      stakingMethod: stakingAt(bankroll, 'staking_method', 'manual'),
      initialStake: numberAt(bankroll, 'initial_stake', 0),
      targetBankroll: numberAt(bankroll, 'target_bankroll', 0),
      resetOnGoal: booleanAt(bankroll, 'reset_on_goal', false),
      lossRule: stringAt(bankroll, 'loss_rule'),
      maxCycleSteps: numberAt(bankroll, 'max_cycle_steps', 1),
      maxStakePercentPerTicket: numberAt(bankroll, 'max_stake_percent_per_ticket', 0),
      dailyLossLimitPercent: numberAt(bankroll, 'daily_loss_limit_percent', 0),
      weeklyLossLimitPercent: numberAt(bankroll, 'weekly_loss_limit_percent', 0)
    };
  }

  private payloadFromForm(): Record<string, unknown> {
    const payload = deepClone(this.selectedStrategy?.payload || {});
    payload['name'] = this.form.name.trim();
    payload['description'] = this.form.description.trim();
    payload['enabled'] = this.form.enabled;

    const ticket = ensureObject(payload, 'ticket_policy');
    ticket['allow_single'] = this.form.allowSingle;
    ticket['allow_combo'] = this.form.allowCombo;
    ticket['preferred_ticket_type'] = this.form.preferredTicketType;
    ticket['min_picks'] = this.form.minPicks;
    ticket['max_picks'] = this.form.maxPicks;
    const targetOdds = ensureObject(ticket, 'target_odds');
    targetOdds['enabled'] = this.form.targetOddsEnabled;
    targetOdds['min'] = this.form.targetOddsEnabled ? this.form.targetOddsMin : null;
    targetOdds['max'] = this.form.targetOddsEnabled ? this.form.targetOddsMax : null;

    const confidence = ensureObject(payload, 'confidence_policy');
    confidence['min_match_analysis_confidence'] = this.form.minMatchConfidence;
    confidence['min_pick_confidence'] = this.form.minPickConfidence;
    confidence['min_combo_confidence'] = this.form.minComboConfidence;

    const risk = ensureObject(payload, 'risk_policy');
    risk['risk_appetite'] = this.form.riskAppetite;
    risk['max_pick_risk'] = this.form.maxPickRisk;
    risk['max_combo_risk'] = this.form.maxComboRisk;

    const analysis = ensureObject(payload, 'analysis_policy');
    analysis['min_data_quality'] = this.form.minDataQuality;
    analysis['require_odds_available'] = this.form.requireOddsAvailable;

    const market = ensureObject(payload, 'market_policy');
    market['mode'] = 'allowlist';
    market['allowed_markets'] = this.marketList(this.form.allowedMarketsText);
    market['excluded_markets'] = this.marketList(this.form.excludedMarketsText);

    const bankroll = ensureObject(payload, 'bankroll_policy');
    bankroll['enabled'] = this.form.bankrollEnabled;
    bankroll['staking_method'] = this.form.stakingMethod;
    bankroll['initial_stake'] = this.form.bankrollEnabled ? this.form.initialStake : null;
    bankroll['target_bankroll'] = this.form.bankrollEnabled && this.form.targetBankroll > 0 ? this.form.targetBankroll : null;
    bankroll['reset_on_goal'] = this.form.resetOnGoal;
    bankroll['loss_rule'] = this.form.lossRule.trim() || null;
    bankroll['max_cycle_steps'] = this.form.maxCycleSteps || null;
    bankroll['max_stake_percent_per_ticket'] = this.form.maxStakePercentPerTicket || null;
    bankroll['daily_loss_limit_percent'] = this.form.dailyLossLimitPercent || null;
    bankroll['weekly_loss_limit_percent'] = this.form.weeklyLossLimitPercent || null;
    return payload;
  }

  private markActive(activeStrategyFile: string): void {
    if (!this.strategyCatalog) {
      return;
    }
    this.strategyCatalog = {
      ...this.strategyCatalog,
      active_strategy_file: activeStrategyFile,
      active_strategy: this.activeStrategy,
      strategies: this.strategyCatalog.strategies.map((strategy) => ({
        ...strategy,
        active: strategy.strategy_file === activeStrategyFile
      }))
    };
  }

  private updateLeagueEnabled(leagueId: number, enabled: boolean): void {
    if (!this.registry) {
      return;
    }
    const leagues = this.registry.leagues.map((item) => item.league_id === leagueId ? { ...item, enabled } : item);
    this.registry = {
      ...this.registry,
      leagues,
      enabled_count: leagues.reduce((count, item) => count + (item.enabled ? 1 : 0), 0)
    };
  }

  private marketList(value: string): string[] {
    return value.split(/[\n,]/).map((item) => item.trim()).filter(Boolean);
  }

  private emptyForm(): StrategyForm {
    return {
      name: '',
      description: '',
      enabled: true,
      preferredTicketType: 'combo',
      allowSingle: true,
      allowCombo: true,
      minPicks: 1,
      maxPicks: 5,
      targetOddsEnabled: true,
      targetOddsMin: 2.8,
      targetOddsMax: 3.5,
      minMatchConfidence: 65,
      minPickConfidence: 65,
      minComboConfidence: 65,
      riskAppetite: 'medium',
      maxPickRisk: 'medium',
      maxComboRisk: 'medium',
      minDataQuality: 'medium',
      requireOddsAvailable: true,
      allowedMarketsText: '',
      excludedMarketsText: '',
      bankrollEnabled: false,
      stakingMethod: 'manual',
      initialStake: 0,
      targetBankroll: 0,
      resetOnGoal: false,
      lossRule: '',
      maxCycleSteps: 1,
      maxStakePercentPerTicket: 0,
      dailyLossLimitPercent: 0,
      weeklyLossLimitPercent: 0
    };
  }

  private errorToMessage(err: unknown, fallback: string): string {
    const maybeError = err as { error?: { detail?: string }; message?: string };
    return maybeError?.error?.detail || maybeError?.message || fallback;
  }
}

function $eventTarget(event: Event): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement {
  return event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === 'object' && !Array.isArray(value));
}

function recordFromUnknown(value: unknown): Record<string, unknown> {
  return isRecord(value) ? value : {};
}

function arrayFromUnknown(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function textFromUnknown(value: unknown): string {
  return value == null ? '' : String(value);
}

function numberFromUnknown(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function deepClone(value: Record<string, unknown>): Record<string, unknown> {
  return JSON.parse(JSON.stringify(value)) as Record<string, unknown>;
}

function ensureObject(source: Record<string, unknown>, key: string): Record<string, unknown> {
  if (!source[key] || typeof source[key] !== 'object' || Array.isArray(source[key])) {
    source[key] = {};
  }
  return source[key] as Record<string, unknown>;
}

function objectAt(source: Record<string, unknown>, key: string): Record<string, unknown> {
  const value = source[key];
  return value && typeof value === 'object' && !Array.isArray(value) ? value as Record<string, unknown> : {};
}

function stringAt(source: Record<string, unknown>, key: string): string {
  const value = source[key];
  return value == null ? '' : String(value);
}

function numberAt(source: Record<string, unknown>, key: string, fallback: number): number {
  const value = Number(source[key]);
  return Number.isFinite(value) ? value : fallback;
}

function booleanAt(source: Record<string, unknown>, key: string, fallback: boolean): boolean {
  const value = source[key];
  return typeof value === 'boolean' ? value : fallback;
}

function listAt(source: Record<string, unknown>, key: string): string[] {
  const value = source[key];
  return Array.isArray(value) ? value.map((item) => String(item)) : [];
}

function riskAt(source: Record<string, unknown>, key: string, fallback: RiskLevel): RiskLevel {
  const value = stringAt(source, key);
  return value === 'low' || value === 'medium' || value === 'high' ? value : fallback;
}

function ticketTypeAt(source: Record<string, unknown>, key: string, fallback: TicketType): TicketType {
  const value = stringAt(source, key);
  return value === 'single' || value === 'combo' || value === 'mixed' ? value : fallback;
}

function dataQualityAt(source: Record<string, unknown>, key: string, fallback: DataQuality): DataQuality {
  const value = stringAt(source, key);
  return value === 'low' || value === 'medium' || value === 'high' ? value : fallback;
}

function stakingAt(source: Record<string, unknown>, key: string, fallback: StakingMethod): StakingMethod {
  const value = stringAt(source, key);
  return value === 'manual' || value === 'flat' || value === 'percentage' || value === 'kelly_fractional' || value === 'cycle_rollover'
    ? value
    : fallback;
}

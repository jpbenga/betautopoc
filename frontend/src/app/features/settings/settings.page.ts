import { Component, OnInit, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import {
  SettingsIntegrationStatus,
  SettingsLogEntry,
  SettingsResponse,
  SettingsValidationResult
} from '../../core/api/api.types';
import { SettingsApiService } from '../../core/api/settings-api.service';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { FormFieldComponent } from '../../shared/ui/form-field/form-field.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { LogConsoleComponent, LogEntry } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';

type UiTone = 'default' | 'success' | 'warning' | 'danger' | 'live';

interface SettingField {
  label: string;
  value: string;
  hint: string;
}

interface SettingMetric {
  label: string;
  value: string;
  status?: string;
  tone?: UiTone;
}

@Component({
  selector: 'ba-settings-page',
  standalone: true,
  imports: [
    EmptyStateComponent,
    ErrorStateComponent,
    FormFieldComponent,
    KpiCardComponent,
    LoadingStateComponent,
    LogConsoleComponent,
    PageHeaderComponent,
    SectionCardComponent,
    StatusBadgeComponent
  ],
  template: `
    <ba-page-header
      eyebrow="System Configuration"
      title="Global Settings"
      subtitle="Configuration globale réelle du runtime BetAuto."
    >
      <div class="flex flex-wrap gap-2">
        <button
          type="button"
          class="ba-tool border-border/60 text-muted"
          disabled
          title="Settings writes are disabled until a persistence contract exists."
        >
          Save Changes disabled
        </button>
        <button type="button" class="ba-tool" (click)="validateCurrentSettings()" [disabled]="validating">
          {{ validating ? 'Validating...' : 'Validate' }}
        </button>
      </div>
    </ba-page-header>

    @if (loading) {
      <ba-section-card>
        <div class="p-4">
          <ba-loading-state message="Loading runtime settings..."></ba-loading-state>
        </div>
      </ba-section-card>
    } @else if (error) {
      <ba-error-state label="Settings API error" [message]="error"></ba-error-state>
    } @else if (!settings) {
      <ba-empty-state
        label="No settings available"
        message="Runtime settings could not be loaded."
      ></ba-empty-state>
    } @else {
      <section class="mb-4 rounded-card border border-warning/30 bg-warning/10 p-4">
        <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p class="ba-label text-warning">Read-only configuration</p>
            <p class="mt-1 text-sm text-muted">{{ settings.metadata.message }}</p>
          </div>
          <ba-status-badge label="read-only" tone="warning"></ba-status-badge>
        </div>
        @if (validationResult) {
          <div class="mt-3 rounded-card border border-border/60 bg-background/60 p-3 text-sm text-muted">
            <p class="ba-label">Validation</p>
            <p class="mt-1">status: {{ validationResult.status }} · writable: {{ validationResult.writable }}</p>
            @if (validationResult.warnings.length) {
              <p class="mt-1 text-warning">{{ validationResult.warnings.join(' ') }}</p>
            }
            @if (validationResult.errors.length) {
              <p class="mt-1 text-danger">{{ validationResult.errors.join(' ') }}</p>
            }
          </div>
        }
      </section>

      <section class="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Strategy settings</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Active strategy guardrails</h3>
          </div>
          <div class="grid gap-4 p-4 md:grid-cols-2">
            @for (field of strategyFields; track field.label) {
              <ba-form-field [label]="field.label" [hint]="field.hint">
                <input
                  class="ba-tool w-full font-data text-muted"
                  type="text"
                  [value]="field.value"
                  [attr.aria-label]="field.label"
                  readonly
                />
              </ba-form-field>
            }
          </div>
        </ba-section-card>

        <ba-section-card>
          <div class="ba-card-header flex items-center justify-between gap-4">
            <div>
              <p class="ba-label">Runtime status</p>
              <h3 class="mt-1 text-sm font-semibold text-text">Flags currently active</h3>
            </div>
            <ba-status-badge [label]="settings.metadata.mode" tone="warning"></ba-status-badge>
          </div>
          <div class="grid gap-4 p-4 sm:grid-cols-2 xl:grid-cols-1">
            @for (metric of runtimeStatus; track metric.label) {
              <ba-kpi-card
                [label]="metric.label"
                [value]="metric.value"
                [status]="metric.status || ''"
                [tone]="metric.tone || 'default'"
              ></ba-kpi-card>
            }
          </div>
        </ba-section-card>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-3">
        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Selection / risk</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Ticket constraints</h3>
          </div>
          <div class="space-y-3 p-4">
            @for (metric of selectionRiskSettings; track metric.label) {
              <div class="flex items-start justify-between gap-4 rounded-card border border-border/60 bg-background/60 p-3">
                <div>
                  <p class="ba-label">{{ metric.label }}</p>
                  <p class="ba-data mt-2 text-text">{{ metric.value }}</p>
                </div>
                @if (metric.status) {
                  <ba-status-badge [label]="metric.status" [tone]="metric.tone || 'default'"></ba-status-badge>
                }
              </div>
            }
          </div>
        </ba-section-card>

        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Integrations</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Provider status</h3>
          </div>
          <div class="space-y-3 p-4">
            @for (integration of integrations; track integration.name) {
              <div class="flex items-start justify-between gap-4 rounded-card border border-border/60 bg-background/60 p-3">
                <div>
                  <p class="text-sm font-medium text-text">{{ integration.name }}</p>
                  <p class="mt-1 text-xs text-muted">{{ integration.detail }}</p>
                  <p class="mt-1 font-data text-[11px] text-muted">{{ integration.source }}</p>
                </div>
                <ba-status-badge [label]="integration.status" [tone]="toneForIntegration(integration.status)"></ba-status-badge>
              </div>
            }
          </div>
        </ba-section-card>

        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Runtime flags</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Strict and legacy modes</h3>
          </div>
          <div class="space-y-3 p-4">
            @for (metric of runtimeFlags; track metric.label) {
              <div class="flex items-start justify-between gap-4 rounded-card border border-border/60 bg-background/60 p-3">
                <div>
                  <p class="ba-label">{{ metric.label }}</p>
                  <p class="ba-data mt-2 text-text">{{ metric.value }}</p>
                </div>
                <ba-status-badge [label]="metric.status || 'active'" [tone]="metric.tone || 'default'"></ba-status-badge>
              </div>
            }
          </div>
        </ba-section-card>
      </section>

      <section class="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
        <ba-section-card>
          <div class="ba-card-header">
            <p class="ba-label">Notifications</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Placeholder settings</h3>
          </div>
          <div class="space-y-3 p-4">
            @for (metric of notificationSettings; track metric.label) {
              <div class="flex items-start justify-between gap-4 rounded-card border border-border/60 bg-background/60 p-3">
                <div>
                  <p class="ba-label">{{ metric.label }}</p>
                  <p class="ba-data mt-2 text-text">{{ metric.value }}</p>
                </div>
                <ba-status-badge [label]="metric.status || 'read-only'" [tone]="metric.tone || 'default'"></ba-status-badge>
              </div>
            }
          </div>
        </ba-section-card>

        <ba-log-console
          label="Config logs"
          title="Configuration audit trail"
          [entries]="logs"
          emptyMessage="No settings logs available."
        ></ba-log-console>
      </section>
    }
  `
})
export class SettingsPage implements OnInit {
  private readonly settingsApi = inject(SettingsApiService);

  protected loading = true;
  protected validating = false;
  protected error = '';
  protected settings: SettingsResponse | null = null;
  protected integrations: SettingsIntegrationStatus[] = [];
  protected settingsLogs: SettingsLogEntry[] = [];
  protected validationResult: SettingsValidationResult | null = null;

  ngOnInit(): void {
    this.loadSettings();
  }

  protected get strategyFields(): SettingField[] {
    const strategy = this.settings?.strategy;
    if (!strategy) {
      return [];
    }
    return [
      { label: 'strategy_file', value: strategy.strategy_file, hint: 'Resolved from BETAUTO_STRATEGY_FILE or default strategy.' },
      { label: 'strategy_id', value: strategy.strategy_id || '—', hint: 'Strategy declared in config/strategies.' },
      { label: 'min_confidence', value: this.value(strategy.min_confidence), hint: 'Minimum pick confidence.' },
      { label: 'allowed_markets', value: strategy.allowed_markets.join(', '), hint: 'Market allowlist from strategy policy.' },
      { label: 'require_odds_available', value: this.bool(strategy.require_odds_available), hint: 'Reject candidates without odds when enabled.' },
      { label: 'data_provider', value: strategy.data_provider || '—', hint: 'Configured match data provider.' }
    ];
  }

  protected get runtimeStatus(): SettingMetric[] {
    const runtime = this.settings?.runtime;
    if (!runtime) {
      return [];
    }
    return [
      { label: 'orchestrator', value: this.bool(runtime.orchestrator_enabled), status: runtime.orchestrator_enabled ? 'enabled' : 'disabled', tone: runtime.orchestrator_enabled ? 'success' : 'warning' },
      { label: 'browser', value: this.bool(runtime.with_browser), status: runtime.with_browser ? 'requested' : 'disabled', tone: runtime.with_browser ? 'warning' : 'default' },
      { label: 'strict mode', value: this.bool(runtime.strict_mode), status: runtime.strict_mode ? 'protected' : 'off', tone: runtime.strict_mode ? 'success' : 'danger' },
      { label: 'legacy mode', value: this.bool(runtime.allow_legacy), status: runtime.allow_legacy ? 'allowed' : 'blocked', tone: runtime.allow_legacy ? 'danger' : 'success' }
    ];
  }

  protected get selectionRiskSettings(): SettingMetric[] {
    const selection = this.settings?.selection;
    const risk = this.settings?.risk;
    if (!selection || !risk) {
      return [];
    }
    return [
      { label: 'combo_min_odds', value: this.value(selection.combo_min_odds), status: 'read-only', tone: 'default' },
      { label: 'combo_max_odds', value: this.value(selection.combo_max_odds), status: 'read-only', tone: 'default' },
      { label: 'max_picks', value: this.value(selection.max_picks), status: 'read-only', tone: 'default' },
      { label: 'min_pick_confidence', value: this.value(selection.min_pick_confidence), status: 'read-only', tone: 'default' },
      { label: 'max_pick_risk', value: risk.max_pick_risk || '—', status: 'guarded', tone: 'warning' },
      { label: 'bankroll_policy', value: risk.bankroll_enabled ? 'enabled' : 'disabled', status: risk.staking_method || 'manual', tone: 'default' }
    ];
  }

  protected get runtimeFlags(): SettingMetric[] {
    const runtime = this.settings?.runtime;
    if (!runtime) {
      return [];
    }
    return [
      { label: 'BETAUTO_STRICT_MODE', value: this.bool(runtime.strict_mode), status: runtime.strict_mode ? 'safe' : 'unsafe', tone: runtime.strict_mode ? 'success' : 'danger' },
      { label: 'BETAUTO_ALLOW_LEGACY', value: this.bool(runtime.allow_legacy), status: runtime.allow_legacy ? 'legacy on' : 'legacy off', tone: runtime.allow_legacy ? 'danger' : 'success' },
      { label: 'ORCHESTRATOR_WITH_BROWSER', value: this.bool(runtime.with_browser), status: runtime.with_browser ? 'requested' : 'off', tone: 'warning' },
      { label: 'CORS origins', value: runtime.cors_origins.join(', '), status: 'env', tone: 'default' }
    ];
  }

  protected get notificationSettings(): SettingMetric[] {
    const notifications = this.settings?.notifications;
    if (!notifications) {
      return [];
    }
    return [
      { label: 'email alerts', value: this.nullableBool(notifications.email_alerts), status: notifications.status, tone: 'default' },
      { label: 'critical alerts only', value: this.nullableBool(notifications.critical_alerts_only), status: notifications.status, tone: 'default' },
      { label: 'slack webhook', value: this.bool(notifications.slack_webhook_configured), status: notifications.slack_webhook_configured ? 'configured' : 'missing', tone: notifications.slack_webhook_configured ? 'success' : 'warning' }
    ];
  }

  protected get logs(): LogEntry[] {
    return this.settingsLogs.map((entry, index) => ({
      time: entry.at || `#${index + 1}`,
      level: this.logLevel(entry.level),
      message: `[${entry.source}] ${entry.message}`
    }));
  }

  protected validateCurrentSettings(): void {
    if (!this.settings) {
      return;
    }
    this.validating = true;
    this.settingsApi.validateSettings({ settings: {} }).subscribe({
      next: (result) => {
        this.validationResult = result;
        this.validating = false;
      },
      error: (error: unknown) => {
        this.error = error instanceof Error ? error.message : 'Unable to validate settings.';
        this.validating = false;
      }
    });
  }

  private loadSettings(): void {
    this.loading = true;
    this.error = '';
    forkJoin({
      settings: this.settingsApi.getSettings(),
      integrations: this.settingsApi.getIntegrations(),
      logs: this.settingsApi.getLogs()
    }).subscribe({
      next: ({ settings, integrations, logs }) => {
        this.settings = settings;
        this.integrations = integrations.integrations.length ? integrations.integrations : settings.integrations;
        this.settingsLogs = logs.logs;
        this.loading = false;
      },
      error: (error: unknown) => {
        this.error = error instanceof Error ? error.message : 'Unable to load settings.';
        this.loading = false;
      }
    });
  }

  protected toneForIntegration(status: string): UiTone {
    if (['configured', 'enabled'].includes(status)) {
      return 'success';
    }
    if (['missing', 'disabled'].includes(status)) {
      return 'warning';
    }
    return 'default';
  }

  private logLevel(level: string): LogEntry['level'] {
    if (level === 'error') {
      return 'danger';
    }
    if (level === 'success' || level === 'warning') {
      return level;
    }
    return 'info';
  }

  private value(value: string | number | boolean | null | undefined): string {
    if (value === null || value === undefined || value === '') {
      return '—';
    }
    return String(value);
  }

  private bool(value: boolean | null | undefined): string {
    return value ? 'true' : 'false';
  }

  private nullableBool(value: boolean | null | undefined): string {
    if (value === null || value === undefined) {
      return 'not configured';
    }
    return this.bool(value);
  }
}

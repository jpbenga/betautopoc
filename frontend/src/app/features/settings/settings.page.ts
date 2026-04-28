import { Component } from '@angular/core';
import { FormFieldComponent } from '../../shared/ui/form-field/form-field.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LogConsoleComponent, LogEntry } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';

interface SettingField {
  label: string;
  value: string;
  hint: string;
}

interface SettingMetric {
  label: string;
  value: string;
  status?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'live';
}

interface IntegrationStatus {
  name: string;
  detail: string;
  status: string;
  tone: 'default' | 'success' | 'warning' | 'danger' | 'live';
}

interface ToggleSetting {
  label: string;
  detail: string;
  enabled: boolean;
}

@Component({
  selector: 'ba-settings-page',
  standalone: true,
  imports: [
    FormFieldComponent,
    KpiCardComponent,
    LogConsoleComponent,
    PageHeaderComponent,
    SectionCardComponent,
    StatusBadgeComponent
  ],
  template: `
    <ba-page-header
      eyebrow="System Configuration"
      title="Global Settings"
      subtitle="Configuration globale du système BetAuto."
    >
      <div class="flex flex-wrap gap-2">
        <button type="button" class="ba-tool border-accent/60 bg-accent text-background hover:bg-accent-strong">
          Save Changes
        </button>
        <button type="button" class="ba-tool border-warning/40 text-warning hover:bg-warning/10">
          Reset
        </button>
      </div>
    </ba-page-header>

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
                class="ba-tool w-full font-data"
                type="text"
                [value]="field.value"
                [attr.aria-label]="field.label"
              />
            </ba-form-field>
          }
        </div>
      </ba-section-card>

      <ba-section-card>
        <div class="ba-card-header flex items-center justify-between gap-4">
          <div>
            <p class="ba-label">System status</p>
            <h3 class="mt-1 text-sm font-semibold text-text">Runtime configuration state</h3>
          </div>
          <ba-status-badge label="healthy" tone="success"></ba-status-badge>
        </div>
        <div class="grid gap-4 p-4 sm:grid-cols-3 xl:grid-cols-1">
          @for (metric of systemStatus; track metric.label) {
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
          <p class="ba-label">Risk settings</p>
          <h3 class="mt-1 text-sm font-semibold text-text">Capital and exposure limits</h3>
        </div>
        <div class="space-y-3 p-4">
          @for (metric of riskSettings; track metric.label) {
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
          <p class="ba-label">API settings</p>
          <h3 class="mt-1 text-sm font-semibold text-text">Provider connectivity</h3>
        </div>
        <div class="space-y-3 p-4">
          @for (integration of integrations; track integration.name) {
            <div class="flex items-start justify-between gap-4 rounded-card border border-border/60 bg-background/60 p-3">
              <div>
                <p class="text-sm font-medium text-text">{{ integration.name }}</p>
                <p class="mt-1 text-xs text-muted">{{ integration.detail }}</p>
              </div>
              <ba-status-badge [label]="integration.status" [tone]="integration.tone"></ba-status-badge>
            </div>
          }
        </div>
      </ba-section-card>

      <ba-section-card>
        <div class="ba-card-header">
          <p class="ba-label">Agent settings</p>
          <h3 class="mt-1 text-sm font-semibold text-text">Automation controls</h3>
        </div>
        <div class="space-y-3 p-4">
          @for (toggle of agentToggles; track toggle.label) {
            <div class="flex items-center justify-between gap-4 rounded-card border border-border/60 bg-background/60 p-3">
              <div>
                <p class="text-sm font-medium text-text">{{ toggle.label }}</p>
                <p class="mt-1 text-xs text-muted">{{ toggle.detail }}</p>
              </div>
              <button
                type="button"
                class="relative h-6 w-11 shrink-0 rounded-full border transition"
                [class.border-success]="toggle.enabled"
                [class.bg-success]="toggle.enabled"
                [class.border-border]="!toggle.enabled"
                [class.bg-surface-high]="!toggle.enabled"
                [attr.aria-pressed]="toggle.enabled"
              >
                <span
                  class="absolute top-0.5 h-5 w-5 rounded-full bg-text transition"
                  [class.left-5]="toggle.enabled"
                  [class.left-0.5]="!toggle.enabled"
                ></span>
              </button>
            </div>
          }

          <ba-form-field label="max retries" hint="Retry limit for failed jobs before escalation.">
            <input class="ba-tool w-full font-data" type="number" value="3" aria-label="max retries" />
          </ba-form-field>
        </div>
      </ba-section-card>
    </section>

    <section class="mt-4 grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <ba-section-card>
        <div class="ba-card-header">
          <p class="ba-label">Notification settings</p>
          <h3 class="mt-1 text-sm font-semibold text-text">Alert routing</h3>
        </div>
        <div class="space-y-3 p-4">
          @for (metric of notificationSettings; track metric.label) {
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

      <ba-log-console
        label="Config logs"
        title="Configuration audit trail"
        [entries]="logs"
      ></ba-log-console>
    </section>
  `
})
export class SettingsPage {
  protected readonly strategyFields: SettingField[] = [
    {
      label: 'strategy_id',
      value: 'default_football_balanced',
      hint: 'Primary strategy used by orchestration runs.'
    },
    {
      label: 'min_confidence',
      value: '65',
      hint: 'Minimum pick confidence accepted by the selector.'
    },
    {
      label: 'max_picks',
      value: '5',
      hint: 'Maximum number of picks allowed in a generated ticket.'
    },
    {
      label: 'odds_range',
      value: '2.8 - 3.5',
      hint: 'Target combined odds range for balanced tickets.'
    }
  ];

  protected readonly riskSettings: SettingMetric[] = [
    { label: 'max_exposure', value: '40%', status: 'active', tone: 'success' },
    { label: 'max_per_ticket', value: '$500', status: 'guarded', tone: 'default' },
    { label: 'stop_loss', value: '-$1000', status: 'armed', tone: 'warning' },
    { label: 'max_parallel_runs', value: '5', status: 'limited', tone: 'default' }
  ];

  protected readonly integrations: IntegrationStatus[] = [
    {
      name: 'OpenAI',
      detail: 'Model inference and analysis scoring.',
      status: 'connected',
      tone: 'success'
    },
    {
      name: 'API-Football',
      detail: 'Fixtures, markets and match context.',
      status: 'connected',
      tone: 'success'
    },
    {
      name: 'Browser Use',
      detail: 'Browser automation disabled in orchestrator mode.',
      status: 'disabled',
      tone: 'default'
    }
  ];

  protected readonly agentToggles: ToggleSetting[] = [
    {
      label: 'enable browser-use',
      detail: 'Allow browser automation for verification tasks.',
      enabled: false
    },
    {
      label: 'retry failed jobs',
      detail: 'Automatically retry transient orchestration failures.',
      enabled: true
    }
  ];

  protected readonly notificationSettings: SettingMetric[] = [
    { label: 'email alerts', value: 'enabled', status: 'on', tone: 'success' },
    { label: 'critical alerts only', value: 'true', status: 'filtered', tone: 'default' },
    { label: 'slack webhook', value: 'configured', status: 'ready', tone: 'success' }
  ];

  protected readonly systemStatus: SettingMetric[] = [
    { label: 'system health', value: 'healthy', status: 'live', tone: 'live' },
    { label: 'last update', value: '2 min ago', status: 'fresh', tone: 'success' },
    { label: 'version', value: 'v1.0.0', status: 'stable', tone: 'default' }
  ];

  protected readonly logs: LogEntry[] = [
    { time: '15:20', level: 'success', message: '[config] strategy updated' },
    { time: '15:21', level: 'success', message: '[config] risk limits saved' },
    { time: '15:22', level: 'info', message: '[config] api connection verified' }
  ];
}

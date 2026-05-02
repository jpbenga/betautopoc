import { Component, inject } from '@angular/core';
import { forkJoin } from 'rxjs';
import { SettingsApiService } from '../../core/api/settings-api.service';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { FormFieldComponent } from '../../shared/ui/form-field/form-field.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { LogConsoleComponent } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.label;
const _forTrack1 = ($index, $item) => $item.name;
function SettingsPage_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ba-section-card")(1, "div", 6);
    i0.ɵɵelement(2, "ba-loading-state", 7);
    i0.ɵɵelementEnd()();
} }
function SettingsPage_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-error-state", 4);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("message", ctx_r0.error);
} }
function SettingsPage_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-empty-state", 5);
} }
function SettingsPage_Conditional_9_Conditional_8_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 30);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.validationResult.warnings.join(" "));
} }
function SettingsPage_Conditional_9_Conditional_8_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 31);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(3);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.validationResult.errors.join(" "));
} }
function SettingsPage_Conditional_9_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 13)(1, "p", 16);
    i0.ɵɵtext(2, "Validation");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(3, "p", 29);
    i0.ɵɵtext(4);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(5, SettingsPage_Conditional_9_Conditional_8_Conditional_5_Template, 2, 1, "p", 30);
    i0.ɵɵconditionalCreate(6, SettingsPage_Conditional_9_Conditional_8_Conditional_6_Template, 2, 1, "p", 31);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate2("status: ", ctx_r0.validationResult.status, " \u00B7 writable: ", ctx_r0.validationResult.writable);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.validationResult.warnings.length ? 5 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.validationResult.errors.length ? 6 : -1);
} }
function SettingsPage_Conditional_9_For_18_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "ba-form-field", 19);
    i0.ɵɵelement(1, "input", 32);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const field_r2 = ctx.$implicit;
    i0.ɵɵproperty("label", field_r2.label)("hint", field_r2.hint);
    i0.ɵɵadvance();
    i0.ɵɵproperty("value", field_r2.value);
    i0.ɵɵattribute("aria-label", field_r2.label);
} }
function SettingsPage_Conditional_9_For_29_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-kpi-card", 23);
} if (rf & 2) {
    const metric_r3 = ctx.$implicit;
    i0.ɵɵproperty("label", metric_r3.label)("value", metric_r3.value)("status", metric_r3.status || "")("tone", metric_r3.tone || "default");
} }
function SettingsPage_Conditional_9_For_39_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-status-badge", 34);
} if (rf & 2) {
    const metric_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵproperty("label", metric_r4.status)("tone", metric_r4.tone || "default");
} }
function SettingsPage_Conditional_9_For_39_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 26)(1, "div")(2, "p", 16);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 33);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵconditionalCreate(6, SettingsPage_Conditional_9_For_39_Conditional_6_Template, 1, 2, "ba-status-badge", 34);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const metric_r4 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(metric_r4.label);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(metric_r4.value);
    i0.ɵɵadvance();
    i0.ɵɵconditional(metric_r4.status ? 6 : -1);
} }
function SettingsPage_Conditional_9_For_48_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 26)(1, "div")(2, "p", 35);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 36);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(6, "p", 37);
    i0.ɵɵtext(7);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(8, "ba-status-badge", 34);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const integration_r5 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(integration_r5.name);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(integration_r5.detail);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(integration_r5.source);
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", integration_r5.status)("tone", ctx_r0.toneForIntegration(integration_r5.status));
} }
function SettingsPage_Conditional_9_For_57_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 26)(1, "div")(2, "p", 16);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 33);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(6, "ba-status-badge", 34);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const metric_r6 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(metric_r6.label);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(metric_r6.value);
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", metric_r6.status || "active")("tone", metric_r6.tone || "default");
} }
function SettingsPage_Conditional_9_For_67_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 26)(1, "div")(2, "p", 16);
    i0.ɵɵtext(3);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(4, "p", 33);
    i0.ɵɵtext(5);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(6, "ba-status-badge", 34);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const metric_r7 = ctx.$implicit;
    i0.ɵɵadvance(3);
    i0.ɵɵtextInterpolate(metric_r7.label);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(metric_r7.value);
    i0.ɵɵadvance();
    i0.ɵɵproperty("label", metric_r7.status || "read-only")("tone", metric_r7.tone || "default");
} }
function SettingsPage_Conditional_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "section", 8)(1, "div", 9)(2, "div")(3, "p", 10);
    i0.ɵɵtext(4, "Read-only configuration");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(5, "p", 11);
    i0.ɵɵtext(6);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(7, "ba-status-badge", 12);
    i0.ɵɵelementEnd();
    i0.ɵɵconditionalCreate(8, SettingsPage_Conditional_9_Conditional_8_Template, 7, 4, "div", 13);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(9, "section", 14)(10, "ba-section-card")(11, "div", 15)(12, "p", 16);
    i0.ɵɵtext(13, "Strategy settings");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(14, "h3", 17);
    i0.ɵɵtext(15, "Active strategy guardrails");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(16, "div", 18);
    i0.ɵɵrepeaterCreate(17, SettingsPage_Conditional_9_For_18_Template, 2, 4, "ba-form-field", 19, _forTrack0);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(19, "ba-section-card")(20, "div", 20)(21, "div")(22, "p", 16);
    i0.ɵɵtext(23, "Runtime status");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(24, "h3", 17);
    i0.ɵɵtext(25, "Flags currently active");
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(26, "ba-status-badge", 21);
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(27, "div", 22);
    i0.ɵɵrepeaterCreate(28, SettingsPage_Conditional_9_For_29_Template, 1, 4, "ba-kpi-card", 23, _forTrack0);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(30, "section", 24)(31, "ba-section-card")(32, "div", 15)(33, "p", 16);
    i0.ɵɵtext(34, "Selection / risk");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(35, "h3", 17);
    i0.ɵɵtext(36, "Ticket constraints");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(37, "div", 25);
    i0.ɵɵrepeaterCreate(38, SettingsPage_Conditional_9_For_39_Template, 7, 3, "div", 26, _forTrack0);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(40, "ba-section-card")(41, "div", 15)(42, "p", 16);
    i0.ɵɵtext(43, "Integrations");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(44, "h3", 17);
    i0.ɵɵtext(45, "Provider status");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(46, "div", 25);
    i0.ɵɵrepeaterCreate(47, SettingsPage_Conditional_9_For_48_Template, 9, 5, "div", 26, _forTrack1);
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(49, "ba-section-card")(50, "div", 15)(51, "p", 16);
    i0.ɵɵtext(52, "Runtime flags");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(53, "h3", 17);
    i0.ɵɵtext(54, "Strict and legacy modes");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(55, "div", 25);
    i0.ɵɵrepeaterCreate(56, SettingsPage_Conditional_9_For_57_Template, 7, 4, "div", 26, _forTrack0);
    i0.ɵɵelementEnd()()();
    i0.ɵɵelementStart(58, "section", 27)(59, "ba-section-card")(60, "div", 15)(61, "p", 16);
    i0.ɵɵtext(62, "Notifications");
    i0.ɵɵelementEnd();
    i0.ɵɵelementStart(63, "h3", 17);
    i0.ɵɵtext(64, "Placeholder settings");
    i0.ɵɵelementEnd()();
    i0.ɵɵelementStart(65, "div", 25);
    i0.ɵɵrepeaterCreate(66, SettingsPage_Conditional_9_For_67_Template, 7, 4, "div", 26, _forTrack0);
    i0.ɵɵelementEnd()();
    i0.ɵɵelement(68, "ba-log-console", 28);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(6);
    i0.ɵɵtextInterpolate(ctx_r0.settings.metadata.message);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.validationResult ? 8 : -1);
    i0.ɵɵadvance(9);
    i0.ɵɵrepeater(ctx_r0.strategyFields);
    i0.ɵɵadvance(9);
    i0.ɵɵproperty("label", ctx_r0.settings.metadata.mode);
    i0.ɵɵadvance(2);
    i0.ɵɵrepeater(ctx_r0.runtimeStatus);
    i0.ɵɵadvance(10);
    i0.ɵɵrepeater(ctx_r0.selectionRiskSettings);
    i0.ɵɵadvance(9);
    i0.ɵɵrepeater(ctx_r0.integrations);
    i0.ɵɵadvance(9);
    i0.ɵɵrepeater(ctx_r0.runtimeFlags);
    i0.ɵɵadvance(10);
    i0.ɵɵrepeater(ctx_r0.notificationSettings);
    i0.ɵɵadvance(2);
    i0.ɵɵproperty("entries", ctx_r0.logs);
} }
export class SettingsPage {
    constructor() {
        this.settingsApi = inject(SettingsApiService);
        this.loading = true;
        this.validating = false;
        this.error = '';
        this.settings = null;
        this.integrations = [];
        this.settingsLogs = [];
        this.validationResult = null;
    }
    ngOnInit() {
        this.loadSettings();
    }
    get strategyFields() {
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
    get runtimeStatus() {
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
    get selectionRiskSettings() {
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
    get runtimeFlags() {
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
    get notificationSettings() {
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
    get logs() {
        return this.settingsLogs.map((entry, index) => ({
            time: entry.at || `#${index + 1}`,
            level: this.logLevel(entry.level),
            message: `[${entry.source}] ${entry.message}`
        }));
    }
    validateCurrentSettings() {
        if (!this.settings) {
            return;
        }
        this.validating = true;
        this.settingsApi.validateSettings({ settings: {} }).subscribe({
            next: (result) => {
                this.validationResult = result;
                this.validating = false;
            },
            error: (error) => {
                this.error = error instanceof Error ? error.message : 'Unable to validate settings.';
                this.validating = false;
            }
        });
    }
    loadSettings() {
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
            error: (error) => {
                this.error = error instanceof Error ? error.message : 'Unable to load settings.';
                this.loading = false;
            }
        });
    }
    toneForIntegration(status) {
        if (['configured', 'enabled'].includes(status)) {
            return 'success';
        }
        if (['missing', 'disabled'].includes(status)) {
            return 'warning';
        }
        return 'default';
    }
    logLevel(level) {
        if (level === 'error') {
            return 'danger';
        }
        if (level === 'success' || level === 'warning') {
            return level;
        }
        return 'info';
    }
    value(value) {
        if (value === null || value === undefined || value === '') {
            return '—';
        }
        return String(value);
    }
    bool(value) {
        return value ? 'true' : 'false';
    }
    nullableBool(value) {
        if (value === null || value === undefined) {
            return 'not configured';
        }
        return this.bool(value);
    }
    static { this.ɵfac = function SettingsPage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SettingsPage)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SettingsPage, selectors: [["ba-settings-page"]], decls: 10, vars: 3, consts: [["eyebrow", "System Configuration", "title", "Global Settings", "subtitle", "Configuration globale r\u00E9elle du runtime BetAuto."], [1, "flex", "flex-wrap", "gap-2"], ["type", "button", "disabled", "", "title", "Settings writes are disabled until a persistence contract exists.", 1, "ba-tool", "border-border/60", "text-muted"], ["type", "button", 1, "ba-tool", 3, "click", "disabled"], ["label", "Settings API error", 3, "message"], ["label", "No settings available", "message", "Runtime settings could not be loaded."], [1, "p-4"], ["message", "Loading runtime settings..."], [1, "mb-4", "rounded-card", "border", "border-warning/30", "bg-warning/10", "p-4"], [1, "flex", "flex-col", "gap-3", "md:flex-row", "md:items-center", "md:justify-between"], [1, "ba-label", "text-warning"], [1, "mt-1", "text-sm", "text-muted"], ["label", "read-only", "tone", "warning"], [1, "mt-3", "rounded-card", "border", "border-border/60", "bg-background/60", "p-3", "text-sm", "text-muted"], [1, "grid", "gap-4", "xl:grid-cols-[1.15fr_0.85fr]"], [1, "ba-card-header"], [1, "ba-label"], [1, "mt-1", "text-sm", "font-semibold", "text-text"], [1, "grid", "gap-4", "p-4", "md:grid-cols-2"], [3, "label", "hint"], [1, "ba-card-header", "flex", "items-center", "justify-between", "gap-4"], ["tone", "warning", 3, "label"], [1, "grid", "gap-4", "p-4", "sm:grid-cols-2", "xl:grid-cols-1"], [3, "label", "value", "status", "tone"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-3"], [1, "space-y-3", "p-4"], [1, "flex", "items-start", "justify-between", "gap-4", "rounded-card", "border", "border-border/60", "bg-background/60", "p-3"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-[0.9fr_1.1fr]"], ["label", "Config logs", "title", "Configuration audit trail", "emptyMessage", "No settings logs available.", 3, "entries"], [1, "mt-1"], [1, "mt-1", "text-warning"], [1, "mt-1", "text-danger"], ["type", "text", "readonly", "", 1, "ba-tool", "w-full", "font-data", "text-muted", 3, "value"], [1, "ba-data", "mt-2", "text-text"], [3, "label", "tone"], [1, "text-sm", "font-medium", "text-text"], [1, "mt-1", "text-xs", "text-muted"], [1, "mt-1", "font-data", "text-[11px]", "text-muted"]], template: function SettingsPage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "ba-page-header", 0)(1, "div", 1)(2, "button", 2);
            i0.ɵɵtext(3, " Save Changes disabled ");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "button", 3);
            i0.ɵɵlistener("click", function SettingsPage_Template_button_click_4_listener() { return ctx.validateCurrentSettings(); });
            i0.ɵɵtext(5);
            i0.ɵɵelementEnd()()();
            i0.ɵɵconditionalCreate(6, SettingsPage_Conditional_6_Template, 3, 0, "ba-section-card")(7, SettingsPage_Conditional_7_Template, 1, 1, "ba-error-state", 4)(8, SettingsPage_Conditional_8_Template, 1, 0, "ba-empty-state", 5)(9, SettingsPage_Conditional_9_Template, 69, 4);
        } if (rf & 2) {
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("disabled", ctx.validating);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1(" ", ctx.validating ? "Validating..." : "Validate", " ");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.loading ? 6 : ctx.error ? 7 : !ctx.settings ? 8 : 9);
        } }, dependencies: [EmptyStateComponent,
            ErrorStateComponent,
            FormFieldComponent,
            KpiCardComponent,
            LoadingStateComponent,
            LogConsoleComponent,
            PageHeaderComponent,
            SectionCardComponent,
            StatusBadgeComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SettingsPage, [{
        type: Component,
        args: [{
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
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SettingsPage, { className: "SettingsPage", filePath: "src/app/features/settings/settings.page.ts", lineNumber: 236 }); })();
//# sourceMappingURL=settings.page.js.map
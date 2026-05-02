import { Component } from '@angular/core';
import { AgentCardComponent } from '../../shared/ui/agent-card/agent-card.component';
import { CalibrationPanelComponent } from '../../shared/ui/calibration-panel/calibration-panel.component';
import { ChartCardComponent } from '../../shared/ui/chart-card/chart-card.component';
import { DataTableComponent } from '../../shared/ui/data-table/data-table.component';
import { EmptyStateComponent } from '../../shared/ui/empty-state/empty-state.component';
import { ErrorStateComponent } from '../../shared/ui/error-state/error-state.component';
import { FormFieldComponent } from '../../shared/ui/form-field/form-field.component';
import { KpiCardComponent } from '../../shared/ui/kpi-card/kpi-card.component';
import { LoadingStateComponent } from '../../shared/ui/loading-state/loading-state.component';
import { LogConsoleComponent } from '../../shared/ui/log-console/log-console.component';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { QuotaGaugeComponent } from '../../shared/ui/quota-gauge/quota-gauge.component';
import { RiskCardComponent } from '../../shared/ui/risk-card/risk-card.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import { StatusBadgeComponent } from '../../shared/ui/status-badge/status-badge.component';
import { TicketCardComponent } from '../../shared/ui/ticket-card/ticket-card.component';
import { TimelineComponent } from '../../shared/ui/timeline/timeline.component';
import * as i0 from "@angular/core";
export class DesignSystemPage {
    constructor() {
        this.chartPoints = [
            { label: 'Mon', value: 42 },
            { label: 'Tue', value: 58 },
            { label: 'Wed', value: 49 },
            { label: 'Thu', value: 76 },
            { label: 'Fri', value: 68 }
        ];
        this.tableColumns = [
            { key: 'id', label: 'Scan', data: true },
            { key: 'market', label: 'Market' },
            { key: 'eta', label: 'ETA', align: 'right', data: true }
        ];
        this.tableRows = [
            { cells: { id: 'SCAN-1082', market: 'Football totals', eta: '02:14' }, status: 'Live', statusTone: 'live' },
            { cells: { id: 'SCAN-1083', market: 'Tennis props', eta: '08:40' }, status: 'Queued', statusTone: 'default' },
            { cells: { id: 'SCAN-1084', market: 'Basketball spread', eta: '12:05' }, status: 'Watch', statusTone: 'warning' }
        ];
        this.timelineItems = [
            { title: 'Scan created', meta: '09:42', description: 'Scheduled by model policy.', tone: 'success' },
            { title: 'Provider wait', meta: '09:45', description: 'Awaiting odds refresh.', tone: 'warning' },
            { title: 'Agent assigned', meta: '09:48', description: 'Browser Agent 03 is active.', tone: 'live' }
        ];
        this.logEntries = [
            { time: '09:42', level: 'info', message: 'Scan queued' },
            { time: '09:44', level: 'success', message: 'Provider session opened' },
            { time: '09:45', level: 'warning', message: 'Quota at 72%' }
        ];
        this.calibrationMetrics = [
            { label: 'Brier', value: '0.184', hint: 'Lower is better' },
            { label: 'CLV hit', value: '61.2%', hint: 'Last 7 days' },
            { label: 'Drift', value: 'Low', hint: 'Stable input mix' }
        ];
    }
    static { this.ɵfac = function DesignSystemPage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DesignSystemPage)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DesignSystemPage, selectors: [["ba-design-system-page"]], decls: 34, vars: 9, consts: [["eyebrow", "Design system", "title", "BetAuto Analytical Interface", "subtitle", "Internal preview for the Angular/Tailwind components derived from the Stitch MCP audit."], ["label", "Internal", "tone", "live"], [1, "grid", "gap-4", "lg:grid-cols-4"], ["label", "Signals", "value", "128", "status", "Live", "tone", "live", "delta", "+12.4%", "deltaTone", "success"], ["label", "Exposure", "value", "18.2%", "status", "Watch", "tone", "warning", "delta", "+2.1%", "deltaTone", "warning"], ["label", "API quota", "caption", "Daily usage window", 3, "used", "limit"], ["label", "Risk limit", "value", "$4,820", "status", "Stable", "tone", "success", "description", "Exposure remains inside configured bankroll limits.", 3, "exposure"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-2"], ["label", "Performance", "title", "Signal quality", "value", "91.8%", "caption", "Compact bar preview; production screens can replace the body with a charting library.", 3, "points"], ["title", "Scheduled scans", "subtitle", "Dense rows with horizontal separators and status slot.", 3, "columns", "rows"], [1, "mt-4", "grid", "gap-4", "xl:grid-cols-3"], ["title", "PSG moneyline", "market", "Football / Ligue 1", "status", "AI proposal", "tone", "default", "odds", "1.74", "confidence", "72%", "stake", "1.2u", "summary", "Reusable proposal card for future ticket screens."], ["name", "Browser Agent 03", "role", "Browser-use", "status", "Live", "tone", "live", "currentJob", "Odds reconciliation", "lastEvent", "Navigation completed"], ["title", "Queue timeline", 3, "items"], ["title", "Browser-use monitoring", 3, "entries"], [3, "metrics"], [1, "ba-card-header"], [1, "text-sm", "font-semibold", "text-text"], [1, "space-y-4", "p-4"], ["label", "Risk threshold", "hint", "Uses the shared tool input surface."], ["value", "12%", "aria-label", "Risk threshold", 1, "ba-tool", "w-full"], ["label", "Provider", "error", "Example validation state."], ["aria-label", "Provider", 1, "ba-tool", "w-full"], ["label", "No tickets", "message", "Empty states inherit BetAuto surfaces and borders."], ["message", "Synchronizing agent telemetry..."], ["label", "Quota warning", "message", "The warning body can be used for API or provider issues."]], template: function DesignSystemPage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "ba-page-header", 0);
            i0.ɵɵelement(1, "ba-status-badge", 1);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(2, "div", 2);
            i0.ɵɵelement(3, "ba-kpi-card", 3)(4, "ba-kpi-card", 4)(5, "ba-quota-gauge", 5)(6, "ba-risk-card", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(7, "div", 7);
            i0.ɵɵelement(8, "ba-chart-card", 8)(9, "ba-data-table", 9);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(10, "div", 10);
            i0.ɵɵelement(11, "ba-ticket-card", 11)(12, "ba-agent-card", 12)(13, "ba-timeline", 13);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(14, "div", 7);
            i0.ɵɵelement(15, "ba-log-console", 14)(16, "ba-calibration-panel", 15);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "div", 7)(18, "ba-section-card")(19, "div", 16)(20, "h3", 17);
            i0.ɵɵtext(21, "Forms");
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(22, "div", 18)(23, "ba-form-field", 19);
            i0.ɵɵelement(24, "input", 20);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(25, "ba-form-field", 21)(26, "select", 22)(27, "option");
            i0.ɵɵtext(28, "Primary odds feed");
            i0.ɵɵelementEnd()()()()();
            i0.ɵɵelementStart(29, "ba-section-card")(30, "div", 18);
            i0.ɵɵelement(31, "ba-empty-state", 23)(32, "ba-loading-state", 24)(33, "ba-error-state", 25);
            i0.ɵɵelementEnd()()();
        } if (rf & 2) {
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("used", 72)("limit", 100);
            i0.ɵɵadvance();
            i0.ɵɵproperty("exposure", 42);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("points", ctx.chartPoints);
            i0.ɵɵadvance();
            i0.ɵɵproperty("columns", ctx.tableColumns)("rows", ctx.tableRows);
            i0.ɵɵadvance(4);
            i0.ɵɵproperty("items", ctx.timelineItems);
            i0.ɵɵadvance(2);
            i0.ɵɵproperty("entries", ctx.logEntries);
            i0.ɵɵadvance();
            i0.ɵɵproperty("metrics", ctx.calibrationMetrics);
        } }, dependencies: [AgentCardComponent,
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
            TimelineComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DesignSystemPage, [{
        type: Component,
        args: [{
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
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(DesignSystemPage, { className: "DesignSystemPage", filePath: "src/app/features/design-system/design-system.page.ts", lineNumber: 131 }); })();
//# sourceMappingURL=design-system.page.js.map
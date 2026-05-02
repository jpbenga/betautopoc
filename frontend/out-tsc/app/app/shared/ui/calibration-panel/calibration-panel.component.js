import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.label;
function CalibrationPanelComponent_For_8_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p", 8);
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const metric_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(metric_r2.hint);
} }
function CalibrationPanelComponent_For_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "div", 5)(1, "p", 2);
    i0.ɵɵtext(2);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(3, "p", 7);
    i0.ɵɵtext(4);
    i0.ɵɵdomElementEnd();
    i0.ɵɵconditionalCreate(5, CalibrationPanelComponent_For_8_Conditional_5_Template, 2, 1, "p", 8);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const metric_r2 = ctx.$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(metric_r2.label);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(metric_r2.value);
    i0.ɵɵadvance();
    i0.ɵɵconditional(metric_r2.hint ? 5 : -1);
} }
function CalibrationPanelComponent_ForEmpty_9_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p", 6);
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.emptyMessage);
} }
export class CalibrationPanelComponent {
    constructor() {
        this.label = 'AI calibration';
        this.title = 'Model health';
        this.metrics = [];
        this.emptyMessage = 'No calibration metrics.';
    }
    static { this.ɵfac = function CalibrationPanelComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || CalibrationPanelComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: CalibrationPanelComponent, selectors: [["ba-calibration-panel"]], inputs: { label: "label", title: "title", metrics: "metrics", emptyMessage: "emptyMessage" }, decls: 10, vars: 3, consts: [[1, "ba-card", "overflow-hidden"], [1, "ba-card-header"], [1, "ba-label"], [1, "mt-1", "text-sm", "font-semibold", "text-text"], [1, "grid", "gap-3", "p-4", "sm:grid-cols-3"], [1, "rounded-card", "border", "border-border/60", "bg-background/60", "p-3"], [1, "text-sm", "text-muted"], [1, "ba-data", "mt-2", "text-lg", "text-accent"], [1, "mt-1", "text-xs", "text-muted"]], template: function CalibrationPanelComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "section", 0)(1, "div", 1)(2, "p", 2);
            i0.ɵɵtext(3);
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(4, "h3", 3);
            i0.ɵɵtext(5);
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElementStart(6, "div", 4);
            i0.ɵɵrepeaterCreate(7, CalibrationPanelComponent_For_8_Template, 6, 3, "div", 5, _forTrack0, false, CalibrationPanelComponent_ForEmpty_9_Template, 2, 1, "p", 6);
            i0.ɵɵdomElementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.label);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.title);
            i0.ɵɵadvance(2);
            i0.ɵɵrepeater(ctx.metrics);
        } }, encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(CalibrationPanelComponent, [{
        type: Component,
        args: [{
                selector: 'ba-calibration-panel',
                standalone: true,
                template: `
    <section class="ba-card overflow-hidden">
      <div class="ba-card-header">
        <p class="ba-label">{{ label }}</p>
        <h3 class="mt-1 text-sm font-semibold text-text">{{ title }}</h3>
      </div>
      <div class="grid gap-3 p-4 sm:grid-cols-3">
        @for (metric of metrics; track metric.label) {
          <div class="rounded-card border border-border/60 bg-background/60 p-3">
            <p class="ba-label">{{ metric.label }}</p>
            <p class="ba-data mt-2 text-lg text-accent">{{ metric.value }}</p>
            @if (metric.hint) {
              <p class="mt-1 text-xs text-muted">{{ metric.hint }}</p>
            }
          </div>
        } @empty {
          <p class="text-sm text-muted">{{ emptyMessage }}</p>
        }
      </div>
    </section>
  `
            }]
    }], null, { label: [{
            type: Input
        }], title: [{
            type: Input
        }], metrics: [{
            type: Input
        }], emptyMessage: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(CalibrationPanelComponent, { className: "CalibrationPanelComponent", filePath: "src/app/shared/ui/calibration-panel/calibration-panel.component.ts", lineNumber: 34 }); })();
//# sourceMappingURL=calibration-panel.component.js.map
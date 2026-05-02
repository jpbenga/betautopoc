import { Component, Input } from '@angular/core';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import * as i0 from "@angular/core";
function RiskCardComponent_Conditional_10_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 7);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.description);
} }
export class RiskCardComponent {
    constructor() {
        this.label = 'Risk';
        this.value = '-';
        this.status = 'Stable';
        this.tone = 'default';
        this.exposure = 0;
        this.description = '';
    }
    get barClass() {
        if (this.tone === 'danger') {
            return 'bg-danger';
        }
        if (this.tone === 'warning') {
            return 'bg-warning';
        }
        return 'bg-success';
    }
    static { this.ɵfac = function RiskCardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || RiskCardComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: RiskCardComponent, selectors: [["ba-risk-card"]], inputs: { label: "label", value: "value", status: "status", tone: "tone", exposure: "exposure", description: "description" }, decls: 11, vars: 9, consts: [[1, "ba-card", "p-4"], [1, "flex", "items-start", "justify-between", "gap-4"], [1, "ba-label"], [1, "mt-2", "font-data", "text-2xl", "font-semibold", "text-text"], [3, "label", "tone"], [1, "mt-4", "h-2", "overflow-hidden", "rounded-full", "bg-background"], [1, "h-full", "rounded-full"], [1, "mt-3", "text-sm", "text-muted"]], template: function RiskCardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "article", 0)(1, "div", 1)(2, "div")(3, "p", 2);
            i0.ɵɵtext(4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "p", 3);
            i0.ɵɵtext(6);
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(7, "ba-status-badge", 4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "div", 5);
            i0.ɵɵelement(9, "div", 6);
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(10, RiskCardComponent_Conditional_10_Template, 2, 1, "p", 7);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(ctx.label);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.value);
            i0.ɵɵadvance();
            i0.ɵɵproperty("label", ctx.status)("tone", ctx.tone);
            i0.ɵɵadvance(2);
            i0.ɵɵclassMap(ctx.barClass);
            i0.ɵɵstyleProp("width", ctx.exposure, "%");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.description ? 10 : -1);
        } }, dependencies: [StatusBadgeComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(RiskCardComponent, [{
        type: Component,
        args: [{
                selector: 'ba-risk-card',
                standalone: true,
                imports: [StatusBadgeComponent],
                template: `
    <article class="ba-card p-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="ba-label">{{ label }}</p>
          <p class="mt-2 font-data text-2xl font-semibold text-text">{{ value }}</p>
        </div>
        <ba-status-badge [label]="status" [tone]="tone"></ba-status-badge>
      </div>
      <div class="mt-4 h-2 overflow-hidden rounded-full bg-background">
        <div class="h-full rounded-full" [class]="barClass" [style.width.%]="exposure"></div>
      </div>
      @if (description) {
        <p class="mt-3 text-sm text-muted">{{ description }}</p>
      }
    </article>
  `
            }]
    }], null, { label: [{
            type: Input
        }], value: [{
            type: Input
        }], status: [{
            type: Input
        }], tone: [{
            type: Input
        }], exposure: [{
            type: Input
        }], description: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(RiskCardComponent, { className: "RiskCardComponent", filePath: "src/app/shared/ui/risk-card/risk-card.component.ts", lineNumber: 26 }); })();
//# sourceMappingURL=risk-card.component.js.map
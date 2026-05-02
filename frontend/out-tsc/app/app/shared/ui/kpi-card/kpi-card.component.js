import { Component, Input } from '@angular/core';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import * as i0 from "@angular/core";
function KpiCardComponent_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-status-badge", 3);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵproperty("label", ctx_r0.status)("tone", ctx_r0.tone);
} }
function KpiCardComponent_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 6);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵclassMap(ctx_r0.deltaClass);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.delta);
} }
export class KpiCardComponent {
    constructor() {
        this.label = '';
        this.value = '';
        this.status = '';
        this.tone = 'default';
        this.delta = '';
        this.deltaTone = 'muted';
    }
    get deltaClass() {
        const map = {
            muted: 'text-muted',
            success: 'text-success',
            warning: 'text-warning',
            danger: 'text-danger'
        };
        return map[this.deltaTone];
    }
    static { this.ɵfac = function KpiCardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || KpiCardComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: KpiCardComponent, selectors: [["ba-kpi-card"]], inputs: { label: "label", value: "value", status: "status", tone: "tone", delta: "delta", deltaTone: "deltaTone" }, decls: 8, vars: 4, consts: [[1, "ba-card", "p-4", "transition", "hover:border-outline/70"], [1, "flex", "items-center", "justify-between"], [1, "ba-label"], [3, "label", "tone"], [1, "mt-3", "font-data", "text-2xl", "font-semibold", "leading-8", "text-text"], [1, "mt-1", "text-xs", 3, "class"], [1, "mt-1", "text-xs"]], template: function KpiCardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "article", 0)(1, "div", 1)(2, "h3", 2);
            i0.ɵɵtext(3);
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(4, KpiCardComponent_Conditional_4_Template, 1, 2, "ba-status-badge", 3);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "p", 4);
            i0.ɵɵtext(6);
            i0.ɵɵelementEnd();
            i0.ɵɵconditionalCreate(7, KpiCardComponent_Conditional_7_Template, 2, 3, "p", 5);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(3);
            i0.ɵɵtextInterpolate(ctx.label);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.status ? 4 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.value);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.delta ? 7 : -1);
        } }, dependencies: [StatusBadgeComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(KpiCardComponent, [{
        type: Component,
        args: [{
                selector: 'ba-kpi-card',
                standalone: true,
                imports: [StatusBadgeComponent],
                template: `
    <article class="ba-card p-4 transition hover:border-outline/70">
      <div class="flex items-center justify-between">
        <h3 class="ba-label">{{ label }}</h3>
        @if (status) {
          <ba-status-badge [label]="status" [tone]="tone"></ba-status-badge>
        }
      </div>
      <p class="mt-3 font-data text-2xl font-semibold leading-8 text-text">{{ value }}</p>
      @if (delta) {
        <p class="mt-1 text-xs" [class]="deltaClass">{{ delta }}</p>
      }
    </article>
  `
            }]
    }], null, { label: [{
            type: Input,
            args: [{ required: true }]
        }], value: [{
            type: Input,
            args: [{ required: true }]
        }], status: [{
            type: Input
        }], tone: [{
            type: Input
        }], delta: [{
            type: Input
        }], deltaTone: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(KpiCardComponent, { className: "KpiCardComponent", filePath: "src/app/shared/ui/kpi-card/kpi-card.component.ts", lineNumber: 24 }); })();
//# sourceMappingURL=kpi-card.component.js.map
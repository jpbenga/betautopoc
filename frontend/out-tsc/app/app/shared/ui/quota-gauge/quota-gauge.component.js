import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
function QuotaGaugeComponent_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p", 7);
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.caption);
} }
export class QuotaGaugeComponent {
    constructor() {
        this.label = 'Quota';
        this.used = 0;
        this.limit = 100;
        this.caption = '';
    }
    get percent() {
        if (this.limit <= 0) {
            return 0;
        }
        return Math.min(100, Math.round((this.used / this.limit) * 100));
    }
    get toneClass() {
        if (this.percent >= 90) {
            return 'border-danger/40 bg-danger/10 text-danger';
        }
        if (this.percent >= 70) {
            return 'border-warning/40 bg-warning/10 text-warning';
        }
        return 'border-success/40 bg-success/10 text-success';
    }
    get barClass() {
        if (this.percent >= 90) {
            return 'bg-danger';
        }
        if (this.percent >= 70) {
            return 'bg-warning';
        }
        return 'bg-accent';
    }
    static { this.ɵfac = function QuotaGaugeComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || QuotaGaugeComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: QuotaGaugeComponent, selectors: [["ba-quota-gauge"]], inputs: { label: "label", used: "used", limit: "limit", caption: "caption" }, decls: 12, vars: 11, consts: [[1, "ba-card", "p-4"], [1, "flex", "items-start", "justify-between", "gap-4"], [1, "ba-label"], [1, "mt-2", "font-data", "text-2xl", "font-semibold", "text-text"], [1, "rounded-full", "border", "px-2", "py-1", "text-xs"], [1, "mt-4", "h-2", "overflow-hidden", "rounded-full", "bg-background"], [1, "h-full", "rounded-full", "transition-all"], [1, "mt-3", "text-xs", "text-muted"]], template: function QuotaGaugeComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "section", 0)(1, "div", 1)(2, "div")(3, "p", 2);
            i0.ɵɵtext(4);
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(5, "p", 3);
            i0.ɵɵtext(6);
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElementStart(7, "span", 4);
            i0.ɵɵtext(8);
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElementStart(9, "div", 5);
            i0.ɵɵdomElement(10, "div", 6);
            i0.ɵɵdomElementEnd();
            i0.ɵɵconditionalCreate(11, QuotaGaugeComponent_Conditional_11_Template, 2, 1, "p", 7);
            i0.ɵɵdomElementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(ctx.label);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate2("", ctx.used, " / ", ctx.limit);
            i0.ɵɵadvance();
            i0.ɵɵclassMap(ctx.toneClass);
            i0.ɵɵadvance();
            i0.ɵɵtextInterpolate1("", ctx.percent, "%");
            i0.ɵɵadvance(2);
            i0.ɵɵclassMap(ctx.barClass);
            i0.ɵɵstyleProp("width", ctx.percent, "%");
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.caption ? 11 : -1);
        } }, encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(QuotaGaugeComponent, [{
        type: Component,
        args: [{
                selector: 'ba-quota-gauge',
                standalone: true,
                template: `
    <section class="ba-card p-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="ba-label">{{ label }}</p>
          <p class="mt-2 font-data text-2xl font-semibold text-text">{{ used }} / {{ limit }}</p>
        </div>
        <span class="rounded-full border px-2 py-1 text-xs" [class]="toneClass">{{ percent }}%</span>
      </div>
      <div class="mt-4 h-2 overflow-hidden rounded-full bg-background">
        <div class="h-full rounded-full transition-all" [class]="barClass" [style.width.%]="percent"></div>
      </div>
      @if (caption) {
        <p class="mt-3 text-xs text-muted">{{ caption }}</p>
      }
    </section>
  `
            }]
    }], null, { label: [{
            type: Input
        }], used: [{
            type: Input
        }], limit: [{
            type: Input
        }], caption: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(QuotaGaugeComponent, { className: "QuotaGaugeComponent", filePath: "src/app/shared/ui/quota-gauge/quota-gauge.component.ts", lineNumber: 24 }); })();
//# sourceMappingURL=quota-gauge.component.js.map
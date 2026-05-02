import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.label;
function ChartCardComponent_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p", 4);
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.value);
} }
function ChartCardComponent_For_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "div", 7);
    i0.ɵɵdomElement(1, "div", 10);
    i0.ɵɵdomElementStart(2, "span", 11);
    i0.ɵɵtext(3);
    i0.ɵɵdomElementEnd()();
} if (rf & 2) {
    const point_r2 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵstyleProp("height", ctx_r0.barHeight(point_r2.value), "%");
    i0.ɵɵdomProperty("title", point_r2.label + ": " + point_r2.value);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(point_r2.label);
} }
function ChartCardComponent_ForEmpty_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "div", 8);
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.emptyMessage, " ");
} }
function ChartCardComponent_Conditional_13_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p", 9);
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.caption);
} }
export class ChartCardComponent {
    constructor() {
        this.label = 'Analytics';
        this.title = '';
        this.value = '';
        this.caption = '';
        this.points = [];
        this.emptyMessage = 'No chart data.';
    }
    barHeight(value) {
        const values = this.points.map((point) => point.value);
        const max = Math.max(...values, 1);
        return Math.max(8, Math.round((value / max) * 100));
    }
    static { this.ɵfac = function ChartCardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ChartCardComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ChartCardComponent, selectors: [["ba-chart-card"]], inputs: { label: "label", title: "title", value: "value", caption: "caption", points: "points", emptyMessage: "emptyMessage" }, decls: 14, vars: 5, consts: [[1, "ba-card", "overflow-hidden"], [1, "ba-card-header", "flex", "items-center", "justify-between", "gap-4"], [1, "ba-label"], [1, "mt-1", "text-sm", "font-semibold", "text-text"], [1, "ba-data", "text-lg", "text-accent"], [1, "p-4"], [1, "flex", "h-40", "items-end", "gap-2", "rounded-card", "border", "border-border/50", "bg-background/70", "p-3"], [1, "flex", "min-w-0", "flex-1", "flex-col", "items-center", "gap-2"], [1, "flex", "h-full", "w-full", "items-center", "justify-center", "text-sm", "text-muted"], [1, "mt-3", "text-xs", "text-muted"], [1, "w-full", "rounded-t-sm", "bg-gradient-to-t", "from-accent-strong/40", "to-accent", "shadow-glow", 3, "title"], [1, "max-w-full", "truncate", "text-[10px]", "text-muted"]], template: function ChartCardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "section", 0)(1, "div", 1)(2, "div")(3, "p", 2);
            i0.ɵɵtext(4);
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(5, "h3", 3);
            i0.ɵɵtext(6);
            i0.ɵɵdomElementEnd()();
            i0.ɵɵconditionalCreate(7, ChartCardComponent_Conditional_7_Template, 2, 1, "p", 4);
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(8, "div", 5)(9, "div", 6);
            i0.ɵɵrepeaterCreate(10, ChartCardComponent_For_11_Template, 4, 4, "div", 7, _forTrack0, false, ChartCardComponent_ForEmpty_12_Template, 2, 1, "div", 8);
            i0.ɵɵdomElementEnd();
            i0.ɵɵconditionalCreate(13, ChartCardComponent_Conditional_13_Template, 2, 1, "p", 9);
            i0.ɵɵdomElementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(ctx.label);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.title);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.value ? 7 : -1);
            i0.ɵɵadvance(3);
            i0.ɵɵrepeater(ctx.points);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.caption ? 13 : -1);
        } }, encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ChartCardComponent, [{
        type: Component,
        args: [{
                selector: 'ba-chart-card',
                standalone: true,
                template: `
    <section class="ba-card overflow-hidden">
      <div class="ba-card-header flex items-center justify-between gap-4">
        <div>
          <p class="ba-label">{{ label }}</p>
          <h3 class="mt-1 text-sm font-semibold text-text">{{ title }}</h3>
        </div>
        @if (value) {
          <p class="ba-data text-lg text-accent">{{ value }}</p>
        }
      </div>
      <div class="p-4">
        <div class="flex h-40 items-end gap-2 rounded-card border border-border/50 bg-background/70 p-3">
          @for (point of points; track point.label) {
            <div class="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div
                class="w-full rounded-t-sm bg-gradient-to-t from-accent-strong/40 to-accent shadow-glow"
                [style.height.%]="barHeight(point.value)"
                [title]="point.label + ': ' + point.value"
              ></div>
              <span class="max-w-full truncate text-[10px] text-muted">{{ point.label }}</span>
            </div>
          } @empty {
            <div class="flex h-full w-full items-center justify-center text-sm text-muted">
              {{ emptyMessage }}
            </div>
          }
        </div>
        @if (caption) {
          <p class="mt-3 text-xs text-muted">{{ caption }}</p>
        }
      </div>
    </section>
  `
            }]
    }], null, { label: [{
            type: Input
        }], title: [{
            type: Input
        }], value: [{
            type: Input
        }], caption: [{
            type: Input
        }], points: [{
            type: Input
        }], emptyMessage: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ChartCardComponent, { className: "ChartCardComponent", filePath: "src/app/shared/ui/chart-card/chart-card.component.ts", lineNumber: 46 }); })();
//# sourceMappingURL=chart-card.component.js.map
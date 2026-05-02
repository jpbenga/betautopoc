import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
function EmptyStateComponent_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p", 3);
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.meta);
} }
export class EmptyStateComponent {
    constructor() {
        this.label = 'Empty state';
        this.message = 'No data available yet.';
        this.meta = '';
        this.tone = 'default';
    }
    get stateClass() {
        const map = {
            default: 'border-border/80 bg-surface-low',
            success: 'border-success/30 bg-success/5',
            warning: 'border-warning/30 bg-warning/5',
            danger: 'border-danger/30 bg-danger/5',
            live: 'border-accent/30 bg-accent/5'
        };
        return map[this.tone];
    }
    static { this.ɵfac = function EmptyStateComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || EmptyStateComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: EmptyStateComponent, selectors: [["ba-empty-state"]], inputs: { label: "label", message: "message", meta: "meta", tone: "tone" }, decls: 6, vars: 5, consts: [[1, "rounded-card", "border", "border-dashed", "p-8", "text-center"], [1, "ba-label"], [1, "mt-2", "text-sm", "text-muted"], [1, "ba-data", "mt-3", "text-muted"]], template: function EmptyStateComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "div", 0)(1, "p", 1);
            i0.ɵɵtext(2);
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(3, "p", 2);
            i0.ɵɵtext(4);
            i0.ɵɵdomElementEnd();
            i0.ɵɵconditionalCreate(5, EmptyStateComponent_Conditional_5_Template, 2, 1, "p", 3);
            i0.ɵɵdomElementEnd();
        } if (rf & 2) {
            i0.ɵɵclassMap(ctx.stateClass);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.label);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.message);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.meta ? 5 : -1);
        } }, encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(EmptyStateComponent, [{
        type: Component,
        args: [{
                selector: 'ba-empty-state',
                standalone: true,
                template: `
    <div class="rounded-card border border-dashed p-8 text-center" [class]="stateClass">
      <p class="ba-label">{{ label }}</p>
      <p class="mt-2 text-sm text-muted">{{ message }}</p>
      @if (meta) {
        <p class="ba-data mt-3 text-muted">{{ meta }}</p>
      }
    </div>
  `
            }]
    }], null, { label: [{
            type: Input
        }], message: [{
            type: Input
        }], meta: [{
            type: Input
        }], tone: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(EmptyStateComponent, { className: "EmptyStateComponent", filePath: "src/app/shared/ui/empty-state/empty-state.component.ts", lineNumber: 16 }); })();
//# sourceMappingURL=empty-state.component.js.map
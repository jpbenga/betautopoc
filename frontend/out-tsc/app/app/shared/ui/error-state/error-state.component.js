import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
export class ErrorStateComponent {
    constructor() {
        this.label = 'Error';
        this.message = 'An unexpected error occurred.';
    }
    static { this.ɵfac = function ErrorStateComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ErrorStateComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ErrorStateComponent, selectors: [["ba-error-state"]], inputs: { label: "label", message: "message" }, decls: 5, vars: 2, consts: [[1, "rounded-card", "border", "border-danger/40", "bg-danger/10", "p-4", "text-danger"], [1, "ba-label", "text-danger"], [1, "mt-2", "text-sm"]], template: function ErrorStateComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "div", 0)(1, "p", 1);
            i0.ɵɵtext(2);
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(3, "p", 2);
            i0.ɵɵtext(4);
            i0.ɵɵdomElementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.label);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.message);
        } }, encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ErrorStateComponent, [{
        type: Component,
        args: [{
                selector: 'ba-error-state',
                standalone: true,
                template: `
    <div class="rounded-card border border-danger/40 bg-danger/10 p-4 text-danger">
      <p class="ba-label text-danger">{{ label }}</p>
      <p class="mt-2 text-sm">{{ message }}</p>
    </div>
  `
            }]
    }], null, { label: [{
            type: Input
        }], message: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ErrorStateComponent, { className: "ErrorStateComponent", filePath: "src/app/shared/ui/error-state/error-state.component.ts", lineNumber: 13 }); })();
//# sourceMappingURL=error-state.component.js.map
import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
function LoadingStateComponent_Conditional_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p", 5);
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.detail);
} }
function LoadingStateComponent_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "div", 6);
    i0.ɵɵdomElement(1, "span", 7)(2, "span", 8);
    i0.ɵɵdomElementEnd();
} }
export class LoadingStateComponent {
    constructor() {
        this.message = 'Loading...';
        this.detail = '';
        this.showShimmer = false;
    }
    static { this.ɵfac = function LoadingStateComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LoadingStateComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: LoadingStateComponent, selectors: [["ba-loading-state"]], inputs: { message: "message", detail: "detail", showShimmer: "showShimmer" }, decls: 9, vars: 3, consts: [[1, "rounded-card", "border", "border-accent/20", "bg-accent/5", "p-4"], [1, "inline-flex", "items-center", "gap-2", "text-sm", "text-muted"], [1, "relative", "flex", "h-3", "w-3"], [1, "absolute", "inline-flex", "h-full", "w-full", "animate-ping", "rounded-full", "bg-accent", "opacity-30"], [1, "relative", "h-3", "w-3", "rounded-full", "bg-accent", "shadow-glow"], [1, "mt-2", "text-xs", "text-muted"], [1, "mt-4", "space-y-2"], [1, "block", "h-2", "w-full", "animate-pulse", "rounded-full", "bg-surface-high"], [1, "block", "h-2", "w-4/5", "animate-pulse", "rounded-full", "bg-surface-high"]], template: function LoadingStateComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "div", 0)(1, "div", 1)(2, "span", 2);
            i0.ɵɵdomElement(3, "span", 3)(4, "span", 4);
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(5, "span");
            i0.ɵɵtext(6);
            i0.ɵɵdomElementEnd()();
            i0.ɵɵconditionalCreate(7, LoadingStateComponent_Conditional_7_Template, 2, 1, "p", 5);
            i0.ɵɵconditionalCreate(8, LoadingStateComponent_Conditional_8_Template, 3, 0, "div", 6);
            i0.ɵɵdomElementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵtextInterpolate(ctx.message);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.detail ? 7 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showShimmer ? 8 : -1);
        } }, encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LoadingStateComponent, [{
        type: Component,
        args: [{
                selector: 'ba-loading-state',
                standalone: true,
                template: `
    <div class="rounded-card border border-accent/20 bg-accent/5 p-4">
      <div class="inline-flex items-center gap-2 text-sm text-muted">
        <span class="relative flex h-3 w-3">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-30"></span>
          <span class="relative h-3 w-3 rounded-full bg-accent shadow-glow"></span>
        </span>
        <span>{{ message }}</span>
      </div>
      @if (detail) {
        <p class="mt-2 text-xs text-muted">{{ detail }}</p>
      }
      @if (showShimmer) {
        <div class="mt-4 space-y-2">
          <span class="block h-2 w-full animate-pulse rounded-full bg-surface-high"></span>
          <span class="block h-2 w-4/5 animate-pulse rounded-full bg-surface-high"></span>
        </div>
      }
    </div>
  `
            }]
    }], null, { message: [{
            type: Input
        }], detail: [{
            type: Input
        }], showShimmer: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(LoadingStateComponent, { className: "LoadingStateComponent", filePath: "src/app/shared/ui/loading-state/loading-state.component.ts", lineNumber: 27 }); })();
//# sourceMappingURL=loading-state.component.js.map
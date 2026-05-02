import { Component } from '@angular/core';
import * as i0 from "@angular/core";
export class TopbarComponent {
    static { this.ɵfac = function TopbarComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TopbarComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: TopbarComponent, selectors: [["ba-topbar"]], decls: 9, vars: 0, consts: [[1, "flex", "min-h-14", "min-w-0", "items-center", "justify-between", "gap-3", "border-b", "border-border/70", "bg-surface-low/80", "px-3", "py-2", "backdrop-blur", "sm:px-4"], [1, "min-w-0"], [1, "ba-label"], [1, "truncate", "text-sm", "font-medium", "text-text"], [1, "inline-flex", "shrink-0", "items-center", "gap-2", "rounded-full", "border", "border-success/30", "bg-success/10", "px-2", "py-1", "text-xs", "text-success"], [1, "h-1.5", "w-1.5", "rounded-full", "bg-success", "shadow-glow-success"]], template: function TopbarComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "header", 0)(1, "div", 1)(2, "p", 2);
            i0.ɵɵtext(3, "BetAuto");
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(4, "h1", 3);
            i0.ɵɵtext(5, "Operations Dashboard");
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElementStart(6, "span", 4);
            i0.ɵɵdomElement(7, "span", 5);
            i0.ɵɵtext(8, " Foundations mode ");
            i0.ɵɵdomElementEnd()();
        } }, encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TopbarComponent, [{
        type: Component,
        args: [{
                selector: 'ba-topbar',
                standalone: true,
                template: `
    <header class="flex min-h-14 min-w-0 items-center justify-between gap-3 border-b border-border/70 bg-surface-low/80 px-3 py-2 backdrop-blur sm:px-4">
      <div class="min-w-0">
        <p class="ba-label">BetAuto</p>
        <h1 class="truncate text-sm font-medium text-text">Operations Dashboard</h1>
      </div>
      <span class="inline-flex shrink-0 items-center gap-2 rounded-full border border-success/30 bg-success/10 px-2 py-1 text-xs text-success">
        <span class="h-1.5 w-1.5 rounded-full bg-success shadow-glow-success"></span>
        Foundations mode
      </span>
    </header>
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(TopbarComponent, { className: "TopbarComponent", filePath: "src/app/layout/topbar/topbar.component.ts", lineNumber: 19 }); })();
//# sourceMappingURL=topbar.component.js.map
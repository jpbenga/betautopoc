import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.id || $item.time + $item.message;
function LogConsoleComponent_For_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p", 9)(1, "span", 8);
    i0.ɵɵtext(2);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(3, "span");
    i0.ɵɵtext(4);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(5, "span", 10);
    i0.ɵɵtext(6);
    i0.ɵɵdomElementEnd()();
} if (rf & 2) {
    const entry_r2 = ctx.$implicit;
    const ɵ$index_18_r3 = ctx.$index;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵclassProp("bg-accent/10", ctx_r0.highlightNewest && ɵ$index_18_r3 === 0)("ring-1", ctx_r0.highlightNewest && ɵ$index_18_r3 === 0)("ring-accent/20", ctx_r0.highlightNewest && ɵ$index_18_r3 === 0);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(entry_r2.time);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r0.levelClass(entry_r2.level));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(entry_r2.level);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(entry_r2.message);
} }
function LogConsoleComponent_ForEmpty_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p", 8);
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.emptyMessage);
} }
export class LogConsoleComponent {
    constructor() {
        this.label = 'Console';
        this.title = 'Operational log';
        this.entries = [];
        this.emptyMessage = 'No events recorded.';
        this.highlightNewest = false;
    }
    levelClass(level) {
        const map = {
            info: 'text-accent',
            success: 'text-success',
            warning: 'text-warning',
            danger: 'text-danger'
        };
        return map[level];
    }
    static { this.ɵfac = function LogConsoleComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || LogConsoleComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: LogConsoleComponent, selectors: [["ba-log-console"]], inputs: { label: "label", title: "title", entries: "entries", emptyMessage: "emptyMessage", highlightNewest: "highlightNewest" }, decls: 13, vars: 4, consts: [[1, "ba-card", "min-w-0", "overflow-hidden"], [1, "ba-card-header", "flex", "items-center", "justify-between", "gap-3"], [1, "min-w-0"], [1, "ba-label"], [1, "mt-1", "truncate", "text-sm", "font-semibold", "text-text"], [1, "ba-data", "shrink-0", "text-muted"], [1, "max-h-72", "space-y-2", "overflow-auto", "bg-background/80", "p-4", "font-data", "text-xs"], [1, "grid", "gap-1", "rounded-tool", "px-2", "py-1", "sm:grid-cols-[72px_72px_minmax(0,1fr)]", "sm:gap-3", 3, "bg-accent/10", "ring-1", "ring-accent/20"], [1, "text-muted"], [1, "grid", "gap-1", "rounded-tool", "px-2", "py-1", "sm:grid-cols-[72px_72px_minmax(0,1fr)]", "sm:gap-3"], [1, "min-w-0", "break-words", "text-text"]], template: function LogConsoleComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "section", 0)(1, "div", 1)(2, "div", 2)(3, "p", 3);
            i0.ɵɵtext(4);
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(5, "h3", 4);
            i0.ɵɵtext(6);
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElementStart(7, "span", 5);
            i0.ɵɵtext(8);
            i0.ɵɵdomElementEnd()();
            i0.ɵɵdomElementStart(9, "div", 6);
            i0.ɵɵrepeaterCreate(10, LogConsoleComponent_For_11_Template, 7, 11, "p", 7, _forTrack0, false, LogConsoleComponent_ForEmpty_12_Template, 2, 1, "p", 8);
            i0.ɵɵdomElementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(ctx.label);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.title);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate1("", ctx.entries.length, " events");
            i0.ɵɵadvance(2);
            i0.ɵɵrepeater(ctx.entries);
        } }, encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(LogConsoleComponent, [{
        type: Component,
        args: [{
                selector: 'ba-log-console',
                standalone: true,
                template: `
    <section class="ba-card min-w-0 overflow-hidden">
      <div class="ba-card-header flex items-center justify-between gap-3">
        <div class="min-w-0">
          <p class="ba-label">{{ label }}</p>
          <h3 class="mt-1 truncate text-sm font-semibold text-text">{{ title }}</h3>
        </div>
        <span class="ba-data shrink-0 text-muted">{{ entries.length }} events</span>
      </div>
      <div class="max-h-72 space-y-2 overflow-auto bg-background/80 p-4 font-data text-xs">
        @for (entry of entries; track entry.id || entry.time + entry.message; let first = $first) {
          <p
            class="grid gap-1 rounded-tool px-2 py-1 sm:grid-cols-[72px_72px_minmax(0,1fr)] sm:gap-3"
            [class.bg-accent/10]="highlightNewest && first"
            [class.ring-1]="highlightNewest && first"
            [class.ring-accent/20]="highlightNewest && first"
          >
            <span class="text-muted">{{ entry.time }}</span>
            <span [class]="levelClass(entry.level)">{{ entry.level }}</span>
            <span class="min-w-0 break-words text-text">{{ entry.message }}</span>
          </p>
        } @empty {
          <p class="text-muted">{{ emptyMessage }}</p>
        }
      </div>
    </section>
  `
            }]
    }], null, { label: [{
            type: Input
        }], title: [{
            type: Input
        }], entries: [{
            type: Input
        }], emptyMessage: [{
            type: Input
        }], highlightNewest: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(LogConsoleComponent, { className: "LogConsoleComponent", filePath: "src/app/shared/ui/log-console/log-console.component.ts", lineNumber: 41 }); })();
//# sourceMappingURL=log-console.component.js.map
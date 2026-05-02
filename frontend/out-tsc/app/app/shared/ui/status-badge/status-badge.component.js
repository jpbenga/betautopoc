import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
function StatusBadgeComponent_Conditional_1_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElement(0, "span", 5);
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵclassMap(ctx_r0.pipClass);
} }
function StatusBadgeComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "span", 1);
    i0.ɵɵconditionalCreate(1, StatusBadgeComponent_Conditional_1_Conditional_1_Template, 1, 2, "span", 3);
    i0.ɵɵdomElement(2, "span", 4);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.pulse ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r0.pipClass);
} }
export class StatusBadgeComponent {
    constructor() {
        this.label = '';
        this.tone = 'default';
        this.pulse = false;
        this.showPip = false;
    }
    get badgeClass() {
        const map = {
            default: 'border border-border/70 bg-surface-high text-muted',
            success: 'border border-success/30 bg-success/10 text-success',
            warning: 'border border-warning/30 bg-warning/10 text-warning',
            danger: 'border border-danger/30 bg-danger/10 text-danger',
            live: 'border border-success/40 bg-success/10 text-success shadow-glow-success',
            'score-70': 'border border-[#d97d68]/40 bg-[#d97d68]/12 text-[#ffc2b5]',
            'score-75': 'border border-[#e5a155]/40 bg-[#e5a155]/12 text-[#ffd39c]',
            'score-80': 'border border-[#d4c45a]/40 bg-[#d4c45a]/12 text-[#fff0a8]',
            'score-85': 'border border-[#86c86d]/40 bg-[#86c86d]/12 text-[#ccffb8]',
            'score-90': 'border border-[#41c7a5]/40 bg-[#41c7a5]/12 text-[#b7fff0]',
            'score-95-plus': 'border border-[#4cd7f6]/50 bg-[#4cd7f6]/14 text-[#c8f6ff] shadow-glow'
        };
        return map[this.tone];
    }
    get pipClass() {
        const map = {
            default: 'bg-muted',
            success: 'bg-success shadow-glow-success',
            warning: 'bg-warning shadow-glow-warning',
            danger: 'bg-danger',
            live: 'bg-success shadow-glow-success',
            'score-70': 'bg-[#d97d68]',
            'score-75': 'bg-[#e5a155]',
            'score-80': 'bg-[#d4c45a]',
            'score-85': 'bg-[#86c86d]',
            'score-90': 'bg-[#41c7a5]',
            'score-95-plus': 'bg-[#4cd7f6] shadow-glow'
        };
        return map[this.tone];
    }
    static { this.ɵfac = function StatusBadgeComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || StatusBadgeComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: StatusBadgeComponent, selectors: [["ba-status-badge"]], inputs: { label: "label", tone: "tone", pulse: "pulse", showPip: "showPip" }, decls: 4, vars: 4, consts: [[1, "inline-flex", "max-w-full", "items-center", "gap-1.5", "rounded-full", "px-2", "py-1", "text-xs", "font-medium"], [1, "relative", "flex", "h-2", "w-2"], [1, "truncate"], [1, "absolute", "inline-flex", "h-full", "w-full", "animate-ping", "rounded-full", "opacity-40", 3, "class"], [1, "relative", "inline-flex", "h-2", "w-2", "rounded-full"], [1, "absolute", "inline-flex", "h-full", "w-full", "animate-ping", "rounded-full", "opacity-40"]], template: function StatusBadgeComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "span", 0);
            i0.ɵɵconditionalCreate(1, StatusBadgeComponent_Conditional_1_Template, 3, 3, "span", 1);
            i0.ɵɵdomElementStart(2, "span", 2);
            i0.ɵɵtext(3);
            i0.ɵɵdomElementEnd()();
        } if (rf & 2) {
            i0.ɵɵclassMap(ctx.badgeClass);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.showPip ? 1 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.label);
        } }, encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(StatusBadgeComponent, [{
        type: Component,
        args: [{
                selector: 'ba-status-badge',
                standalone: true,
                template: `
    <span class="inline-flex max-w-full items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium" [class]="badgeClass">
      @if (showPip) {
        <span class="relative flex h-2 w-2">
          @if (pulse) {
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40" [class]="pipClass"></span>
          }
          <span class="relative inline-flex h-2 w-2 rounded-full" [class]="pipClass"></span>
        </span>
      }
      <span class="truncate">{{ label }}</span>
    </span>
  `
            }]
    }], null, { label: [{
            type: Input,
            args: [{ required: true }]
        }], tone: [{
            type: Input
        }], pulse: [{
            type: Input
        }], showPip: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(StatusBadgeComponent, { className: "StatusBadgeComponent", filePath: "src/app/shared/ui/status-badge/status-badge.component.ts", lineNumber: 20 }); })();
//# sourceMappingURL=status-badge.component.js.map
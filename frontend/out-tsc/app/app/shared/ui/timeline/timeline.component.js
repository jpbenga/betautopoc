import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.id || $item.title + $item.meta;
function TimelineComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "h3", 1);
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.title);
} }
function TimelineComponent_For_4_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElement(0, "span", 6);
} }
function TimelineComponent_For_4_Conditional_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElement(0, "span", 8);
} }
function TimelineComponent_For_4_Conditional_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "div", 12)(1, "p");
    i0.ɵɵtext(2);
    i0.ɵɵdomElementEnd()();
} if (rf & 2) {
    const item_r2 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r2.description);
} }
function TimelineComponent_For_4_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "li", 3)(1, "span", 5);
    i0.ɵɵconditionalCreate(2, TimelineComponent_For_4_Conditional_2_Template, 1, 0, "span", 6);
    i0.ɵɵdomElement(3, "span", 7);
    i0.ɵɵconditionalCreate(4, TimelineComponent_For_4_Conditional_4_Template, 1, 0, "span", 8);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(5, "div")(6, "div", 9)(7, "p", 10);
    i0.ɵɵtext(8);
    i0.ɵɵdomElementEnd();
    i0.ɵɵdomElementStart(9, "time", 11);
    i0.ɵɵtext(10);
    i0.ɵɵdomElementEnd()();
    i0.ɵɵconditionalCreate(11, TimelineComponent_For_4_Conditional_11_Template, 3, 1, "div", 12);
    i0.ɵɵdomElementEnd()();
} if (rf & 2) {
    const item_r2 = ctx.$implicit;
    const ɵ$index_9_r3 = ctx.$index;
    const ɵ$count_9_r4 = ctx.$count;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(item_r2.tone === "live" ? 2 : -1);
    i0.ɵɵadvance();
    i0.ɵɵclassMap(ctx_r0.dotClass(item_r2.tone || "default"));
    i0.ɵɵadvance();
    i0.ɵɵconditional(!(ɵ$index_9_r3 === ɵ$count_9_r4 - 1) ? 4 : -1);
    i0.ɵɵadvance(4);
    i0.ɵɵtextInterpolate(item_r2.title);
    i0.ɵɵadvance(2);
    i0.ɵɵtextInterpolate(item_r2.meta);
    i0.ɵɵadvance();
    i0.ɵɵconditional(item_r2.description ? 11 : -1);
} }
function TimelineComponent_ForEmpty_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "li", 4);
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.emptyMessage);
} }
export class TimelineComponent {
    constructor() {
        this.title = '';
        this.items = [];
        this.emptyMessage = 'No timeline events.';
    }
    dotClass(tone) {
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
        return map[tone];
    }
    static { this.ɵfac = function TimelineComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TimelineComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: TimelineComponent, selectors: [["ba-timeline"]], inputs: { title: "title", items: "items", emptyMessage: "emptyMessage" }, decls: 6, vars: 2, consts: [[1, "ba-card", "p-4"], [1, "text-sm", "font-semibold", "text-text"], [1, "mt-4", "max-h-[34rem]", "space-y-4", "overflow-y-auto", "pr-1"], [1, "grid", "grid-cols-[16px_1fr]", "gap-3"], [1, "text-sm", "text-muted"], [1, "relative", "mt-1", "flex", "justify-center"], [1, "absolute", "h-2.5", "w-2.5", "animate-ping", "rounded-full", "bg-success", "opacity-30"], [1, "relative", "h-2.5", "w-2.5", "rounded-full"], [1, "absolute", "top-3", "h-[calc(100%+1rem)]", "w-px", "bg-border/70"], [1, "flex", "items-center", "justify-between", "gap-3"], [1, "text-sm", "font-medium", "text-text"], [1, "ba-data", "text-muted"], [1, "mt-1", "max-h-24", "overflow-y-auto", "pr-1", "text-sm", "text-muted"]], template: function TimelineComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵdomElementStart(0, "section", 0);
            i0.ɵɵconditionalCreate(1, TimelineComponent_Conditional_1_Template, 2, 1, "h3", 1);
            i0.ɵɵdomElementStart(2, "ol", 2);
            i0.ɵɵrepeaterCreate(3, TimelineComponent_For_4_Template, 12, 7, "li", 3, _forTrack0, false, TimelineComponent_ForEmpty_5_Template, 2, 1, "li", 4);
            i0.ɵɵdomElementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.title ? 1 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵrepeater(ctx.items);
        } }, encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TimelineComponent, [{
        type: Component,
        args: [{
                selector: 'ba-timeline',
                standalone: true,
                template: `
    <section class="ba-card p-4">
      @if (title) {
        <h3 class="text-sm font-semibold text-text">{{ title }}</h3>
      }
      <ol class="mt-4 max-h-[34rem] space-y-4 overflow-y-auto pr-1">
        @for (item of items; track item.id || item.title + item.meta; let last = $last) {
          <li class="grid grid-cols-[16px_1fr] gap-3">
            <span class="relative mt-1 flex justify-center">
              @if (item.tone === 'live') {
                <span class="absolute h-2.5 w-2.5 animate-ping rounded-full bg-success opacity-30"></span>
              }
              <span class="relative h-2.5 w-2.5 rounded-full" [class]="dotClass(item.tone || 'default')"></span>
              @if (!last) {
                <span class="absolute top-3 h-[calc(100%+1rem)] w-px bg-border/70"></span>
              }
            </span>
            <div>
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-medium text-text">{{ item.title }}</p>
                <time class="ba-data text-muted">{{ item.meta }}</time>
              </div>
              @if (item.description) {
                <div class="mt-1 max-h-24 overflow-y-auto pr-1 text-sm text-muted">
                  <p>{{ item.description }}</p>
                </div>
              }
            </div>
          </li>
        } @empty {
          <li class="text-sm text-muted">{{ emptyMessage }}</li>
        }
      </ol>
    </section>
  `
            }]
    }], null, { title: [{
            type: Input
        }], items: [{
            type: Input
        }], emptyMessage: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(TimelineComponent, { className: "TimelineComponent", filePath: "src/app/shared/ui/timeline/timeline.component.ts", lineNumber: 61 }); })();
//# sourceMappingURL=timeline.component.js.map
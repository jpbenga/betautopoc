import { Component, Input } from '@angular/core';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import * as i0 from "@angular/core";
const _c0 = ["*"];
function TicketCardComponent_Conditional_24_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 9);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.summary);
} }
export class TicketCardComponent {
    constructor() {
        this.title = 'AI proposal';
        this.market = 'Market';
        this.status = 'Pending';
        this.tone = 'default';
        this.odds = '-';
        this.confidence = '-';
        this.stake = '-';
        this.summary = '';
    }
    static { this.ɵfac = function TicketCardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || TicketCardComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: TicketCardComponent, selectors: [["ba-ticket-card"]], inputs: { title: "title", market: "market", status: "status", tone: "tone", odds: "odds", confidence: "confidence", stake: "stake", summary: "summary" }, ngContentSelectors: _c0, decls: 26, vars: 8, consts: [[1, "ba-card", "p-4", "transition", "hover:border-outline/70"], [1, "flex", "items-start", "justify-between", "gap-4"], [1, "ba-label"], [1, "mt-2", "text-base", "font-semibold", "text-text"], [3, "label", "tone"], [1, "mt-4", "grid", "grid-cols-3", "gap-3"], [1, "ba-data", "mt-1", "text-text"], [1, "ba-data", "mt-1", "text-success"], [1, "ba-data", "mt-1", "text-warning"], [1, "mt-4", "text-sm", "leading-5", "text-muted"]], template: function TicketCardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵelementStart(0, "article", 0)(1, "div", 1)(2, "div")(3, "p", 2);
            i0.ɵɵtext(4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h3", 3);
            i0.ɵɵtext(6);
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(7, "ba-status-badge", 4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "div", 5)(9, "div")(10, "p", 2);
            i0.ɵɵtext(11, "Odds");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "p", 6);
            i0.ɵɵtext(13);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(14, "div")(15, "p", 2);
            i0.ɵɵtext(16, "Confidence");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "p", 7);
            i0.ɵɵtext(18);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(19, "div")(20, "p", 2);
            i0.ɵɵtext(21, "Stake");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(22, "p", 8);
            i0.ɵɵtext(23);
            i0.ɵɵelementEnd()()();
            i0.ɵɵconditionalCreate(24, TicketCardComponent_Conditional_24_Template, 2, 1, "p", 9);
            i0.ɵɵprojection(25);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(ctx.market);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.title);
            i0.ɵɵadvance();
            i0.ɵɵproperty("label", ctx.status)("tone", ctx.tone);
            i0.ɵɵadvance(6);
            i0.ɵɵtextInterpolate(ctx.odds);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.confidence);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.stake);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.summary ? 24 : -1);
        } }, dependencies: [StatusBadgeComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(TicketCardComponent, [{
        type: Component,
        args: [{
                selector: 'ba-ticket-card',
                standalone: true,
                imports: [StatusBadgeComponent],
                template: `
    <article class="ba-card p-4 transition hover:border-outline/70">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="ba-label">{{ market }}</p>
          <h3 class="mt-2 text-base font-semibold text-text">{{ title }}</h3>
        </div>
        <ba-status-badge [label]="status" [tone]="tone"></ba-status-badge>
      </div>
      <div class="mt-4 grid grid-cols-3 gap-3">
        <div>
          <p class="ba-label">Odds</p>
          <p class="ba-data mt-1 text-text">{{ odds }}</p>
        </div>
        <div>
          <p class="ba-label">Confidence</p>
          <p class="ba-data mt-1 text-success">{{ confidence }}</p>
        </div>
        <div>
          <p class="ba-label">Stake</p>
          <p class="ba-data mt-1 text-warning">{{ stake }}</p>
        </div>
      </div>
      @if (summary) {
        <p class="mt-4 text-sm leading-5 text-muted">{{ summary }}</p>
      }
      <ng-content></ng-content>
    </article>
  `
            }]
    }], null, { title: [{
            type: Input
        }], market: [{
            type: Input
        }], status: [{
            type: Input
        }], tone: [{
            type: Input
        }], odds: [{
            type: Input
        }], confidence: [{
            type: Input
        }], stake: [{
            type: Input
        }], summary: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(TicketCardComponent, { className: "TicketCardComponent", filePath: "src/app/shared/ui/ticket-card/ticket-card.component.ts", lineNumber: 38 }); })();
//# sourceMappingURL=ticket-card.component.js.map
import { Component, Input } from '@angular/core';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import * as i0 from "@angular/core";
export class AgentCardComponent {
    constructor() {
        this.name = 'Agent';
        this.role = 'Worker';
        this.status = 'Idle';
        this.tone = 'default';
        this.currentJob = 'No active job';
        this.lastEvent = 'No event yet';
    }
    static { this.ɵfac = function AgentCardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || AgentCardComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: AgentCardComponent, selectors: [["ba-agent-card"]], inputs: { name: "name", role: "role", status: "status", tone: "tone", currentJob: "currentJob", lastEvent: "lastEvent" }, decls: 19, vars: 6, consts: [[1, "ba-card", "p-4"], [1, "flex", "items-start", "justify-between", "gap-4"], [1, "ba-label"], [1, "mt-2", "text-base", "font-semibold", "text-text"], [3, "label", "tone"], [1, "mt-4", "grid", "grid-cols-2", "gap-3", "text-sm"], [1, "mt-1", "text-muted"]], template: function AgentCardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "article", 0)(1, "div", 1)(2, "div")(3, "p", 2);
            i0.ɵɵtext(4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(5, "h3", 3);
            i0.ɵɵtext(6);
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(7, "ba-status-badge", 4);
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(8, "dl", 5)(9, "div")(10, "dt", 2);
            i0.ɵɵtext(11, "Current job");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(12, "dd", 6);
            i0.ɵɵtext(13);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(14, "div")(15, "dt", 2);
            i0.ɵɵtext(16, "Last event");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(17, "dd", 6);
            i0.ɵɵtext(18);
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵadvance(4);
            i0.ɵɵtextInterpolate(ctx.role);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.name);
            i0.ɵɵadvance();
            i0.ɵɵproperty("label", ctx.status)("tone", ctx.tone);
            i0.ɵɵadvance(6);
            i0.ɵɵtextInterpolate(ctx.currentJob);
            i0.ɵɵadvance(5);
            i0.ɵɵtextInterpolate(ctx.lastEvent);
        } }, dependencies: [StatusBadgeComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(AgentCardComponent, [{
        type: Component,
        args: [{
                selector: 'ba-agent-card',
                standalone: true,
                imports: [StatusBadgeComponent],
                template: `
    <article class="ba-card p-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="ba-label">{{ role }}</p>
          <h3 class="mt-2 text-base font-semibold text-text">{{ name }}</h3>
        </div>
        <ba-status-badge [label]="status" [tone]="tone"></ba-status-badge>
      </div>
      <dl class="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt class="ba-label">Current job</dt>
          <dd class="mt-1 text-muted">{{ currentJob }}</dd>
        </div>
        <div>
          <dt class="ba-label">Last event</dt>
          <dd class="mt-1 text-muted">{{ lastEvent }}</dd>
        </div>
      </dl>
    </article>
  `
            }]
    }], null, { name: [{
            type: Input
        }], role: [{
            type: Input
        }], status: [{
            type: Input
        }], tone: [{
            type: Input
        }], currentJob: [{
            type: Input
        }], lastEvent: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(AgentCardComponent, { className: "AgentCardComponent", filePath: "src/app/shared/ui/agent-card/agent-card.component.ts", lineNumber: 30 }); })();
//# sourceMappingURL=agent-card.component.js.map
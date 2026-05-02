import { Component } from '@angular/core';
import * as i0 from "@angular/core";
const _c0 = ["*"];
export class SectionCardComponent {
    static { this.ɵfac = function SectionCardComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SectionCardComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SectionCardComponent, selectors: [["ba-section-card"]], ngContentSelectors: _c0, decls: 2, vars: 0, consts: [[1, "ba-card", "min-w-0", "overflow-hidden", "shadow-glow"]], template: function SectionCardComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵdomElementStart(0, "section", 0);
            i0.ɵɵprojection(1);
            i0.ɵɵdomElementEnd();
        } }, encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SectionCardComponent, [{
        type: Component,
        args: [{
                selector: 'ba-section-card',
                standalone: true,
                template: `
    <section class="ba-card min-w-0 overflow-hidden shadow-glow">
      <ng-content></ng-content>
    </section>
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SectionCardComponent, { className: "SectionCardComponent", filePath: "src/app/shared/ui/section-card/section-card.component.ts", lineNumber: 12 }); })();
//# sourceMappingURL=section-card.component.js.map
import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.path;
function MobileNavComponent_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 1);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r1 = ctx.$implicit;
    i0.ɵɵproperty("routerLink", item_r1.path);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", item_r1.label, " ");
} }
export class MobileNavComponent {
    constructor() {
        this.items = [];
    }
    static { this.ɵfac = function MobileNavComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || MobileNavComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: MobileNavComponent, selectors: [["ba-mobile-nav"]], inputs: { items: "items" }, decls: 3, vars: 0, consts: [[1, "fixed", "bottom-0", "left-0", "right-0", "z-20", "flex", "gap-1", "overflow-x-auto", "border-t", "border-border/70", "bg-surface-low/95", "px-2", "py-2", "backdrop-blur", "md:hidden"], ["routerLinkActive", "text-text bg-accent/10 border-accent/50", 1, "shrink-0", "rounded-tool", "border", "border-transparent", "px-3", "py-2", "text-xs", "text-muted", 3, "routerLink"]], template: function MobileNavComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "nav", 0);
            i0.ɵɵrepeaterCreate(1, MobileNavComponent_For_2_Template, 2, 2, "a", 1, _forTrack0);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵrepeater(ctx.items);
        } }, dependencies: [RouterLink, RouterLinkActive], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MobileNavComponent, [{
        type: Component,
        args: [{
                selector: 'ba-mobile-nav',
                standalone: true,
                imports: [RouterLink, RouterLinkActive],
                template: `
    <nav class="fixed bottom-0 left-0 right-0 z-20 flex gap-1 overflow-x-auto border-t border-border/70 bg-surface-low/95 px-2 py-2 backdrop-blur md:hidden">
      @for (item of items; track item.path) {
        <a
          [routerLink]="item.path"
          routerLinkActive="text-text bg-accent/10 border-accent/50"
          class="shrink-0 rounded-tool border border-transparent px-3 py-2 text-xs text-muted"
        >
          {{ item.label }}
        </a>
      }
    </nav>
  `
            }]
    }], null, { items: [{
            type: Input,
            args: [{ required: true }]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(MobileNavComponent, { className: "MobileNavComponent", filePath: "src/app/layout/mobile-nav/mobile-nav.component.ts", lineNumber: 23 }); })();
//# sourceMappingURL=mobile-nav.component.js.map
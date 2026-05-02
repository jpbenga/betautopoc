import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.path;
function SidebarComponent_For_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "a", 4);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const item_r1 = ctx.$implicit;
    i0.ɵɵproperty("routerLink", item_r1.path);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", item_r1.label, " ");
} }
export class SidebarComponent {
    constructor() {
        this.items = [];
    }
    static { this.ɵfac = function SidebarComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || SidebarComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: SidebarComponent, selectors: [["ba-sidebar"]], inputs: { items: "items" }, decls: 8, vars: 0, consts: [[1, "hidden", "w-60", "flex-col", "gap-2", "border-r", "border-border/70", "bg-surface-low/95", "p-4", "backdrop-blur", "md:flex"], [1, "mb-4"], [1, "text-xl", "font-semibold", "text-text"], [1, "ba-label", "mt-1"], ["routerLinkActive", "border-accent/50 bg-accent/10 text-text", 1, "rounded-tool", "border", "border-transparent", "px-3", "py-2", "text-sm", "text-muted", "transition", "hover:border-border/70", "hover:bg-surface", "hover:text-text", 3, "routerLink"]], template: function SidebarComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "aside", 0)(1, "div", 1)(2, "div", 2);
            i0.ɵɵtext(3, "BetAuto");
            i0.ɵɵelementEnd();
            i0.ɵɵelementStart(4, "div", 3);
            i0.ɵɵtext(5, "Operations");
            i0.ɵɵelementEnd()();
            i0.ɵɵrepeaterCreate(6, SidebarComponent_For_7_Template, 2, 2, "a", 4, _forTrack0);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance(6);
            i0.ɵɵrepeater(ctx.items);
        } }, dependencies: [RouterLink, RouterLinkActive], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(SidebarComponent, [{
        type: Component,
        args: [{
                selector: 'ba-sidebar',
                standalone: true,
                imports: [RouterLink, RouterLinkActive],
                template: `
    <aside class="hidden w-60 flex-col gap-2 border-r border-border/70 bg-surface-low/95 p-4 backdrop-blur md:flex">
      <div class="mb-4">
        <div class="text-xl font-semibold text-text">BetAuto</div>
        <div class="ba-label mt-1">Operations</div>
      </div>
      @for (item of items; track item.path) {
        <a
          [routerLink]="item.path"
          routerLinkActive="border-accent/50 bg-accent/10 text-text"
          class="rounded-tool border border-transparent px-3 py-2 text-sm text-muted transition hover:border-border/70 hover:bg-surface hover:text-text"
        >
          {{ item.label }}
        </a>
      }
    </aside>
  `
            }]
    }], null, { items: [{
            type: Input,
            args: [{ required: true }]
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(SidebarComponent, { className: "SidebarComponent", filePath: "src/app/layout/sidebar/sidebar.component.ts", lineNumber: 27 }); })();
//# sourceMappingURL=sidebar.component.js.map
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MobileNavComponent } from '../mobile-nav/mobile-nav.component';
import { NAV_ITEMS } from '../nav-items';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import * as i0 from "@angular/core";
export class ShellComponent {
    constructor() {
        this.navItems = NAV_ITEMS;
    }
    static { this.ɵfac = function ShellComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || ShellComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: ShellComponent, selectors: [["ba-shell"]], decls: 7, vars: 2, consts: [[1, "flex", "min-h-screen", "bg-background", "text-text"], [3, "items"], [1, "flex", "min-w-0", "flex-1", "flex-col", "pb-16", "md:pb-0"], [1, "min-w-0", "flex-1", "p-3", "sm:p-4", "md:p-6"]], template: function ShellComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵelement(1, "ba-sidebar", 1);
            i0.ɵɵelementStart(2, "div", 2);
            i0.ɵɵelement(3, "ba-topbar");
            i0.ɵɵelementStart(4, "main", 3);
            i0.ɵɵelement(5, "router-outlet");
            i0.ɵɵelementEnd()();
            i0.ɵɵelement(6, "ba-mobile-nav", 1);
            i0.ɵɵelementEnd();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵproperty("items", ctx.navItems);
            i0.ɵɵadvance(5);
            i0.ɵɵproperty("items", ctx.navItems);
        } }, dependencies: [RouterOutlet, SidebarComponent, TopbarComponent, MobileNavComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(ShellComponent, [{
        type: Component,
        args: [{
                selector: 'ba-shell',
                standalone: true,
                imports: [RouterOutlet, SidebarComponent, TopbarComponent, MobileNavComponent],
                template: `
    <div class="flex min-h-screen bg-background text-text">
      <ba-sidebar [items]="navItems"></ba-sidebar>
      <div class="flex min-w-0 flex-1 flex-col pb-16 md:pb-0">
        <ba-topbar></ba-topbar>
        <main class="min-w-0 flex-1 p-3 sm:p-4 md:p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
      <ba-mobile-nav [items]="navItems"></ba-mobile-nav>
    </div>
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(ShellComponent, { className: "ShellComponent", filePath: "src/app/layout/shell/shell.component.ts", lineNumber: 25 }); })();
//# sourceMappingURL=shell.component.js.map
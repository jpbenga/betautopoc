import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
const _c0 = ["*"];
function PageHeaderComponent_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p", 2);
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.eyebrow);
} }
function PageHeaderComponent_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p", 4);
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.subtitle);
} }
export class PageHeaderComponent {
    constructor() {
        this.title = '';
        this.subtitle = '';
        this.eyebrow = '';
    }
    static { this.ɵfac = function PageHeaderComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || PageHeaderComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: PageHeaderComponent, selectors: [["ba-page-header"]], inputs: { title: "title", subtitle: "subtitle", eyebrow: "eyebrow" }, ngContentSelectors: _c0, decls: 8, vars: 3, consts: [[1, "mb-6", "flex", "min-w-0", "flex-col", "gap-4", "border-b", "border-border/60", "pb-5", "md:flex-row", "md:items-end", "md:justify-between"], [1, "min-w-0"], [1, "ba-label", "mb-2"], [1, "text-xl", "font-semibold", "leading-7", "text-text", "sm:text-2xl", "sm:leading-8"], [1, "mt-1", "max-w-3xl", "text-sm", "leading-5", "text-muted"], [1, "min-w-0", "md:shrink-0"]], template: function PageHeaderComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵdomElementStart(0, "div", 0)(1, "div", 1);
            i0.ɵɵconditionalCreate(2, PageHeaderComponent_Conditional_2_Template, 2, 1, "p", 2);
            i0.ɵɵdomElementStart(3, "h2", 3);
            i0.ɵɵtext(4);
            i0.ɵɵdomElementEnd();
            i0.ɵɵconditionalCreate(5, PageHeaderComponent_Conditional_5_Template, 2, 1, "p", 4);
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(6, "div", 5);
            i0.ɵɵprojection(7);
            i0.ɵɵdomElementEnd()();
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.eyebrow ? 2 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.title);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.subtitle ? 5 : -1);
        } }, encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(PageHeaderComponent, [{
        type: Component,
        args: [{
                selector: 'ba-page-header',
                standalone: true,
                template: `
    <div class="mb-6 flex min-w-0 flex-col gap-4 border-b border-border/60 pb-5 md:flex-row md:items-end md:justify-between">
      <div class="min-w-0">
        @if (eyebrow) {
          <p class="ba-label mb-2">{{ eyebrow }}</p>
        }
        <h2 class="text-xl font-semibold leading-7 text-text sm:text-2xl sm:leading-8">{{ title }}</h2>
        @if (subtitle) {
          <p class="mt-1 max-w-3xl text-sm leading-5 text-muted">{{ subtitle }}</p>
        }
      </div>
      <div class="min-w-0 md:shrink-0">
        <ng-content></ng-content>
      </div>
    </div>
  `
            }]
    }], null, { title: [{
            type: Input,
            args: [{ required: true }]
        }], subtitle: [{
            type: Input
        }], eyebrow: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(PageHeaderComponent, { className: "PageHeaderComponent", filePath: "src/app/shared/ui/page-header/page-header.component.ts", lineNumber: 23 }); })();
//# sourceMappingURL=page-header.component.js.map
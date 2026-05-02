import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';
import * as i0 from "@angular/core";
export class MarketDictionaryPage {
    static { this.ɵfac = function MarketDictionaryPage_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || MarketDictionaryPage)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: MarketDictionaryPage, selectors: [["ba-market-dictionary-page"]], decls: 4, vars: 0, consts: [["title", "Market Dictionary", "subtitle", "Page placeholder for the future market dictionary module."], [1, "text-sm", "text-muted"]], template: function MarketDictionaryPage_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelement(0, "ba-page-header", 0);
            i0.ɵɵelementStart(1, "ba-section-card")(2, "p", 1);
            i0.ɵɵtext(3, " This feature is scaffolded and ready for incremental implementation. ");
            i0.ɵɵelementEnd()();
        } }, dependencies: [PageHeaderComponent, SectionCardComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(MarketDictionaryPage, [{
        type: Component,
        args: [{
                selector: 'ba-market-dictionary-page',
                standalone: true,
                imports: [PageHeaderComponent, SectionCardComponent],
                template: `
    <ba-page-header
      title="Market Dictionary"
      subtitle="Page placeholder for the future market dictionary module."
    ></ba-page-header>

    <ba-section-card>
      <p class="text-sm text-muted">
        This feature is scaffolded and ready for incremental implementation.
      </p>
    </ba-section-card>
  `
            }]
    }], null, null); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(MarketDictionaryPage, { className: "MarketDictionaryPage", filePath: "src/app/features/market-dictionary/market-dictionary.page.ts", lineNumber: 22 }); })();
//# sourceMappingURL=market-dictionary.page.js.map
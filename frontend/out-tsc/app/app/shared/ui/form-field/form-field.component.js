import { Component, Input } from '@angular/core';
import * as i0 from "@angular/core";
const _c0 = ["*"];
function FormFieldComponent_Conditional_5_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p", 3);
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.hint);
} }
function FormFieldComponent_Conditional_6_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵdomElementStart(0, "p", 4);
    i0.ɵɵtext(1);
    i0.ɵɵdomElementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.error);
} }
export class FormFieldComponent {
    constructor() {
        this.label = '';
        this.hint = '';
        this.error = '';
    }
    static { this.ɵfac = function FormFieldComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || FormFieldComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: FormFieldComponent, selectors: [["ba-form-field"]], inputs: { label: "label", hint: "hint", error: "error" }, ngContentSelectors: _c0, decls: 7, vars: 3, consts: [[1, "block"], [1, "ba-label"], [1, "mt-2", "block"], [1, "mt-1", "text-xs", "text-muted"], [1, "mt-1", "text-xs", "text-danger"]], template: function FormFieldComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵprojectionDef();
            i0.ɵɵdomElementStart(0, "label", 0)(1, "span", 1);
            i0.ɵɵtext(2);
            i0.ɵɵdomElementEnd();
            i0.ɵɵdomElementStart(3, "span", 2);
            i0.ɵɵprojection(4);
            i0.ɵɵdomElementEnd()();
            i0.ɵɵconditionalCreate(5, FormFieldComponent_Conditional_5_Template, 2, 1, "p", 3);
            i0.ɵɵconditionalCreate(6, FormFieldComponent_Conditional_6_Template, 2, 1, "p", 4);
        } if (rf & 2) {
            i0.ɵɵadvance(2);
            i0.ɵɵtextInterpolate(ctx.label);
            i0.ɵɵadvance(3);
            i0.ɵɵconditional(ctx.hint && !ctx.error ? 5 : -1);
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.error ? 6 : -1);
        } }, encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(FormFieldComponent, [{
        type: Component,
        args: [{
                selector: 'ba-form-field',
                standalone: true,
                template: `
    <label class="block">
      <span class="ba-label">{{ label }}</span>
      <span class="mt-2 block">
        <ng-content></ng-content>
      </span>
    </label>
    @if (hint && !error) {
      <p class="mt-1 text-xs text-muted">{{ hint }}</p>
    }
    @if (error) {
      <p class="mt-1 text-xs text-danger">{{ error }}</p>
    }
  `
            }]
    }], null, { label: [{
            type: Input,
            args: [{ required: true }]
        }], hint: [{
            type: Input
        }], error: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(FormFieldComponent, { className: "FormFieldComponent", filePath: "src/app/shared/ui/form-field/form-field.component.ts", lineNumber: 21 }); })();
//# sourceMappingURL=form-field.component.js.map
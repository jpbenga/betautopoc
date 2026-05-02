import { Component, Input } from '@angular/core';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import * as i0 from "@angular/core";
const _forTrack0 = ($index, $item) => $item.key;
function _forTrack1($index, $item) { return $item.cells[this.idKey] || $index; }
function DataTableComponent_Conditional_1_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "h3", 8);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.title);
} }
function DataTableComponent_Conditional_1_Conditional_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "p", 9);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext(2);
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate(ctx_r0.subtitle);
} }
function DataTableComponent_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "div", 1);
    i0.ɵɵconditionalCreate(1, DataTableComponent_Conditional_1_Conditional_1_Template, 2, 1, "h3", 8);
    i0.ɵɵconditionalCreate(2, DataTableComponent_Conditional_1_Conditional_2_Template, 2, 1, "p", 9);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.title ? 1 : -1);
    i0.ɵɵadvance();
    i0.ɵɵconditional(ctx_r0.subtitle ? 2 : -1);
} }
function DataTableComponent_For_7_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 10);
    i0.ɵɵtext(1);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const column_r2 = ctx.$implicit;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵclassMap(ctx_r0.alignClass(column_r2.align));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", column_r2.label, " ");
} }
function DataTableComponent_Conditional_8_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "th", 6);
    i0.ɵɵtext(1, "Status");
    i0.ɵɵelementEnd();
} }
function DataTableComponent_For_11_For_2_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 13)(1, "div", 14);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const column_r3 = ctx.$implicit;
    const row_r4 = i0.ɵɵnextContext().$implicit;
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵclassMap(ctx_r0.cellClass(column_r3));
    i0.ɵɵadvance();
    i0.ɵɵproperty("title", ctx_r0.stringValue(row_r4, column_r3.key));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.cellValue(row_r4, column_r3.key), " ");
} }
function DataTableComponent_For_11_Conditional_3_Conditional_1_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelement(0, "ba-status-badge", 15);
} if (rf & 2) {
    const row_r4 = i0.ɵɵnextContext(2).$implicit;
    i0.ɵɵproperty("label", row_r4.status)("tone", row_r4.statusTone || "default");
} }
function DataTableComponent_For_11_Conditional_3_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "td", 12);
    i0.ɵɵconditionalCreate(1, DataTableComponent_For_11_Conditional_3_Conditional_1_Template, 1, 2, "ba-status-badge", 15);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const row_r4 = i0.ɵɵnextContext().$implicit;
    i0.ɵɵadvance();
    i0.ɵɵconditional(row_r4.status ? 1 : -1);
} }
function DataTableComponent_For_11_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr", 7);
    i0.ɵɵrepeaterCreate(1, DataTableComponent_For_11_For_2_Template, 3, 4, "td", 11, _forTrack0);
    i0.ɵɵconditionalCreate(3, DataTableComponent_For_11_Conditional_3_Template, 2, 1, "td", 12);
    i0.ɵɵelementEnd();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵrepeater(ctx_r0.columns);
    i0.ɵɵadvance(2);
    i0.ɵɵconditional(ctx_r0.showStatus ? 3 : -1);
} }
function DataTableComponent_ForEmpty_12_Template(rf, ctx) { if (rf & 1) {
    i0.ɵɵelementStart(0, "tr")(1, "td", 16);
    i0.ɵɵtext(2);
    i0.ɵɵelementEnd()();
} if (rf & 2) {
    const ctx_r0 = i0.ɵɵnextContext();
    i0.ɵɵadvance();
    i0.ɵɵattribute("colspan", ctx_r0.columns.length + (ctx_r0.showStatus ? 1 : 0));
    i0.ɵɵadvance();
    i0.ɵɵtextInterpolate1(" ", ctx_r0.emptyMessage, " ");
} }
export class DataTableComponent {
    constructor() {
        this.title = '';
        this.subtitle = '';
        this.columns = [];
        this.rows = [];
        this.idKey = 'id';
        this.showStatus = true;
        this.emptyMessage = 'No rows available.';
    }
    alignClass(align = 'left') {
        const map = {
            left: 'text-left',
            right: 'text-right',
            center: 'text-center'
        };
        return map[align];
    }
    cellClass(column) {
        return `${this.alignClass(column.align)} ${column.data ? 'ba-data text-text' : ''}`;
    }
    cellValue(row, key) {
        return row.cells[key] ?? '';
    }
    stringValue(row, key) {
        return String(this.cellValue(row, key));
    }
    static { this.ɵfac = function DataTableComponent_Factory(__ngFactoryType__) { return new (__ngFactoryType__ || DataTableComponent)(); }; }
    static { this.ɵcmp = /*@__PURE__*/ i0.ɵɵdefineComponent({ type: DataTableComponent, selectors: [["ba-data-table"]], inputs: { title: "title", subtitle: "subtitle", columns: "columns", rows: "rows", idKey: "idKey", showStatus: "showStatus", emptyMessage: "emptyMessage" }, decls: 13, vars: 3, consts: [[1, "ba-card", "min-w-0", "overflow-hidden"], [1, "ba-card-header"], [1, "overflow-x-auto"], [1, "w-full", "min-w-[42rem]", "border-collapse", "text-left", "text-sm"], [1, "bg-surface", "text-muted"], [1, "ba-label", "px-4", "py-3", 3, "class"], [1, "ba-label", "px-4", "py-3", "text-right"], [1, "border-t", "border-border/60", "transition", "hover:bg-surface-high/70"], [1, "text-sm", "font-semibold", "text-text"], [1, "mt-1", "text-xs", "text-muted"], [1, "ba-label", "px-4", "py-3"], [1, "px-4", "py-3", "text-muted", 3, "class"], [1, "px-4", "py-3", "text-right"], [1, "px-4", "py-3", "text-muted"], [1, "max-w-[16rem]", "overflow-hidden", "text-ellipsis", "whitespace-nowrap", 3, "title"], [3, "label", "tone"], [1, "px-4", "py-8", "text-center", "text-sm", "text-muted"]], template: function DataTableComponent_Template(rf, ctx) { if (rf & 1) {
            i0.ɵɵelementStart(0, "div", 0);
            i0.ɵɵconditionalCreate(1, DataTableComponent_Conditional_1_Template, 3, 2, "div", 1);
            i0.ɵɵelementStart(2, "div", 2)(3, "table", 3)(4, "thead", 4)(5, "tr");
            i0.ɵɵrepeaterCreate(6, DataTableComponent_For_7_Template, 2, 3, "th", 5, _forTrack0);
            i0.ɵɵconditionalCreate(8, DataTableComponent_Conditional_8_Template, 2, 0, "th", 6);
            i0.ɵɵelementEnd()();
            i0.ɵɵelementStart(9, "tbody");
            i0.ɵɵrepeaterCreate(10, DataTableComponent_For_11_Template, 4, 1, "tr", 7, _forTrack1, true, DataTableComponent_ForEmpty_12_Template, 3, 2, "tr");
            i0.ɵɵelementEnd()()()();
        } if (rf & 2) {
            i0.ɵɵadvance();
            i0.ɵɵconditional(ctx.title || ctx.subtitle ? 1 : -1);
            i0.ɵɵadvance(5);
            i0.ɵɵrepeater(ctx.columns);
            i0.ɵɵadvance(2);
            i0.ɵɵconditional(ctx.showStatus ? 8 : -1);
            i0.ɵɵadvance(2);
            i0.ɵɵrepeater(ctx.rows);
        } }, dependencies: [StatusBadgeComponent], encapsulation: 2 }); }
}
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassMetadata(DataTableComponent, [{
        type: Component,
        args: [{
                selector: 'ba-data-table',
                standalone: true,
                imports: [StatusBadgeComponent],
                template: `
    <div class="ba-card min-w-0 overflow-hidden">
      @if (title || subtitle) {
        <div class="ba-card-header">
          @if (title) {
            <h3 class="text-sm font-semibold text-text">{{ title }}</h3>
          }
          @if (subtitle) {
            <p class="mt-1 text-xs text-muted">{{ subtitle }}</p>
          }
        </div>
      }

      <div class="overflow-x-auto">
        <table class="w-full min-w-[42rem] border-collapse text-left text-sm">
          <thead class="bg-surface text-muted">
            <tr>
              @for (column of columns; track column.key) {
                <th class="ba-label px-4 py-3" [class]="alignClass(column.align)">
                  {{ column.label }}
                </th>
              }
              @if (showStatus) {
                <th class="ba-label px-4 py-3 text-right">Status</th>
              }
            </tr>
          </thead>
          <tbody>
            @for (row of rows; track row.cells[idKey] || $index) {
              <tr class="border-t border-border/60 transition hover:bg-surface-high/70">
                @for (column of columns; track column.key) {
                  <td class="px-4 py-3 text-muted" [class]="cellClass(column)">
                    <div class="max-w-[16rem] overflow-hidden text-ellipsis whitespace-nowrap" [title]="stringValue(row, column.key)">
                      {{ cellValue(row, column.key) }}
                    </div>
                  </td>
                }
                @if (showStatus) {
                  <td class="px-4 py-3 text-right">
                    @if (row.status) {
                      <ba-status-badge [label]="row.status" [tone]="row.statusTone || 'default'"></ba-status-badge>
                    }
                  </td>
                }
              </tr>
            } @empty {
              <tr>
                <td class="px-4 py-8 text-center text-sm text-muted" [attr.colspan]="columns.length + (showStatus ? 1 : 0)">
                  {{ emptyMessage }}
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    </div>
  `
            }]
    }], null, { title: [{
            type: Input
        }], subtitle: [{
            type: Input
        }], columns: [{
            type: Input
        }], rows: [{
            type: Input
        }], idKey: [{
            type: Input
        }], showStatus: [{
            type: Input
        }], emptyMessage: [{
            type: Input
        }] }); })();
(() => { (typeof ngDevMode === "undefined" || ngDevMode) && i0.ɵsetClassDebugInfo(DataTableComponent, { className: "DataTableComponent", filePath: "src/app/shared/ui/data-table/data-table.component.ts", lineNumber: 90 }); })();
//# sourceMappingURL=data-table.component.js.map
import { Component, Input } from '@angular/core';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

export interface DataTableColumn {
  key: string;
  label: string;
  align?: 'left' | 'right' | 'center';
  data?: boolean;
}

export interface DataTableRow {
  cells: Record<string, string | number>;
  status?: string;
  statusTone?: 'default' | 'success' | 'warning' | 'danger' | 'live';
}

@Component({
  selector: 'ba-data-table',
  standalone: true,
  imports: [StatusBadgeComponent],
  template: `
    <div class="ba-card overflow-hidden">
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
        <table class="w-full min-w-[680px] border-collapse text-left text-sm">
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
                    {{ cellValue(row, column.key) }}
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
})
export class DataTableComponent {
  @Input() title = '';
  @Input() subtitle = '';
  @Input() columns: DataTableColumn[] = [];
  @Input() rows: DataTableRow[] = [];
  @Input() idKey = 'id';
  @Input() showStatus = true;
  @Input() emptyMessage = 'No rows available.';

  alignClass(align: DataTableColumn['align'] = 'left'): string {
    const map: Record<NonNullable<DataTableColumn['align']>, string> = {
      left: 'text-left',
      right: 'text-right',
      center: 'text-center'
    };

    return map[align];
  }

  cellClass(column: DataTableColumn): string {
    return `${this.alignClass(column.align)} ${column.data ? 'ba-data text-text' : ''}`;
  }

  cellValue(row: DataTableRow, key: string): string | number {
    return row.cells[key] ?? '';
  }
}

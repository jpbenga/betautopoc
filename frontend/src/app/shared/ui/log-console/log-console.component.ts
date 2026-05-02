import { Component, Input } from '@angular/core';

export interface LogEntry {
  id?: string;
  time: string;
  level: 'info' | 'success' | 'warning' | 'danger';
  message: string;
}

@Component({
  selector: 'ba-log-console',
  standalone: true,
  template: `
    <section class="ba-card min-w-0 overflow-hidden">
      <div class="ba-card-header flex items-center justify-between gap-3">
        <div class="min-w-0">
          <p class="ba-label">{{ label }}</p>
          <h3 class="mt-1 truncate text-sm font-semibold text-text">{{ title }}</h3>
        </div>
        <span class="ba-data shrink-0 text-muted">{{ entries.length }} events</span>
      </div>
      <div class="max-h-72 space-y-2 overflow-auto bg-background/80 p-4 font-data text-xs">
        @for (entry of entries; track entry.id || entry.time + entry.message; let first = $first) {
          <p
            class="grid gap-1 rounded-tool px-2 py-1 sm:grid-cols-[72px_72px_minmax(0,1fr)] sm:gap-3"
            [class.bg-accent/10]="highlightNewest && first"
            [class.ring-1]="highlightNewest && first"
            [class.ring-accent/20]="highlightNewest && first"
          >
            <span class="text-muted">{{ entry.time }}</span>
            <span [class]="levelClass(entry.level)">{{ entry.level }}</span>
            <span class="min-w-0 break-words text-text">{{ entry.message }}</span>
          </p>
        } @empty {
          <p class="text-muted">{{ emptyMessage }}</p>
        }
      </div>
    </section>
  `
})
export class LogConsoleComponent {
  @Input() label = 'Console';
  @Input() title = 'Operational log';
  @Input() entries: LogEntry[] = [];
  @Input() emptyMessage = 'No events recorded.';
  @Input() highlightNewest = false;

  levelClass(level: LogEntry['level']): string {
    const map: Record<LogEntry['level'], string> = {
      info: 'text-accent',
      success: 'text-success',
      warning: 'text-warning',
      danger: 'text-danger'
    };

    return map[level];
  }
}

import { Component, Input } from '@angular/core';

export interface TimelineItem {
  title: string;
  meta: string;
  description?: string;
  tone?: 'default' | 'success' | 'warning' | 'danger' | 'live';
}

@Component({
  selector: 'ba-timeline',
  standalone: true,
  template: `
    <section class="ba-card p-4">
      @if (title) {
        <h3 class="text-sm font-semibold text-text">{{ title }}</h3>
      }
      <ol class="mt-4 space-y-4">
        @for (item of items; track item.title + item.meta) {
          <li class="grid grid-cols-[16px_1fr] gap-3">
            <span class="mt-1 h-2.5 w-2.5 rounded-full" [class]="dotClass(item.tone || 'default')"></span>
            <div>
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-medium text-text">{{ item.title }}</p>
                <time class="ba-data text-muted">{{ item.meta }}</time>
              </div>
              @if (item.description) {
                <p class="mt-1 text-sm text-muted">{{ item.description }}</p>
              }
            </div>
          </li>
        } @empty {
          <li class="text-sm text-muted">{{ emptyMessage }}</li>
        }
      </ol>
    </section>
  `
})
export class TimelineComponent {
  @Input() title = '';
  @Input() items: TimelineItem[] = [];
  @Input() emptyMessage = 'No timeline events.';

  dotClass(tone: NonNullable<TimelineItem['tone']>): string {
    const map: Record<NonNullable<TimelineItem['tone']>, string> = {
      default: 'bg-muted',
      success: 'bg-success shadow-glow-success',
      warning: 'bg-warning shadow-glow-warning',
      danger: 'bg-danger',
      live: 'bg-success shadow-glow-success'
    };

    return map[tone];
  }
}

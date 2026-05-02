import { Component, Input } from '@angular/core';

export interface TimelineItem {
  id?: string;
  title: string;
  meta: string;
  description?: string;
  tone?:
    | 'default'
    | 'success'
    | 'warning'
    | 'danger'
    | 'live'
    | 'score-70'
    | 'score-75'
    | 'score-80'
    | 'score-85'
    | 'score-90'
    | 'score-95-plus';
}

@Component({
  selector: 'ba-timeline',
  standalone: true,
  template: `
    <section class="ba-card p-4">
      @if (title) {
        <h3 class="text-sm font-semibold text-text">{{ title }}</h3>
      }
      <ol class="mt-4 max-h-[34rem] space-y-4 overflow-y-auto pr-1">
        @for (item of items; track item.id || item.title + item.meta; let last = $last) {
          <li class="grid grid-cols-[16px_1fr] gap-3">
            <span class="relative mt-1 flex justify-center">
              @if (item.tone === 'live') {
                <span class="absolute h-2.5 w-2.5 animate-ping rounded-full bg-success opacity-30"></span>
              }
              <span class="relative h-2.5 w-2.5 rounded-full" [class]="dotClass(item.tone || 'default')"></span>
              @if (!last) {
                <span class="absolute top-3 h-[calc(100%+1rem)] w-px bg-border/70"></span>
              }
            </span>
            <div>
              <div class="flex items-center justify-between gap-3">
                <p class="text-sm font-medium text-text">{{ item.title }}</p>
                <time class="ba-data text-muted">{{ item.meta }}</time>
              </div>
              @if (item.description) {
                <div class="mt-1 max-h-24 overflow-y-auto pr-1 text-sm text-muted">
                  <p>{{ item.description }}</p>
                </div>
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
      live: 'bg-success shadow-glow-success',
      'score-70': 'bg-[#d97d68]',
      'score-75': 'bg-[#e5a155]',
      'score-80': 'bg-[#d4c45a]',
      'score-85': 'bg-[#86c86d]',
      'score-90': 'bg-[#41c7a5]',
      'score-95-plus': 'bg-[#4cd7f6] shadow-glow'
    };

    return map[tone];
  }
}

import { Component, Input } from '@angular/core';

export interface ChartPoint {
  label: string;
  value: number;
}

@Component({
  selector: 'ba-chart-card',
  standalone: true,
  template: `
    <section class="ba-card overflow-hidden">
      <div class="ba-card-header flex items-center justify-between gap-4">
        <div>
          <p class="ba-label">{{ label }}</p>
          <h3 class="mt-1 text-sm font-semibold text-text">{{ title }}</h3>
        </div>
        @if (value) {
          <p class="ba-data text-lg text-accent">{{ value }}</p>
        }
      </div>
      <div class="p-4">
        <div class="flex h-40 items-end gap-2 rounded-card border border-border/50 bg-background/70 p-3">
          @for (point of points; track point.label) {
            <div class="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div
                class="w-full rounded-t-sm bg-gradient-to-t from-accent-strong/40 to-accent shadow-glow"
                [style.height.%]="barHeight(point.value)"
                [title]="point.label + ': ' + point.value"
              ></div>
              <span class="max-w-full truncate text-[10px] text-muted">{{ point.label }}</span>
            </div>
          } @empty {
            <div class="flex h-full w-full items-center justify-center text-sm text-muted">
              {{ emptyMessage }}
            </div>
          }
        </div>
        @if (caption) {
          <p class="mt-3 text-xs text-muted">{{ caption }}</p>
        }
      </div>
    </section>
  `
})
export class ChartCardComponent {
  @Input() label = 'Analytics';
  @Input() title = '';
  @Input() value = '';
  @Input() caption = '';
  @Input() points: ChartPoint[] = [];
  @Input() emptyMessage = 'No chart data.';

  barHeight(value: number): number {
    const values = this.points.map((point) => point.value);
    const max = Math.max(...values, 1);
    return Math.max(8, Math.round((value / max) * 100));
  }
}

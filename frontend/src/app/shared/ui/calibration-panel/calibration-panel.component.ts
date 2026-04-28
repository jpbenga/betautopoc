import { Component, Input } from '@angular/core';

export interface CalibrationMetric {
  label: string;
  value: string;
  hint?: string;
}

@Component({
  selector: 'ba-calibration-panel',
  standalone: true,
  template: `
    <section class="ba-card overflow-hidden">
      <div class="ba-card-header">
        <p class="ba-label">{{ label }}</p>
        <h3 class="mt-1 text-sm font-semibold text-text">{{ title }}</h3>
      </div>
      <div class="grid gap-3 p-4 sm:grid-cols-3">
        @for (metric of metrics; track metric.label) {
          <div class="rounded-card border border-border/60 bg-background/60 p-3">
            <p class="ba-label">{{ metric.label }}</p>
            <p class="ba-data mt-2 text-lg text-accent">{{ metric.value }}</p>
            @if (metric.hint) {
              <p class="mt-1 text-xs text-muted">{{ metric.hint }}</p>
            }
          </div>
        } @empty {
          <p class="text-sm text-muted">{{ emptyMessage }}</p>
        }
      </div>
    </section>
  `
})
export class CalibrationPanelComponent {
  @Input() label = 'AI calibration';
  @Input() title = 'Model health';
  @Input() metrics: CalibrationMetric[] = [];
  @Input() emptyMessage = 'No calibration metrics.';
}

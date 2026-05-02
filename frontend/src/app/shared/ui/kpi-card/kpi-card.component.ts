import { Component, Input } from '@angular/core';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { UiTone } from '../../../core/api/api.mappers';

@Component({
  selector: 'ba-kpi-card',
  standalone: true,
  imports: [StatusBadgeComponent],
  template: `
    <article class="ba-card p-4 transition hover:border-outline/70">
      <div class="flex items-center justify-between">
        <h3 class="ba-label">{{ label }}</h3>
        @if (status) {
          <ba-status-badge [label]="status" [tone]="tone"></ba-status-badge>
        }
      </div>
      <p class="mt-3 font-data text-2xl font-semibold leading-8 text-text">{{ value }}</p>
      @if (delta) {
        <p class="mt-1 text-xs" [class]="deltaClass">{{ delta }}</p>
      }
    </article>
  `
})
export class KpiCardComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) value = '';
  @Input() status = '';
  @Input() tone: UiTone = 'default';
  @Input() delta = '';
  @Input() deltaTone: 'muted' | 'success' | 'warning' | 'danger' = 'muted';

  get deltaClass(): string {
    const map: Record<typeof this.deltaTone, string> = {
      muted: 'text-muted',
      success: 'text-success',
      warning: 'text-warning',
      danger: 'text-danger'
    };

    return map[this.deltaTone];
  }
}

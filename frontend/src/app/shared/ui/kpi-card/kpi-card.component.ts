import { Component, Input } from '@angular/core';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'ba-kpi-card',
  standalone: true,
  imports: [StatusBadgeComponent],
  template: `
    <article class="rounded-lg border border-border bg-surface p-4 space-y-2">
      <div class="flex items-center justify-between">
        <h3 class="text-sm text-muted">{{ label }}</h3>
        @if (status) {
          <ba-status-badge [label]="status"></ba-status-badge>
        }
      </div>
      <p class="text-2xl font-semibold">{{ value }}</p>
    </article>
  `
})
export class KpiCardComponent {
  @Input({ required: true }) label = '';
  @Input({ required: true }) value = '';
  @Input() status = '';
}

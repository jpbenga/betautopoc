import { Component, Input } from '@angular/core';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'ba-risk-card',
  standalone: true,
  imports: [StatusBadgeComponent],
  template: `
    <article class="ba-card p-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="ba-label">{{ label }}</p>
          <p class="mt-2 font-data text-2xl font-semibold text-text">{{ value }}</p>
        </div>
        <ba-status-badge [label]="status" [tone]="tone"></ba-status-badge>
      </div>
      <div class="mt-4 h-2 overflow-hidden rounded-full bg-background">
        <div class="h-full rounded-full" [class]="barClass" [style.width.%]="exposure"></div>
      </div>
      @if (description) {
        <p class="mt-3 text-sm text-muted">{{ description }}</p>
      }
    </article>
  `
})
export class RiskCardComponent {
  @Input() label = 'Risk';
  @Input() value = '-';
  @Input() status = 'Stable';
  @Input() tone: 'default' | 'success' | 'warning' | 'danger' | 'live' = 'default';
  @Input() exposure = 0;
  @Input() description = '';

  get barClass(): string {
    if (this.tone === 'danger') {
      return 'bg-danger';
    }

    if (this.tone === 'warning') {
      return 'bg-warning';
    }

    return 'bg-success';
  }
}

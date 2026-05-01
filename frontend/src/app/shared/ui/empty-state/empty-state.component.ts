import { Component, Input } from '@angular/core';

@Component({
  selector: 'ba-empty-state',
  standalone: true,
  template: `
    <div class="rounded-card border border-dashed p-8 text-center" [class]="stateClass">
      <p class="ba-label">{{ label }}</p>
      <p class="mt-2 text-sm text-muted">{{ message }}</p>
      @if (meta) {
        <p class="ba-data mt-3 text-muted">{{ meta }}</p>
      }
    </div>
  `
})
export class EmptyStateComponent {
  @Input() label = 'Empty state';
  @Input() message = 'No data available yet.';
  @Input() meta = '';
  @Input() tone: 'default' | 'success' | 'warning' | 'danger' | 'live' = 'default';

  get stateClass(): string {
    const map: Record<string, string> = {
      default: 'border-border/80 bg-surface-low',
      success: 'border-success/30 bg-success/5',
      warning: 'border-warning/30 bg-warning/5',
      danger: 'border-danger/30 bg-danger/5',
      live: 'border-accent/30 bg-accent/5'
    };

    return map[this.tone];
  }
}

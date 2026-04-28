import { Component, Input } from '@angular/core';

@Component({
  selector: 'ba-empty-state',
  standalone: true,
  template: `
    <div class="rounded-card border border-dashed border-border/80 bg-surface-low p-8 text-center">
      <p class="ba-label">{{ label }}</p>
      <p class="mt-2 text-sm text-muted">{{ message }}</p>
    </div>
  `
})
export class EmptyStateComponent {
  @Input() label = 'Empty state';
  @Input() message = 'No data available yet.';
}

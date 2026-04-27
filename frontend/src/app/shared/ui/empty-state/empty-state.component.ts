import { Component, Input } from '@angular/core';

@Component({
  selector: 'ba-empty-state',
  standalone: true,
  template: `
    <div class="rounded-lg border border-dashed border-border p-8 text-center text-muted">
      {{ message }}
    </div>
  `
})
export class EmptyStateComponent {
  @Input() message = 'No data available yet.';
}

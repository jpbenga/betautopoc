import { Component, Input } from '@angular/core';

@Component({
  selector: 'ba-error-state',
  standalone: true,
  template: `
    <div class="rounded-card border border-danger/40 bg-danger/10 p-4 text-danger">
      <p class="ba-label text-danger">{{ label }}</p>
      <p class="mt-2 text-sm">{{ message }}</p>
    </div>
  `
})
export class ErrorStateComponent {
  @Input() label = 'Error';
  @Input() message = 'An unexpected error occurred.';
}

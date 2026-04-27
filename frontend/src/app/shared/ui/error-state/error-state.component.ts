import { Component, Input } from '@angular/core';

@Component({
  selector: 'ba-error-state',
  standalone: true,
  template: `
    <div class="rounded-lg border border-danger/40 bg-danger/10 p-4 text-danger">
      {{ message }}
    </div>
  `
})
export class ErrorStateComponent {
  @Input() message = 'An unexpected error occurred.';
}

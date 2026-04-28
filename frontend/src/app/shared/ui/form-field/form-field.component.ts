import { Component, Input } from '@angular/core';

@Component({
  selector: 'ba-form-field',
  standalone: true,
  template: `
    <label class="block">
      <span class="ba-label">{{ label }}</span>
      <span class="mt-2 block">
        <ng-content></ng-content>
      </span>
    </label>
    @if (hint && !error) {
      <p class="mt-1 text-xs text-muted">{{ hint }}</p>
    }
    @if (error) {
      <p class="mt-1 text-xs text-danger">{{ error }}</p>
    }
  `
})
export class FormFieldComponent {
  @Input({ required: true }) label = '';
  @Input() hint = '';
  @Input() error = '';
}

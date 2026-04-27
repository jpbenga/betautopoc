import { Component, Input } from '@angular/core';

@Component({
  selector: 'ba-page-header',
  standalone: true,
  template: `
    <div class="mb-6 flex items-center justify-between gap-4">
      <div>
        <h2 class="text-2xl font-semibold">{{ title }}</h2>
        @if (subtitle) {
          <p class="text-sm text-muted mt-1">{{ subtitle }}</p>
        }
      </div>
      <ng-content></ng-content>
    </div>
  `
})
export class PageHeaderComponent {
  @Input({ required: true }) title = '';
  @Input() subtitle = '';
}

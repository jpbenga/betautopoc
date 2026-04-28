import { Component, Input } from '@angular/core';

@Component({
  selector: 'ba-page-header',
  standalone: true,
  template: `
    <div class="mb-6 flex flex-col gap-4 border-b border-border/60 pb-5 md:flex-row md:items-end md:justify-between">
      <div>
        @if (eyebrow) {
          <p class="ba-label mb-2">{{ eyebrow }}</p>
        }
        <h2 class="text-2xl font-semibold leading-8 text-text">{{ title }}</h2>
        @if (subtitle) {
          <p class="mt-1 max-w-3xl text-sm leading-5 text-muted">{{ subtitle }}</p>
        }
      </div>
      <ng-content></ng-content>
    </div>
  `
})
export class PageHeaderComponent {
  @Input({ required: true }) title = '';
  @Input() subtitle = '';
  @Input() eyebrow = '';
}

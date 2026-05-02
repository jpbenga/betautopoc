import { Component, Input } from '@angular/core';

@Component({
  selector: 'ba-page-header',
  standalone: true,
  template: `
    <div class="mb-6 flex min-w-0 flex-col gap-4 border-b border-border/60 pb-5 md:flex-row md:items-end md:justify-between">
      <div class="min-w-0">
        @if (eyebrow) {
          <p class="ba-label mb-2">{{ eyebrow }}</p>
        }
        <h2 class="text-xl font-semibold leading-7 text-text sm:text-2xl sm:leading-8">{{ title }}</h2>
        @if (subtitle) {
          <p class="mt-1 max-w-3xl text-sm leading-5 text-muted">{{ subtitle }}</p>
        }
      </div>
      <div class="min-w-0 md:shrink-0">
        <ng-content></ng-content>
      </div>
    </div>
  `
})
export class PageHeaderComponent {
  @Input({ required: true }) title = '';
  @Input() subtitle = '';
  @Input() eyebrow = '';
}

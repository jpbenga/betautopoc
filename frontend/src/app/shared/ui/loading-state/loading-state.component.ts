import { Component, Input } from '@angular/core';

@Component({
  selector: 'ba-loading-state',
  standalone: true,
  template: `
    <div class="rounded-card border border-accent/20 bg-accent/5 p-4">
      <div class="inline-flex items-center gap-2 text-sm text-muted">
        <span class="relative flex h-3 w-3">
          <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-30"></span>
          <span class="relative h-3 w-3 rounded-full bg-accent shadow-glow"></span>
        </span>
        <span>{{ message }}</span>
      </div>
      @if (detail) {
        <p class="mt-2 text-xs text-muted">{{ detail }}</p>
      }
      @if (showShimmer) {
        <div class="mt-4 space-y-2">
          <span class="block h-2 w-full animate-pulse rounded-full bg-surface-high"></span>
          <span class="block h-2 w-4/5 animate-pulse rounded-full bg-surface-high"></span>
        </div>
      }
    </div>
  `
})
export class LoadingStateComponent {
  @Input() message = 'Loading...';
  @Input() detail = '';
  @Input() showShimmer = false;
}

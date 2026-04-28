import { Component, Input } from '@angular/core';

@Component({
  selector: 'ba-loading-state',
  standalone: true,
  template: `
    <div class="inline-flex items-center gap-2 text-sm text-muted">
      <span class="h-2 w-2 animate-pulse rounded-full bg-accent shadow-glow"></span>
      <span>{{ message }}</span>
    </div>
  `
})
export class LoadingStateComponent {
  @Input() message = 'Loading...';
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'ba-loading-state',
  standalone: true,
  template: `<p class="text-sm text-muted animate-pulse">{{ message }}</p>`
})
export class LoadingStateComponent {
  @Input() message = 'Loading...';
}

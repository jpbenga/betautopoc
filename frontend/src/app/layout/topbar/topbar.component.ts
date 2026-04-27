import { Component } from '@angular/core';

@Component({
  selector: 'ba-topbar',
  standalone: true,
  template: `
    <header class="h-14 border-b border-border bg-surface px-4 flex items-center justify-between">
      <h1 class="text-sm font-medium">Operations Dashboard</h1>
      <span class="text-xs text-muted">Foundations mode</span>
    </header>
  `
})
export class TopbarComponent {}

import { Component } from '@angular/core';

@Component({
  selector: 'ba-topbar',
  standalone: true,
  template: `
    <header class="h-14 border-b border-border/70 bg-surface-low/80 px-4 backdrop-blur flex items-center justify-between">
      <div>
        <p class="ba-label">BetAuto</p>
        <h1 class="text-sm font-medium text-text">Operations Dashboard</h1>
      </div>
      <span class="inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-2 py-1 text-xs text-success">
        <span class="h-1.5 w-1.5 rounded-full bg-success shadow-glow-success"></span>
        Foundations mode
      </span>
    </header>
  `
})
export class TopbarComponent {}

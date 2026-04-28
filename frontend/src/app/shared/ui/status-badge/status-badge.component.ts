import { Component, Input } from '@angular/core';

@Component({
  selector: 'ba-status-badge',
  standalone: true,
  template: `
    <span class="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium" [class]="badgeClass">
      @if (tone === 'live') {
        <span class="h-1.5 w-1.5 rounded-full bg-success shadow-glow-success"></span>
      }
      {{ label }}
    </span>
  `
})
export class StatusBadgeComponent {
  @Input({ required: true }) label = '';
  @Input() tone: 'default' | 'success' | 'warning' | 'danger' | 'live' = 'default';

  get badgeClass(): string {
    const map: Record<string, string> = {
      default: 'border border-border/70 bg-surface-high text-muted',
      success: 'border border-success/30 bg-success/10 text-success',
      warning: 'border border-warning/30 bg-warning/10 text-warning',
      danger: 'border border-danger/30 bg-danger/10 text-danger',
      live: 'border border-success/40 bg-success/10 text-success shadow-glow-success'
    };

    return map[this.tone];
  }
}

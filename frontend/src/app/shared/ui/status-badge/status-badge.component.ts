import { Component, Input } from '@angular/core';

@Component({
  selector: 'ba-status-badge',
  standalone: true,
  template: `
    <span class="px-2 py-1 rounded-full text-xs font-medium" [class]="badgeClass">
      {{ label }}
    </span>
  `
})
export class StatusBadgeComponent {
  @Input({ required: true }) label = '';
  @Input() tone: 'default' | 'success' | 'warning' | 'danger' = 'default';

  get badgeClass(): string {
    const map: Record<string, string> = {
      default: 'bg-border/40 text-text',
      success: 'bg-success/20 text-success',
      warning: 'bg-warning/20 text-warning',
      danger: 'bg-danger/20 text-danger'
    };

    return map[this.tone];
  }
}

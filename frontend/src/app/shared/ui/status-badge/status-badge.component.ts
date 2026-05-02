import { Component, Input } from '@angular/core';

@Component({
  selector: 'ba-status-badge',
  standalone: true,
  template: `
    <span class="inline-flex max-w-full items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium" [class]="badgeClass">
      @if (showPip) {
        <span class="relative flex h-2 w-2">
          @if (pulse) {
            <span class="absolute inline-flex h-full w-full animate-ping rounded-full opacity-40" [class]="pipClass"></span>
          }
          <span class="relative inline-flex h-2 w-2 rounded-full" [class]="pipClass"></span>
        </span>
      }
      <span class="truncate">{{ label }}</span>
    </span>
  `
})
export class StatusBadgeComponent {
  @Input({ required: true }) label = '';
  @Input() tone:
    | 'default'
    | 'success'
    | 'warning'
    | 'danger'
    | 'live'
    | 'score-70'
    | 'score-75'
    | 'score-80'
    | 'score-85'
    | 'score-90'
    | 'score-95-plus' = 'default';
  @Input() pulse = false;
  @Input() showPip = false;

  get badgeClass(): string {
    const map: Record<string, string> = {
      default: 'border border-border/70 bg-surface-high text-muted',
      success: 'border border-success/30 bg-success/10 text-success',
      warning: 'border border-warning/30 bg-warning/10 text-warning',
      danger: 'border border-danger/30 bg-danger/10 text-danger',
      live: 'border border-success/40 bg-success/10 text-success shadow-glow-success',
      'score-70': 'border border-[#d97d68]/40 bg-[#d97d68]/12 text-[#ffc2b5]',
      'score-75': 'border border-[#e5a155]/40 bg-[#e5a155]/12 text-[#ffd39c]',
      'score-80': 'border border-[#d4c45a]/40 bg-[#d4c45a]/12 text-[#fff0a8]',
      'score-85': 'border border-[#86c86d]/40 bg-[#86c86d]/12 text-[#ccffb8]',
      'score-90': 'border border-[#41c7a5]/40 bg-[#41c7a5]/12 text-[#b7fff0]',
      'score-95-plus': 'border border-[#4cd7f6]/50 bg-[#4cd7f6]/14 text-[#c8f6ff] shadow-glow'
    };

    return map[this.tone];
  }

  get pipClass(): string {
    const map: Record<string, string> = {
      default: 'bg-muted',
      success: 'bg-success shadow-glow-success',
      warning: 'bg-warning shadow-glow-warning',
      danger: 'bg-danger',
      live: 'bg-success shadow-glow-success',
      'score-70': 'bg-[#d97d68]',
      'score-75': 'bg-[#e5a155]',
      'score-80': 'bg-[#d4c45a]',
      'score-85': 'bg-[#86c86d]',
      'score-90': 'bg-[#41c7a5]',
      'score-95-plus': 'bg-[#4cd7f6] shadow-glow'
    };

    return map[this.tone];
  }
}

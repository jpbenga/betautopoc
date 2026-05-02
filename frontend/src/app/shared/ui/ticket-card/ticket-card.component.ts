import { Component, Input } from '@angular/core';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'ba-ticket-card',
  standalone: true,
  imports: [StatusBadgeComponent],
  template: `
    <article class="ba-card p-4 transition hover:border-outline/70">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="ba-label">{{ market }}</p>
          <h3 class="mt-2 text-base font-semibold text-text">{{ title }}</h3>
        </div>
        <ba-status-badge [label]="status" [tone]="tone"></ba-status-badge>
      </div>
      <div class="mt-4 grid grid-cols-3 gap-3">
        <div>
          <p class="ba-label">Odds</p>
          <p class="ba-data mt-1 text-text">{{ odds }}</p>
        </div>
        <div>
          <p class="ba-label">Confidence</p>
          <p class="ba-data mt-1 text-success">{{ confidence }}</p>
        </div>
        <div>
          <p class="ba-label">Stake</p>
          <p class="ba-data mt-1 text-warning">{{ stake }}</p>
        </div>
      </div>
      @if (summary) {
        <p class="mt-4 text-sm leading-5 text-muted">{{ summary }}</p>
      }
      <ng-content></ng-content>
    </article>
  `
})
export class TicketCardComponent {
  @Input() title = 'AI proposal';
  @Input() market = 'Market';
  @Input() status = 'Pending';
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
  @Input() odds = '-';
  @Input() confidence = '-';
  @Input() stake = '-';
  @Input() summary = '';
}

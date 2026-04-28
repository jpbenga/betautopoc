import { Component, Input } from '@angular/core';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';

@Component({
  selector: 'ba-agent-card',
  standalone: true,
  imports: [StatusBadgeComponent],
  template: `
    <article class="ba-card p-4">
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="ba-label">{{ role }}</p>
          <h3 class="mt-2 text-base font-semibold text-text">{{ name }}</h3>
        </div>
        <ba-status-badge [label]="status" [tone]="tone"></ba-status-badge>
      </div>
      <dl class="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div>
          <dt class="ba-label">Current job</dt>
          <dd class="mt-1 text-muted">{{ currentJob }}</dd>
        </div>
        <div>
          <dt class="ba-label">Last event</dt>
          <dd class="mt-1 text-muted">{{ lastEvent }}</dd>
        </div>
      </dl>
    </article>
  `
})
export class AgentCardComponent {
  @Input() name = 'Agent';
  @Input() role = 'Worker';
  @Input() status = 'Idle';
  @Input() tone: 'default' | 'success' | 'warning' | 'danger' | 'live' = 'default';
  @Input() currentJob = 'No active job';
  @Input() lastEvent = 'No event yet';
}

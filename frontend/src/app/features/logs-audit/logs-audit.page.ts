import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';

@Component({
  selector: 'ba-logs-audit-page',
  standalone: true,
  imports: [PageHeaderComponent, SectionCardComponent],
  template: `
    <ba-page-header
      title="Logs & Audit"
      subtitle="Page placeholder for the future logs & audit module."
    ></ba-page-header>

    <ba-section-card>
      <p class="text-sm text-muted">
        This feature is scaffolded and ready for incremental implementation.
      </p>
    </ba-section-card>
  `
})
export class LogsAuditPage {}

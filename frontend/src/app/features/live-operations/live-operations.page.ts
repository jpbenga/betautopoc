import { Component } from '@angular/core';
import { PageHeaderComponent } from '../../shared/ui/page-header/page-header.component';
import { SectionCardComponent } from '../../shared/ui/section-card/section-card.component';

@Component({
  selector: 'ba-live-operations-page',
  standalone: true,
  imports: [PageHeaderComponent, SectionCardComponent],
  template: `
    <ba-page-header
      title="Live Operations"
      subtitle="Page placeholder for the future live operations module."
    ></ba-page-header>

    <ba-section-card>
      <p class="text-sm text-muted">
        This feature is scaffolded and ready for incremental implementation.
      </p>
    </ba-section-card>
  `
})
export class LiveOperationsPage {}

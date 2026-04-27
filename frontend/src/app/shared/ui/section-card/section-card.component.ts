import { Component } from '@angular/core';

@Component({
  selector: 'ba-section-card',
  standalone: true,
  template: `
    <section class="rounded-lg border border-border bg-surface p-4">
      <ng-content></ng-content>
    </section>
  `
})
export class SectionCardComponent {}

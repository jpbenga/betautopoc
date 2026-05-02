import { Component } from '@angular/core';

@Component({
  selector: 'ba-section-card',
  standalone: true,
  template: `
    <section class="ba-card min-w-0 overflow-hidden shadow-glow">
      <ng-content></ng-content>
    </section>
  `
})
export class SectionCardComponent {}

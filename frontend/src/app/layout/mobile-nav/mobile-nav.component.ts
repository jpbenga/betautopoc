import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '../nav-items';

@Component({
  selector: 'ba-mobile-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="md:hidden fixed bottom-0 left-0 right-0 border-t border-border bg-surface px-2 py-2 flex gap-1 overflow-x-auto">
      @for (item of items; track item.path) {
        <a
          [routerLink]="item.path"
          routerLinkActive="text-white bg-accent/20"
          class="shrink-0 rounded-md px-3 py-2 text-xs text-muted"
        >
          {{ item.label }}
        </a>
      }
    </nav>
  `
})
export class MobileNavComponent {
  @Input({ required: true }) items: NavItem[] = [];
}

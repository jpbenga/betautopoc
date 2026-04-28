import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '../nav-items';

@Component({
  selector: 'ba-mobile-nav',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <nav class="fixed bottom-0 left-0 right-0 z-20 flex gap-1 overflow-x-auto border-t border-border/70 bg-surface-low/95 px-2 py-2 backdrop-blur md:hidden">
      @for (item of items; track item.path) {
        <a
          [routerLink]="item.path"
          routerLinkActive="text-text bg-accent/10 border-accent/50"
          class="shrink-0 rounded-tool border border-transparent px-3 py-2 text-xs text-muted"
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

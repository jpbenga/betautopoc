import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '../nav-items';

@Component({
  selector: 'ba-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="hidden md:flex w-64 bg-surface border-r border-border flex-col p-4 gap-2">
      <div class="text-xl font-semibold mb-4">BetAuto</div>
      @for (item of items; track item.path) {
        <a
          [routerLink]="item.path"
          routerLinkActive="bg-accent/20 text-white"
          class="rounded-md px-3 py-2 text-sm text-muted hover:text-text hover:bg-surface/80"
        >
          {{ item.label }}
        </a>
      }
    </aside>
  `
})
export class SidebarComponent {
  @Input({ required: true }) items: NavItem[] = [];
}

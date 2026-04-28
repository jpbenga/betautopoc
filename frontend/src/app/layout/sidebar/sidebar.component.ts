import { Component, Input } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NavItem } from '../nav-items';

@Component({
  selector: 'ba-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <aside class="hidden w-60 flex-col gap-2 border-r border-border/70 bg-surface-low/95 p-4 backdrop-blur md:flex">
      <div class="mb-4">
        <div class="text-xl font-semibold text-text">BetAuto</div>
        <div class="ba-label mt-1">Operations</div>
      </div>
      @for (item of items; track item.path) {
        <a
          [routerLink]="item.path"
          routerLinkActive="border-accent/50 bg-accent/10 text-text"
          class="rounded-tool border border-transparent px-3 py-2 text-sm text-muted transition hover:border-border/70 hover:bg-surface hover:text-text"
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

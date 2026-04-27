import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MobileNavComponent } from '../mobile-nav/mobile-nav.component';
import { NAV_ITEMS } from '../nav-items';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'ba-shell',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent, MobileNavComponent],
  template: `
    <div class="min-h-screen flex bg-background text-text">
      <ba-sidebar [items]="navItems"></ba-sidebar>
      <div class="flex-1 flex flex-col pb-16 md:pb-0">
        <ba-topbar></ba-topbar>
        <main class="flex-1 p-4 md:p-6">
          <router-outlet></router-outlet>
        </main>
      </div>
      <ba-mobile-nav [items]="navItems"></ba-mobile-nav>
    </div>
  `
})
export class ShellComponent {
  protected readonly navItems = NAV_ITEMS;
}

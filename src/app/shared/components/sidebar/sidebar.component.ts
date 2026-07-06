import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgTemplateOutlet],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {
  // ── Dummy data — wire to StoreService later ──
  storeName    = signal('متجر سارة');
  storeSlug    = signal('sara-store');
  storeInitial = signal('س');
  pendingCount = signal(3); // wire to OrderService later
}
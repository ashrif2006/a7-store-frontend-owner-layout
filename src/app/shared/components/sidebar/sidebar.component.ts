import { Component, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgTemplateOutlet],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {

  storeService = inject(StoreService); 
  constructor(){
    console.log(this.storeService.store())
  }
  storeName    = signal('متجر سارة');
  storeSlug    = signal('sara-store');
  storeInitial = signal('س');
  pendingCount = signal(3); // wire to OrderService later
}
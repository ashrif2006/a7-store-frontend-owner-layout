import { Component, effect, inject, signal } from '@angular/core';
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
    effect(()=>{
      const currentStore = this.storeService.store();
      if(currentStore){
        this.storeName.set(currentStore.name);
        this.storeSlug.set(currentStore.slug);
        this.storeInitial.set(this.getFirstChar(currentStore.slug));
      }
    },{allowSignalWrites:true})
  }
  storeName    = signal('متجر سارة');
  storeSlug    = signal('sara-store');
  storeInitial = signal('س');
  pendingCount = signal(3); // wire to OrderService later

  getFirstChar(word:string){
    return word.slice(0,1)
  }
}
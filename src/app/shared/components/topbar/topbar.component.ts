import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { PageTitleService } from '../../../services/pageTitle.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  storeService = inject(StoreService);
  private pageTitleService = inject(PageTitleService);

  pageTitle    = this.pageTitleService.title; 
  pendingCount = signal(3);

    storeInitial = computed(()=>{
      const store = this.storeService.store();
      return this.getFirstChar(this.getFirstChar(store?.name))
    });

    getFirstChar(word?:string){
      return word?.charAt(0) || "not"
    }

}
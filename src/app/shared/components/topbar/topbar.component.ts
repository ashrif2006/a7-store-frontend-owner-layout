import { Component, computed, effect, inject, input, signal } from '@angular/core';
import { StoreService } from '../../../services/store.service';
import { PageTitleService } from '../../../services/pageTitle.service';
import { DashBoardService } from '../../../services/dashboard.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  storeService = inject(StoreService);
  private pageTitleService = inject(PageTitleService);
  dashBoardService = inject(DashBoardService);
  router = inject(Router)

  report = this.dashBoardService.reports;

  pageTitle    = this.pageTitleService.title; 
  pendingCount = computed(()=>this.report()?.pendingOrdersCount ?? 0);

    storeInitial = computed(()=>{
      const store = this.storeService.store();
      return this.getFirstChar(this.getFirstChar(store?.name))
    });

    getFirstChar(word?:string){
      return word?.charAt(0) || "not"
    }

    goToOrders():void{
      this.router.navigate(['/orders'])
    }



}
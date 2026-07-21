import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';
import { StoreService } from '../../../services/store.service';
import { TokenService } from '../../../services/token.service';
import { ProductService } from '../../../services/product.service';
import { OrderService } from '../../../services/order.service';
import { DashBoardService } from '../../../services/dashboard.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgTemplateOutlet],
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent {

  storeService = inject(StoreService); 
  productService = inject(ProductService)
  orderService = inject(OrderService)
  dashboardService = inject(DashBoardService);
  private router = inject(Router);
  private tokenService = inject(TokenService);

  store = this.storeService.store;
  storeName = computed(()=> this.store()?.name ?? 'متجر');
  storeSlug = computed(()=> this.store()?.slug??'');
  storeInitial = computed(()=>{
    const slug = this.store()?.slug;
    return slug?slug.charAt(0):'a7'
  })

  report = this.dashboardService.reports;

  pendingCount = computed(()=> this.report()?.pendingOrdersCount ?? 0 )

 

  logout(){
    this.tokenService.remove();
    this.orderService.clearOrders()
    this.productService.clearProducts();
    this.storeService.clearStore();
    this.router.navigate(["/login"]);
    localStorage.clear()
  }
}
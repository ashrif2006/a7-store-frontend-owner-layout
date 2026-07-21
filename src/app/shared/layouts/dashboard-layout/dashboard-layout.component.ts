import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar//sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';
import { StoreService } from '../../../services/store.service';

@Component({
  selector: 'app-dashboard-layout',
  standalone: true,
  imports: [RouterOutlet, SidebarComponent, TopbarComponent],
  templateUrl: './dashboard-layout.component.html',
})
export class DashboardLayoutComponent {
  storeService = inject(StoreService);
  ngOnInit(){
    this.storeService.loadStore()
  }
}
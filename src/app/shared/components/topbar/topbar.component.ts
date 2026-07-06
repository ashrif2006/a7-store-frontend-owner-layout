import { Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-topbar',
  standalone: true,
  templateUrl: './topbar.component.html',
})
export class TopbarComponent {
  pageTitle    = signal('لوحة التحكم'); 
  storeInitial = signal('س');
  pendingCount = signal(3);
}
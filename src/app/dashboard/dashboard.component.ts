import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgClass } from '@angular/common';
import { DecimalPipe } from '@angular/common';
import { DashboardStats } from '../models/dashboardStates.interface';
import { DashBoardService } from '../services/dashboard.service';



@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, NgClass, DecimalPipe],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  dashBoardService = inject(DashBoardService);
    
  // ── UI state ──
  isLoading = computed(()=> this.dashBoardService.reports() === null);
  errorMsg  = signal('');
  stats     = this.dashBoardService.reports;
  skeletons = Array(4).fill(0);

  // ── Today's date ──
  todayDate = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  // ── Status maps ──
  private statusLabelMap: Record<string, string> = {
    PENDING:   'معلّق',
    CONFIRMED: 'مؤكد',
    SHIPPED:   'في الشحن',
    DELIVERED: 'تم التوصيل',
    CANCELLED: 'ملغي',
  };
  private statusBadgeMap: Record<string, string> = {
    PENDING:   'badge-pending',
    CONFIRMED: 'badge-confirmed',
    SHIPPED:   'badge-shipped',
    DELIVERED: 'badge-delivered',
    CANCELLED: 'badge-cancelled',
  };


  statusLabel(status: string): string { return this.statusLabelMap[status] ?? status; }
  statusBadge(status: string): string { return this.statusBadgeMap[status] ?? ''; }

  ngOnInit() { this.dashBoardService.loadReport() }

  loadStats() {
    this.errorMsg.set('');

    // TODO: inject DashboardService (or StoreService) and call getStats()
    // this.dashboardService.getStats().subscribe({
    //   next:  (data) => { this.stats.set(data); this.isLoading.set(false); },
    //   error: ()     => { this.errorMsg.set('فشل تحميل البيانات، حاول مرة أخرى'); this.isLoading.set(false); }
    // });

  }

  timeAgo(dateStr: string): string {
    const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (seconds < 60)  return 'منذ لحظات';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60)  return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24)    return `منذ ${hours} ساعة`;
    return `منذ ${Math.floor(hours / 24)} يوم`;
  }
}
import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { Order, OrderStatus } from '../../models/order.interface';
import { OrderService } from '../../services/order.service';
@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [FormsModule, NgClass],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css',
})
export class OrderListComponent implements OnInit {
  private orderService = inject(OrderService);

  // ── UI state ──
  isLoading = signal(false);
  activeStatus = signal<string>('all');
  updatingOrderId = signal<string | null>(null);
  searchQuery = '';
  expandedIds = signal<Set<string>>(new Set());
  skeletons = Array(4).fill(0);

  // ── Status config ──
  statusTabs = [
    { key: 'all', label: 'الكل' },
    { key: 'PENDING', label: 'معلّق' },
    { key: 'CONFIRMED', label: 'مؤكد' },
    { key: 'SHIPPED', label: 'في الشحن' },
    { key: 'DELIVERED', label: 'تم التوصيل' },
    { key: 'CANCELLED', label: 'ملغي' },
  ];

  statusLabelMap: Record<string, string> = {
    PENDING: 'معلّق',
    CONFIRMED: 'مؤكد',
    SHIPPED: 'في الشحن',
    DELIVERED: 'تم التوصيل',
    CANCELLED: 'ملغي',
  };

  statusBadgeMap: Record<string, string> = {
    PENDING: 'badge-pending',
    CONFIRMED: 'badge-confirmed',
    SHIPPED: 'badge-shipped',
    DELIVERED: 'badge-delivered',
    CANCELLED: 'badge-cancelled',
  };

  isUpdating(orderId: string, status: string): boolean {
  return this.updatingOrderId() === `${orderId}_${status}`;
}

isOrderBusy(orderId: string): boolean {
  return this.updatingOrderId()?.startsWith(orderId) ?? false;
}
  // ── Dummy data — replace with OrderService.orders signal later ──
  orders = this.orderService.orders;

  ngOnInit() {
    this.isLoading.set(true);
    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orderService.setOrders(orders);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  // ── Filtered orders ──
  filteredOrders = computed(() => {
    let list = this.orders();

    if (this.activeStatus() !== 'all') {
      list = list.filter((o) => o.status === this.activeStatus());
    }

    const q = this.searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (o) =>
          o.customer_name.toLowerCase().includes(q) ||
          o.id.toLowerCase().includes(q),
      );
    }

    return list;
  });

  // ── Helpers ──
  getCount(key: string): number {
    if (key === 'all') {
      return this.orders().length;
    }

    return this.orders().filter((order) => order.status === key).length;
  }

  setStatus(key: string) {
    this.activeStatus.set(key);
  }

  statusLabel(status: string): string {
    return this.statusLabelMap[status] ?? status;
  }
  statusBadge(status: string): string {
    return this.statusBadgeMap[status] ?? '';
  }

  toggleOrder(id: string) {
    this.expandedIds.update((set) => {
      const next = new Set(set);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  isExpanded(id: string): boolean {
    return this.expandedIds().has(id);
  }

  timeAgo(dateStr: string): string {
    const seconds = Math.floor(
      (Date.now() - new Date(dateStr).getTime()) / 1000,
    );
    if (seconds < 60) return 'منذ لحظات';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${Math.floor(hours / 24)} يوم`;
  }

updateStatus(order: Order, newStatus: OrderStatus) {
  this.updatingOrderId.set(`${order.id}_${newStatus}`); // ← غير ده
  this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
    next: (updatedOrder) => {
      this.orderService.updateOrders(updatedOrder);
      this.updatingOrderId.set(null);
    },
    error: (err) => {
      console.log(err);
      this.updatingOrderId.set(null);
    },
  });
}
}

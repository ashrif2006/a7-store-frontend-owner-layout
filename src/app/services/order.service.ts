import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Order } from '../models/order.interface';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  orders = signal<Order[]>([]);

  //API
  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${environment.apiUrl}/dashboard/orders`);
  }

  loadOrders(): void {
    if (this.orders().length) return;
    this.getOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
      },
      error: (err) => {
        console.error(err);
      },
    });
  }

  updateOrderStatus(id: string, status: string): Observable<Order> {
    return this.http.put<Order>(`${environment.apiUrl}/orders/${id}/status`, {
      status,
    });
  }

  setOrders(orders: Order[]): void {
    this.orders.set(orders);
  }

  addOrder(order: Order): void {
    this.orders.update((orders) => [...orders, order]);
  }

  updateOrders(order: Order): void {
    this.orders.update((orders) =>
      orders.map((o) => (o.id === order.id ? order : o)),
    );
  }

  removeORder(id: string): void {
    this.orders.update((orders) => orders.filter((o) => o.id !== id));
  }

  clearOrders(): void {
    this.orders.set([]);
  }
  getOrderById(id: string): Order | null {
    return this.orders().find((order) => order.id === id) ?? null;
  }

  constructor() {}
}

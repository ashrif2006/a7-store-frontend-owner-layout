export interface LowStockProduct {
  id: string;
  name: string;
  stock: number;
}
export interface RecentOrder {
  id: string;
  customer_name: string;
  totalPrice: number;
  status: string;
  createdAt: string;
}
export interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  pendingOrdersCount: number;
  activeProducts: number;
  totalProducts: number;
  lowStockProducts: LowStockProduct[];
  recentOrders: RecentOrder[];
}

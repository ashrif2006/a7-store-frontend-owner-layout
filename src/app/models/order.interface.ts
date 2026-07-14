import { Product } from "./product.interface";

export interface Order {
  id: string;
  totalPrice: number;
  status: OrderStatus;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  notes: string | null;
  whatsapp_sent: boolean;
  storeId: string;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  quantity: number;
  price_at_purchase: number;
  orderId: string;
  productId: string;
  seller_amount: number;
  product: Product;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';
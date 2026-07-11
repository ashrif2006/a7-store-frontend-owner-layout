export interface ProductImage {
  id: string;
  image_url: string;
  sort_order: number;
  productId: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  sale_price: number | null;
  description: string;
  stock: number;
  is_available: boolean;
  storeId: string;
  createdAt: string;
  updatedAt: string;
  images: ProductImage[];
}
export interface User {
  id: string;
  email: string;
  role: 'customer' | 'admin';
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  stock_quantity: number;
  volume_ml: number;
  top_notes: string;
  heart_notes: string;
  base_notes: string;
  image_url: string;
  category_id: string;
  created_at: string;
  category?: Category;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  product?: {
    id: string;
    name: string;
    brand: string;
    image_url: string;
    volume_ml: number;
  };
}

export interface Order {
  id: string;
  user_id?: string | null;
  customer_name?: string | null;
  customer_phone?: string | null;
  customer_city?: string | null;
  total_amount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  created_at: string;
  user?: {
    id: string;
    email: string;
  } | null;
  items: OrderItem[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AnalyticsData {
  summary: {
    totalRevenue: number;
    totalOrders: number;
    totalProducts: number;
    registeredUsers: number;
    lowStockCount: number;
  };
  statusDistribution: {
    pending: number;
    processing: number;
    shipped: number;
    delivered: number;
    cancelled: number;
  };
  topSellingProducts: Array<{
    product: {
      id: string;
      name: string;
      brand: string;
      price: number;
      image_url: string;
    };
    unitsSold: number;
    totalSales: number;
  }>;
  lowStockProducts: Product[];
  recentOrders: Order[];
}

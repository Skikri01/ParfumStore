import { Product, Category, Order, User, AnalyticsData } from '../types';

const API_BASE = '/api';

export const getAuthToken = (): string | null => {
  return localStorage.getItem('aura_token');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('aura_token', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('aura_token');
};

const getHeaders = (includeAuth = true): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  return headers;
};

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || `Request failed with status ${res.status}`);
  }
  return data as T;
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(res);
  },

  async register(email: string, password: string, role = 'customer'): Promise<{ token: string; user: User }> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: getHeaders(false),
      body: JSON.stringify({ email, password, role }),
    });
    return handleResponse(res);
  },

  async getMe(): Promise<{ user: User }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Categories
  async getCategories(): Promise<{ categories: Category[] }> {
    const res = await fetch(`${API_BASE}/categories`);
    return handleResponse(res);
  },

  // Products
  async getProducts(params?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
    volume?: number | string;
    sort?: string;
  }): Promise<{ products: Product[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val !== undefined && val !== null && val !== '') {
          searchParams.append(key, String(val));
        }
      });
    }
    const url = `${API_BASE}/products${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
    const res = await fetch(url);
    return handleResponse(res);
  },

  async getProductById(id: string): Promise<{ product: Product; relatedProducts: Product[] }> {
    const res = await fetch(`${API_BASE}/products/${id}`);
    return handleResponse(res);
  },

  async createProduct(productData: Partial<Product>): Promise<{ product: Product; message: string }> {
    const res = await fetch(`${API_BASE}/products`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse(res);
  },

  async updateProduct(id: string, productData: Partial<Product>): Promise<{ product: Product; message: string }> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify(productData),
    });
    return handleResponse(res);
  },

  async deleteProduct(id: string): Promise<{ message: string }> {
    const res = await fetch(`${API_BASE}/products/${id}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Orders
  async createOrder(data: {
    shipping_address: string;
    customer_name?: string;
    customer_phone?: string;
    customer_city?: string;
    items: Array<{ product_id: string; quantity: number }>;
  }): Promise<{ order: Order; message: string }> {
    const res = await fetch(`${API_BASE}/orders`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(res);
  },

  async getUserOrders(): Promise<{ orders: Order[] }> {
    const res = await fetch(`${API_BASE}/orders`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  // Admin
  async getAdminOrders(): Promise<{ orders: Order[] }> {
    const res = await fetch(`${API_BASE}/admin/orders`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async updateOrderStatus(id: string, status: string): Promise<{ order: Order; message: string }> {
    const res = await fetch(`${API_BASE}/admin/orders/${id}/status`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ status }),
    });
    return handleResponse(res);
  },

  async getAdminAnalytics(): Promise<AnalyticsData> {
    const res = await fetch(`${API_BASE}/admin/analytics`, {
      headers: getHeaders(),
    });
    return handleResponse(res);
  },

  async uploadImage(file: File): Promise<{ url: string; message: string }> {
    const formData = new FormData();
    formData.append('image', file);
    const token = localStorage.getItem('aura_token');
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers,
      body: formData,
    });
    return handleResponse(res);
  },
};

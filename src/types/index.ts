export interface User {
  id: number;
  email: string;
  name: string | null;
  address: string | null;
  created_at: string;
  role: string;
}

export interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  available: boolean;
  created_at: string;
  isFavorite?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Order {
  id: number;
  user_id: number;
  total: number;
  status: 'Оформлен' | 'Готовим' | 'В доставке' | 'Доставлен';
  address: string;
  created_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_variant_id: number;
  quantity: number;
  price: number;
}

export interface OrderDetails {
  order: Order;
  order_items: OrderItem[];
}

export interface Review {
  id: number;
  userId: number;
  productId: number;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface UpdateUserData {
  name?: string;
  address?: string;
  old_password?: string;
  new_password?: string;
}

export interface Favorite {
  id: number;
  user_id: number;
  product_id: number;
}

export interface CreateFavorite {
  product_id: number;
}

export interface DeleteFavorite {
  product_id: number;
}

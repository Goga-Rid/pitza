import axios from 'axios';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  UpdateUserData,
  Order,
  OrderDetails,
  Review,
  Product,
  Favorite,
  CreateFavorite,
  User,
} from '../types';
import { useAuthStore } from '../store/authStore';

const API_URL = 'http://95.181.167.81:8081';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token validation and auth state
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

// Auth endpoints
export const login = (credentials: LoginCredentials) =>
  api.post<AuthResponse>('/api/login', credentials).then(res => {
    localStorage.setItem('token', res.data.token);
    return res.data;
  });

export const register = (credentials: RegisterCredentials) =>
  api.post<AuthResponse>('/api/register', credentials).then(res => {
    localStorage.setItem('token', res.data.token);
    return res.data;
  });

export const validateToken = () =>
  api.get<{ status: string }>('/validate').then(res => res.data.status === 'valid');

export const getCurrentUser = () =>
  api.get<User>('/api/me').then(res => res.data);

export const updateUser = (data: UpdateUserData) => 
  api.put<User>('/api/me', data).then(res => res.data);

export interface OrderListItem {
  order: Order;
  item_count: number;
}

// Orders endpoints
export const getUserOrders = () => 
  api.get<OrderListItem[]>('/api/user/orders').then(res => res.data);

export const getOrderById = (orderId: number) => 
  api.get<OrderDetails>(`/api/user/orders/${orderId}`).then(res => res.data);

export const createOrder = (items: { product_id: number; quantity: number }[]) => 
  api.post<Order>('/api/user/orders', { items }).then(res => res.data);

// Reviews endpoints
export const createReview = (data: { product_id: number; rating: number; comment: string }) => 
  api.post<Review>('/api/user/reviews', data).then(res => res.data);

export const getProductReviews = (productId: number) => 
  api.get<Review[]>(`/api/user/reviews/${productId}`).then(res => res.data);

// Products endpoints
export const getProducts = () => 
  api.get<{ [key: string]: Product[] }>('/api/user/products').then(res => res.data);

// Favorites endpoints
export const getFavorites = () =>
  api.get<Favorite[]>('/api/user/favorites').then(res => res.data);

export const addFavorite = (data: CreateFavorite) =>
  api.post<Favorite>('/api/user/favorites', data).then(res => res.data);

export const removeFavorite = (favoriteId: number) =>
  api.delete(`/api/user/favorites/${favoriteId}`).then(res => res.data);

export default api; 
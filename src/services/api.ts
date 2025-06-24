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
  DeleteFavorite
} from '../types';
import { useAuthStore } from '../store/authStore';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_URL,
});

// Добавляем токен к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Обработка истечения токена
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
  api.post<AuthResponse>('/login', credentials).then(res => {
    localStorage.setItem('token', res.data.token);
    return res.data;
  });

export const register = (credentials: RegisterCredentials) =>
  api.post<AuthResponse>('/register', credentials).then(res => {
    localStorage.setItem('token', res.data.token);
    return res.data;
  });

export const validateToken = () => {
  if (import.meta.env.MODE === 'development') {
    // Для моков всегда валидно
    return Promise.resolve(true);
  }
  return api.get<{ status: string }>('/validate').then(res => res.data.status === 'valid');
};

export const getCurrentUser = () => {
  if (import.meta.env.MODE === 'development') {
    // Можно возвращать тестового пользователя (например, первого из users)
    return Promise.resolve({
    
      "email": "Hexlet@mail.ru",
      "password": "$2a$10$B9LLKrho//3pj/7h6RicxuMYgl0ixFxKcZK8C7C8GS9lMghWIHXry",
      "name": "Чувак",
      "id": 1
    
    });
  }
  return api.get<User>('/me').then(res => res.data);
};

export const updateUser = (data: UpdateUserData) => 
  api.put<User>('/me', data).then(res => res.data);

export interface OrderListItem {
  order: Order;
  item_count: number;
}

// Orders endpoints
export const getUserOrders = () => 
  api.get<OrderListItem[]>('/user/orders').then(res => res.data);

export const getOrderById = (orderId: number) => 
  api.get<OrderDetails>(`/user/orders/${orderId}`).then(res => res.data);

export const createOrder = (items: { product_id: number; quantity: number }[]) => 
  api.post<Order>('/user/orders', { items }).then(res => res.data);

// Reviews endpoints
export const createReview = (data: { product_id: number; rating: number; comment: string }) => 
  api.post<Review>('/user/reviews', data).then(res => res.data);

export const getProductReviews = (productId: number) => 
  api.get<Review[]>(`/user/reviews/${productId}`).then(res => res.data);

// Products endpoint
export const getProducts = () => 
  api.get<Product[]>('/products').then(res => res.data);

// Favorites endpoints
export const getFavorites = () =>
  api.get<Favorite[]>('/user/favorites').then(res => res.data);

export const addFavorite = (data: CreateFavorite) =>
  api.post<Favorite>('/user/favorites', data).then(res => res.data);

export const removeFavorite = (data: DeleteFavorite) =>
  api.delete('/user/favorites', { data }).then(res => res.data);

export default api;
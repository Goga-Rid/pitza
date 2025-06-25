import { describe, test, expect, beforeEach } from 'vitest';
import { useAuthStore } from '../../src/store/authStore';

const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@mail.com',
  address: '',
  created_at: '',
  role: 'user',
};

describe('authStore', () => {
  beforeEach(() => {
    useAuthStore.getState().logout();
  });

  test('устанавливает пользователя и авторизацию', () => {
    useAuthStore.getState().setUser(mockUser);
    expect(useAuthStore.getState().user).toEqual(mockUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    console.info('✅ Пользователь успешно установлен и авторизация активна');
  });

  test('выход из аккаунта', () => {
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    console.info('✅ Выход из аккаунта работает корректно');
  });

  test('устанавливает состояние загрузки', () => {
    useAuthStore.getState().setLoading(true);
    expect(useAuthStore.getState().isLoading).toBe(true);
    useAuthStore.getState().setLoading(false);
    expect(useAuthStore.getState().isLoading).toBe(false);
    console.info('✅ Состояние загрузки меняется корректно');
  });

  test('isAuthenticated false если пользователь null', () => {
    useAuthStore.getState().setUser(null);
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    console.info('✅ isAuthenticated корректно false при user=null');
  });

  test('повторная установка пользователя обновляет user', () => {
    useAuthStore.getState().setUser(mockUser);
    const newUser = { ...mockUser, name: 'Другой' };
    useAuthStore.getState().setUser(newUser);
    expect(useAuthStore.getState().user).toEqual(newUser);
    expect(useAuthStore.getState().isAuthenticated).toBe(true);
    console.info('✅ Повторная установка пользователя работает');
  });

  test('logout очищает localStorage', () => {
    localStorage.setItem('token', 'test');
    useAuthStore.getState().logout();
    expect(localStorage.getItem('token')).toBeNull();
    console.info('✅ logout очищает localStorage');
  });

  test('после logout нельзя получить пользователя', () => {
    useAuthStore.getState().setUser(mockUser);
    useAuthStore.getState().logout();
    expect(useAuthStore.getState().user).toBeNull();
    expect(useAuthStore.getState().isAuthenticated).toBe(false);
    console.info('✅ После logout пользователь недоступен');
  });
});

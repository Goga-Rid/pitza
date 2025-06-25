import { describe, test, expect, vi, beforeEach } from 'vitest';
import * as api from '../../src/services/api';

vi.mock('axios', () => ({
  default: {
    create: () => ({
      post: vi.fn(() => Promise.resolve({ data: { token: 'test-token' } })),
      get: vi.fn(() => Promise.resolve({ data: {} })),
      interceptors: { request: { use: vi.fn() }, response: { use: vi.fn() } },
    }),
  },
}));

describe('api', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('login сохраняет токен и возвращает данные', async () => {
    const credentials = { email: 'test@mail.com', password: '1234' };
    const res = await api.login(credentials as any);
    expect(res.token).toBe('test-token');
    expect(localStorage.getItem('token')).toBe('test-token');
    console.info('✅ login сохраняет токен и возвращает данные');
  });

  test('register сохраняет токен и возвращает данные', async () => {
    const credentials = { email: 'test@mail.com', password: '1234', name: 'Test' };
    const res = await api.register(credentials as any);
    expect(res.token).toBe('test-token');
    expect(localStorage.getItem('token')).toBe('test-token');
    console.info('✅ register сохраняет токен и возвращает данные');
  });
});

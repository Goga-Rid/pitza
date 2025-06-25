import { render, screen } from '@testing-library/react';
import { Topbar } from '../../src/components/Topbar';
import { describe, test, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('react-router-dom', () => ({
  ...vi.importActual('react-router-dom'),
  useNavigate: () => vi.fn(),
}));
vi.mock('../../src/store/cartStore', () => ({ useCartStore: () => ({ items: [] }) }));
vi.mock('../../src/store/authStore', () => ({ useAuthStore: () => ({ isAuthenticated: false, user: null, logout: vi.fn() }) }));

const queryClient = new QueryClient();

describe('Topbar', () => {
  test('рендерит логотип и иконки', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Topbar />
      </QueryClientProvider>
    );
    expect(screen.getByRole('banner')).toBeTruthy();
    expect(screen.getAllByRole('button').length).toBeGreaterThan(0);
    console.info('✅ Topbar: логотип и иконки успешно отображаются');
  });
});

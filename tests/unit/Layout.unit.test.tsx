import { render, screen } from '@testing-library/react';
import { Layout } from '../../src/components/Layout';
import { describe, test, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../src/store/authStore', () => ({ useAuthStore: () => ({ isAuthenticated: false, logout: vi.fn() }) }));
vi.mock('../../src/store/cartStore', () => ({ useCartStore: () => ({ items: [] }) }));

describe('Layout', () => {
  test('рендерит layout и детей', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Layout>
          <div>Контент</div>
        </Layout>
      </MemoryRouter>
    );
    expect(screen.getByText('Контент')).toBeTruthy();
    expect(screen.getByRole('banner')).toBeTruthy();
    console.info('✅ Layout: layout и дети успешно отображаются');
  });
});

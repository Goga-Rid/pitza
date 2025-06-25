import { render, screen } from '@testing-library/react';
import { ProtectedRoute } from '../../src/components/ProtectedRoute';
import { describe, test, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

vi.mock('../../src/store/authStore', () => ({
  useAuthStore: () => ({ isAuthenticated: true, isLoading: false })
}));

describe('ProtectedRoute', () => {
  test('рендерит детей при isAuthenticated', () => {
    render(
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ProtectedRoute>
          <div>Доступно</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(screen.getByText('Доступно')).toBeTruthy();
    console.info('✅ ProtectedRoute: дети отображаются при isAuthenticated');
  });
});

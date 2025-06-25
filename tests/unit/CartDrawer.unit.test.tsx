import { render, screen } from '@testing-library/react';
import { CartDrawer } from '../../src/components/CartDrawer';
import { describe, test, expect, vi } from 'vitest';

vi.mock('../../src/store/cartStore', () => ({
  useCartStore: () => ({
    items: [],
    addItem: vi.fn(),
    updateQuantity: vi.fn(),
    removeItem: vi.fn(),
    clearCart: vi.fn(),
  })
}));
vi.mock('@tanstack/react-query', () => ({
  useQuery: () => ({ data: null, refetch: vi.fn() }),
  useMutation: () => ({ mutate: vi.fn(), isPending: false })
}));
vi.mock('react-router-dom', () => ({ useNavigate: () => vi.fn() }));

describe('CartDrawer', () => {
  test('рендерит пустую корзину', () => {
    render(<CartDrawer open={true} onClose={() => {}} />);
    expect(screen.getByRole('presentation')).toBeTruthy();
  });
});

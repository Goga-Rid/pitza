import { render, screen } from '@testing-library/react';
import { ProductModal } from '../../src/components/ProductModal';
import { describe, test, expect, vi } from 'vitest';

vi.mock('@tanstack/react-query', () => ({ useQuery: () => ({ data: [], isLoading: false }) }));
vi.mock('../../src/store/cartStore', () => ({ useCartStore: () => ({ addItem: vi.fn() }) }));

const product = { id: 1, name: 'Пицца', price: 100, description: '', category: 'pizza', image_url: '', available: true, created_at: '', weight: 400 };

describe('ProductModal', () => {
  test('рендерит модальное окно с продуктом', () => {
    render(
      <ProductModal open={true} onClose={() => {}} product={product} />
    );
    expect(screen.getByText('Пицца')).toBeTruthy();
    expect(screen.getByRole('button', { name: /в корзину/i })).toBeTruthy();
  });
});

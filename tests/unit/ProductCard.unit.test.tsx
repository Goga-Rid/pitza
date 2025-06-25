import { render, screen } from '@testing-library/react';
import { describe, test, expect } from 'vitest';
import { ProductCard } from '../../src/components/ProductCard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const product = {
  id: 1,
  name: 'Сырная',
  price: 399,
  description: '',
  category: 'pizza',
  image_url: '',
  available: true,
  created_at: '',
  weight: 400,
};

const queryClient = new QueryClient();

describe('ProductCard', () => {
  test('отображает название, цену и кнопку', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProductCard product={product} />
      </QueryClientProvider>
    );
    expect(screen.getByText('Сырная')).toBeTruthy();
    expect(screen.getByText(/от 399/)).toBeTruthy();
    expect(screen.getByRole('button', { name: /выбрать/i })).toBeTruthy();
    console.info('✅ Карточка товара отображает основные данные');
  });
});

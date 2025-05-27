import { expect, test, beforeEach, describe } from 'vitest';
import { useCartStore } from '../../src/store/cartStore';

describe('cartStore', () => {
  beforeEach(() => {
    useCartStore.getState().clearCart();
  });

  const product = { id: 1, name: 'Test', price: 100, description: '', category: '', image_url: '', available: true, created_at: '' };

  test('добавляет товар в корзину', async () => {
    await useCartStore.getState().addItem(product);
    expect(useCartStore.getState().items.length).toBe(1);
    expect(useCartStore.getState().items[0].product.id).toBe(1);
  });

  test('удаляет товар из корзины', async () => {
    await useCartStore.getState().addItem(product);
    await useCartStore.getState().removeItem(1);
    expect(useCartStore.getState().items.length).toBe(0);
  });

  test('очищает корзину', async () => {
    await useCartStore.getState().addItem(product);
    await useCartStore.getState().clearCart();
    expect(useCartStore.getState().items.length).toBe(0);
  });
});
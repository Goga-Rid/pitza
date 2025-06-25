import { describe, test, expect, beforeEach } from 'vitest';
import { useFavoritesStore } from '../../src/store/favoritesStore';

const productId = 42;

// Для чистоты тестов сбрасываем стор
const resetFavorites = () => {
  useFavoritesStore.setState({ favorites: [] });
};

describe('favoritesStore', () => {
  beforeEach(() => {
    resetFavorites();
  });

  test('добавляет товар в избранное', () => {
    useFavoritesStore.getState().addFavorite(productId);
    expect(useFavoritesStore.getState().favorites).toContain(productId);
    console.info('✅ Товар успешно добавлен в избранное');
  });

  test('удаляет товар из избранного', () => {
    useFavoritesStore.getState().addFavorite(productId);
    useFavoritesStore.getState().removeFavorite(productId);
    expect(useFavoritesStore.getState().favorites).not.toContain(productId);
    console.info('✅ Товар успешно удалён из избранного');
  });

  test('проверяет наличие товара в избранном', () => {
    useFavoritesStore.getState().addFavorite(productId);
    expect(useFavoritesStore.getState().isFavorite(productId)).toBe(true);
    expect(useFavoritesStore.getState().isFavorite(999)).toBe(false);
    console.info('✅ Проверка наличия товара в избранном работает');
  });

  test('переключает избранное', () => {
    useFavoritesStore.getState().toggleFavorite(productId);
    expect(useFavoritesStore.getState().isFavorite(productId)).toBe(true);
    useFavoritesStore.getState().toggleFavorite(productId);
    expect(useFavoritesStore.getState().isFavorite(productId)).toBe(false);
    console.info('✅ Переключение избранного работает');
  });
});

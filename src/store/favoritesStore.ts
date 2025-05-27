import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// import type { Product } from '../types';

interface FavoritesStore {
  favorites: number[];
  addFavorite: (productId: number) => void;
  removeFavorite: (productId: number) => void;
  isFavorite: (productId: number) => boolean;
  toggleFavorite: (productId: number) => void;
}

export const useFavoritesStore = create<FavoritesStore>()(
  persist(
    (set, get) => ({
      favorites: [],
      addFavorite: (productId) => {
        set((state) => ({
          favorites: [...state.favorites, productId],
        }));
      },
      removeFavorite: (productId) => {
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== productId),
        }));
      },
      isFavorite: (productId) => {
        return get().favorites.includes(productId);
      },
      toggleFavorite: (productId) => {
        const isFavorite = get().isFavorite(productId);
        if (isFavorite) {
          get().removeFavorite(productId);
        } else {
          get().addFavorite(productId);
        }
      },
    }),
    {
      name: 'favorites-storage',
    }
  )
); 
import { useQuery } from '@tanstack/react-query';
import { getFavorites, getProducts } from '../services/api';
import { useState, useMemo } from 'react';
import { Box, Typography, Container, CircularProgress } from '@mui/material';
import { ProductCard } from '../components/ProductCard';
import { useCartStore } from '../store/cartStore';
import { ProductModal } from '../components/ProductModal';
import type { Product } from '../types';

export const FavoritesPage = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { data: favorites = [], isLoading: favLoading } = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavorites,
  });
  const { data: productsByCategory = {}, isLoading: prodLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
  const { addItem } = useCartStore();

  const allProducts = Object.values(productsByCategory).flat();

  const favoriteProducts = useMemo(() => {
    const favIds = new Set(favorites.map(f => f.product_id));
    return allProducts
      .filter(p => favIds.has(p.id))
      .map(p => ({ ...p, isFavorite: true }));
  }, [favorites, allProducts]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  if (favLoading || prodLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ pt: 6, pb: 8 }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 5, letterSpacing: 0.5, textAlign: 'left' }}>
        Избранное
      </Typography>
      {favoriteProducts.length === 0 ? (
        <Box sx={{ mt: 2 }}>
          <Typography color="text.secondary" variant="h6" sx={{ textAlign: 'left' }}>
            У вас нет избранных товаров
          </Typography>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 5,
          }}
        >
          {favoriteProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => handleProductClick(product)}
            />
          ))}
        </Box>
      )}
      <ProductModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        product={selectedProduct}
        onAddToCart={handleAddToCart}
      />
    </Container>
  );
}; 
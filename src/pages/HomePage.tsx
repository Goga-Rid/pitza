import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getProducts, getFavorites } from '../services/api';
import { ProductCard } from '../components/ProductCard';
import { useCartStore } from '../store/cartStore';
import { MenuFilters } from '../components/MenuFilters';
import { ProductModal } from '../components/ProductModal';
import type { Product } from '../types';

interface ProductsByCategory {
  [key: string]: Product[];
}

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Все');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { addItem } = useCartStore();

  const { data: productsByCategory = {}, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
  const { data: favorites = [] } = useQuery({
    queryKey: ['favorites'],
    queryFn: getFavorites,
  });

  const favoriteIds = new Set(favorites.map(({ product_id }) => product_id));
  const favoriteMap = new Map(favorites.map(({ product_id, id }) => [product_id, id]));
  const allProducts = Object.values(productsByCategory as ProductsByCategory).flat();

  const filteredProducts = allProducts
    .map(product => ({
      ...product,
      isFavorite: favoriteIds.has(product.id),
      favoriteId: favoriteMap.get(product.id),
    }))
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (product.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Все' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setModalOpen(true);
  };

  const handleAddToCart = (product: Product, quantity: number) => {
    for (let i = 0; i < quantity; i++) {
      addItem(product);
    }
  };

  if (isLoading) {
    return (
      <Container>
        <Typography>Загрузка...</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ background: '#fff', minHeight: '100vh', py: 0 }}>
      <Container maxWidth="lg" sx={{ pt: 6, pb: 8 }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 800, mb: 5, letterSpacing: 0.5 }}>
          Меню
        </Typography>
        <MenuFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 5,
          }}
        >
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              favoriteId={product.favoriteId}
              onClick={() => handleProductClick(product)}
            />
          ))}
        </Box>
        <ProductModal
          open={modalOpen}
          onClose={() => setModalOpen(false)}
          product={selectedProduct}
          onAddToCart={handleAddToCart}
        />
      </Container>
    </Box>
  );
}; 
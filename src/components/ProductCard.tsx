import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  IconButton,
  Box,
  // Rating,
  // Chip,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addFavorite, removeFavorite } from '../services/api';
import type { Product } from '../types';
// import { useCartStore } from '../store/cartStore';

interface ProductCardProps {
  product: Product & { favoriteId?: number };
  favoriteId?: number;
  // onAddToCart?: (product: Product) => void;
  onClick?: () => void;
}

export const ProductCard = ({ product, onClick, favoriteId }: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(!!product.isFavorite);
  // const { addItem } = useCartStore();
  const queryClient = useQueryClient();

  useEffect(() => {
    setIsFavorite(!!product.isFavorite);
  }, [product.isFavorite]);

  const { mutate: addToFavorites } = useMutation({
    mutationFn: () => addFavorite({ product_id: product.id }),
    onSuccess: () => {
      setIsFavorite(true);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const { mutate: removeFromFavorites } = useMutation({
    mutationFn: () => removeFavorite({ product_id: product.id }),
    onSuccess: () => {
      setIsFavorite(false);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite) {
      setIsFavorite(false);
      const id = favoriteId ?? product.favoriteId;
      if (typeof id === 'number') {
        removeFromFavorites(id);
      }
    } else {
      setIsFavorite(true);
      addToFavorites();
    }
  };

  return (
    <Card
      onClick={onClick}
      sx={{
        maxWidth: 340,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        boxShadow: '0 4px 24px 0 rgba(0,0,0,0.06)',
        p: 2,
        transition: 'box-shadow 0.2s',
        '&:hover': { boxShadow: '0 8px 32px 0 rgba(0,0,0,0.10)', cursor: 'pointer' },
        background: '#fff',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="180"
          image={product.image_url || '/placeholder.png'}
          alt={product.name}
          sx={{ objectFit: 'contain', borderRadius: 3, background: '#fafafa' }}
        />
        <IconButton
          onClick={handleFavoriteClick}
          sx={{
            position: 'absolute',
            top: 12,
            right: 12,
            background: '#fff',
            boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
            '&:hover': { background: '#fff' },
            zIndex: 2,
          }}
          color={isFavorite ? 'error' : 'default'}
        >
          {isFavorite ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', p: 0, pt: 2 }}>
        <Typography gutterBottom variant="h6" component="div" sx={{ fontWeight: 600, textAlign: 'center', mb: 1 }}>
          {product.name}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            textAlign: 'center', 
            mb: 2, 
            height: '40px',
            overflow: 'hidden',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            lineHeight: '20px'
          }}
        >
          {product.description || 'Нет описания'}
        </Typography>
        <Box sx={{ mt: 'auto', width: '100%' }}>
          <Typography variant="h6" color="primary" sx={{ mb: 2, fontWeight: 700, color: '#222', textAlign: 'center' }}>
            {product.price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
          </Typography>
          <Button
            variant="contained"
            fullWidth
            onClick={e => { e.stopPropagation(); if (onClick) onClick(); }}
            disabled={!product.available}
            sx={{
              background: product.available ? '#FF6900' : '#ccc',
              color: '#fff',
              borderRadius: 3,
              fontWeight: 600,
              fontSize: 16,
              py: 1.2,
              boxShadow: 'none',
              '&:hover': { 
                background: product.available ? '#ff8500' : '#ccc',
                boxShadow: product.available ? '0 2px 8px 0 rgba(255,105,0,0.10)' : 'none'
              },
              textTransform: 'none',
            }}
          >
            {product.available ? 'Выбрать' : 'Нет в наличии'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}; 
import { useState, useEffect } from 'react';
import {
  Card, CardContent, CardMedia, Typography, Button, IconButton, Box,
} from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addFavorite, removeFavorite } from '../services/api';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product & { favoriteId?: number };
  favoriteId?: number;
  onClick?: () => void;
}

export const ProductCard = ({ product, onClick, favoriteId }: ProductCardProps) => {
  const [isFavorite, setIsFavorite] = useState(!!product.isFavorite);
  const [quantity, setQuantity] = useState(0);
  const queryClient = useQueryClient();

  useEffect(() => setIsFavorite(!!product.isFavorite), [product.isFavorite]);

  const { mutate: addToFavorites } = useMutation({
    mutationFn: () => addFavorite({ product_id: product.id }),
    onSuccess: () => {
      setIsFavorite(true);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
  const { mutate: removeFromFavorites } = useMutation({
    mutationFn: (id: number) => removeFavorite({ product_id: id }),
    onSuccess: () => {
      setIsFavorite(false);
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const id = favoriteId ?? product.favoriteId;
    isFavorite ? (typeof id === 'number' && removeFromFavorites(id)) : addToFavorites();
    setIsFavorite(!isFavorite);
  };

  const handleQuantity = (delta: number) => (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuantity(q => Math.max(0, q + delta));
  };

  return (
    <Card
      onClick={onClick}
      sx={{
        width: '100%',
        maxWidth: 400,
        minWidth: 270,
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 4,
        boxShadow: '0 4px 18px rgba(60,60,60,0.18)', // тень темнее и чуть больше
        p: 0,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          cursor: 'pointer',
          boxShadow: '0 8px 28px rgba(60,60,60,0.22)', // тень темнее при ховере
        },
        background: '#fff',
        border: '1px solid #f0f0f0',
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          aspectRatio: '1 / 1',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          overflow: 'hidden',
        }}
      >
        <CardMedia
          component="img"
          image={product.image_url || '/placeholder.png'}
          alt={product.name}
          sx={{ width: '80%', height: 'auto', objectFit: 'contain' }}
        />
        <IconButton
          onClick={handleFavoriteClick}
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            background: 'rgba(204, 201, 201, 0.56)',
            '&:hover': { background: 'rgba(255, 193, 152, 0.9)' },
            zIndex: 2,
          }}
          color={isFavorite ? 'error' : 'default'}
        >
          {isFavorite ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
      </Box>
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2, pt: 1.5, pb: 1.5 }}>
        <Box sx={{ mb: 1.5 }}>
          <Typography variant="h6" component="div" sx={{ fontWeight: 700, fontSize: '1.1rem', color: '#222', mb: 0.5 }}>
            {product.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500, fontSize: '0.9rem', color: '#666' }}>
            {product.weight || '400'} г
          </Typography>
        </Box>
        <Box sx={{ mt: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', pt: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.2rem', color: '#222' }}>
            от {product.price.toLocaleString('ru-RU', { minimumFractionDigits: 0 })} ₽
          </Typography>
          {quantity > 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', background: '#dc5b05', borderRadius: 20, color: '#fff', px: 2, py: 0.5 }}>
              <Typography onClick={handleQuantity(-1)} sx={{ cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1, px: 1 }}>-</Typography>
              <Typography sx={{ px: 1 }}>{quantity}</Typography>
              <Typography onClick={handleQuantity(1)} sx={{ cursor: 'pointer', fontSize: '1.2rem', lineHeight: 1, px: 1 }}>+</Typography>
            </Box>
          ) : (
            <Button
              variant="contained"
              onClick={e => { e.stopPropagation(); setQuantity(1); onClick?.(); }}
              disabled={!product.available}
              sx={{ background: '#dc5b05', color: '#fff', borderRadius: 20, fontWeight: 600, fontSize: '0.85rem', px: 2, py: 0.8, boxShadow: 'none', textTransform: 'none', '&:hover': { background: '#ff8500', boxShadow: 'none' }, minWidth: 100 }}
            >
              Выбрать
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  IconButton,
  Button,
  Rating,
  Divider,
  CircularProgress,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { useQuery } from '@tanstack/react-query';
import type { Product } from '../types';
import { useCartStore } from '../store/cartStore';
import { getProductReviews } from '../services/api';

interface ProductModalProps {
  open: boolean;
  onClose: () => void;
  product: Product | null;
  onAddToCart?: (product: Product, quantity: number) => void;
}

export const ProductModal = ({ open, onClose, product }: ProductModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();

  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({
    queryKey: ['reviews', product?.id],
    queryFn: () => product ? getProductReviews(product.id) : Promise.resolve([]),
    enabled: !!product,
  });

  if (!product) return null;

  const handleAdd = () => setQuantity(q => q + 1);
  const handleRemove = () => setQuantity(q => (q > 1 ? q - 1 : 1));
  const handleAddToCart = () => {
    addItem(product, quantity);
    setQuantity(1);
    onClose();
  };

  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: 0, sm: 4 },
          p: { xs: 0, sm: 2 },
          m: 0,
          width: '100vw',
          maxWidth: { xs: '100vw', sm: '700px' },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 0,
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 2 },
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: { xs: 18, sm: 24 } }} component="span">{product.name}</Typography>
        <IconButton onClick={onClose} sx={{ ml: 1 }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'center', sm: 'flex-start' },
          gap: { xs: 2, sm: 4 },
          pt: { xs: 1, sm: 2 },
          px: { xs: 2, sm: 2 },
          pb: { xs: 2, sm: 2 },
        }}
      >
        <Box
          sx={{
            flex: { xs: 'unset', sm: '0 0 320px' },
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: { xs: '100%', sm: 320 },
            mb: { xs: 2, sm: 0 },
          }}
        >
          <Box
            component="img"
            src={product.image_url || '/placeholder.png'}
            alt={product.name}
            sx={{
              width: { xs: '90vw', sm: 320 },
              maxWidth: { xs: 340, sm: 320 },
              height: { xs: '90vw', sm: 320 },
              maxHeight: { xs: 340, sm: 320 },
              objectFit: 'contain',
              borderRadius: 3,
              background: '#fafafa',
              mx: { xs: 'auto', sm: 0 },
              display: 'block',
              boxShadow: { xs: 1, sm: 0 },
            }}
          />
        </Box>
        <Box
          sx={{
            flex: 1,
            minWidth: { xs: 'unset', sm: 260 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            px: 0,
          }}
        >
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2, fontSize: { xs: 15, sm: 16 } }}>
            {product.description || 'Нет описания'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Rating value={averageRating} precision={0.5} readOnly size={typeof window !== 'undefined' && window.innerWidth < 600 ? 'small' : 'medium'} />
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: 13, sm: 14 } }}>
              ({reviews.length} {reviews.length === 1 ? 'отзыв' : 'отзывов'})
            </Typography>
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, fontSize: { xs: 20, sm: 28 } }}>
            {product.price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <IconButton onClick={handleRemove} size="small" sx={{ border: '1px solid #eee', width: 36, height: 36 }}>
              <RemoveIcon />
            </IconButton>
            <Typography variant="h6" sx={{ minWidth: 32, textAlign: 'center', fontSize: { xs: 18, sm: 20 } }}>{quantity}</Typography>
            <IconButton onClick={handleAdd} size="small" sx={{ border: '1px solid #eee', width: 36, height: 36 }}>
              <AddIcon />
            </IconButton>
          </Box>
          <Button
            variant="contained"
            size="large"
            sx={{
              background: '#dc5b05',
              color: '#fff',
              borderRadius: 3,
              fontWeight: 700,
              fontSize: { xs: 17, sm: 18 },
              py: 1.5,
              mt: 2,
              textTransform: 'none',
              width: '100%',
              boxShadow: { xs: 2, sm: 0 },
            }}
            fullWidth
            onClick={handleAddToCart}
            disabled={!product.available}
          >
            {product.available 
              ? `В корзину за ${(product.price * quantity).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}`
              : 'Нет в наличии'
            }
          </Button>
          {reviews.length > 0 && (
            <>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" sx={{ mb: 2, fontSize: { xs: 16, sm: 20 } }}>Отзывы</Typography>
              {reviewsLoading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                  <CircularProgress size={24} />
                </Box>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {reviews.map(review => (
                    <Box key={review.id} sx={{ p: 2, background: '#fafafa', borderRadius: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                        <Rating value={review.rating} readOnly size="small" />
                        <Typography variant="caption" color="text.secondary">
                          {(() => {
                            const dateStr = review.createdAt;
                            const date = dateStr ? new Date(dateStr) : null;
                            return date && !isNaN(date.getTime())
                              ? date.toLocaleDateString('ru-RU')
                              : '-';
                          })()}
                        </Typography>
                      </Box>
                      {review.comment && (
                        <Typography variant="body2">{review.comment}</Typography>
                      )}
                    </Box>
                  ))}
                </Box>
              )}
            </>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};
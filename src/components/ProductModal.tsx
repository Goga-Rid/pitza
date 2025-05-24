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
    <Dialog open={open} onClose={onClose} maxWidth="md" PaperProps={{ sx: { borderRadius: 4, p: 2 } }}>
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 0 }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>{product.name}</Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 4, pt: 2 }}>
        <Box sx={{ flex: '0 0 320px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Box
            component="img"
            src={product.image_url || '/placeholder.png'}
            alt={product.name}
            sx={{ width: 320, height: 320, objectFit: 'contain', borderRadius: 3, background: '#fafafa' }}
          />
        </Box>
        <Box sx={{ flex: 1, minWidth: 260, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            {product.description || 'Нет описания'}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
            <Rating value={averageRating} precision={0.5} readOnly />
            <Typography variant="body2" color="text.secondary">
              ({reviews.length} {reviews.length === 1 ? 'отзыв' : 'отзывов'})
            </Typography>
          </Box>

          <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
            {product.price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
            <IconButton onClick={handleRemove} size="small" sx={{ border: '1px solid #eee' }}>
              <RemoveIcon />
            </IconButton>
            <Typography variant="h6" sx={{ minWidth: 32, textAlign: 'center' }}>{quantity}</Typography>
            <IconButton onClick={handleAdd} size="small" sx={{ border: '1px solid #eee' }}>
              <AddIcon />
            </IconButton>
          </Box>

          <Button
            variant="contained"
            size="large"
            sx={{ background: '#FF6900', color: '#fff', borderRadius: 3, fontWeight: 700, fontSize: 18, py: 1.5, mt: 2, textTransform: 'none' }}
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
              <Typography variant="h6" sx={{ mb: 2 }}>Отзывы</Typography>
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
                            const dateStr = review.createdAt || (review as any).created_at;
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
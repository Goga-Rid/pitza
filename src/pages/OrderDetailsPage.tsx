import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getOrderById, getProducts } from '../services/api';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Button,
  Divider,
  IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RateReviewIcon from '@mui/icons-material/RateReview';
import { useMemo, useState } from 'react';
import { ReviewForm } from '../components/ReviewForm';

const statusConfig: Record<string, { label: string; color: string; textColor: string }> = {
  'Оформлен': { 
    label: 'Оформлен', 
    color: '#ffa726',
    textColor: '#fff'
  },
  'Готовим': { 
    label: 'Готовим', 
    color: '#29b6f6',
    textColor: '#fff'
  },
  'В доставке': { 
    label: 'В доставке', 
    color: '#ab47bc',
    textColor: '#fff'
  },
  'Доставлен': { 
    label: 'Доставлен', 
    color: '#66bb6a',
    textColor: '#fff'
  },
};

export const OrderDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [reviewProduct, setReviewProduct] = useState<{ id: number; name: string } | null>(null);
  const { data, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderById(Number(id)),
    enabled: !!id,
  });
  const { data: productsByCategory = {} } = useQuery({
    queryKey: ['products'],
    queryFn: getProducts,
  });
  const allProducts = useMemo(() => Object.values(productsByCategory).flat(), [productsByCategory]);
  const order = data?.order;
  const items = data?.order_items || [];

  if (isLoading || !order) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  console.log('Order details status:', order.status, 'Config:', statusConfig[order.status]);

  return (
    <Box sx={{ maxWidth: 700, mx: 'auto', mt: 6, mb: 8 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate(-1)} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          Заказ №{order.id}
        </Typography>
        <Chip 
          label={statusConfig[order.status]?.label || order.status}
          sx={{ 
            ml: 2,
            fontWeight: 600,
            bgcolor: statusConfig[order.status]?.color || '#9e9e9e',
            color: statusConfig[order.status]?.textColor || '#fff',
          }}
        />
      </Box>
      <Typography color="text.secondary" sx={{ mb: 2 }}>
        {new Date(order.created_at).toLocaleString('ru-RU', { dateStyle: 'medium', timeStyle: 'short' })}
      </Typography>
      <Typography sx={{ mb: 2 }}>
        <b>Адрес доставки:</b> {order.address}
      </Typography>
      <Divider sx={{ mb: 3 }} />
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        Состав заказа
      </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
        {items.map(item => {
          const product = allProducts.find(p => p.id === item.product_variant_id);
          return (
            <Card key={item.id} elevation={1}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                {product && (
                  <Box component="img" src={product.image_url || '/placeholder.png'} alt={product.name} sx={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 2, mr: 2 }} />
                )}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                    {product ? product.name : `Позиция #${item.product_variant_id}`}
                  </Typography>
                  <Typography color="text.secondary">
                    x{item.quantity}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700 }}>
                    {(item.price * item.quantity).toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                  </Typography>
                  {order.status === 'Доставлен' && product && (
                    <Button
                      startIcon={<RateReviewIcon />}
                      onClick={() => setReviewProduct({ id: product.id, name: product.name })}
                      variant="outlined"
                      size="small"
                    >
                      Оценить
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>
      <Divider sx={{ mb: 3 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Сумма заказа:
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {order.total.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
        </Typography>
      </Box>
      
      {reviewProduct && (
        <ReviewForm
          productId={reviewProduct.id}
          productName={reviewProduct.name}
          onClose={() => setReviewProduct(null)}
        />
      )}
    </Box>
  );
}; 
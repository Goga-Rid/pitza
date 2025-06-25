import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import { useCartStore } from '../store/cartStore';
import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getCurrentUser, createOrder } from '../services/api';
import { AddressModal } from './AddressModal';
import type { User } from '../types';
import { useNavigate } from 'react-router-dom';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

export const CartDrawer = ({ open, onClose }: CartDrawerProps) => {
  const { items, addItem, updateQuantity, removeItem, clearCart } = useCartStore();
  const navigate = useNavigate();
  const grouped = items.reduce<{ [id: number]: { item: typeof items[0]; count: number } }>((acc, item) => {
    if (acc[item.product.id]) {
      acc[item.product.id].count += item.quantity;
    } else {
      acc[item.product.id] = { item, count: item.quantity };
    }
    return acc;
  }, {});
  const products = Object.values(grouped);
  const total = products.reduce((sum, { item, count }) => sum + item.product.price * count, 0);
  const totalCount = products.reduce((sum, { count }) => sum + count, 0);

  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [orderError, setOrderError] = useState('');
  const { data: user, refetch: refetchUser } = useQuery<User | null>({
    queryKey: ['me'],
    queryFn: getCurrentUser,
    enabled: open,
    retry: false,
  });
  const { mutate: submitOrder, isPending: isOrderPending } = useMutation({
    mutationFn: () => createOrder(products.map(({ item, count }) => ({ product_id: item.product.id, quantity: count }))),
    onSuccess: () => {
      clearCart();
      onClose();
      setOrderError('');
      alert('Заказ успешно создан!');
    },
    onError: () => {
      setOrderError('Не удалось оформить заказ. Попробуйте еще раз.');
    },
  });

  const handleOrder = () => {
    if (!user) {
      onClose();
      setTimeout(() => {
        navigate('/register', { state: { from: 'cart', message: 'Зарегистрируйтесь для оформления заказа' } });
      }, 200);
      return;
    }
    if (!user.address) {
      setAddressModalOpen(true);
      return;
    }
    submitOrder();
  };

  const handleAddressSuccess = () => {
    refetchUser();
    setTimeout(() => {
      setAddressModalOpen(false);
      submitOrder();
    }, 300);
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: { xs: '100vw', sm: 420 }, maxWidth: '100vw' } }}
    >
      <Box sx={{ p: { xs: 1, sm: 3 }, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>{totalCount} товар{totalCount === 1 ? '' : totalCount < 5 ? 'а' : 'ов'} на {total.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</Typography>
          <IconButton onClick={onClose}><CloseIcon /></IconButton>
        </Box>
        <Divider />
        <List sx={{ p: 0 }}>
          {products.length === 0 && (
            <ListItem>
              <ListItemText primary="Корзина пуста" />
            </ListItem>
          )}
          {products.map(({ item, count }) => (
            <ListItem key={item.product.id} sx={{ alignItems: 'flex-start' }}>
              <Box component="img" src={item.product.image_url || '/placeholder.png'} alt={item.product.name} sx={{ width: 64, height: 64, objectFit: 'cover', borderRadius: 2, mr: 2 }} />
              <ListItemText
                primary={item.product.name}
                secondary={item.product.price.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
              />
              <ListItemSecondaryAction sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton size="small" onClick={() => updateQuantity(item.product.id, count - 1)} disabled={count <= 1}><RemoveIcon /></IconButton>
                <Typography>{count}</Typography>
                <IconButton size="small" onClick={() => addItem(item.product)}><AddIcon /></IconButton>
                <IconButton size="small" onClick={() => removeItem(item.product.id)}><DeleteIcon /></IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ mt: 2 }} />
        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Сумма заказа: {total.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}</Typography>
          {orderError && <Typography color="error" sx={{ mb: 1 }}>{orderError}</Typography>}
          <Button
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ fontWeight: 700, fontSize: 18, py: 1.5, background: '#FF6900', color: '#fff', borderRadius: 3, textTransform: 'none' }}
            onClick={handleOrder}
            disabled={products.length === 0 || isOrderPending}
          >
            {isOrderPending ? 'Оформляем...' : 'К оформлению заказа'}
          </Button>
          <Button variant="outlined" color="error" fullWidth size="large" sx={{ fontWeight: 700, fontSize: 16, borderRadius: 3, textTransform: 'none' }} onClick={clearCart} disabled={products.length === 0}>
            Очистить корзину
          </Button>
        </Box>
        <AddressModal open={addressModalOpen} onClose={() => setAddressModalOpen(false)} onSuccess={handleAddressSuccess} />
      </Box>
    </Drawer>
  );
};

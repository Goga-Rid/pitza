import { useQuery } from '@tanstack/react-query';
import { getUserOrders } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { PizzaSpinner } from '../components/PizzaSpinner';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActionArea,
  Chip,
} from '@mui/material';

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

export const OrdersPage = () => {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: getUserOrders,
  });
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <Box
      sx={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1    }}>
        <PizzaSpinner />
        <Typography variant="h6" sx={{ color: '#dc5b05', fontSize: 30, fontWeight: 700 }}>
          Загрузка заказов...
        </Typography>
      </Box>
    </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: 'auto', mt: { xs: 2, sm: 6 }, mb: { xs: 4, sm: 8 }, px: { xs: 1, sm: 0 } }}>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: { xs: 2, sm: 4 }, textAlign: { xs: 'center', sm: 'left' } }}>
        Мои заказы
      </Typography>
      {orders.length === 0 ? (
        <Typography color="text.secondary" sx={{ textAlign: { xs: 'center', sm: 'left' } }}>У вас пока нет заказов.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, sm: 3 } }}>
          {orders.map(({ order, item_count }) => {
            console.log('Order status:', order.status, 'Config:', statusConfig[order.status]);
            return (
              <Card elevation={2} key={order.id} sx={{ borderRadius: 3 }}>
                <CardActionArea onClick={() => navigate(`/orders/${order.id}`)}>
                  <CardContent sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: { xs: 'flex-start', sm: 'center' }, justifyContent: 'space-between', gap: 2 }}>
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        Заказ №{order.id}
                      </Typography>
                      <Typography color="text.secondary" sx={{ mb: 1 }}>
                        {new Date(order.created_at.replace(' ', 'T') + 'Z').toLocaleString('ru-RU', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                          timeZone: 'Europe/Moscow',
                        })}
                      </Typography>
                      <Chip 
                        label={statusConfig[order.status]?.label || order.status}
                        sx={{ 
                          fontWeight: 600,
                          bgcolor: statusConfig[order.status]?.color || '#9e9e9e',
                          color: statusConfig[order.status]?.textColor || '#fff',
                        }}
                      />
                    </Box>
                    <Box sx={{ textAlign: { xs: 'left', sm: 'right' }, mt: { xs: 2, sm: 0 } }}>
                      <Typography variant="h6" sx={{ fontWeight: 700 }}>
                        {order.total.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' })}
                      </Typography>
                      <Typography color="text.secondary">
                        {item_count} {item_count === 1 ? 'позиция' : item_count < 5 ? 'позиции' : 'позиций'}
                      </Typography>
                    </Box>
                  </CardContent>
                </CardActionArea>
              </Card>
            );
          })}
        </Box>
      )}
    </Box>
  );
};
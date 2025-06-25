import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Alert,
  Container,
} from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { register, validateToken, getCurrentUser } from '../services/api';
import { useAuthStore } from '../store/authStore';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { mutate: registerMutation, isPending } = useMutation({
    mutationFn: register,
    onSuccess: async () => {
      try {
        const isValid = await validateToken();
        if (isValid) {
          const user = await getCurrentUser();
          setUser(user);
          navigate('/');
        } else {
          setError('Ошибка валидации токена');
          localStorage.removeItem('token');
        }
      } catch {
        setError('Ошибка получения данных пользователя');
        localStorage.removeItem('token');
      }
    },
    onError: (error: Error) => {
        setError((error as unknown as { response: { data: { message: string } } }).response?.data?.message || 'Ошибка регистрации');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    registerMutation({ name, email, password });
  };

  return (
    <Container maxWidth="lg" sx={{ pt: { xs: 2, sm: 8 }, pb: { xs: 4, sm: 8 } }}>
      <Box sx={{ maxWidth: 400, mx: 'auto', px: { xs: 1, sm: 0 } }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: { xs: 2, sm: 4 }, textAlign: 'center' }}>
          Регистрация
        </Typography>

        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: { xs: 2, sm: 4 } }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                name="name"
                label="Имя"
                fullWidth
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                name="email"
                label="Email"
                type="email"
                fullWidth
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                name="password"
                label="Пароль"
                type={showPassword ? 'text' : 'password'}
                fullWidth
                required
                sx={{ mb: 3 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockIcon color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                disabled={isPending}
                sx={{ 
                  mb: 2,
                  background: '#FF6900',
                  color: '#fff',
                  borderRadius: 3,
                  py: 1.5,
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: 16,
                  '&:hover': {
                    background: '#ff8500',
                  }
                }}
              >
                {isPending ? 'Регистрация...' : 'Зарегистрироваться'}
              </Button>
              <Typography align="center" color="text.secondary" sx={{ fontSize: { xs: 14, sm: 16 } }}>
                Уже есть аккаунт?{' '}
                <Link 
                  to="/login" 
                  style={{ 
                    color: '#FF6900', 
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  Войти
                </Link>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
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
import { login, validateToken, getCurrentUser } from '../services/api';
import { useAuthStore } from '../store/authStore';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useAuthStore();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const { mutate: loginMutation, isPending } = useMutation({
    mutationFn: login,
    onSuccess: async () => {
      try {
        const isValid = await validateToken();
        if (isValid) {
          const user = await getCurrentUser();
          setUser(user);
          const from = (location.state as { from: { pathname: string } })?.from?.pathname || '/';
          navigate(from);
        } else {
          setError('Ошибка валидации токена');
          localStorage.removeItem('token');
        }
      } catch {
        setError('Ошибка получения данных пользователя');
        localStorage.removeItem('token');
      }
    },
    onError: (error: unknown) => {
    setError((error as { response: { data: { message: string } } }).response?.data?.message || 'Ошибка входа');
    },
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    loginMutation({ email, password });
  };

  return (
    <Container maxWidth="lg" sx={{ pt: 8, pb: 8 }}>
      <Box sx={{ maxWidth: 400, mx: 'auto' }}>
        <Typography variant="h4" sx={{ fontWeight: 800, mb: 4, textAlign: 'center' }}>
          Вход в аккаунт
        </Typography>

        <Card sx={{ borderRadius: 4, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.05)' }}>
          <CardContent sx={{ p: 4 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
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
                {isPending ? 'Вход...' : 'Войти'}
              </Button>
              <Typography align="center" color="text.secondary">
                Нет аккаунта?{' '}
                <Link 
                  to="/register" 
                  style={{ 
                    color: '#FF6900', 
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  Зарегистрироваться
                </Link>
              </Typography>
            </form>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}; 
import { useState } from 'react';
import { AppBar, Toolbar, Box, Typography, IconButton, Badge, Menu, MenuItem, Avatar, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { CartDrawer } from './CartDrawer';

export const Topbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { items } = useCartStore();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [cartOpen, setCartOpen] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
    navigate('/');
  };

  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleCartClose = () => {
    setCartOpen(false);
  };

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0} 
        sx={{ 
          background: '#fff', 
          color: '#222', 
          borderBottom: '1px solid #eee',
          minHeight: 72,
          justifyContent: 'center'
        }}
      >
        <Toolbar sx={{ maxWidth: 1280, width: '100%', mx: 'auto', minHeight: 72, px: 3 }}>
          {/* Логотип */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: 4 }}>
            <Box 
              onClick={() => navigate('/')} 
              sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                textDecoration: 'none'
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  background: 'url(/logo.svg) center/contain no-repeat',
                  mr: 1.5,
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 800, letterSpacing: 1, color: '#222' }}>
                PITZA
              </Typography>
            </Box>
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Правая часть */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {isAuthenticated ? (
              <>
                <IconButton color="inherit" onClick={() => navigate('/favorites')}>
                  <FavoriteIcon />
                </IconButton>
                <IconButton color="inherit" onClick={handleCartOpen}>
                  <Badge badgeContent={items.length} color="primary">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>
                <IconButton
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ ml: 1 }}
                >
                  <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
                    {user?.name?.[0]?.toUpperCase() || <PersonIcon />}
                  </Avatar>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{
                    sx: {
                      mt: 1.5,
                      minWidth: 180,
                    }
                  }}
                >
                  <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                    Профиль
                  </MenuItem>
                  <MenuItem onClick={() => { navigate('/orders'); handleClose(); }}>
                    Мои заказы
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    Выйти
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button 
                  variant="outlined" 
                  color="primary"
                  onClick={() => navigate('/login')}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3
                  }}
                >
                  Войти
                </Button>
                <Button 
                  variant="contained" 
                  color="primary"
                  onClick={() => navigate('/register')}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3
                  }}
                >
                  Регистрация
                </Button>
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <CartDrawer open={cartOpen} onClose={handleCartClose} />
    </>
  );
}; 
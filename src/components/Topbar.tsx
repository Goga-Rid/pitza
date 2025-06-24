import { useState } from 'react';
import { AppBar, Toolbar, Typography, Box, IconButton, Badge, Menu, MenuItem, Avatar, Button } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import LoginIcon from '@mui/icons-material/Login';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { CartDrawer } from './CartDrawer';
import logo from '../assets/header_logo.svg'

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
          background: '#F0F0F0', 
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
                width: 200,
                height: 60,
                backgroundImage: `url(${logo})`,
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                mr: 1.5,
                mt: 3
                }}
              />
            </Box>
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Правая часть */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mt: 4}}>
            {/* Cart — всегда доступна */}
            <Box sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center',
              justifyContent: 'center',
              width: 75,
              height: 60
            }}>
              <IconButton 
                color="inherit" 
                onClick={handleCartOpen}
                sx={{ p: 0 }}
              >
                <Badge badgeContent={items.length} color="primary">
                  <ShoppingCartIcon sx={{ fontSize: 40 }}/>
                </Badge>
              </IconButton>
              <Typography variant="caption" sx={{ fontSize: 13, fontWeight: 600, mt: 0.5 }}>
                Корзина
              </Typography>
            </Box>
            {/* Favorites и профиль — только для авторизованных */}
            {isAuthenticated && (
              <>
                {/* Favorites */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 75
                }}>
                  <IconButton 
                    color="inherit" 
                    onClick={() => navigate('/favorites')}
                    sx={{ p: 0 }}
                  >
                    <FavoriteBorderIcon sx={{ fontSize: 40 }}/>
                  </IconButton>
                  <Typography variant="caption" sx={{ fontSize: 13, fontWeight: 600, mt: 0.5 }}>
                    Избранное
                  </Typography>
                </Box>
                {/* Profile */}
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 75
                }}>
                  <IconButton
                    onClick={handleMenu}
                    color="inherit"
                    sx={{ p: 0 }}
                  >
                    <Avatar sx={{ width: 43, height: 43, bgcolor: '#dc5b05' }}>
                      {user?.name?.[0]?.toUpperCase() || <PersonIcon />}
                    </Avatar>
                  </IconButton>
                  <Typography variant="caption" sx={{ fontSize: 13, fontWeight: 600, mt: 0.5 }}>
                    Профиль
                  </Typography>
                </Box>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  PaperProps={{ sx: { mt: 1.5, minWidth: 180 } }}
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
            )}
            {/* Кнопки Войти/Регистрация — только если не авторизован */}
            {!isAuthenticated && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/login')}
                  startIcon={<LoginIcon />}
                  sx={{
                    width: 140,
                    height: 40,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    boxShadow: 'none',
                    borderColor: '#dc5b05',
                    color: '#dc5b05',
                    fontSize: 16,
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: '#b94a04',
                      backgroundColor: '#ffc198e6',
                      color: '#b94a04',
                    },
                  }}
                >
                  Войти
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<DriveFileRenameOutlineIcon />}
                  onClick={() => navigate('/register')}
                  sx={{
                    width: 160,
                    height: 40,
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 3,
                    backgroundColor: '#dc5b05',
                    color: '#fff',
                    fontSize: 16,
                    boxShadow: '0 2px 8px rgba(220,91,5,0.10)',
                    transition: 'all 0.2s',
                    '&:hover': {
                      backgroundColor: '#b94a04',
                      color: '#fff',
                      boxShadow: '0 4px 16px rgba(185,74,4,0.15)',
                    },
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
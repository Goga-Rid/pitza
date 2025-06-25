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
import logo from '../assets/header_logo.svg';

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
          minHeight: { xs: 56, sm: 72 },
          justifyContent: 'center'
        }}
      >
        <Toolbar sx={{ 
          maxWidth: 1280, 
          width: '100%', 
          mx: 'auto', 
          minHeight: { xs: 22, sm: 72 }, 
          px: { xs: 1, sm: 3 },
          py: { xs: 1, sm: 0 }
        }}>
          {/* Логотип - уменьшен на мобильных */}
          <Box sx={{ display: 'flex', alignItems: 'center', mr: { xs: 1, sm: 4 } }}>
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
                  width: { xs: 100, sm: 200 },
                  height: { xs: 30, sm: 60 },
                  backgroundImage: `url(${logo})`,
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  mr: { xs: 0.5, sm: 1.5 }
                }}
              />
            </Box>
          </Box>

          {/* Spacer */}
          <Box sx={{ flexGrow: 1 }} />

          {/* Правая часть - компактная на мобильных */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: { xs: 0, sm: 1.5 },
            '& > *': {
              mx: { xs: 0.5, sm: 0 }
            }
          }}>
            {/* Корзина - иконка без текста на мобильных */}
            <IconButton 
              color="inherit" 
              onClick={handleCartOpen}
              sx={{ 
                p: { xs: 0.5, sm: 1 },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}
            >
              <Badge badgeContent={items.length} color="primary">
                <ShoppingCartIcon sx={{ fontSize: { xs: 24, sm: 30 } }}/>
              </Badge>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: { xs: 'none', sm: 'block' },
                  fontSize: 13, 
                  fontWeight: 600, 
                  mt: 0.5 
                }}
              >
                Корзина
              </Typography>
            </IconButton>

            {/* Избранное - только для авторизованных */}
            {isAuthenticated && (
              <>
                <IconButton 
                  color="inherit" 
                  onClick={() => navigate('/favorites')}
                  sx={{ 
                    p: { xs: 0.5, sm: 1 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <FavoriteBorderIcon sx={{ fontSize: { xs: 24, sm: 30 } }}/>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: { xs: 'none', sm: 'block' },
                      fontSize: 13, 
                      fontWeight: 600, 
                      mt: 0.5 
                    }}
                  >
                    Избранное
                  </Typography>
                </IconButton>

                {/* Профиль - аватар без текста на мобильных */}
                <IconButton
                  onClick={handleMenu}
                  color="inherit"
                  sx={{ 
                    p: { xs: 0.5, sm: 1 },
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                  }}
                >
                  <Avatar sx={{ 
                    width: { xs: 28, sm: 40 }, 
                    height: { xs: 28, sm: 40 }, 
                    bgcolor: '#dc5b05' 
                  }}>
                    {user?.name?.[0]?.toUpperCase() || <PersonIcon />}
                  </Avatar>
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      display: { xs: 'none', sm: 'block' },
                      fontSize: 13, 
                      fontWeight: 600, 
                      mt: 0.5 
                    }}
                  >
                    Профиль
                  </Typography>
                </IconButton>
              </>
            )}

            {/* Кнопки входа/регистрации - компактные на мобильных */}
            {!isAuthenticated && (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: { xs: 0.5, sm: 2 },
                ml: { xs: 0.5, sm: 0 }
              }}>
                <Button
                  variant="outlined"
                  color="primary"
                  onClick={() => navigate('/login')}
                  sx={{
                    minWidth: { xs: 36, sm: 140 },
                    width: { xs: 36, sm: 'auto' },
                    height: { xs: 32, sm: 40 },
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: { xs: 0, sm: 3 },
                    boxShadow: 'none',
                    borderColor: '#dc5b05',
                    color: '#dc5b05',
                    fontSize: { xs: 0, sm: 16 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    '& .MuiButton-startIcon': {
                      mr: 0,
                      ml: 0,
                      display: 'flex',
                    },
                    '& span': {
                      display: { xs: 'none', sm: 'inline' },
                    },
                    '&:hover': {
                      borderColor: '#b94a04',
                      backgroundColor: '#ffc198e6',
                      color: '#b94a04',
                    },
                  }}
                >
                  <LoginIcon sx={{ display: { xs: 'inline', sm: 'none' }, fontSize: 20 }} />
                  <span>Войти</span>
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/register')}
                  sx={{
                    minWidth: { xs: 36, sm: 160 },
                    width: { xs: 36, sm: 'auto' },
                    height: { xs: 32, sm: 40 },
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600,
                    px: { xs: 0, sm: 3 },
                    backgroundColor: '#dc5b05',
                    color: '#fff',
                    fontSize: { xs: 0, sm: 16 },
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 8px rgba(220,91,5,0.10)',
                    '& .MuiButton-startIcon': {
                      mr: 0,
                      ml: 0,
                      display: 'flex',
                    },
                    '& span': {
                      display: { xs: 'none', sm: 'inline' },
                    },
                    '&:hover': {
                      backgroundColor: '#b94a04',
                      color: '#fff',
                      boxShadow: '0 4px 16px rgba(185,74,4,0.15)',
                    },
                  }}
                >
                  <DriveFileRenameOutlineIcon sx={{ display: { xs: 'inline', sm: 'none' }, fontSize: 20 }} />
                  <span>Регистрация</span>
                </Button>
              </Box>
            )}
          </Box>

          {/* Меню профиля */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            PaperProps={{ 
              sx: { 
                mt: 1.5, 
                minWidth: 140,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
              } 
            }}
            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
          >
            <MenuItem 
              onClick={() => { navigate('/profile'); handleClose(); }}
              sx={{ py: { xs: 0.75, sm: 1 } }}
            >
              Профиль
            </MenuItem>
            <MenuItem 
              onClick={() => { navigate('/orders'); handleClose(); }}
              sx={{ py: { xs: 0.75, sm: 1 } }}
            >
              Мои заказы
            </MenuItem>
            <MenuItem 
              onClick={handleLogout}
              sx={{ py: { xs: 0.75, sm: 1 } }}
            >
              Выйти
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <CartDrawer open={cartOpen} onClose={handleCartClose} />
    </>
  );
};
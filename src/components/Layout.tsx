import type { ReactNode } from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box, IconButton, Badge } from '@mui/material';
import { ShoppingCart, Favorite, Person } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useCartStore } from '../store/cartStore';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, logout } = useAuthStore();
  const { items } = useCartStore();

  return (
    <Box sx={{ background: '#fff', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}
          >
            Pizza Delivery
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <IconButton
              component={RouterLink}
              to="/favorites"
              color="inherit"
            >
              <Favorite />
            </IconButton>

            <IconButton
              component={RouterLink}
              to="/cart"
              color="inherit"
            >
              <Badge badgeContent={items.length} color="error">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {isAuthenticated() ? (
              <>
                <IconButton
                  component={RouterLink}
                  to="/profile"
                  color="inherit"
                >
                  <Person />
                </IconButton>
                <Button color="inherit" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  component={RouterLink}
                  to="/login"
                  color="inherit"
                >
                  Login
                </Button>
                <Button
                  component={RouterLink}
                  to="/register"
                  color="inherit"
                >
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>

      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Pizza Delivery. All rights reserved.
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}; 
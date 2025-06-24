import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme, CssBaseline, GlobalStyles } from '@mui/material';
import { HomePage } from './pages/HomePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ProfilePage } from './pages/ProfilePage';
import { OrdersPage } from './pages/OrdersPage';
import { OrderDetailsPage } from './pages/OrderDetailsPage';
import { Topbar } from './components/Topbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { validateToken, getCurrentUser } from './services/api';

// Create a client
const queryClient = new QueryClient();

// Create theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#ffa726', // оранжевый
    },
    secondary: {
      main: '#ab47bc', // фиолетовый
    },
    warning: {
      main: '#29b6f6', // голубой
    },
    success: {
      main: '#66bb6a', // зеленый
    },
  },
  typography: {
    fontFamily: [
      'Inter',
      'sans-serif',
    ].join(','),
  },
});

function App() {
  const { setUser, setLoading } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const isValid = await validateToken();
          if (isValid) {
            const user = await getCurrentUser();
            // Ensure the user object has all required User fields
            if (
              user &&
              'address' in user &&
              'created_at' in user &&
              'role' in user
            ) {
              setUser(user);
            } else {
              setUser(null);
            }
          } else {
            localStorage.removeItem('token');
            setUser(null);
          }
        } catch {
          localStorage.removeItem('token');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    initAuth();
  }, [setUser, setLoading]);

  // Tawk.to live chat integration
  useEffect(() => {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://embed.tawk.to/682b4a088a69ef190bcc9011/1irkhicp4';
    script.charset = 'UTF-8';
    script.setAttribute('crossorigin', '*');
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <GlobalStyles styles={{
          html: { background: '#F0F0F0', width: '100%', minHeight: '100%' },
          body: { background: '#F0F0F0', width: '100%', minHeight: '100vh', margin: 0, padding: 0 },
          '#root': { minHeight: '100vh', width: '100%' },
        }} />
        <Router>
          <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: '#F0F0F0',
          }}>
            <Topbar />
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route 
                  path="/favorites" 
                  element={
                    <ProtectedRoute>
                      <FavoritesPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/profile" 
                  element={
                    <ProtectedRoute>
                      <ProfilePage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/orders" 
                  element={
                    <ProtectedRoute>
                      <OrdersPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/orders/:id" 
                  element={
                    <ProtectedRoute>
                      <OrderDetailsPage />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Paper, Box, CircularProgress } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useAuth } from './AuthContext';

const AccessDeniedPage: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = useCallback(async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      await logout();
      navigate('/logout', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
      setLoggingOut(false);
    }
  }, [logout, navigate, loggingOut]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isAuthenticated) {
        handleLogout();
      } else {
        navigate('/logout', { replace: true });
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [isAuthenticated, handleLogout, navigate]);

  return (
    <Container maxWidth="sm" sx={{ mt: 8 }}>
      <Paper elevation={6} sx={{ p: 5, textAlign: 'center' }}>
        <Box sx={{ mb: 3 }}>
          <LockOutlinedIcon color="error" sx={{ fontSize: 64 }} />
        </Box>
        <Typography variant="h4" component="h1" gutterBottom>
          Access Denied
        </Typography>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
          You do not have permission to access this page.
          <br />
          You will be redirected to the logout page in 5 seconds.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleLogout}
          disabled={loggingOut}
          startIcon={loggingOut ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ minWidth: 120 }}
        >
          {loggingOut ? 'Logging out...' : 'Logout Now'}
        </Button>
      </Paper>
    </Container>
  );
};

export default AccessDeniedPage;

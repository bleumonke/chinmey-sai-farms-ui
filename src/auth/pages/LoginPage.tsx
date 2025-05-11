import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  CssBaseline
} from '@mui/material';
import AgricultureIcon from '@mui/icons-material/Agriculture'; // Placeholder logo icon
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm'; // Import the new LoginForm

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLoginSubmit = (email: string, password: string) => {
    console.log('Login attempt with:', { email, password });
    // TODO: Implement actual login logic here
    // For now, simulate successful login and navigate
    alert('Login successful (simulated)!');
    navigate('/agent/dashboard'); 
  };

  return (
    <Container maxWidth="xs" sx={{width: '100%', p:0 /* Remove container default padding if Paper handles it*/ }}>
      <CssBaseline />
      <Paper
        elevation={6}
        sx={{
          padding: { xs: 3, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          // Remove mt if AuthLayout's centering and the Paper's internal padding are sufficient
          // mt: 8, 
          width: '100%',
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AgricultureIcon sx={{ fontSize: 48, color: 'primary.main', mr: 1.5 }} />
          <Typography component="h1" variant="h4" fontWeight="600" color="text.primary">
            CHINMAYI SAI AGRO FARMS
          </Typography>
        </Box>
        <Typography component="h2" variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
          Sign in
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Welcome back! Please enter your details.
        </Typography>
        
        <LoginForm onLoginSubmit={handleLoginSubmit} />

      </Paper>
    </Container>
  );
};

export default LoginPage;
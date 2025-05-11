import React from 'react';
import {
  Box,
  Typography,
  Container,
  Paper,
  CssBaseline
} from '@mui/material';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import { useNavigate } from 'react-router-dom';
import SignupForm from '../components/SignupForm'; // Import the new SignupForm

// Define a type for the form data to be received from SignupForm
interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  address: string;
  zipCode: string;
  country: string;
}

const SignupPage: React.FC = () => {
  const navigate = useNavigate();

  const handleSignupSubmit = (formData: SignupFormData) => {
    console.log('Signup attempt with:', formData);
    // TODO: Implement actual signup logic here
    alert('Signup successful (simulated)!');
    navigate('/login'); // Redirect to login after signup
  };

   
  return (
    <Container maxWidth="sm" sx={{width: '100%', p:0 }}> 
      <CssBaseline />  
      <Paper
        elevation={6}
        sx={{
          padding: { xs: 3, sm: 4 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '100%', 
          borderRadius: 2,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AgricultureIcon sx={{ fontSize: 48, color: 'primary.main', mr: 1.5 }} />
          <Typography component="h1" variant="h5" fontWeight="600" color="text.primary">
            CHINMAYI SAI AGRO FARMS
          </Typography>
        </Box>

        <Typography component="h2" variant="h5" sx={{ mb: 1, fontWeight: 500 }}>
          Create an account
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Enter your information to create an account
        </Typography>

        <SignupForm onSignupSubmit={handleSignupSubmit} />

      </Paper>
    </Container>
  );
};

export default SignupPage; 
import React, { useEffect } from 'react';
import { signInWithRedirect } from 'aws-amplify/auth';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {

   const signInRediect = async () => {
      try {
        console.log('Login: Redirecting to sign in...');
        await signInWithRedirect();
      } catch (error) {
        console.error('Login error:', error);
      }
    }

    if (loading) return;
    if (!isAuthenticated) {
      signInRediect();
    }else {
      navigate('/', { replace: true });
    }
  },[loading, isAuthenticated, navigate]);
  
  return <div>Redirecting to login...</div>;
};
export default Login;
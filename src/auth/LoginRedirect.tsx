// LoginRedirect.tsx
import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const LoginRedirect: React.FC = () => {
  const { isAuthenticated, userGroups, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (loading) return;

    // Prevent redirect loop when already on logout page
    if (location.pathname === '/logout') return;

    if (isAuthenticated) {
      if (userGroups.includes('admin')) {
        navigate('/admin/dashboard', { replace: true });
      } else if (userGroups.includes('agent')) {
        navigate('/agent/dashboard', { replace: true });
      } else if (userGroups.includes('customer')) {
        navigate('/customer/dashboard', { replace: true });
      } else {
        navigate('/access-denied', { replace: true });
      }
    } else {
      navigate('/logout', { replace: true });
    }
  }, [loading, isAuthenticated, userGroups, location.pathname, navigate]);

  if (loading) {
    return <div>Loading user info...</div>;
  }

  return <div style={{ padding: '2rem' }}>Redirecting to your dashboard...</div>;
};

export default LoginRedirect;

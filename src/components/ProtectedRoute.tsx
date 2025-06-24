import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

interface ProtectedRouteProps {
  allowedGroups: string[];
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedGroups, children }) => {
  const { isAuthenticated, userGroups, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/home" replace />;
  }

  const hasAccess = allowedGroups.some(group => userGroups.includes(group));
  if (!hasAccess) {
    console.warn('User lacks access:', { userGroups, allowedGroups });
    return <Navigate to="/access-denied" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

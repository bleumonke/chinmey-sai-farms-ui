import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from '../layout/MainLayout';

import AgentDashboard from '../pages/agent/DashboardPage';
import LayoutDetailsPage from '../pages/agent/LayoutDetailsPage';
import PlotDetailsPage from '../pages/agent/PlotDetailsPage';
import CustomerDetailsPage from '../pages/agent/CustomerDetailsPage';
import CustomerDashboard from '../pages/customer/DashboardPage';
import ProfilePage from '../pages/ProfilePage';
import CustomersPage from '../pages/agent/CustomersPage';
import PricingPage from '../pages/agent/PricingPage';

import Login from '../auth/Login';
import LoginRedirect from '../auth/LoginRedirect';
import LogoutPage from '../auth/LogoutPage';
import AccessDeniedPage from '../auth/AccessDeniedPage';

import ProtectedRoute from '../components/ProtectedRoute';

interface RouteConfig {
  path: string;
  element: React.ReactNode;
  allowedGroups?: string[];
}

const authRoutes: RouteConfig[] = [
  { path: '/login', element: <Login /> },
  { path: '/login/redirect', element: <LoginRedirect /> },
  { path: '/logout', element: <LogoutPage /> },
  { path: '/access-denied', element: <AccessDeniedPage /> },
];

const agentRoutes: RouteConfig[] = [
  { path: '/agent/dashboard', element: <AgentDashboard />, allowedGroups: ['agent'] },
  { path: '/agent/pricing', element: <PricingPage />, allowedGroups: ['agent'] },
  { path: '/agent/layouts/:layoutId/edit', element: <LayoutDetailsPage />, allowedGroups: ['agent'] },
  { path: '/agent/customers/new', element: <CustomerDetailsPage />, allowedGroups: ['agent'] },
  { path: '/agent/customers/:customerId/edit', element: <CustomerDetailsPage />, allowedGroups: ['agent'] },
  { path: '/agent/layouts/:layoutId/plots/new', element: <PlotDetailsPage />, allowedGroups: ['agent'] },
  { path: '/agent/layouts/:layoutId/plots/:plotId/edit', element: <PlotDetailsPage />, allowedGroups: ['agent'] },
  { path: '/customers/list', element: <CustomersPage />, allowedGroups: ['agent'] },
];

const customerRoutes: RouteConfig[] = [
  { path: '/customer/dashboard', element: <CustomerDashboard />, allowedGroups: ['customer'] },
];

const sharedRoutes: RouteConfig[] = [
  { path: '/profile', element: <ProfilePage />, allowedGroups: ['agent', 'customer', 'admin'] },
];

const AppRoutes: React.FC = () => (
  <Routes>
    {/* Public auth routes */}
    {authRoutes.map(({ path, element }) => (
      <Route key={path} path={path} element={element} />
    ))}

    {/* Redirect root */}
    <Route path="/" element={<Navigate to="/login/redirect" />} />

    {/* Protected routes wrapped by MainLayout */}
    <Route element={<MainLayout />}>
      {[...agentRoutes, ...customerRoutes, ...sharedRoutes].map(({ path, element, allowedGroups }) => (
        <Route
          key={path}
          path={path}
          element={
            allowedGroups ? (
              <ProtectedRoute allowedGroups={allowedGroups}>
                {element}
              </ProtectedRoute>
            ) : (
              element
            )
          }
        />
      ))}
    </Route>

    {/* Fallback */}
    <Route path="*" element={<Navigate to="/login" replace />} />
  </Routes>
);

export default AppRoutes;

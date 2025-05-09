import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Layouts
import AuthLayout from '../auth/AuthLayout';
import MainLayout from '../layout/MainLayout';

// Import Page Components
import AgentDashboardPage from "../pages/AgentDashboardPage";
import LayoutFormPage from "../pages/LayoutFormPage";
import PlotFormPage from "../pages/PlotFormPage";
import CropFormPage from "../pages/CropFormPage";
import CustomerFormPage from "../pages/CustomerFormPage";
import PricingFormPage from "../pages/PricingFormPage";
import CustomerDashboardPage from "../pages/CustomerDashboardPage";

// Auth Page Components
import LoginPage from '../auth/pages/LoginPage';
import SignupPage from '../auth/pages/SignupPage';

export const AppRoutes: React.FC = () => {
    return (
        <Routes>
            {/* Authentication Routes with AuthLayout */}
            <Route element={<AuthLayout />}>
                <Route path="/" element={<LoginPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
            </Route>

            {/* Main Application Routes with MainLayout */}
            <Route element={<MainLayout />}>
                <Route path="/agent/dashboard" element={<AgentDashboardPage />} />
                
                <Route path="/agent/layouts/new" element={<LayoutFormPage />} />
                <Route path="/agent/layouts/:layoutId/edit" element={<LayoutFormPage />} />
                
                <Route path="/agent/crops/new" element={<CropFormPage />} />
                <Route path="/agent/crops/:cropId/edit" element={<CropFormPage />} />
                
                <Route path="/agent/customers/new" element={<CustomerFormPage />} />
                <Route path="/agent/customers/:customerId/edit" element={<CustomerFormPage />} />

                <Route path="/agent/layouts/:layoutId/plots/new" element={<PlotFormPage />} />
                <Route path="/agent/layouts/:layoutId/plots/:plotId/edit" element={<PlotFormPage />} />

                <Route path="/agent/crops/:cropId/pricing/new" element={<PricingFormPage />} />
                <Route path="/agent/crops/:cropId/pricing/:pricingId/edit" element={<PricingFormPage />} />

                {/* Customer Routes */}
                <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
            </Route>

            {/* TODO: Add Not Found Route (404) */}
            {/* <Route path="*" element={<NotFoundPage />} /> */}
        </Routes>
    );
}; 
import React from "react";
import { 
  Box, 
  Typography, 
} from "@mui/material";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import AgentDashboard from "./pages/agent/Dashboard";
import LayoutFormPage from "./pages/agent/LayoutFormPage";
import PlotFormPage from "./pages/agent/PlotFormPage";
import CropFormPage from "./pages/agent/CropFormPage";
import CustomerFormPage from "./pages/agent/CustomerFormPage";
import PricingFormPage from "./pages/agent/PricingFormPage";

const CustomerDashboard: React.FC = () => {
  return (
    <Box sx={{ color: "black", marginTop: 5 }}>
      <Typography variant="h6">Welcome to the Customer Dashboard!</Typography>
      <Typography variant="body2" sx={{ fontWeight:'light', fontSize:'12px', fontStyle:"italic", color:'gray'}}>Here you can manage your layouts and customers.</Typography>
    </Box>
  );
}

const App: React.FC = () => {
  return (
    <Box sx={{ display: "flex" }}>
    <Sidebar />
    <Box component="main" sx={{ flexGrow: 1, p: 3}}>
      <Routes>
        <Route path="/agent/dashboard" element={<AgentDashboard />} />
        
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

        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
      </Routes>
    </Box>
  </Box>
  );
};

export default App;

import React from "react";
import {
  Box,
  Typography,
} from "@mui/material";

const CustomerDashboardPage: React.FC = () => {
  return (
    <Box sx={{ color: "black", marginTop: 5 }}>
      <Typography variant="h6">Welcome to the Customer Dashboard!</Typography>
      <Typography variant="body2" sx={{ fontWeight:'light', fontSize:'12px', fontStyle:"italic", color:'gray'}}>
        Here you can manage your layouts and customers.
      </Typography>
    </Box>
  );
}

export default CustomerDashboardPage; 
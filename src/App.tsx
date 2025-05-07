import React from "react";
import { 
  Box, 
} from "@mui/material";
import Sidebar from "./layout/Sidebar";
import { AppRoutes } from './routes';

const App: React.FC = () => {
  return (
    <Box sx={{ display: "flex" }}>
    <Sidebar />
    <Box component="main" sx={{ flexGrow: 1, p: 3}}>
      <AppRoutes />
    </Box>
  </Box>
  );
};

export default App;

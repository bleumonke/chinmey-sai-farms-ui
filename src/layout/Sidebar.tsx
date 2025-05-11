import React from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Box,
  useTheme,
  ListSubheader,
  Divider,
} from "@mui/material";
import SpaceDashboardRoundedIcon from "@mui/icons-material/SpaceDashboardRounded";
import GroupIcon from "@mui/icons-material/Group";
import SettingsIcon from "@mui/icons-material/Settings";
import AgricultureIcon from "@mui/icons-material/Agriculture";
import PaidIcon from "@mui/icons-material/Paid";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";

import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 220;

const Sidebar: React.FC = () => {
 
  const navigate = useNavigate();
  const location = useLocation();

  const agentNavItems = [
    { text: "Dashboard", path: "/agent/dashboard", icon: <SpaceDashboardRoundedIcon /> },
  ];

  const customerNavItems = [
    { text: "Dashboard", path: "/customer/dashboard", icon: <SpaceDashboardRoundedIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "#634832",
          color: "white",
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#634832",
          color: "white",
          height: 64,
          marginBottom: 4,
        }}
      >
        <Typography variant="h6" noWrap>
          MyApp
        </Typography>
      </Toolbar>
      <Box sx={{ flexGrow: 1 }}>
        <List
          subheader={
            <ListSubheader component="div" sx={{ backgroundColor: "transparent", color: "white", marginTop: 2, fontWeight: 500 }}>
              Agent
            </ListSubheader>
          }
        >
          {agentNavItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  gap: 1,
                  px: 2,
                  "&.Mui-selected": {
                    backgroundColor: "#967259",
                  },
                  "&:hover": {
                    backgroundColor: "#967259",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 30 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider sx={{ backgroundColor: 'white', margin: '0 5%'}}/>
        <List
          subheader={
            <ListSubheader component="div" sx={{ backgroundColor: "transparent", color: "white", marginTop: 2, fontWeight: 500 }}>
              Customer
            </ListSubheader>
          }
        >
          {customerNavItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  gap: 1,
                  px: 2,
                  "&.Mui-selected": {
                    backgroundColor: "#967259",
                  },
                  "&:hover": {
                    backgroundColor: "#38220f",
                  },
                }}
              >
                <ListItemIcon sx={{ color: "white", minWidth: 30 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;

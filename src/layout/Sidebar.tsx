import React, { useState, useEffect, useMemo } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import {
  Menu as MenuIcon,
  SpaceDashboardRounded as DashboardIcon,
  Savings as PricingIcon,
  Group as CustomersIcon,
  Logout as LogoutIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

const drawerWidth = 250;
const collapsedWidth = 60;

interface NavItem {
  text: string;
  path: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC = () => {
  const { logout, userGroups } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [collapsed, setCollapsed] = useState(isMobile);

  useEffect(() => {
    setCollapsed(isMobile);
  }, [isMobile]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/logout", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navItems = useMemo(() => {
    const base: Record<string, NavItem[]> = {
      agent: [
        { text: "Dashboard", path: "/agent/dashboard", icon: <DashboardIcon /> },
        { text: "Pricing", path: "/agent/pricing", icon: <PricingIcon /> },
        { text: "Customers", path: "/customers/list", icon: <CustomersIcon /> },
        { text: "Profile", path: "/profile", icon: <SettingsIcon /> },
      ],
      customer: [
        { text: "Dashboard", path: "/customer/dashboard", icon: <DashboardIcon /> },
        { text: "Profile", path: "/profile", icon: <SettingsIcon /> },
      ],
      admin: [
        { text: "Profile", path: "/profile", icon: <SettingsIcon /> },
      ],
    };

    const primaryGroup = Array.isArray(userGroups) ? userGroups[0] : userGroups;
    return base[primaryGroup] || [];
  }, [userGroups]);

  const renderNavItems = (items: NavItem[]) => (
    <List>
      {items.map(({ text, path, icon }) => (
        <ListItem key={text} disablePadding>
          <ListItemButton
            selected={location.pathname === path}
            onClick={() => navigate(path)}
            sx={{
              gap: 1,
              px: collapsed ? 1 : 2,
              justifyContent: collapsed ? "center" : "flex-start",
              "&.Mui-selected": { backgroundColor: "#3a66c6" },
              "&:hover": { backgroundColor: "#274b9f" },
            }}
          >
            <ListItemIcon sx={{ color: "white", minWidth: collapsed ? 0 : 30 }}>
              {icon}
            </ListItemIcon>
            {!collapsed && <ListItemText primary={text} />}
          </ListItemButton>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: collapsed ? collapsedWidth : drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: collapsed ? collapsedWidth : drawerWidth,
          boxSizing: "border-box",
          backgroundColor: "royalblue",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          transition: "width 0.3s",
        },
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: collapsed ? "center" : "space-between",
          alignItems: "center",
          minHeight: 64,
          px: 2,
        }}
      >
        {isMobile && (
          <IconButton onClick={() => setCollapsed((prev) => !prev)} sx={{ color: "white" }}>
            <MenuIcon />
          </IconButton>
        )}
      </Toolbar>

      <Box
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        {renderNavItems(navItems)}
      </Box>

      <Box>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                gap: 1,
                px: collapsed ? 1 : 2,
                justifyContent: collapsed ? "center" : "flex-start",
                "&:hover": { backgroundColor: "#274b9f" },
              }}
            >
              <ListItemIcon sx={{ color: "white", minWidth: collapsed ? 0 : 30 }}>
                <LogoutIcon />
              </ListItemIcon>
              {!collapsed && <ListItemText primary="Logout" />}
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;

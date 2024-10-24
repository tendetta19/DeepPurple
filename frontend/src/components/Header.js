// src/components/Header.js
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

function Header({ onHelpOpen, onDrawerToggle, isSidebarCollapsed, drawerWidthExpanded, drawerWidthCollapsed }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: `calc(100% - ${isSidebarCollapsed ? drawerWidthCollapsed : drawerWidthExpanded}px)`,
        ml: `${isSidebarCollapsed ? drawerWidthCollapsed : drawerWidthExpanded}px`,
        transition: 'width 0.3s ease, margin-left 0.3s ease',
        zIndex: (theme) => theme.zIndex.drawer + 1, // Ensure Header is above Sidebar
      }}
    >
      <Toolbar>
        {/* Toggle button for larger screens */}
        <IconButton
          color="inherit"
          edge="start"
          onClick={onDrawerToggle}
          sx={{
            mr: 2,
            display: { md: 'none' }, // Hidden on medium and larger screens
          }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          DeepPurple
        </Typography>
        <IconButton color="inherit" onClick={onHelpOpen}>
          <HelpOutlineIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Header;

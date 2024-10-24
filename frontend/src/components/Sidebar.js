// src/components/Sidebar.js
import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Toolbar,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import DescriptionIcon from '@mui/icons-material/Description';
import MenuOpenIcon from '@mui/icons-material/MenuOpen';
import MenuIcon from '@mui/icons-material/Menu';

const drawerWidthExpanded = 240;
const drawerWidthCollapsed = 60;

function Sidebar({ isCollapsed, toggleSidebar }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const menuItems = [
    { text: 'Upload File', icon: <UploadFileIcon />, link: '#upload-section' },
    { text: 'Enter Text', icon: <TextFieldsIcon />, link: '#textinput-section' },
    { text: 'Analysis Results', icon: <DescriptionIcon />, link: '#results-section' },
  ];

  const drawerContent = (
    <div>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isCollapsed ? 'center' : 'flex-end',
          px: [1],
        }}
      >
        <IconButton onClick={toggleSidebar}>
          {isCollapsed ? <MenuIcon /> : <MenuOpenIcon />}
        </IconButton>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              const element = document.querySelector(item.link);
              if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
              }
              if (isMobile && toggleSidebar) {
                toggleSidebar();
              }
            }}
            sx={{
              justifyContent: isCollapsed ? 'center' : 'flex-start',
              px: isCollapsed ? 2.5 : 3,
            }}
          >
            <Tooltip title={isCollapsed ? item.text : ''} placement="right">
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: isCollapsed ? 'auto' : 3,
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
            </Tooltip>
            {!isCollapsed && <ListItemText primary={item.text} />}
          </ListItem>
        ))}
      </List>
    </div>
  );

  return (
    <Drawer
      variant={isMobile ? 'temporary' : 'permanent'}
      open={!isCollapsed}
      onClose={toggleSidebar}
      ModalProps={{
        keepMounted: true, // Better open performance on mobile.
      }}
      sx={{
        width: isCollapsed ? drawerWidthCollapsed : drawerWidthExpanded,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: isCollapsed ? drawerWidthCollapsed : drawerWidthExpanded,
          boxSizing: 'border-box',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
          overflowX: 'hidden',
        },
      }}
    >
      {drawerContent}
    </Drawer>
  );
}

export default Sidebar;

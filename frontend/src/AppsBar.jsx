import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Menu, MenuItem, Switch, ListItemText, ListItemIcon } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogOut from '@mui/icons-material/Logout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate } from 'react-router-dom';
import "./index.css";

const AppsBar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const navigateToUserManual = () => {
    navigate('/user-manual');
    handleMenuClose();
  };

  const handleLogout = () => {
    localStorage.removeItem('userPin');
    navigate('/');
    handleMenuClose();
  };

  return (
    <AppBar
      position="static"
      className={darkMode ? 'custom-app-bar-dark' : 'custom-app-bar-light'}
    >
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Listfun
        </Typography>

        <IconButton
          color="inherit"
          onClick={handleMenuOpen}
          aria-label="Open Menu"
        >
          <MenuIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
          aria-label="Main Menu"
        >
          <MenuItem onClick={handleDarkModeToggle}>
            <ListItemIcon>
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </ListItemIcon>
            <ListItemText>Tumma tila</ListItemText>
            <Switch
              checked={darkMode}
              onChange={handleDarkModeToggle}
              color="default"
              edge="end"
            />
          </MenuItem>
          <MenuItem onClick={navigateToUserManual}>
            <ListItemIcon>
              <MenuBookIcon />
            </ListItemIcon>
            <ListItemText>Käyttäjäopas</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogOut />
            </ListItemIcon>
            <ListItemText>Kirjaudu ulos</ListItemText>
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default AppsBar;


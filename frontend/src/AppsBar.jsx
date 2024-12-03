import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Switch, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogOut from '@mui/icons-material/Logout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate } from 'react-router-dom';
import './index.css';

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
    <AppBar position="static" className="Appbar">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Listat
        </Typography>

        <IconButton
          edge="end"
          color="inherit"
          onClick={handleDarkModeToggle}
          sx={{ mr: 2 }}
          aria-label="Toggle Dark Mode"
        >
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Switch
          checked={darkMode}
          onChange={handleDarkModeToggle}
          color="default"
          aria-label="Dark Mode Switch"
        />

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
          <MenuItem onClick={navigateToUserManual}>
            <MenuBookIcon sx={{ mr: 1 }} />
            Käyttäjäopas
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <LogOut sx={{ mr: 1 }} />
            Kirjaudu ulos
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default AppsBar;



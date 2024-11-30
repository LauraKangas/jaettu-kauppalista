import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Switch, Button } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogOut from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';

const AppsBar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();

  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };

  const navigateToUserManual = () => {
    navigate('/user-manual'); 
  };

  const handleLogout = () => {
    localStorage.removeItem('userPin');
    navigate('/');
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Listat
        </Typography>

        <IconButton
          edge="end"
          color="inherit"
          onClick={handleDarkModeToggle}
          sx={{ mr: 2 }}
        >
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
        <Switch
          checked={darkMode}
          onChange={handleDarkModeToggle}
          color="default"
        />
   
        <Button
          color="inherit"
          startIcon={<LogOut />}
          onClick={handleLogout}
        >
          Kirjaudu ulos
        </Button>

        <Button
          color="inherit"
          startIcon={<MenuBookIcon />}
          onClick={navigateToUserManual}
        >
          Käyttäjäopas
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default AppsBar;

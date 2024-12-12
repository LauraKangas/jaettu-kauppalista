import React, { useState } from 'react';
import { AppBar, Toolbar, Button, Menu, MenuItem, Switch, ListItemText, ListItemIcon } from '@mui/material';
import { ButtonBase } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import LogOut from '@mui/icons-material/Logout';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import { useNavigate, useLocation } from 'react-router-dom';
import './index.css';

/**
 * The `AppsBar` component renders a responsive application bar with navigation and theme toggle options.
 * 
 * ### Features:
 * - **Navigation Menu**: 
 *   - Contains options to navigate to the user manual and log out.
 * - **Theme Toggle**: 
 *   - Allows users to switch between light and dark modes.
 * - **Current Page Awareness**: 
 *   - Hides or adjusts options based on the user's current location in the app.
 * 
 * @component
 * @param {Object} props - Props passed to the component.
 * @param {boolean} props.darkMode - Indicates if dark mode is currently active.
 * @param {function} props.setDarkMode - Function to toggle dark mode state.
 *
 * @returns {JSX.Element} The application bar UI component.
 */
const AppsBar = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  // State for menu anchor element
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);
  /**
   * Opens the dropdown menu.
   * @param {Object} event - The click event that triggered the menu.
   */
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
    document.body.style.overflow = 'hidden';
    document.body.style.paddingRight = '0px';
  };
  /**
   * Closes the dropdown menu.
   */
  const handleMenuClose = () => {
    setAnchorEl(null);
    document.body.style.overflow = 'auto'; 
    document.body.style.paddingRight = '';
  };
  /**
   * Toggles the dark mode state between `true` and `false`.
   */
  const handleDarkModeToggle = () => {
    setDarkMode(!darkMode);
  };
  /**
   * Navigates to the user manual page and closes the menu.
   */
  const navigateToUserManual = () => {
    navigate('/user-manual');
    handleMenuClose();
  };
  /**
   * Logs out the user by removing their PIN from local storage and redirects to the login page.
   */
  const handleLogout = () => {
    localStorage.removeItem('userPin');
    navigate('/');
    handleMenuClose();
  };
  // Determines if the current page is the PIN page, if so, does not show logout option
  const isPinPage = location.pathname === '/';

  return (
    <AppBar
      position="static"
      className={darkMode ? 'custom-app-bar-dark' : 'custom-app-bar-light'}
    >
      <Toolbar>
      <ButtonBase onClick={() => navigate('/')}
        className="logo-button"
        >
          <img
            src="/listfun.png" 
            alt="Listfun Logo"
            style={{
              height: 100,
              width: 280, 
              position: 'absolute',
              left: '10%',
            }}
          />
        </ButtonBase>

        <Button
          color="inherit"
          onClick={handleMenuOpen}
          aria-label="Open Menu"
          style={{
            position: 'absolute',
            right: 30,
          }}
        >
          <MenuIcon />
        </Button>

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
          {!isPinPage && (
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogOut />
              </ListItemIcon>
              <ListItemText>Kirjaudu ulos</ListItemText>
            </MenuItem>
          )}
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default AppsBar;



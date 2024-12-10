import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme, Typography } from '@mui/material';
import './index.css';
import AppsBar from './AppsBar';
import PinPage from './PinPage';
import ListView from './ListView';
import UserManual from './UserManual';
import ItemLists from './ItemLists';

/**
 * The `App` component manages the application's theme state (light or dark mode)
 * and synchronizes the user's theme preference with local storage.
 * 
 * ### Features:
 * - **Persistent Theme Preference**: 
 *   - Retrieves the user's previously saved theme preference from local storage.
 *   - Saves the updated preference to local storage when toggled.
 * - **Dynamic Theme Application**: 
 *   - Applies the chosen theme (light or dark) to the application using Material-UI's theming system.
 * - **CSS Class Management**:
 *   - Dynamically toggles a `dark-mode` class on the `<body>` element to allow global styling adjustments.
 * 
 * @component
 *
 * @returns {JSX.Element} The application's root component with theme management logic.
 */
const App = () => {
  // State to manage the dark mode preference
  const [darkMode, setDarkMode] = useState(() => {
    // Retrieve the saved dark mode preference from local storage or default to `false`
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });
  /**
   * Effect to apply the dark mode CSS class and save the theme preference in local storage.
   * 
   * - Adds or removes the `dark-mode` class on the `<body>` element based on the current `darkMode` state.
   * - Persists the dark mode preference to local storage whenever it changes.
   */
  useEffect(() => {
    const className = 'dark-mode';
    if (darkMode) {
      document.body.classList.add(className);
    } else {
      document.body.classList.remove(className);
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);
  /**
   * Creates a Material-UI theme configuration based on the current `darkMode` state.
   * 
   * @constant {Object} theme
   * - Adjusts the `palette.mode` property to either 'dark' or 'light'.
   */
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppsBar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="container">
          <Routes>
            <Route path="/" element={<PinPage />} />
            <Route path="/lists" element={<ItemLists />} />
            <Route path="/list/:id" element={<ListView />} />
            <Route path="/user-manual" element={<UserManual />} />
          </Routes>
        </div>
        <footer>
          <div className="footer">
          <Typography variant="body2" align="center">
            &copy; {new Date().getFullYear()} Listfun
          </Typography>
          </div>
        </footer>
      </Router>
    </ThemeProvider>
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import './index.css';
import AppsBar from './AppsBar';
import PinPage from './PinPage';
import ListView from './ListView';
import UserManual from './UserManual';
import ItemLists from './ItemLists';

const App = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const savedMode = localStorage.getItem('darkMode');
    return savedMode ? JSON.parse(savedMode) : false;
  });

  useEffect(() => {
    const className = 'dark-mode';
    if (darkMode) {
      document.body.classList.add(className);
    } else {
      document.body.classList.remove(className);
    }
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  // Creating the theme dynamically based on darkMode state
  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        {/* Pass darkMode and setDarkMode correctly */}
        <AppsBar darkMode={darkMode} setDarkMode={setDarkMode} />
        <div className="container">
          <Routes>
            <Route path="/" element={<PinPage />} />
            <Route path="/lists" element={<ItemLists />} />
            <Route path="/list/:id" element={<ListView />} />
            <Route path="/user-manual" element={<UserManual />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;

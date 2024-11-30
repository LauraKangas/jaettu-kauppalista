import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import AppsBar from './AppsBar';
import PinPage from './PinPage';
import ListView from './ListView';
import UserManual from './UserManual';
import ItemLists from './ItemLists';

const App = () => {
  const [darkMode, setDarkMode] = useState(false);

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
        <Routes>
          <Route path="/" element={<PinPage />} />
          <Route path='/lists' element={<ItemLists />} />
          <Route path="/list/:id" element={<ListView />} />
          <Route path="/user-manual" element={<UserManual />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;

import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import ItemLists from './ItemLists';
import ListView from './ListView';
import PinPage from './PinPage'; 
import UserManual from './UserManual';

const App = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<PinPage />} />
          <Route path="/user-manual" element={<UserManual />} />
          <Route path="/lists" element={<ItemLists />} />
          <Route path="/list/:id" element={<ListView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

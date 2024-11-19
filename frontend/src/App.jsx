import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ItemLists from './ItemLists';
import ListView from './ListView';
import PinPage from './PinPage'; 

const App = () => {
  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<PinPage />} />
          <Route path="/lists" element={<ItemLists />} />
          <Route path="/list/:id" element={<ListView />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
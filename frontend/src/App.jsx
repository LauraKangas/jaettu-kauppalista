import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './utils/firebase/app';
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
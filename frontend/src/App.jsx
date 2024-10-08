import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ItemLists from './ItemLists'; 
import ListView from './ListView'; 
import fetchLists from './functions/lists/fetchLists'; 

const App = () => {
  const [noteItems, setNoteItems] = useState([]);

  useEffect(() => {
    const getLists = async () => {
      const lists = await fetchLists(); 
      setNoteItems(lists);
    };
    getLists();
  }, []);

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<ItemLists noteItems={noteItems} setNoteItems={setNoteItems} />} />
          <Route path="/list/:id" element={<ListView noteItems={noteItems} setNoteItems={setNoteItems} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;


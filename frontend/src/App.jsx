// src/App.jsx

import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import ItemLists from './ItemLists';
import ListView from './ListView'; // Import the new ListView component

const App = () => {
  const [noteItems, setNoteItems] = useState([]);

  const addNoteItem = (newItem) => {
    setNoteItems([...noteItems, newItem]);
  };

  const deleteNoteItem = (id) => {
    setNoteItems(noteItems.filter(item => item.id !== id));
  };

  const updateNoteItem = (updatedItem) => {
    const updatedItems = noteItems.map(item =>
      item.id === updatedItem.id ? updatedItem : item
    );
    setNoteItems(updatedItems);
  };

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={
            <ItemLists 
              noteItems={noteItems} 
              addNoteItem={addNoteItem} 
              deleteNoteItem={deleteNoteItem} 
              updateNoteItem={updateNoteItem} 
            />
          } />
          <Route path="/list/:id" element={
            <ListView 
              noteItems={noteItems}
              updateNoteItem={updateNoteItem}
              deleteNoteItem={deleteNoteItem}
            />
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

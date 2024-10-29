import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ItemLists from './ItemLists'; 
import ListView from './ListView'; 
import fetchLists from './functions/lists/fetchLists'; 

const App = () => {
  const [items, setItems] = useState([]);
  const [uid, setUid] = useState(null)

  useEffect(() => {
    (async () => {
      if (uid) {
        setItems(await fetchLists(uid));
      }
    })()
  }, [uid]);

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<ItemLists noteItems={items} setNoteItems={setItems} uid={uid} setUid={setUid} />} />
          <Route path="/list/:id" element={<ListView noteItems={items} setNoteItems={setItems} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;


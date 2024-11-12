import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './utils/firebase/app'; 
import ItemLists from './ItemLists'; 
import ListView from './ListView'; 
import fetchLists from './functions/lists/fetchLists'; 

const App = () => {
  const [noteItems, setNoteItems] = useState([]);

  useEffect(() => {
    const fetchLists = async () => {
      const listsCollection = collection(db, 'lists');
      const listSnapshot = await getDocs(listsCollection);
      const lists = listSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setNoteItems(lists);
    };

    fetchLists();
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


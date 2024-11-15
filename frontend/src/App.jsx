import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './utils/firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth'; // Firebase Authentication import
import ItemLists from './ItemLists';
import ListView from './ListView';
import PinPage from './PinPage'; 

const App = () => {
  const [noteItems, setNoteItems] = useState([]);
  const [userPin, setUserPin] = useState(''); 
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
        setUserPin(user.uid);
      } else {
        setIsAuthenticated(false);
        setUserPin('');
      }
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      const fetchLists = async () => {
        try {
          const listsCollection = collection(db, 'lists');
          const listSnapshot = await getDocs(listsCollection);
          const lists = listSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          setNoteItems(lists);
        } catch (error) {
          console.error("Error fetching lists:", error);
        }
      };

      fetchLists();
    }
  }, [isAuthenticated]);

  return (
    <Router>
      <div className="container">
        <Routes>
          <Route path="/" element={<PinPage setUserPin={setUserPin} />} /> 
          <Route path="/lists" element={<ItemLists noteItems={noteItems} setNoteItems={setNoteItems} />} />
          <Route path="/list/:id" element={<ListView noteItems={noteItems} setNoteItems={setNoteItems} />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;

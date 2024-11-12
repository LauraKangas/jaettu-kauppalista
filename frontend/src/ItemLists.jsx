import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, doc, deleteDoc } from 'firebase/firestore'; 
import { db } from './utils/firebase/app'; 
import { validateItemContent, checkForDuplicateItem } from './Validations'; 
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Button } from '@mui/material';

const ItemLists = ({ noteItems, setNoteItems }) => {
  const [newListContent, setNewListContent] = useState('');

  const handleCreateList = async () => {
    if (!newListContent) return; 
  
    const validation = validateItemContent(newListContent);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }
      
    const newList = { content: newListContent, items: [] }; 
    const listsCollection = collection(db, 'lists'); 
  
    const docRef = await addDoc(listsCollection, newList); 
    setNoteItems(prevItems => Array.isArray(prevItems) ? [...prevItems, { id: docRef.id, ...newList }] : [{ id: docRef.id, ...newList }]);
  
    setNewListContent(''); 
  };

  const handleDeleteList = async (id) => {
    await deleteDoc(doc(db, 'lists', id));
    setNoteItems(prevItems => Array.isArray(prevItems) ? prevItems.filter(item => item.id !== id) : []);
  };

  return (
    <div>
      <h1>Omat listat</h1>
      <ul>
        {noteItems && noteItems.map((item) => (
          <li key={item.id}>
            <Link to={`/list/${item.id}`}>{item.content}</Link>
            <Button onClick={() => handleDeleteList(item.id)}>
              <DeleteIcon /> 
            </Button>
          </li>
        ))}
      </ul>

      <input
        type="text"
        value={newListContent}
        onChange={(e) => setNewListContent(e.target.value)}
        placeholder="kirjoita listan nimi"
      />
      <Button onClick={handleCreateList}>
        <AddIcon /> 
      </Button>
    </div>
  );
};

export default ItemLists;



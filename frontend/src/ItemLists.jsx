import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, doc, deleteDoc } from 'firebase/firestore'; 
import { db } from './utils/firebase/app'; 
import { validateItemContent, checkForDuplicateItem } from './Validations'; 
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const ItemLists = ({ noteItems, setNoteItems }) => {
  const [newListContent, setNewListContent] = useState('');

  const handleCreateList = async () => {
    if (!newListContent) return; 

    const validation = validateItemContent(newListContent);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    if (!checkForDuplicateItem(noteItems, newListContent)) {
      alert('Tämä on jo listalla');
      return;
    }

    const newList = { content: newListContent, items: [] }; 
    const listsCollection = collection(db, 'lists'); 

    const docRef = await addDoc(listsCollection, newList); 
    setNoteItems(prevItems => [...prevItems, { id: docRef.id, ...newList }]); 

    setNewListContent(''); 
  };

  const handleDeleteList = async (id) => {
    await deleteDoc(doc(db, 'lists', id));
    setNoteItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  return (
    <div>
      <h1>Omat listat</h1>
      <ul>
        {noteItems.map((item) => (
          <li key={item.id}>
            <Link to={`/list/${item.id}`}>{item.content}</Link>
            <button onClick={() => handleDeleteList(item.id)}>
              <DeleteIcon /> 
            </button>
          </li>
        ))}
      </ul>

      <input
        type="text"
        value={newListContent}
        onChange={(e) => setNewListContent(e.target.value)}
        placeholder="kirjoita listan nimi"
      />
      <button onClick={handleCreateList}>
        <AddIcon /> 
      </button>
    </div>
  );
};

export default ItemLists;



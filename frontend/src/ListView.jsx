import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, arrayRemove } from 'firebase/firestore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBack from '@mui/icons-material/ArrowBack'; 
import deleteList from './functions/lists/deleteList'; 
import { db } from './utils/firebase/app';
import { validateItemContent, checkForDuplicateItem } from './Validations'; 

const ListView = ({ noteItems, setNoteItems }) => {
  const { id } = useParams();
  const [currentList, setCurrentList] = useState(null);
  const [newItem, setNewItem] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const foundList = noteItems.find(item => item.id === id);
    if (foundList) {
      setCurrentList(foundList);
    } else {
      console.error('List not found');
    }
  }, [id, noteItems]);

  const handleDeleteList = async () => {
    try {
      console.log('Deleting list with id:', id);
      await deleteList(id);
      setNoteItems(prevItems => prevItems.filter(item => item.id !== id));
      navigate('/');
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const handleAddItem = async () => {
    if (!newItem) return;

    const validation = validateItemContent(newItem);
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }

    if (!checkForDuplicateItem(currentList.items, newItem)) {
      alert('Tämä tuote on jo listalla');
      return;
    }

    const updatedList = { ...currentList, items: [...currentList.items, newItem] };
    await updateDoc(doc(db, 'lists', id), updatedList);
    setNoteItems(prevItems => prevItems.map(item => (item.id === id ? updatedList : item)));
    setNewItem('');
  };

  const handleDeleteItem = async (itemToDelete) => {
    const updatedList = {
      ...currentList,
      items: currentList.items.filter(item => item !== itemToDelete)
    };
    await updateDoc(doc(db, 'lists', id), updatedList);
    setNoteItems(prevItems => prevItems.map(item => (item.id === id ? updatedList : item)));
  };

  if (!currentList) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <button onClick={() => navigate('/')}>
        <ArrowBack /> 
      </button>
      <h1>{currentList.content}</h1>
      <input 
        type="text" 
        value={newItem} 
        onChange={(e) => setNewItem(e.target.value)} 
        placeholder="Uusi tuote" 
      />
      <button onClick={handleAddItem}>
        <AddIcon /> 
      </button>
      <ul>
        {currentList.items.map((item, index) => (
          <li key={index}>
            {item} 
            <button onClick={() => handleDeleteItem(item)}>
              <DeleteIcon /> 
            </button>
          </li>
        ))}
      </ul>
      <button onClick={handleDeleteList}>
        <DeleteIcon /> Poista lista
      </button>
    </div>
  );
};

export default ListView;


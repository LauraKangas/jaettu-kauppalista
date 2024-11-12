import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, addDoc, doc, deleteDoc } from 'firebase/firestore'; 
import { db } from './utils/firebase/app'; 
import { validateItemContent, checkForDuplicateItem } from './validations'; 
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Button, TextField, Stack } from '@mui/material';
import { useSnackbar } from 'notistack'; 

const ItemLists = ({ noteItems, setNoteItems }) => {
  const [newListContent, setNewListContent] = useState('');
  const { enqueueSnackbar } = useSnackbar(); 

  const handleCreateList = async () => {
    if (!newListContent) {
      enqueueSnackbar('Listan nimi ei voi olla tyhjä.', { variant: 'error' }); 
      return; 
    }
  
    const validation = validateItemContent(newListContent);
    if (!validation.isValid) {
      enqueueSnackbar(validation.message, { variant: 'error' }); 
      return;
    }
    
    const newList = { content: newListContent, items: [] }; 
    const listsCollection = collection(db, 'lists'); 
  
    try {
      const docRef = await addDoc(listsCollection, newList); 
      setNoteItems(prevItems => Array.isArray(prevItems) ? [...prevItems, { id: docRef.id, ...newList }] : [{ id: docRef.id, ...newList }]);
    } catch (error) {
      enqueueSnackbar('Virhe luodessa listaa. Yritä hetken kuluttua uudelleen.', { variant: 'error' }); 
    }
  
    setNewListContent(''); 
  };

  const handleDeleteList = async (id) => {
    try {
      await deleteDoc(doc(db, 'lists', id));
      setNoteItems(prevItems => Array.isArray(prevItems) ? prevItems.filter(item => item.id !== id) : []);
    } catch (error) {
      enqueueSnackbar('Virhe poistaessa listaa. Yritä hetken kuluttua uudelleen.', { variant: 'error' }); 
    }
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

      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
      <TextField
        label="Listan nimi"
        variant="outlined"
        size="small"
        value={newListContent}
        onChange={(e) => setNewListContent(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleCreateList(); 
          }
        }}
      />

      <Button 
        onClick={handleCreateList}>
        <AddIcon />
      </Button>
      </Stack>
    </div>
  );
};

export default ItemLists;




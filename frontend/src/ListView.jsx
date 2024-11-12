import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { updateDoc, doc } from 'firebase/firestore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBack from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { Typography, TextField, Button, Stack } from '@mui/material';
import { useSnackbar } from 'notistack'; 
import { db } from './utils/firebase/app';
import deleteList from './functions/lists/deleteList';
import { validateItemContent, checkForDuplicateItem } from './validations';

const ListView = ({ noteItems, setNoteItems }) => {
  const { id } = useParams();
  const [currentList, setCurrentList] = useState(null);
  const [newItem, setNewItem] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar(); 

  useEffect(() => {
    const foundList = Array.isArray(noteItems) ? noteItems.find(item => item.id === id) : null;
    if (foundList) {
      setCurrentList(foundList);
    } else {
      enqueueSnackbar('Listaa ei löydy.', { variant: 'error' }); 
    }
  }, [id, noteItems, enqueueSnackbar]);

  const handleDeleteList = async () => {
    try {
      await deleteList(id);
      setNoteItems(prevItems => Array.isArray(prevItems) ? prevItems.filter(item => item.id !== id) : []);
      navigate('/');
    } catch (error) {
      enqueueSnackbar('Virhe poistettaessa listaa: ' + error.message, { variant: 'error' }); 
    }
  };

  const handleAddItem = async () => {
    if (!newItem) return;

    const validation = validateItemContent(newItem);
    if (!validation.isValid) {
      enqueueSnackbar(validation.message, { variant: 'error' }); 
      return;
    }

    if (!checkForDuplicateItem(currentList.items.map(i => i.content), newItem)) {
      enqueueSnackbar('Tämä tuote on jo listalla.', { variant: 'error' }); 
      return;
    }

    const updatedList = {
      ...currentList,
      items: [...currentList.items, { content: newItem, isChecked: false }]
    };
    
    await updateDoc(doc(db, 'lists', id), updatedList);
    setNoteItems(prevItems => Array.isArray(prevItems) ? prevItems.map(item => (item.id === id ? updatedList : item)) : []);
    setNewItem('');
  };

  const handleDeleteItem = async (itemToDelete) => {
    const updatedList = {
      ...currentList,
      items: currentList.items.filter(item => item.content !== itemToDelete.content)
    };
    await updateDoc(doc(db, 'lists', id), updatedList);
    setNoteItems(prevItems => Array.isArray(prevItems) ? prevItems.map(item => (item.id === id ? updatedList : item)) : []);
  };

  const handleEditItem = async (itemToEdit) => {
    const newContent = prompt("Päivitä tuotteen sisältö", itemToEdit.content);
    if (newContent && newContent !== itemToEdit.content) {
      const validation = validateItemContent(newContent);
      if (!validation.isValid) {
        enqueueSnackbar(validation.message, { variant: 'error' });
        return;
      }

      if (!checkForDuplicateItem(currentList.items.map(i => i.content), newContent)) {
        enqueueSnackbar('Tämä tuote on jo listalla.', { variant: 'error' }); 
        return;
      }

      const updatedItems = currentList.items.map(item =>
        item.content === itemToEdit.content ? { ...item, content: newContent } : item
      );
      const updatedList = { ...currentList, items: updatedItems };
      await updateDoc(doc(db, 'lists', id), updatedList);
      setNoteItems(prevItems => Array.isArray(prevItems) ? prevItems.map(item => (item.id === id ? updatedList : item)) : []);
    }
  };

  const handleCheckboxChange = async (itemToToggle) => {
    const updatedItems = currentList.items.map(item =>
      item.content === itemToToggle.content ? { ...item, isChecked: !item.isChecked } : item
    );
    const updatedList = { ...currentList, items: updatedItems };
    
    await updateDoc(doc(db, 'lists', id), updatedList);
    setNoteItems(prevItems => Array.isArray(prevItems) ? prevItems.map(item => (item.id === id ? updatedList : item)) : []);
  };

  if (!currentList) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Button onClick={() => navigate('/')}>
        <ArrowBack />
      </Button>
      <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
        {currentList.content}
      </Typography>

      <ul>
        {currentList.items.map((item, index) => (
          <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Checkbox 
              checked={item.isChecked || false}
              onChange={() => handleCheckboxChange(item)}
            />
            <span style={{ flexGrow: 1, marginLeft: '8px', textDecoration: item.isChecked ? 'line-through' : 'none' }}>
              {item.content}
            </span>
            <Button onClick={() => handleEditItem(item)}>
              <EditIcon />
            </Button>

            <Button onClick={() => handleDeleteItem(item)}>
              <DeleteIcon />
            </Button>
          </li>
        ))}
      </ul>
      
      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <TextField
          label="Uusi tuote"
          size="small"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <Button onClick={handleAddItem}>
          <AddIcon />
        </Button>
      </Stack>

      <Button startIcon={<DeleteIcon />} onClick={handleDeleteList}>
        Poista lista
      </Button>
    </div>
  );
};

export default ListView;

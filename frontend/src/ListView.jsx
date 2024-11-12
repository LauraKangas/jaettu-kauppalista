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
  const [editingItem, setEditingItem] = useState(null); 
  const [editedItemContent, setEditedItemContent] = useState(''); 
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

  const handleEditItem = (itemToEdit) => {
    setEditingItem(itemToEdit); 
    setEditedItemContent(itemToEdit.content); 
  };

  const handleCancelEdit = () => {
    setEditingItem(null); 
    setEditedItemContent(''); 
  };

  const handleSaveEditedItem = async () => {
    if (!editedItemContent) {
      enqueueSnackbar('Tuotteen sisältö ei voi olla tyhjä.', { variant: 'error' });
      return;
    }

    const validation = validateItemContent(editedItemContent);
    if (!validation.isValid) {
      enqueueSnackbar(validation.message, { variant: 'error' });
      return;
    }

    if (!checkForDuplicateItem(currentList.items.map(i => i.content), editedItemContent)) {
      enqueueSnackbar('Tämä tuote on jo listalla.', { variant: 'error' });
      return;
    }

    const updatedItems = currentList.items.map(item =>
      item.content === editingItem.content ? { ...item, content: editedItemContent } : item
    );
    const updatedList = { ...currentList, items: updatedItems };

    await updateDoc(doc(db, 'lists', id), updatedList);
    setNoteItems(prevItems => Array.isArray(prevItems) ? prevItems.map(item => (item.id === id ? updatedList : item)) : []);
    setEditingItem(null); 
    setEditedItemContent('');
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
            
            {editingItem && editingItem.content === item.content ? (
              <TextField
                autoFocus
                size="small"
                value={editedItemContent}
                onChange={(e) => setEditedItemContent(e.target.value)}
                onBlur={handleSaveEditedItem} 
                onKeyPress={(e) => e.key === 'Enter' && handleSaveEditedItem()} 
              />
            ) : (
              <span style={{ flexGrow: 1, marginLeft: '8px', textDecoration: item.isChecked ? 'line-through' : 'none' }}>
                {item.content}
              </span>
            )}
            
            {!editingItem || editingItem.content !== item.content ? (
              <Button onClick={() => handleEditItem(item)}>
                <EditIcon />
              </Button>
            ) : (
              <>
                <Button onClick={handleSaveEditedItem}>Save</Button>
                <Button onClick={handleCancelEdit}>Cancel</Button>
              </>
            )}

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
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            handleAddItem(); 
          }
        }}
      />
        <Button 
        onClick={handleAddItem}>
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

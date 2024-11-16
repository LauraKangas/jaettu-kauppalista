import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc, deleteDoc, onSnapshot } from 'firebase/firestore';
import { db } from './utils/firebase/app';
import { useSnackbar } from 'notistack';
import { Button, TextField, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Checkbox from '@mui/material/Checkbox';
import { validateItemContent, checkForDuplicateItem } from './validations';

const ListView = ({ noteItems, setNoteItems }) => {
  const { id } = useParams();
  const [currentList, setCurrentList] = useState(null);
  const [newItem, setNewItem] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editedItemContent, setEditedItemContent] = useState('');
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const userPin = localStorage.getItem('userPin');

  useEffect(() => {
    const fetchList = async () => {
      if (!userPin) return;

      const docRef = doc(db, 'users', userPin, 'lists', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setCurrentList(docSnap.data());
      } else {
        enqueueSnackbar('Listaa ei löydy.', { variant: 'error' });
      }
    };

    fetchList();
  }, [id, userPin, enqueueSnackbar]);

  useEffect(() => {
    if (!currentList) return;

    const unsubscribe = onSnapshot(
      doc(db, 'users', userPin, 'lists', id),
      (doc) => {
        if (doc.exists()) {
          setCurrentList(doc.data());
        }
      },
      (error) => {
        enqueueSnackbar('Virhe listan kuuntelussa: ' + error.message, { variant: 'error' });
      }
    );

    return () => unsubscribe();
  }, [currentList, userPin, id, enqueueSnackbar]);

  const handleDeleteList = async () => {
    try {
      await deleteDoc(doc(db, 'users', userPin, 'lists', id));
      setNoteItems(prevItems => prevItems.filter(item => item.id !== id));
      navigate('/lists');
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

    const newItemObject = { content: newItem, isChecked: false };

    const updatedList = {
      ...currentList,
      items: [...currentList.items, newItemObject]
    };

    setCurrentList(updatedList);

    setNoteItems(prevItems =>
      prevItems.map(item => (item.id === id ? updatedList : item))
    );

    try {
      await updateDoc(doc(db, 'users', userPin, 'lists', id), updatedList);

      setNewItem('');
    } catch (error) {
      enqueueSnackbar('Virhe lisättäessä tuotetta: ' + error.message, { variant: 'error' });
    }
  };

  const handleDeleteItem = async (itemToDelete) => {
    const updatedList = {
      ...currentList,
      items: currentList.items.filter(item => item.content !== itemToDelete.content)
    };

    try {
      await updateDoc(doc(db, 'users', userPin, 'lists', id), updatedList);

      setCurrentList(updatedList);

      setNoteItems(prevItems =>
        prevItems.map(item => (item.id === id ? updatedList : item))
      );
    } catch (error) {
      enqueueSnackbar('Virhe poistettaessa tuotetta: ' + error.message, { variant: 'error' });
    }
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

    const updatedItems = currentList.items.map(item =>
      item.content === editingItem.content ? { ...item, content: editedItemContent } : item
    );

    const updatedList = { ...currentList, items: updatedItems };

    try {
      const docRef = doc(db, 'users', userPin, 'lists', id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        enqueueSnackbar('Päivitettävää dokumenttia ei löytynyt.', { variant: 'error' });
        return;
      }

      await updateDoc(docRef, updatedList);

      setCurrentList(updatedList);
      setNoteItems(prevItems => prevItems.map(item => (item.id === id ? updatedList : item)));

      setEditingItem(null);
      setEditedItemContent('');
    } catch (error) {
      enqueueSnackbar('Virhe muokattaessa tuotetta: ' + error.message, { variant: 'error' });
    }
  };

  const handleCheckboxChange = async (itemToToggle) => {
    const updatedItems = currentList.items.map(item =>
      item.content === itemToToggle.content
        ? { ...item, isChecked: !item.isChecked }
        : item
    );

    const updatedList = { ...currentList, items: updatedItems };

    try {
      const docRef = doc(db, 'users', userPin, 'lists', id);
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        enqueueSnackbar('Päivitettävää dokumenttia ei löytynyt.', { variant: 'error' });
        return;
      }

      await updateDoc(docRef, updatedList);

      setCurrentList(updatedList);
      setNoteItems(prevItems =>
        prevItems.map(item => (item.id === id ? updatedList : item))
      );
    } catch (error) {
      console.error('Error updating checkbox: ', error);
      enqueueSnackbar('Virhe päivittäessä valintaa: ' + error.message, { variant: 'error' });
    }
  };

  
  if (!currentList) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Button onClick={() => navigate('/lists')}>
        <ArrowBack />
      </Button>
      <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
        {currentList.content}
      </Typography>

      <ul>
      {currentList.items.map((item, index) => (
        <li key={item.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
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
            <span
              style={{
                flexGrow: 1,
                marginLeft: '8px',
                textDecoration: item.isChecked ? 'line-through' : 'none', 
              }}
            >
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

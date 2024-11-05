import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { arrayUnion, collection, doc, getDocs, updateDoc, where, query } from 'firebase/firestore';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import ArrowBack from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import { Typography, TextField, Button, Stack } from '@mui/material';
import deleteList from './functions/lists/deleteList';
import { db } from './utils/firebase/app';
import { validateItemContent, checkForDuplicateItem } from './Validations';

const ListView = ({ noteItems, setNoteItems }) => {
  const { id } = useParams();
  const [currentList, setCurrentList] = useState(null);
  const [newItem, setNewItem] = useState('');
  const [shareTo, setShareTo] = useState('');
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

    if (!checkForDuplicateItem(currentList.items.map(i => i.content), newItem)) {
      alert('Tämä tuote on jo listalla');
      return;
    }

    const updatedList = {
      ...currentList,
      items: [...currentList.items, { content: newItem, isChecked: false }]
    };
    
    await updateDoc(doc(db, 'lists', id), updatedList);
    setNoteItems(prevItems => prevItems.map(item => (item.id === id ? updatedList : item)));
    setNewItem('');
  };

  const handleDeleteItem = async (itemToDelete) => {
    const updatedList = {
      ...currentList,
      items: currentList.items.filter(item => item.content !== itemToDelete.content)
    };
    await updateDoc(doc(db, 'lists', id), updatedList);
    setNoteItems(prevItems => prevItems.map(item => (item.id === id ? updatedList : item)));
  };

  const handleEditItem = async (itemToEdit) => {
    const newContent = prompt("Päivitä tuotteen sisältö", itemToEdit.content);
    if (newContent && newContent !== itemToEdit.content) {
      const validation = validateItemContent(newContent);
      if (!validation.isValid) {
        alert(validation.message);
        return;
      }

      if (!checkForDuplicateItem(currentList.items.map(i => i.content), newContent)) {
        alert('Tämä tuote on jo listalla');
        return;
      }

      const updatedItems = currentList.items.map(item =>
        item.content === itemToEdit.content ? { ...item, content: newContent } : item
      );
      const updatedList = { ...currentList, items: updatedItems };
      await updateDoc(doc(db, 'lists', id), updatedList);
      setNoteItems(prevItems => prevItems.map(item => (item.id === id ? updatedList : item)));
    }
  };

  const shareList = async () => {
    try {
      const q = query(collection(db, 'users'), where('email', '==', shareTo));
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const userDoc = querySnapshot.docs[0];
        await updateDoc(doc(db, 'lists', id), {
          sharedTo: arrayUnion(userDoc.id),
        });
        setShareTo('');
        alert(`List shared with ${shareTo}`);
      } else {
        alert("User not found");
      }
    } catch (error) {
      console.error("Error sharing list:", error);
    }
  };

  const handleCheckboxChange = async (itemToToggle) => {
    const updatedItems = currentList.items.map(item =>
      item.content === itemToToggle.content ? { ...item, isChecked: !item.isChecked } : item
    );
    const updatedList = { ...currentList, items: updatedItems };
    
    await updateDoc(doc(db, 'lists', id), updatedList);
    setNoteItems(prevItems => prevItems.map(item => (item.id === id ? updatedList : item)));
  };

  if (!currentList) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <IconButton onClick={() => navigate('/')}>
        <ArrowBack />
      </IconButton>
      <Typography variant="h4" component="h1" textAlign="center" gutterBottom>
        {currentList.content}
      </Typography>

      <ul>
        {currentList.items.map((item, index) => (
          <li key={index} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
            <Checkbox 
              color="primary"
              checked={item.isChecked || false}
              onChange={() => handleCheckboxChange(item)}
            />
            <span style={{ flexGrow: 1, marginLeft: '8px', textDecoration: item.isChecked ? 'line-through' : 'none' }}>
              {item.content}
            </span>
            <IconButton onClick={() => handleEditItem(item)} color="primary">
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDeleteItem(item)} color="secondary">
              <DeleteIcon />
            </IconButton>
          </li>
        ))}
      </ul>
      
      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <TextField
          label="Uusi tuote"
          variant="outlined"
          size="small"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
        />
        <IconButton onClick={handleAddItem} color="primary">
          <AddIcon />
        </IconButton>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" mt={2} mb={2}>
        <TextField
          label="Jaa henkilölle..."
          variant="outlined"
          size="small"
          value={shareTo}
          onChange={e => setShareTo(e.target.value)}
        />
        <Button variant="contained" onClick={shareList}>
          Jaa lista
        </Button>
      </Stack>

      <Button variant="outlined" color="error" startIcon={<DeleteIcon />} onClick={handleDeleteList} fullWidth>
        Poista lista
      </Button>
    </div>
  );
};

export default ListView;

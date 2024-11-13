import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc, deleteDoc, getDocs } from 'firebase/firestore'; 
import { db } from './utils/firebase/app'; 
import { validateItemContent } from './validations'; 
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Button, TextField, Stack } from '@mui/material';
import { useSnackbar } from 'notistack'; 
import LogOut from './LogOut';
import Edit from '@mui/icons-material/Edit';

const ItemLists = ({ noteItems, setNoteItems }) => {
  const [newListContent, setNewListContent] = useState('');
  const { enqueueSnackbar } = useSnackbar(); 

  const navigate = useNavigate();

  const [userPin, setUserPin] = useState(null); 

  useEffect(() => {
    const storedUserPin = localStorage.getItem('userPin');
    if (storedUserPin) {
      setUserPin(storedUserPin);  
    } else {
      console.error('UserPin not found');
    }
  }, []);

  useEffect(() => {
    const fetchLists = async () => {
      if (!userPin) return;  

      const listsCollection = collection(db, 'users', userPin, 'lists');
      const querySnapshot = await getDocs(listsCollection);
      const listsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setNoteItems(listsArray);
    };

    fetchLists();  
  }, [userPin, setNoteItems]);
  

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
    const listsCollection = collection(db, 'users', userPin, 'lists'); 
  
    try {
      const docRef = await addDoc(listsCollection, newList); 
      setNoteItems(prevItems => [...prevItems, { id: docRef.id, ...newList }]);
    } catch (error) {
      enqueueSnackbar('Virhe luodessa listaa. Yritä hetken kuluttua uudelleen.', { variant: 'error' }); 
    }
  
    setNewListContent(''); 
  };

  return (
    <div>
      <div>
        <LogOut />
      </div>
      <h1>Listasi</h1>
      <p>Tervetuloa käyttäjä: <strong>{userPin}</strong>!</p>
      <ul>
        {noteItems && noteItems.map((item) => (
          <li key={item.id}>
            <Link to={`/list/${item.id}`}>{item.content}</Link>
            <Button onClick={() => navigate(`/list/${item.id}`)}>
            <Edit />
          </Button>
          </li>
        ))}
      </ul>

      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <p>Luo uusi lista:</p>
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
        <Button onClick={handleCreateList}>
          <AddIcon />
        </Button>
      </Stack>
    </div>
  );
};

export default ItemLists;




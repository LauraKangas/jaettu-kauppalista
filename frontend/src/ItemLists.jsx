import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, addDoc, getDocs, doc, setDoc, query, where, collectionGroup } from 'firebase/firestore'; 
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
  const [joinCode, setJoinCode] = useState('');
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

      try {
          const listsCollection = collection(db, 'users', userPin, 'lists');
          const querySnapshot = await getDocs(listsCollection);
          const listsArray = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setNoteItems(listsArray);
        
      } catch (error) {
        console.error("Error fetching lists:", error);
        enqueueSnackbar('Virhe listojen hakemisessa.', { variant: 'error' });
      }
    };

    fetchLists();
  }, [userPin, setNoteItems, enqueueSnackbar]);

  useEffect(() => {
    if (noteItems && noteItems.length > 0) {
      localStorage.setItem('noteItems', JSON.stringify(noteItems));
    }
  }, [noteItems]);

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

    const uniqueCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    const newList = { content: newListContent, items: [], code: uniqueCode };

    const listsCollection = collection(db, 'users', userPin, 'lists');
    
    try {
      const docRef = await addDoc(listsCollection, newList);
      const updatedNoteItems = [...noteItems, { id: docRef.id, ...newList }];
      setNoteItems(updatedNoteItems);
      localStorage.setItem('noteItems', JSON.stringify(updatedNoteItems));
      enqueueSnackbar('Lista luotiin onnistuneesti.', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Virhe luodessa listaa. Yritä hetken kuluttua uudelleen.', { variant: 'error' });
    }

    setNewListContent(''); 
  };

  const handleJoinList = async () => {
    if (!joinCode) {
      enqueueSnackbar('Anna listan koodi.', { variant: 'error' });
      return;
    }
  
    try {
      const listsQuery = query(collectionGroup(db, 'lists'), where('code', '==', joinCode));
      const querySnapshot = await getDocs(listsQuery);
  
      if (querySnapshot.empty) {
        enqueueSnackbar('Listaa ei löydy.', { variant: 'error' });
        return;
      }
  
      let foundList = null;
      querySnapshot.forEach((doc) => {
        foundList = { id: doc.id, ...doc.data() };
      });
  
      if (foundList) {
        const updatedNoteItems = [...noteItems, foundList];
        setNoteItems(updatedNoteItems);
        localStorage.setItem('noteItems', JSON.stringify(updatedNoteItems));
        enqueueSnackbar('Lista lisätty onnistuneesti.', { variant: 'success' });
      }
    } catch (error) {
      enqueueSnackbar('Virhe etsiessä listaa: ' + error.message, { variant: 'error' });
    }
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

      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <p>Liity listaan koodilla:</p>
        <TextField
          label="Anna koodi"
          variant="outlined"
          size="small"
          value={joinCode}
          onChange={(e) => setJoinCode(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleJoinList();
            }
          }}
        />
        <Button onClick={handleJoinList}>
          <AddIcon />
        </Button>
      </Stack>
    </div>
  );
};

export default ItemLists;


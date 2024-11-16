import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, collectionGroup, getDocs, addDoc, where, query, doc, setDoc } from 'firebase/firestore';
import { db } from './utils/firebase/app';
import { useSnackbar } from 'notistack';
import { Button, TextField, Stack } from '@mui/material';
import LogOut from './LogOut';
import AddIcon from '@mui/icons-material/Add';
import { validateItemContent } from './validations';

const ItemLists = ({ noteItems, setNoteItems }) => {
  const [newListContent, setNewListContent] = useState('');
  const [code, setCode] = useState('');
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
        code: doc.data().code,
        content: doc.data().content,
        items: doc.data().items || [],
      }));

      setNoteItems(listsArray);
    };

    fetchLists();
  }, [userPin, setNoteItems]);

  const generateListCode = () => {
    return Math.random().toString(36).substring(2, 8);  
  };

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

    const code = generateListCode().toUpperCase();  

    const newList = {
      content: newListContent,
      items: [],
      code: code, 
    };

    const listsCollection = collection(db, 'users', userPin, 'lists');

    try {
      const docRef = await addDoc(listsCollection, newList);
      setNoteItems(prevItems => [
        ...prevItems,
        { id: docRef.id, ...newList }, 
      ]);
      enqueueSnackbar('Lista luotiin onnistuneesti.', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Virhe luodessa listaa. Yritä hetken kuluttua uudelleen.', { variant: 'error' });
    }

    setNewListContent('');
  };
  const handleJoinListByCode = async () => {
    if (!code) {
      enqueueSnackbar('Syötä lista koodi', { variant: 'error' });
      return;
    }
  
    try {
      const listsQuery = query(
        collectionGroup(db, 'lists'), 
        where('code', '==', code)
      );
      const querySnapshot = await getDocs(listsQuery);
  
      console.log('Query snapshot size:', querySnapshot.size);
  
      if (!querySnapshot.empty) {
        const listToJoin = querySnapshot.docs[0];
        const listData = { id: listToJoin.id, ...listToJoin.data() };

        const targetDocRef = doc(db, 'users', userPin, 'lists', listData.id);
        await setDoc(targetDocRef, listData);

        setNoteItems(prevItems => [...prevItems, listData]);
        enqueueSnackbar('Listalle liittyminen onnistui.', { variant: 'success' });
      } else {
        enqueueSnackbar('Listaa ei löytynyt koodilla.', { variant: 'error' });
      }
    } catch (error) {
      console.error('Virhe listan hakemisessa: ', error);
      enqueueSnackbar('Virhe listan hakemisessa: ' + error.message, { variant: 'error' });
    }
  };
  
  
  return (
    <div>
      <LogOut />
      <h1>Listasi</h1>
      <p>Tervetuloa käyttäjä: <strong>{userPin}</strong>!</p>
      <ul>
        {noteItems && noteItems.map((item) => (
          <li key={item.id}>
            <Link to={`/list/${item.id}`}>{item.content}</Link>
            <Button onClick={() => navigate(`/list/${item.id}`)}>
              <AddIcon />
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
        <p>Liity listalle:</p>
        <TextField
          label="Syötä koodi"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          size="small"
        />
        <Button onClick={handleJoinListByCode}>
          <AddIcon />
        </Button>
      </Stack>
    </div>
  );
};

export default ItemLists;










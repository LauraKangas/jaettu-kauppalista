import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, where, arrayUnion, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './utils/firebase/app';
import { useSnackbar } from 'notistack';
import { Button, TextField, Stack } from '@mui/material';
import LogOut from './LogOut';
import AddIcon from '@mui/icons-material/Add';
import { validateItemContent } from './validations';

const ItemLists = () => {
  const [newListContent, setNewListContent] = useState('');
  const [code, setCode] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [userPin, setUserPin] = useState(null);
  const [noteItems, setNoteItems] = useState(null);

  useEffect(() => {
    const storedUserPin = localStorage.getItem('userPin');

    storedUserPin
      ? setUserPin(storedUserPin)
      : console.error('UserPin not found')
  }, []);

  useEffect(() => {
    (async () => {
      if (!userPin) return;

      const listsCollection = await getDocs(collection(db, 'lists'));
      const lists = listsCollection.docs
        .filter(doc => doc.data().visibleTo.includes(userPin))
        .map(doc => ({ ...doc.data(), id: doc.id }))

      setNoteItems(lists);
    })()
  }, [userPin, setNoteItems]);

  const capitalize = item => `${item.slice(0, 1).toUpperCase()}${item.slice(1).toLowerCase()}`

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

    const newList = {
      content: newListContent,
      items: [], 
      code: Math.random().toString(36).substring(2, 8).toUpperCase(),
      visibleTo: [userPin],
    };

    try {
      const docRef = await addDoc(collection(db, 'lists'), newList);

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
      enqueueSnackbar('Syötä koodi', { variant: 'error' });
      return;
    }
  
    try {
      const listsCollection = await getDocs(collection(db, 'lists'), where('code', '==', code));
  
      if (!listsCollection.empty) {
        const listData = listsCollection.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
        })).find(list => list.code === code);  
  
        const userPinString = String(userPin);
        if (listData.visibleTo.includes(userPinString)) {
          enqueueSnackbar('Olet jo liittynyt listalle.', { variant: 'error' });
        } else {
          await updateDoc(doc(db, 'lists', listData.id), {
            visibleTo: arrayUnion(userPin),
          });
  
          const updatedDoc = await getDoc(doc(db, 'lists', listData.id));
          const updatedListData = {
            ...updatedDoc.data(),
            id: updatedDoc.id,
          };
    
          setNoteItems(prevItems => {
            const listExists = prevItems.some(item => item.id === updatedListData.id);
            if (!listExists) {
              return [...prevItems, updatedListData];
            }
            return prevItems;
          });
        }
      } else {
        enqueueSnackbar('Listaa ei löytynyt koodilla.', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Virhe listan hakemisessa: ' + error.message, { variant: 'error' });
    }
  
  
  
    /* try {
      const listsCollection = await getDocs(collection(db, 'lists'), where('visibleTo', 'array-contains', userPin))
  
      if (!listsCollection.empty) {
        const listData = {
          ...listsCollection.docs[0].data(),
          id: listsCollection.docs[0].id,
        }
        await updateDoc(doc(db, 'lists', listData.id), {
          visibleTo: arrayUnion(userPin),
        })

        setNoteItems(prevItems => [...prevItems, listData]);
        enqueueSnackbar('Listalle liittyminen onnistui.', { variant: 'success' });
      } else {
        enqueueSnackbar('Listaa ei löytynyt koodilla.', { variant: 'error' });
      }
    } catch (error) {
      console.error('Virhe listan hakemisessa: ', error);
      enqueueSnackbar('Virhe listan hakemisessa: ' + error.message, { variant: 'error' });
    } */
  };
  
  const handleLogout = () => {
    localStorage.removeItem('userPin'); 
    navigate('/'); 
  };
  
  return (
    <div>
      <LogOut onLogout={handleLogout} />
      <h1>Listasi</h1>
      <p>Tervetuloa käyttäjä: <strong>{userPin}</strong></p>
      <ul>
        {noteItems && noteItems.map((item) => (
          <li key={item.id}>
            <Link to={`/list/${item.id}`} state={{ list: item }}>{capitalize(item.content)}</Link>
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
          label="Syötä liittymisavain"
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










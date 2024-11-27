import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, addDoc, where, arrayUnion, arrayRemove, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './utils/firebase/app';
import { useSnackbar } from 'notistack';
import { Button, TextField, Stack, IconButton } from '@mui/material';
import LogOut from './LogOut';
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { validateItemContent } from './validations';

const ItemLists = () => {
  const [newListContent, setNewListContent] = useState('');
  const [code, setCode] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [userPin, setUserPin] = useState(null);
  const [noteItems, setNoteItems] = useState([]);

  // Fetch userPin from localStorage and set state
  useEffect(() => {
    const storedUserPin = localStorage.getItem('userPin');
    if (storedUserPin) {
      setUserPin(storedUserPin);
    } else {
      navigate('/login');  // Optionally redirect to login if userPin is not found
    }
  }, [navigate]);

  // Fetch lists from Firestore
  useEffect(() => {
    const fetchLists = async () => {
      if (!userPin) return;

      try {
        const listsCollection = await getDocs(collection(db, 'lists'));
        const lists = listsCollection.docs
          .filter(doc => doc.data().visibleTo.includes(userPin))
          .map(doc => ({ ...doc.data(), id: doc.id }));

        setNoteItems(lists);
      } catch (error) {
        enqueueSnackbar('Virhe listojen hakemisessa: ' + error.message, { variant: 'error' });
      }
    };

    fetchLists();
  }, [userPin, enqueueSnackbar]);

  // Capitalize list content
  const capitalize = item => `${item.slice(0, 1).toUpperCase()}${item.slice(1).toLowerCase()}`;

  // Handle creating a new list
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
      isFavorite: false,
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

  // Toggle favorite status for a list
  const handleToggleFavorite = async (list) => {
    const favorites = list.favorites || [];  // Default to empty array if undefined
    const isFavorite = favorites.includes(userPin);

    setNoteItems(prevItems =>
      prevItems.map(item =>
        item.id === list.id
          ? {
              ...item,
              favorites: isFavorite
                ? item.favorites.filter(pin => pin !== userPin)
                : [...item.favorites, userPin],
            }
          : item
      )
    );

    try {
      await updateDoc(doc(db, 'lists', list.id), {
        favorites: isFavorite ? arrayRemove(userPin) : arrayUnion(userPin),
      });
    } catch (error) {
      setNoteItems(prevItems =>
        prevItems.map(item =>
          item.id === list.id
            ? { ...item, favorites: isFavorite ? [...item.favorites, userPin] : item.favorites.filter(pin => pin !== userPin) }
            : item
        )
      );
      enqueueSnackbar('Virhe päivittäessä suosikkiasetusta: ' + error.message, { variant: 'error' });
    }
  };

  const handleToggleHide = async (list) => {
    const hiddenBy = list.hiddenBy || [];  
    const isHidden = hiddenBy.includes(userPin);

    setNoteItems(prevItems =>
      prevItems.map(item =>
        item.id === list.id
          ? {
              ...item,
              hiddenBy: isHidden
                ? item.hiddenBy.filter(pin => pin !== userPin)
                : [...item.hiddenBy, userPin],
            }
          : item
      )
    );

    try {
      await updateDoc(doc(db, 'lists', list.id), {
        hiddenBy: isHidden ? arrayRemove(userPin) : arrayUnion(userPin),
      });
    } catch (error) {
      setNoteItems(prevItems =>
        prevItems.map(item =>
          item.id === list.id
            ? { ...item, hiddenBy: isHidden ? [...item.hiddenBy, userPin] : item.hiddenBy.filter(pin => pin !== userPin) }
            : item
        )
      );
      enqueueSnackbar('Virhe piilotettaessa listaa: ' + error.message, { variant: 'error' });
    }
  };

  const handleJoinListByCode = async () => {
    if (!code) {
      enqueueSnackbar('Syötä koodi', { variant: 'error' });
      return;
    }

    try {
      const listsCollection = await getDocs(collection(db, 'lists'), where('code', '==', code));

      if (!listsCollection.empty) {
        const listData = listsCollection.docs
          .map(doc => ({
            ...doc.data(),
            id: doc.id,
          }))
          .find(list => list.code === code);

        if (listData.visibleTo.includes(userPin)) {
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
        {noteItems &&
          noteItems
            .filter(item => !(item.hiddenBy || []).includes(userPin)) 
            .sort((a, b) => (b.favorites || []).length - (a.favorites || []).length)
            .map((item) => (
              <li key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => handleToggleFavorite(item)}>
                  {(item.favorites || []).includes(userPin) ? <StarIcon style={{ color: 'gold' }} /> : <StarBorderIcon />}
                </IconButton>
                <Link to={`/list/${item.id}`} state={{ list: item }} style={{ flexGrow: 1 }}>
                  {capitalize(item.content)}
                </Link>
                <IconButton onClick={() => handleToggleHide(item)}>
                  {(item.hiddenBy || []).includes(userPin) ? <Visibility /> : <VisibilityOff />}
                </IconButton>
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
        <Button onClick={handleCreateList}>
          <AddIcon />
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center">
        <TextField
          label="Liity listalle koodilla"
          variant="outlined"
          size="small"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button onClick={handleJoinListByCode}>Liity</Button>
      </Stack>
      {noteItems &&
      noteItems
        .filter(item => item.hiddenBy.includes(userPin)) 
        .sort((a, b) => b.favorites.length - a.favorites.length) 
        .map((item) => (
          <li key={item.id} style={{ display: 'flex', alignItems: 'center', opacity: 0.5 }}>
            <IconButton onClick={() => handleToggleFavorite(item)}>
              {item.favorites.includes(userPin) ? <StarIcon style={{ color: 'gold' }} /> : <StarBorderIcon />}
            </IconButton>
            <Link to={`/list/${item.id}`} state={{ list: item }} style={{ flexGrow: 1 }}>
              {capitalize(item.content)} (Hidden)
            </Link>
            <IconButton onClick={() => handleToggleHide(item)}>
              {item.hiddenBy.includes(userPin) ? <Visibility /> : <VisibilityOff />} 
            </IconButton>
          </li>
      ))}
    </div>
  );
};

export default ItemLists;










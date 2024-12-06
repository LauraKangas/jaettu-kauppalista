import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Button, TextField, Stack, IconButton } from '@mui/material';
import { db } from "./utils/firebase/app";
import AddIcon from '@mui/icons-material/Add';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import { handleCreateList } from './functions/lists/handleCreateList';
import { handleToggleFavorite } from './functions/lists/handleToggleFavorite';
import { handleToggleHide } from './functions/lists/handleToggleHide';
import { handleJoinListByCode } from './functions/lists/handleJoinListByCode';

const ItemLists = () => {
  const [newListContent, setNewListContent] = useState('');
  const [code, setCode] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [userPin, setUserPin] = useState(null);
  const [noteItems, setNoteItems] = useState([]);

  useEffect(() => {
    const storedUserPin = localStorage.getItem('userPin');
    if (storedUserPin) {
      setUserPin(storedUserPin);
    } else {
      navigate('/');  
    }
  }, [navigate]);

  useEffect(() => {
    const fetchLists = async () => {
      if (!userPin) return;
  
      try {
        const listsCollection = await getDocs(collection(db, 'lists'));
        const lists = listsCollection.docs
          .map(doc => {
            const data = doc.data();
            const visibleTo = Array.isArray(data.visibleTo) ? data.visibleTo : [];
            const hiddenBy = Array.isArray(data.hiddenBy) ? data.hiddenBy : [];
            const favorites = Array.isArray(data.favorites) ? data.favorites : [];

            if (visibleTo.includes(userPin)) {
              return {
                ...data,
                id: doc.id,
                favorites,
                hiddenBy,
                isFavorite: favorites.includes(userPin),
              };
            }
            return null;
          })
          .filter(doc => doc !== null);  

        const sortedLists = lists.sort((a, b) => b.isFavorite - a.isFavorite);
        setNoteItems(sortedLists);
      } catch (error) {
        enqueueSnackbar('Virhe listojen hakemisessa: ' + error.message, { variant: 'error' });
      }
    };
  
    fetchLists();
  }, [userPin, enqueueSnackbar]);

  const capitalize = item => `${item.slice(0, 1).toUpperCase()}${item.slice(1).toLowerCase()}`;

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Listasi</h1>
        <p>Tervetuloa käyttäjä: <strong>{userPin}</strong></p>
      </div>

      <ul>
      {noteItems &&
        noteItems
          .filter(item => !(item.hiddenBy && item.hiddenBy.includes(userPin)))  
          .map((item) => (
            <li key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
              <IconButton onClick={() => handleToggleFavorite(item, userPin, setNoteItems, enqueueSnackbar)}>
                {item.favorites.includes(userPin) ? <StarIcon style={{ color: 'gold' }} /> : <StarBorderIcon />}
              </IconButton>
              <Link to={`/list/${item.id}`} state={{ list: item }} style={{ flexGrow: 1 }}>
                {capitalize(item.content)}
              </Link>
              <IconButton onClick={() => handleToggleHide(item, userPin, setNoteItems, enqueueSnackbar)}>
                {item.hiddenBy && item.hiddenBy.includes(userPin) ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </li>
          ))}
      </ul>

      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <TextField
          label="Listan nimi"
          variant="outlined"
          value={newListContent}
          onChange={(e) => setNewListContent(e.target.value)}
        />
        <Button 
          onClick={() => handleCreateList(newListContent, userPin, enqueueSnackbar, navigate)}
        >
          <AddIcon />
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <TextField
          label="Syötä listan koodi"
          variant="outlined"
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
        <Button 
          onClick={() => handleJoinListByCode(code, userPin, setNoteItems, enqueueSnackbar)}
        >
          Liity
        </Button>
      </Stack>
      <ul>
        {noteItems &&
          noteItems
            .filter(item => item.hiddenBy && item.hiddenBy.includes(userPin))  // Show hidden items
            .map((item) => (
              <li key={item.id} style={{ display: 'flex', alignItems: 'center', opacity: 0.5 }}>
                <Link to={`/list/${item.id}`} state={{ list: item }} style={{ flexGrow: 1 }}>
                  {capitalize(item.content)} (Piilotettu)
                </Link>
                <IconButton onClick={() => handleToggleHide(item, userPin, setNoteItems, enqueueSnackbar)}>
                  {item.hiddenBy && item.hiddenBy.includes(userPin) ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </li>
            ))}
      </ul>
    </div>
  );
};

export default ItemLists;

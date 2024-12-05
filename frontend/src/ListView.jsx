import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from './utils/firebase/app';
import { useSnackbar } from 'notistack';
import { Button, TextField, Stack, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Checkbox from '@mui/material/Checkbox';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ContentCopy from '@mui/icons-material/ContentCopy';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { validateItemContent, checkForDuplicateItem } from './validations';

const ListView = () => {
  const { id } = useParams();
  const { state } = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const userPin = localStorage.getItem('userPin');

  const [listUpdates, setListUpdates] = useState(null);
  const [newItem, setNewItem] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [editedItemContent, setEditedItemContent] = useState('');
  const [sharedCount, setSharedCount] = useState(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditingListName, setIsEditingListName] = useState(false); 
  const [editedListName, setEditedListName] = useState(''); 

  const handleDialogOpen = () => setIsDialogOpen(true);
  const handleDialogClose = () => setIsDialogOpen(false);

  const fetchList = async () => {
    try {
      const listDocRef = doc(db, 'lists', id);
      const listDoc = await getDoc(listDocRef);
      if (listDoc.exists()) {
        const listData = listDoc.data();
        setListUpdates(listData);
        setEditedListName(listData.content); 
        if (Array.isArray(listData.visibleTo)) {
          setSharedCount(listData.visibleTo.length);
        }
      } else {
        enqueueSnackbar('Listaa ei löytynyt.', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Virhe ladattaessa listaa: ' + error.message, { variant: 'error' });
    }
  };

  useEffect(() => {
    fetchList();
  }, [id]);

  const handleDeleteListConfirmed = async () => {
    try {
      const listDocRef = doc(db, 'lists', id);
      const listDoc = await getDoc(listDocRef);
  
      if (listDoc.exists()) {
        const listData = listDoc.data();
  
        if (listData.visibleTo.includes(userPin)) {
          await updateDoc(listDocRef, {
            visibleTo: arrayRemove(userPin),
          });
        }
        setListUpdates(null);
  
        enqueueSnackbar('Lista poistettu onnistuneesti.', { variant: 'success' });
        navigate('/lists');
      } else {
        enqueueSnackbar('Listaa ei löytynyt.', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Virhe poistettaessa listaa: ' + error.message, { variant: 'error' });
    } finally {
      handleDialogClose(); 
    }
  };

  const handleEditListName = async () => {
    if (editedListName.trim()) {
      try {
        await updateDoc(doc(db, 'lists', id), {
          content: editedListName,
        });

        enqueueSnackbar('Listan nimi päivitetty.', { variant: 'success' });
        setListUpdates(prev => ({ ...prev, content: editedListName }));
        setIsEditingListName(false);
      } catch (error) {
        enqueueSnackbar('Virhe listan nimen päivittämisessä: ' + error.message, { variant: 'error' });
      }
    } else {
      enqueueSnackbar('Listan nimi ei voi olla tyhjä.', { variant: 'error' });
    }
  };

  const handleCancelEditListName = () => {
    setEditedListName(listUpdates.content);
    setIsEditingListName(false);
  };

  const handleAddItem = async () => {
    if (!newItem) {
      enqueueSnackbar('Tuote ei voi olla tyhjä.', { variant: 'error' });
      return;
    }

    const validation = validateItemContent(newItem);
    if (!validation.isValid) {
      enqueueSnackbar(validation.message, { variant: 'error' });
      return;
    }

    if (!checkForDuplicateItem(listUpdates.items.map(i => i.content), newItem)) {
      enqueueSnackbar('Tämä tuote on jo listalla.', { variant: 'error' });
      return;
    }

    const newItemObject = { content: newItem, isChecked: false, isFavorite: false };

    try {
      await updateDoc(doc(db, 'lists', id), {
        items: arrayUnion(newItemObject),
      });

      fetchList();
      setNewItem('');
    } catch (error) {
      enqueueSnackbar('Virhe lisättäessä tuotetta: ' + error.message, { variant: 'error' });
    }
  };

  const handleDeleteItem = async (itemToDelete) => {
    try {
      await updateDoc(doc(db, 'lists', id), {
        items: arrayRemove(itemToDelete),
      });

      fetchList();
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

    const updatedList = {
      ...listUpdates,
      items: listUpdates.items.map(item => ({
        ...item,
        content: item.content === editingItem.content
          ? editedItemContent
          : item.content,
      })),
    };

    try {
      await updateDoc(doc(db, 'lists', id), {
        items: updatedList.items,
      });

      fetchList();
      setEditingItem(null);
      setEditedItemContent('');
    } catch (error) {
      enqueueSnackbar('Virhe päivittäessä valintaa: ' + error.message, { variant: 'error' });
    }
  };

  const handleCheckboxChange = async (itemToToggle) => {
    const updatedList = {
      ...listUpdates,
      items: listUpdates.items.map(item => ({
        ...item,
        isChecked: item.content === itemToToggle.content ? !item.isChecked : item.isChecked,
      })),
    };

    try {
      await updateDoc(doc(db, 'lists', id), {
        items: updatedList.items,
      });

      fetchList();
    } catch (error) {
      enqueueSnackbar('Virhe päivittäessä valintaa: ' + error.message, { variant: 'error' });
    }
  };

  const handleToggleFavorite = async (itemToToggle) => {
    const updatedList = {
      ...listUpdates,
      items: listUpdates.items.map(item =>
        item.content === itemToToggle.content
          ? { ...item, isFavorite: !item.isFavorite }
          : item
      ),
    };

    try {
      await updateDoc(doc(db, 'lists', id), {
        items: updatedList.items,
      });

      fetchList();
    } catch (error) {
      enqueueSnackbar('Virhe päivittäessä suosikkia: ' + error.message, { variant: 'error' });
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(listUpdates.code)
      .then(() => {
        enqueueSnackbar('Koodi kopioitu leikepöydälle!', { variant: 'success' });
      })
      .catch((error) => {
        enqueueSnackbar('Virhe koodin kopioinnissa: ' + error.message, { variant: 'error' });
      });
  };

  if (!listUpdates) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Button onClick={() => navigate('/lists')}>
        <ArrowBack />
      </Button>
      {isEditingListName ? (
        <Stack direction="row" spacing={1} alignItems="center">
          <TextField
            variant="outlined"
            color='black'
            size="small"
            value={editedListName}
            onChange={(e) => setEditedListName(e.target.value)}
            onBlur={handleEditListName}
            onKeyPress={(e) => e.key === 'Enter' && handleEditListName()}
          />
          <Button onClick={handleCancelEditListName}>Cancel</Button>
        </Stack>
      ) : (
        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
          <Typography variant="h4" component="h1" gutterBottom>
            {listUpdates.content}
          </Typography>
          <Button onClick={() => setIsEditingListName(true)}>
            <EditIcon />
          </Button>
        </Stack>
      )}

      <Stack direction="row" spacing={1} alignItems="center" mb={1}>
        <p>Liittymisavain: <strong>{listUpdates.code}</strong></p>
        <Button onClick={handleCopyCode}>
          <ContentCopy style={{ fontSize: 15 }} />
        </Button>
      </Stack>

      <Typography variant='subtitle1' color="textSecondary">
        Jaettu {sharedCount - 1} henkilölle
      </Typography>
      <ul>
        {listUpdates.items
          .sort((a, b) => b.isFavorite - a.isFavorite)
          .map(item => (
            <li key={item.content} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Checkbox 
                color='grey'
                checked={item.isChecked || false}
                onChange={() => handleCheckboxChange(item)}
              />
              <Button onClick={() => handleToggleFavorite(item)}>
                {item.isFavorite ? <StarIcon style={{ color: 'gold' }} /> : <StarBorderIcon />}
              </Button>
              {editingItem && editingItem.content === item.content ? (
                <TextField
                  variant="outlined"
                  color='black'
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
          variant="outlined"
          color='black'
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

      <Button onClick={handleDialogOpen}>
        Poista lista
      </Button>

      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Vahvista poisto</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Haluatko varmasti poistaa listan? Tämä toimenpide ei ole palautettavissa.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>
            Peruuta
          </Button>
          <Button onClick={handleDeleteListConfirmed}>
            Poista
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ListView;


import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { doc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from './utils/firebase/app';
import { useSnackbar } from 'notistack';
import { Button, TextField, Stack, Typography } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { validateItemContent, checkForDuplicateItem } from './validations';
import { handleDeleteListConfirmed } from './functions/items/handleDeleteListConfirmed';
import { handleEditListName, handleSaveEditedListName, handleCancelEditListName  } from './functions/items/handleEditListName';
import { handleAddItem } from './functions/items/handleAddItem';
import { handleDeleteItem } from './functions/items/handleDeleteItem';
import { handleEditItem, handleCancelEdit, handleSaveEditedItem } from './functions/items/handleEditItem';
import { handleCheckboxChange } from './functions/items/handleCheckboxChange';
import { handleToggleFavorite } from './functions/items/handleToggleFavorite';
import { handleCopyCode } from './functions/items/handleCopyCode';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ArrowBack from '@mui/icons-material/ArrowBack';
import Checkbox from '@mui/material/Checkbox';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ContentCopy from '@mui/icons-material/ContentCopy';

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
  const [editedListName, setEditedListName] = useState(null); 
  const [isEditingListName, setIsEditingListName] = useState(false);

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

  const confirmDeleteList = () => {
    handleDeleteListConfirmed(
      id,
      userPin,
      enqueueSnackbar,
      navigate,
      handleDialogClose,
      setListUpdates
    );
  };

  const editListName = () => {
    handleEditListName(
      listUpdates.content, 
      setEditedListName, 
      setIsEditingListName
    );
  };
  
  const cancelEditListName = () => {
    handleCancelEditListName(
      listUpdates.content, 
      setEditedListName, 
      setIsEditingListName
    );
  };
  
  const saveEditedListName = async () => {
    await handleSaveEditedListName(
      id,
      editedListName,
      enqueueSnackbar,
      setListUpdates,
      setIsEditingListName
    );
  };
  
  const addItem = () => {
    handleAddItem(
      id,
      newItem,
      listUpdates,
      enqueueSnackbar,
      validateItemContent,
      checkForDuplicateItem,
      fetchList,
      setNewItem
    );
  };

  const deleteItem = async (itemToDelete) => {
    try {
      await handleDeleteItem(id, itemToDelete, fetchList, enqueueSnackbar);
    } catch (error) {
      console.error('Error deleting item:', error.message);
    }
  };

  const editItem = (itemToEdit) => {
    handleEditItem(
      itemToEdit, 
      setEditingItem, 
      setEditedItemContent
    );
  };
  
  const cancelEdit = () => {
    handleCancelEdit(
      setEditingItem, 
      setEditedItemContent
    );
  };
  
  const saveEditedItem = async () => {
    await handleSaveEditedItem(
      id,
      editingItem,
      editedItemContent,
      listUpdates,
      fetchList,
      setEditingItem,
      setEditedItemContent,
      enqueueSnackbar
    );
  };

  const checkboxChange = async (itemToToggle) => {
    await handleCheckboxChange(itemToToggle, listUpdates, id, db, fetchList, enqueueSnackbar);
  };
  
  const toggleFavorite= async (itemToToggle) => {
    await handleToggleFavorite(itemToToggle, listUpdates, id, db, fetchList, enqueueSnackbar);
  };
  
  const copyCode = () => {
    handleCopyCode(listUpdates.code, enqueueSnackbar);
  };

  if (!listUpdates) {
    return <div>Ladataan...</div>;
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
              color="black"
              size="small"
              value={editedListName}
              onChange={(e) => setEditedListName(e.target.value)}
              onBlur={() => {
                if (!editedListName.trim()) {
                  cancelEditListName();
                }
              }}
              onKeyPress={(e) => e.key === 'Enter' && saveEditedListName()}
            />
            <Button onClick={saveEditedListName}>Tallenna</Button>
            <Button onClick={cancelEditListName}>Peruuta</Button>  
          </Stack>
        ) : (
          <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
            <Typography variant="h4" component="h1" gutterBottom>
              {listUpdates.content}  
            </Typography>
            <Button onClick={editListName}>  
              <EditIcon />
            </Button>
          </Stack>
        )}


      <Stack direction="row" spacing={1} alignItems="center" mb={2} justifyContent="center">
        <p>Liittymisavain: <strong>{listUpdates.code}</strong></p>
        <Button onClick={copyCode}>
          <ContentCopy style={{ fontSize: 15 }} />
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
        <Typography variant='subtitle1' color="textSecondary">
          Jaettu {sharedCount - 1} henkilölle
        </Typography>
      </Stack>

      <ul>
        {listUpdates.items
          .sort((a, b) => b.isFavorite - a.isFavorite)
          .map(item => (
            <li key={item.content} style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
              <Checkbox
                color='grey'
                checked={item.isChecked || false}
                onChange={() => checkboxChange(item)}
              />
              <Button onClick={() => toggleFavorite(item)}>
                {item.isFavorite ? <StarIcon style={{ color: 'gold' }} /> : <StarBorderIcon />}
              </Button>
              {editingItem && editingItem.content === item.content ? (
                <TextField
                  variant="outlined"
                  color="black"
                  size="small"
                  value={editedItemContent}
                  onChange={(e) => setEditedItemContent(e.target.value)}
                  onBlur={saveEditedItem}
                  onKeyPress={(e) => e.key === 'Enter' && saveEditedItem()}
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
                <Button onClick={() => editItem(item)}>
                  <EditIcon />
                </Button>
              ) : (
                <>
                  <Button onClick={saveEditedItem}>Tallenna</Button>
                  <Button onClick={cancelEdit}>Peruuta</Button>
                </>
              )}
              <Button onClick={() => deleteItem(item)}>
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
              addItem();
            }
          }}
        />
        <Button onClick={addItem}>
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
          <Button onClick={handleDialogClose}>Peruuta</Button>
          <Button onClick={confirmDeleteList}>Poista</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ListView;


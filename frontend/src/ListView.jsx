import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './utils/firebase/app';
import { useSnackbar } from 'notistack';
import { Button, TextField, Stack, Typography } from '@mui/material';
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { validateItemContent, checkForDuplicateItem } from './functions/validate/validations';
import { handleDeleteListConfirmed } from './functions/lists/handleDeleteListConfirmed';
import { handleEditListName, handleSaveEditedListName, handleCancelEditListName  } from './functions/lists/handleEditListName';
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
/**
 * The `ListView` component represents a detailed view of a specific list. 
 * Users can view, edit, delete, and manage items in the list as well as modify list-level settings.
 *
 * ### Features:
 * - Fetches the list data from Firestore using the list ID.
 * - Allows item management: adding, editing, deleting, marking as favorite, and toggling completion status.
 * - Enables list-level operations such as renaming, copying the share code, and sharing status.
 * - Integrates with Firestore and utilizes multiple helper functions for CRUD operations.
 * 
 * @component
 * @returns {JSX.Element} A detailed view of the selected list with full item management capabilities.
 */
const ListView = () => {
  // Get parameters and state from the URL and navigation.
  const { id } = useParams(); // The unique ID of the list from the URL.
  const { state } = useLocation(); // Optional state passed during navigation.
  const { enqueueSnackbar } = useSnackbar(); // Snackbar for notifications.
  const navigate = useNavigate(); // Navigate programmatically.

  const userPin = localStorage.getItem('userPin'); // User's PIN from local storage.

  // State management hooks for various list features.
  const [listUpdates, setListUpdates] = useState(null); // List data from Firestore.
  const [newItem, setNewItem] = useState(''); // New item content.
  const [editingItem, setEditingItem] = useState(null); // The item being edited.
  const [editedItemContent, setEditedItemContent] = useState(''); // Content for the item being edited.
  const [sharedCount, setSharedCount] = useState(0); // Number of users sharing this list.
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Confirmation dialog state for deletion.
  const [editedListName, setEditedListName] = useState(null); // The edited list name.
  const [isEditingListName, setIsEditingListName] = useState(false); // Whether the list name is being edited.
  /**
   * Opens the delete confirmation dialog.
   */
  const handleDialogOpen = () => setIsDialogOpen(true);
  /**
   * Closes the delete confirmation dialog.
   */
  const handleDialogClose = () => setIsDialogOpen(false);
  /**
   * Fetches the list data from Firestore using the list ID.
   * Sets the list data and shared count based on the fetched document.
   * 
   * @async
   */
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
  /**
   * Trigger fetching the list data when the component mounts or `id` changes.
   */
  useEffect(() => {
    fetchList();
  }, [id]);
  /**
   * Confirms and executes the list deletion.
   */
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
  /**
   * Initiates the list name editing process.
   */
  const editListName = () => {
    handleEditListName(
      listUpdates.content, 
      setEditedListName, 
      setIsEditingListName
    );
  };
  /**
   * Cancels the list name editing process.
   */
  const cancelEditListName = () => {
    handleCancelEditListName(
      listUpdates.content, 
      setEditedListName, 
      setIsEditingListName
    );
  };
  /**
   * Saves the edited list name to Firestore.
   * 
   * @async
   */
  const saveEditedListName = async () => {
    await handleSaveEditedListName(
      id,
      editedListName,
      enqueueSnackbar,
      setListUpdates,
      setIsEditingListName
    );
  };
  /**
   * Adds a new item to the list.
   */
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
  /**
   * Deletes an item from the list.
   * 
   * @async
   * @param {Object} itemToDelete - The item to be deleted.
   */
  const deleteItem = async (itemToDelete) => {
    await handleDeleteItem(id, itemToDelete, fetchList, enqueueSnackbar);
  };
  /**
   * Starts editing an item.
   * 
   * @param {Object} itemToEdit - The item to edit.
   */
  const editItem = (itemToEdit) => {
    handleEditItem(
      itemToEdit, 
      setEditingItem, 
      setEditedItemContent
    );
  };
  /**
   * Cancels the editing of an item.
   */
  const cancelEdit = () => {
    handleCancelEdit(
      setEditingItem, 
      setEditedItemContent
    );
  };
  /**
   * Saves the edited item content.
   * 
   * @async
   */
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
  /**
   * Toggles the completion status of an item.
   * 
   * @async
   * @param {Object} itemToToggle - The item to toggle.
   */
  const checkboxChange = async (itemToToggle) => {
    await handleCheckboxChange(itemToToggle, listUpdates, id, db, fetchList, enqueueSnackbar);
  };
  /**
   * Toggles the favorite status of an item.
   * 
   * @async
   * @param {Object} itemToToggle - The item to toggle.
   */
  const toggleFavorite = async (itemToToggle) => {
    await handleToggleFavorite(itemToToggle, listUpdates, id, db, fetchList, enqueueSnackbar);
  };
  /**
   * Copies the list's share code to the clipboard.
   */
  const copyCode = () => {
    handleCopyCode(listUpdates.code, enqueueSnackbar);
  };
  // Display a loading state if the list data has not been fetched yet.
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
              {!editingItem && <>
                <Checkbox
                  color='grey'
                  checked={item.isChecked || false}
                  onChange={() => checkboxChange(item)}
                />
                <Button onClick={() => toggleFavorite(item)}>
                  {item.isFavorite ? <StarIcon style={{ color: 'gold' }} /> : <StarBorderIcon />}
                </Button>
              </>}
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
              {!editingItem && 
                <Button onClick={() => deleteItem(item)}>
                  <DeleteIcon />
                </Button>
              }
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


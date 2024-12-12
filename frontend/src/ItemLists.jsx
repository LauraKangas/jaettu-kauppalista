import React, { useState, useEffect } from 'react';
import { getDocs, collection } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import { Button, TextField, Stack, IconButton, Typography } from '@mui/material';
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
/**
 * The `ItemLists` component represents the user's list management interface. 
 * It fetches, sorts, and displays lists visible to the logged-in user, allowing interactions like viewing favorites.
 *
 * ### Features:
 * - Fetches lists from Firestore and filters them based on user visibility.
 * - Highlights favorite lists and sorts them to appear first.
 * - Integrates with Firebase for data retrieval and local storage for user session management.
 * - Provides feedback for errors using snackbars.
 * 
 * @component
 * @returns {JSX.Element} A view for managing and interacting with lists.
 */
const ItemLists = () => {
  // State variables for managing component data and interactions.
  const [newListContent, setNewListContent] = useState(''); // Content for creating a new list.
  const [code, setCode] = useState(''); // Code for sharing or accessing lists.
  const { enqueueSnackbar } = useSnackbar(); // Snackbar for displaying notifications.
  const navigate = useNavigate(); // Navigation handler for routing.
  const [userPin, setUserPin] = useState(null); // User's PIN from local storage.
  const [noteItems, setNoteItems] = useState([]); // List of notes visible to the user.
  /**
   * Fetches the user's PIN from local storage on mount.
   * Redirects to the login page if no PIN is found.
   */
  useEffect(() => {
    const storedUserPin = localStorage.getItem('userPin');
    if (storedUserPin) {
      setUserPin(storedUserPin);
    } else {
      navigate('/'); // Redirect to home if the user is not logged in.
    }
  }, [navigate]);
  /**
   * Fetches lists from Firestore and filters them based on visibility to the current user.
   * Sorts the lists, prioritizing favorites.
   */
  useEffect(() => {
    const fetchLists = async () => {
      if (!userPin) return; // Exit if no user PIN is available.

      try {
        // Retrieve all lists from Firestore.
        const listsCollection = await getDocs(collection(db, 'lists'));
        const lists = listsCollection.docs
          .map(doc => {
            const data = doc.data(); // Extract data from each document.

            // Ensure visibility, hidden status, and favorite lists are arrays.
            const visibleTo = Array.isArray(data.visibleTo) ? data.visibleTo : [];
            const hiddenBy = Array.isArray(data.hiddenBy) ? data.hiddenBy : [];
            const favorites = Array.isArray(data.favorites) ? data.favorites : [];

            // Include lists visible to the current user.
            if (visibleTo.includes(userPin)) {
              return {
                ...data, // Merge Firestore data with additional properties.
                id: doc.id, // Include the document ID.
                favorites,
                hiddenBy,
                isFavorite: favorites.includes(userPin), // Mark as favorite if applicable.
              };
            }
            return null; // Exclude lists not visible to the user.
          })
          .filter(doc => doc !== null); // Remove null entries.

        // Sort lists to prioritize favorites.
        const sortedLists = lists.sort((a, b) => b.isFavorite - a.isFavorite);
        setNoteItems(sortedLists); // Update state with sorted lists.
      } catch (error) {
        // Display an error notification if the fetch operation fails.
        enqueueSnackbar('Virhe listojen hakemisessa. Yritä hetken kuluttua uudelleen.', { variant: 'error' });
      }
    };

    fetchLists(); // Trigger the fetch operation.
  }, [userPin, enqueueSnackbar]);

  return (
    <div>
      <Typography style={{ textAlign: 'center', marginBottom: '20px' }}>
        <h1>Listasi</h1>
        <p>Tervetuloa käyttäjä: <strong>{userPin}</strong></p>
      </Typography>

      <ul>
        {noteItems &&
          noteItems
            .filter(item => !(item.hiddenBy && item.hiddenBy.includes(userPin)))  
            .map((item) => (
              <li key={item.id} style={{ display: 'flex', alignItems: 'center' }}>
                <IconButton onClick={() => handleToggleFavorite(item, userPin, setNoteItems, enqueueSnackbar)}>
                  {(Array.isArray(item.favorites) && item.favorites.includes(userPin)) 
                    ? <StarIcon style={{ color: 'gold' }} /> 
                    : <StarBorderIcon />}
                </IconButton>
                <Link to={`/list/${item.id}`} state={{ list: item }} style={{ flexGrow: 1 }}>
                  {item.content}
                </Link>
                <IconButton onClick={() => handleToggleHide(item, userPin, setNoteItems, enqueueSnackbar)}>
                  {(Array.isArray(item.hiddenBy) && item.hiddenBy.includes(userPin)) 
                    ? <Visibility /> 
                    : <VisibilityOff />}
                </IconButton>
              </li>
            ))}
      </ul>

      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
        <TextField
          label="Listan nimi"
          variant="outlined"
          color="black" 
          size="small"
          value={newListContent}
          onChange={(e) => setNewListContent(e.target.value)}  
          onKeyPress={(e) => {
            if (e.key === 'Enter') {  
              handleCreateList(newListContent, noteItems, userPin, enqueueSnackbar, setNoteItems, setNewListContent);
            }
          }}
        />
        <Button 
          onClick={() => handleCreateList(newListContent, noteItems, userPin, enqueueSnackbar, setNoteItems, setNewListContent)}>
          <AddIcon />
        </Button>
      </Stack>

      <Stack direction="row" spacing={1} alignItems="center" mb={2}>
      <TextField
          label="Liity listalle koodilla"
          variant="outlined"
          color="black"
          size="small"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleJoinListByCode(code, userPin, setNoteItems, enqueueSnackbar, setCode); 
            }
          }}
        />
        <Button onClick={() => handleJoinListByCode(code, userPin, setNoteItems, enqueueSnackbar, setCode)}>
          Lisää
        </Button>

      </Stack>
      <ul>
        {noteItems &&
          noteItems
            .filter(item => item.hiddenBy && item.hiddenBy.includes(userPin))  
            .map((item) => (
              <li key={item.id} style={{ display: 'flex', alignItems: 'center', opacity: 0.5 }}>
                <Link to={`/list/${item.id}`} state={{ list: item }} style={{ flexGrow: 1 }}>
                  {item.content} (Piilotettu)
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

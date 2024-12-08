import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../utils/firebase/app';
import { validateItemContent } from '../validate/validations';
/**
 * Handles the process of creating a new list. The function validates the list content, 
 * generates a unique code for the list, and adds it to the Firestore database. It also updates 
 * the local state and provides user feedback via Snackbar notifications.
 *
 * @param {string} newListContent - The content (name) of the new list to be created.
 * @param {Array} noteItems - The current list of notes or lists in the local state.
 * @param {string} userPin - The unique PIN of the user creating the list.
 * @param {Function} enqueueSnackbar - A function to display Snackbar notifications.
 * @param {Function} setNoteItems - A function to update the local state with the newly created list.
 * @param {Function} setNewListContent - A function to clear the input field after the list is successfully created.
 */
export const handleCreateList = async (newListContent, noteItems, userPin, enqueueSnackbar, setNoteItems, setNewListContent) => {
  const content = String(newListContent).trim();

  if (!content) {
    enqueueSnackbar('Listan nimi ei voi olla tyhjä.', { variant: 'error' });  
    return;
  }

  // Validate the list name
  const validation = validateItemContent(content);
  if (!validation.isValid) {
    enqueueSnackbar(validation.message, { variant: 'error' }); 
    return;
  }

  // Create a new list object with necessary fields
  const newList = {
    content: content,
    items: [],  // Initialize the list with no items
    code: Math.random().toString(36).substring(2, 8).toUpperCase(),  // Generate a random code for the list
    visibleTo: [userPin],  // Add the user's pin to the list's `visibleTo` array
    isFavorite: false,  // Set default `isFavorite` to false
    hiddenBy: [],  // Initialize `hiddenBy` as an empty array
    favorites: [],  // Initialize `favorites` as an empty array
  };

  try {
    // Add the new list to the Firestore 'lists' collection
    const docRef = await addDoc(collection(db, 'lists'), newList);

    // Update the local state with the new list
    setNoteItems(prevItems => [
      ...prevItems,
      { id: docRef.id, ...newList },  // Include the Firestore document ID in the list data
    ]);
    enqueueSnackbar('Lista luotiin onnistuneesti.', { variant: 'success' });

    // Clear the input field after successful creation
    setNewListContent('');

  } catch (error) {
    enqueueSnackbar('Virhe luodessa listaa. Yritä hetken kuluttua uudelleen.', { variant: 'error' });
  }
};


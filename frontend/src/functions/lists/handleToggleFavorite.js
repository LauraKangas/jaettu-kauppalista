import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db } from '../../utils/firebase/app';
/**
 * Toggles a list's favorite status for a specific user by adding or removing the user's PIN 
 * from the `favorites` array in the Firestore database.
 * 
 * This function updates the `favorites` field in Firestore, which tracks which users have marked 
 * a list as a favorite. It also updates the local state (`setNoteItems`) to reflect the change 
 * and provides feedback to the user using a Snackbar.
 *
 * @param {Object} list - The list object to be updated, which contains the list's current data.
 * @param {string} userPin - The PIN of the user who is toggling the favorite status of the list.
 * @param {Function} setNoteItems - A function to update the local state with the modified list items.
 * @param {Function} enqueueSnackbar - A function used to display notifications via Snackbar.
 */
export const handleToggleFavorite = async (list, userPin, setNoteItems, enqueueSnackbar) => {
  // Get the current list of favorite users and check if the userPin is already in the favorites array
  const favorites = Array.isArray(list.favorites) ? list.favorites : [];
  const isFavorite = favorites.includes(userPin);
  // Update the list with the new favorite status
  const updatedList = {
    ...list,
    favorites: isFavorite
      ? list.favorites.filter(pin => pin !== userPin)  // Remove userPin from favorites if it's already a favorite
      : [...list.favorites, userPin],  // Add userPin to favorites if it's not already a favorite
    isFavorite: !isFavorite,  // Toggle the isFavorite flag
  };
  // Update the local state to reflect the new favorite status
  setNoteItems(prevItems => {
    if (!Array.isArray(prevItems)) {
      return [];
    }

    return prevItems
      .map(item => item.id === list.id ? updatedList : item)  // Update the list in the local state
      .sort((a, b) => b.isFavorite - a.isFavorite);  // Sort by favorite status
  });

  try {
    await updateDoc(doc(db, 'lists', list.id), {
      favorites: isFavorite ? arrayRemove(userPin) : arrayUnion(userPin),  
      isFavorite: !isFavorite,  // Update the isFavorite flag in Firestore
    });
  } catch (error) {
    setNoteItems(prevItems =>
      prevItems.map(item =>
        item.id === list.id
          ? { ...item, favorites: isFavorite ? [...item.favorites, userPin] : item.favorites.filter(pin => pin !== userPin) }
          : item
      )
    );
    enqueueSnackbar('Virhe päivittäessä suosikkiasetusta. Yritä hetken kuluttua uudelleen.', { variant: 'error' });  
  }
};


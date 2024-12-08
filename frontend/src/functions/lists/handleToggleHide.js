import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../utils/firebase/app';
/**
 * Toggles the visibility of a list for a specific user by adding or removing the user's PIN 
 * from the `hiddenBy` array in the Firestore database.
 * 
 * This function updates the `hiddenBy` field in Firestore, which tracks which users have hidden a list.
 * It also updates the local state (`setNoteItems`) to reflect the change in visibility and provides feedback 
 * to the user using a Snackbar.
 *
 * @param {Object} list - The list object to be updated, which contains the list's current data.
 * @param {string} userPin - The PIN of the user who is toggling the visibility of the list.
 * @param {Function} setNoteItems - A function to update the local state with the modified list items.
 * @param {Function} enqueueSnackbar - A function used to display notifications via Snackbar.
 */
export const handleToggleHide = async (list, userPin, setNoteItems, enqueueSnackbar) => {
  // Check if the user has already hidden the list
  const isHidden = Array.isArray(list.hiddenBy) && list.hiddenBy.includes(userPin);
  // Update the list with the new visibility state
  const updatedList = {
    ...list,
    hiddenBy: isHidden
      ? list.hiddenBy.filter(pin => pin !== userPin)  
      : [...list.hiddenBy, userPin],  
  };
  // Update local state to reflect the visibility change
  setNoteItems(prevItems =>
    prevItems
      .map(item => item.id === list.id ? updatedList : item)  // Update the list in the local state
      .sort((a, b) => b.isFavorite - a.isFavorite)  // Sort by favorite status
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
    enqueueSnackbar('Virhe piilotettaessa listaa. Yritä hetken kuluttua uudelleen.', { variant: 'error' });  
  }
};


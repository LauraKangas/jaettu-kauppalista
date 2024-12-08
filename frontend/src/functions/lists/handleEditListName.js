import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase/app';
import { validateItemContent } from '../validate/validations'
/**
 * Initiates the process of editing the list name by setting the current list name 
 * to the input field and enabling the editing mode.
 *
 * @param {string} currentListName - The current name of the list that is to be edited.
 * @param {Function} setEditedListName - The setter function to update the state of the edited list name.
 * @param {Function} setIsEditingListName - The setter function to enable or disable the editing mode.
 */
export const handleEditListName = (currentListName, setEditedListName, setIsEditingListName) => {
  setEditedListName(currentListName);  // Set the current list name to the editing state.
  setIsEditingListName(true);  // Enable the editing mode.
};
/**
 * Cancels the editing process and restores the original list name.
 *
 * @param {string} originalListName - The original name of the list before editing.
 * @param {Function} setEditedListName - The setter function to reset the edited list name.
 * @param {Function} setIsEditingListName - The setter function to disable the editing mode.
 */
export const handleCancelEditListName = (originalListName, setEditedListName, setIsEditingListName) => {
  setEditedListName(originalListName);  // Restore the original list name.
  setIsEditingListName(false);  // Disable the editing mode.
};
/**
 * Saves the edited list name and updates the list document in Firestore. 
 * This function validates the new name, then attempts to update the document 
 * in Firestore. If successful, it updates the local state and disables the editing mode.
 *
 * @param {string} id - The unique identifier of the list being updated.
 * @param {string} editedListName - The new name for the list.
 * @param {Function} enqueueSnackbar - A function to show notifications to the user.
 * @param {Function} setListUpdates - The setter function to update the local list state.
 * @param {Function} setIsEditingListName - The setter function to disable the editing mode.
 */
export const handleSaveEditedListName = async (
  id, 
  editedListName, 
  enqueueSnackbar, 
  setListUpdates, 
  setIsEditingListName
) => {
  if (!editedListName.trim()) {
    enqueueSnackbar('Listan nimi ei voi olla tyhjä.', { variant: 'error' });
    return;
  }

  const validation = validateItemContent(editedListName); 
  if (!validation.isValid) {
    enqueueSnackbar(validation.message, { variant: 'error' });
    return;
  }

  try {
    // Update the Firestore document with the new list name.
    await updateDoc(doc(db, 'lists', id), {
      content: editedListName,
    });

    // Update the local state to reflect the change.
    setListUpdates((prev) => ({ ...prev, content: editedListName }));
    setIsEditingListName(false);  // Disable the editing mode.

  } catch (error) {
    enqueueSnackbar('Virhe listan nimen päivittämisessä. Yritä hetken kuluttua uudelleen.', { variant: 'error' });
  }
};


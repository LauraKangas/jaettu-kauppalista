import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase/app';
/**
 * Handles the addition of a new item to a list. It validates the new item, checks for duplicates, and updates the list in Firestore.
 * 
 * @param {string} id - The unique identifier of the list being updated.
 * @param {string} newItem - The new item content to be added to the list.
 * @param {Object} listUpdates - The current state of the list, containing items and their properties.
 * @param {Function} enqueueSnackbar - Function to display notifications to the user.
 * @param {Function} validateItemContent - Function that validates the new item content.
 * @param {Function} checkForDuplicateItem - Function to check if the new item already exists in the list.
 * @param {Function} fetchList - Function to refresh and fetch the updated list after adding a new item.
 * @param {Function} setNewItem - Function to clear the input field or reset the new item state after adding it.
 */
export const handleAddItem = async (
  id,
  newItem,
  listUpdates,
  enqueueSnackbar,
  validateItemContent,
  checkForDuplicateItem,
  fetchList,
  setNewItem
) => {
  // Validate input
  if (!newItem) {
    enqueueSnackbar('Tuote ei voi olla tyhjä.', { variant: 'error' });
    return;
  }

  const validation = validateItemContent(newItem);
  if (!validation.isValid) {
    enqueueSnackbar(validation.message, { variant: 'error' });
    return;
  }

  // Check for duplicates
  if (!checkForDuplicateItem(listUpdates.items.map(i => i.content), newItem)) {
    enqueueSnackbar('Tämä tuote on jo listalla.', { variant: 'error' });
    return;
  }

  // Create a new item object
  const newItemObject = { content: newItem, isChecked: false, isFavorite: false };

  // Add the new item to the list
  const updatedItems = [...listUpdates.items, newItemObject];

  try {
    // Update Firestore with the new items array
    await updateDoc(doc(db, 'lists', id), { items: updatedItems });

    fetchList(); // Refresh the list
    setNewItem(''); // Clear the input field
  } catch (error) {
    enqueueSnackbar('Virhe lisättäessä tuotetta. Yritä hetken kuluttua uudelleen.', { variant: 'error' });
  }
};

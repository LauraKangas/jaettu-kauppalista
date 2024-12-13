import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase/app';
import { validateItemContent } from '../validate/validations';
/**
 * Starts the editing process for an item by setting the item to be edited and 
 * populating the editing form with the current content of the item.
 * 
 * @param {Object} itemToEdit - The item object that is to be edited.
 * @param {Function} setEditingItem - Setter function to update the state of the item being edited.
 * @param {Function} setEditedItemContent - Setter function to update the state of the edited content.
 */
export const handleEditItem = (itemToEdit, setEditingItem, setEditedItemContent) => {
    setEditingItem(itemToEdit);  // Set the current item to be edited.
    setEditedItemContent(itemToEdit.content);  // Set the content of the item in the editing form.
};
/**
 * Cancels the editing process by resetting the state and clearing the content.
 * 
 * @param {Function} setEditingItem - Setter function to reset the item being edited.
 * @param {Function} setEditedItemContent - Setter function to reset the content of the item being edited.
 */
export const handleCancelEdit = (setEditingItem, setEditedItemContent) => {
    setEditingItem(null);  // Clear the item being edited.
    setEditedItemContent('');  // Clear the content of the item being edited.
};
/**
 * Saves the edited content of an item, validates it, and updates the item in the Firestore database.
 * If successful, it fetches the updated list and clears the editing state.
 * 
 * @param {string} id - The unique identifier of the list.
 * @param {Object} editingItem - The item object being edited.
 * @param {string} editedItemContent - The new content for the item.
 * @param {Object} listUpdates - The current list of items to update.
 * @param {Function} fetchList - Function to fetch the updated list of items.
 * @param {Function} setEditingItem - Setter function to reset the item being edited.
 * @param {Function} setEditedItemContent - Setter function to reset the edited content.
 * @param {Function} enqueueSnackbar - Function to show notifications to the user.
 */
export const handleSaveEditedItem = async (
  id,
  editingItem,
  editedItemContent,
  listUpdates,
  fetchList,
  setEditingItem,
  setEditedItemContent, 
  enqueueSnackbar
) => {
  if (!editedItemContent) {
    enqueueSnackbar('Tuotteen sisältö ei voi olla tyhjä.', { variant: 'error' });
    return;
  }

  const validation = validateItemContent(editedItemContent);
  if (!validation.isValid) {
    enqueueSnackbar(validation.message, { variant: 'error' });
    return;
  }

  // Update the list with the edited item content.
  const updatedList = {
    ...listUpdates,
    items: listUpdates.items.map(item => ({
      ...item,
      content: item.content === editingItem.content ? editedItemContent : item.content,
    })),
  };

  try {
    // Update the Firestore document with the new item content.
    await updateDoc(doc(db, 'lists', id), {
      items: updatedList.items,
    });

    fetchList();  // Fetch the updated list from Firestore.
    setEditingItem(null);  // Reset the editing state.
    setEditedItemContent('');  // Clear the content state.
  } catch (error) {
    enqueueSnackbar('Virhe päivittäessä valintaa. Yritä hetken kuluttua uudelleen.', { variant: 'error' });
  }
};


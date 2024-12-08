import { doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../../utils/firebase/app';
/**
 * Deletes an item from a list in Firestore by removing it from the 'items' array.
 * After successful deletion, it fetches the updated list.
 * 
 * @param {string} id - The unique identifier of the list.
 * @param {Object} itemToDelete - The item object to be deleted from the list.
 * @param {Function} fetchList - Function to fetch the updated list of items from Firestore.
 * @param {Function} enqueueSnackbar - Function to show notifications to the user.
 */
export const handleDeleteItem = async (id, itemToDelete, fetchList, enqueueSnackbar) => {
  try {
    // Remove the item from the 'items' array in the Firestore document.
    await updateDoc(doc(db, 'lists', id), {
      items: arrayRemove(itemToDelete),
    });

    // Fetch the updated list after the deletion.
    fetchList();
  } catch (error) {
    enqueueSnackbar('Virhe poistettaessa tuotetta. Yritä hetken kuluttua uudelleen.', { variant: 'error' });
  }
};

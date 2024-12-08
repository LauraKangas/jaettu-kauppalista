import { updateDoc, doc } from 'firebase/firestore';
/**
 * Handles the toggling of the favorite status for an item within a list. 
 * This function updates the `isFavorite` property of the specified item and saves the changes to the Firestore database. 
 * It also triggers a fetch operation to refresh the list data and shows feedback to the user via Snackbar notifications.
 *
 * @param {Object} itemToToggle - The item whose favorite status is to be toggled.
 * @param {Object} listUpdates - The updated list object that contains the modified items array.
 * @param {string} id - The unique identifier of the list being updated.
 * @param {Object} db - The Firestore database reference.
 * @param {Function} fetchList - A function to fetch and update the list data from the Firestore database after the update.
 * @param {Function} enqueueSnackbar - A function to display Snackbar notifications.
 */
export const handleToggleFavorite = async (itemToToggle, listUpdates, id, db, fetchList, enqueueSnackbar) => {
  // Update the 'isFavorite' status of the item in the list
  const updatedList = {
    ...listUpdates,
    items: listUpdates.items.map(item =>
      item.content === itemToToggle.content
        ? { ...item, isFavorite: !item.isFavorite }  // Toggle the 'isFavorite' value
        : item
    ),
  };

  try {
    // Save the updated list in Firestore
    await updateDoc(doc(db, 'lists', id), {
      items: updatedList.items,  // Update the list items with the new 'isFavorite' status
    });

    // Fetch the updated list data
    fetchList();

  } catch (error) {
    enqueueSnackbar('Virhe päivittäessä suosikkia. Yritä hetken kuluttua uudelleen.', { variant: 'error' });
  }
};

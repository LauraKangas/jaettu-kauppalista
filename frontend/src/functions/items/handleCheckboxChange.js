import { doc, updateDoc } from 'firebase/firestore';
/**
 * Handles the change of a checkbox for an item in the list, updating its checked state in the database.
 * 
 * @param {Object} itemToToggle - The item whose checkbox state is being toggled.
 * @param {Object} listUpdates - The current list data with all items.
 * @param {string} id - The unique identifier of the list.
 * @param {Object} db - The Firestore database reference.
 * @param {Function} fetchList - Function to fetch the updated list after changes.
 * @param {Function} enqueueSnackbar - Function to display notifications to the user.
 */
export const handleCheckboxChange = async (itemToToggle, listUpdates, id, db, fetchList, enqueueSnackbar) => {
  // Create a new updated list with the toggled checkbox state
  const updatedList = {
    ...listUpdates,
    items: listUpdates.items.map(item => ({
      ...item,
      isChecked: item.content === itemToToggle.content ? !item.isChecked : item.isChecked,
    })),
  };

  try {
    // Update the list in Firestore with the new item states
    await updateDoc(doc(db, 'lists', id), {
      items: updatedList.items,
    });

    fetchList();
  } catch (error) {
    enqueueSnackbar('Virhe päivittäessä valintaa. Yritä hetken kuluttua uudelleen.', { variant: 'error' });
  }
};


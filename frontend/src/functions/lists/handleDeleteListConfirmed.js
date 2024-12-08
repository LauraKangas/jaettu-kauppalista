import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../../utils/firebase/app';
/**
 * Deletes a list by removing the user from the list's `visibleTo` field in Firestore,
 * then navigates the user back to the list overview page and closes the delete confirmation dialog.
 * If the list is not found or an error occurs during deletion, appropriate error messages
 * are shown to the user.
 *
 * @param {string} id - The unique identifier of the list to be deleted.
 * @param {string} userPin - The PIN of the user performing the delete action.
 * @param {Function} enqueueSnackbar - A function from the `notistack` library to show notifications to the user.
 * @param {Function} navigate - A function to navigate to a different page (in this case, to the list overview).
 * @param {Function} handleDialogClose - A function to close the delete confirmation dialog.
 * @param {Function} setListUpdates - A setter function to update the local state of the list (after deletion).
 */
export const handleDeleteListConfirmed = async (
  id,
  userPin,
  enqueueSnackbar,
  navigate,
  handleDialogClose,
  setListUpdates
) => {
  try {
    const listDocRef = doc(db, 'lists', id);  
    const listDoc = await getDoc(listDocRef);  

    if (listDoc.exists()) {
      const listData = listDoc.data();  

      // If the user is part of the list (visibleTo), remove them from the list's 'visibleTo' array.
      if (listData.visibleTo.includes(userPin)) {
        await updateDoc(listDocRef, {
          visibleTo: arrayRemove(userPin),
        });
      }

      setListUpdates(null);  // Update the local state to reflect the deletion.
      navigate('/lists');  // Navigate the user back to the list overview page.
    } else {
      enqueueSnackbar('Listaa ei löytynyt.', { variant: 'error' });  
    }
  } catch (error) {
    enqueueSnackbar('Virhe poistettaessa listaa. Yritä hetken kuluttua uudelleen.', { variant: 'error' });  
  } finally {
    handleDialogClose(); 
  }
};

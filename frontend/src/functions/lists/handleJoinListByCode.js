import { doc, updateDoc, getDocs, getDoc, collection, where, arrayUnion } from 'firebase/firestore';
import { db } from '../../utils/firebase/app';
/**
 * Handles the process of joining a list using a unique code. The function checks if the user has
 * already joined the list, and if not, adds the user to the list's `visibleTo` field in Firestore.
 * It also updates the local state and provides user feedback using a Snackbar notification.
 *
 * @param {string} code - The unique code used to join the list.
 * @param {string} userPin - The PIN of the user attempting to join the list.
 * @param {Function} setNoteItems - A function to update the local state with the modified list items.
 * @param {Function} enqueueSnackbar - A function used to display notifications via Snackbar.
 * @param {Function} setCode - A function to clear the input code after the user successfully joins the list.
 */
export const handleJoinListByCode = async (code, userPin, setNoteItems, enqueueSnackbar, setCode) => {

  if (!code) {
    enqueueSnackbar('Syötä koodi', { variant: 'error' });  
    return;
  }

  try {
    // Fetch lists from Firestore where the code matches the input
    const listsCollection = await getDocs(collection(db, 'lists'), where('code', '==', code));
    // If a matching list is found
    if (!listsCollection.empty) {
      const listData = listsCollection.docs
        .map(doc => ({
          ...doc.data(),
          id: doc.id,  // Attach the list ID to the data
        }))
        .find(list => list.code === code);  // Find the list with the matching code

      // Check if the user has already joined the list
      if (listData.visibleTo.includes(userPin)) {
        enqueueSnackbar('Olet jo liittynyt listalle.', { variant: 'error' });  
      } else {
        // Add the user to the list's `visibleTo` field in Firestore
        await updateDoc(doc(db, 'lists', listData.id), {
          visibleTo: arrayUnion(userPin),  // Add the user PIN to the `visibleTo` array
        });
        // Fetch the updated list data
        const updatedDoc = await getDoc(doc(db, 'lists', listData.id));
        const updatedListData = { ...updatedDoc.data(), id: updatedDoc.id };  // Combine the data with the list ID
        // Update the local state with the new list data
        setNoteItems(prevItems => {
          const listExists = prevItems.some(item => item.id === updatedListData.id);  
          if (!listExists) {
            return [...prevItems, updatedListData];  
          }
          return prevItems;  
        });

        enqueueSnackbar('Lista lisätty onnistuneesti!', { variant: 'success' });  
        // Clear the input code field
        setCode('');
      }
    } else {
      enqueueSnackbar('Listaa ei löytynyt koodilla.', { variant: 'error' });  
    }
  } catch (error) {
    enqueueSnackbar('Virhe listan hakemisessa. Yritä hetken kuluttua uudelleen.', { variant: 'error' });  
  }
};

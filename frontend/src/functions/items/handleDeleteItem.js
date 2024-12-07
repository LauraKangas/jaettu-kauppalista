import { doc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../../utils/firebase/app';

export const handleDeleteItem = async (id, itemToDelete, fetchList, enqueueSnackbar) => {
  try {
    await updateDoc(doc(db, 'lists', id), {
      items: arrayRemove(itemToDelete),
    });

    fetchList();
  } catch (error) {
    enqueueSnackbar('Virhe poistettaessa tuotetta. Yritä hetken kuluttua uudelleen.', { variant: 'error' });
  }
};

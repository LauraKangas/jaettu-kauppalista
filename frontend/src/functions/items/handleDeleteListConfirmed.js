import { doc, getDoc, updateDoc, arrayRemove } from 'firebase/firestore';
import { db } from '../../utils/firebase/app';

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

      if (listData.visibleTo.includes(userPin)) {
        await updateDoc(listDocRef, {
          visibleTo: arrayRemove(userPin),
        });
      }
      setListUpdates(null);
      navigate('/lists');
    } else {
      enqueueSnackbar('Listaa ei löytynyt.', { variant: 'error' });
    }
  } catch (error) {
    enqueueSnackbar('Virhe poistettaessa listaa. Yritä hetken kuluttua uudelleen.', { variant: 'error' });
  } finally {
    handleDialogClose();
  }
};

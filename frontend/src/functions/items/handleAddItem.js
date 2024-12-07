import { doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../utils/firebase/app';

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
  if (!newItem) {
    enqueueSnackbar('Tuote ei voi olla tyhjä.', { variant: 'error' });
    return;
  }

  const validation = validateItemContent(newItem);
  if (!validation.isValid) {
    enqueueSnackbar(validation.message, { variant: 'error' });
    return;
  }

  if (!checkForDuplicateItem(listUpdates.items.map(i => i.content), newItem)) {
    enqueueSnackbar('Tämä tuote on jo listalla.', { variant: 'error' });
    return;
  }

  const newItemObject = { content: newItem, isChecked: false, isFavorite: false };

  try {
    await updateDoc(doc(db, 'lists', id), {
      items: arrayUnion(newItemObject),
    });

    fetchList();
    setNewItem('');
  } catch (error) {
    enqueueSnackbar('Virhe lisättäessä tuotetta. Yritä hetken kuluttua uudelleen.', { variant: 'error' });
  }
};

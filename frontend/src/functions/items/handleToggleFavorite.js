import { updateDoc, doc } from 'firebase/firestore';

export const handleToggleFavorite = async (itemToToggle, listUpdates, id, db, fetchList, enqueueSnackbar) => {
  const updatedList = {
    ...listUpdates,
    items: listUpdates.items.map(item =>
      item.content === itemToToggle.content
        ? { ...item, isFavorite: !item.isFavorite }
        : item
    ),
  };

  try {
    await updateDoc(doc(db, 'lists', id), {
      items: updatedList.items,
    });

    fetchList();
  } catch (error) {
    enqueueSnackbar('Virhe päivittäessä suosikkia. Yritä hetken kuluttua uudelleen.', { variant: 'error' });
  }
};

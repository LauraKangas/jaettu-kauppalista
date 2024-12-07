import { updateDoc, doc } from 'firebase/firestore';

export const handleCheckboxChange = async (itemToToggle, listUpdates, id, db, fetchList, enqueueSnackbar) => {
  const updatedList = {
    ...listUpdates,
    items: listUpdates.items.map(item => ({
      ...item,
      isChecked: item.content === itemToToggle.content ? !item.isChecked : item.isChecked,
    })),
  };

  try {
    await updateDoc(doc(db, 'lists', id), {
      items: updatedList.items,
    });

    fetchList();
  } catch (error) {
    enqueueSnackbar('Virhe päivittäessä valintaa. Yritä hetken kuluttua uudelleen.', { variant: 'error' });
  }
};

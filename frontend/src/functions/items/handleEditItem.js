import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase/app';
import { validateItemContent } from '../../validations';

export const handleEditItem = (itemToEdit, setEditingItem, setEditedItemContent) => {
    setEditingItem(itemToEdit);
    setEditedItemContent(itemToEdit.content);
  };

  export const handleCancelEdit = (setEditingItem, setEditedItemContent) => {
    setEditingItem(null);
    setEditedItemContent('');
  };

export const handleSaveEditedItem = async (
  id,
  editingItem,
  editedItemContent,
  listUpdates,
  fetchList,
  setEditingItem,
  setEditedItemContent, 
  enqueueSnackbar
) => {
  if (!editedItemContent) {
    enqueueSnackbar('Tuotteen sisältö ei voi olla tyhjä.', { variant: 'error' });
    return;
  }

  const validation = validateItemContent(editedItemContent);
  if (!validation.isValid) {
    enqueueSnackbar(validation.message, { variant: 'error' });
    return;
  }

  const updatedList = {
    ...listUpdates,
    items: listUpdates.items.map(item => ({
      ...item,
      content: item.content === editingItem.content
        ? editedItemContent
        : item.content,
    })),
  };

  try {
    await updateDoc(doc(db, 'lists', id), {
      items: updatedList.items,
    });

    fetchList();
    setEditingItem(null);
    setEditedItemContent('');
  } catch (error) {
    enqueueSnackbar('Virhe päivittäessä valintaa. Yritä hetken kuluttua uudelleen.', { variant: 'error' });
  }
};

import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../../utils/firebase/app';
import { validateItemContent } from '../../validations';

export const handleEditListName = (currentListName, setEditedListName, setIsEditingListName) => {
  setEditedListName(currentListName);  
  setIsEditingListName(true);  
};

export const handleCancelEditListName = (originalListName, setEditedListName, setIsEditingListName) => {
  setEditedListName(originalListName); 
  setIsEditingListName(false); 
};

export const handleSaveEditedListName = async (
  id, 
  editedListName, 
  enqueueSnackbar, 
  setListUpdates, 
  setIsEditingListName
) => {
  if (!editedListName.trim()) {
    enqueueSnackbar('Listan nimi ei voi olla tyhjä.', { variant: 'error' });
    return;
  }

  const validation = validateItemContent(editedListName); 
  if (!validation.isValid) {
    enqueueSnackbar(validation.message, { variant: 'error' });
    return;
  }

  try {
    await updateDoc(doc(db, 'lists', id), {
      content: editedListName,
    });

    setListUpdates((prev) => ({ ...prev, content: editedListName }));
    setIsEditingListName(false);  
  } catch (error) {
    enqueueSnackbar('Virhe listan nimen päivittämisessä. Yritä hetken kuluttua uudelleen.', { variant: 'error' });
  }
};

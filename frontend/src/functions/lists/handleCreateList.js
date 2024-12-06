import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../utils/firebase/app';
import { validateItemContent } from '../../validations';

export const handleCreateList = async (newListContent, userPin, enqueueSnackbar, setNoteItems) => {
  if (!newListContent) {
    enqueueSnackbar('Listan nimi ei voi olla tyhjä.', { variant: 'error' });
    return;
  }

  const validation = validateItemContent(newListContent);
  if (!validation.isValid) {
    enqueueSnackbar(validation.message, { variant: 'error' });
    return;
  }

  const newList = {
    content: newListContent,
    items: [],
    code: Math.random().toString(36).substring(2, 8).toUpperCase(),
    visibleTo: [userPin],
    isFavorite: false,
    hiddenBy: [],
  };

  try {
    const docRef = await addDoc(collection(db, 'lists'), newList);
    setNoteItems(prevItems => [
      ...prevItems,
      { id: docRef.id, ...newList },
    ]);
    enqueueSnackbar('Lista luotiin onnistuneesti.', { variant: 'success' });
  } catch (error) {
    enqueueSnackbar('Virhe luodessa listaa. Yritä hetken kuluttua uudelleen.', { variant: 'error' });
  }
};


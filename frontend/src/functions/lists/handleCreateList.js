import { addDoc, collection } from 'firebase/firestore';
import { db } from '../../utils/firebase/app';
import { validateItemContent } from '../../validations';

export const handleCreateList = async (newListContent, noteItems, userPin, enqueueSnackbar, setNoteItems, setNewListContent) => {
  const content = String(newListContent).trim();

  if (!content) {
    enqueueSnackbar('Listan nimi ei voi olla tyhjä.', { variant: 'error' });
    return;
  }

  const validation = validateItemContent(content);
  if (!validation.isValid) {
    enqueueSnackbar(validation.message, { variant: 'error' });
    return;
  }

  const newList = {
    content: content,
    items: [],
    code: Math.random().toString(36).substring(2, 8).toUpperCase(),
    visibleTo: [userPin],
    isFavorite: false,
    hiddenBy: [],
    favorites: [],
  };

  try {
    const docRef = await addDoc(collection(db, 'lists'), newList);
    setNoteItems(prevItems => [
      ...prevItems,
      { id: docRef.id, ...newList },
    ]);
    enqueueSnackbar('Lista luotiin onnistuneesti.', { variant: 'success' });
    setNewListContent('');

  } catch (error) {
    enqueueSnackbar('Virhe luodessa listaa. Yritä hetken kuluttua uudelleen.', { variant: 'error' });
  }
};


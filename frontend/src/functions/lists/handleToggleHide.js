import { doc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../../utils/firebase/app';

export const handleToggleHide = async (list, userPin, setNoteItems, enqueueSnackbar) => {
  const isHidden = Array.isArray(list.hiddenBy) && list.hiddenBy.includes(userPin);

  const updatedList = {
    ...list,
    hiddenBy: isHidden
      ? list.hiddenBy.filter(pin => pin !== userPin)  
      : [...list.hiddenBy, userPin],  
  };

  if (typeof setNoteItems !== 'function') {
    console.error('setNoteItems is not a function');
    return;
  }

  setNoteItems(prevItems =>
    prevItems
      .map(item => item.id === list.id ? updatedList : item)
      .sort((a, b) => b.isFavorite - a.isFavorite)
  );

  try {
    await updateDoc(doc(db, 'lists', list.id), {
      hiddenBy: isHidden ? arrayRemove(userPin) : arrayUnion(userPin),
    });
  } catch (error) {
    setNoteItems(prevItems =>
      prevItems.map(item =>
        item.id === list.id
          ? { ...item, hiddenBy: isHidden ? [...item.hiddenBy, userPin] : item.hiddenBy.filter(pin => pin !== userPin) }
          : item
      )
    );
    enqueueSnackbar('Virhe piilotettaessa listaa: ' + error.message, { variant: 'error' });
  }
};


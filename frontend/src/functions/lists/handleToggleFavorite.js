import { doc, updateDoc, arrayRemove, arrayUnion } from 'firebase/firestore';
import { db } from '../../utils/firebase/app';

export const handleToggleFavorite = async (list, userPin, setNoteItems, enqueueSnackbar) => {

    const favorites = Array.isArray(list.favorites) ? list.favorites : [];
    const isFavorite = favorites.includes(userPin);
  
    const updatedList = {
      ...list,
      favorites: isFavorite
        ? list.favorites.filter(pin => pin !== userPin)
        : [...list.favorites, userPin],
      isFavorite: !isFavorite,
    };
  
    setNoteItems(prevItems => {
      if (!Array.isArray(prevItems)) {
        console.error("prevItems is not an array", prevItems);
        return [];
      }
  
      return prevItems
        .map(item => item.id === list.id ? updatedList : item)
        .sort((a, b) => b.isFavorite - a.isFavorite);
    });
  
    try {
      await updateDoc(doc(db, 'lists', list.id), {
        favorites: isFavorite ? arrayRemove(userPin) : arrayUnion(userPin),
        isFavorite: !isFavorite,
      });
      console.log("Updated Firestore document");  
    } catch (error) {
      setNoteItems(prevItems =>
        prevItems.map(item =>
          item.id === list.id
            ? { ...item, favorites: isFavorite ? [...item.favorites, userPin] : item.favorites.filter(pin => pin !== userPin) }
            : item
        )
      );
      enqueueSnackbar('Virhe päivittäessä suosikkiasetusta: ' + error.message, { variant: 'error' });
    }
  };
  

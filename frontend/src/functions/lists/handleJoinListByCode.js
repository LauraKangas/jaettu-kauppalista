import { doc, updateDoc, getDocs, getDoc, collection, where, arrayUnion } from 'firebase/firestore';
import { db } from '../../utils/firebase/app';

export const handleJoinListByCode = async (code, userPin, setNoteItems, enqueueSnackbar, setCode) => {
    if (!code) {
      enqueueSnackbar('Syötä koodi', { variant: 'error' });
      return;
    }
  
    try {
      const listsCollection = await getDocs(collection(db, 'lists'), where('code', '==', code));
  
      if (!listsCollection.empty) {
        const listData = listsCollection.docs
          .map(doc => ({
            ...doc.data(),
            id: doc.id,
          }))
          .find(list => list.code === code);
  
        if (listData.visibleTo.includes(userPin)) {
          enqueueSnackbar('Olet jo liittynyt listalle.', { variant: 'error' });
        } else {
          await updateDoc(doc(db, 'lists', listData.id), {
            visibleTo: arrayUnion(userPin),
          });
  
          const updatedDoc = await getDoc(doc(db, 'lists', listData.id));
          const updatedListData = { ...updatedDoc.data(), id: updatedDoc.id };
  
          setNoteItems(prevItems => {
            const listExists = prevItems.some(item => item.id === updatedListData.id);
            if (!listExists) {
              return [...prevItems, updatedListData];
            }
            return prevItems;
          });
  
          enqueueSnackbar('Liityit listalle onnistuneesti!', { variant: 'success' });
          
          setCode('');
        }
      } else {
        enqueueSnackbar('Listaa ei löytynyt koodilla.', { variant: 'error' });
      }
    } catch (error) {
      enqueueSnackbar('Virhe listan hakemisessa. Yritä hetken kuluttua uudelleen.', { variant: 'error' });
    }
  };
  
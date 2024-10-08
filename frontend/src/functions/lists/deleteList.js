import { db } from '../../utils/firebase/app'; 
import { doc, deleteDoc } from 'firebase/firestore';

const deleteList = async (listId) => {
  try {
    const listRef = doc(db, 'lists', listId);
    await deleteDoc(listRef);
  } catch (error) {
    console.error("Error deleting list: ", error);
  }
};

export default deleteList;

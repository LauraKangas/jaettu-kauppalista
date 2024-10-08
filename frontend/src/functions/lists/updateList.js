import { db } from '../../utils/firebase/app';
import { doc, updateDoc } from 'firebase/firestore';

const updateList = async (listId, updates) => {
  const listRef = doc(db, 'lists', listId);
  await updateDoc(listRef, updates);
};

export default updateList;

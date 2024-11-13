import { db } from "../../utils/firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore(app);

export default async function fetchUserLists(userPin) {
  const listsCollection = collection(db, 'users', userPin, 'lists');
  const listSnapshot = await getDocs(listsCollection);
  const lists = listSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return lists;
}


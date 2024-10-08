import app from "../../utils/firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

const db = getFirestore(app);

export default async function fetchUserLists(uid) {
  const listsCollection = collection(db, 'lists');
  const listSnapshot = await getDocs(listsCollection);
  const lists = listSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return lists;
}



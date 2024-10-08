import { db } from "../../utils/firebase/app"; 
import { collection, getDocs } from "firebase/firestore";

export default async function fetchLists() {
  const listsCollection = collection(db, 'lists');
  const listSnapshot = await getDocs(listsCollection);
  const lists = listSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  return lists;
}
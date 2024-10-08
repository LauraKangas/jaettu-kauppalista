import { db } from "../../utils/firebase/app"; 
import { collection, addDoc } from "firebase/firestore";

export default async function createList(newList) {
  try {
    const listsCollection = collection(db, 'lists');
    await addDoc(listsCollection, newList);
  } catch (error) {
    console.error("Error creating list: ", error);
  }
}
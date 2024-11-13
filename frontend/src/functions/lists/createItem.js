import { db } from "../../utils/firebase/app";
import { doc, updateDoc } from "firebase/firestore";

export default async function createItem(listId, newItem) {
  try {
    const listRef = doc(db, 'lists', listId);
    await updateDoc(listRef, {
      items: newItem // You might want to merge this with existing items
    });
  } catch (e) {
    console.error("Error adding item: ", e);
  }
}

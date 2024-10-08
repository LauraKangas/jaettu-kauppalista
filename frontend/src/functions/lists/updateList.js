import app from "../../utils/firebase/app"
import { getFirestore, doc, updateDoc } from "firebase/firestore";

const db = getFirestore(app)

export default async function updateList(listId, updates) {
  try {
    await updateDoc(doc(db, 'lists', listId), {
      ...updates,
    })
  } catch (e) {
    console.error(e)
  }
}
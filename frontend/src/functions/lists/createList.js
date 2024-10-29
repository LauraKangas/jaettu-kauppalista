import { db } from "../../utils/firebase/app"
import { collection, addDoc } from "firebase/firestore"

export default async function createList(newList) {
  try {
    return addDoc(collection(db, 'lists'), newList)
  } catch (error) {
    console.error("Error creating list: ", error)
  }
}
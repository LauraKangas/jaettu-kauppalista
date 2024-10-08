import app from "../../utils/firebase/app"
import { getFirestore, doc, getDoc } from "firebase/firestore";
import fetchUser from "../users/fetchUser"

const db = getFirestore(app)

export default async function fetchUserLists(uid) {
  const user = await fetchUser(uid)
  const listsCollection = await Promise.all(user.sharedLists.map(async listId => {
    return getDoc(doc(db, 'lists', listId))
  }))
  
  return listsCollection.map(listDoc => ({
    ...listDoc.data(),
    id: listDoc.id,
  }))
}
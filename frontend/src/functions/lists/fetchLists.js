import { db } from "../../utils/firebase/app"
import { collection, getDocs, where } from "firebase/firestore"

export default async function fetchLists(uid) {
  try {
    const listSnapshot = await getDocs(collection(db, 'lists'), where('sharedTo', 'array-contains', uid))
    return listSnapshot.docs.filter(item => item.data().sharedTo.includes(uid)).map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (e) {
    console.error(e)
  }
}
import app from "../../utils/firebase/app"
import { getFirestore, doc, getDoc } from "firebase/firestore";

const db = getFirestore(app)

export default async function fetchUser(uid) {
  try {
    const userDoc = await getDoc(doc(db, 'users', uid))

    return {
      ...userDoc.data(),
      id: userDoc.id,
    }
  } catch (e) {
    console.error(e)
  }
}
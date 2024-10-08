import app from "../../utils/firebase/app"
import { getFirestore, doc, addDoc } from "firebase/firestore";

const db = getFirestore(app)

export default async function createList(data) {
  try {
    await addDoc(doc(db, 'lists'), {
      ...data,
      created: new Date(),
      status: 'normal',
    })
  } catch (e) {
    console.error(e)
  }
}
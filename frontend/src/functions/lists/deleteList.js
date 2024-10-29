import { db } from '../../utils/firebase/app'
import { doc, deleteDoc } from 'firebase/firestore'

const deleteList = async (listId) => {
  try {
    await deleteDoc(doc(db, 'lists', listId))
  } catch (error) {
    console.error("Error deleting list: ", error)
  }
}

export default deleteList
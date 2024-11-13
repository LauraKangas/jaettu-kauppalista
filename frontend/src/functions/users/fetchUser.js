
import { db } from '../../utils/firebase/app';
import { doc, getDoc } from 'firebase/firestore';


export async function fetchUser(pin) {
  try {
    const userRef = doc(db, 'pins', pin); 
    const userSnap = await getDoc(userRef); 

    if (userSnap.exists()) {
      return userSnap.data();
    } else {
      console.log("No such user with this pin!");
      return null; 
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}


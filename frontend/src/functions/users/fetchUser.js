
import { db } from '../../utils/firebase/app'; // Adjust import based on your folder structure
import { doc, getDoc } from 'firebase/firestore';

// Function to fetch user data based on the PIN
export async function fetchUser(pin) {
  try {
    const userRef = doc(db, 'pins', pin); // Access the pin document in Firestore
    const userSnap = await getDoc(userRef); // Get the document snapshot

    if (userSnap.exists()) {
      return userSnap.data(); // Return user data if it exists
    } else {
      console.log("No such user with this pin!");
      return null; // Return null if no user exists with the given pin
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return null;
  }
}


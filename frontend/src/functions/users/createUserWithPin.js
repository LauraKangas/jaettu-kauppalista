import { db } from "../../utils/firebase/app"; 
import { doc, getDoc, setDoc } from "firebase/firestore";

function generateSixDigitPin() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createUserWithPin() {
  try {
    let uniquePin = null;
    let attempts = 0;
    const maxAttempts = 5; 

    while (attempts < maxAttempts) {
      const pinCandidate = generateSixDigitPin();
      const pinRef = doc(db, 'users', pinCandidate);
      const pinSnap = await getDoc(pinRef);

      if (!pinSnap.exists()) {
        uniquePin = pinCandidate;
        break;
      }
      attempts++;
    }

    if (!uniquePin) {
      throw new Error("Could not generate a unique pin after multiple attempts");
    }

    const userRef = doc(db, 'users', uniquePin);
    await setDoc(userRef, { pin: uniquePin });

    return { pin: uniquePin }; 
  } catch (error) {
    console.error("Error creating user with pin:", error);
    return null; 
  }
}

import { enqueueSnackbar } from "notistack";
import { setDoc, doc, getDoc } from 'firebase/firestore';
/**
 * Generates a six-digit PIN.
 * 
 * This function generates a random six-digit number, typically used for user identification or verification purposes.
 * 
 * @returns {string} - A six-digit PIN as a string.
 */
export const generateSixDigitPin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};
/**
 * Generates a unique PIN for a user and stores it in the Firestore database.
 * 
 * This function generates a six-digit PIN and checks whether the PIN already exists in the Firestore database.
 * If the PIN already exists, it informs the user via a Snackbar message. If the PIN is unique, it stores the PIN in the database
 * and updates the state with the newly generated PIN.
 * 
 * @param {Object} db - The Firestore database instance.
 * @param {Function} setGeneratedPin - A state setter function to update the generated PIN.
 * @param {Function} enqueueSnackbar - Function to show a notification via the Snackbar component.
 */
export const generatePin = async (db, setGeneratedPin, enqueueSnackbar) => {
  const pin = generateSixDigitPin();  // Generate a new six-digit PIN.
  const pinRef = doc(db, 'users', pin);  // Reference to the Firestore document for this PIN.

  try {
    // Check if the PIN already exists in the database.
    const pinSnap = await getDoc(pinRef);

    if (pinSnap.exists()) {
      enqueueSnackbar("Tämä käyttäjäkoodi on jo varattu. Ole hyvä ja yritä uudelleen.", { variant: 'error' });
      return;
    }

    // If the PIN does not exist, store it in Firestore with a creation timestamp.
    await setDoc(pinRef, { created: new Date() });
    setGeneratedPin(pin);  // Update the state with the generated PIN.

  } catch (error) {
    enqueueSnackbar("Järjestelmävirhe. Yritä uudelleen.", { variant: 'error' });
  }
};


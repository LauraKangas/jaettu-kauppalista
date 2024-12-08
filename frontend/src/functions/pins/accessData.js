import { enqueueSnackbar } from "notistack";
import { getDoc, doc } from 'firebase/firestore';
/**
 * Accesses the user data based on the provided PIN.
 * 
 * This function checks if the input PIN exists in the Firestore database. If the PIN is valid, 
 * it stores the PIN in localStorage and navigates the user to the lists page. If the PIN is invalid, 
 * an error message is shown via a Snackbar. In case of an error during the process, a system error message is displayed.
 * 
 * @param {string} inputPin - The PIN entered by the user.
 * @param {Object} db - The Firestore database instance used to interact with the Firestore service.
 * @param {Function} enqueueSnackbar - The function used to display a notification via Snackbar.
 * @param {Function} navigate - The navigation function used to navigate the user to different routes.
 *
 * @returns {void} - This function performs side effects and does not return a value.
 */
export const accessData = async (inputPin, db, enqueueSnackbar, navigate) => {
  if (!inputPin) {
    enqueueSnackbar("Ole hyvä ja anna oikea käyttäjäkoodi.", { variant: 'warning' });
    return;
  }

  try {
    const pinSnap = await getDoc(doc(db, 'users', inputPin));

    if (pinSnap.exists()) {
      localStorage.setItem("userPin", inputPin);
      navigate("/lists");
    } else {
      enqueueSnackbar("Väärä käyttäjäkoodi.", { variant: 'error' });
    }
  } catch (error) {
    enqueueSnackbar("Järjestelmävirhe. Yritä uudelleen.", { variant: 'error' });
  }
};

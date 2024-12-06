import { enqueueSnackbar } from "notistack";
import { getDoc, doc } from 'firebase/firestore';

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
    console.error("Error accessing data:", error);
    enqueueSnackbar("Järjestelmävirhe. Yritä uudelleen.", { variant: 'error' });
  }
};

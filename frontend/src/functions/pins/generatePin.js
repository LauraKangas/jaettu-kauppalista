import { enqueueSnackbar } from "notistack";
import { setDoc, doc, getDoc } from 'firebase/firestore';

export const generateSixDigitPin = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generatePin = async (db, setGeneratedPin, enqueueSnackbar) => {
  const pin = generateSixDigitPin();
  const pinRef = doc(db, 'users', pin);

  try {
    const pinSnap = await getDoc(pinRef);

    if (pinSnap.exists()) {
      enqueueSnackbar("Tämä käyttäjäkoodi on jo varattu. Ole hyvä ja yritä uudelleen.", { variant: 'error' });
      return;
    }

    await setDoc(pinRef, { created: new Date() });
    setGeneratedPin(pin);
  } catch (error) {
    console.error("Error generating pin:", error);
    enqueueSnackbar("Järjestelmävirhe. Yritä uudelleen.", { variant: 'error' });
  }
};


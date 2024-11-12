import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
/*
const firebaseConfig = {
  apiKey: "AIzaSyAYCTVY_dsuRnSKc6a3Md0z-TqnbdVvuCE",
  authDomain: "jaettu-kauppalista.firebaseapp.com",
  projectId: "jaettu-kauppalista",
  storageBucket: "jaettu-kauppalista.appspot.com",
  messagingSenderId: "247413672884",
  appId: "1:247413672884:web:52c479377d8a1b9f1200e1"
};
REACT_APP_FIREBASE_API_KEY=AIzaSyAYCTVY_dsuRnSKc6a3Md0z-TqnbdVvuCE
REACT_APP_FIREBASE_AUTH_DOMAIN=jaettu-kauppalista.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=jaettu-kauppalista
REACT_APP_FIREBASE_STORAGE_BUCKET=jaettu-kauppalista.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=247413672884
REACT_APP_FIREBASE_APP_ID=1:247413672884:web:52c479377d8a1b9f1200e1
*/
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, app, db };
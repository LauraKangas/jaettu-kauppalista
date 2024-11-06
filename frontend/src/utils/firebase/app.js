import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAYCTVY_dsuRnSKc6a3Md0z-TqnbdVvuCE",
  authDomain: "jaettu-kauppalista.firebaseapp.com",
  projectId: "jaettu-kauppalista",
  storageBucket: "jaettu-kauppalista.appspot.com",
  messagingSenderId: "247413672884",
  appId: "1:247413672884:web:52c479377d8a1b9f1200e1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, app, db };
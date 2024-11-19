import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const messaging = getMessaging(app);

const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('./firebase-messaging-sw.js') 
      .then((registration) => {
        console.log('Service Worker registered:', registration);
        initializeMessaging();
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });
  }
};

export const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      const token = await getToken(messaging, {
        vapidKey: process.env.REACT_APP_VAPID_KEY,
      });
      console.log('FCM Token:', token);
      saveTokenToFirestore(token);
      return token;
    } else {
      console.error('Notification permission denied');
      return null;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
};


const saveTokenToFirestore = async (token) => {
  const user = auth.currentUser;
  if (user) {
    const userRef = db.collection('users').doc(user.uid); 
    await userRef.set({ fcmToken: token }, { merge: true });
  }
};

onMessage(messaging, (payload) => {
  console.log('Message received: ', payload);
});

const initializeMessaging = () => {
  registerServiceWorker();
  requestNotificationPermission();
};

export { auth, app, db, messaging, initializeMessaging };


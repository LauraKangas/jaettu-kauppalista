import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
/**
 * Firebase configuration and initialization file.
 * 
 * This module configures and initializes Firebase services for use in the application.
 * The configuration details are securely loaded from environment variables to protect sensitive credentials.
 *
 * ### Features:
 * - **Environment Variable Support**:
 *   - All sensitive Firebase configuration keys are accessed via environment variables.
 *   - Ensures security by not hardcoding sensitive values directly in the code.
 * - **Firebase Services**:
 *   - **Authentication (`getAuth`)**: Provides user authentication features.
 *   - **Firestore Database (`getFirestore`)**: Enables cloud-based database operations.
 * - **Reusable Firebase App**:
 *   - Initializes and exports a Firebase app instance for shared usage across the application.
 * 
 * @module FirebaseConfig
 */

/**
 * Firebase configuration object.
 * - Values are dynamically loaded from environment variables.
 * 
 * @constant {Object} firebaseConfig
 * @property {string} apiKey - Firebase API key.
 * @property {string} authDomain - Firebase Auth domain.
 * @property {string} projectId - Firebase project ID.
 * @property {string} storageBucket - Firebase storage bucket.
 * @property {string} messagingSenderId - Firebase messaging sender ID.
 * @property {string} appId - Firebase app ID.
 */
const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID
};

/**
 * Initializes the Firebase application with the specified configuration.
 * 
 * @constant {FirebaseApp} app - The initialized Firebase application instance.
 */
const app = initializeApp(firebaseConfig);

/**
 * Firebase Authentication instance.
 * - Provides methods and tools for user authentication.
 * 
 * @constant {Auth} auth
 */
const auth = getAuth(app);

/**
 * Firestore Database instance.
 * - Enables interaction with the Firestore NoSQL cloud database.
 * 
 * @constant {Firestore} db
 */
const db = getFirestore(app);

export { auth, app, db };

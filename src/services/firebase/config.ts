/**
 * Firebase configuration and initialization
 *
 * TODO: Install firebase package: npm install firebase
 * After installing, uncomment the imports below and replace
 * placeholder exports with real Firebase instances.
 */

// TODO: Uncomment after installing firebase
// import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
// import { getFirestore, type Firestore } from 'firebase/firestore';
// import { getAuth, type Auth } from 'firebase/auth';
// import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

// Warn about missing environment variables in development
if (process.env.NODE_ENV === 'development') {
  const requiredVars = [
    'NEXT_PUBLIC_FIREBASE_API_KEY',
    'NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN',
    'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
  ] as const;

  const missingVars = requiredVars.filter((key) => !process.env[key]);

  if (missingVars.length > 0) {
    console.warn(
      `[Cuidar MdP] Firebase env vars missing: ${missingVars.join(', ')}. ` +
        'Using mock data for development. ' +
        'Create a .env.local file with your Firebase config to connect to a real project.'
    );
  }
}

// TODO: Uncomment after installing firebase
// const app: FirebaseApp =
//   getApps().length > 0 ? getApps()[0]! : initializeApp(firebaseConfig);
// const db: Firestore = getFirestore(app);
// const auth: Auth = getAuth(app);
// const storage: FirebaseStorage = getStorage(app);

// Placeholder exports — replace with real instances above after installing firebase
const app = null;
const db = null;
const auth = null;
const storage = null;

export { firebaseConfig, app, db, auth, storage };

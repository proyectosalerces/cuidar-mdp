/**
 * Firebase configuration and initialization
 *
 * Initializes Firebase app, Firestore, Auth, and Storage.
 * Uses environment variables from .env.local.
 */

import { initializeApp, getApps, type FirebaseApp } from 'firebase/app';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getAuth, type Auth } from 'firebase/auth';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ?? 'AIzaSyDBhWaGpqYgeaAc1el64rB58cpjGvYMQ6Y',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ?? 'cuidar-mdp.firebaseapp.com',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ?? 'cuidar-mdp',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ?? 'cuidar-mdp.firebasestorage.app',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ?? '255599759087',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ?? '1:255599759087:web:21cfa21a71317a7835151a',
};

/* Initialize Firebase (avoid re-init on hot reload) */
const app: FirebaseApp =
  getApps().length > 0 ? getApps()[0]! : initializeApp(firebaseConfig);

const db: Firestore = getFirestore(app);
const auth: Auth = getAuth(app);
const storage: FirebaseStorage = getStorage(app);

export { firebaseConfig, app, db, auth, storage };

/**
 * Firebase Authentication service
 *
 * TODO: Implement after installing firebase package.
 * Currently exports skeleton functions with proper TypeScript signatures.
 */

// TODO: Uncomment after installing firebase
// import {
//   signInWithEmailAndPassword,
//   createUserWithEmailAndPassword,
//   signOut as firebaseSignOut,
//   onAuthStateChanged,
//   type User,
//   type Unsubscribe,
// } from 'firebase/auth';
// import { auth } from './config';

/** Placeholder user type until firebase is installed */
export interface AppUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

export interface AuthResult {
  user: AppUser | null;
  error: string | null;
}

/**
 * Sign in a user with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  // TODO: Implement with Firebase Auth
  // const credential = await signInWithEmailAndPassword(auth, email, password);
  // return { user: mapUser(credential.user), error: null };
  console.warn('[Auth] signInWithEmail called — Firebase not configured yet');
  void email;
  void password;
  return { user: null, error: 'Firebase Auth no está configurado todavía.' };
}

/**
 * Create a new user account with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<AuthResult> {
  // TODO: Implement with Firebase Auth
  console.warn('[Auth] signUpWithEmail called — Firebase not configured yet');
  void email;
  void password;
  void displayName;
  return { user: null, error: 'Firebase Auth no está configurado todavía.' };
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  // TODO: Implement with Firebase Auth
  // await firebaseSignOut(auth);
  console.warn('[Auth] signOut called — Firebase not configured yet');
}

/**
 * Get the currently authenticated user (synchronous snapshot)
 */
export function getCurrentUser(): AppUser | null {
  // TODO: Implement with Firebase Auth
  // return auth.currentUser ? mapUser(auth.currentUser) : null;
  return null;
}

/**
 * Subscribe to authentication state changes
 * Returns an unsubscribe function
 */
export function onAuthStateChange(
  callback: (user: AppUser | null) => void
): () => void {
  // TODO: Implement with Firebase Auth
  // const unsubscribe: Unsubscribe = onAuthStateChanged(auth, (fbUser) => {
  //   callback(fbUser ? mapUser(fbUser) : null);
  // });
  // return unsubscribe;
  console.warn('[Auth] onAuthStateChange called — Firebase not configured yet');
  void callback;
  return () => {
    /* noop unsubscribe */
  };
}

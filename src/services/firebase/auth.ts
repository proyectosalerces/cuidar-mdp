/**
 * Firebase Authentication service
 *
 * Real Firebase Auth implementation with email/password.
 */

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  type User,
  type Unsubscribe,
} from 'firebase/auth';
import { auth } from './config';

/* ── Types ─────────────────────────────────────────────────────────────── */

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

/* ── Helpers ───────────────────────────────────────────────────────────── */

function mapUser(fbUser: User): AppUser {
  return {
    uid: fbUser.uid,
    email: fbUser.email,
    displayName: fbUser.displayName,
    photoURL: fbUser.photoURL,
  };
}

function mapAuthError(code: string): string {
  const errorMessages: Record<string, string> = {
    'auth/invalid-email': 'El email no es válido.',
    'auth/user-disabled': 'Esta cuenta fue deshabilitada.',
    'auth/user-not-found': 'No existe una cuenta con ese email.',
    'auth/wrong-password': 'Contraseña incorrecta.',
    'auth/invalid-credential': 'Email o contraseña incorrectos.',
    'auth/email-already-in-use': 'Ya existe una cuenta con ese email.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/too-many-requests': 'Demasiados intentos. Esperá un momento e intentá de nuevo.',
    'auth/network-request-failed': 'Error de conexión. Verificá tu internet.',
  };
  return errorMessages[code] ?? 'Ocurrió un error. Intentá de nuevo.';
}

/* ── Public API ────────────────────────────────────────────────────────── */

/**
 * Sign in a user with email and password
 */
export async function signInWithEmail(
  email: string,
  password: string
): Promise<AuthResult> {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    return { user: mapUser(credential.user), error: null };
  } catch (err: unknown) {
    const code = (err as { code?: string }).code ?? '';
    return { user: null, error: mapAuthError(code) };
  }
}

/**
 * Create a new user account with email and password
 */
export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<AuthResult> {
  try {
    const credential = await createUserWithEmailAndPassword(auth, email, password);

    if (displayName) {
      await updateProfile(credential.user, { displayName });
    }

    return {
      user: {
        ...mapUser(credential.user),
        displayName: displayName ?? credential.user.displayName,
      },
      error: null,
    };
  } catch (err: unknown) {
    const code = (err as { code?: string }).code ?? '';
    return { user: null, error: mapAuthError(code) };
  }
}

/**
 * Sign out the current user
 */
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

/**
 * Get the currently authenticated user (synchronous snapshot)
 */
export function getCurrentUser(): AppUser | null {
  return auth.currentUser ? mapUser(auth.currentUser) : null;
}

/**
 * Subscribe to authentication state changes
 * Returns an unsubscribe function
 */
export function onAuthStateChange(
  callback: (user: AppUser | null) => void
): () => void {
  const unsubscribe: Unsubscribe = onAuthStateChanged(auth, (fbUser) => {
    callback(fbUser ? mapUser(fbUser) : null);
  });
  return unsubscribe;
}

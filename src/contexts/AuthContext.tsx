'use client';

/**
 * AuthContext — gestión global de autenticación con Firebase.
 *
 * Usa Firebase Auth para login/register/logout real.
 * Escucha cambios de estado con onAuthStateChanged.
 * Incluye detección de rol administrador via Firestore 'admins' collection.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import type { AppUser } from '@/services/firebase/auth';
import {
  signInWithEmail,
  signUpWithEmail,
  signOut as firebaseSignOut,
  onAuthStateChange,
} from '@/services/firebase/auth';

/* ── Types ─────────────────────────────────────────────────────────────── */

interface AuthContextValue {
  /** Currently authenticated user, or null */
  user: AppUser | null;
  /** True while restoring session */
  loading: boolean;
  /** Convenience flag */
  isAuthenticated: boolean;
  /** True if the current user is an admin */
  isAdmin: boolean;
  /** Log in with email + password */
  login: (email: string, password: string) => Promise<{ error?: string }>;
  /** Register a new user */
  register: (email: string, password: string, nombre: string) => Promise<{ error?: string }>;
  /** Log out the current user */
  logout: () => void;
}

/* ── Context ───────────────────────────────────────────────────────────── */

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* ── Helpers ───────────────────────────────────────────────────────────── */

async function checkIsAdmin(email: string | null): Promise<boolean> {
  if (!email) return false;

  try {
    // Check Firestore 'admins' collection
    const adminDoc = await getDoc(doc(db, 'admins', email));
    if (adminDoc.exists()) return true;
  } catch {
    // Firestore check failed — fall through to env var fallback
  }

  // Fallback: check env variable
  const envAdmin = process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  if (envAdmin && email === envAdmin) return true;

  return false;
}

/* ── Provider ──────────────────────────────────────────────────────────── */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  /* Listen to Firebase auth state changes */
  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser?.email) {
        const adminStatus = await checkIsAdmin(firebaseUser.email);
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }

      setLoading(false);
    });
    return unsubscribe;
  }, []);

  /* ── Login ───────────────────────────────────────────────────────────── */

  const login = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    const result = await signInWithEmail(email, password);
    if (result.error) {
      return { error: result.error };
    }
    // user state will be updated by onAuthStateChanged listener
    return {};
  }, []);

  /* ── Register ────────────────────────────────────────────────────────── */

  const register = useCallback(
    async (email: string, password: string, nombre: string): Promise<{ error?: string }> => {
      const result = await signUpWithEmail(email, password, nombre);
      if (result.error) {
        return { error: result.error };
      }
      // user state will be updated by onAuthStateChanged listener
      return {};
    },
    [],
  );

  /* ── Logout ──────────────────────────────────────────────────────────── */

  const logout = useCallback(async () => {
    await firebaseSignOut();
    // user state will be set to null by onAuthStateChanged listener
  }, []);

  /* ── Context value ───────────────────────────────────────────────────── */

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      isAdmin,
      login,
      register,
      logout,
    }),
    [user, loading, isAdmin, login, register, logout],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

/* ── Hook ──────────────────────────────────────────────────────────────── */

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de un <AuthProvider>');
  }
  return ctx;
}

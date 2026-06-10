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

/* ── Admin emails ─────────────────────────────────────────────────────── */

const ADMIN_EMAILS: string[] = [
  'proyectos@residencialosalerces.com',
];

function checkIsAdmin(email: string | null): boolean {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase().trim();

  // Check hardcoded list
  if (ADMIN_EMAILS.includes(normalizedEmail)) return true;

  // Fallback: check env variable
  const envAdmin = process.env.NEXT_PUBLIC_ADMIN_EMAIL?.toLowerCase().trim();
  if (envAdmin && normalizedEmail === envAdmin) return true;

  return false;
}

/* ── Provider ──────────────────────────────────────────────────────────── */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  /* Listen to Firebase auth state changes */
  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      setUser(firebaseUser);
      setIsAdmin(checkIsAdmin(firebaseUser?.email ?? null));
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

'use client';

/**
 * AuthContext — gestión global de autenticación.
 *
 * Implementa mock auth con localStorage hasta que Firebase esté conectado.
 * Persiste la sesión en localStorage ('cuidar-mdp-auth-user').
 * Los usuarios registrados se almacenan en 'cuidar-mdp-auth-users'.
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

/* ── Types ─────────────────────────────────────────────────────────────── */

interface AuthContextValue {
  /** Currently authenticated user, or null */
  user: AppUser | null;
  /** True while restoring session from localStorage */
  loading: boolean;
  /** Convenience flag */
  isAuthenticated: boolean;
  /** Log in with email + password */
  login: (email: string, password: string) => Promise<{ error?: string }>;
  /** Register a new user */
  register: (email: string, password: string, nombre: string) => Promise<{ error?: string }>;
  /** Log out the current user */
  logout: () => void;
}

/* ── Constants ─────────────────────────────────────────────────────────── */

const STORAGE_USER_KEY = 'cuidar-mdp-auth-user';
const STORAGE_USERS_KEY = 'cuidar-mdp-auth-users';
const MOCK_DELAY_MS = 500;

/* ── Helpers ───────────────────────────────────────────────────────────── */

interface StoredUser {
  uid: string;
  email: string;
  displayName: string;
  password: string;
}

function getStoredUsers(): StoredUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    return raw ? (JSON.parse(raw) as StoredUser[]) : [];
  } catch {
    return [];
  }
}

function saveStoredUsers(users: StoredUser[]) {
  localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
}

function generateUid(): string {
  return `mock-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/* ── Context ───────────────────────────────────────────────────────────── */

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/* ── Provider ──────────────────────────────────────────────────────────── */

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  /* Restore session on mount */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_USER_KEY);
      if (raw) {
        setUser(JSON.parse(raw) as AppUser);
      }
    } catch {
      /* corrupted data – ignore */
    }
    setLoading(false);
  }, []);

  /* Persist session whenever user changes */
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_USER_KEY);
    }
  }, [user]);

  /* ── Login ───────────────────────────────────────────────────────────── */

  const login = useCallback(async (email: string, password: string): Promise<{ error?: string }> => {
    await delay(MOCK_DELAY_MS);

    const users = getStoredUsers();
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (!found) {
      return { error: 'No existe una cuenta con ese email.' };
    }

    if (found.password !== password) {
      return { error: 'Contraseña incorrecta.' };
    }

    const appUser: AppUser = {
      uid: found.uid,
      email: found.email,
      displayName: found.displayName,
      photoURL: null,
    };

    setUser(appUser);
    return {};
  }, []);

  /* ── Register ────────────────────────────────────────────────────────── */

  const register = useCallback(
    async (email: string, password: string, nombre: string): Promise<{ error?: string }> => {
      await delay(MOCK_DELAY_MS);

      const users = getStoredUsers();
      const exists = users.some(
        (u) => u.email.toLowerCase() === email.toLowerCase(),
      );

      if (exists) {
        return { error: 'Ya existe una cuenta con ese email.' };
      }

      const newUser: StoredUser = {
        uid: generateUid(),
        email: email.toLowerCase(),
        displayName: nombre,
        password,
      };

      saveStoredUsers([...users, newUser]);

      const appUser: AppUser = {
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName,
        photoURL: null,
      };

      setUser(appUser);
      return {};
    },
    [],
  );

  /* ── Logout ──────────────────────────────────────────────────────────── */

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  /* ── Context value ───────────────────────────────────────────────────── */

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      isAuthenticated: !!user,
      login,
      register,
      logout,
    }),
    [user, loading, login, register, logout],
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

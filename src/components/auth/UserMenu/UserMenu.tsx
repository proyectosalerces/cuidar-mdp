'use client';

/**
 * UserMenu — Muestra botón de login o avatar con menú desplegable
 * según el estado de autenticación.
 *
 * Props:
 *   variant: 'header' (desktop, default) | 'drawer' (mobile)
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/utils/classnames';
import { useAuth } from '@/contexts/AuthContext';
import AuthModal from '@/components/auth/AuthModal/AuthModal';
import styles from './UserMenu.module.css';

/* ── Types ─────────────────────────────────────────────────────────────── */

export interface UserMenuProps {
  variant?: 'header' | 'drawer';
  onNavigate?: () => void;
}

/* ── Helpers ───────────────────────────────────────────────────────────── */

function getInitials(name: string | null): string {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}

/* ── Icons (inline SVG to avoid extra deps) ────────────────────────────── */

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ReviewIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
  );
}

function LogoutIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  );
}

function ChevronDown() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* ── Component ─────────────────────────────────────────────────────────── */

export default function UserMenu({
  variant = 'header',
  onNavigate,
}: UserMenuProps) {
  const { user, isAuthenticated, isAdmin, loading, logout } = useAuth();
  const pathname = usePathname();
  const isOnAdmin = pathname?.startsWith('/admin');
  const [modalOpen, setModalOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /* ── Close dropdown on outside click ────────────────────────────────── */

  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen]);

  const openModal = useCallback(() => {
    setModalOpen(true);
    onNavigate?.();
  }, [onNavigate]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  const toggleDropdown = useCallback(() => {
    setDropdownOpen((prev) => !prev);
  }, []);

  const handleLogout = useCallback(() => {
    setDropdownOpen(false);
    logout();
  }, [logout]);

  const handleLinkClick = useCallback(() => {
    setDropdownOpen(false);
    onNavigate?.();
  }, [onNavigate]);

  /* ── Don't render anything while loading ─────────────────────────────── */

  if (loading) return null;

  const isDrawer = variant === 'drawer';

  return (
    <>
      <div
        ref={containerRef}
        className={cn(styles.container, isDrawer && styles.drawerVariant)}
      >
        {/* ── Unauthenticated: show login button ──────────────────────── */}
        {!isAuthenticated && (
          <button
            className={styles.loginButton}
            onClick={openModal}
            type="button"
          >
            <span className={styles.loginIcon}>
              <UserIcon />
            </span>
            Iniciar sesión
          </button>
        )}

        {/* ── Authenticated: show avatar + dropdown ───────────────────── */}
        {isAuthenticated && user && (
          <>
            <button
              className={styles.avatarButton}
              onClick={toggleDropdown}
              type="button"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              <span className={styles.avatar}>
                {getInitials(user.displayName)}
              </span>
              <span className={cn(styles.chevron, dropdownOpen && styles.chevronOpen)}>
                <ChevronDown />
              </span>
            </button>

            <div className={cn(styles.dropdown, dropdownOpen && styles.dropdownOpen)}>
              {/* User info header */}
              <div className={styles.dropdownHeader}>
                <p className={styles.userName}>
                  {user.displayName || 'Usuario'}
                </p>
                <p className={styles.userEmail}>{user.email}</p>
              </div>

              {/* Menu items */}
              <div className={styles.dropdownBody}>
                <Link
                  href="/mis-resenas"
                  className={styles.dropdownItem}
                  onClick={handleLinkClick}
                >
                  <span className={styles.dropdownItemIcon}>
                    <ReviewIcon />
                  </span>
                  Mis reseñas
                </Link>

                {isAdmin && (
                  <>
                    <div className={styles.dropdownDivider} />
                    <Link
                      href={isOnAdmin ? '/' : '/admin'}
                      className={styles.dropdownItem}
                      onClick={handleLinkClick}
                    >
                      <span className={styles.dropdownItemIcon}>
                        {isOnAdmin ? (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                          </svg>
                        ) : (
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 20h9" />
                            <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                          </svg>
                        )}
                      </span>
                      {isOnAdmin ? 'Volver al sitio' : 'Panel Admin'}
                    </Link>
                  </>
                )}

                <div className={styles.dropdownDivider} />

                <button
                  className={styles.logoutItem}
                  onClick={handleLogout}
                  type="button"
                >
                  <span className={styles.dropdownItemIcon}>
                    <LogoutIcon />
                  </span>
                  Cerrar sesión
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Auth modal — rendered here so it's always available */}
      <AuthModal isOpen={modalOpen} onClose={closeModal} />
    </>
  );
}

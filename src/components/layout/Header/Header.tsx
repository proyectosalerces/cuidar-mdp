'use client';

/**
 * Main site header with glass-morphism scroll effect,
 * desktop navigation, mobile hamburger drawer, and CTA button.
 */

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useScrollPosition } from '@/hooks/useScrollPosition';
import { cn } from '@/utils/classnames';
import { NAV_ITEMS, SITE_NAME, WHATSAPP_NUMBER } from '@/utils/constants';
import ThemeToggle from '@/components/ui/ThemeToggle/ThemeToggle';
import UserMenu from '@/components/auth/UserMenu/UserMenu';
import styles from './Header.module.css';

const SCROLL_THRESHOLD = 32;

export default function Header() {
  const scrollY = useScrollPosition();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isScrolled = scrollY > SCROLL_THRESHOLD;

  const toggleDrawer = useCallback(() => {
    setDrawerOpen((prev) => !prev);
  }, []);

  const closeDrawer = useCallback(() => {
    setDrawerOpen(false);
  }, []);

  /* Lock body scroll when drawer is open */
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [drawerOpen]);

  return (
    <>
      <header
        className={cn(styles.header, isScrolled && styles.headerScrolled)}
        role="banner"
      >
        <div className={styles.inner}>
          {/* ── Logo ──────────────────────────────────────────── */}
          <Link href="/" className={styles.logo} aria-label={`${SITE_NAME} — Ir al inicio`}>
            <span className={styles.logoIcon} aria-hidden="true">C</span>
            <span className={styles.logoText}>{SITE_NAME}</span>
          </Link>

          {/* ── Desktop navigation ───────────────────────────── */}
          <nav className={styles.desktopNav} aria-label="Navegación principal">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className={styles.navLink}>
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ── Desktop theme toggle ────────────────────────── */}
          <ThemeToggle />

          {/* ── Desktop user menu ─────────────────────────────── */}
          <UserMenu />

          {/* ── Desktop CTA ──────────────────────────────────── */}
          <Link
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola, quisiera asesoramiento gratuito')}`}
            className={styles.ctaButton}
            target="_blank"
            rel="noopener noreferrer"
          >
            Asesoramiento gratuito
          </Link>

          {/* ── Mobile hamburger ─────────────────────────────── */}
          <button
            className={cn(styles.hamburger, drawerOpen && styles.hamburgerOpen)}
            onClick={toggleDrawer}
            aria-label={drawerOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={drawerOpen}
          >
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
            <span className={styles.hamburgerLine} />
          </button>
        </div>
      </header>

      {/* ── Mobile overlay ──────────────────────────────────── */}
      <div
        className={cn(styles.overlay, drawerOpen && styles.overlayVisible)}
        onClick={closeDrawer}
        aria-hidden="true"
      />

      {/* ── Mobile drawer ───────────────────────────────────── */}
      <aside
        className={cn(styles.drawer, drawerOpen && styles.drawerOpen)}
        aria-label="Menú de navegación móvil"
      >
        <div className={styles.drawerHeader}>
          <Link href="/" className={styles.logo} onClick={closeDrawer}>
            <span className={styles.logoIcon} aria-hidden="true">C</span>
            <span className={styles.logoText}>{SITE_NAME}</span>
          </Link>
          <button
            className={styles.drawerClose}
            onClick={closeDrawer}
            aria-label="Cerrar menú"
          >
            ✕
          </button>
        </div>

        <nav className={styles.drawerNav} aria-label="Navegación móvil">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={styles.drawerLink}
              onClick={closeDrawer}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* ── Mobile theme toggle ───────────────────────────── */}
        <div style={{ padding: '0 var(--space-6)' }}>
          <ThemeToggle variant="drawer" />
        </div>

        {/* ── Mobile user menu ────────────────────────────────── */}
        <div style={{ padding: '0 var(--space-6)', marginTop: 'var(--space-3)' }}>
          <UserMenu variant="drawer" onNavigate={closeDrawer} />
        </div>

        <Link
          href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola, quisiera asesoramiento gratuito')}`}
          className={styles.drawerCta}
          target="_blank"
          rel="noopener noreferrer"
          onClick={closeDrawer}
        >
          Asesoramiento gratuito
        </Link>
      </aside>

      {/* Spacer so content isn't hidden behind fixed header */}
      <div className={styles.spacer} aria-hidden="true" />
    </>
  );
}

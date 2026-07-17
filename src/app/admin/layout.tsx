'use client';

/**
 * Admin Layout — dark sidebar + protected route
 */

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import styles from './layout.module.css';

const NAV_LINKS = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/residencias', label: 'Residencias', icon: '🏠' },
  { href: '/admin/destacados', label: 'Destacados', icon: '🌟' },
  { href: '/admin/profesionales', label: 'Profesionales', icon: '👨‍⚕️' },
  { href: '/admin/resenas', label: 'Reseñas', icon: '⭐' },
  { href: '/admin/solicitudes', label: 'Solicitudes', icon: '📥' },
  { href: '/admin/estadisticas', label: 'Estadísticas', icon: '📈' },
  { href: '/admin/blog', label: 'Blog', icon: '📝' },
  { href: '/admin/contacto', label: 'Mensajes', icon: '📬' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  /* Protect route */
  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.replace('/');
    }
  }, [loading, user, isAdmin, router]);

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <div className={styles.spinner} />
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className={styles.wrapper}>
      {/* Mobile toggle */}
      <button
        className={styles.mobileToggle}
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Menú"
      >
        {sidebarOpen ? '✕' : '☰'}
      </button>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className={styles.overlay}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.sidebarHeader}>
          <span className={styles.logo}>
            Cuidar <span className={styles.logoAccent}>MdP</span>
          </span>
          <span className={styles.adminBadge}>Admin</span>
        </div>

        <div className={styles.userInfo}>
          <p className={styles.userName}>{user.displayName ?? 'Administrador'}</p>
          <p className={styles.userEmail}>{user.email}</p>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            {NAV_LINKS.map((link) => {
              const isActive =
                link.href === '/admin'
                  ? pathname === '/admin'
                  : pathname.startsWith(link.href);

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <span className={styles.navIcon}>{link.icon}</span>
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className={styles.sidebarFooter}>
          <Link href="/" className={styles.backLink}>
            ← Volver al sitio
          </Link>
        </div>
      </aside>

      {/* Main content */}
      <main className={styles.main}>{children}</main>
    </div>
  );
}

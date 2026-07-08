'use client';

/**
 * Admin Dashboard — overview with stats and quick actions
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getStats } from '@/services/admin.service';
import styles from './page.module.css';

interface Stats {
  totalResidencias: number;
  totalProfesionales: number;
  totalResenas: number;
}

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats>({
    totalResidencias: 0,
    totalProfesionales: 0,
    totalResenas: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const data = await getStats();
        setStats(data);
      } catch (err) {
        console.error('Error fetching stats:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  return (
    <div className={styles.page}>
      {/* Welcome */}
      <div className={styles.welcome}>
        <h1 className={styles.welcomeTitle}>
          ¡Hola, {user?.displayName ?? 'Admin'}!
        </h1>
        <p className={styles.welcomeSub}>
          Bienvenido al panel de administración de Cuidar MdP.
        </p>
      </div>

      {/* Stats */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🏠</div>
          <div className={styles.statValue}>
            {loading ? '—' : stats.totalResidencias}
          </div>
          <div className={styles.statLabel}>Residencias</div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>👨‍⚕️</div>
          <div className={styles.statValue}>
            {loading ? '—' : stats.totalProfesionales}
          </div>
          <div className={styles.statLabel}>Profesionales</div>
        </div>

        <Link href="/admin/resenas" className={styles.statCard}>
          <div className={styles.statIcon}>⭐</div>
          <div className={styles.statValue}>
            {loading ? '—' : stats.totalResenas}
          </div>
          <div className={styles.statLabel}>Reseñas</div>
        </Link>
      </div>

      {/* Quick Actions */}
      <h2 className={styles.actionsTitle}>Acciones rápidas</h2>
      <div className={styles.actionsGrid}>
        <Link href="/admin/residencias/nueva" className={styles.actionCard}>
          <div className={`${styles.actionIcon} ${styles.actionIconGreen}`}>
            🏠
          </div>
          <div>
            <div className={styles.actionLabel}>Agregar residencia</div>
            <div className={styles.actionDesc}>
              Crear una nueva residencia geriátrica
            </div>
          </div>
        </Link>

        <Link href="/admin/profesionales/nuevo" className={styles.actionCard}>
          <div className={`${styles.actionIcon} ${styles.actionIconBlue}`}>
            👨‍⚕️
          </div>
          <div>
            <div className={styles.actionLabel}>Agregar profesional</div>
            <div className={styles.actionDesc}>
              Registrar un nuevo profesional de salud
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

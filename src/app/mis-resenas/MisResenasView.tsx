'use client';

/**
 * MisResenasView — Client component that displays the user's reviews.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui';
import * as service from '@/services/resenas.service';
import type { Resena } from '@/types/resena';
import styles from './MisResenasView.module.css';

export default function MisResenasView() {
  const { user, isAuthenticated } = useAuth();
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const mis = await service.getMisResenas(user!.uid);
        setResenas(mis);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [user]);

  /* Not logged in */
  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <h1 className={styles.emptyTitle}>Mis reseñas</h1>
          <p className={styles.emptyText}>Iniciá sesión para ver tus reseñas.</p>
        </div>
      </div>
    );
  }

  /* Loading */
  if (loading) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Mis reseñas</h1>
        <div className={styles.loading}>Cargando…</div>
      </div>
    );
  }

  /* No reviews */
  if (resenas.length === 0) {
    return (
      <div className={styles.container}>
        <h1 className={styles.title}>Mis reseñas</h1>
        <div className={styles.emptyState}>
          <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
          <p className={styles.emptyTitle}>Aún no dejaste reseñas</p>
          <p className={styles.emptyText}>
            Visitá una residencia o profesional y compartí tu experiencia.
          </p>
          <div className={styles.emptyActions}>
            <Button variant="primary" href="/residencias">
              Ver residencias
            </Button>
            <Button variant="outline" href="/profesionales">
              Ver profesionales
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* Has reviews */
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Mis reseñas</h1>
      <p className={styles.subtitle}>{resenas.length} reseña{resenas.length !== 1 ? 's' : ''}</p>

      <div className={styles.list}>
        {resenas.map((resena) => (
          <div key={resena.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.stars}>
                {Array.from({ length: 5 }, (_, i) => (
                  <svg
                    key={i}
                    className={i < resena.calificacion ? styles.starFilled : styles.starEmpty}
                    viewBox="0 0 24 24"
                    fill={i < resena.calificacion ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                ))}
              </div>
              <span className={styles.cardDate}>
                {new Date(resena.fecha).toLocaleDateString('es-AR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })}
              </span>
            </div>

            <h3 className={styles.cardTitle}>{resena.titulo}</h3>
            <p className={styles.cardComment}>{resena.comentario}</p>

            <div className={styles.cardFooter}>
              <span className={styles.cardEntity}>
                {resena.entidadTipo === 'residencia' ? '🏠' : '👨‍⚕️'}{' '}
                {resena.entidadTipo === 'residencia' ? 'Residencia' : 'Profesional'}
              </span>
              {resena.aprobada ? (
                <span className={styles.badgeApproved}>✓ Publicada</span>
              ) : (
                <span className={styles.badgePending}>⏳ Pendiente de aprobación</span>
              )}
            </div>

            <Link
              href={`/${resena.entidadTipo === 'residencia' ? 'residencias' : 'profesionales'}/${resena.entidadId}`}
              className={styles.cardLink}
            >
              Ver página →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

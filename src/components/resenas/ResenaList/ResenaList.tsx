'use client';

/**
 * ResenaList — paginated, sortable list of review cards.
 *
 * Shows approved reviews with avatar-initials, date, stars, title
 * and comment. Pending reviews from the current user are shown
 * at the top with a badge.
 */

import { useMemo, useState } from 'react';
import { cn } from '@/utils/classnames';
import { Badge, Rating } from '@/components/ui';
import { formatFecha } from '@/utils/formatters';
import type { Resena } from '@/types/resena';
import styles from './ResenaList.module.css';

/* ── Types ─────────────────────────────────────────────────────────────── */

type SortMode = 'recientes' | 'mejor';

export interface ResenaListProps {
  resenas: Resena[];
  miResenaPendiente: Resena | null;
}

/* ── Helpers ───────────────────────────────────────────────────────────── */

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]![0] : '';
  return (first + last).toUpperCase();
}

const PAGE_SIZE = 5;

/* ── Component ────────────────────────────────────────────────────────── */

export default function ResenaList({ resenas, miResenaPendiente }: ResenaListProps) {
  const [sort, setSort] = useState<SortMode>('recientes');
  const [showAll, setShowAll] = useState(false);

  const sorted = useMemo(() => {
    const clone = [...resenas];
    if (sort === 'mejor') {
      clone.sort((a, b) => b.calificacion - a.calificacion);
    } else {
      clone.sort(
        (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime(),
      );
    }
    return clone;
  }, [resenas, sort]);

  const visible = showAll ? sorted : sorted.slice(0, PAGE_SIZE);
  const hasMore = sorted.length > PAGE_SIZE && !showAll;

  /* ── Empty state ────────────────────────────────────────────────────── */

  if (resenas.length === 0 && !miResenaPendiente) {
    return (
      <div className={styles.empty}>
        <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        <p className={styles.emptyTitle}>Aún no hay reseñas</p>
        <p className={styles.emptyText}>¡Sé el primero en compartir tu experiencia!</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Sort toggle */}
      {resenas.length > 1 && (
        <div className={styles.sortBar}>
          <button
            type="button"
            className={cn(styles.sortBtn, sort === 'recientes' && styles.sortBtnActive)}
            onClick={() => setSort('recientes')}
          >
            Más recientes
          </button>
          <button
            type="button"
            className={cn(styles.sortBtn, sort === 'mejor' && styles.sortBtnActive)}
            onClick={() => setSort('mejor')}
          >
            Mejor calificación
          </button>
        </div>
      )}

      {/* Pending review (author only) */}
      {miResenaPendiente && (
        <div className={cn(styles.card, styles.cardPending)}>
          <div className={styles.cardHeader}>
            <div className={styles.avatar}>
              <span className={styles.avatarInitials}>
                {getInitials(miResenaPendiente.autorNombre)}
              </span>
            </div>
            <div className={styles.cardMeta}>
              <div className={styles.cardAuthorRow}>
                <span className={styles.authorName}>{miResenaPendiente.autorNombre}</span>
                <Badge variant="warning">Pendiente de aprobación</Badge>
              </div>
              <div className={styles.cardMetaRow}>
                <Rating value={miResenaPendiente.calificacion} showCount={false} size="sm" />
                <span className={styles.cardDate}>{formatFecha(miResenaPendiente.fecha)}</span>
              </div>
            </div>
          </div>
          <h4 className={styles.cardTitle}>{miResenaPendiente.titulo}</h4>
          <p className={styles.cardComment}>{miResenaPendiente.comentario}</p>
        </div>
      )}

      {/* Approved reviews */}
      {visible.map((resena) => (
        <div key={resena.id} className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.avatar}>
              <span className={styles.avatarInitials}>
                {getInitials(resena.autorNombre)}
              </span>
            </div>
            <div className={styles.cardMeta}>
              <span className={styles.authorName}>{resena.autorNombre}</span>
              <div className={styles.cardMetaRow}>
                <Rating value={resena.calificacion} showCount={false} size="sm" />
                <span className={styles.cardDate}>{formatFecha(resena.fecha)}</span>
              </div>
            </div>
          </div>
          <h4 className={styles.cardTitle}>{resena.titulo}</h4>
          <p className={styles.cardComment}>{resena.comentario}</p>
        </div>
      ))}

      {/* Show more */}
      {hasMore && (
        <button
          type="button"
          className={styles.showMoreBtn}
          onClick={() => setShowAll(true)}
        >
          Mostrar más reseñas ({sorted.length - PAGE_SIZE} restantes)
        </button>
      )}
    </div>
  );
}

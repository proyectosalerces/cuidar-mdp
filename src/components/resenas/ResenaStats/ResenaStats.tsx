/**
 * ResenaStats — aggregate rating overview for an entity.
 *
 * Left side: big average number + filled stars + total count.
 * Right side: distribution bars (5★ → 1★).
 */

import { Rating } from '@/components/ui';
import { formatCalificacion } from '@/utils/formatters';
import type { ResenaStats as ResenaStatsType } from '@/types/resena';
import styles from './ResenaStats.module.css';

/* ── Types ─────────────────────────────────────────────────────────────── */

export interface ResenaStatsProps {
  stats: ResenaStatsType;
}

/* ── Component ────────────────────────────────────────────────────────── */

export default function ResenaStats({ stats }: ResenaStatsProps) {
  const maxCount = Math.max(
    ...Object.values(stats.distribucion),
    1, // avoid division by zero
  );

  return (
    <div className={styles.wrapper}>
      {/* Left — Average */}
      <div className={styles.summary}>
        <span className={styles.average}>
          {stats.total > 0 ? formatCalificacion(stats.promedio) : '–'}
        </span>
        <Rating value={stats.promedio} showCount={false} size="md" />
        <span className={styles.total}>
          {stats.total} {stats.total === 1 ? 'reseña' : 'reseñas'}
        </span>
      </div>

      {/* Right — Distribution bars */}
      <div className={styles.distribution}>
        {([5, 4, 3, 2, 1] as const).map((star) => {
          const count = stats.distribucion[star];
          const pct = stats.total > 0 ? (count / maxCount) * 100 : 0;

          return (
            <div key={star} className={styles.barRow}>
              <span className={styles.barLabel}>{star}★</span>
              <div className={styles.barTrack}>
                <div
                  className={styles.barFill}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={styles.barCount}>{count}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

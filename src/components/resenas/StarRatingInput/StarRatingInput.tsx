'use client';

/**
 * StarRatingInput — interactive star rating selector (1–5).
 *
 * Supports hover-preview, click-to-select, three size presets
 * and a descriptive text label.
 */

import { useState } from 'react';
import { cn } from '@/utils/classnames';
import styles from './StarRatingInput.module.css';

/* ── Types ─────────────────────────────────────────────────────────────── */

export interface StarRatingInputProps {
  value: number;
  onChange: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

/* ── Helpers ───────────────────────────────────────────────────────────── */

const LABELS: Record<number, string> = {
  1: 'Malo',
  2: 'Regular',
  3: 'Bueno',
  4: 'Muy bueno',
  5: 'Excelente',
};

const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

/* ── Component ────────────────────────────────────────────────────────── */

export default function StarRatingInput({
  value,
  onChange,
  size = 'md',
  disabled = false,
}: StarRatingInputProps) {
  const [hovered, setHovered] = useState<number>(0);

  const active = hovered || value;

  return (
    <div
      className={cn(styles.wrapper, styles[size], disabled && styles.disabled)}
      onMouseLeave={() => !disabled && setHovered(0)}
      role="radiogroup"
      aria-label="Calificación"
    >
      <div className={styles.stars}>
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className={cn(
              styles.star,
              star <= active && styles.filled,
              star <= hovered && styles.hoverFill,
            )}
            onMouseEnter={() => !disabled && setHovered(star)}
            onClick={() => !disabled && onChange(star)}
            disabled={disabled}
            aria-label={`${star} estrella${star > 1 ? 's' : ''}`}
            aria-checked={star === value}
            role="radio"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className={styles.starSvg}>
              <path d={STAR_PATH} />
            </svg>
          </button>
        ))}
      </div>

      {active > 0 && (
        <span className={styles.label}>{LABELS[active]}</span>
      )}
    </div>
  );
}

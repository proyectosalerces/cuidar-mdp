import { cn } from '@/utils/classnames';
import styles from './Rating.module.css';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type RatingSize = 'sm' | 'md' | 'lg';

export interface RatingProps {
  /** Rating value between 0 and 5 (supports half-stars via decimals) */
  value: number;
  /** Total number of reviews */
  count?: number;
  /** Show review count next to stars */
  showCount?: boolean;
  /** Size preset */
  size?: RatingSize;
  /** Additional CSS class */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Star SVG helpers                                                           */
/* -------------------------------------------------------------------------- */

const STAR_PATH =
  'M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z';

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d={STAR_PATH} />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function Rating({
  value,
  count,
  showCount = true,
  size = 'md',
  className,
}: RatingProps) {
  /* Clamp value between 0–5 */
  const clamped = Math.min(5, Math.max(0, value));
  const fullStars = Math.floor(clamped);
  const hasHalf = clamped - fullStars >= 0.25 && clamped - fullStars < 0.75;
  const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

  return (
    <div
      className={cn(styles.wrapper, styles[size], className)}
      role="img"
      aria-label={`${clamped.toFixed(1)} de 5 estrellas${count !== undefined ? `, ${count} reseñas` : ''}`}
    >
      <span className={styles.stars}>
        {/* Filled stars */}
        {Array.from({ length: fullStars }, (_, i) => (
          <StarIcon key={`f-${i}`} className={cn(styles.star, styles.starFilled)} />
        ))}

        {/* Half star */}
        {hasHalf && (
          <span className={cn(styles.star, styles.starHalf)}>
            <StarIcon />
            <span className={styles.halfOverlay}>
              <StarIcon />
            </span>
          </span>
        )}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }, (_, i) => (
          <StarIcon key={`e-${i}`} className={styles.star} />
        ))}
      </span>

      {showCount && count !== undefined && (
        <span className={styles.count}>({count})</span>
      )}
    </div>
  );
}

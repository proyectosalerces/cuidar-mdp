import { cn } from '@/utils/classnames';
import styles from './Skeleton.module.css';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type SkeletonVariant = 'text' | 'circle' | 'rectangle' | 'card';

export interface SkeletonProps {
  /** Shape variant */
  variant?: SkeletonVariant;
  /** Explicit width (CSS value, e.g. '100%' or '200px') */
  width?: string;
  /** Explicit height (CSS value) */
  height?: string;
  /** Additional CSS class */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function Skeleton({
  variant = 'text',
  width,
  height,
  className,
}: SkeletonProps) {
  return (
    <div
      className={cn(styles.skeleton, styles[variant], className)}
      style={{
        width: width ?? (variant === 'circle' ? '3rem' : '100%'),
        height:
          height ??
          (variant === 'circle' ? '3rem' : variant === 'card' ? undefined : '1rem'),
      }}
      aria-hidden="true"
      role="presentation"
    />
  );
}

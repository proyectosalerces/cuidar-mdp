import { type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '@/utils/classnames';
import styles from './Card.module.css';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type CardPadding = 'sm' | 'md' | 'lg';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  /** Card content */
  children: ReactNode;
  /** Additional CSS class */
  className?: string;
  /** Lift and shadow on hover */
  hoverable?: boolean;
  /** Show a subtle border */
  bordered?: boolean;
  /** Inner padding preset */
  padding?: CardPadding;
}

/* -------------------------------------------------------------------------- */
/*  Padding class map                                                          */
/* -------------------------------------------------------------------------- */

const paddingMap: Record<CardPadding, string> = {
  sm: styles.paddingSm,
  md: styles.paddingMd,
  lg: styles.paddingLg,
};

/* -------------------------------------------------------------------------- */
/*  Main Card                                                                  */
/* -------------------------------------------------------------------------- */

export default function Card({
  children,
  className,
  hoverable = false,
  bordered = true,
  padding = 'md',
  onClick,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        styles.card,
        paddingMap[padding],
        hoverable && styles.hoverable,
        bordered && styles.bordered,
        onClick && !hoverable && styles.clickable,
        className,
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      {...rest}
    >
      {children}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Compound sub-components                                                    */
/* -------------------------------------------------------------------------- */

export function CardHeader({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(styles.header, className)}>{children}</div>;
}

export function CardBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(styles.body, className)}>{children}</div>;
}

export function CardFooter({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn(styles.footer, className)}>{children}</div>;
}

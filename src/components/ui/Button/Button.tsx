'use client';

import { type ReactNode, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/utils/classnames';
import styles from './Button.module.css';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'whatsapp';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** If provided, renders an <a> tag instead of <button> */
  href?: string;
  /** Whether the button is in a loading state */
  loading?: boolean;
  /** Stretch to fill container width */
  fullWidth?: boolean;
  /** Icon element rendered before children */
  icon?: ReactNode;
  /** HTML button type attribute */
  type?: 'button' | 'submit' | 'reset';
  /** Additional CSS class */
  className?: string;
  children: ReactNode;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  loading = false,
  fullWidth = false,
  disabled = false,
  icon,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = cn(
    styles.button,
    styles[variant],
    styles[size],
    disabled && styles.disabled,
    fullWidth && styles.fullWidth,
    loading && styles.loading,
    className,
  );

  /* Shared inner content */
  const content = (
    <>
      {icon && <span className={styles.icon}>{icon}</span>}
      {children}
      {loading && (
        <span className={styles.spinner} aria-label="Cargando">
          <span className={styles.spinnerCircle} />
        </span>
      )}
    </>
  );

  /* Render as anchor if href is provided */
  if (href) {
    return (
      <a
        href={href}
        className={classes}
        aria-disabled={disabled || loading}
        tabIndex={disabled ? -1 : undefined}
        rel="noopener noreferrer"
        {...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {content}
    </button>
  );
}

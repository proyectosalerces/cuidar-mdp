'use client';

import { type InputHTMLAttributes, type ReactNode, useId } from 'react';
import { cn } from '@/utils/classnames';
import styles from './Input.module.css';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** Visible label text */
  label?: string;
  /** Error message shown below the input */
  error?: string;
  /** Helper / hint text shown below the input (hidden when error is present) */
  helperText?: string;
  /** Icon element rendered at the start of the input */
  icon?: ReactNode;
  /** Mark the field as required (visual asterisk) */
  required?: boolean;
  /** Additional CSS class for the outer wrapper */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function Input({
  label,
  error,
  helperText,
  icon,
  required = false,
  className,
  id: externalId,
  disabled,
  ...rest
}: InputProps) {
  const autoId = useId();
  const inputId = externalId ?? autoId;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText && !error ? `${inputId}-helper` : undefined;

  return (
    <div className={cn(styles.wrapper, className)}>
      {/* Label */}
      {label && (
        <label htmlFor={inputId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      {/* Input container */}
      <div className={styles.inputContainer}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <input
          id={inputId}
          className={cn(
            styles.input,
            icon && styles.hasIcon,
            error && styles.inputError,
          )}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={errorId ?? helperId}
          {...rest}
        />
      </div>

      {/* Error text */}
      {error && (
        <p id={errorId} className={styles.errorText} role="alert">
          {error}
        </p>
      )}

      {/* Helper text (only when no error) */}
      {!error && helperText && (
        <p id={helperId} className={styles.helperText}>
          {helperText}
        </p>
      )}
    </div>
  );
}

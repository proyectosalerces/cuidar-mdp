'use client';

import { type SelectHTMLAttributes, useId } from 'react';
import { cn } from '@/utils/classnames';
import styles from './Select.module.css';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

export interface SelectOption {
  /** Option value */
  value: string;
  /** Display label */
  label: string;
  /** Whether the option is disabled */
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
  /** Visible label text */
  label?: string;
  /** Array of options */
  options: SelectOption[];
  /** Placeholder text shown when no option is selected */
  placeholder?: string;
  /** Error message shown below the select */
  error?: string;
  /** Mark the field as required (visual asterisk) */
  required?: boolean;
  /** Additional CSS class for the outer wrapper */
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Chevron SVG                                                                */
/* -------------------------------------------------------------------------- */

function ChevronDown() {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function Select({
  label,
  options,
  placeholder = 'Seleccionar…',
  error,
  required = false,
  className,
  id: externalId,
  value,
  disabled,
  ...rest
}: SelectProps) {
  const autoId = useId();
  const selectId = externalId ?? autoId;
  const errorId = error ? `${selectId}-error` : undefined;

  return (
    <div className={cn(styles.wrapper, className)}>
      {/* Label */}
      {label && (
        <label htmlFor={selectId} className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      {/* Select container */}
      <div className={styles.selectContainer}>
        <select
          id={selectId}
          className={cn(
            styles.select,
            error && styles.selectError,
            !value && styles.placeholder,
          )}
          value={value}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={errorId}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} disabled={opt.disabled}>
              {opt.label}
            </option>
          ))}
        </select>

        {/* Custom chevron */}
        <span className={styles.chevron}>
          <ChevronDown />
        </span>
      </div>

      {/* Error text */}
      {error && (
        <p id={errorId} className={styles.errorText} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Lightweight utility to conditionally join CSS class names.
 * A minimal alternative to clsx / classnames.
 *
 * Usage:
 *   cn('btn', isActive && 'btn--active', size === 'lg' && 'btn--lg')
 *   // => "btn btn--active btn--lg" (falsy values are dropped)
 */

type ClassValue = string | undefined | null | false | 0 | 0n | boolean | number;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}

export default cn;

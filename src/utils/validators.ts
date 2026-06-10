/**
 * Validation utilities for form inputs
 */

/**
 * Check if a value is non-empty after trimming whitespace.
 */
export function isRequired(value: string | undefined | null): boolean {
  return value !== undefined && value !== null && value.trim().length > 0;
}

/**
 * Validate an email address format.
 */
export function isValidEmail(email: string): boolean {
  if (!isRequired(email)) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

/**
 * Validate an Argentine phone number.
 * Accepts formats:
 *   +54 9 223 XXX-XXXX
 *   (0223) XXX-XXXX
 *   223-XXX-XXXX
 *   223XXXXXXX
 * Minimum 7 digits (local), maximum 13 digits (international mobile).
 */
export function isValidPhone(phone: string): boolean {
  if (!isRequired(phone)) return false;
  const digits = phone.replace(/\D/g, '');
  return digits.length >= 7 && digits.length <= 13;
}

/**
 * Validate an Argentine DNI (Documento Nacional de Identidad).
 * Accepts 7 or 8 digit numbers, with or without dots.
 * Examples: 12345678, 12.345.678
 */
export function isValidDNI(dni: string): boolean {
  if (!isRequired(dni)) return false;
  const digits = dni.replace(/\./g, '');
  if (!/^\d+$/.test(digits)) return false;
  return digits.length >= 7 && digits.length <= 8;
}

/**
 * Validate a minimum length string.
 */
export function hasMinLength(value: string, minLength: number): boolean {
  return isRequired(value) && value.trim().length >= minLength;
}

/**
 * Validate a maximum length string.
 */
export function hasMaxLength(value: string, maxLength: number): boolean {
  return value.trim().length <= maxLength;
}

/**
 * Validate a number is within a range (inclusive).
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validate a URL format.
 */
export function isValidUrl(url: string): boolean {
  if (!isRequired(url)) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Return the first error message for a field, or undefined if valid.
 * Useful for composing multiple validations.
 */
export function validateField(
  value: string,
  rules: Array<{ check: (v: string) => boolean; message: string }>
): string | undefined {
  for (const rule of rules) {
    if (!rule.check(value)) {
      return rule.message;
    }
  }
  return undefined;
}

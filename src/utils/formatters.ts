/**
 * Formatting utilities for display values
 */

/**
 * Format a number as Argentine peso currency.
 * Example: 450000 -> "$450.000"
 */
export function formatPrecio(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a price range for display.
 * Example: (300000, 600000) -> "Desde $300.000 hasta $600.000"
 */
export function formatRangoPrecios(min?: number, max?: number): string {
  if (min && max) {
    return `Desde ${formatPrecio(min)} hasta ${formatPrecio(max)}`;
  }
  if (min) {
    return `Desde ${formatPrecio(min)}`;
  }
  if (max) {
    return `Hasta ${formatPrecio(max)}`;
  }
  return 'Consultar';
}

/**
 * Format a phone number for display.
 * Handles common Argentine formats: +54 9 223 XXX-XXXX, (0223) XXX-XXXX.
 * Returns the input unchanged if it doesn't match a known pattern.
 */
export function formatTelefono(phone: string): string {
  // Remove all non-digit characters
  const digits = phone.replace(/\D/g, '');

  // Argentine mobile: 54 9 223 XXX XXXX (13 digits)
  if (digits.length === 13 && digits.startsWith('549')) {
    const area = digits.slice(3, 6);
    const firstPart = digits.slice(6, 9);
    const secondPart = digits.slice(9);
    return `+54 9 ${area} ${firstPart}-${secondPart}`;
  }

  // Local with area code: 0223 XXX XXXX (11 digits)
  if (digits.length === 11 && digits.startsWith('0')) {
    const area = digits.slice(0, 4);
    const firstPart = digits.slice(4, 7);
    const secondPart = digits.slice(7);
    return `(${area}) ${firstPart}-${secondPart}`;
  }

  // Already formatted or unknown – return as-is
  return phone;
}

/**
 * Build a WhatsApp link from a phone number and optional message.
 */
export function buildWhatsAppLink(phone: string, message?: string): string {
  const digits = phone.replace(/\D/g, '');
  const base = `https://wa.me/${digits}`;
  if (message) {
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  return base;
}

/**
 * Format an ISO date string for display in Argentine locale.
 * Example: "2025-03-15" -> "15 de marzo de 2025"
 */
export function formatFecha(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('es-AR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Format a short date. Example: "2025-03-15" -> "15/03/2025"
 */
export function formatFechaCorta(isoDate: string): string {
  const date = new Date(isoDate);
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date);
}

/**
 * Truncate text to a maximum length, appending "…" if truncated.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Generate a URL-safe slug from a string.
 * Handles Spanish characters (ñ, accented vowels).
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9\s-]/g, '')    // Remove non-alphanumeric
    .replace(/\s+/g, '-')            // Spaces to hyphens
    .replace(/-+/g, '-')             // Collapse consecutive hyphens
    .replace(/^-|-$/g, '');          // Trim leading/trailing hyphens
}

/**
 * Capitalize the first letter of a string.
 */
export function capitalize(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Format a star rating for display. Example: 4.5 -> "4,5"
 */
export function formatCalificacion(rating: number): string {
  return rating.toLocaleString('es-AR', {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

/**
 * Format reading time. Example: 5 -> "5 min de lectura"
 */
export function formatTiempoLectura(minutes: number): string {
  return `${minutes} min de lectura`;
}

/**
 * Analytics service for event and page view tracking
 *
 * Uses Google Analytics (gtag.js) when available.
 * Falls back silently in environments where gtag is not loaded.
 */

/** Extend Window to include gtag */
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      params?: Record<string, unknown>
    ) => void;
  }
}

/**
 * Track a custom event
 * @param eventName - The event name (e.g., 'clic_contacto', 'ver_residencia')
 * @param params - Optional event parameters
 */
export function trackEvent(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', eventName, params);
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Event:', eventName, params ?? '');
  }
}

/**
 * Track a page view
 * @param url - The page URL path
 * @param title - Optional page title
 */
export function trackPageView(url: string, title?: string): void {
  if (typeof window === 'undefined') return;

  if (window.gtag) {
    window.gtag('event', 'page_view', {
      page_path: url,
      page_title: title,
    });
  }

  if (process.env.NODE_ENV === 'development') {
    console.log('[Analytics] Page view:', url, title ?? '');
  }
}

/**
 * Predefined event helpers for common user actions
 */
export const events = {
  contactFormSubmit: () =>
    trackEvent('formulario_contacto_enviado'),

  consultaFormSubmit: () =>
    trackEvent('solicitud_consulta_enviada'),

  residenciaView: (slug: string) =>
    trackEvent('ver_residencia', { slug }),

  profesionalView: (slug: string) =>
    trackEvent('ver_profesional', { slug }),

  blogPostView: (slug: string) =>
    trackEvent('ver_articulo', { slug }),

  newsletterSubscribe: () =>
    trackEvent('suscripcion_newsletter'),

  searchQuery: (query: string) =>
    trackEvent('busqueda', { query }),

  whatsappClick: (source: string) =>
    trackEvent('clic_whatsapp', { source }),

  phoneClick: (source: string) =>
    trackEvent('clic_telefono', { source }),
} as const;

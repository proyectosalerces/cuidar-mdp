'use client';

/**
 * NewsletterForm — formulario funcional de suscripción al newsletter.
 *
 * Incluye validación de email, estados de carga / éxito / error,
 * y auto-reset tras 5 segundos.
 */

import { useState, useRef, useCallback, type FormEvent } from 'react';
import { suscribirNewsletter } from '@/services/newsletter.service';
import styles from './NewsletterForm.module.css';

type FormStatus = 'idle' | 'loading' | 'success' | 'error';

export default function NewsletterForm() {
  const [status, setStatus] = useState<FormStatus>('idle');
  const [message, setMessage] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const resetForm = useCallback(() => {
    setStatus('idle');
    setMessage('');
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const email = inputRef.current?.value.trim() ?? '';

      /* Client-side validation */
      if (!email) {
        setStatus('error');
        setMessage('Por favor, ingresá tu email.');
        return;
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setStatus('error');
        setMessage('Por favor, ingresá un email válido.');
        return;
      }

      /* Clear any pending reset */
      if (resetTimer.current) clearTimeout(resetTimer.current);

      setStatus('loading');
      setMessage('');

      try {
        const result = await suscribirNewsletter(email);

        if (result.success) {
          setStatus('success');
          setMessage('¡Gracias por suscribirte!');
          if (inputRef.current) inputRef.current.value = '';

          /* Auto-reset after 5 s */
          resetTimer.current = setTimeout(resetForm, 5000);
        } else {
          setStatus('error');
          setMessage(result.message);
        }
      } catch {
        setStatus('error');
        setMessage('Ocurrió un error. Intentá de nuevo más tarde.');
      }
    },
    [resetForm],
  );

  const isLoading = status === 'loading';

  return (
    <div>
      <form
        className={styles.form}
        onSubmit={handleSubmit}
        aria-label="Suscripción al newsletter"
      >
        <p className={styles.label}>
          Recibí consejos y novedades en tu email
        </p>

        <div className={styles.inputGroup}>
          <input
            ref={inputRef}
            type="email"
            className={styles.input}
            placeholder="tu@email.com"
            aria-label="Dirección de email"
            required
            disabled={isLoading}
          />
          <button
            type="submit"
            className={styles.button}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className={styles.spinner} aria-hidden="true" />
            ) : (
              'Suscribir'
            )}
          </button>
        </div>
      </form>

      {/* Feedback */}
      {status === 'success' && (
        <div className={`${styles.feedback} ${styles.success}`} role="status">
          <svg
            className={styles.checkIcon}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {message}
        </div>
      )}

      {status === 'error' && (
        <div className={`${styles.feedback} ${styles.error}`} role="alert">
          {message}
        </div>
      )}
    </div>
  );
}

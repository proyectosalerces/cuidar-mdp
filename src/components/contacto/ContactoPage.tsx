'use client';

import { useState, useCallback, type FormEvent, type ChangeEvent } from 'react';
import { cn } from '@/utils/classnames';
import { isRequired, isValidEmail, isValidPhone, hasMinLength, validateField } from '@/utils/validators';
import { CONTACT_EMAIL, CONTACT_PHONE, WHATSAPP_NUMBER } from '@/utils/constants';
import { buildWhatsAppLink, formatTelefono } from '@/utils/formatters';
import { enviarContacto } from '@/services/contacto.service';
import { Button, Input } from '@/components/ui';
import type { ContactoFormData } from '@/types/contacto';
import styles from './ContactoPage.module.css';

/* ── SVG Icons ─────────────────────────────────────────────────────────────── */

function PhoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function WhatsAppSmallIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function CheckIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function MapLargeIcon() {
  return (
    <svg className={styles.mapIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="22" y1="2" x2="11" y2="13" />
      <polygon points="22 2 15 22 11 13 2 9 22 2" />
    </svg>
  );
}

/* ── Types ──────────────────────────────────────────────────────────────────── */

interface FormErrors {
  [key: string]: string | undefined;
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function ContactoPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<ContactoFormData>({
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
    asunto: '',
    aceptaPoliticaPrivacidad: false,
  });

  /* ── Helpers ──────────────────────────────────────────────────────────────── */

  const updateField = useCallback(
    <K extends keyof ContactoFormData>(field: K, value: ContactoFormData[K]) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      setErrors((prev) => {
        if (prev[field as string]) {
          const next = { ...prev };
          delete next[field as string];
          return next;
        }
        return prev;
      });
    },
    []
  );

  const handleInputChange = useCallback(
    (field: keyof ContactoFormData) =>
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        updateField(field, e.target.value as ContactoFormData[typeof field]);
      },
    [updateField]
  );

  /* ── Validation ──────────────────────────────────────────────────────────── */

  const validate = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    const nameErr = validateField(formData.nombre, [
      { check: isRequired, message: 'El nombre es obligatorio' },
    ]);
    if (nameErr) newErrors.nombre = nameErr;

    const emailErr = validateField(formData.email, [
      { check: isRequired, message: 'El email es obligatorio' },
      { check: isValidEmail, message: 'Ingresá un email válido' },
    ]);
    if (emailErr) newErrors.email = emailErr;

    if (formData.telefono && !isValidPhone(formData.telefono)) {
      newErrors.telefono = 'Ingresá un teléfono válido';
    }

    const msgErr = validateField(formData.mensaje, [
      { check: isRequired, message: 'El mensaje es obligatorio' },
      { check: (v) => hasMinLength(v, 20), message: 'El mensaje debe tener al menos 20 caracteres' },
    ]);
    if (msgErr) newErrors.mensaje = msgErr;

    if (!formData.aceptaPoliticaPrivacidad) {
      newErrors.aceptaPoliticaPrivacidad = 'Debés aceptar la política de privacidad';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  /* ── Submit ──────────────────────────────────────────────────────────────── */

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      setGeneralError(null);
      if (!validate()) return;

      setIsSubmitting(true);
      try {
        await enviarContacto(formData);
        setIsSuccess(true);
      } catch (err) {
        console.error('Error al enviar:', err);
        setGeneralError('Hubo un error al enviar el mensaje. Por favor intentá de nuevo.');
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validate]
  );

  const handleReset = useCallback(() => {
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      mensaje: '',
      asunto: '',
      aceptaPoliticaPrivacidad: false,
    });
    setErrors({});
    setIsSuccess(false);
    setGeneralError(null);
  }, []);

  /* ── Render ──────────────────────────────────────────────────────────────── */

  return (
    <>
      {/* Hero */}
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>¿Tenés alguna consulta?</h1>
        <p className={styles.heroSubtitle}>
          Estamos para ayudarte. Escribinos o llamanos, te respondemos a la brevedad.
        </p>
      </section>

      {/* Main Content */}
      <div className={styles.contentWrapper}>
        <div className={styles.twoColumnLayout}>
          {/* ── Left Column: Contact Form ── */}
          <div className={styles.formCard}>
            {isSuccess ? (
              <div className={styles.formSuccess}>
                <div className={styles.successIcon}>
                  <CheckIcon size={28} />
                </div>
                <h2 className={styles.successTitle}>¡Mensaje enviado!</h2>
                <p className={styles.successMessage}>
                  Recibimos tu consulta. Te responderemos a la brevedad.
                </p>
                <Button variant="outline" onClick={handleReset}>
                  Enviar otra consulta
                </Button>
              </div>
            ) : (
              <>
                <h2 className={styles.formTitle}>Envianos un mensaje</h2>
                <p className={styles.formSubtitle}>
                  Completá el formulario y te respondemos dentro de las 24 horas.
                </p>

                {generalError && (
                  <div className={styles.formError} role="alert">
                    {generalError}
                  </div>
                )}

                <form onSubmit={handleSubmit} noValidate>
                  <div className={styles.formFields}>
                    <Input
                      id="contacto-nombre"
                      label="Nombre completo"
                      required
                      value={formData.nombre}
                      onChange={handleInputChange('nombre')}
                      error={errors.nombre}
                      placeholder="Ej: María García"
                    />

                    <Input
                      id="contacto-email"
                      label="Email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      error={errors.email}
                      placeholder="Ej: maria@email.com"
                    />

                    <Input
                      id="contacto-telefono"
                      label="Teléfono"
                      type="tel"
                      value={formData.telefono}
                      onChange={handleInputChange('telefono')}
                      error={errors.telefono}
                      placeholder="Ej: +54 9 223 555-0000"
                      helperText="Opcional"
                    />

                    <Input
                      id="contacto-asunto"
                      label="Asunto"
                      value={formData.asunto ?? ''}
                      onChange={handleInputChange('asunto')}
                      placeholder="¿Sobre qué querés consultarnos?"
                      helperText="Opcional"
                    />

                    <div className={styles.textareaField}>
                      <label htmlFor="contacto-mensaje" className={styles.fieldLabel}>
                        Mensaje<span className={styles.fieldLabelRequired}>*</span>
                      </label>
                      <textarea
                        id="contacto-mensaje"
                        className={cn(
                          styles.textarea,
                          errors.mensaje && styles.textareaError
                        )}
                        value={formData.mensaje}
                        onChange={handleInputChange('mensaje')}
                        placeholder="Contanos en qué podemos ayudarte…"
                        rows={5}
                        aria-invalid={!!errors.mensaje}
                      />
                      {errors.mensaje ? (
                        <p className={styles.fieldError} role="alert">{errors.mensaje}</p>
                      ) : (
                        <p className={styles.fieldHelper}>Mínimo 20 caracteres</p>
                      )}
                    </div>

                    {/* Privacy */}
                    <div
                      className={cn(
                        styles.singleCheckbox,
                        errors.aceptaPoliticaPrivacidad && styles.singleCheckboxError
                      )}
                    >
                      <input
                        id="contacto-privacidad"
                        type="checkbox"
                        className={styles.checkboxInput}
                        checked={formData.aceptaPoliticaPrivacidad}
                        onChange={(e) => updateField('aceptaPoliticaPrivacidad', e.target.checked)}
                      />
                      <label htmlFor="contacto-privacidad" className={styles.checkboxLabel}>
                        Acepto la{' '}
                        <a href="/politica-de-privacidad" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                          política de privacidad
                        </a>
                      </label>
                    </div>
                    {errors.aceptaPoliticaPrivacidad && (
                      <p className={styles.fieldError} role="alert">
                        {errors.aceptaPoliticaPrivacidad}
                      </p>
                    )}

                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      fullWidth
                      loading={isSubmitting}
                      disabled={isSubmitting}
                      icon={<SendIcon />}
                    >
                      Enviar mensaje
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* ── Right Column: Contact Info Cards ── */}
          <div className={styles.infoColumn}>
            {/* Phone + WhatsApp */}
            <div className={styles.infoCard}>
              <div className={cn(styles.infoIconWrapper, styles.infoIconPhone)}>
                <PhoneIcon />
              </div>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Teléfono y WhatsApp</h3>
                <p className={styles.infoText}>
                  Llamanos o escribinos por WhatsApp para una respuesta inmediata.
                </p>
                <div className={styles.infoLinkGroup}>
                  <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className={styles.infoLink}>
                    📞 {formatTelefono(CONTACT_PHONE)}
                  </a>
                  <a
                    href={buildWhatsAppLink(WHATSAPP_NUMBER, 'Hola, quisiera más información sobre sus servicios.')}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cn(styles.infoLink, styles.infoLinkWhatsApp)}
                  >
                    <WhatsAppSmallIcon /> Chatear por WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className={styles.infoCard}>
              <div className={cn(styles.infoIconWrapper, styles.infoIconEmail)}>
                <EmailIcon />
              </div>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Email</h3>
                <p className={styles.infoText}>
                  Envianos un correo y te respondemos dentro de las 24 horas hábiles.
                </p>
                <a href={`mailto:${CONTACT_EMAIL}`} className={styles.infoLink}>
                  ✉️ {CONTACT_EMAIL}
                </a>
              </div>
            </div>

            {/* Location */}
            <div className={styles.infoCard}>
              <div className={cn(styles.infoIconWrapper, styles.infoIconLocation)}>
                <MapPinIcon />
              </div>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Ubicación</h3>
                <p className={styles.infoText}>
                  Mar del Plata, Buenos Aires, Argentina.
                  <br />
                  Atención en toda la ciudad y alrededores.
                </p>
              </div>
            </div>

            {/* Office Hours */}
            <div className={styles.infoCard}>
              <div className={cn(styles.infoIconWrapper, styles.infoIconClock)}>
                <ClockIcon />
              </div>
              <div className={styles.infoContent}>
                <h3 className={styles.infoTitle}>Horario de atención</h3>
                <p className={styles.infoText}>
                  Lunes a Viernes, 9:00 a 18:00
                  <br />
                  <span style={{ fontSize: 'var(--font-xs)', color: 'var(--color-text-muted)' }}>
                    WhatsApp disponible las 24 horas
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Map Placeholder */}
        <div className={styles.mapSection}>
          <div className={styles.mapPlaceholder}>
            <MapLargeIcon />
            <span className={styles.mapText}>Mapa próximamente</span>
          </div>
        </div>
      </div>
    </>
  );
}

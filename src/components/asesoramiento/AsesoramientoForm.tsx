'use client';

import { useState, useCallback, type FormEvent, type ChangeEvent } from 'react';
import { cn } from '@/utils/classnames';
import { isRequired, isValidEmail, isValidPhone, validateField } from '@/utils/validators';
import { BARRIOS_MDP, TIPOS_CUIDADO_OPTIONS, WHATSAPP_NUMBER } from '@/utils/constants';
import { buildWhatsAppLink } from '@/utils/formatters';
import { solicitarAsesoramiento } from '@/services/contacto.service';
import { Button, Input, Select } from '@/components/ui';
import type { SolicitudConsultaFormData, Parentesco, Urgencia } from '@/types/contacto';
import styles from './AsesoramientoForm.module.css';

/* ── Constants ─────────────────────────────────────────────────────────────── */

const STEPS = [
  { number: 1, label: 'Tus datos' },
  { number: 2, label: 'Adulto mayor' },
  { number: 3, label: 'Preferencias' },
  { number: 4, label: 'Confirmación' },
] as const;

const PARENTESCO_OPTIONS = [
  { value: 'hijo-a', label: 'Hijo/a' },
  { value: 'nieto-a', label: 'Nieto/a' },
  { value: 'sobrino-a', label: 'Sobrino/a' },
  { value: 'conyuge', label: 'Cónyuge' },
  { value: 'hermano-a', label: 'Hermano/a' },
  { value: 'otro', label: 'Otro' },
];

const NECESIDADES_CUIDADO = [
  'Asistencia en actividades diarias',
  'Atención médica continua',
  'Rehabilitación',
  'Contención emocional',
  'Cuidados paliativos',
  'Acompañamiento nocturno',
];

const PRESUPUESTO_OPTIONS = [
  { value: 'hasta-400000', label: 'Hasta $400.000' },
  { value: '400000-600000', label: '$400.000 – $600.000' },
  { value: '600000-800000', label: '$600.000 – $800.000' },
  { value: '800000-1200000', label: '$800.000 – $1.200.000' },
  { value: 'mas-1200000', label: 'Más de $1.200.000' },
  { value: 'sin-definir', label: 'No tengo un presupuesto definido' },
];

const URGENCIA_OPTIONS = [
  { value: 'inmediata', label: 'Inmediata' },
  { value: 'proximas-semanas', label: 'Próximas semanas' },
  { value: 'proximo-mes', label: 'Próximo mes' },
  { value: 'explorando-opciones', label: 'Solo estoy explorando opciones' },
];

const PARENTESCO_LABEL: Record<string, string> = Object.fromEntries(
  PARENTESCO_OPTIONS.map((o) => [o.value, o.label])
);

const URGENCIA_LABEL: Record<string, string> = Object.fromEntries(
  URGENCIA_OPTIONS.map((o) => [o.value, o.label])
);

const PRESUPUESTO_LABEL: Record<string, string> = Object.fromEntries(
  PRESUPUESTO_OPTIONS.map((o) => [o.value, o.label])
);

const BARRIO_LABEL: Record<string, string> = Object.fromEntries(
  BARRIOS_MDP.map((o) => [o.value, o.label])
);

const TIPO_CUIDADO_LABEL: Record<string, string> = Object.fromEntries(
  TIPOS_CUIDADO_OPTIONS.map((o) => [o.value, o.label])
);

/* ── SVG Icons ─────────────────────────────────────────────────────────────── */

function CheckIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
  );
}

function ArrowRightIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

/* ── Types ──────────────────────────────────────────────────────────────────── */

interface FormErrors {
  [key: string]: string | undefined;
}

/* ── Component ─────────────────────────────────────────────────────────────── */

export default function AsesoramientoForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState<SolicitudConsultaFormData>({
    nombreFamiliar: '',
    emailFamiliar: '',
    telefonoFamiliar: '',
    parentesco: '' as Parentesco,
    nombreAdultoMayor: '',
    edadAdultoMayor: 0,
    situacionActual: '',
    necesidadesCuidado: [],
    movilidadReducida: false,
    deterioroCognitivo: false,
    barrioPreferido: '',
    presupuestoEstimado: '',
    tiposCuidadoBuscados: [],
    urgencia: '' as Urgencia,
    obraSocial: '',
    comentariosAdicionales: '',
    aceptaPoliticaPrivacidad: false,
  });

  /* ── Helpers ──────────────────────────────────────────────────────────────── */

  const updateField = useCallback(
    <K extends keyof SolicitudConsultaFormData>(
      field: K,
      value: SolicitudConsultaFormData[K]
    ) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      // Clear error for the field
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
    (field: keyof SolicitudConsultaFormData) =>
      (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const value =
          e.target.type === 'number'
            ? Number(e.target.value)
            : e.target.value;
        updateField(field, value as SolicitudConsultaFormData[typeof field]);
      },
    [updateField]
  );

  const handleCheckboxChange = useCallback(
    (field: keyof SolicitudConsultaFormData) =>
      (e: ChangeEvent<HTMLInputElement>) => {
        updateField(field, e.target.checked as SolicitudConsultaFormData[typeof field]);
      },
    [updateField]
  );

  const toggleArrayItem = useCallback(
    (field: 'necesidadesCuidado' | 'tiposCuidadoBuscados', item: string) => {
      setFormData((prev) => {
        const current = prev[field] as string[];
        const next = current.includes(item)
          ? current.filter((i) => i !== item)
          : [...current, item];
        return { ...prev, [field]: next };
      });
    },
    []
  );

  /* ── Validation per step ─────────────────────────────────────────────────── */

  const validateStep = useCallback(
    (step: number): boolean => {
      const newErrors: FormErrors = {};

      if (step === 1) {
        const nameErr = validateField(formData.nombreFamiliar, [
          { check: isRequired, message: 'El nombre es obligatorio' },
        ]);
        if (nameErr) newErrors.nombreFamiliar = nameErr;

        const emailErr = validateField(formData.emailFamiliar, [
          { check: isRequired, message: 'El email es obligatorio' },
          { check: isValidEmail, message: 'Ingresá un email válido' },
        ]);
        if (emailErr) newErrors.emailFamiliar = emailErr;

        const phoneErr = validateField(formData.telefonoFamiliar, [
          { check: isRequired, message: 'El teléfono es obligatorio' },
          { check: isValidPhone, message: 'Ingresá un teléfono válido' },
        ]);
        if (phoneErr) newErrors.telefonoFamiliar = phoneErr;

        if (!formData.parentesco) {
          newErrors.parentesco = 'Seleccioná tu parentesco';
        }
      }

      if (step === 2) {
        const nameErr = validateField(formData.nombreAdultoMayor, [
          { check: isRequired, message: 'El nombre es obligatorio' },
        ]);
        if (nameErr) newErrors.nombreAdultoMayor = nameErr;

        if (!formData.edadAdultoMayor || formData.edadAdultoMayor < 1) {
          newErrors.edadAdultoMayor = 'Ingresá la edad';
        } else if (formData.edadAdultoMayor > 120) {
          newErrors.edadAdultoMayor = 'Ingresá una edad válida';
        }
      }

      if (step === 4) {
        if (!formData.aceptaPoliticaPrivacidad) {
          newErrors.aceptaPoliticaPrivacidad = 'Debés aceptar la política de privacidad';
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    },
    [formData]
  );

  /* ── Navigation ──────────────────────────────────────────────────────────── */

  const goToStep = useCallback(
    (step: number) => {
      setDirection(step > currentStep ? 'forward' : 'back');
      setCurrentStep(step);
    },
    [currentStep]
  );

  const handleNext = useCallback(() => {
    if (validateStep(currentStep)) {
      setDirection('forward');
      setCurrentStep((s) => Math.min(s + 1, 4));
    }
  }, [currentStep, validateStep]);

  const handleBack = useCallback(() => {
    setDirection('back');
    setCurrentStep((s) => Math.max(s - 1, 1));
  }, []);

  const handleSubmit = useCallback(
    async (e: FormEvent) => {
      e.preventDefault();
      if (!validateStep(4)) return;

      setIsSubmitting(true);
      try {
        await solicitarAsesoramiento(formData);
        setIsSuccess(true);
      } catch (err) {
        console.error('Error al enviar:', err);
        setErrors({ general: 'Hubo un error al enviar. Por favor intentá de nuevo.' });
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, validateStep]
  );

  const progressPercent = isSuccess ? 100 : Math.round(((currentStep - 1) / 3) * 100);

  /* ── Success State ───────────────────────────────────────────────────────── */

  if (isSuccess) {
    return (
      <>
        <section className={styles.heroSection}>
          <h1 className={styles.heroTitle}>Asesoramiento personalizado</h1>
          <p className={styles.heroSubtitle}>
            Te acompañamos a encontrar la mejor opción de cuidado para tu ser querido
          </p>
        </section>

        <div className={styles.formContainer}>
          <div className={cn(styles.formCard, styles.successCard)}>
            <div className={styles.successIcon}>
              <CheckIcon size={36} />
            </div>
            <h2 className={styles.successTitle}>
              ¡Tu solicitud fue enviada con éxito!
            </h2>
            <p className={styles.successMessage}>
              Nos pondremos en contacto dentro de las próximas 24 horas para
              coordinar tu asesoramiento personalizado.
            </p>
            <div className={styles.successActions}>
              <Button
                variant="whatsapp"
                size="lg"
                href={buildWhatsAppLink(WHATSAPP_NUMBER, 'Hola, acabo de enviar una solicitud de asesoramiento y quería hacer una consulta.')}
                icon={<WhatsAppIcon />}
              >
                Contacto inmediato por WhatsApp
              </Button>
              <Button variant="outline" href="/" icon={<HomeIcon />}>
                Volver al inicio
              </Button>
            </div>
          </div>
        </div>
      </>
    );
  }

  /* ── Render Form ─────────────────────────────────────────────────────────── */

  return (
    <>
      <section className={styles.heroSection}>
        <h1 className={styles.heroTitle}>Asesoramiento personalizado</h1>
        <p className={styles.heroSubtitle}>
          Completá el formulario y recibí una recomendación a medida para el cuidado de tu ser querido
        </p>
      </section>

      <div className={styles.formContainer}>
        {/* Step Indicator */}
        <div className={styles.stepIndicator} role="list" aria-label="Pasos del formulario">
          {STEPS.map((step, idx) => {
            const isActive = currentStep === step.number;
            const isCompleted = currentStep > step.number;
            return (
              <div key={step.number} className={styles.stepItem} role="listitem">
                <div
                  className={cn(
                    styles.stepCircle,
                    isActive && styles.stepCircleActive,
                    isCompleted && styles.stepCircleCompleted
                  )}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? <CheckIcon size={18} /> : step.number}
                </div>
                <span
                  className={cn(
                    styles.stepLabel,
                    isActive && styles.stepLabelActive,
                    isCompleted && styles.stepLabelCompleted
                  )}
                >
                  {step.label}
                </span>
                {/* Connector line (not on last step) */}
                {idx < STEPS.length - 1 && (
                  <div
                    className={cn(
                      styles.stepConnector,
                      isCompleted && styles.stepConnectorActive
                    )}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar */}
        <div className={styles.progressBarWrapper}>
          <div className={styles.progressBarTrack}>
            <div
              className={styles.progressBarFill}
              style={{ width: `${progressPercent}%` }}
              role="progressbar"
              aria-valuenow={progressPercent}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <div className={styles.progressLabel}>
            {progressPercent}% completado
          </div>
        </div>

        {/* Form Card */}
        <form onSubmit={handleSubmit} noValidate>
          <div className={styles.formCard}>
            {errors.general && (
              <p role="alert" style={{ color: 'var(--color-error)', fontSize: 'var(--font-sm)', marginBottom: 'var(--space-4)' }}>
                {errors.general}
              </p>
            )}

            <div className={styles.stepAnimator}>
              <div
                key={currentStep}
                className={direction === 'forward' ? styles.stepContent : styles.stepContentBack}
              >
                {/* ── Step 1: Tus datos ── */}
                {currentStep === 1 && (
                  <>
                    <h2 className={styles.stepTitle}>Tus datos</h2>
                    <p className={styles.stepDescription}>
                      Contanos quién sos para poder contactarte con la mejor recomendación.
                    </p>
                    <div className={styles.fieldsGrid}>
                      <Input
                        id="nombreFamiliar"
                        label="Nombre completo"
                        required
                        value={formData.nombreFamiliar}
                        onChange={handleInputChange('nombreFamiliar')}
                        error={errors.nombreFamiliar}
                        placeholder="Ej: María García"
                      />
                      <Input
                        id="emailFamiliar"
                        label="Email"
                        type="email"
                        required
                        value={formData.emailFamiliar}
                        onChange={handleInputChange('emailFamiliar')}
                        error={errors.emailFamiliar}
                        placeholder="Ej: maria@email.com"
                      />
                      <Input
                        id="telefonoFamiliar"
                        label="Teléfono"
                        type="tel"
                        required
                        value={formData.telefonoFamiliar}
                        onChange={handleInputChange('telefonoFamiliar')}
                        error={errors.telefonoFamiliar}
                        placeholder="Ej: +54 9 223 555-0000"
                      />
                      <Select
                        id="parentesco"
                        label="Parentesco con el adulto mayor"
                        required
                        options={PARENTESCO_OPTIONS}
                        value={formData.parentesco}
                        onChange={handleInputChange('parentesco')}
                        error={errors.parentesco}
                        placeholder="Seleccionar parentesco…"
                      />
                    </div>
                  </>
                )}

                {/* ── Step 2: Sobre el adulto mayor ── */}
                {currentStep === 2 && (
                  <>
                    <h2 className={styles.stepTitle}>Sobre el adulto mayor</h2>
                    <p className={styles.stepDescription}>
                      Compartí información sobre la persona que necesita cuidado para recomendarte las mejores opciones.
                    </p>
                    <div className={styles.fieldsGrid}>
                      <div className={cn(styles.fieldRow, styles.fieldRowTwoCols)}>
                        <Input
                          id="nombreAdultoMayor"
                          label="Nombre"
                          required
                          value={formData.nombreAdultoMayor}
                          onChange={handleInputChange('nombreAdultoMayor')}
                          error={errors.nombreAdultoMayor}
                          placeholder="Ej: Juan Pérez"
                        />
                        <Input
                          id="edadAdultoMayor"
                          label="Edad"
                          type="number"
                          required
                          min={1}
                          max={120}
                          value={formData.edadAdultoMayor || ''}
                          onChange={handleInputChange('edadAdultoMayor')}
                          error={errors.edadAdultoMayor}
                          placeholder="Ej: 82"
                        />
                      </div>

                      <div className={styles.textareaField}>
                        <label htmlFor="situacionActual" className={styles.fieldLabel}>
                          Situación actual
                        </label>
                        <textarea
                          id="situacionActual"
                          className={styles.textarea}
                          value={formData.situacionActual}
                          onChange={handleInputChange('situacionActual')}
                          placeholder="Describí brevemente la situación actual del adulto mayor…"
                          rows={4}
                        />
                      </div>

                      <div className={cn(styles.fieldRow, styles.fieldRowTwoCols)}>
                        <label className={styles.checkboxItem}>
                          <input
                            type="checkbox"
                            className={styles.checkboxInput}
                            checked={formData.movilidadReducida}
                            onChange={handleCheckboxChange('movilidadReducida')}
                          />
                          <span className={styles.checkboxLabel}>Movilidad reducida</span>
                        </label>
                        <label className={styles.checkboxItem}>
                          <input
                            type="checkbox"
                            className={styles.checkboxInput}
                            checked={formData.deterioroCognitivo}
                            onChange={handleCheckboxChange('deterioroCognitivo')}
                          />
                          <span className={styles.checkboxLabel}>Deterioro cognitivo</span>
                        </label>
                      </div>

                      <div className={styles.checkboxGroup}>
                        <span className={styles.checkboxGroupLabel}>
                          Necesidades de cuidado
                        </span>
                        <div className={styles.checkboxList}>
                          {NECESIDADES_CUIDADO.map((need) => (
                            <label
                              key={need}
                              className={cn(
                                styles.checkboxItem,
                                formData.necesidadesCuidado.includes(need) && styles.checkboxItemChecked
                              )}
                            >
                              <input
                                type="checkbox"
                                className={styles.checkboxInput}
                                checked={formData.necesidadesCuidado.includes(need)}
                                onChange={() => toggleArrayItem('necesidadesCuidado', need)}
                              />
                              <span className={styles.checkboxLabel}>{need}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* ── Step 3: Preferencias ── */}
                {currentStep === 3 && (
                  <>
                    <h2 className={styles.stepTitle}>Preferencias</h2>
                    <p className={styles.stepDescription}>
                      Indicanos tus preferencias para ajustar la recomendación.
                    </p>
                    <div className={styles.fieldsGrid}>
                      <Select
                        id="barrioPreferido"
                        label="Barrio preferido"
                        options={BARRIOS_MDP}
                        value={formData.barrioPreferido ?? ''}
                        onChange={handleInputChange('barrioPreferido')}
                        placeholder="Seleccionar barrio (opcional)…"
                      />

                      <div className={styles.checkboxGroup}>
                        <span className={styles.checkboxGroupLabel}>
                          Tipo de cuidado buscado
                        </span>
                        <div className={styles.checkboxList}>
                          {TIPOS_CUIDADO_OPTIONS.map((opt) => (
                            <label
                              key={opt.value}
                              className={cn(
                                styles.checkboxItem,
                                formData.tiposCuidadoBuscados.includes(opt.value) && styles.checkboxItemChecked
                              )}
                            >
                              <input
                                type="checkbox"
                                className={styles.checkboxInput}
                                checked={formData.tiposCuidadoBuscados.includes(opt.value)}
                                onChange={() => toggleArrayItem('tiposCuidadoBuscados', opt.value)}
                              />
                              <span className={styles.checkboxLabel}>{opt.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <Select
                        id="presupuestoEstimado"
                        label="Presupuesto estimado"
                        options={PRESUPUESTO_OPTIONS}
                        value={formData.presupuestoEstimado ?? ''}
                        onChange={handleInputChange('presupuestoEstimado')}
                        placeholder="Seleccionar rango…"
                      />

                      <Select
                        id="urgencia"
                        label="Urgencia"
                        options={URGENCIA_OPTIONS}
                        value={formData.urgencia}
                        onChange={handleInputChange('urgencia')}
                        placeholder="¿Cuándo necesitás el servicio?"
                      />

                      <Input
                        id="obraSocial"
                        label="Obra social / Prepaga"
                        value={formData.obraSocial ?? ''}
                        onChange={handleInputChange('obraSocial')}
                        placeholder="Ej: PAMI, OSDE, Swiss Medical…"
                      />

                      <div className={styles.textareaField}>
                        <label htmlFor="comentariosAdicionales" className={styles.fieldLabel}>
                          Comentarios adicionales
                        </label>
                        <textarea
                          id="comentariosAdicionales"
                          className={styles.textarea}
                          value={formData.comentariosAdicionales ?? ''}
                          onChange={handleInputChange('comentariosAdicionales')}
                          placeholder="¿Hay algo más que quieras contarnos?"
                          rows={3}
                        />
                      </div>
                    </div>
                  </>
                )}

                {/* ── Step 4: Confirmación ── */}
                {currentStep === 4 && (
                  <>
                    <h2 className={styles.stepTitle}>Confirmación</h2>
                    <p className={styles.stepDescription}>
                      Revisá que los datos sean correctos antes de enviar tu solicitud.
                    </p>

                    {/* Summary: Step 1 */}
                    <div className={styles.summarySection}>
                      <h3 className={styles.summarySectionTitle}>
                        Tus datos
                        <button
                          type="button"
                          className={styles.editStepButton}
                          onClick={() => goToStep(1)}
                          aria-label="Editar tus datos"
                        >
                          <EditIcon /> Editar
                        </button>
                      </h3>
                      <div className={styles.summaryGrid}>
                        <div className={styles.summaryRow}>
                          <span className={styles.summaryLabel}>Nombre</span>
                          <span className={styles.summaryValue}>{formData.nombreFamiliar}</span>
                        </div>
                        <div className={styles.summaryRow}>
                          <span className={styles.summaryLabel}>Email</span>
                          <span className={styles.summaryValue}>{formData.emailFamiliar}</span>
                        </div>
                        <div className={styles.summaryRow}>
                          <span className={styles.summaryLabel}>Teléfono</span>
                          <span className={styles.summaryValue}>{formData.telefonoFamiliar}</span>
                        </div>
                        <div className={styles.summaryRow}>
                          <span className={styles.summaryLabel}>Parentesco</span>
                          <span className={styles.summaryValue}>{PARENTESCO_LABEL[formData.parentesco] || '—'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Summary: Step 2 */}
                    <div className={styles.summarySection}>
                      <h3 className={styles.summarySectionTitle}>
                        Adulto mayor
                        <button
                          type="button"
                          className={styles.editStepButton}
                          onClick={() => goToStep(2)}
                          aria-label="Editar datos del adulto mayor"
                        >
                          <EditIcon /> Editar
                        </button>
                      </h3>
                      <div className={styles.summaryGrid}>
                        <div className={styles.summaryRow}>
                          <span className={styles.summaryLabel}>Nombre</span>
                          <span className={styles.summaryValue}>{formData.nombreAdultoMayor}</span>
                        </div>
                        <div className={styles.summaryRow}>
                          <span className={styles.summaryLabel}>Edad</span>
                          <span className={styles.summaryValue}>{formData.edadAdultoMayor} años</span>
                        </div>
                        {formData.situacionActual && (
                          <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Situación</span>
                            <span className={styles.summaryValue}>{formData.situacionActual}</span>
                          </div>
                        )}
                        <div className={styles.summaryRow}>
                          <span className={styles.summaryLabel}>Movilidad</span>
                          <span className={styles.summaryValue}>
                            {formData.movilidadReducida ? 'Reducida' : 'Normal'}
                          </span>
                        </div>
                        <div className={styles.summaryRow}>
                          <span className={styles.summaryLabel}>Cognitivo</span>
                          <span className={styles.summaryValue}>
                            {formData.deterioroCognitivo ? 'Con deterioro' : 'Sin deterioro'}
                          </span>
                        </div>
                        {formData.necesidadesCuidado.length > 0 && (
                          <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Necesidades</span>
                            <div className={styles.summaryTags}>
                              {formData.necesidadesCuidado.map((n) => (
                                <span key={n} className={styles.summaryTag}>{n}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Summary: Step 3 */}
                    <div className={styles.summarySection}>
                      <h3 className={styles.summarySectionTitle}>
                        Preferencias
                        <button
                          type="button"
                          className={styles.editStepButton}
                          onClick={() => goToStep(3)}
                          aria-label="Editar preferencias"
                        >
                          <EditIcon /> Editar
                        </button>
                      </h3>
                      <div className={styles.summaryGrid}>
                        {formData.barrioPreferido && (
                          <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Barrio</span>
                            <span className={styles.summaryValue}>
                              {BARRIO_LABEL[formData.barrioPreferido] || formData.barrioPreferido}
                            </span>
                          </div>
                        )}
                        {formData.tiposCuidadoBuscados.length > 0 && (
                          <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Tipo de cuidado</span>
                            <div className={styles.summaryTags}>
                              {formData.tiposCuidadoBuscados.map((t) => (
                                <span key={t} className={styles.summaryTag}>
                                  {TIPO_CUIDADO_LABEL[t] || t}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {formData.presupuestoEstimado && (
                          <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Presupuesto</span>
                            <span className={styles.summaryValue}>
                              {PRESUPUESTO_LABEL[formData.presupuestoEstimado] || formData.presupuestoEstimado}
                            </span>
                          </div>
                        )}
                        {formData.urgencia && (
                          <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Urgencia</span>
                            <span className={styles.summaryValue}>
                              {URGENCIA_LABEL[formData.urgencia] || formData.urgencia}
                            </span>
                          </div>
                        )}
                        {formData.obraSocial && (
                          <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Obra social</span>
                            <span className={styles.summaryValue}>{formData.obraSocial}</span>
                          </div>
                        )}
                        {formData.comentariosAdicionales && (
                          <div className={styles.summaryRow}>
                            <span className={styles.summaryLabel}>Comentarios</span>
                            <span className={styles.summaryValue}>{formData.comentariosAdicionales}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Privacy checkbox */}
                    <div
                      className={cn(
                        styles.singleCheckbox,
                        errors.aceptaPoliticaPrivacidad && styles.singleCheckboxError
                      )}
                    >
                      <input
                        id="aceptaPoliticaPrivacidad"
                        type="checkbox"
                        className={styles.checkboxInput}
                        checked={formData.aceptaPoliticaPrivacidad}
                        onChange={handleCheckboxChange('aceptaPoliticaPrivacidad')}
                      />
                      <label htmlFor="aceptaPoliticaPrivacidad" className={styles.singleCheckboxLabel}>
                        Acepto la{' '}
                        <a href="/politica-de-privacidad" style={{ color: 'var(--color-primary)', fontWeight: 600 }}>
                          política de privacidad
                        </a>{' '}
                        y autorizo el tratamiento de mis datos personales para recibir
                        asesoramiento.
                      </label>
                    </div>
                    {errors.aceptaPoliticaPrivacidad && (
                      <p className={styles.fieldError} role="alert">
                        {errors.aceptaPoliticaPrivacidad}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className={cn(styles.navButtons, currentStep === 1 && styles.navButtonsEnd)}>
              {currentStep > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  icon={<ArrowLeftIcon />}
                >
                  Anterior
                </Button>
              )}
              {currentStep < 4 ? (
                <Button
                  type="button"
                  variant="primary"
                  onClick={handleNext}
                  icon={<ArrowRightIcon />}
                >
                  Siguiente
                </Button>
              ) : (
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={isSubmitting}
                  disabled={isSubmitting}
                >
                  Enviar solicitud
                </Button>
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

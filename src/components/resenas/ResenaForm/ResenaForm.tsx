'use client';

/**
 * ResenaForm — form to create a new review.
 *
 * Handles auth check, duplicate check, validation,
 * loading/success states and admin-approval messaging.
 */

import { useState } from 'react';
import { cn } from '@/utils/classnames';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui';
import { isRequired, hasMinLength, hasMaxLength } from '@/utils/validators';
import StarRatingInput from '@/components/resenas/StarRatingInput/StarRatingInput';
import { getAspectos, promedioAspectos } from '@/types/resena';
import type { Resena, ResenaFormData, EntidadTipo } from '@/types/resena';
import styles from './ResenaForm.module.css';

/* ── Types ─────────────────────────────────────────────────────────────── */

export interface ResenaFormProps {
  onSubmit: (data: ResenaFormData) => Promise<Resena>;
  yaReseno: boolean;
  miResenaPendiente: Resena | null;
  onRequestAuth: () => void;
  entidadTipo: EntidadTipo;
}

/* ── Component ────────────────────────────────────────────────────────── */

export default function ResenaForm({
  onSubmit,
  yaReseno,
  miResenaPendiente,
  onRequestAuth,
  entidadTipo,
}: ResenaFormProps) {
  const { isAuthenticated } = useAuth();

  const aspectosDefs = getAspectos(entidadTipo);
  const [aspectos, setAspectos] = useState<Record<string, number>>({});
  const [general, setGeneral] = useState(0);
  const [titulo, setTitulo] = useState('');
  const [comentario, setComentario] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  /* ── Not authenticated ──────────────────────────────────────────────── */

  if (!isAuthenticated) {
    return (
      <div className={styles.authPrompt}>
        <svg className={styles.authIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
        <p className={styles.authText}>
          Iniciá sesión para dejar tu reseña
        </p>
        <Button variant="primary" onClick={onRequestAuth}>
          Iniciar sesión
        </Button>
      </div>
    );
  }

  /* ── Already reviewed ───────────────────────────────────────────────── */

  if (yaReseno) {
    return (
      <div className={styles.alreadyReviewed}>
        <svg className={styles.checkIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <p className={styles.alreadyText}>Ya dejaste una reseña</p>
        {miResenaPendiente && (
          <p className={styles.pendingNote}>
            Tu reseña está pendiente de aprobación. ¡Gracias por tu aporte!
          </p>
        )}
      </div>
    );
  }

  /* ── Success ────────────────────────────────────────────────────────── */

  if (success) {
    return (
      <div className={styles.successMessage}>
        <svg className={styles.successIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 11-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
        <p className={styles.successText}>
          ¡Tu reseña fue enviada y está pendiente de aprobación. ¡Gracias!
        </p>
      </div>
    );
  }

  /* ── Validation ─────────────────────────────────────────────────────── */

  function validate(): boolean {
    const newErrors: Record<string, string> = {};

    const prom = promedioAspectos(aspectos);
    const overall = prom > 0 ? prom : general;
    if (overall < 1) {
      newErrors.calificacion = 'Poné al menos una calificación (un aspecto o la nota general)';
    }
    if (!isRequired(titulo)) {
      newErrors.titulo = 'El título es obligatorio';
    } else if (!hasMaxLength(titulo, 100)) {
      newErrors.titulo = 'El título no puede superar los 100 caracteres';
    }
    if (!isRequired(comentario)) {
      newErrors.comentario = 'El comentario es obligatorio';
    } else if (!hasMinLength(comentario, 20)) {
      newErrors.comentario = 'El comentario debe tener al menos 20 caracteres';
    } else if (!hasMaxLength(comentario, 500)) {
      newErrors.comentario = 'El comentario no puede superar los 500 caracteres';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  /* ── Submit ─────────────────────────────────────────────────────────── */

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const rated = Object.fromEntries(
        Object.entries(aspectos).filter(([, v]) => v > 0),
      );
      const prom = promedioAspectos(aspectos);
      const overall = prom > 0 ? prom : general;
      await onSubmit({
        calificacion: overall,
        calificaciones: rated,
        titulo: titulo.trim(),
        comentario: comentario.trim(),
      });
      setSuccess(true);
    } catch (err) {
      setErrors({
        general: err instanceof Error ? err.message : 'Error al enviar la reseña',
      });
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Render ─────────────────────────────────────────────────────────── */

  const prom = promedioAspectos(aspectos);

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <h3 className={styles.formTitle}>Dejá tu experiencia</h3>

      {/* Rating by aspects */}
      <div className={styles.field}>
        <label className={styles.label}>Calificá cada aspecto</label>
        <p className={styles.aspectsHint}>
          Puntuá lo que puedas — la nota general se calcula sola con el promedio.
        </p>
        <div className={styles.aspectsList}>
          {aspectosDefs.map((a) => (
            <div key={a.key} className={styles.aspectRow}>
              <span className={styles.aspectLabel}>{a.label}</span>
              <StarRatingInput
                value={aspectos[a.key] ?? 0}
                onChange={(v) => setAspectos((prev) => ({ ...prev, [a.key]: v }))}
                size="sm"
              />
            </div>
          ))}
        </div>

        {prom > 0 ? (
          <p className={styles.overallPreview}>
            Nota general (promedio): <strong>{prom.toFixed(1)} ★</strong>
          </p>
        ) : (
          <div className={styles.generalFallback}>
            <span className={styles.aspectLabel}>O poné una nota general</span>
            <StarRatingInput value={general} onChange={setGeneral} size="md" />
          </div>
        )}

        {errors.calificacion && (
          <span className={styles.error}>{errors.calificacion}</span>
        )}
      </div>

      {/* Título */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="resena-titulo">
          Título
        </label>
        <input
          id="resena-titulo"
          type="text"
          className={cn(styles.input, errors.titulo && styles.inputError)}
          placeholder="Resumí tu experiencia en una frase"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          maxLength={100}
          disabled={submitting}
        />
        <div className={styles.fieldFooter}>
          {errors.titulo ? (
            <span className={styles.error}>{errors.titulo}</span>
          ) : (
            <span />
          )}
          <span className={cn(styles.charCount, titulo.length > 90 && styles.charCountWarn)}>
            {titulo.length}/100
          </span>
        </div>
      </div>

      {/* Comentario */}
      <div className={styles.field}>
        <label className={styles.label} htmlFor="resena-comentario">
          Tu comentario
        </label>
        <textarea
          id="resena-comentario"
          className={cn(styles.textarea, errors.comentario && styles.inputError)}
          placeholder="Contanos tu experiencia con al menos 20 caracteres…"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          maxLength={500}
          rows={4}
          disabled={submitting}
        />
        <div className={styles.fieldFooter}>
          {errors.comentario ? (
            <span className={styles.error}>{errors.comentario}</span>
          ) : (
            <span />
          )}
          <span
            className={cn(
              styles.charCount,
              comentario.length > 450 && styles.charCountWarn,
              comentario.length > 0 && comentario.length < 20 && styles.charCountWarn,
            )}
          >
            {comentario.length}/500
          </span>
        </div>
      </div>

      {/* General error */}
      {errors.general && (
        <p className={styles.generalError}>{errors.general}</p>
      )}

      {/* Submit */}
      <Button type="submit" variant="primary" disabled={submitting} fullWidth>
        {submitting ? 'Enviando…' : 'Publicar reseña'}
      </Button>
    </form>
  );
}

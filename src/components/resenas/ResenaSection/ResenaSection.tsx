'use client';

/**
 * ResenaSection — composed wrapper that brings together
 * ResenaStats + ResenaList + ResenaForm for a given entity.
 *
 * This is the single component added to detail pages.
 */

import { Skeleton } from '@/components/ui';
import { useResenas } from '@/hooks/useResenas';
import type { EntidadTipo } from '@/types/resena';
import ResenaStatsComponent from '@/components/resenas/ResenaStats/ResenaStats';
import ResenaList from '@/components/resenas/ResenaList/ResenaList';
import ResenaForm from '@/components/resenas/ResenaForm/ResenaForm';
import styles from './ResenaSection.module.css';

/* ── Types ─────────────────────────────────────────────────────────────── */

export interface ResenaSectionProps {
  entidadId: string;
  entidadTipo: EntidadTipo;
  entidadNombre: string;
  onRequestAuth: () => void;
}

/* ── Section titles ───────────────────────────────────────────────────── */

const SECTION_TITLES: Record<EntidadTipo, string> = {
  residencia: 'Experiencias de familias',
  profesional: 'Opiniones de pacientes',
};

/* ── Component ────────────────────────────────────────────────────────── */

export default function ResenaSection({
  entidadId,
  entidadTipo,
  entidadNombre,
  onRequestAuth,
}: ResenaSectionProps) {
  const {
    resenas,
    stats,
    miResenaPendiente,
    loading,
    yaReseno,
    crearResena,
  } = useResenas(entidadId, entidadTipo);

  /* ── Loading skeleton ───────────────────────────────────────────────── */

  if (loading) {
    return (
      <section className={styles.section}>
        <Skeleton variant="text" width="250px" height="1.5rem" />
        <div className={styles.skeletonStats}>
          <Skeleton variant="rectangle" height="120px" />
        </div>
        <div className={styles.skeletonCards}>
          <Skeleton variant="card" height="140px" />
          <Skeleton variant="card" height="140px" />
          <Skeleton variant="card" height="140px" />
        </div>
      </section>
    );
  }

  return (
    <section className={styles.section} id="resenas">
      {/* Title */}
      <h2 className={styles.title}>
        <svg className={styles.titleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
        {SECTION_TITLES[entidadTipo]}
      </h2>

      {/* Stats */}
      {stats && stats.total > 0 && (
        <ResenaStatsComponent stats={stats} />
      )}

      {/* Review list */}
      <ResenaList
        resenas={resenas}
        miResenaPendiente={miResenaPendiente}
      />

      {/* Divider */}
      <div className={styles.divider} />

      {/* Form */}
      <ResenaForm
        onSubmit={crearResena}
        yaReseno={yaReseno}
        miResenaPendiente={miResenaPendiente}
        onRequestAuth={onRequestAuth}
        entidadTipo={entidadTipo}
      />
    </section>
  );
}

'use client';

/**
 * ProfesionalesPage — Client component for the profesionales directory listing.
 *
 * Renders a hero section, specialty filter pills, results count,
 * and a responsive grid of ProfesionalCard components.
 */

import { cn } from '@/utils/classnames';
import { Skeleton, Button } from '@/components/ui';
import { ESPECIALIDAD_OPTIONS } from '@/utils/constants';
import { useProfesionales } from '@/hooks/useProfesionales';
import type { Especialidad } from '@/types/profesional';
import ProfesionalCard from './ProfesionalCard/ProfesionalCard';
import styles from './ProfesionalesPage.module.css';

/* ── Inline SVG Icons ─────────────────────────────────────────────────── */

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function AlertCircleIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

/* ── Component ────────────────────────────────────────────────────────── */

export default function ProfesionalesPage() {
  const { profesionales, loading, error, especialidad, setEspecialidad } =
    useProfesionales();

  return (
    <>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Profesionales de salud geriátrica
          </h1>
          <p className={styles.heroSubtitle}>
            Encontrá al especialista ideal para el cuidado de tu ser querido
            en Mar del Plata. Profesionales verificados y recomendados.
          </p>
        </div>
      </section>

      <div className={styles.container}>
        {/* Filter pills */}
        <nav className={styles.filterBar} aria-label="Filtrar por especialidad">
          <button
            className={cn(styles.pill, !especialidad && styles.pillActive)}
            onClick={() => setEspecialidad(undefined)}
          >
            Todos
          </button>
          {ESPECIALIDAD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              className={cn(
                styles.pill,
                especialidad === opt.value && styles.pillActive,
              )}
              onClick={() => setEspecialidad(opt.value as Especialidad)}
            >
              {opt.label}
            </button>
          ))}
        </nav>

        {/* Results count */}
        {!loading && !error && (
          <p className={styles.resultsCount}>
            Mostrando {profesionales.length}{' '}
            profesional{profesionales.length !== 1 ? 'es' : ''}
          </p>
        )}

        {/* Loading skeletons */}
        {loading && (
          <div className={styles.grid}>
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className={styles.skeletonCard}>
                <div className={styles.skeletonHeader}>
                  <Skeleton variant="circle" width="64px" height="64px" />
                  <div className={styles.skeletonLines}>
                    <Skeleton variant="text" width="70%" />
                    <Skeleton variant="text" width="40%" />
                  </div>
                </div>
                <Skeleton variant="rectangle" height="48px" />
                <Skeleton variant="text" width="55%" />
                <Skeleton variant="text" width="45%" />
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <div className={styles.errorState}>
            <AlertCircleIcon className={styles.errorIcon} />
            <p className={styles.errorText}>{error}</p>
            <Button
              variant="outline"
              onClick={() => setEspecialidad(undefined)}
            >
              Reintentar
            </Button>
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && profesionales.length === 0 && (
          <div className={styles.emptyState}>
            <SearchIcon className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>
              No se encontraron profesionales
            </h3>
            <p className={styles.emptyText}>
              No hay profesionales registrados para esta especialidad.
              Probá con otra o explorá el directorio completo.
            </p>
            <Button
              variant="primary"
              className={styles.emptyButton}
              onClick={() => setEspecialidad(undefined)}
            >
              Ver todos los profesionales
            </Button>
          </div>
        )}

        {/* Results grid */}
        {!loading && !error && profesionales.length > 0 && (
          <div className={styles.grid}>
            {profesionales.map((prof) => (
              <ProfesionalCard key={prof.id} profesional={prof} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

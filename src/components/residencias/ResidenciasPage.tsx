'use client';

/**
 * ResidenciasPage — Main client component for the residencias listing page.
 *
 * Uses the `useResidencias` hook for state management.
 * Renders a hero section, filter sidebar and results grid.
 */

import { useState, useEffect, useMemo } from 'react';
import { useResidencias } from '@/hooks/useResidencias';
import { useDebounce } from '@/hooks/useDebounce';
import { Skeleton } from '@/components/ui';
import { Button } from '@/components/ui';
import ResidenciaCard from './ResidenciaCard/ResidenciaCard';
import FilterSidebar from './FilterSidebar/FilterSidebar';
import styles from './ResidenciasPage.module.css';

export default function ResidenciasPage() {
  const {
    residencias,
    loading,
    error,
    filtros,
    updateFiltro,
    resetFiltros,
  } = useResidencias();

  /* ── Search debouncing ────────────────────────────────────────────── */

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearch = useDebounce(searchTerm, 350);

  useEffect(() => {
    updateFiltro('busqueda', debouncedSearch || undefined);
  }, [debouncedSearch, updateFiltro]);

  /* ── Active filter count (for mobile badge) ───────────────────────── */

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (filtros.barrio) count++;
    if (filtros.tipoCuidado) count++;
    if (filtros.precioMin || filtros.precioMax) count++;
    if (filtros.calificacionMin) count++;
    if (filtros.verificada) count++;
    if (filtros.habilitada) count++;
    if (filtros.ordenarPor) count++;
    if (filtros.busqueda) count++;
    return count;
  }, [filtros]);

  /* ── Skeleton cards ───────────────────────────────────────────────── */

  const renderSkeletons = () => (
    <>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className={styles.skeletonCard}>
          <div className={styles.skeletonImage} />
          <div className={styles.skeletonBody}>
            <Skeleton variant="text" width="80%" height="1.25rem" />
            <Skeleton variant="text" width="55%" height="0.875rem" />
            <Skeleton variant="text" width="60%" height="0.875rem" />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Skeleton variant="text" width="70px" height="1.5rem" />
              <Skeleton variant="text" width="70px" height="1.5rem" />
              <Skeleton variant="text" width="70px" height="1.5rem" />
            </div>
            <Skeleton variant="text" width="40%" height="1.5rem" />
          </div>
        </div>
      ))}
    </>
  );

  /* ── Render ────────────────────────────────────────────────────────── */

  return (
    <>
      {/* Hero header */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>
            Residencias Geriátricas en Mar del Plata
          </h1>
          <p className={styles.heroSubtitle}>
            Encontrá la residencia ideal para tu ser querido. Comparamos opciones
            verificadas con toda la información que necesitás.
          </p>
        </div>
      </section>

      {/* Content */}
      <div className={styles.container}>
        <div className={styles.layout}>
          {/* Filters */}
          <FilterSidebar
            filtros={filtros}
            updateFiltro={updateFiltro}
            resetFiltros={() => {
              resetFiltros();
              setSearchTerm('');
            }}
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            activeCount={activeFilterCount}
          />

          {/* Results */}
          <section aria-label="Resultados de búsqueda">
            {/* Results header */}
            {!loading && !error && (
              <div className={styles.resultsHeader}>
                <p className={styles.resultsCount}>
                  Mostrando{' '}
                  <span className={styles.resultsCountNumber}>
                    {residencias.length}
                  </span>{' '}
                  {residencias.length === 1 ? 'residencia' : 'residencias'}
                </p>
              </div>
            )}

            {/* Grid */}
            <div className={styles.grid}>
              {loading && renderSkeletons()}

              {!loading && error && (
                <div className={styles.errorState}>
                  <h3 className={styles.errorTitle}>Error al cargar</h3>
                  <p className={styles.errorDescription}>{error}</p>
                  <Button variant="outline" onClick={() => window.location.reload()}>
                    Reintentar
                  </Button>
                </div>
              )}

              {!loading && !error && residencias.length === 0 && (
                <div className={styles.emptyState}>
                  <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
                    <path d="M8 11h6" strokeLinecap="round" />
                  </svg>
                  <h3 className={styles.emptyTitle}>
                    No encontramos residencias
                  </h3>
                  <p className={styles.emptyDescription}>
                    Probá ajustando los filtros o limpiando la búsqueda para ver
                    todas las opciones disponibles.
                  </p>
                  <Button
                    variant="primary"
                    onClick={() => {
                      resetFiltros();
                      setSearchTerm('');
                    }}
                  >
                    Limpiar filtros
                  </Button>
                </div>
              )}

              {!loading &&
                !error &&
                residencias.map((r) => (
                  <ResidenciaCard key={r.id} residencia={r} />
                ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

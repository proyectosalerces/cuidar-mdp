'use client';

/**
 * FilterSidebar — Responsive filter panel for residencias listing.
 *
 * Desktop: sticky sidebar on the left.
 * Mobile: bottom-sheet overlay with slide-up animation.
 */

import { useState, useCallback } from 'react';
import type { FiltrosResidencia } from '@/types/residencia';
import { Select } from '@/components/ui';
import {
  BARRIOS_MDP,
  TIPOS_CUIDADO_OPTIONS,
  RANGOS_PRECIO,
} from '@/utils/constants';
import { cn } from '@/utils/classnames';
import styles from './FilterSidebar.module.css';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

interface FilterSidebarProps {
  filtros: FiltrosResidencia;
  updateFiltro: <K extends keyof FiltrosResidencia>(
    key: K,
    value: FiltrosResidencia[K]
  ) => void;
  resetFiltros: () => void;
  /** Local search term (debounced externally) */
  searchTerm: string;
  onSearchChange: (value: string) => void;
  /** Count of active filter fields (for mobile badge) */
  activeCount: number;
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Sort options                                                               */
/* -------------------------------------------------------------------------- */

const SORT_OPTIONS = [
  { value: 'calificacion', label: 'Mejor calificadas' },
  { value: 'precio-asc', label: 'Precio (menor a mayor)' },
  { value: 'precio-desc', label: 'Precio (mayor a menor)' },
  { value: 'nombre', label: 'Nombre A-Z' },
];

/* -------------------------------------------------------------------------- */
/*  Rating presets                                                             */
/* -------------------------------------------------------------------------- */

const RATING_PRESETS = [
  { value: 3, label: '3+' },
  { value: 4, label: '4+' },
  { value: 4.5, label: '4.5+' },
];

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function FilterSidebar({
  filtros,
  updateFiltro,
  resetFiltros,
  searchTerm,
  onSearchChange,
  activeCount,
  className,
}: FilterSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobile = useCallback(() => setMobileOpen((p) => !p), []);
  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const handlePriceChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const val = e.target.value;
      if (!val) {
        updateFiltro('precioMin', undefined);
        updateFiltro('precioMax', undefined);
        return;
      }
      if (val.endsWith('+')) {
        updateFiltro('precioMin', parseInt(val));
        updateFiltro('precioMax', undefined);
      } else {
        const [min, max] = val.split('-').map(Number);
        updateFiltro('precioMin', min);
        updateFiltro('precioMax', max);
      }
    },
    [updateFiltro],
  );

  const selectedPriceValue = (() => {
    if (filtros.precioMin && filtros.precioMax) {
      return `${filtros.precioMin}-${filtros.precioMax}`;
    }
    if (filtros.precioMin && !filtros.precioMax) {
      return `${filtros.precioMin}+`;
    }
    return '';
  })();

  /* ─── Render ──────────────────────────────────────────────────────── */

  const sidebarContent = (
    <aside
      className={cn(
        styles.sidebar,
        mobileOpen && styles.sidebarVisible,
        className,
      )}
      id="filter-sidebar"
    >
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>Filtros</h2>
        <button
          className={styles.closeButton}
          onClick={closeMobile}
          aria-label="Cerrar filtros"
        >
          <svg className={styles.closeIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>

      {/* Search */}
      <div className={styles.section}>
        <label className={styles.sectionLabel} htmlFor="filter-search">
          Buscar
        </label>
        <div className={styles.searchWrapper}>
          <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="M21 21l-4.35-4.35" strokeLinecap="round" />
          </svg>
          <input
            id="filter-search"
            className={styles.searchInput}
            type="search"
            placeholder="Nombre, barrio, servicio…"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <hr className={styles.divider} />

      {/* Barrio */}
      <div className={styles.section}>
        <Select
          label="Barrio"
          id="filter-barrio"
          options={BARRIOS_MDP}
          placeholder="Todos los barrios"
          value={filtros.barrio ?? ''}
          onChange={(e) =>
            updateFiltro('barrio', e.target.value || undefined)
          }
        />
      </div>

      {/* Tipo de cuidado */}
      <div className={styles.section}>
        <Select
          label="Tipo de cuidado"
          id="filter-tipo-cuidado"
          options={TIPOS_CUIDADO_OPTIONS}
          placeholder="Todos los tipos"
          value={filtros.tipoCuidado ?? ''}
          onChange={(e) =>
            updateFiltro('tipoCuidado', (e.target.value || undefined) as FiltrosResidencia['tipoCuidado'])
          }
        />
      </div>

      {/* Rango de precio */}
      <div className={styles.section}>
        <Select
          label="Rango de precio"
          id="filter-precio"
          options={RANGOS_PRECIO}
          placeholder="Cualquier precio"
          value={selectedPriceValue}
          onChange={handlePriceChange}
        />
      </div>

      <hr className={styles.divider} />

      {/* Rating minimum */}
      <div className={styles.section}>
        <span className={styles.sectionLabel}>Calificación mínima</span>
        <div className={styles.ratingButtons}>
          {RATING_PRESETS.map((preset) => (
            <button
              key={preset.value}
              className={cn(
                styles.ratingButton,
                filtros.calificacionMin === preset.value && styles.ratingButtonActive,
              )}
              onClick={() =>
                updateFiltro(
                  'calificacionMin',
                  filtros.calificacionMin === preset.value ? undefined : preset.value,
                )
              }
              aria-pressed={filtros.calificacionMin === preset.value}
            >
              ★ {preset.label}
            </button>
          ))}
        </div>
      </div>

      <hr className={styles.divider} />

      {/* Checkboxes */}
      <div className={styles.section}>
        <div className={styles.checkboxGroup}>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={filtros.verificada === true}
              onChange={(e) =>
                updateFiltro('verificada', e.target.checked ? true : undefined)
              }
            />
            Solo verificadas
          </label>
          <label className={styles.checkboxLabel}>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={filtros.habilitada === true}
              onChange={(e) =>
                updateFiltro('habilitada', e.target.checked ? true : undefined)
              }
            />
            Solo habilitadas
          </label>
        </div>
      </div>

      <hr className={styles.divider} />

      {/* Sort */}
      <div className={styles.section}>
        <Select
          label="Ordenar por"
          id="filter-ordenar"
          options={SORT_OPTIONS}
          placeholder="Relevancia"
          value={filtros.ordenarPor ?? ''}
          onChange={(e) =>
            updateFiltro('ordenarPor', (e.target.value || undefined) as FiltrosResidencia['ordenarPor'])
          }
        />
      </div>

      {/* Clear all */}
      <button className={styles.clearButton} onClick={resetFiltros}>
        <svg className={styles.clearIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6h14" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Limpiar filtros
      </button>
    </aside>
  );

  return (
    <>
      {/* Mobile toggle */}
      <button className={styles.mobileToggle} onClick={toggleMobile}>
        <svg className={styles.filterIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Filtros
        {activeCount > 0 && (
          <span className={styles.activeFiltersCount}>{activeCount}</span>
        )}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className={cn(styles.overlay, styles.overlayVisible)}
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {sidebarContent}
    </>
  );
}

'use client';

/**
 * BlogCategoryFilter — Horizontal pill buttons to filter posts by category.
 *
 * Client component because it manages interactive state (active pill).
 */

import { cn } from '@/utils/classnames';
import styles from './BlogCategoryFilter.module.css';

/* -------------------------------------------------------------------------- */
/*  Category definitions                                                       */
/* -------------------------------------------------------------------------- */

const CATEGORIES = [
  { value: '', label: 'Todas' },
  { value: 'guias', label: 'Guías' },
  { value: 'salud', label: 'Salud' },
  { value: 'familias', label: 'Familias' },
  { value: 'legales', label: 'Legales' },
  { value: 'legal', label: 'Legal' },
  { value: 'emocional', label: 'Emocional' },
  { value: 'actividades', label: 'Actividades' },
  { value: 'nutricion', label: 'Nutrición' },
  { value: 'noticias', label: 'Noticias' },
] as const;

/* -------------------------------------------------------------------------- */
/*  Props                                                                      */
/* -------------------------------------------------------------------------- */

interface BlogCategoryFilterProps {
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function BlogCategoryFilter({
  activeCategory,
  onCategoryChange,
  className,
}: BlogCategoryFilterProps) {
  return (
    <nav
      className={cn(styles.filterBar, className)}
      aria-label="Filtrar por categoría"
    >
      <div className={styles.scrollContainer}>
        {CATEGORIES.map((cat) => (
          <button
            key={cat.value}
            className={cn(
              styles.pill,
              activeCategory === cat.value && styles.active,
            )}
            onClick={() => onCategoryChange(cat.value)}
            aria-pressed={activeCategory === cat.value}
          >
            {cat.label}
          </button>
        ))}
      </div>
    </nav>
  );
}

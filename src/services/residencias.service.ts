/**
 * Service layer for residencias (senior care facilities)
 *
 * Currently uses mock data. Will be replaced with Firebase Firestore
 * queries once the backend is connected.
 */

import type { Residencia, FiltrosResidencia } from '@/types/residencia';
import { mockResidencias } from '@/data/mock';

/**
 * Normalize a string for case-insensitive, accent-insensitive comparison
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Apply filter criteria to a residencia
 */
function matchesFilters(
  residencia: Residencia,
  filtros: FiltrosResidencia
): boolean {
  if (filtros.barrio && residencia.barrio !== filtros.barrio) {
    return false;
  }

  if (
    filtros.tipoCuidado &&
    !residencia.tiposCuidado.includes(filtros.tipoCuidado)
  ) {
    return false;
  }

  if (filtros.precioMin && residencia.precioDesde != null) {
    if (residencia.precioDesde < filtros.precioMin) return false;
  }

  if (filtros.precioMax && residencia.precioHasta != null) {
    if (residencia.precioHasta > filtros.precioMax) return false;
  }

  if (filtros.habilitada != null && residencia.habilitada !== filtros.habilitada) {
    return false;
  }

  if (filtros.verificada != null && residencia.verificada !== filtros.verificada) {
    return false;
  }

  if (filtros.calificacionMin != null) {
    if (residencia.calificacion < filtros.calificacionMin) return false;
  }

  if (filtros.busqueda) {
    const query = normalize(filtros.busqueda);
    const searchableText = normalize(
      `${residencia.nombre} ${residencia.descripcion} ${residencia.barrio} ${residencia.servicios.join(' ')}`
    );
    if (!searchableText.includes(query)) return false;
  }

  return true;
}

/**
 * Sort residencias by the specified criteria
 */
function sortResidencias(
  items: Residencia[],
  ordenarPor?: FiltrosResidencia['ordenarPor']
): Residencia[] {
  const sorted = [...items];

  switch (ordenarPor) {
    case 'calificacion':
      sorted.sort((a, b) => b.calificacion - a.calificacion);
      break;
    case 'precio-asc':
      sorted.sort((a, b) => (a.precioDesde ?? 0) - (b.precioDesde ?? 0));
      break;
    case 'precio-desc':
      sorted.sort((a, b) => (b.precioDesde ?? 0) - (a.precioDesde ?? 0));
      break;
    case 'nombre':
      sorted.sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
      break;
    default:
      // Default: featured first, then by rating
      sorted.sort((a, b) => {
        if (a.destacada !== b.destacada) return a.destacada ? -1 : 1;
        return b.calificacion - a.calificacion;
      });
  }

  return sorted;
}

/**
 * Get all active residencias, optionally filtered and sorted
 */
export async function getResidencias(
  filtros?: FiltrosResidencia
): Promise<Residencia[]> {
  // Simulate async data fetch
  const activeResidencias = mockResidencias.filter((r) => r.activa);

  if (!filtros) {
    return sortResidencias(activeResidencias);
  }

  const filtered = activeResidencias.filter((r) => matchesFilters(r, filtros));
  return sortResidencias(filtered, filtros.ordenarPor);
}

/**
 * Get a single residencia by its URL slug
 */
export async function getResidenciaBySlug(
  slug: string
): Promise<Residencia | null> {
  return (
    mockResidencias.find((r) => r.slug === slug && r.activa) ?? null
  );
}

/**
 * Get featured residencias for the homepage
 */
export async function getResidenciasDestacadas(): Promise<Residencia[]> {
  return mockResidencias
    .filter((r) => r.destacada && r.activa)
    .sort((a, b) => b.calificacion - a.calificacion);
}

/**
 * Full-text search across residencia name, description, services, and neighborhood
 */
export async function searchResidencias(
  query: string
): Promise<Residencia[]> {
  if (!query.trim()) return [];

  return getResidencias({ busqueda: query });
}

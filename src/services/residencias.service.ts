/**
 * Service layer for residencias (senior care facilities)
 *
 * Reads from the Firestore 'residencias' collection with a 5-minute
 * in-memory cache. Falls back to mock data when Firestore is unavailable.
 */

import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import type { Residencia, FiltrosResidencia } from '@/types/residencia';
import { mockResidencias } from '@/data/mock';

/* ── Constants ──────────────────────────────────────────────────────────── */

const COLLECTION = 'residencias';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/* ── In-memory cache ────────────────────────────────────────────────────── */

let cache: { data: Residencia[]; timestamp: number } | null = null;

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/**
 * Normalize a string for case-insensitive, accent-insensitive comparison
 */
function normalize(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/** Map a Firestore document to a Residencia object. */
function mapDoc(doc: { id: string; data: () => Record<string, unknown> }): Residencia {
  const d = doc.data();

  const toISO = (val: unknown): string => {
    if (val instanceof Object && 'toDate' in val) {
      return (val as Timestamp).toDate().toISOString();
    }
    return (val as string) ?? new Date().toISOString();
  };

  return {
    id: doc.id,
    nombre: (d.nombre as string) ?? '',
    slug: (d.slug as string) ?? '',
    descripcion: (d.descripcion as string) ?? '',
    descripcionCorta: (d.descripcionCorta as string) ?? '',
    direccion: (d.direccion as string) ?? '',
    barrio: (d.barrio as string) ?? '',
    ciudad: (d.ciudad as string) ?? 'Mar del Plata',
    telefono: (d.telefono as string) ?? '',
    email: d.email as string | undefined,
    website: d.website as string | undefined,
    whatsapp: d.whatsapp as string | undefined,
    coordenadas: d.coordenadas as { lat: number; lng: number } | undefined,
    imagenes: (d.imagenes as string[]) ?? [],
    imagenPrincipal: (d.imagenPrincipal as string) ?? '',
    tiposCuidado: (d.tiposCuidado as Residencia['tiposCuidado']) ?? [],
    servicios: (d.servicios as string[]) ?? [],
    habilitada: (d.habilitada as boolean) ?? false,
    verificada: (d.verificada as boolean) ?? false,
    precioDesde: d.precioDesde as number | undefined,
    precioHasta: d.precioHasta as number | undefined,
    rangoPrecios: d.rangoPrecios as string | undefined,
    calificacion: (d.calificacion as number) ?? 0,
    cantidadResenas: (d.cantidadResenas as number) ?? 0,
    horarioVisitas: d.horarioVisitas as string | undefined,
    capacidad: d.capacidad as number | undefined,
    anioFundacion: d.anioFundacion as number | undefined,
    destacada: (d.destacada as boolean) ?? false,
    activa: (d.activa as boolean) ?? true,
    createdAt: toISO(d.createdAt),
    updatedAt: toISO(d.updatedAt),
  };
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
    const q = normalize(filtros.busqueda);
    const searchableText = normalize(
      `${residencia.nombre} ${residencia.descripcion} ${residencia.barrio} ${residencia.servicios.join(' ')}`
    );
    if (!searchableText.includes(q)) return false;
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

/* ── Data fetching with cache ───────────────────────────────────────────── */

/**
 * Fetch all residencias from Firestore, using the in-memory cache when fresh.
 * Falls back to mock data if Firestore is unavailable.
 */
async function fetchAllResidencias(): Promise<Residencia[]> {
  // Return cached data if still fresh
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }

  try {
    const q = query(
      collection(db, COLLECTION),
      where('activa', '==', true),
      orderBy('calificacion', 'desc'),
    );
    const snapshot = await getDocs(q);
    const residencias = snapshot.docs.map(mapDoc);

    // Update cache
    cache = { data: residencias, timestamp: Date.now() };

    return residencias;
  } catch (err) {
    console.warn(
      '[Residencias] Firestore query failed, falling back to mock data:',
      err,
    );
    return mockResidencias.filter((r) => r.activa);
  }
}

/* ── Public API ──────────────────────────────────────────────────────────── */

/**
 * Get all active residencias, optionally filtered and sorted
 */
export async function getResidencias(
  filtros?: FiltrosResidencia
): Promise<Residencia[]> {
  const activeResidencias = await fetchAllResidencias();

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
  const all = await fetchAllResidencias();
  return all.find((r) => r.slug === slug) ?? null;
}

/**
 * Get featured residencias for the homepage
 */
export async function getResidenciasDestacadas(): Promise<Residencia[]> {
  const all = await fetchAllResidencias();
  return all
    .filter((r) => r.destacada)
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

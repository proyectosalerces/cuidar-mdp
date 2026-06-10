/**
 * Service layer for profesionales (healthcare professionals)
 *
 * Reads from the Firestore 'profesionales' collection with a 5-minute
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
import type { Profesional, Especialidad } from '@/types/profesional';
import { mockProfesionales } from '@/data/mock';

/* ── Constants ──────────────────────────────────────────────────────────── */

const COLLECTION = 'profesionales';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/* ── In-memory cache ────────────────────────────────────────────────────── */

let cache: { data: Profesional[]; timestamp: number } | null = null;

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/** Map a Firestore document to a Profesional object. */
function mapDoc(doc: { id: string; data: () => Record<string, unknown> }): Profesional {
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
    especialidad: (d.especialidad as Especialidad) ?? 'geriatra',
    matricula: d.matricula as string | undefined,
    descripcion: (d.descripcion as string) ?? '',
    direccionConsultorio: (d.direccionConsultorio as string) ?? '',
    barrio: (d.barrio as string) ?? '',
    telefono: (d.telefono as string) ?? '',
    email: d.email as string | undefined,
    website: d.website as string | undefined,
    foto: (d.foto as string) ?? '',
    calificacion: (d.calificacion as number) ?? 0,
    cantidadResenas: (d.cantidadResenas as number) ?? 0,
    obrasSociales: d.obrasSociales as string[] | undefined,
    horarioAtencion: d.horarioAtencion as string | undefined,
    activo: (d.activo as boolean) ?? true,
    createdAt: toISO(d.createdAt),
  };
}

/* ── Data fetching with cache ───────────────────────────────────────────── */

/**
 * Fetch all profesionales from Firestore, using the in-memory cache when fresh.
 * Falls back to mock data if Firestore is unavailable.
 */
async function fetchAllProfesionales(): Promise<Profesional[]> {
  // Return cached data if still fresh
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }

  try {
    const q = query(
      collection(db, COLLECTION),
      where('activo', '==', true),
      orderBy('calificacion', 'desc'),
    );
    const snapshot = await getDocs(q);
    const profesionales = snapshot.docs.map(mapDoc);

    // Update cache
    cache = { data: profesionales, timestamp: Date.now() };

    return profesionales;
  } catch (err) {
    console.warn(
      '[Profesionales] Firestore query failed, falling back to mock data:',
      err,
    );
    return mockProfesionales
      .filter((p) => p.activo)
      .sort((a, b) => b.calificacion - a.calificacion);
  }
}

/* ── Public API ──────────────────────────────────────────────────────────── */

/**
 * Get all active profesionales, optionally filtered by specialty
 */
export async function getProfesionales(
  especialidad?: Especialidad | string
): Promise<Profesional[]> {
  const all = await fetchAllProfesionales();

  if (!especialidad) {
    return all;
  }

  return all.filter((p) => p.especialidad === especialidad);
}

/**
 * Get a single profesional by their URL slug
 */
export async function getProfesionalBySlug(
  slug: string
): Promise<Profesional | null> {
  const all = await fetchAllProfesionales();
  return all.find((p) => p.slug === slug) ?? null;
}

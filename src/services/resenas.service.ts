/**
 * Reseñas (reviews) service.
 *
 * Reads from mock data and localStorage for new reviews.
 * All functions return promises to simulate async behaviour.
 */

import type { AppUser } from '@/services/firebase/auth';
import type {
  Resena,
  ResenaFormData,
  ResenaStats,
  EntidadTipo,
} from '@/types/resena';
import { mockResenas } from '@/data/mock-resenas';

/* ── Constants ─────────────────────────────────────────────────────────── */

const LS_KEY = 'cuidar-mdp-resenas';

/* ── Helpers ───────────────────────────────────────────────────────────── */

/** Small async delay to mimic network latency. */
function delay(ms = 250): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Generate a pseudo-unique ID. */
function generateId(): string {
  return `rev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/** Read user-submitted reviews from localStorage. */
function leerLS(): Resena[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as Resena[]) : [];
  } catch {
    return [];
  }
}

/** Write user-submitted reviews to localStorage. */
function guardarLS(resenas: Resena[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LS_KEY, JSON.stringify(resenas));
}

/** Combine mock + localStorage reviews. */
function todasLasResenas(): Resena[] {
  return [...mockResenas, ...leerLS()];
}

/* ── Public API ────────────────────────────────────────────────────────── */

/**
 * Returns approved reviews for a given entity, sorted by date desc.
 */
export async function getResenas(
  entidadId: string,
  entidadTipo: EntidadTipo,
): Promise<Resena[]> {
  await delay();
  return todasLasResenas()
    .filter(
      (r) =>
        r.entidadId === entidadId &&
        r.entidadTipo === entidadTipo &&
        r.aprobada,
    )
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

/**
 * Computes stats from approved reviews for an entity.
 */
export async function getResenaStats(
  entidadId: string,
  entidadTipo: EntidadTipo,
): Promise<ResenaStats> {
  await delay(150);
  const approved = todasLasResenas().filter(
    (r) =>
      r.entidadId === entidadId &&
      r.entidadTipo === entidadTipo &&
      r.aprobada,
  );

  const distribucion: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };

  let sum = 0;
  for (const r of approved) {
    const star = Math.min(5, Math.max(1, Math.round(r.calificacion))) as
      | 1
      | 2
      | 3
      | 4
      | 5;
    distribucion[star]++;
    sum += r.calificacion;
  }

  return {
    promedio: approved.length > 0 ? sum / approved.length : 0,
    total: approved.length,
    distribucion,
  };
}

/**
 * Creates a new review with `aprobada: false`, saves it to localStorage.
 */
export async function crearResena(
  data: ResenaFormData,
  user: AppUser,
  entidadId: string,
  entidadTipo: EntidadTipo,
): Promise<Resena> {
  await delay(400);

  const nueva: Resena = {
    id: generateId(),
    autorId: user.uid,
    autorNombre: user.displayName ?? 'Usuario',
    autorEmail: user.email ?? '',
    entidadId,
    entidadTipo,
    calificacion: data.calificacion,
    titulo: data.titulo.trim(),
    comentario: data.comentario.trim(),
    fecha: new Date().toISOString(),
    aprobada: false,
  };

  const existing = leerLS();
  existing.push(nueva);
  guardarLS(existing);

  return nueva;
}

/**
 * Returns all reviews by a given user (approved + pending).
 */
export async function getMisResenas(autorId: string): Promise<Resena[]> {
  await delay(200);
  return todasLasResenas()
    .filter((r) => r.autorId === autorId)
    .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
}

/**
 * Check whether a user already reviewed a specific entity.
 */
export async function yaReseno(
  autorId: string,
  entidadId: string,
  entidadTipo: EntidadTipo,
): Promise<boolean> {
  await delay(100);
  return todasLasResenas().some(
    (r) =>
      r.autorId === autorId &&
      r.entidadId === entidadId &&
      r.entidadTipo === entidadTipo,
  );
}

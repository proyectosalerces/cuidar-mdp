/**
 * Types for the review / rating system (reseñas).
 */

export type EntidadTipo = 'residencia' | 'profesional';

/* ── Rating aspects (per entity type) ──────────────────────────────────── */

export interface AspectoDef {
  key: string;
  label: string;
}

export const ASPECTOS_RESIDENCIA: AspectoDef[] = [
  { key: 'limpieza', label: 'Limpieza e higiene' },
  { key: 'comida', label: 'Calidad de la comida' },
  { key: 'cuidado', label: 'Atención del personal de cuidado' },
  { key: 'administracion', label: 'Atención administrativa' },
  { key: 'instalaciones', label: 'Instalaciones y confort' },
];

export const ASPECTOS_PROFESIONAL: AspectoDef[] = [
  { key: 'puntualidad', label: 'Puntualidad' },
  { key: 'trato', label: 'Trato y empatía' },
  { key: 'profesionalismo', label: 'Profesionalismo e idoneidad' },
  { key: 'claridad', label: 'Claridad para explicar' },
];

export function getAspectos(tipo: EntidadTipo): AspectoDef[] {
  return tipo === 'residencia' ? ASPECTOS_RESIDENCIA : ASPECTOS_PROFESIONAL;
}

/** Average of the rated aspects (values > 0), or 0 if none. */
export function promedioAspectos(calificaciones: Record<string, number>): number {
  const values = Object.values(calificaciones).filter((v) => v > 0);
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

/* ── Core types ────────────────────────────────────────────────────────── */

export interface Resena {
  id: string;
  autorId: string;
  autorNombre: string;
  autorEmail: string;
  entidadId: string;
  entidadTipo: EntidadTipo;
  calificacion: number; // overall (1-5) — average of aspects when present
  calificaciones?: Record<string, number>; // per-aspect scores (1-5)
  titulo: string;
  comentario: string;
  fecha: string; // ISO date
  aprobada: boolean;
}

export interface ResenaFormData {
  calificacion: number; // overall (computed from aspects, or the general fallback)
  calificaciones: Record<string, number>; // per-aspect scores actually rated
  titulo: string;
  comentario: string;
}

export interface ResenaStats {
  promedio: number;
  total: number;
  distribucion: Record<1 | 2 | 3 | 4 | 5, number>; // count per star
}

/**
 * Service layer for profesionales (healthcare professionals)
 *
 * Currently uses mock data. Will be replaced with Firebase Firestore
 * queries once the backend is connected.
 */

import type { Profesional, Especialidad } from '@/types/profesional';
import { mockProfesionales } from '@/data/mock';

/**
 * Get all active profesionales, optionally filtered by specialty
 */
export async function getProfesionales(
  especialidad?: Especialidad | string
): Promise<Profesional[]> {
  let results = mockProfesionales.filter((p) => p.activo);

  if (especialidad) {
    results = results.filter((p) => p.especialidad === especialidad);
  }

  // Sort by rating descending
  return results.sort((a, b) => b.calificacion - a.calificacion);
}

/**
 * Get a single profesional by their URL slug
 */
export async function getProfesionalBySlug(
  slug: string
): Promise<Profesional | null> {
  return (
    mockProfesionales.find((p) => p.slug === slug && p.activo) ?? null
  );
}

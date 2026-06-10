/**
 * Types for the review / rating system (reseñas).
 */

export type EntidadTipo = 'residencia' | 'profesional';

export interface Resena {
  id: string;
  autorId: string;
  autorNombre: string;
  autorEmail: string;
  entidadId: string;
  entidadTipo: EntidadTipo;
  calificacion: number; // 1-5
  titulo: string;
  comentario: string;
  fecha: string; // ISO date
  aprobada: boolean;
}

export interface ResenaFormData {
  calificacion: number;
  titulo: string;
  comentario: string;
}

export interface ResenaStats {
  promedio: number;
  total: number;
  distribucion: Record<1 | 2 | 3 | 4 | 5, number>; // count per star
}

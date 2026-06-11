/**
 * Types for profesionales (healthcare professionals)
 */

export type Especialidad =
  | 'geriatra'
  | 'gerontologo'
  | 'kinesiologia'
  | 'psicologia'
  | 'neurologia'
  | 'nutricion'
  | 'terapia-ocupacional'
  | 'enfermeria'
  | 'trabajo-social'
  | 'cuidador-domiciliario'
  | 'auxiliar-gerontologico'
  | 'auxiliar-familia'
  | 'cuidados-paliativos';

export interface Profesional {
  id: string;
  nombre: string;
  slug: string;
  especialidad: Especialidad;
  matricula?: string;
  descripcion: string;
  direccionConsultorio: string;
  barrio: string;
  telefono: string;
  email?: string;
  website?: string;
  foto: string;
  calificacion: number;
  cantidadResenas: number;
  obrasSociales?: string[];
  horarioAtencion?: string;
  activo: boolean;
  createdAt: string;
}

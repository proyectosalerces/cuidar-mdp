/**
 * Types for professional intake requests (formulario público /alta-profesional).
 *
 * Lands in the `solicitudesProfesionales` collection for admin review and
 * publishing as a Profesional. NOTE: the consultation fee (valor) is stored for
 * the admin's reference only — it is NOT published on the public profile.
 */

import type { Especialidad } from '@/types/profesional';
import type { EstadoSolicitud } from '@/types/solicitud';

export interface SolicitudProfesional {
  id: string;

  /* Datos del profesional */
  nombre: string; // nombre y apellido
  especialidad: Especialidad;
  matricula?: string;
  descripcion?: string;

  /* Dónde atiende */
  modalidades: string[]; // consultorio / domicilio / virtual
  direccionConsultorio?: string;
  barrio?: string;

  /* Contacto */
  telefono: string;
  email: string;
  whatsapp?: string;
  website?: string;
  instagram?: string;

  /* Obras sociales y valores (valor = interno, no público) */
  obrasSociales?: string;
  valorDesde?: number;
  valorHasta?: number;

  /* Autorización */
  autoriza: boolean;
  autorizanteNombre: string;
  autorizanteApellido: string;
  autorizanteCargo: string;
  autorizanteDni?: string;
  autorizanteTelefono: string;
  autorizanteEmail: string;
  textoVersion: string;

  /* Meta */
  estado: EstadoSolicitud;
  createdAt: string;
}

export type SolicitudProfesionalFormData = Omit<SolicitudProfesional, 'id' | 'estado' | 'createdAt'>;

export const MODALIDADES_ATENCION: { value: string; label: string }[] = [
  { value: 'consultorio', label: 'En consultorio' },
  { value: 'domicilio', label: 'A domicilio' },
  { value: 'virtual', label: 'Virtual / videollamada' },
];

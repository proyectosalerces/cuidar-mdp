/**
 * Types for residencia intake requests (formulario público de alta).
 *
 * A residencia fills the public form; it lands in the `solicitudes` collection
 * for the admin to review and (with consent recorded) publish as a residencia.
 */

import type { TipoCuidado, EstadoHabilitacion } from '@/types/residencia';

export type EstadoSolicitud = 'pendiente' | 'publicada' | 'descartada';

/** Price range for one room type. */
export interface ValorHabitacion {
  tipo: string; // 'individual' | 'doble' | 'triple' | 'cuadruple'
  desde?: number;
  hasta?: number;
}

export interface SolicitudResidencia {
  id: string;

  /* Contacto */
  nombre: string;
  direccion: string;
  barrio?: string;
  telefono: string;
  email: string;
  whatsapp?: string;
  website?: string;
  instagram?: string;
  facebook?: string;

  /* Habilitación */
  habilitacionMunicipal?: EstadoHabilitacion;
  habilitacionProvincial?: EstadoHabilitacion;

  /* Asistencia y servicios */
  tiposCuidado: TipoCuidado[];
  servicios: string[];
  actividades?: string;
  regimenVisitas?: string;

  /* Habitaciones */
  tiposHabitacion: string[];
  disponibilidad?: string;

  /* Valores */
  valores: ValorHabitacion[];
  notaPlantas?: string;
  diferenciales?: string;
  reintegroObraSocial?: string;

  /* Consentimiento */
  autoriza: boolean;
  completadoPor: string;

  /* Meta */
  estado: EstadoSolicitud;
  createdAt: string;
}

/** Form payload (before it gets an id / estado / timestamp). */
export type SolicitudFormData = Omit<SolicitudResidencia, 'id' | 'estado' | 'createdAt'>;

/* ── Options for the form ──────────────────────────────────────────────── */

export const TIPOS_HABITACION: { value: string; label: string }[] = [
  { value: 'individual', label: 'Individual' },
  { value: 'doble', label: 'Doble' },
  { value: 'triple', label: 'Triple' },
  { value: 'cuadruple', label: 'Cuádruple' },
];

export const SERVICIOS_OPCIONES: { value: string; label: string }[] = [
  { value: 'enfermeria-24', label: 'Enfermería 24 hs' },
  { value: 'medico', label: 'Médico de cabecera' },
  { value: 'recetas-insumos', label: 'Gestión de recetas e insumos' },
  { value: 'kinesiologia', label: 'Kinesiología' },
  { value: 'comida', label: 'Servicio de comida' },
  { value: 'dietas', label: 'Dietas especiales' },
  { value: 'lavanderia', label: 'Lavandería' },
  { value: 'psicologia', label: 'Atención psicológica' },
];

export const TIPOS_CUIDADO_SOLICITUD: { value: TipoCuidado; label: string }[] = [
  { value: 'internacion-permanente', label: 'Internación permanente' },
  { value: 'internacion-temporal', label: 'Internación temporal' },
  { value: 'centro-de-dia', label: 'Centro de día' },
  { value: 'rehabilitacion', label: 'Rehabilitación' },
  { value: 'cuidados-paliativos', label: 'Cuidados paliativos' },
  { value: 'alzheimer-demencia', label: 'Alzheimer / demencia' },
  { value: 'convalecencia', label: 'Convalecencia' },
];

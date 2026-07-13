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

  /* Consentimiento / autorización */
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

/* ── Texto de autorización (BORRADOR — a validar por abogado) ───────────── */

export const TEXTO_AUTORIZACION_VERSION = 'borrador-2026-07';

export const TEXTO_AUTORIZACION_PARRAFOS: string[] = [
  'Quien suscribe, en el carácter indicado más abajo y en representación de la residencia consignada en este formulario, declara bajo declaración jurada que la información provista es veraz y que se encuentra facultado/a para autorizar su publicación.',
  'Autoriza de forma libre y expresa a Cuidar MdP a publicar y difundir dicha información (datos de contacto, servicios, habilitaciones declaradas, tipos de habitación, valores orientativos expresados como rango y material gráfico aportado) en su portal web y canales de difusión, con la finalidad de orientar a las familias.',
  'Comprende que la información será de acceso público, que puede solicitar su modificación o baja en cualquier momento contactando a Cuidar MdP, y que Cuidar MdP no resulta responsable por las decisiones que terceros adopten en base a esta información.',
  'El tratamiento de los datos personales se rige por la Ley 25.326 de Protección de Datos Personales de la República Argentina.',
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

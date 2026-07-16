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

/* ── Texto de autorización (revisado con asesoramiento legal) ───────────── */

export const TEXTO_AUTORIZACION_VERSION = '2026-07-v2';

const CUIDAR_MDP_TITULAR = 'Cuidar MdP (titular: Diego Catalano, CUIT 20-34058029-0)';
const CANALES_DIFUSION =
  'su portal web www.cuidarmdp.com y demás canales de difusión (redes sociales como Instagram y Facebook, portales asociados, Google Business, entre otros)';
const CONTACTO_FEHACIENTE =
  'Medios de contacto de Cuidar MdP: correo electrónico info@cuidarmdp.com · WhatsApp +54 9 223 694-8075.';

export const TEXTO_AUTORIZACION_RESIDENCIA_PARRAFOS: string[] = [
  'Quien suscribe, en el carácter indicado más abajo y en representación de la residencia consignada en este formulario, declara bajo declaración jurada que la información provista es veraz y que se encuentra facultado/a para autorizar su publicación.',
  `Quien suscribe autoriza de forma libre y expresa a ${CUIDAR_MDP_TITULAR} a publicar y difundir dicha información —datos de contacto, servicios, habilitaciones declaradas, tipos de habitación, valores orientativos expresados como rango y material gráfico aportado (fotografías, logotipo e imágenes)— en ${CANALES_DIFUSION}, con la finalidad de orientar a las familias.`,
  'Respecto del material gráfico aportado, declara contar con los derechos necesarios sobre el mismo y autoriza expresamente su uso y difusión con la finalidad indicada.',
  'La información se utilizará mientras la residencia mantenga el servicio activo en el portal, o hasta que solicite su baja.',
  'El titular de los datos podrá ejercer en cualquier momento sus derechos de acceso, actualización, rectificación y supresión (baja) de la información, comunicándose por los medios de contacto indicados. El tratamiento se rige por la Ley 25.326 de Protección de Datos Personales de la República Argentina.',
  'La revocación de esta autorización produce efectos hacia el futuro y no afecta la validez de las publicaciones o difusiones realizadas con anterioridad a la solicitud de baja.',
  CONTACTO_FEHACIENTE,
];

export const TEXTO_AUTORIZACION_PROFESIONAL_PARRAFOS: string[] = [
  'Quien suscribe, en el carácter indicado más abajo y en representación del/de la profesional consignado/a en este formulario, declara bajo declaración jurada que la información provista es veraz y que se encuentra facultado/a para autorizar su publicación.',
  `Quien suscribe autoriza de forma libre y expresa a ${CUIDAR_MDP_TITULAR} a publicar y difundir dicha información —datos de contacto, especialidad, servicios, obras sociales y material gráfico aportado (fotografías, logotipo e imágenes)— en ${CANALES_DIFUSION}, con la finalidad de orientar a las familias.`,
  'Respecto del material gráfico aportado, declara contar con los derechos necesarios sobre el mismo y autoriza expresamente su uso y difusión con la finalidad indicada.',
  'La información se utilizará mientras el/la profesional mantenga su perfil activo en el portal, o hasta que solicite su baja.',
  'El titular de los datos podrá ejercer en cualquier momento sus derechos de acceso, actualización, rectificación y supresión (baja) de la información, comunicándose por los medios de contacto indicados. El tratamiento se rige por la Ley 25.326 de Protección de Datos Personales de la República Argentina.',
  'La revocación de esta autorización produce efectos hacia el futuro y no afecta la validez de las publicaciones o difusiones realizadas con anterioridad a la solicitud de baja.',
  CONTACTO_FEHACIENTE,
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

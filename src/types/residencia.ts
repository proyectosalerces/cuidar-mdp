/**
 * Types for residencias (senior care facilities)
 */

export type TipoCuidado =
  | 'internacion-permanente'
  | 'internacion-temporal'
  | 'centro-de-dia'
  | 'rehabilitacion'
  | 'cuidados-paliativos'
  | 'alzheimer-demencia'
  | 'convalecencia';

export type EstadoHabilitacion = 'si' | 'no' | 'en-tramite';

export interface Residencia {
  id: string;
  nombre: string;
  slug: string;
  descripcion: string;
  descripcionCorta: string;
  direccion: string;
  barrio: string;
  ciudad: string;
  telefono: string;
  email?: string;
  website?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  /** Visibility toggles – control which contact fields are shown publicly */
  mostrarTelefono?: boolean;
  mostrarWhatsapp?: boolean;
  mostrarEmail?: boolean;
  coordenadas?: { lat: number; lng: number };
  imagenes: string[];
  imagenPrincipal: string;
  tiposCuidado: TipoCuidado[];
  servicios: string[];
  habilitada: boolean;
  habilitacionMunicipal?: EstadoHabilitacion;
  habilitacionProvincial?: EstadoHabilitacion;
  mostrarHabilitaciones?: boolean;
  verificada: boolean;
  precioDesde?: number;
  precioHasta?: number;
  rangoPrecios?: string;
  calificacion: number;
  cantidadResenas: number;
  horarioVisitas?: string;
  capacidad?: number;
  anioFundacion?: number;
  destacada: boolean;
  /** Premium tier: appears first (home + listing) with a distinctive frame */
  superDestacada?: boolean;
  activa: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FiltrosResidencia {
  barrio?: string;
  tipoCuidado?: TipoCuidado;
  precioMin?: number;
  precioMax?: number;
  habilitada?: boolean;
  verificada?: boolean;
  calificacionMin?: number;
  busqueda?: string;
  ordenarPor?: 'calificacion' | 'precio-asc' | 'precio-desc' | 'nombre';
}

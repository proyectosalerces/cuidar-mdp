/**
 * Types for contact-link click tracking.
 *
 * Anonymous events: which contact link a visitor tapped and toward which
 * entity. No personal data of the visitor is stored.
 */

export type CanalClick =
  | 'whatsapp'
  | 'telefono'
  | 'email'
  | 'web'
  | 'ver-ficha'
  | 'instagram'
  | 'facebook';

export type ClickEntidadTipo = 'residencia' | 'profesional' | 'general';

export interface ClickEvento {
  id: string;
  canal: CanalClick;
  entidadTipo: ClickEntidadTipo;
  entidadId: string;
  entidadNombre: string;
  fecha: string; // ISO date
}

export const CANAL_LABELS: Record<CanalClick, string> = {
  whatsapp: 'WhatsApp',
  telefono: 'Teléfono',
  email: 'Email',
  web: 'Sitio web',
  'ver-ficha': 'Ver ficha',
  instagram: 'Instagram',
  facebook: 'Facebook',
};

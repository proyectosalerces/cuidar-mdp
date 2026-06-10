/**
 * Application-wide constants
 */

import type { SelectOption, SocialLink, NavItem } from '@/types/common';
import type { TipoCuidado } from '@/types/residencia';
import type { Especialidad } from '@/types/profesional';

// ─── Site Info ───────────────────────────────────────────────────────────────

export const SITE_NAME = 'Cuidar MdP';
export const SITE_TAGLINE = 'El cuidado que merecen, cerca de casa';
export const SITE_DESCRIPTION =
  'Consultora de recomendación de residencias geriátricas y profesionales de salud en Mar del Plata. Te ayudamos a encontrar el mejor lugar para el cuidado de tu ser querido.';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://cuidarmdp.com.ar';

// ─── Contact ─────────────────────────────────────────────────────────────────

export const CONTACT_EMAIL = 'info@cuidarmdp.com.ar';
export const CONTACT_PHONE = '+54 9 223 540-9226';
export const WHATSAPP_NUMBER = '5492235409226';

// ─── Social Links ────────────────────────────────────────────────────────────

export const SOCIAL_LINKS: SocialLink[] = [
  { platform: 'instagram', url: 'https://instagram.com/cuidarmdp', label: 'Instagram' },
  { platform: 'facebook', url: 'https://facebook.com/cuidarmdp', label: 'Facebook' },
  { platform: 'whatsapp', url: `https://wa.me/${WHATSAPP_NUMBER}`, label: 'WhatsApp' },
  { platform: 'linkedin', url: 'https://linkedin.com/company/cuidarmdp', label: 'LinkedIn' },
];

// ─── Navigation ──────────────────────────────────────────────────────────────

export const NAV_ITEMS: NavItem[] = [
  { label: 'Inicio', href: '/' },
  { label: 'Residencias', href: '/residencias' },
  { label: 'Profesionales', href: '/profesionales' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contacto', href: '/contacto' },
];

// ─── Mar del Plata Neighborhoods ─────────────────────────────────────────────

export const BARRIOS_MDP: SelectOption[] = [
  { value: 'centro', label: 'Centro' },
  { value: 'la-perla', label: 'La Perla' },
  { value: 'constitucion', label: 'Constitución' },
  { value: 'los-troncos', label: 'Los Troncos' },
  { value: 'playa-grande', label: 'Playa Grande' },
  { value: 'guemes', label: 'Güemes' },
  { value: 'punta-mogotes', label: 'Punta Mogotes' },
  { value: 'san-jose', label: 'San José' },
  { value: 'puerto', label: 'Puerto' },
  { value: 'don-bosco', label: 'Don Bosco' },
  { value: 'san-carlos', label: 'San Carlos' },
  { value: 'san-juan', label: 'San Juan' },
  { value: 'nueva-pompeya', label: 'Nueva Pompeya' },
  { value: 'las-avenidas', label: 'Las Avenidas' },
  { value: 'bosque-alegre', label: 'Bosque Alegre' },
  { value: 'chapadmalal', label: 'Chapadmalal' },
  { value: 'sierra-de-los-padres', label: 'Sierra de los Padres' },
  { value: 'camet', label: 'Camet' },
  { value: 'zona-norte', label: 'Zona Norte' },
  { value: 'zona-oeste', label: 'Zona Oeste' },
];

// ─── Care Type Labels ────────────────────────────────────────────────────────

export const TIPOS_CUIDADO_LABELS: Record<TipoCuidado, string> = {
  'internacion-permanente': 'Internación permanente',
  'internacion-temporal': 'Internación temporal',
  'centro-de-dia': 'Centro de día',
  'rehabilitacion': 'Rehabilitación',
  'cuidados-paliativos': 'Cuidados paliativos',
  'alzheimer-demencia': 'Alzheimer y demencia',
  'convalecencia': 'Convalecencia',
};

export const TIPOS_CUIDADO_OPTIONS: SelectOption[] = Object.entries(TIPOS_CUIDADO_LABELS).map(
  ([value, label]) => ({ value, label })
);

// ─── Specialty Labels ────────────────────────────────────────────────────────

export const ESPECIALIDAD_LABELS: Record<Especialidad, string> = {
  geriatra: 'Geriatra',
  gerontologo: 'Gerontólogo/a',
  kinesiologia: 'Kinesiología',
  psicologia: 'Psicología',
  neurologia: 'Neurología',
  nutricion: 'Nutrición',
  'terapia-ocupacional': 'Terapia ocupacional',
  enfermeria: 'Enfermería',
  'trabajo-social': 'Trabajo social',
};

export const ESPECIALIDAD_OPTIONS: SelectOption[] = Object.entries(ESPECIALIDAD_LABELS).map(
  ([value, label]) => ({ value, label })
);

// ─── Price Range Options ─────────────────────────────────────────────────────

export const RANGOS_PRECIO: SelectOption[] = [
  { value: '0-400000', label: 'Hasta $400.000' },
  { value: '400000-600000', label: '$400.000 – $600.000' },
  { value: '600000-800000', label: '$600.000 – $800.000' },
  { value: '800000-1200000', label: '$800.000 – $1.200.000' },
  { value: '1200000+', label: 'Más de $1.200.000' },
];

// ─── Pagination ──────────────────────────────────────────────────────────────

export const DEFAULT_PAGE_SIZE = 12;

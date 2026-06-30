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

export const CONTACT_EMAIL = 'info@cuidarmdp.com';
export const CONTACT_PHONE = '+54 9 2236 94-8075';
export const WHATSAPP_NUMBER = '5492236948075';

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
  { label: 'Mapa', href: '/mapa' },
  { label: 'Profesionales', href: '/profesionales' },
  { label: 'Blog', href: '/blog' },
  { label: 'Contacto', href: '/contacto' },
];

// ─── Mar del Plata Neighborhoods ─────────────────────────────────────────────

export const BARRIOS_MDP: SelectOption[] = [
  { value: 'aeroparque', label: 'Aeroparque' },
  { value: 'alfar', label: 'Alfar' },
  { value: 'antartida-argentina', label: 'Antártida Argentina' },
  { value: 'area-centro', label: 'Área Centro' },
  { value: 'batan', label: 'Batán' },
  { value: 'belgrano', label: 'Belgrano' },
  { value: 'belisario-roldan', label: 'Belisario Roldán' },
  { value: 'bosque-alegre', label: 'Bosque Alegre' },
  { value: 'bosque-grande', label: 'Bosque Grande' },
  { value: 'bosque-peralta-ramos', label: 'Bosque Peralta Ramos' },
  { value: 'caisamar', label: 'Caisamar' },
  { value: 'camet', label: 'Camet' },
  { value: 'centenario', label: 'Centenario' },
  { value: 'centro', label: 'Centro' },
  { value: 'cerrito', label: 'Cerrito' },
  { value: 'cerrito-sur', label: 'Cerrito Sur' },
  { value: 'chauvin', label: 'Chauvín' },
  { value: 'colina-alegre', label: 'Colina Alegre' },
  { value: 'colinas-de-peralta-ramos', label: 'Colinas de Peralta Ramos' },
  { value: 'constitucion', label: 'Constitución' },
  { value: 'coronel-dorrego', label: 'Coronel Dorrego' },
  { value: 'costa-azul', label: 'Costa Azul' },
  { value: 'de-la-plaza', label: 'De la Plaza' },
  { value: 'del-puerto', label: 'Del Puerto' },
  { value: 'divino-rostro', label: 'Divino Rostro' },
  { value: 'don-bosco', label: 'Don Bosco' },
  { value: 'don-emilio', label: 'Don Emilio' },
  { value: 'dos-de-abril', label: 'Dos de Abril' },
  { value: 'el-boqueron', label: 'El Boquerón' },
  { value: 'el-colmenar', label: 'El Colmenar' },
  { value: 'el-gaucho', label: 'El Gaucho' },
  { value: 'el-grosellar', label: 'El Grosellar' },
  { value: 'el-jardin-de-peralta-ramos', label: 'El Jardín de Peralta Ramos' },
  { value: 'el-jardin-de-stella-maris', label: 'El Jardín de Stella Maris' },
  { value: 'el-marquesado', label: 'El Marquesado' },
  { value: 'el-martillo', label: 'El Martillo' },
  { value: 'el-progreso', label: 'El Progreso' },
  { value: 'estrada', label: 'Estrada' },
  { value: 'faro', label: 'Faro' },
  { value: 'faro-norte', label: 'Faro Norte' },
  { value: 'florentino-ameghino', label: 'Florentino Ameghino' },
  { value: 'florida', label: 'Florida' },
  { value: 'fray-luis-beltran', label: 'Fray Luis Beltrán' },
  { value: 'general-pueyrredon', label: 'General Pueyrredón' },
  { value: 'general-roca', label: 'General Roca' },
  { value: 'general-san-martin', label: 'General San Martín' },
  { value: 'guemes', label: 'Güemes' },
  { value: 'hipodromo', label: 'Hipódromo' },
  { value: 'jose-hernandez', label: 'José Hernández' },
  { value: 'juan-de-las-heras', label: 'Juan de las Heras' },
  { value: 'juramento', label: 'Juramento' },
  { value: 'la-florida', label: 'La Florida' },
  { value: 'la-gloria-de-la-peregrina', label: 'La Gloria de la Peregrina' },
  { value: 'la-herradura', label: 'La Herradura' },
  { value: 'la-perla', label: 'La Perla' },
  { value: 'la-peregrina', label: 'La Peregrina' },
  { value: 'las-americas', label: 'Las Américas' },
  { value: 'las-avenidas', label: 'Las Avenidas' },
  { value: 'las-canteras', label: 'Las Canteras' },
  { value: 'las-heras', label: 'Las Heras' },
  { value: 'las-lilas', label: 'Las Lilas' },
  { value: 'las-margaritas', label: 'Las Margaritas' },
  { value: 'leandro-alem', label: 'Leandro N. Alem' },
  { value: 'libertad', label: 'Libertad' },
  { value: 'lomas-de-stella-maris', label: 'Lomas de Stella Maris' },
  { value: 'lomas-del-golf', label: 'Lomas del Golf' },
  { value: 'los-acantilados', label: 'Los Acantilados' },
  { value: 'los-andes', label: 'Los Andes' },
  { value: 'los-pinares', label: 'Los Pinares' },
  { value: 'los-tilos', label: 'Los Tilos' },
  { value: 'los-troncos', label: 'Los Troncos' },
  { value: 'lourdes', label: 'Lourdes' },
  { value: 'malvinas-argentinas', label: 'Malvinas Argentinas' },
  { value: 'montemar', label: 'Montemar' },
  { value: 'jorge-newbery', label: 'Newbery' },
  { value: 'nueva-pompeya', label: 'Nueva Pompeya' },
  { value: 'nueve-de-julio', label: 'Nueve de Julio' },
  { value: 'nuevo-golf', label: 'Nuevo Golf' },
  { value: 'parque-camet', label: 'Parque Camet' },
  { value: 'parque-hermoso', label: 'Parque Hermoso' },
  { value: 'parque-independencia', label: 'Parque Independencia' },
  { value: 'parque-industrial', label: 'Parque Industrial' },
  { value: 'parque-la-florida', label: 'Parque La Florida' },
  { value: 'parque-luro', label: 'Parque Luro' },
  { value: 'parque-palermo', label: 'Parque Palermo' },
  { value: 'parque-pena', label: 'Parque Peña' },
  { value: 'peralta-ramos-oeste', label: 'Peralta Ramos Oeste' },
  { value: 'pinos-de-anchorena', label: 'Pinos de Anchorena' },
  { value: 'playa-grande', label: 'Playa Grande' },
  { value: 'playa-serena', label: 'Playa Serena' },
  { value: 'plaza-peralta-ramos', label: 'Plaza Peralta Ramos' },
  { value: 'primera-junta', label: 'Primera Junta' },
  { value: 'pueyrredon', label: 'Pueyrredón' },
  { value: 'punta-mogotes', label: 'Punta Mogotes' },
  { value: 'regional', label: 'Regional' },
  { value: 'rivadavia', label: 'Rivadavia' },
  { value: 'san-antonio', label: 'San Antonio' },
  { value: 'san-carlos', label: 'San Carlos' },
  { value: 'san-cayetano', label: 'San Cayetano' },
  { value: 'san-eduardo', label: 'San Eduardo' },
  { value: 'san-jose', label: 'San José' },
  { value: 'san-juan', label: 'San Juan' },
  { value: 'san-martin', label: 'San Martín' },
  { value: 'san-patricio', label: 'San Patricio' },
  { value: 'san-salvador', label: 'San Salvador' },
  { value: 'santa-celina', label: 'Santa Celina' },
  { value: 'santa-monica', label: 'Santa Mónica' },
  { value: 'santa-paula', label: 'Santa Paula' },
  { value: 'santa-rita', label: 'Santa Rita' },
  { value: 'santa-rosa-de-lima', label: 'Santa Rosa de Lima' },
  { value: 'sarmiento', label: 'Sarmiento' },
  { value: 'sierra-de-los-padres', label: 'Sierra de los Padres' },
  { value: 'stella-maris', label: 'Stella Maris' },
  { value: 'termas-huinco', label: 'Termas Huinco' },
  { value: 'villa-primera', label: 'Villa Primera' },
  { value: 'virgen-de-lujan', label: 'Virgen de Luján' },
  { value: 'zacagnini', label: 'Zacagnini' },
  { value: 'chapadmalal', label: 'Chapadmalal' },
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
  'cuidador-domiciliario': 'Cuidador/a Domiciliario/a',
  'auxiliar-gerontologico': 'Auxiliar Gerontológico/a',
  'auxiliar-familia': 'Auxiliar de Familia',
  'cuidados-paliativos': 'Cuidados Paliativos',
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

/**
 * Mock data for healthcare professionals in Mar del Plata.
 * Includes real professionals (publicly listed) and fictional ones to fill the directory.
 */

import type { Profesional } from '@/types/profesional';

const AVATAR = '/images/profesionales/placeholder.jpg';

export const mockProfesionales: Profesional[] = [
  // ── Real professionals (publicly listed) ──────────────────────────────────

  {
    id: 'prof-001',
    nombre: 'Dra. Patricia Pérez Catán',
    slug: 'dra-patricia-perez-catan',
    especialidad: 'geriatra',
    matricula: 'MP 12345',
    descripcion:
      'Médica geriatra con amplia experiencia en el cuidado integral del adulto mayor. Atención personalizada enfocada en la prevención, diagnóstico y tratamiento de patologías propias del envejecimiento. Consultorio en el centro de Mar del Plata.',
    direccionConsultorio: 'Catamarca 2726',
    barrio: 'Centro',
    telefono: '(0223) 494-0000',
    foto: AVATAR,
    calificacion: 4.8,
    cantidadResenas: 45,
    obrasSociales: ['PAMI', 'OSDE', 'Swiss Medical'],
    horarioAtencion: 'Lunes a viernes, 9:00 a 17:00',
    activo: true,
    createdAt: '2024-02-01T10:00:00Z',
  },

  {
    id: 'prof-002',
    nombre: 'Dra. Ruth Brugger',
    slug: 'dra-ruth-brugger',
    especialidad: 'geriatra',
    matricula: 'MP 11890',
    descripcion:
      'Especialista en geriatría y gerontología clínica. Abordaje integral del paciente mayor con énfasis en la evaluación funcional, cognitiva y emocional. Más de 20 años de trayectoria en Mar del Plata.',
    direccionConsultorio: 'Córdoba 4545',
    barrio: 'Centro',
    telefono: '(0223) 495-0000',
    foto: AVATAR,
    calificacion: 4.7,
    cantidadResenas: 52,
    obrasSociales: ['PAMI', 'Galeno', 'Medifé'],
    horarioAtencion: 'Lunes, miércoles y viernes, 8:30 a 14:00',
    activo: true,
    createdAt: '2024-02-05T10:00:00Z',
  },

  {
    id: 'prof-003',
    nombre: 'Dra. Victoria Menendez',
    slug: 'dra-victoria-menendez',
    especialidad: 'geriatra',
    matricula: 'MP 14230',
    descripcion:
      'Geriatra dedicada a la atención domiciliaria y en consultorio de adultos mayores. Enfoque centrado en la calidad de vida, autonomía y dignidad de cada paciente. Trabaja en red con kinesiólogos, psicólogos y nutricionistas.',
    direccionConsultorio: 'Alvear 2810',
    barrio: 'Centro',
    telefono: '(0223) 493-0000',
    foto: AVATAR,
    calificacion: 4.6,
    cantidadResenas: 33,
    obrasSociales: ['PAMI', 'IOMA', 'OSECAC'],
    horarioAtencion: 'Martes y jueves, 10:00 a 16:00',
    activo: true,
    createdAt: '2024-03-01T10:00:00Z',
  },

  {
    id: 'prof-004',
    nombre: 'Dr. Marcelo A. Lauría',
    slug: 'dr-marcelo-lauria',
    especialidad: 'gerontologo',
    matricula: 'MP 10560',
    descripcion:
      'Gerontólogo con vasta experiencia en la dirección y asesoramiento de residencias geriátricas. Director médico de Nuestros Sabios. Especializado en evaluación geriátrica integral y planificación de cuidados a largo plazo.',
    direccionConsultorio: 'Artigas 1549',
    barrio: 'Constitución',
    telefono: '(0223) 479-3500',
    foto: AVATAR,
    calificacion: 4.9,
    cantidadResenas: 68,
    obrasSociales: ['PAMI', 'OSDE', 'Galeno', 'Medifé'],
    horarioAtencion: 'Lunes a viernes, 8:00 a 13:00',
    activo: true,
    createdAt: '2024-01-15T10:00:00Z',
  },

  // ── Fictional professionals ───────────────────────────────────────────────

  {
    id: 'prof-005',
    nombre: 'Lic. Martín Echeverría',
    slug: 'lic-martin-echeverria',
    especialidad: 'kinesiologia',
    matricula: 'MN 8920',
    descripcion:
      'Kinesiólogo especializado en rehabilitación geriátrica y prevención de caídas. Trabaja con programas de movilidad, equilibrio y fortalecimiento muscular adaptados a las necesidades de cada paciente mayor.',
    direccionConsultorio: 'San Martín 3450',
    barrio: 'Centro',
    telefono: '(0223) 492-1100',
    foto: AVATAR,
    calificacion: 4.5,
    cantidadResenas: 28,
    obrasSociales: ['PAMI', 'IOMA'],
    horarioAtencion: 'Lunes a viernes, 8:00 a 18:00',
    activo: true,
    createdAt: '2024-04-01T10:00:00Z',
  },

  {
    id: 'prof-006',
    nombre: 'Lic. Carolina Fontana',
    slug: 'lic-carolina-fontana',
    especialidad: 'psicologia',
    matricula: 'MP 15670',
    descripcion:
      'Psicóloga clínica especializada en psicogerontología. Acompañamiento terapéutico a adultos mayores y sus familias en procesos de duelo, adaptación a la institucionalización y manejo de ansiedad y depresión.',
    direccionConsultorio: 'Belgrano 3820',
    barrio: 'La Perla',
    telefono: '(0223) 473-5500',
    foto: AVATAR,
    calificacion: 4.7,
    cantidadResenas: 39,
    obrasSociales: ['PAMI', 'OSDE', 'Swiss Medical'],
    horarioAtencion: 'Martes a sábado, 9:00 a 19:00',
    activo: true,
    createdAt: '2024-04-15T10:00:00Z',
  },

  {
    id: 'prof-007',
    nombre: 'Lic. Agustina Romero',
    slug: 'lic-agustina-romero',
    especialidad: 'nutricion',
    matricula: 'MN 9430',
    descripcion:
      'Nutricionista con orientación en geriatría. Diseña planes alimentarios adaptados a las necesidades nutricionales del adulto mayor, considerando patologías crónicas, dificultades deglutorias y preferencias individuales.',
    direccionConsultorio: 'Rivadavia 2150',
    barrio: 'Centro',
    telefono: '(0223) 491-7800',
    foto: AVATAR,
    calificacion: 4.4,
    cantidadResenas: 21,
    obrasSociales: ['PAMI', 'Galeno'],
    horarioAtencion: 'Lunes, miércoles y viernes, 10:00 a 16:00',
    activo: true,
    createdAt: '2024-05-01T10:00:00Z',
  },

  {
    id: 'prof-008',
    nombre: 'Dr. Federico Ibáñez',
    slug: 'dr-federico-ibanez',
    especialidad: 'neurologia',
    matricula: 'MP 13780',
    descripcion:
      'Neurólogo con subespecialidad en neurología cognitiva y demencias. Diagnóstico y seguimiento de Alzheimer, Parkinson y otras enfermedades neurodegenerativas. Trabaja en conjunto con el equipo de GAMA.',
    direccionConsultorio: 'Rawson 3145',
    barrio: 'Centro',
    telefono: '(0223) 495-8652',
    foto: AVATAR,
    calificacion: 4.8,
    cantidadResenas: 56,
    obrasSociales: ['PAMI', 'OSDE', 'Medifé', 'Swiss Medical'],
    horarioAtencion: 'Lunes a jueves, 9:00 a 15:00',
    activo: true,
    createdAt: '2024-03-10T10:00:00Z',
  },

  {
    id: 'prof-009',
    nombre: 'Lic. Soledad Aguirre',
    slug: 'lic-soledad-aguirre',
    especialidad: 'terapia-ocupacional',
    matricula: 'MN 7650',
    descripcion:
      'Terapista ocupacional especializada en adultos mayores. Trabaja en la adaptación del entorno, entrenamiento en actividades de la vida diaria y estimulación de la funcionalidad para promover la mayor autonomía posible.',
    direccionConsultorio: 'Güemes 2980',
    barrio: 'Güemes',
    telefono: '(0223) 486-3300',
    foto: AVATAR,
    calificacion: 4.3,
    cantidadResenas: 17,
    obrasSociales: ['PAMI', 'IOMA'],
    horarioAtencion: 'Martes y jueves, 8:00 a 14:00',
    activo: true,
    createdAt: '2024-05-15T10:00:00Z',
  },

  {
    id: 'prof-010',
    nombre: 'Lic. Gonzalo Pereyra',
    slug: 'lic-gonzalo-pereyra',
    especialidad: 'kinesiologia',
    matricula: 'MN 10120',
    descripcion:
      'Kinesiólogo con formación en rehabilitación neurológica y respiratoria. Atiende a domicilio y en consultorio. Especializado en recuperación post-ACV y movilidad en adultos mayores con limitaciones funcionales.',
    direccionConsultorio: 'Alem 4210',
    barrio: 'Los Troncos',
    telefono: '(0223) 486-9900',
    foto: AVATAR,
    calificacion: 4.6,
    cantidadResenas: 31,
    obrasSociales: ['PAMI', 'OSDE', 'IOMA'],
    horarioAtencion: 'Lunes a viernes, 7:00 a 15:00',
    activo: true,
    createdAt: '2024-06-01T10:00:00Z',
  },

  {
    id: 'prof-011',
    nombre: 'Lic. María Eugenia Torres',
    slug: 'lic-maria-eugenia-torres',
    especialidad: 'trabajo-social',
    matricula: 'CPAS 4520',
    descripcion:
      'Trabajadora social especializada en gerontología comunitaria. Asesora a familias en la búsqueda de residencias, trámites de PAMI y articulación con servicios sociales municipales y provinciales.',
    direccionConsultorio: 'Moreno 3150',
    barrio: 'Centro',
    telefono: '(0223) 494-2200',
    foto: AVATAR,
    calificacion: 4.5,
    cantidadResenas: 24,
    obrasSociales: ['PAMI'],
    horarioAtencion: 'Lunes a viernes, 9:00 a 13:00',
    activo: true,
    createdAt: '2024-06-15T10:00:00Z',
  },

  {
    id: 'prof-012',
    nombre: 'Lic. Daniela Quiroga',
    slug: 'lic-daniela-quiroga',
    especialidad: 'psicologia',
    matricula: 'MP 16890',
    descripcion:
      'Psicóloga clínica con orientación sistémica. Acompaña a familias en el proceso de decisión sobre el cuidado de sus mayores, facilitando la comunicación y el manejo del estrés del cuidador. Atención presencial y virtual.',
    direccionConsultorio: 'Mitre 2680',
    barrio: 'Centro',
    telefono: '(0223) 491-4400',
    foto: AVATAR,
    calificacion: 4.4,
    cantidadResenas: 19,
    obrasSociales: ['PAMI', 'Galeno', 'OSECAC'],
    horarioAtencion: 'Lunes, miércoles y viernes, 14:00 a 20:00',
    activo: true,
    createdAt: '2024-07-01T10:00:00Z',
  },
];

/**
 * Mock reviews (reseñas) for residencias and profesionales.
 *
 * All reviews start as approved (`aprobada: true`) so public lists
 * are pre-populated. New user-submitted reviews go through admin
 * approval via the service layer.
 */

import type { Resena } from '@/types/resena';

export const mockResenas: Resena[] = [
  // ── Residencia Seniors (res-002) ──────────────────────────────────────────
  {
    id: 'rev-001',
    autorId: 'user-001',
    autorNombre: 'María González',
    autorEmail: 'maria.gonzalez@email.com',
    entidadId: 'res-002',
    entidadTipo: 'residencia',
    calificacion: 5,
    titulo: 'Excelente atención y calidez humana',
    comentario:
      'Mi mamá está en Residencia Seniors hace más de un año y estamos muy conformes. El equipo de enfermería es atento las 24 horas, las instalaciones están siempre impecables y las actividades recreativas le devolvieron la alegría. Totalmente recomendable.',
    fecha: '2026-04-12T14:30:00Z',
    aprobada: true,
  },
  {
    id: 'rev-002',
    autorId: 'user-002',
    autorNombre: 'Carlos Fernández',
    autorEmail: 'carlos.fernandez@email.com',
    entidadId: 'res-002',
    entidadTipo: 'residencia',
    calificacion: 4,
    titulo: 'Muy buena residencia, algo cara',
    comentario:
      'La calidad de atención es muy buena y el personal siempre está disponible. Lo único que podría mejorar es la relación precio-calidad, ya que el costo mensual es elevado para la zona. Igualmente vale la pena por la tranquilidad que te da.',
    fecha: '2026-03-28T10:15:00Z',
    aprobada: true,
  },
  {
    id: 'rev-003',
    autorId: 'user-003',
    autorNombre: 'Ana Laura Martínez',
    autorEmail: 'analaura.martinez@email.com',
    entidadId: 'res-002',
    entidadTipo: 'residencia',
    calificacion: 5,
    titulo: 'Le cambiaron la vida a mi papá',
    comentario:
      'Después de probar varios lugares, encontramos Seniors y fue un antes y un después. La musicoterapia y el yoga le hicieron muy bien a mi papá. El equipo interdisciplinario se comunica con nosotros regularmente y siempre están pendientes de cada detalle.',
    fecha: '2026-02-15T16:45:00Z',
    aprobada: true,
  },

  // ── Geriátrico Casablanca (res-002) ───────────────────────────────────────
  {
    id: 'rev-004',
    autorId: 'user-004',
    autorNombre: 'Roberto Díaz',
    autorEmail: 'roberto.diaz@email.com',
    entidadId: 'res-002',
    entidadTipo: 'residencia',
    calificacion: 4,
    titulo: 'Buen lugar, ambiente familiar',
    comentario:
      'Casablanca tiene un ambiente muy cálido y familiar. Mi abuela se adaptó rápido gracias al trato del personal. La ubicación céntrica facilita las visitas. Las actividades recreativas podrían ser más variadas, pero en general estamos conformes.',
    fecha: '2026-05-02T09:20:00Z',
    aprobada: true,
  },
  {
    id: 'rev-005',
    autorId: 'user-005',
    autorNombre: 'Silvia Romero',
    autorEmail: 'silvia.romero@email.com',
    entidadId: 'res-002',
    entidadTipo: 'residencia',
    calificacion: 4,
    titulo: 'Buena atención médica',
    comentario:
      'La atención médica es muy buena y la alimentación está supervisada por nutricionistas, lo cual nos da mucha tranquilidad. El personal de enfermería es amable y profesional. Recomendable para quienes buscan algo céntrico y accesible.',
    fecha: '2026-01-18T11:00:00Z',
    aprobada: true,
  },

  // ── Nuestros Sabios (res-003) ─────────────────────────────────────────────
  {
    id: 'rev-006',
    autorId: 'user-006',
    autorNombre: 'Laura Pereyra',
    autorEmail: 'laura.pereyra@email.com',
    entidadId: 'res-003',
    entidadTipo: 'residencia',
    calificacion: 5,
    titulo: 'Las actividades son increíbles',
    comentario:
      'Mi suegra va al centro de día de Nuestros Sabios y cada vez que la vamos a buscar está feliz. La musicoterapia, el teatro y los talleres de memoria la mantienen activa y con ganas de seguir. El equipo multidisciplinario es de primera.',
    fecha: '2026-05-10T15:30:00Z',
    aprobada: true,
  },
  {
    id: 'rev-007',
    autorId: 'user-007',
    autorNombre: 'Gustavo Méndez',
    autorEmail: 'gustavo.mendez@email.com',
    entidadId: 'res-003',
    entidadTipo: 'residencia',
    calificacion: 5,
    titulo: 'Un lugar con alma',
    comentario:
      'Lo que más valoro de Nuestros Sabios es el trato humano. Se nota que cada profesional ama lo que hace. Mi mamá internada ahí recibe un cuidado que supera nuestras expectativas. El yoga y las actividades al aire libre son un plus enorme.',
    fecha: '2026-04-05T08:00:00Z',
    aprobada: true,
  },

  // ── Residencia Las Moras – Rodríguez Peña (res-005) ──────────────────────
  {
    id: 'rev-008',
    autorId: 'user-008',
    autorNombre: 'Patricia López',
    autorEmail: 'patricia.lopez@email.com',
    entidadId: 'res-005',
    entidadTipo: 'residencia',
    calificacion: 5,
    titulo: 'Moderna, limpia y bien organizada',
    comentario:
      'Las Moras es una residencia muy moderna. Tiene Wi-Fi en todos los ambientes, el jardín con solarium es hermoso y la enfermería 24 hs nos da una tranquilidad total. Mi papá estuvo en convalecencia y la atención fue impecable.',
    fecha: '2026-03-15T13:00:00Z',
    aprobada: true,
  },
  {
    id: 'rev-009',
    autorId: 'user-009',
    autorNombre: 'Eduardo Sánchez',
    autorEmail: 'eduardo.sanchez@email.com',
    entidadId: 'res-005',
    entidadTipo: 'residencia',
    calificacion: 4,
    titulo: 'Buena experiencia en internación temporal',
    comentario:
      'Usamos el servicio de internación temporal mientras viajábamos y todo salió perfecto. El personal se adaptó a las rutinas de mi madre y nos mantuvo informados en todo momento. El único detalle es que el estacionamiento es limitado.',
    fecha: '2026-02-20T17:45:00Z',
    aprobada: true,
  },

  // ── GAMA – Centro Integral de la Memoria (res-004) ────────────────────────
  {
    id: 'rev-010',
    autorId: 'user-010',
    autorNombre: 'Claudia Ruiz',
    autorEmail: 'claudia.ruiz@email.com',
    entidadId: 'res-004',
    entidadTipo: 'residencia',
    calificacion: 5,
    titulo: 'Referentes en Alzheimer en Mar del Plata',
    comentario:
      'GAMA es el mejor centro especializado en memoria de la zona. Los neuropsicólogos diseñaron un programa personalizado para mi mamá con Alzheimer y los avances fueron notables. Es un lugar donde realmente saben lo que hacen.',
    fecha: '2026-05-20T10:30:00Z',
    aprobada: true,
  },
  {
    id: 'rev-011',
    autorId: 'user-011',
    autorNombre: 'Fernando Aguirre',
    autorEmail: 'fernando.aguirre@email.com',
    entidadId: 'res-004',
    entidadTipo: 'residencia',
    calificacion: 5,
    titulo: 'Profesionalismo de primer nivel',
    comentario:
      'Llevamos a mi padre para una evaluación cognitiva y el equipo de GAMA fue extremadamente profesional. Los programas de estimulación cognitiva son muy completos y se nota la experiencia del equipo. No dudamos en recomendarlo.',
    fecha: '2026-04-28T14:00:00Z',
    aprobada: true,
  },

  // ── Hogares MdP – Jose Ignacio (res-017) ─────────────────────────────────
  {
    id: 'rev-012',
    autorId: 'user-012',
    autorNombre: 'Marcela Vidal',
    autorEmail: 'marcela.vidal@email.com',
    entidadId: 'res-017',
    entidadTipo: 'residencia',
    calificacion: 4,
    titulo: 'Especializados en cuidados intensivos',
    comentario:
      'Mi padre necesita cuidados intensivos y en Jose Ignacio encontramos la atención que buscábamos. El equipamiento está adaptado para pacientes dependientes y la enfermería es permanente. El trato humano del personal nos da mucha paz.',
    fecha: '2026-03-05T11:20:00Z',
    aprobada: true,
  },

  // ── Los Alerces Hogar (res-001) ──────────────────────────────────────────
  {
    id: 'rev-013',
    autorId: 'user-013',
    autorNombre: 'Alejandra Campos',
    autorEmail: 'alejandra.campos@email.com',
    entidadId: 'res-001',
    entidadTipo: 'residencia',
    calificacion: 5,
    titulo: 'El enfoque cultural es único',
    comentario:
      'Lo que más nos gustó de Los Alerces es su propuesta cultural. Mi abuela participa de talleres de literatura y danza terapéutica, y dice que se siente como en su propia casa. El equipo interdisciplinario es muy completo y atento.',
    fecha: '2026-04-18T09:00:00Z',
    aprobada: true,
  },

  // ── Mamá Sara – Sede Edison (res-012) ────────────────────────────────────
  {
    id: 'rev-014',
    autorId: 'user-014',
    autorNombre: 'Jorge Castillo',
    autorEmail: 'jorge.castillo@email.com',
    entidadId: 'res-012',
    entidadTipo: 'residencia',
    calificacion: 3,
    titulo: 'Correcto pero mejorable',
    comentario:
      'La residencia cumple con lo básico y el personal es amable, pero sentimos que las actividades de autonomía podrían ser más variadas. Los espacios verdes son un punto a favor. En general es una opción correcta para la zona norte.',
    fecha: '2026-01-25T16:00:00Z',
    aprobada: true,
  },

  // ── Profesionales ─────────────────────────────────────────────────────────

  // Dra. Patricia Pérez Catán (prof-001)
  {
    id: 'rev-015',
    autorId: 'user-015',
    autorNombre: 'Beatriz Morales',
    autorEmail: 'beatriz.morales@email.com',
    entidadId: 'prof-001',
    entidadTipo: 'profesional',
    calificacion: 5,
    titulo: 'Una profesional excepcional',
    comentario:
      'La Dra. Pérez Catán es una geriatra de primera. Trató a mi mamá con mucha dedicación, nos explicó todo con paciencia y siempre está disponible para consultas. Su enfoque preventivo nos ayudó mucho a mejorar la calidad de vida de mi madre.',
    fecha: '2026-05-15T10:00:00Z',
    aprobada: true,
  },
  {
    id: 'rev-016',
    autorId: 'user-016',
    autorNombre: 'Ricardo Herrera',
    autorEmail: 'ricardo.herrera@email.com',
    entidadId: 'prof-001',
    entidadTipo: 'profesional',
    calificacion: 5,
    titulo: 'Atención personalizada de verdad',
    comentario:
      'Llevo a mi padre con la Dra. Pérez Catán desde hace dos años y la experiencia es inmejorable. Se toma el tiempo para cada consulta, hace seguimiento real y coordina con otros especialistas cuando es necesario. La mejor geriatra de Mar del Plata.',
    fecha: '2026-04-02T14:30:00Z',
    aprobada: true,
  },

  // Dr. Marcelo A. Lauría (prof-004)
  {
    id: 'rev-017',
    autorId: 'user-017',
    autorNombre: 'Susana Paredes',
    autorEmail: 'susana.paredes@email.com',
    entidadId: 'prof-004',
    entidadTipo: 'profesional',
    calificacion: 5,
    titulo: 'El mejor gerontólogo de la ciudad',
    comentario:
      'El Dr. Lauría nos asesoró para elegir la mejor residencia para mi padre y fue clave en todo el proceso. Su evaluación geriátrica integral es muy completa y se nota su vasta experiencia. Un profesional que realmente se compromete con sus pacientes.',
    fecha: '2026-03-20T09:00:00Z',
    aprobada: true,
  },

  // Dr. Federico Ibáñez (prof-008)
  {
    id: 'rev-018',
    autorId: 'user-018',
    autorNombre: 'Mónica Estévez',
    autorEmail: 'monica.estevez@email.com',
    entidadId: 'prof-008',
    entidadTipo: 'profesional',
    calificacion: 4,
    titulo: 'Gran neurólogo, muy claro',
    comentario:
      'El Dr. Ibáñez diagnosticó a mi suegro con Parkinson y nos explicó todo el proceso con mucha claridad. El seguimiento es constante y trabaja en equipo con GAMA, lo cual nos da mucha confianza. La espera para el turno puede ser larga, pero vale la pena.',
    fecha: '2026-02-10T11:00:00Z',
    aprobada: true,
  },

  // Lic. Carolina Fontana (prof-006)
  {
    id: 'rev-019',
    autorId: 'user-019',
    autorNombre: 'Graciela Ríos',
    autorEmail: 'graciela.rios@email.com',
    entidadId: 'prof-006',
    entidadTipo: 'profesional',
    calificacion: 5,
    titulo: 'Nos ayudó muchísimo como familia',
    comentario:
      'La Lic. Fontana nos acompañó en el proceso de institucionalización de mi madre y fue fundamental para toda la familia. Su enfoque en psicogerontología es muy acertado, nos enseñó a manejar la culpa y el duelo. Una profesional con mucha empatía.',
    fecha: '2026-05-08T16:00:00Z',
    aprobada: true,
  },

  // Lic. Martín Echeverría (prof-005)
  {
    id: 'rev-020',
    autorId: 'user-020',
    autorNombre: 'Daniel Acosta',
    autorEmail: 'daniel.acosta@email.com',
    entidadId: 'prof-005',
    entidadTipo: 'profesional',
    calificacion: 4,
    titulo: 'Mi papá camina mejor gracias a él',
    comentario:
      'El Lic. Echeverría diseñó un programa de rehabilitación para prevención de caídas y los resultados fueron increíbles. Mi papá recuperó equilibrio y confianza para caminar. Es un kinesiólogo muy dedicado y siempre explica cada ejercicio con paciencia.',
    fecha: '2026-04-22T10:30:00Z',
    aprobada: true,
  },
];

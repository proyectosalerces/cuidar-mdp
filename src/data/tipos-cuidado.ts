/**
 * Labeled options for care types (tipos de cuidado).
 * Provides display labels, icons, and descriptions for each care modality.
 */

import type { TipoCuidado } from '@/types/residencia';

export interface TipoCuidadoInfo {
  id: TipoCuidado;
  label: string;
  descripcion: string;
  icono: string; // Emoji icon as placeholder until icon components are added
}

export const tiposCuidado: TipoCuidadoInfo[] = [
  {
    id: 'internacion-permanente',
    label: 'Internación permanente',
    descripcion:
      'Alojamiento y cuidado continuo las 24 horas para adultos mayores que requieren asistencia diaria. Incluye alimentación, atención médica, enfermería y actividades recreativas.',
    icono: '🏠',
  },
  {
    id: 'internacion-temporal',
    label: 'Internación temporal',
    descripcion:
      'Estadías por períodos definidos, ideal para vacaciones del cuidador, post-operatorios o situaciones familiares puntuales. Mismos servicios que la internación permanente.',
    icono: '📅',
  },
  {
    id: 'centro-de-dia',
    label: 'Centro de día',
    descripcion:
      'Programa diurno de actividades terapéuticas, recreativas y sociales. El adulto mayor asiste durante el día y regresa a su hogar por la noche. Incluye almuerzo y merienda.',
    icono: '☀️',
  },
  {
    id: 'rehabilitacion',
    label: 'Rehabilitación',
    descripcion:
      'Programas de recuperación funcional post-quirúrgica o post-ACV. Incluye kinesiología, terapia ocupacional y seguimiento médico intensivo.',
    icono: '💪',
  },
  {
    id: 'cuidados-paliativos',
    label: 'Cuidados paliativos',
    descripcion:
      'Atención integral enfocada en el alivio del dolor y la mejora de la calidad de vida en etapas avanzadas de enfermedades crónicas o terminales.',
    icono: '🤝',
  },
  {
    id: 'alzheimer-demencia',
    label: 'Alzheimer y demencia',
    descripcion:
      'Cuidado especializado para personas con deterioro cognitivo, Alzheimer u otras demencias. Equipos entrenados en estimulación cognitiva y manejo conductual.',
    icono: '🧠',
  },
  {
    id: 'convalecencia',
    label: 'Convalecencia',
    descripcion:
      'Estadía de recuperación post-hospitalaria con seguimiento médico, enfermería y rehabilitación. Ideal para transiciones del hospital al hogar.',
    icono: '🩺',
  },
];

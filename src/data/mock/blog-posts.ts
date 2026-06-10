/**
 * Mock data for blog posts
 * Used during development before Firebase integration
 */

import type { BlogPost } from '@/types/blog';

export const mockBlogPosts: BlogPost[] = [
  {
    id: '1',
    titulo: 'Cómo elegir la mejor residencia geriátrica para tu ser querido',
    slug: 'como-elegir-mejor-residencia-geriatrica',
    extracto:
      'Una guía completa con los factores más importantes a considerar al momento de buscar una residencia geriátrica en Mar del Plata.',
    contenido: `
# Cómo elegir la mejor residencia geriátrica para tu ser querido

Elegir una residencia geriátrica es una de las decisiones más importantes que puede tomar una familia. En esta guía, te acompañamos paso a paso para que puedas evaluar las opciones disponibles en Mar del Plata.

## 1. Evalúa las necesidades de cuidado

Antes de comenzar la búsqueda, es fundamental entender qué tipo de atención necesita el adulto mayor...

## 2. Visita las instalaciones

Nada reemplaza una visita presencial. Observá el estado de limpieza, la iluminación, los espacios comunes...

## 3. Consultá sobre el equipo profesional

Un buen equipo interdisciplinario es clave para la calidad de atención...
    `.trim(),
    imagenPortada: '/images/blog/elegir-residencia.jpg',
    autor: {
      nombre: 'Equipo Cuidar MdP',
      avatar: '/images/team/equipo.jpg',
      bio: 'Equipo de profesionales dedicados al cuidado del adulto mayor.',
    },
    categoria: 'guias',
    tags: ['residencias', 'guía', 'elección', 'consejos'],
    fechaPublicacion: '2024-05-15T10:00:00Z',
    tiempoLectura: 8,
    publicado: true,
  },
  {
    id: '2',
    titulo: 'La importancia de la estimulación cognitiva en adultos mayores',
    slug: 'importancia-estimulacion-cognitiva-adultos-mayores',
    extracto:
      'Descubrí cómo la estimulación cognitiva puede mejorar la calidad de vida y prevenir el deterioro mental en la tercera edad.',
    contenido: `
# La importancia de la estimulación cognitiva en adultos mayores

La estimulación cognitiva es un conjunto de actividades diseñadas para mantener y mejorar las funciones mentales...

## Beneficios comprobados

- Mejora la memoria a corto y largo plazo
- Favorece la concentración y atención
- Reduce el riesgo de demencia
- Mejora el estado de ánimo

## Actividades recomendadas

Desde juegos de mesa hasta talleres de lectura, existen múltiples opciones...
    `.trim(),
    imagenPortada: '/images/blog/estimulacion-cognitiva.jpg',
    autor: {
      nombre: 'Dra. María Elena Gutiérrez',
      avatar: '/images/profesionales/gutierrez.jpg',
      bio: 'Médica geriatra con 15 años de experiencia.',
    },
    categoria: 'salud',
    tags: ['estimulación cognitiva', 'salud mental', 'prevención', 'demencia'],
    fechaPublicacion: '2024-06-01T14:00:00Z',
    tiempoLectura: 6,
    publicado: true,
  },
  {
    id: '3',
    titulo: 'Derechos de los adultos mayores en Argentina: lo que toda familia debe saber',
    slug: 'derechos-adultos-mayores-argentina',
    extracto:
      'Conocé los derechos fundamentales que protegen a los adultos mayores y cómo hacerlos valer ante instituciones de cuidado.',
    contenido: `
# Derechos de los adultos mayores en Argentina

Argentina cuenta con un marco legal que protege los derechos de las personas mayores...

## Marco legal vigente

La Convención Interamericana sobre la Protección de los Derechos Humanos de las Personas Mayores...

## Derechos fundamentales

- Derecho a la vida y a la dignidad en la vejez
- Derecho a la independencia y a la autonomía
- Derecho a la salud
- Derecho a un nivel de vida adecuado
    `.trim(),
    imagenPortada: '/images/blog/derechos-mayores.jpg',
    autor: {
      nombre: 'Equipo Cuidar MdP',
      avatar: '/images/team/equipo.jpg',
    },
    categoria: 'legal',
    tags: ['derechos', 'legal', 'protección', 'leyes'],
    fechaPublicacion: '2024-04-20T09:00:00Z',
    tiempoLectura: 10,
    publicado: true,
  },
  {
    id: '4',
    titulo: 'Nutrición para adultos mayores: guía de alimentación saludable',
    slug: 'nutricion-adultos-mayores-guia-alimentacion',
    extracto:
      'Consejos nutricionales específicos para la tercera edad: qué alimentos priorizar y cómo mantener una dieta equilibrada.',
    contenido: `
# Nutrición para adultos mayores

Una alimentación adecuada es fundamental para mantener la salud en la tercera edad...

## Nutrientes esenciales

- Calcio y Vitamina D para la salud ósea
- Proteínas para mantener la masa muscular
- Fibra para la salud digestiva
- Omega-3 para la salud cardiovascular
    `.trim(),
    imagenPortada: '/images/blog/nutricion-mayores.jpg',
    autor: {
      nombre: 'Equipo Cuidar MdP',
      avatar: '/images/team/equipo.jpg',
    },
    categoria: 'nutricion',
    tags: ['nutrición', 'alimentación', 'salud', 'dieta'],
    fechaPublicacion: '2024-03-10T11:00:00Z',
    tiempoLectura: 7,
    publicado: true,
  },
];

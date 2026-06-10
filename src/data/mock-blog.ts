/**
 * Mock blog posts about geriatric care topics.
 * All content is in Spanish (Argentina).
 */

import type { BlogPost } from '@/types/blog';

export const mockBlogPosts: BlogPost[] = [
  {
    id: 'blog-001',
    titulo: 'Cómo elegir la residencia geriátrica adecuada: guía completa para familias',
    slug: 'como-elegir-residencia-geriatrica-guia-completa',
    extracto:
      'Elegir una residencia geriátrica es una de las decisiones más importantes que una familia puede tomar. En esta guía repasamos los factores clave: habilitación, servicios, ubicación, costos y el bienestar emocional del adulto mayor.',
    contenido: `
## Introducción

Elegir dónde vivirá un ser querido en su vejez no es una decisión sencilla. Requiere información, tiempo y, sobre todo, empatía. En esta guía te ayudamos a evaluar las opciones disponibles en Mar del Plata para que puedas tomar la mejor decisión.

## 1. Verificá la habilitación

Lo primero es confirmar que la residencia cuente con habilitación municipal y provincial vigente. Esto garantiza que cumple con los estándares mínimos de seguridad, infraestructura y atención.

## 2. Conocé al equipo profesional

Un buen geriátrico tiene médicos, enfermeros, kinesiólogos, nutricionistas y acompañantes terapéuticos. Preguntá por la cantidad de profesionales y su disponibilidad horaria.

## 3. Visitá las instalaciones

No te quedes con las fotos. Visitá el lugar en distintos horarios, observá cómo interactúa el personal con los residentes y prestá atención a la limpieza, la iluminación y los espacios comunes.

## 4. Evaluá las actividades

Las actividades de estimulación cognitiva, física y social son esenciales para la calidad de vida. Preguntá por talleres de memoria, musicoterapia, yoga y salidas recreativas.

## 5. Hablá de costos con transparencia

Pedí un desglose de los costos mensuales: cuota base, extras, medicación, pañales, etc. Consultá si aceptan obra social o PAMI.
    `.trim(),
    imagenPortada: '/images/blog/elegir-residencia.jpg',
    autor: {
      nombre: 'Equipo Cuidar MdP',
      bio: 'Consultora especializada en cuidado geriátrico en Mar del Plata.',
    },
    categoria: 'guias',
    tags: ['residencias', 'guía', 'familias', 'elección'],
    fechaPublicacion: '2025-09-15T10:00:00Z',
    tiempoLectura: 8,
    publicado: true,
  },

  {
    id: 'blog-002',
    titulo: 'Los derechos del adulto mayor en Argentina: lo que toda familia debe saber',
    slug: 'derechos-adulto-mayor-argentina',
    extracto:
      'Conocer los derechos que protegen a nuestros mayores es fundamental. Repasamos la legislación argentina vigente, las obligaciones de las residencias y cómo hacer valer estos derechos en la práctica.',
    contenido: `
## Marco legal

La Ley Nacional 27.360 ratifica la Convención Interamericana sobre la Protección de los Derechos Humanos de las Personas Mayores. Esta norma reconoce derechos específicos como la autonomía, la dignidad, la independencia y la participación activa en la comunidad.

## Derechos clave

- Derecho a recibir atención médica integral
- Derecho a la intimidad y la privacidad
- Derecho a no ser discriminado por edad
- Derecho a elegir dónde y con quién vivir
- Derecho a la información sobre su salud

## ¿Qué hacer si se vulneran estos derechos?

Podés acudir a la Defensoría del Pueblo, al INADI o a los organismos provinciales de control de establecimientos geriátricos.
    `.trim(),
    imagenPortada: '/images/blog/derechos-adulto-mayor.jpg',
    autor: {
      nombre: 'Equipo Cuidar MdP',
    },
    categoria: 'legal',
    tags: ['derechos', 'legislación', 'protección', 'PAMI'],
    fechaPublicacion: '2025-10-02T10:00:00Z',
    tiempoLectura: 6,
    publicado: true,
  },

  {
    id: 'blog-003',
    titulo: 'Señales de alerta del Alzheimer: cuándo consultar a un especialista',
    slug: 'senales-alerta-alzheimer-cuando-consultar',
    extracto:
      'Olvidarse las llaves es normal, pero hay señales que pueden indicar algo más. Aprendé a distinguir los olvidos comunes del deterioro cognitivo y cuándo es momento de consultar a un neurólogo o geriatra.',
    contenido: `
## Olvidos normales vs. señales de alerta

Es común que con la edad aparezcan olvidos ocasionales. Sin embargo, cuando estos olvidos afectan la vida cotidiana, podrían indicar un deterioro cognitivo que merece atención profesional.

## Las 10 señales de alerta

1. Pérdida de memoria que afecta la vida diaria
2. Dificultad para planificar o resolver problemas
3. Dificultad para completar tareas habituales
4. Desorientación en tiempo y lugar
5. Problemas con el lenguaje
6. Colocar objetos en lugares inusuales
7. Disminución del juicio
8. Retraimiento social
9. Cambios en el humor y la personalidad
10. Dificultad para comprender imágenes visuales

## ¿A quién consultar?

En Mar del Plata podés acudir a un geriatra, neurólogo o al Centro Integral de la Memoria GAMA para una evaluación completa.
    `.trim(),
    imagenPortada: '/images/blog/alzheimer-senales.jpg',
    autor: {
      nombre: 'Equipo Cuidar MdP',
    },
    categoria: 'salud',
    tags: ['Alzheimer', 'demencia', 'memoria', 'neurología'],
    fechaPublicacion: '2025-10-20T10:00:00Z',
    tiempoLectura: 7,
    publicado: true,
  },

  {
    id: 'blog-004',
    titulo: 'Cuidar al cuidador: cómo evitar el síndrome de burnout familiar',
    slug: 'cuidar-al-cuidador-burnout-familiar',
    extracto:
      'Quienes cuidan a un adulto mayor muchas veces olvidan cuidarse a sí mismos. El agotamiento del cuidador es real y tiene consecuencias. Compartimos estrategias para prevenirlo y buscar ayuda a tiempo.',
    contenido: `
## El cuidador invisible

En la mayoría de las familias argentinas, el cuidado del adulto mayor recae sobre una sola persona, generalmente una hija o nuera. Esta sobrecarga, sostenida en el tiempo, puede derivar en el síndrome de burnout del cuidador.

## Síntomas del burnout

- Agotamiento físico y emocional
- Irritabilidad y cambios de humor
- Aislamiento social
- Sentimiento de culpa constante
- Problemas de sueño y alimentación

## Estrategias de autocuidado

1. **Delegá tareas**: Pedí ayuda a otros familiares y repartí responsabilidades.
2. **Buscá apoyo profesional**: Un psicólogo especializado puede ayudarte.
3. **Usá centros de día**: Permiten que tu familiar esté acompañado mientras vos descansás.
4. **Conectá con otros cuidadores**: Los grupos de apoyo son un recurso valioso.
5. **No te olvides de vos**: Sacá turnos médicos propios, hacé actividad física, disfrutá de tus hobbies.
    `.trim(),
    imagenPortada: '/images/blog/cuidar-cuidador.jpg',
    autor: {
      nombre: 'Lic. Carolina Fontana',
      bio: 'Psicóloga especializada en psicogerontología.',
    },
    categoria: 'emocional',
    tags: ['cuidador', 'burnout', 'familia', 'salud mental'],
    fechaPublicacion: '2025-11-05T10:00:00Z',
    tiempoLectura: 6,
    publicado: true,
  },

  {
    id: 'blog-005',
    titulo: 'Alimentación saludable para adultos mayores: consejos prácticos',
    slug: 'alimentacion-saludable-adultos-mayores',
    extracto:
      'Una buena nutrición es clave para envejecer con salud. Repasamos las necesidades nutricionales del adulto mayor, alimentos recomendados y cómo adaptar las comidas cuando hay dificultades para masticar o tragar.',
    contenido: `
## ¿Por qué cambia la alimentación con la edad?

Con los años, el metabolismo se ralentiza, disminuye la masa muscular y pueden aparecer problemas dentales o dificultades deglutorias. Todo esto exige adaptar la alimentación sin perder sabor ni nutrientes.

## Nutrientes esenciales

- **Proteínas**: Para mantener la masa muscular. Carnes magras, huevos, lácteos, legumbres.
- **Calcio y vitamina D**: Para la salud ósea. Lácteos, pescados grasos, exposición solar moderada.
- **Fibra**: Para el tránsito intestinal. Frutas, verduras, cereales integrales.
- **Hidratación**: Los mayores suelen tener menos sensación de sed. Ofrecer agua frecuentemente.

## Adaptaciones prácticas

- Ofrecer comidas pequeñas y frecuentes (5-6 por día)
- Adaptar texturas si hay dificultad para masticar
- Evitar el exceso de sal, usar especias y hierbas
- Preparar comidas coloridas y apetecibles
    `.trim(),
    imagenPortada: '/images/blog/alimentacion-mayores.jpg',
    autor: {
      nombre: 'Lic. Agustina Romero',
      bio: 'Nutricionista con orientación en geriatría.',
    },
    categoria: 'nutricion',
    tags: ['nutrición', 'alimentación', 'salud', 'recetas'],
    fechaPublicacion: '2025-11-18T10:00:00Z',
    tiempoLectura: 5,
    publicado: true,
  },

  {
    id: 'blog-006',
    titulo: 'Actividades de estimulación cognitiva para hacer en casa',
    slug: 'actividades-estimulacion-cognitiva-en-casa',
    extracto:
      'Mantener la mente activa es fundamental para prevenir el deterioro cognitivo. Compartimos actividades simples y entretenidas que podés hacer con tu ser querido en casa, sin necesidad de materiales especiales.',
    contenido: `
## ¿Por qué es importante la estimulación cognitiva?

El cerebro, como cualquier músculo, necesita ejercitarse. Las actividades de estimulación cognitiva ayudan a mantener y mejorar funciones como la memoria, la atención, el lenguaje y el razonamiento.

## Actividades recomendadas

### Memoria
- Juegos de cartas y naipes
- Recordar canciones de la juventud
- Ver fotos antiguas y contar las historias detrás

### Lenguaje
- Crucigramas y sopas de letras
- Leer en voz alta y comentar la lectura
- Juegos de palabras (el ahorcado, categorías)

### Atención
- Juegos de mesa como el dominó o el ludo
- Rompecabezas de pocas piezas
- Buscar diferencias entre imágenes

### Funciones ejecutivas
- Cocinar recetas sencillas juntos
- Organizar objetos por categorías
- Planificar una salida paso a paso

## Consejos para la actividad

- Adaptá la dificultad al nivel de la persona
- Nunca fuerces: si no quiere, respetá
- Celebrá cada logro, por pequeño que sea
- Hacelo en un momento del día en que esté descansado/a
    `.trim(),
    imagenPortada: '/images/blog/estimulacion-cognitiva.jpg',
    autor: {
      nombre: 'Equipo Cuidar MdP',
    },
    categoria: 'actividades',
    tags: ['estimulación', 'cognitivo', 'actividades', 'casa'],
    fechaPublicacion: '2025-12-01T10:00:00Z',
    tiempoLectura: 7,
    publicado: true,
  },

  {
    id: 'blog-007',
    titulo: 'PAMI y residencias geriátricas: todo lo que necesitás saber',
    slug: 'pami-residencias-geriatricas-guia',
    extracto:
      'Muchas familias se preguntan si PAMI cubre la internación geriátrica. Te explicamos los requisitos, los pasos del trámite y qué prestaciones están incluidas en la cobertura.',
    contenido: `
## ¿PAMI cubre la residencia geriátrica?

Sí, PAMI puede cubrir total o parcialmente la internación geriátrica a través del Programa de Atención Médica Integral (PAMI). Sin embargo, el trámite tiene requisitos y pasos específicos que es importante conocer.

## Requisitos principales

1. Ser afiliado/a de PAMI
2. Contar con una evaluación del equipo de PAMI que determine la necesidad de internación
3. Presentar documentación médica y social
4. La residencia debe estar en el listado de prestadores de PAMI

## Pasos del trámite

1. Solicitar turno en la UGL (Unidad de Gestión Local) de PAMI más cercana
2. Evaluación por el equipo interdisciplinario de PAMI
3. Presentación de la documentación
4. Aprobación y asignación de la residencia

## ¿Qué cubre PAMI?

- Alojamiento y alimentación
- Atención médica y de enfermería
- Medicación incluida en el vademécum
- Actividades de rehabilitación básicas

## Importante

Los tiempos de aprobación pueden variar. Mientras tanto, si la necesidad es urgente, muchas residencias ofrecen internación particular y luego se gestiona el pase a PAMI.
    `.trim(),
    imagenPortada: '/images/blog/pami-cobertura.jpg',
    autor: {
      nombre: 'Equipo Cuidar MdP',
    },
    categoria: 'guias',
    tags: ['PAMI', 'cobertura', 'trámites', 'obra social'],
    fechaPublicacion: '2025-12-15T10:00:00Z',
    tiempoLectura: 6,
    publicado: true,
  },

  {
    id: 'blog-008',
    titulo: 'Prevención de caídas en adultos mayores: claves para un hogar seguro',
    slug: 'prevencion-caidas-adultos-mayores-hogar-seguro',
    extracto:
      'Las caídas son una de las principales causas de hospitalización en mayores de 65 años. Conocé las medidas simples que podés tomar en casa para reducir el riesgo y proteger a tu ser querido.',
    contenido: `
## El problema de las caídas

Según datos de la OMS, aproximadamente un tercio de las personas mayores de 65 años se cae al menos una vez al año. Las consecuencias pueden ser graves: fracturas, pérdida de movilidad, miedo a caer y deterioro de la calidad de vida.

## Factores de riesgo

- Problemas de visión
- Medicamentos que causan mareo
- Pisos resbaladizos o desparejos
- Iluminación deficiente
- Falta de barandas y apoyos
- Calzado inadecuado

## Medidas preventivas en el hogar

### Baño
- Colocar barras de agarre junto al inodoro y la ducha
- Usar alfombras antideslizantes
- Instalar un banco de ducha si es necesario

### Dormitorio
- Dejar una luz nocturna encendida
- Asegurar que el camino al baño esté despejado
- Que la cama tenga una altura accesible

### Pasillos y escaleras
- Eliminar alfombras sueltas
- Instalar pasamanos en ambos lados
- Mantener buena iluminación

### General
- Usar calzado cerrado con suela antideslizante
- Revisar la vista al menos una vez al año
- Consultar con el médico sobre efectos secundarios de la medicación
    `.trim(),
    imagenPortada: '/images/blog/prevencion-caidas.jpg',
    autor: {
      nombre: 'Lic. Martín Echeverría',
      bio: 'Kinesiólogo especializado en rehabilitación geriátrica.',
    },
    categoria: 'salud',
    tags: ['caídas', 'prevención', 'hogar seguro', 'kinesiología'],
    fechaPublicacion: '2026-01-10T10:00:00Z',
    tiempoLectura: 7,
    publicado: true,
  },
];

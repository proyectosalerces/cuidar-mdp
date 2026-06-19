# 📋 Historial Completo del Proyecto — Cuidar MdP

**Proyecto:** Cuidar MdP de Mar del Plata
**URL:** https://cuidar-mdp.vercel.app
**Repositorio:** https://github.com/proyectosalerces/cuidar-mdp
**Período:** 9 de junio 2026 — presente
**28 commits** | **7 etapas** | **3 días de desarrollo**

---

## Etapa 1 — MVP y Fundación (9 de junio)

### Qué se hizo
Se creó desde cero la aplicación web completa de Cuidar MdP usando Next.js 16, con un diseño premium, dark mode, y todas las secciones principales.

### Implementación
- **Creación del proyecto** con `create-next-app` (Next.js 16 + Turbopack + TypeScript)
- **Sistema de diseño** completo con variables CSS, paleta teal/dorado, tipografía Outfit + Inter
- **Componentes UI** reutilizables: Button, Badge, Card, Input, Select, Rating, Skeleton, ThemeToggle
- **Páginas públicas:**
  - `/` — Home con hero, sección "Cómo funciona", residencias destacadas, testimonios, CTA
  - `/residencias` — Listado con filtros (barrio, tipo de cuidado, precio, calificación)
  - `/residencias/[slug]` — Detalle completo con galería, servicios, contacto, mapa
  - `/profesionales` — Directorio de profesionales de salud
  - `/profesionales/[slug]` — Perfil individual del profesional
  - `/blog` — Listado de notas con filtro por categoría
  - `/blog/[slug]` — Artículo completo
  - `/nosotros` — Página institucional
  - `/contacto` — Formulario de contacto
  - `/asesoramiento` — Formulario de asesoramiento personalizado
  - `/privacidad` y `/terminos` — Páginas legales
- **Sistema de reseñas** con formulario, estrellas, estadísticas y listado
- **Autenticación** con Firebase Auth (Google sign-in)
- **Responsive** completo (mobile, tablet, desktop)
- **Dark mode** con toggle y detección de preferencia del sistema

### Commits
```
da49aec — Initial commit from Create Next App
b6b9dad — feat: Cuidar MdP - MVP completo con sistema de reseñas y autenticación
```

---

## Etapa 2 — Integración Firebase y Datos Reales (10 de junio, mañana)

### Qué se hizo
Se migró de datos mock a Firebase/Firestore como backend real. Se cargaron las 31 residencias de larga estadía verificadas de Mar del Plata con datos investigados.

### Implementación
- **Firebase Auth** para login con Google y gestión de sesiones
- **Firestore** como base de datos principal para residencias, profesionales, blog y reseñas
- **Investigación de datos:** se relevaron 39+ residencias de Mar del Plata desde fuentes oficiales (Secretaría de Salud MGP, Google Maps, redes sociales)
- **Script de importación** desde Excel a Firestore para carga masiva de residencias
- **Servicio dinámico** (`residencias.service.ts`) con cache en memoria, queries con filtros y ordenamiento
- **31 residencias** cargadas con datos verificados: nombre, dirección, barrio, teléfono, servicios, tipos de cuidado, habilitaciones, coordenadas

### Problemas resueltos
- **Firebase Storage no disponible en plan gratuito** → se reemplazó por URLs externas para imágenes
- **Valores `undefined` no aceptados por Firestore** → se implementó limpieza automática antes de escritura
- **Índices compuestos** no creados automáticamente → se crearon manualmente desde la consola Firebase

### Commits
```
1afc79b — feat: Firebase Auth + Firestore para reseñas
1dde26b — feat: datos reales de 31 residencias verificadas
9baa151 — feat: migración a Firestore - servicio dinámico con cache
13967f5 — fix: reemplazar Firebase Storage con URLs externas
3ee6058 — fix: limpiar valores undefined antes de enviar a Firestore
```

---

## Etapa 3 — Panel de Administración (10 de junio, tarde)

### Qué se hizo
Se construyó un panel de administración completo protegido por rol, accesible solo con el email admin.

### Implementación
- **Rutas admin protegidas:**
  - `/admin` — Dashboard con resumen
  - `/admin/residencias` — CRUD completo de residencias
  - `/admin/residencias/nueva` y `/admin/residencias/[id]` — Formularios de alta/edición
  - `/admin/profesionales` — CRUD de profesionales
  - `/admin/blog` — CRUD de posts del blog
  - `/admin/contacto` — Bandeja de mensajes recibidos
- **Detección de admin** por email hardcodeado (`proyectos@residencialosalerces.com`)
- **Toggle admin/sitio** en el menú de usuario para alternar entre el panel y el sitio público
- **Formularios completos** con validación, campos de redes sociales (Facebook, Instagram), capacidad, año de fundación
- **Campos de habilitación** municipal y provincial con estados (sí/no/en trámite) y toggle de visibilidad pública

### Problemas resueltos
- **Detección de admin via Firestore** era lenta y fallaba → se cambió a lista hardcodeada
- **Queries sin índice compuesto** daban error 400 → se crearon los índices necesarios

### Commits
```
78528b0 — feat: panel de administración completo
8720fa0 — fix: fallback Firebase config para build en Vercel
271a64f — fix: admin detection - usar lista hardcodeada
8a87372 — feat: admin Blog + Mensajes de contacto
ab9e9bb — feat: migrar blog y profesionales a Firestore + páginas legales
b85c9e4 — fix: queries sin indice compuesto + toggle admin/sitio
8a7ad61 — feat: campos Facebook e Instagram en formulario admin
5cb55c0 — feat: campos capacidad, habilitación municipal/provincial con toggle
```

---

## Etapa 4 — Datos de Profesionales y Barrios (10-11 de junio)

### Qué se hizo
Se cargaron 88 cuidadores domiciliarios certificados desde el listado oficial de la Municipalidad de General Pueyrredón, y se completó la lista de 120+ barrios de Mar del Plata.

### Implementación
- **PDF oficial** del Municipio de General Pueyrredón (listado de cuidadores domiciliarios certificados por DINAPAM 2024)
- **Extracción y parsing** del PDF → se obtuvieron 88 profesionales con: nombre, matrícula, especialidad, zona de cobertura
- **Nuevas especialidades** añadidas al sistema: Cuidador/a Domiciliario/a, Acompañante Terapéutico, Asistente Gerontológico
- **120+ barrios oficiales** de Mar del Plata cargados como constantes para los filtros
- **Imágenes reales** en tarjetas de residencias del home con fallback a placeholder

### Commits
```
0cdb0d0 — feat: mostrar imagen real en tarjeta de residencia + fallback
b595779 — feat: lista completa de 120+ barrios oficiales
d7ed00f — feat: cargar 88 cuidadores certificados MGP + nuevas especialidades
```

---

## Etapa 5 — SEO Técnico (11 de junio)

### Qué se hizo
Se implementó SEO técnico completo para posicionamiento en buscadores, con foco en búsquedas locales de Mar del Plata.

### Implementación
- **`robots.ts`** — permite indexación general, bloquea `/admin/`
- **`sitemap.ts`** — dinámico, lee residencias, profesionales y blog posts desde Firestore
- **JSON-LD (Schema.org)** — structured data para Organization, MedicalBusiness, BlogPosting, ProfessionalService
- **Open Graph images** — imagen OG por defecto generada
- **Canonical URLs** en todas las páginas
- **Security headers** — CSP, X-Frame-Options, HSTS configurados en `next.config.ts`
- **Meta descriptions** dinámicas por página
- **Google Analytics** — componente implementado (pendiente configurar Measurement ID)

### Problema resuelto
- **JSON-LD con `next/script`** causaba error en Next.js 16 + Turbopack → se cambió a `<script>` nativo en `<head>` renderizado server-side

### Commits
```
3e8d7e6 — feat: SEO técnico completo
54fa79b — fix: mostrar imagen principal en página de detalle
2f95186 — fix: reemplazar next/script por script nativo en head
```

---

## Etapa 6 — Contenido del Blog (11 de junio)

### Qué se hizo
Se crearon y cargaron 20 posts completos para el blog, con imágenes de portada generadas por IA, cubriendo temas de salud, legal, familias, y coyuntura.

### Implementación

**Batch 1 — 6 posts fundacionales:**
1. Guía para elegir residencia de larga estadía
2. Opciones de cuidado en Mar del Plata
3. Señales de que un persona mayor necesita ayuda
4. Cómo contratar un cuidador domiciliario
5. Derechos de los personas mayores en Argentina
6. Cómo preparar el ingreso a una residencia

**Batch 2 — 14 posts adicionales:**
7. Primera visita a una residencia
8. Trámites PAMI para cobertura
9. Mi padre se niega a ir a una residencia
10. Emergencias de larga estadía
11. Alimentación en personas mayores
12. Alzheimer: señales tempranas
13. Actividad física después de los 70
14. Depresión en personas mayores
15. Prevención de caídas
16. PAMI 2025: cambios y novedades
17. Ola de frío y personas mayores
18. Estafas telefónicas: prevención
19. Culpa por internar a un ser querido
20. Síndrome del cuidador

**Para cada post:** contenido HTML completo, imagen de portada generada, metadata (categoría, tags, tiempo de lectura, fecha), carga automática a Firestore via script.

### Problemas resueltos
- **Mapeo de autor** — Firestore guardaba `autor` como string pero el tipo esperaba un objeto → se añadió lógica de mapeo flexible
- **`BlogCard` como Server Component** — tenía un `onError` handler en la imagen → se agregó `'use client'`
- **Imágenes 404 en Vercel** — el build fallaba por error de TypeScript (`publicada` vs `activa`) → Vercel servía un deploy viejo sin las imágenes nuevas
- **Categorías faltantes** — posts del batch 2 usaban `familias` y `legales` que no existían en el filtro → se agregaron

### Commits
```
a1626a6 — feat: 6 blog posts con imágenes de portada + scripts
12a77e4 — fix: mostrar imágenes de portada en BlogCard y BlogArticle
c82d726 — feat: 14 imágenes de portada adicionales (total 20)
98a18b5 — fix: BlogCard use client + FeaturedResidencias desde Firestore
8f723bc — chore: trigger Vercel redeploy for blog images
0b00199 — fix: corregir publicada → activa (build error)
2702f13 — feat: agregar categorías familias/legales + habilitaciones en detalle
```

---

## Etapa 7 — Branding y Marketing (11-12 de junio)

### Qué se hizo
Se creó la identidad visual de la marca, el contenido completo para redes sociales, y se preparó la estrategia de marketing digital.

### Implementación

**Logo (4 variantes):** principal (fondo claro), oscuro (fondo dark), ícono/favicon (sin texto), avatar circular para Instagram.

**Manual de marca:** paleta de colores con códigos hex/RGB, tipografías (Outfit + Inter) con escala, tono de comunicación (voseo argentino, empático, profesional), reglas de uso del logo, aplicaciones (web, redes, papelería).

**Instagram @cuidarmdp (30 posts):** 30 imágenes cuadradas (1080x1080) con paleta de marca, 30 captions con emojis y CTA, 30 sets de hashtags, calendario de 10 semanas. Temas: presentación, datos, checklists, testimonios, FAQ, mitos, nutrición, ejercicios, terapias, derechos, destacados de residencias, tutoriales, encuestas, CTA.

**Textos para redes:** bio de Instagram, página de Facebook completa (bio, descripción, historia, primer post), 8 highlights de Instagram, mensaje automático de WhatsApp Business, respuesta fuera de horario, firma de email.

**Organización:** todo consolidado en `cuidar-mdp/marketing/` con subcarpetas `logos/`, `instagram/`, `docs/`.

---

## 🏗️ Arquitectura Actual

### Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| **Framework** | Next.js 16 (App Router + Turbopack) |
| **Lenguaje** | TypeScript |
| **Estilos** | CSS Modules + Variables CSS |
| **Backend** | Firebase (Auth + Firestore) |
| **Hosting** | Vercel |
| **Repo** | GitHub (proyectosalerces/cuidar-mdp) |

### Estructura de la app

```
src/
├── app/                          # 25 rutas (App Router)
│   ├── page.tsx                  # Home
│   ├── residencias/              # Listado + detalle
│   ├── profesionales/            # Listado + detalle
│   ├── blog/                     # Listado + artículo
│   ├── asesoramiento/            # Formulario
│   ├── contacto/                 # Formulario
│   ├── nosotros/                 # Institucional
│   ├── admin/                    # Panel admin (protegido)
│   │   ├── residencias/          # CRUD
│   │   ├── profesionales/        # CRUD
│   │   ├── blog/                 # CRUD
│   │   └── contacto/             # Bandeja
│   ├── (legal)/                  # Privacidad + términos
│   ├── sitemap.ts                # Dinámico
│   └── robots.ts                 
├── components/                   # 44 componentes
├── services/                     # Servicios Firestore
├── types/                        # TypeScript types
├── utils/                        # Helpers y constantes
└── lib/                          # Firebase config
```

### Base de datos (Firestore)

| Colección | Documentos | Descripción |
|-----------|-----------|-------------|
| `residencias` | 31+ | residencias de larga estadía verificadas |
| `profesionales` | 88 | Cuidadores certificados MGP |
| `blog-posts` | 20 | Artículos con contenido HTML |
| `resenas` | Variable | Reseñas de usuarios |
| `contacto` | Variable | Mensajes del formulario |

---

## 🔲 Pendientes

### Dependen de vos (Diego)

| # | Tarea | Qué necesito de vos |
|---|-------|---------------------|
| 1 | **Comprar dominio** en Hostinger | Contratar el plan, pasarme acceso al panel DNS |
| 2 | **Email profesional** (info@cuidarmdp.com.ar) | Se configura al comprar Hostinger |
| 3 | **Google Analytics** | Crear propiedad GA4, pasarme el Measurement ID `G-XXXXXXXXXX` |
| 4 | **Google Business Profile** | Crear perfil (necesita verificación con dirección/teléfono real) |
| 5 | **Cuenta Instagram** | Crear @cuidarmdp, subir avatar y bio del doc de textos |
| 6 | **Página Facebook** | Crear con los textos preparados |
| 7 | **WhatsApp Business** | Configurar con el 2236 94-8075 y los mensajes automáticos |
| 8 | **Publicar posts de IG** | Las 30 imágenes + captions están en `marketing/` |
| 9 | **Completar datos de residencias** | Fotos reales, precios actualizados, servicios detallados |
| 10 | **Revisar profesionales** | Verificar que los 88 cargados tengan info correcta |

### Dependen de mí (puedo hacer cuando me pidas)

| # | Tarea | Descripción |
|---|-------|-------------|
| 1 | **Configurar DNS** | Apuntar dominio de Hostinger a Vercel |
| 2 | **Agregar GA ID** | Configurar Measurement ID en `.env.local` y Vercel |
| 3 | **Google Search Console** | Verificar dominio y enviar sitemap |
| 4 | **Mapa Google Maps** | Integrar mapa real en ficha de residencia |
| 5 | **Más contenido de blog** | Seguir generando artículos |
| 6 | **PWA** | Convertir en Progressive Web App instalable |
| 7 | **Formulario asesoramiento** | Conectar con Firestore + notificaciones |

---

## 📊 Resumen numérico

| Métrica | Valor |
|---------|-------|
| Commits | 28 |
| Componentes React | 44 |
| Páginas/rutas | 25 |
| Residencias cargadas | 31+ |
| Profesionales cargados | 88 |
| Posts del blog | 20 |
| Imágenes del blog | 20 |
| Posts de Instagram | 30 |
| Variantes del logo | 4 |
| Días de desarrollo | 3 |

---

> [!NOTE]
> Documento generado el 12 de junio de 2026. Se actualizará a medida que el proyecto avance.

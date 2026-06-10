# 🔍 Estrategia SEO — Cuidar MdP

> **Versión:** 1.0  
> **Fecha:** Junio 2026  
> **Sitio:** [cuidarmdp.com.ar](https://cuidarmdp.com.ar)  
> **Stack:** Next.js 16.2.7 · TypeScript · CSS Modules  

---

## Índice

1. [Auditoría Técnica Actual](#1-auditoría-técnica-actual)
2. [Keyword Research](#2-keyword-research)
3. [On-Page SEO](#3-on-page-seo)
4. [SEO Local](#4-seo-local)
5. [Content SEO](#5-content-seo)
6. [SEO Técnico](#6-seo-técnico)
7. [Link Building](#7-link-building)
8. [Medición y KPIs](#8-medición-y-kpis)

---

## 1. Auditoría Técnica Actual

### ✅ Elementos Implementados

| Elemento | Estado | Ubicación |
|----------|--------|-----------|
| `sitemap.xml` dinámico | ✅ Implementado | `src/app/sitemap.ts` — Incluye páginas estáticas + dinámicas (residencias, blog, profesionales) |
| `robots.txt` | ✅ Implementado | `src/app/robots.ts` — Allow `/`, Disallow `/api/`, referencia a sitemap |
| JSON-LD `LocalBusiness` (global) | ✅ Implementado | `src/utils/seo.ts` → inyectado en `layout.tsx` vía `<JsonLd>` |
| JSON-LD `LocalBusiness` (por residencia) | ✅ Implementado | Incluye geo, ratings, priceRange, teléfono |
| JSON-LD `Article` (por blog post) | ✅ Implementado | Incluye author, wordCount, timeRequired, datePublished |
| JSON-LD `Physician` (por profesional) | ✅ Implementado | Incluye aggregateRating, openingHours, medicalSpecialty |
| Canonical URLs | ✅ Implementado | Vía `generateMetadata()` con `alternates.canonical` |
| Open Graph tags | ✅ Implementado | type, locale `es_AR`, siteName, title, description, images |
| Twitter Cards | ✅ Implementado | `summary_large_image` con title, description, images |
| Google Analytics 4 | ✅ Implementado | `GoogleAnalytics.tsx` — tracking de page views por ruta |
| PWA Manifest | ✅ Implementado | `src/app/manifest.ts` — icons 192/512, standalone |
| Meta keywords | ✅ Implementado | En metadata del root layout |
| `lang="es-AR"` | ✅ Implementado | En el elemento `<html>` |
| `metadataBase` | ✅ Implementado | Configurado con URL del sitio |
| Title template | ✅ Implementado | `Cuidar MdP - %s` |
| Viewport / theme-color | ✅ Implementado | `#1B6B5A`, device-width, initialScale 1 |
| Apple Web App | ✅ Implementado | capable, statusBarStyle, title |
| Skip navigation (A11y) | ✅ Implementado | `<a href="#contenido-principal">` |
| Dark mode sin FOUC | ✅ Implementado | Script inline en `<head>` lee localStorage |
| Font display swap | ✅ Implementado | Outfit + Inter con `display: "swap"` |

### ❌ Elementos Faltantes / Oportunidades de Mejora

| Elemento | Prioridad | Descripción |
|----------|-----------|-------------|
| Imagen OG real | 🔴 Alta | Falta `/images/og-default.jpg` real — crítico para compartir en redes |
| Schema `BreadcrumbList` | 🔴 Alta | Agregar breadcrumbs estructurados en páginas de detalle |
| Schema `FAQPage` | 🟡 Media | Oportunidad para rich snippets en páginas de residencias y blog |
| Schema `Service` | 🟡 Media | Describir servicios de la consultora (asesoramiento, recomendación) |
| Página 404 personalizada | 🔴 Alta | Falta `not-found.tsx` con diseño de marca y links útiles |
| Página 500 personalizada | 🟡 Media | Falta `error.tsx` global |
| `hreflang` | 🟢 Baja | No necesario actualmente (sitio monolingüe es-AR) |
| OG Image por página | 🟡 Media | Generar imágenes OG dinámicas por residencia/blog/profesional |
| Breadcrumbs visuales | 🔴 Alta | Implementar navegación breadcrumb en UI + schema |
| Compresión de imágenes | 🔴 Alta | Migrar a `next/image` con formato WebP automático |
| `rel="noopener"` en links externos | ✅ Ya implementado | En WhatsApp FAB |
| Lazy loading de imágenes | 🟡 Media | Verificar que `next/image` aplique `loading="lazy"` |
| Performance monitoring | 🟡 Media | Configurar Web Vitals reporting en GA4 |

---

## 2. Keyword Research

### 2.1 Keywords Primarias

| # | Keyword | Vol. Est. Mensual | Dificultad | Intención | Página Objetivo |
|---|---------|:-:|:-:|:-:|:-:|
| 1 | geriátrico mar del plata | 1.200 | Alta | Local / Transaccional | `/residencias` |
| 2 | residencia adultos mayores mar del plata | 800 | Alta | Local / Transaccional | `/residencias` |
| 3 | residencia geriátrica mar del plata | 700 | Alta | Local / Transaccional | `/residencias` |
| 4 | hogar de ancianos mar del plata | 500 | Media | Local / Transaccional | `/residencias` |
| 5 | geriátrico mdp | 300 | Baja | Local / Navegacional | `/residencias` |
| 6 | cuidadores adultos mayores mar del plata | 250 | Media | Local / Transaccional | `/profesionales` |
| 7 | geriatra mar del plata | 200 | Media | Local / Transaccional | `/profesionales` |
| 8 | centro de día adultos mayores mar del plata | 180 | Baja | Local / Transaccional | `/residencias` (filtro) |
| 9 | consultora geriátrica mar del plata | 50 | Baja | Local / Navegacional | `/` (home) |
| 10 | residencia para mayores zona norte mdp | 80 | Baja | Local / Transaccional | `/residencias` (filtro zona) |

### 2.2 Keywords Long-tail

| # | Keyword | Vol. Est. Mensual | Dificultad | Intención | Página Objetivo |
|---|---------|:-:|:-:|:-:|:-:|
| 11 | cómo elegir un geriátrico en mar del plata | 150 | Baja | Informacional | `/blog/como-elegir-geriatrico` |
| 12 | mejores geriátricos en mar del plata | 300 | Media | Informacional / Transaccional | `/residencias` |
| 13 | precio geriátrico mar del plata 2026 | 200 | Media | Informacional | `/blog/precios-geriatricos` |
| 14 | residencia alzheimer mar del plata | 120 | Baja | Local / Transaccional | `/residencias` (filtro) |
| 15 | geriátrico con rehabilitación mar del plata | 80 | Baja | Local / Transaccional | `/residencias` (filtro) |
| 16 | pami geriátrico mar del plata | 250 | Media | Informacional | `/blog/pami-geriatricos` |
| 17 | internación temporal adultos mayores mdp | 60 | Baja | Local / Transaccional | `/residencias` (filtro) |
| 18 | cuidados paliativos mar del plata | 150 | Media | Local / Informacional | `/profesionales` |
| 19 | kinesiólogo para adultos mayores mdp | 70 | Baja | Local / Transaccional | `/profesionales` |
| 20 | nutricionista geriátrico mar del plata | 50 | Baja | Local / Transaccional | `/profesionales` |
| 21 | residencia geriátrica los troncos mdp | 40 | Baja | Local / Transaccional | `/residencias` (filtro barrio) |
| 22 | actividades para adultos mayores mar del plata | 200 | Baja | Informacional | `/blog` |
| 23 | derechos del adulto mayor argentina | 300 | Media | Informacional | `/blog/derechos-adulto-mayor` |
| 24 | síntomas alzheimer temprano | 400 | Alta | Informacional | `/blog/sintomas-alzheimer` |
| 25 | qué preguntar al visitar un geriátrico | 120 | Baja | Informacional | `/blog/preguntas-visita-geriatrico` |
| 26 | diferencia geriátrico residencia hogar | 90 | Baja | Informacional | `/blog/diferencias-geriatrico-residencia` |
| 27 | cuánto sale un geriátrico en argentina 2026 | 350 | Media | Informacional | `/blog/costos-geriatricos-argentina` |
| 28 | terapia ocupacional adultos mayores | 180 | Media | Informacional | `/blog/terapia-ocupacional` |
| 29 | cuidar a un familiar con demencia | 250 | Media | Informacional | `/blog/cuidar-familiar-demencia` |
| 30 | geriátrico habilitado mar del plata | 100 | Baja | Informacional / Transaccional | `/blog/habilitaciones-geriatricos` |

### 2.3 Clusters Temáticos

```
Cluster 1: Elegir un Geriátrico
├── Pilar: /residencias
├── Cómo elegir un geriátrico
├── Qué preguntar al visitar
├── Diferencias geriátrico/residencia/hogar
├── Habilitaciones y regulaciones
└── Lista de verificación para familias

Cluster 2: Salud del Adulto Mayor
├── Pilar: /blog (categoría Salud)
├── Síntomas de Alzheimer temprano
├── Ejercicios para adultos mayores
├── Nutrición en la tercera edad
├── Prevención de caídas
└── Salud mental y depresión

Cluster 3: Costos y Financiamiento
├── Pilar: /blog (categoría Legal/PAMI)
├── Precios de geriátricos 2026
├── Cobertura PAMI
├── Obras sociales y prestaciones
├── Derechos del adulto mayor
└── Subsidios y ayudas disponibles

Cluster 4: Cuidadores y Profesionales
├── Pilar: /profesionales
├── Cuándo contratar un cuidador
├── Terapia ocupacional
├── Kinesiología geriátrica
├── Psicología para adultos mayores
└── Enfermería domiciliaria

Cluster 5: Vivir en Mar del Plata
├── Pilar: /nosotros + /blog
├── Actividades para adultos mayores en MdP
├── Espacios verdes accesibles
├── Servicios municipales para mayores
├── Centros de jubilados en MdP
└── Mar del Plata como destino de retiro
```

---

## 3. On-Page SEO

### 3.1 Estrategia de Title Tags

| Tipo de Página | Formato del Title | Ejemplo | Max. Caracteres |
|----------------|-------------------|---------|:-:|
| **Home** | `{Marca} — {Propuesta de valor}` | `Cuidar MdP — Consultora Geriátrica en Mar del Plata` | 60 |
| **Listado Residencias** | `{Servicio} en {Ciudad} \| {Marca}` | `Residencias Geriátricas en Mar del Plata \| Cuidar MdP` | 60 |
| **Detalle Residencia** | `{Nombre} — Residencia en {Barrio}, MdP` | `Sol de Otoño — Residencia en Los Troncos, MdP` | 60 |
| **Listado Profesionales** | `{Servicio} en {Ciudad} \| {Marca}` | `Profesionales Geriátricos en Mar del Plata \| Cuidar MdP` | 60 |
| **Detalle Profesional** | `{Nombre} · {Especialidad} en MdP` | `Dra. María López · Geriatra en Mar del Plata` | 60 |
| **Blog Listado** | `Blog sobre Cuidado Geriátrico \| {Marca}` | `Blog sobre Cuidado Geriátrico \| Cuidar MdP` | 60 |
| **Blog Post** | `{Título del Post} \| {Marca}` | `Cómo Elegir un Geriátrico en MdP \| Cuidar MdP` | 60 |
| **Contacto** | `Contacto — {Marca}` | `Contacto — Cuidar MdP` | 60 |
| **Asesoramiento** | `Asesoramiento Gratuito \| {Marca}` | `Asesoramiento Geriátrico Gratuito \| Cuidar MdP` | 60 |
| **Nosotros** | `Sobre Nosotros — {Marca}` | `Sobre Nosotros — Cuidar MdP` | 60 |

### 3.2 Meta Descriptions por Tipo de Página

| Tipo de Página | Meta Description | Caracteres |
|----------------|-----------------|:-:|
| **Home** | Consultora de recomendación geriátrica en Mar del Plata. Te ayudamos a encontrar la residencia ideal para tu ser querido. Asesoramiento gratuito ✆ 223-555-0100 | 155 |
| **Listado Residencias** | Explorá 19 residencias geriátricas verificadas en Mar del Plata. Compará servicios, precios y ubicaciones. Encontrá el lugar perfecto para tu familiar. | 152 |
| **Detalle Residencia** | {Nombre}: residencia geriátrica en {Barrio}, Mar del Plata. {TipoCuidado}. Calificación {X}/5. Consultá disponibilidad y precios actualizados. | ~150 |
| **Listado Profesionales** | Directorio de profesionales geriátricos en Mar del Plata: geriatras, kinesiólogos, psicólogos, nutricionistas. Encontrá al especialista que necesitás. | 155 |
| **Detalle Profesional** | {Nombre}, {Especialidad} en Mar del Plata. {Años} años de experiencia. Atención por {ObrasSociales}. Solicitá turno: {Teléfono}. | ~145 |
| **Blog Listado** | Artículos, guías y consejos sobre cuidado geriátrico, salud del adulto mayor y cómo elegir la mejor residencia en Mar del Plata. | 130 |
| **Blog Post** | {Extracto del post, primeras 150 caracteres} | ≤ 155 |
| **Contacto** | Contactanos para recibir asesoramiento geriátrico personalizado en Mar del Plata. WhatsApp, email o formulario. Respuesta en menos de 24 hs. | 148 |
| **Asesoramiento** | Completá nuestro formulario de asesoramiento gratuito y recibí recomendaciones personalizadas de residencias geriátricas en Mar del Plata. | 142 |

### 3.3 Jerarquía de Encabezados (H1 → H3)

**Página Home:**
```
H1: Consultora de Recomendación Geriátrica en Mar del Plata
  H2: Residencias Destacadas
    H3: {Nombre de Residencia}
  H2: Nuestros Servicios
    H3: Asesoramiento Personalizado
    H3: Red de Profesionales
  H2: Testimonios de Familias
  H2: Últimos Artículos del Blog
```

**Página Detalle Residencia:**
```
H1: {Nombre de la Residencia}
  H2: Descripción
  H2: Servicios y Prestaciones
    H3: Tipos de Cuidado
    H3: Actividades
  H2: Ubicación e Instalaciones
  H2: Precios y Cobertura
  H2: Opiniones y Calificaciones
  H2: Profesionales Asociados
```

**Página Blog Post:**
```
H1: {Título del Artículo}
  H2: {Sección Principal 1}
    H3: {Subsección}
  H2: {Sección Principal 2}
  H2: Preguntas Frecuentes
  H2: Artículos Relacionados
```

### 3.4 Guidelines para Texto Alternativo de Imágenes

| Tipo de Imagen | Formato de Alt Text | Ejemplo |
|----------------|---------------------|---------|
| Foto de residencia (exterior) | `Fachada de {Nombre}, residencia geriátrica en {Barrio}, Mar del Plata` | `Fachada de Sol de Otoño, residencia geriátrica en Los Troncos, Mar del Plata` |
| Foto de residencia (interior) | `{Espacio} de {Nombre} — {Descripción breve}` | `Salón comedor de Sol de Otoño — espacio luminoso con vista al jardín` |
| Foto de profesional | `{Nombre}, {Especialidad} en Mar del Plata` | `Dra. María López, geriatra en Mar del Plata` |
| Imagen de blog | `{Descripción descriptiva relevante al contenido}` | `Adulta mayor haciendo ejercicios de rehabilitación con kinesiólogo` |
| Iconos | `""` (vacío) o `aria-hidden="true"` | Iconos decorativos no necesitan alt text |
| Logo | `Logo de Cuidar MdP — Consultora Geriátrica` | — |

### 3.5 Estrategia de Enlazado Interno

```mermaid
graph TD
    HOME[Home] --> RES[/residencias]
    HOME --> PROF[/profesionales]
    HOME --> BLOG[/blog]
    HOME --> ASES[/asesoramiento]
    
    RES --> RES_D[/residencias/slug]
    RES_D --> PROF_D[/profesionales/slug]
    RES_D --> BLOG_R[Blog relacionado]
    RES_D --> ASES
    
    PROF --> PROF_D[/profesionales/slug]
    PROF_D --> RES_D
    
    BLOG --> BLOG_D[/blog/slug]
    BLOG_D --> RES
    BLOG_D --> PROF
    BLOG_D --> ASES
    BLOG_D --> BLOG_D2[Artículos relacionados]
```

**Reglas de enlazado interno:**

1. **Cada página de residencia** debe enlazar a:
   - Al menos 2 profesionales relacionados por especialidad
   - Al menos 1 artículo de blog relevante
   - CTA hacia `/asesoramiento`
   - Otras residencias en la misma zona ("También en {Barrio}")

2. **Cada artículo de blog** debe incluir:
   - Al menos 3 links internos a páginas relevantes
   - CTA al formulario de asesoramiento
   - Links a artículos relacionados del mismo cluster
   - Breadcrumbs: Home → Blog → {Categoría} → {Artículo}

3. **Cada página de profesional** debe enlazar a:
   - Residencias donde trabaja/colabora
   - Artículos de blog de su especialidad
   - CTA de contacto directo

4. **Footer:** Links a todas las secciones principales + páginas legales

---

## 4. SEO Local

### 4.1 Google Business Profile (GBP)

**Pasos para configurar:**

1. **Crear perfil** en [business.google.com](https://business.google.com)
2. **Datos del negocio:**
   - Nombre: `Cuidar MdP — Consultora Geriátrica`
   - Categoría principal: `Servicio de atención a personas mayores`
   - Categorías secundarias: `Consultoría`, `Servicio de salud`
   - Dirección: {dirección física en Mar del Plata}
   - Teléfono: `+54 9 223 555-0100`
   - Sitio web: `https://cuidarmdp.com.ar`
   - Horario: Lunes a Viernes 9:00 - 18:00, Sábados 9:00 - 13:00
3. **Verificación:** por correo postal o teléfono
4. **Optimización del perfil:**
   - Agregar 10+ fotos profesionales (oficina, equipo, eventos)
   - Completar descripción con keywords principales
   - Agregar servicios: Asesoramiento geriátrico, Recomendación de residencias, Evaluación de necesidades
   - Configurar mensajería directa
   - Publicar Google Posts semanalmente

### 4.2 Consistencia NAP

Mantener datos **idénticos** en todas las plataformas:

```
Nombre:    Cuidar MdP
Dirección: {Calle y número}, Mar del Plata, Buenos Aires, Argentina
Teléfono:  +54 9 223 555-0100
Web:       https://cuidarmdp.com.ar
Email:     info@cuidarmdp.com.ar
```

> ⚠️ **CRÍTICO:** El nombre, dirección y teléfono deben ser **exactamente iguales** en todos los directorios, redes sociales y el sitio web.

### 4.3 Citaciones Locales (Directorios)

| # | Directorio | URL | Prioridad | Estado |
|---|-----------|-----|:-:|:-:|
| 1 | Google Business Profile | business.google.com | 🔴 Alta | ⬜ Pendiente |
| 2 | Páginas Doradas | paginasdoradas.com.ar | 🔴 Alta | ⬜ Pendiente |
| 3 | Guía Local MdP | guialocal.com.ar | 🟡 Media | ⬜ Pendiente |
| 4 | Cylex Argentina | cylex.com.ar | 🟡 Media | ⬜ Pendiente |
| 5 | MdP Digital | mardelplatadigital.com | 🟡 Media | ⬜ Pendiente |
| 6 | TuMdP | tumdp.com | 🟡 Media | ⬜ Pendiente |
| 7 | Yelp Argentina | yelp.com.ar | 🟡 Media | ⬜ Pendiente |
| 8 | Facebook Business | facebook.com/cuidarmdp | 🔴 Alta | ⬜ Pendiente |
| 9 | Instagram Business | instagram.com/cuidarmdp | 🔴 Alta | ⬜ Pendiente |
| 10 | LinkedIn Company | linkedin.com/company/cuidarmdp | 🟡 Media | ⬜ Pendiente |
| 11 | Guía PAMI | pami.org.ar | 🔴 Alta | ⬜ Pendiente |
| 12 | Portal Adultos Mayores | portalmayores.com.ar | 🟡 Media | ⬜ Pendiente |

### 4.4 Integración con Google Maps

1. **Embed de mapa** en cada página de residencia (ya planificado con coordenadas lat/lng)
2. **Link "Cómo llegar"** con `https://www.google.com/maps/dir/?api=1&destination={lat},{lng}`
3. **Schema GeoCoordinates** ya implementado en JSON-LD de residencias
4. **Google Maps Platform API** para mapa interactivo en `/residencias` (listado)

### 4.5 Estrategia de Reseñas

| Canal | Meta Mensual | Acción |
|-------|:-:|----------|
| Google Reviews | 4-5 reseñas/mes | Enviar link de reseña post-asesoramiento vía WhatsApp |
| Facebook | 2-3 reseñas/mes | Solicitar reseña en seguimiento |
| Testimonios en sitio | 2/mes | Recopilar con formulario + consentimiento |

**Proceso para solicitar reseñas:**
1. Completar asesoramiento exitoso
2. Esperar 7 días después de la recomendación
3. Enviar mensaje de seguimiento por WhatsApp con link directo a Google Reviews
4. Agradecer públicamente cada reseña recibida
5. Responder TODAS las reseñas (positivas y negativas) en menos de 48 hs

---

## 5. Content SEO

### 5.1 Calendario de Contenidos — 12 Meses

#### Q3 2026 (Julio – Septiembre): Fundamentos

| Semana | Título del Artículo | Keyword Objetivo | Cluster |
|:-:|------|------|:-:|
| Jul S1 | Guía completa: Cómo elegir un geriátrico en Mar del Plata | cómo elegir geriátrico mar del plata | Elegir |
| Jul S2 | 10 preguntas que debés hacer al visitar una residencia geriátrica | preguntas visitar geriátrico | Elegir |
| Jul S3 | Diferencias entre geriátrico, residencia y hogar de ancianos | diferencia geriátrico residencia | Elegir |
| Jul S4 | Precio de geriátricos en Mar del Plata: Guía actualizada 2026 | precio geriátrico mar del plata 2026 | Costos |
| Ago S1 | Cobertura PAMI para residencias geriátricas: Todo lo que necesitás saber | pami geriátrico | Costos |
| Ago S2 | 7 señales de que tu familiar necesita atención geriátrica profesional | señales atención geriátrica | Salud |
| Ago S3 | Geriátricos habilitados en Mar del Plata: Cómo verificar | geriátrico habilitado mar del plata | Elegir |
| Ago S4 | Síntomas tempranos de Alzheimer: Cuándo consultar al geriatra | síntomas alzheimer temprano | Salud |
| Sep S1 | Kinesiología geriátrica: Beneficios para adultos mayores | kinesiología geriátrica | Profesionales |
| Sep S2 | Derechos del adulto mayor en Argentina: Guía legal completa | derechos adulto mayor argentina | Legal |
| Sep S3 | Internación temporal vs. permanente: ¿Cuál es la mejor opción? | internación temporal adultos mayores | Elegir |
| Sep S4 | Cuidar a un familiar con demencia: Guía para la familia | cuidar familiar demencia | Salud |

#### Q4 2026 (Octubre – Diciembre): Expansión

| Semana | Título del Artículo | Keyword Objetivo | Cluster |
|:-:|------|------|:-:|
| Oct S1 | Nutrición para adultos mayores: 15 alimentos esenciales | nutrición adultos mayores | Salud |
| Oct S2 | Centros de día en Mar del Plata: Alternativa a la internación | centro de día adultos mayores mdp | Elegir |
| Oct S3 | Terapia ocupacional para mayores: Qué es y cómo ayuda | terapia ocupacional adultos mayores | Profesionales |
| Oct S4 | Cómo prevenir caídas en adultos mayores: 12 consejos prácticos | prevención caídas adultos mayores | Salud |
| Nov S1 | Obras sociales y geriátricos: Qué cubre cada una en Argentina | obras sociales geriátricos | Costos |
| Nov S2 | Psicología geriátrica: Importancia de la salud mental en la vejez | psicología geriátrica | Profesionales |
| Nov S3 | Actividades recreativas para adultos mayores en Mar del Plata | actividades adultos mayores mdp | MdP |
| Nov S4 | Rehabilitación post-ACV: Cómo elegir el mejor centro | rehabilitación post acv | Salud |
| Dic S1 | Navidad con adultos mayores: Ideas para celebrar en familia | navidad adultos mayores | MdP |
| Dic S2 | Balance anual: Avances en el cuidado geriátrico en Argentina | cuidado geriátrico argentina | Legal |
| Dic S3 | Verano seguro para adultos mayores en Mar del Plata | verano adultos mayores mdp | MdP |
| Dic S4 | Año nuevo: Propósitos saludables para adultos mayores | salud adultos mayores | Salud |

#### Q1 2027 (Enero – Marzo): Profundización

| Semana | Título del Artículo | Keyword Objetivo | Cluster |
|:-:|------|------|:-:|
| Ene S1 | Golpe de calor en adultos mayores: Prevención y primeros auxilios | golpe de calor adultos mayores | Salud |
| Ene S2 | Cuidadores domiciliarios: Cómo elegir y contratar | cuidadores domiciliarios | Profesionales |
| Ene S3 | Ejercicios de estimulación cognitiva para adultos mayores | estimulación cognitiva mayores | Salud |
| Ene S4 | Trámites PAMI: Guía paso a paso para afiliación y prestaciones | trámites pami | Costos |
| Feb S1 | Cuidados paliativos: Qué son y cuándo se necesitan | cuidados paliativos | Salud |
| Feb S2 | Mar del Plata: Por qué es ideal para el retiro | mar del plata retiro | MdP |
| Feb S3 | Enfermería geriátrica: El rol fundamental del enfermero | enfermería geriátrica | Profesionales |
| Feb S4 | Adaptación del hogar para adultos mayores | adaptación hogar mayores | Salud |
| Mar S1 | Gerontología vs. Geriatría: Diferencias y cuándo consultar | gerontología vs geriatría | Profesionales |
| Mar S2 | Depresión en adultos mayores: Señales y tratamiento | depresión adultos mayores | Salud |
| Mar S3 | Centros de jubilados en Mar del Plata: Mapa completo | centros jubilados mdp | MdP |
| Mar S4 | Cuidado de personas con Parkinson: Guía familiar | cuidado parkinson | Salud |

#### Q2 2027 (Abril – Junio): Autoridad

| Semana | Título del Artículo | Keyword Objetivo | Cluster |
|:-:|------|------|:-:|
| Abr S1 | Trabajo social en geriatría: Apoyo integral al adulto mayor | trabajo social geriatría | Profesionales |
| Abr S2 | Suplementos y vitaminas para adultos mayores: Guía médica | suplementos adultos mayores | Salud |
| Abr S3 | Tecnología para adultos mayores: Apps y dispositivos útiles | tecnología adultos mayores | Salud |
| Abr S4 | Regulación de geriátricos en Buenos Aires: Marco legal vigente | regulación geriátricos buenos aires | Legal |
| May S1 | Diabetes en adultos mayores: Manejo y cuidados especiales | diabetes adultos mayores | Salud |
| May S2 | Turismo accesible en Mar del Plata para adultos mayores | turismo accesible mdp | MdP |
| May S3 | Rol del geriatra: Cuándo y por qué consultar | rol geriatra | Profesionales |
| May S4 | Alimentación en residencias geriátricas: Qué exigir | alimentación geriátricos | Elegir |
| Jun S1 | Musicoterapia para adultos mayores: Beneficios comprobados | musicoterapia adultos mayores | Salud |
| Jun S2 | Incontinencia en adultos mayores: Manejo con dignidad | incontinencia adultos mayores | Salud |
| Jun S3 | Espacios verdes accesibles en Mar del Plata | espacios verdes mdp | MdP |
| Jun S4 | Un año de Cuidar MdP: Impacto y aprendizajes | consultora geriátrica mdp | General |

### 5.2 Oportunidades de FAQ Schema

| Página | Preguntas Sugeridas para FAQPage Schema |
|--------|------------------------------------------|
| `/residencias` | ¿Cuántas residencias geriátricas hay en MdP? · ¿Cómo filtrar por tipo de cuidado? · ¿Cuál es el precio promedio? |
| `/asesoramiento` | ¿El asesoramiento es gratuito? · ¿Cuánto tarda la respuesta? · ¿Qué información necesitan? |
| `/profesionales` | ¿Cómo verifico la matrícula de un profesional? · ¿Atienden por obra social? |
| `/nosotros` | ¿Quiénes son Cuidar MdP? · ¿Desde cuándo operan? · ¿Cómo seleccionan las residencias? |
| Blog posts | Incluir sección de FAQ al final de cada artículo con 3-5 preguntas relevantes |

**Ejemplo de implementación del schema FAQPage:**

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "¿Cuánto cuesta un geriátrico en Mar del Plata?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Los precios de residencias geriátricas en Mar del Plata varían entre $400.000 y $1.200.000 mensuales según el tipo de cuidado, ubicación y servicios incluidos."
      }
    }
  ]
}
```

---

## 6. SEO Técnico

### 6.1 Optimización de Velocidad (Next.js)

| Acción | Impacto | Prioridad | Estado |
|--------|---------|:-:|:-:|
| Usar `next/image` para todas las imágenes | Alto | 🔴 | ⬜ Pendiente |
| Habilitar compresión gzip/brotli en Vercel | Alto | 🔴 | ⬜ (automático en Vercel) |
| Lazy load de componentes pesados con `dynamic()` | Medio | 🟡 | ⬜ Pendiente |
| Prefetch de rutas con `<Link prefetch>` | Medio | ✅ | Automático en Next.js |
| Minimizar CSS no utilizado | Medio | 🟡 | ⬜ Pendiente |
| Caché de datos estáticos con ISR | Alto | 🟡 | ⬜ Pendiente |
| Optimizar fuentes con `next/font` | Alto | ✅ | Ya implementado |
| Reducir JavaScript del lado del cliente | Alto | 🟡 | ⬜ Auditar |

### 6.2 Core Web Vitals — Objetivos

| Métrica | Objetivo | Actual | Umbral Google |
|---------|:-:|:-:|:-:|
| **LCP** (Largest Contentful Paint) | < 2.0 s | Por medir | < 2.5 s (bueno) |
| **INP** (Interaction to Next Paint) | < 150 ms | Por medir | < 200 ms (bueno) |
| **CLS** (Cumulative Layout Shift) | < 0.05 | Por medir | < 0.1 (bueno) |
| **FCP** (First Contentful Paint) | < 1.5 s | Por medir | < 1.8 s (bueno) |
| **TTFB** (Time to First Byte) | < 400 ms | Por medir | < 800 ms (bueno) |

### 6.3 Mobile-First

- ✅ Viewport meta tag configurado
- ✅ Fuentes escalables (rem)
- ✅ CSS responsive con CSS custom properties
- ⬜ Verificar touch targets ≥ 48x48px en todos los botones
- ⬜ Probar en dispositivos reales (Android / iOS)
- ⬜ Verificar que formulario de asesoramiento sea usable en mobile
- ⬜ Optimizar imágenes para conexiones 3G

### 6.4 Expansión de Datos Estructurados

**BreadcrumbList Schema** (agregar):

```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Inicio",
      "item": "https://cuidarmdp.com.ar"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Residencias",
      "item": "https://cuidarmdp.com.ar/residencias"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Sol de Otoño",
      "item": "https://cuidarmdp.com.ar/residencias/sol-de-otono"
    }
  ]
}
```

**Service Schema** (agregar):

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Asesoramiento Geriátrico Personalizado",
  "provider": {
    "@type": "LocalBusiness",
    "name": "Cuidar MdP"
  },
  "description": "Servicio de asesoramiento gratuito para encontrar la residencia geriátrica ideal en Mar del Plata.",
  "areaServed": {
    "@type": "City",
    "name": "Mar del Plata"
  },
  "serviceType": "Consultoría geriátrica",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "ARS",
    "description": "Asesoramiento inicial gratuito"
  }
}
```

### 6.5 Optimización de Imágenes

```typescript
// Uso recomendado de next/image
import Image from 'next/image';

<Image
  src="/images/residencias/sol-de-otono.webp"
  alt="Fachada de Sol de Otoño, residencia geriátrica en Los Troncos"
  width={800}
  height={600}
  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
  priority={false} // true solo para above-the-fold
/>
```

**Formatos recomendados:**
- **WebP** como formato principal (30% más liviano que JPEG)
- **AVIF** como formato de siguiente generación (cuando el soporte crezca)
- Mantener fallback JPEG para navegadores sin soporte

---

## 7. Link Building

### 7.1 Directorios Locales y de Salud

| # | Sitio | Tipo | DA Estimado | Acción |
|---|-------|------|:-:|----------|
| 1 | paginasdoradas.com.ar | Directorio general | 45 | Crear listado gratuito |
| 2 | guialocal.com.ar | Directorio local | 35 | Crear perfil |
| 3 | pami.org.ar | Directorio salud | 55 | Registrar como prestador referente |
| 4 | buenosaires.gob.ar | Gobierno | 70 | Buscar directorios de servicios |
| 5 | mardelplata.gob.ar | Gobierno local | 50 | Registrar en guía de servicios |
| 6 | portalterceraedad.com.ar | Portal temático | 30 | Guest post + listado |
| 7 | infogeriatria.com | Portal geriátrico | 35 | Guest post |
| 8 | sgg.org.ar | Sociedad Argentina de Gerontología | 40 | Vinculación institucional |

### 7.2 Estrategia de Guest Posting

**Medios locales de Mar del Plata:**
- La Capital MdP (lacapitalmdp.com) — Artículos sobre salud y tercera edad
- 0223 (0223.com.ar) — Notas de interés comunitario
- El Marplatense (elmarplatense.com) — Contenido sobre servicios locales

**Contenido propuesto para guest posts:**
1. "5 consejos para elegir el geriátrico adecuado" (con backlink a `/residencias`)
2. "La importancia de la evaluación geriátrica integral" (con backlink a `/profesionales`)
3. "Derechos del adulto mayor: Lo que toda familia debe saber" (con backlink a blog)

### 7.3 Social Media como fuente de backlinks

| Red Social | Frecuencia | Tipo de Contenido | Link Target |
|-----------|:-:|------|:-:|
| Instagram | 4 posts/semana | Consejos, residencias destacadas, testimonios | Link en bio → Home |
| Facebook | 3 posts/semana | Artículos del blog, eventos, información útil | Links directos a artículos |
| LinkedIn | 2 posts/semana | Contenido profesional, notas de prensa | Links a blog + servicios |
| WhatsApp Status | Diario | Consejos rápidos, novedades | — |

### 7.4 Alianzas Estratégicas

| Partner | Tipo de Colaboración | Beneficio SEO |
|---------|---------------------|---------------|
| Clínicas y sanatorios de MdP | Link cruzado en "recursos recomendados" | Backlinks de sitios de salud |
| PAMI regional | Mención como referente en la zona | Link de alta autoridad |
| Facultad de Medicina (UNMdP) | Colaboración en contenido educativo | Backlink .edu.ar |
| Centros de jubilados | Presencia en sus sitios web | Links locales relevantes |
| Farmacias locales | Material impreso con QR al sitio | Tráfico directo |

---

## 8. Medición y KPIs

### 8.1 Setup de Google Search Console

1. **Verificar propiedad** de `cuidarmdp.com.ar` (DNS TXT record o HTML tag)
2. **Enviar sitemap:** `https://cuidarmdp.com.ar/sitemap.xml`
3. **Solicitar indexación** de las páginas principales
4. **Configurar notificaciones** por email para errores de cobertura
5. **Vincular con GA4** para datos combinados

### 8.2 Reportes Personalizados en GA4

| Reporte | Dimensiones | Métricas | Frecuencia |
|---------|-------------|----------|:-:|
| Tráfico Orgánico | Página de destino, Query | Sesiones, CTR, Posición media | Semanal |
| Conversiones | Fuente/Medio, Página | Formularios enviados, Clicks WhatsApp | Semanal |
| Comportamiento del Blog | Título del artículo, Fuente | Páginas vistas, Tiempo promedio, Rebote | Quincenal |
| SEO Local | Ciudad, Dispositivo | Sesiones, Conversiones | Mensual |
| Core Web Vitals | Página, Dispositivo | LCP, INP, CLS | Mensual |

### 8.3 KPIs Mensuales

| KPI | Baseline (Mes 0) | Meta Q3 2026 | Meta Q4 2026 | Meta Q1 2027 | Meta Q2 2027 |
|-----|:-:|:-:|:-:|:-:|:-:|
| Sesiones orgánicas / mes | 0 | 500 | 1.500 | 3.000 | 5.000 |
| Impresiones en Search Console | 0 | 5.000 | 15.000 | 30.000 | 50.000 |
| CTR promedio | — | 3% | 4% | 5% | 6% |
| Keywords en Top 10 | 0 | 5 | 15 | 30 | 50 |
| Keywords en Top 3 | 0 | 1 | 5 | 10 | 20 |
| Formularios de asesoramiento | 0 | 10/mes | 25/mes | 50/mes | 80/mes |
| Clicks a WhatsApp | 0 | 30/mes | 80/mes | 150/mes | 250/mes |
| Backlinks (dominios únicos) | 0 | 10 | 25 | 40 | 60 |
| Domain Authority | 0 | 10 | 15 | 20 | 25 |
| Google Reviews | 0 | 10 | 25 | 40 | 60 |
| Artículos de blog publicados | 8 | 20 | 32 | 44 | 56 |
| Lighthouse SEO Score | — | > 90 | > 95 | > 95 | > 98 |

### 8.4 Objetivos de Ranking por Trimestre

| Keyword | Posición Q3 | Posición Q4 | Posición Q1 '27 | Posición Q2 '27 |
|---------|:-:|:-:|:-:|:-:|
| geriátrico mar del plata | Top 20 | Top 10 | Top 5 | Top 3 |
| residencia adultos mayores mdp | Top 20 | Top 10 | Top 5 | Top 3 |
| consultora geriátrica mar del plata | Top 10 | Top 5 | Top 3 | #1 |
| cómo elegir geriátrico mdp | Top 10 | Top 5 | Top 3 | Top 3 |
| precio geriátrico mar del plata | Top 20 | Top 10 | Top 5 | Top 3 |
| pami geriátrico mar del plata | Top 20 | Top 10 | Top 10 | Top 5 |
| cuidadores adultos mayores mdp | Top 20 | Top 10 | Top 5 | Top 3 |

### 8.5 Herramientas de Monitoreo

| Herramienta | Uso | Costo |
|-------------|-----|-------|
| Google Search Console | Indexación, rendimiento, errores | Gratuita |
| Google Analytics 4 | Tráfico, comportamiento, conversiones | Gratuita |
| Google PageSpeed Insights | Core Web Vitals | Gratuita |
| Google Rich Results Test | Validar structured data | Gratuita |
| Ahrefs Webmaster Tools | Backlinks, health check | Gratuita (básico) |
| Ubersuggest | Keyword tracking (5 proyectos) | Gratuita (limitada) |
| Screaming Frog | Auditoría técnica (hasta 500 URLs) | Gratuita (limitada) |

---

## Próximos Pasos Inmediatos

1. ✅ **Semana 1:** Crear imagen OG default y por página
2. ✅ **Semana 1:** Implementar BreadcrumbList schema
3. ✅ **Semana 1:** Crear página 404 personalizada
4. ✅ **Semana 2:** Configurar Google Business Profile
5. ✅ **Semana 2:** Crear Google Search Console y enviar sitemap
6. ✅ **Semana 2:** Registrar en directorios locales (top 5)
7. ✅ **Semana 3:** Implementar FAQPage schema en 3 páginas
8. ✅ **Semana 3:** Migrar imágenes a `next/image` con WebP
9. ✅ **Semana 4:** Publicar primer artículo del calendario de contenidos
10. ✅ **Semana 4:** Correr primer Lighthouse audit y documentar baselines

---

> 📋 **Documento mantenido por:** Equipo Cuidar MdP  
> 🔄 **Próxima revisión:** Septiembre 2026

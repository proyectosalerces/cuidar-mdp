# 🚀 Guía de Deployment — Cuidar MdP

> **Versión:** 1.0  
> **Fecha:** Junio 2026  
> **Stack:** Next.js 16.2.7 · React 19.2.4 · TypeScript  
> **Plataforma:** Vercel + Firebase  
> **Dominio:** cuidarmdp.com.ar  

---

## Índice

1. [Requisitos Previos](#1-requisitos-previos)
2. [Variables de Entorno](#2-variables-de-entorno)
3. [Deployment a Vercel](#3-deployment-a-vercel)
4. [Firebase Setup](#4-firebase-setup)
5. [Google Analytics Setup](#5-google-analytics-setup)
6. [DNS y Dominio](#6-dns-y-dominio)
7. [Checklist Post-Deployment](#7-checklist-post-deployment)
8. [Mantenimiento](#8-mantenimiento)

---

## 1. Requisitos Previos

### 1.1 Software Necesario

| Software | Versión Mínima | Propósito | Instalación |
|----------|:-:|-----------|-------------|
| **Node.js** | 20.x LTS | Runtime de JavaScript | [nodejs.org](https://nodejs.org) |
| **npm** | 10.x | Gestor de paquetes (incluido con Node.js) | Incluido con Node.js |
| **Git** | 2.40+ | Control de versiones | [git-scm.com](https://git-scm.com) |
| **VS Code** | Última | Editor de código (recomendado) | [code.visualstudio.com](https://code.visualstudio.com) |

**Verificar instalaciones:**

```bash
node --version    # Esperado: v20.x.x o superior
npm --version     # Esperado: 10.x.x o superior
git --version     # Esperado: 2.40+
```

### 1.2 Cuentas Necesarias

| Servicio | URL | Propósito | Costo |
|----------|-----|-----------|-------|
| **GitHub** | github.com | Repositorio de código | Gratis |
| **Vercel** | vercel.com | Hosting y deployment | Gratis (Hobby) |
| **Firebase** | firebase.google.com | Base de datos, auth, storage | Gratis (Spark plan) |
| **Google Analytics** | analytics.google.com | Analítica web | Gratis |
| **Google Search Console** | search.google.com/search-console | SEO y indexación | Gratis |
| **NIC Argentina** | nic.ar | Registro de dominio .com.ar | ~ARS $2.500/año |
| **Resend** | resend.com | Envío de emails transaccionales | Gratis (100 emails/día) |

### 1.3 Conocimientos Recomendados

- Manejo básico de terminal/línea de comandos
- Conceptos básicos de Git (clone, push, pull)
- Cuenta de Google (para Firebase y Analytics)
- CUIL/CUIT válido (para registrar dominio .com.ar)

---

## 2. Variables de Entorno

### 2.1 Tabla de Variables

| Variable | Tipo | Descripción | Ejemplo | ¿Requerida? |
|----------|------|-------------|---------|:-:|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Pública | API Key del proyecto Firebase | `AIzaSyB...xyz` | ✅ Sí |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Pública | Dominio de autenticación Firebase | `cuidar-mdp.firebaseapp.com` | ✅ Sí |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Pública | ID del proyecto Firebase | `cuidar-mdp` | ✅ Sí |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Pública | Bucket de almacenamiento | `cuidar-mdp.appspot.com` | ✅ Sí |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Pública | ID del remitente de mensajes | `123456789012` | ✅ Sí |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Pública | ID de la aplicación Firebase | `1:123456789:web:abc123` | ✅ Sí |
| `RESEND_API_KEY` | Servidor | API Key de Resend para emails | `re_abc123...` | ✅ Sí |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | Pública | ID de medición de Google Analytics 4 | `G-XXXXXXXXXX` | ✅ Sí |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Pública | Número de WhatsApp (sin +, sin espacios) | `5492235550100` | ✅ Sí |
| `NEXT_PUBLIC_SITE_URL` | Pública | URL completa del sitio (sin / final) | `https://cuidarmdp.com.ar` | ✅ Sí |

### 2.2 Configuración Local

```bash
# 1. Copiar el archivo de ejemplo
cp .env.example .env.local

# 2. Editar con los valores reales
# (usar VS Code o el editor preferido)
code .env.local
```

**Contenido de `.env.local`:**

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyB_tu_api_key_aqui
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=cuidar-mdp.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=cuidar-mdp
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=cuidar-mdp.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123def456

# Email Service (Resend)
RESEND_API_KEY=re_tu_api_key_aqui

# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TU_ID_AQUI

# WhatsApp Business
NEXT_PUBLIC_WHATSAPP_NUMBER=5492235550100

# Site URL
NEXT_PUBLIC_SITE_URL=https://cuidarmdp.com.ar
```

### 2.3 Nota de Seguridad

> ⚠️ **IMPORTANTE sobre `NEXT_PUBLIC_`:**  
> Las variables con prefijo `NEXT_PUBLIC_` son **visibles en el navegador del usuario**. Esto es necesario para Firebase y GA4 (que se ejecutan en el cliente), pero significa que estas claves serán públicas.
>
> - **Firebase:** Las API keys de Firebase están diseñadas para ser públicas. La seguridad se controla con **Firebase Security Rules** (ver sección 4).
> - **Resend:** La variable `RESEND_API_KEY` **NO tiene** prefijo `NEXT_PUBLIC_` porque se usa solo del lado del servidor. **Nunca** la expongas al cliente.
> - **`.env.local` nunca debe subirse a Git.** Verificar que esté listado en `.gitignore`.

### 2.4 Configurar Variables en Vercel

1. Ir a **Dashboard de Vercel** → Seleccionar proyecto `cuidar-mdp`
2. Navegar a **Settings** → **Environment Variables**
3. Para cada variable:
   - Ingresar el **nombre** (ej: `NEXT_PUBLIC_FIREBASE_API_KEY`)
   - Ingresar el **valor** (ej: `AIzaSyB...`)
   - Seleccionar los entornos: ✅ Production, ✅ Preview, ✅ Development
   - Click en **Save**
4. Repetir para todas las variables de la tabla
5. **Re-deploy** el proyecto para que los cambios tomen efecto

---

## 3. Deployment a Vercel

### 3.1 Preparación del Repositorio

```bash
# 1. Verificar que el proyecto compila correctamente
npm run build

# 2. Verificar que no haya errores de lint
npm run lint

# 3. Asegurar que todo está commiteado
git status
git add .
git commit -m "chore: preparar para deployment"
git push origin main
```

### 3.2 Conectar con Vercel (Primera vez)

**Paso 1:** Crear cuenta en Vercel

1. Ir a [vercel.com](https://vercel.com)
2. Registrarse con la cuenta de GitHub
3. Autorizar acceso al repositorio

**Paso 2:** Importar proyecto

1. Click en **"Add New..."** → **"Project"**
2. Seleccionar el repositorio `cuidar-mdp` de GitHub
3. Vercel detectará automáticamente que es un proyecto Next.js

**Paso 3:** Configurar build settings

| Configuración | Valor |
|---------------|-------|
| Framework Preset | Next.js (detectado automáticamente) |
| Build Command | `npm run build` |
| Output Directory | `.next` (por defecto) |
| Install Command | `npm install` |
| Node.js Version | 20.x |

**Paso 4:** Configurar variables de entorno

- Agregar **todas** las variables de la [sección 2.1](#21-tabla-de-variables)
- Seleccionar todos los entornos (Production, Preview, Development)

**Paso 5:** Deploy

1. Click en **"Deploy"**
2. Esperar a que el build complete (~2-3 minutos)
3. Vercel proveerá una URL temporal: `cuidar-mdp.vercel.app`
4. Verificar que el sitio funcione correctamente

### 3.3 Configurar Dominio Personalizado

1. En el dashboard del proyecto → **Settings** → **Domains**
2. Agregar: `cuidarmdp.com.ar`
3. Agregar: `www.cuidarmdp.com.ar` (redirect a versión sin www)
4. Vercel mostrará los registros DNS necesarios (ver [sección 6](#6-dns-y-dominio))
5. **SSL/TLS:** Se configura automáticamente con Let's Encrypt. No requiere acción manual.

### 3.4 Preview Deployments

Vercel genera automáticamente un deployment de preview para cada **Pull Request** en GitHub:

- URL: `cuidar-mdp-{hash}-{team}.vercel.app`
- Permite revisar cambios antes de mergear a producción
- Los reviewers pueden ver los cambios en vivo
- Se elimina automáticamente al cerrar el PR

### 3.5 Ambientes

| Ambiente | Branch | URL | Variables |
|----------|--------|-----|-----------|
| **Production** | `main` | `cuidarmdp.com.ar` | Variables de producción |
| **Preview** | Cualquier PR | `*.vercel.app` | Variables de preview |
| **Development** | Local | `localhost:3000` | `.env.local` |

---

## 4. Firebase Setup

### 4.1 Crear Proyecto Firebase

1. Ir a [console.firebase.google.com](https://console.firebase.google.com)
2. Click en **"Agregar proyecto"**
3. Nombre del proyecto: `cuidar-mdp`
4. Habilitar Google Analytics → Seleccionar cuenta existente o crear una nueva
5. Click en **"Crear proyecto"**
6. Una vez creado, ir a **Configuración del proyecto** → **General**
7. En **"Tus apps"**, click en el ícono web (`</>`)
8. Registrar app con nombre: `Cuidar MdP Web`
9. **Copiar las credenciales** (apiKey, authDomain, etc.) a las variables de entorno

### 4.2 Habilitar Firestore Database

1. En la consola de Firebase → **Build** → **Firestore Database**
2. Click en **"Crear base de datos"**
3. Seleccionar ubicación: `southamerica-east1` (São Paulo — más cercano a Argentina)
4. Modo de inicio: **"Modo de producción"** (reglas restrictivas por defecto)
5. Click en **"Crear"**

### 4.3 Habilitar Firebase Authentication

1. En la consola → **Build** → **Authentication**
2. Click en **"Comenzar"**
3. Habilitar proveedores de inicio de sesión:
   - **Email/Contraseña** (para panel admin futuro)
   - **Google** (opcional, para login rápido de admin)
4. Configurar dominio autorizado: agregar `cuidarmdp.com.ar`

### 4.4 Habilitar Firebase Storage

1. En la consola → **Build** → **Storage**
2. Click en **"Comenzar"**
3. Ubicación: `southamerica-east1` (misma que Firestore)
4. Modo: Producción

### 4.5 Security Rules — Firestore

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    // ── Residencias (lectura pública, escritura solo admin) ──
    match /residencias/{residenciaId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.admin == true;
    }

    // ── Profesionales (lectura pública, escritura solo admin) ──
    match /profesionales/{profesionalId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.admin == true;
    }

    // ── Blog Posts (lectura pública, escritura solo admin) ──
    match /blog_posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.admin == true;
    }

    // ── Consultas de Asesoramiento (solo creación pública, lectura admin) ──
    match /consultas/{consultaId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null
                                   && request.auth.token.admin == true;
    }

    // ── Mensajes de Contacto (solo creación pública, lectura admin) ──
    match /contacto/{mensajeId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null
                                   && request.auth.token.admin == true;
    }

    // ── Newsletter Subscribers (solo creación pública, lectura admin) ──
    match /newsletter_subscribers/{subscriberId} {
      allow create: if true;
      allow read, update, delete: if request.auth != null
                                   && request.auth.token.admin == true;
    }

    // ── Denegar todo lo demás ──
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 4.6 Security Rules — Storage

```javascript
rules_version = '2';

service firebase.storage {
  match /b/{bucket}/o {

    // ── Imágenes de residencias (lectura pública, escritura admin) ──
    match /residencias/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.admin == true
                   && request.resource.size < 5 * 1024 * 1024  // Max 5MB
                   && request.resource.contentType.matches('image/.*');
    }

    // ── Imágenes de profesionales (lectura pública, escritura admin) ──
    match /profesionales/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.admin == true
                   && request.resource.size < 5 * 1024 * 1024
                   && request.resource.contentType.matches('image/.*');
    }

    // ── Imágenes del blog (lectura pública, escritura admin) ──
    match /blog/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null
                   && request.auth.token.admin == true
                   && request.resource.size < 10 * 1024 * 1024  // Max 10MB
                   && request.resource.contentType.matches('image/.*');
    }

    // ── Denegar todo lo demás ──
    match /{allPaths=**} {
      allow read, write: if false;
    }
  }
}
```

### 4.7 Estructura de Colecciones Firestore

#### Colección: `residencias`

```typescript
interface ResidenciaDoc {
  // Identificación
  id: string;                    // Auto-generado por Firestore
  slug: string;                  // "sol-de-otono"
  nombre: string;                // "Sol de Otoño"

  // Descripciones
  descripcionCorta: string;      // Max 200 caracteres
  descripcionLarga: string;      // Markdown completo

  // Ubicación
  direccion: string;             // "Av. Colón 1234"
  barrio: string;                // "los-troncos"
  ciudad: string;                // "Mar del Plata"
  coordenadas: {
    lat: number;                 // -38.0055
    lng: number;                 // -57.5426
  };

  // Contacto
  telefono: string;              // "+54 9 223 555-0100"
  email: string;                 // "info@soldeotono.com.ar"
  website?: string;              // "https://soldeotono.com.ar"
  whatsapp?: string;             // "5492235550100"

  // Servicios
  tiposCuidado: string[];        // ["internacion-permanente", "centro-de-dia"]
  servicios: string[];           // ["kinesiología", "nutrición", ...]
  obrasSociales: string[];       // ["PAMI", "OSDE", ...]
  capacidad: number;             // 45

  // Imágenes
  imagenPrincipal: string;       // URL de Storage
  galeria: string[];             // URLs de Storage

  // Precios
  precioDesde: number;           // 450000
  rangoPrecios?: string;         // "$450.000 - $800.000"

  // Valoración
  calificacion: number;          // 4.5
  cantidadResenas: number;       // 23

  // Estado
  activa: boolean;               // true
  destacada: boolean;            // false
  verificada: boolean;           // true

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Colección: `profesionales`

```typescript
interface ProfesionalDoc {
  id: string;
  slug: string;                   // "dra-maria-lopez"
  nombre: string;                 // "Dra. María López"
  especialidad: string;           // "geriatra"
  matricula: string;              // "MP 12345"
  descripcion: string;            // Bio profesional
  foto: string;                   // URL de Storage

  // Contacto
  telefono: string;
  email?: string;
  website?: string;
  direccionConsultorio: string;

  // Profesional
  experienciaAnios: number;
  obrasSociales: string[];
  horarioAtencion?: string;       // "Lun-Vie 9:00-17:00"

  // Valoración
  calificacion: number;
  cantidadResenas: number;

  // Estado
  activo: boolean;

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Colección: `blog_posts`

```typescript
interface BlogPostDoc {
  id: string;
  slug: string;                   // "como-elegir-geriatrico"
  titulo: string;
  extracto: string;              // Max 200 caracteres
  contenido: string;             // Markdown
  imagenPortada: string;         // URL de Storage
  categoria: string;             // "guias", "salud", "legal"
  tags: string[];                // ["geriátrico", "consejos"]
  tiempoLectura: number;         // Minutos estimados

  // Autor
  autor: {
    nombre: string;
    bio?: string;
    foto?: string;
  };

  // SEO
  metaTitle?: string;
  metaDescription?: string;

  // Estado
  publicado: boolean;
  destacado: boolean;
  fechaPublicacion: string;       // ISO date

  // Timestamps
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### Colección: `consultas`

```typescript
interface ConsultaDoc {
  id: string;

  // Datos del solicitante
  nombreCompleto: string;
  email: string;
  telefono: string;
  relacion: string;              // "hijo/a", "cónyuge", "otro"

  // Datos del adulto mayor
  edadAdultoMayor: number;
  condicionesMedicas: string[];
  movilidad: string;             // "independiente", "asistida", "postrado"
  necesidadCognitiva: string;    // "sin-deterioro", "leve", "moderado", "severo"

  // Preferencias
  tipoCuidado: string;           // "internacion-permanente", etc.
  zonasPreferidas: string[];     // ["los-troncos", "centro"]
  presupuestoMax?: number;
  obraSocial?: string;
  comentarios?: string;

  // Estado
  estado: string;                // "nueva", "en-proceso", "respondida", "cerrada"
  notas?: string;                // Notas internas del equipo

  // Timestamps
  createdAt: Timestamp;
  respondidaAt?: Timestamp;
}
```

#### Colección: `contacto`

```typescript
interface ContactoDoc {
  id: string;
  nombre: string;
  email: string;
  telefono?: string;
  asunto: string;
  mensaje: string;
  leido: boolean;
  createdAt: Timestamp;
}
```

#### Colección: `newsletter_subscribers`

```typescript
interface NewsletterSubscriberDoc {
  id: string;
  email: string;
  nombre?: string;
  activo: boolean;
  fuente: string;               // "footer", "blog", "popup"
  createdAt: Timestamp;
  unsubscribedAt?: Timestamp;
}
```

### 4.8 Índices de Firestore

Crear los siguientes índices compuestos en la consola de Firebase → Firestore → Índices:

| Colección | Campos | Orden | Uso |
|-----------|--------|-------|-----|
| `residencias` | `activa` ASC, `calificacion` DESC | Compuesto | Listado por calificación |
| `residencias` | `activa` ASC, `barrio` ASC, `calificacion` DESC | Compuesto | Filtro por barrio |
| `residencias` | `activa` ASC, `tiposCuidado` ARRAY, `calificacion` DESC | Compuesto | Filtro por tipo de cuidado |
| `profesionales` | `activo` ASC, `especialidad` ASC, `calificacion` DESC | Compuesto | Filtro por especialidad |
| `blog_posts` | `publicado` ASC, `fechaPublicacion` DESC | Compuesto | Listado cronológico |
| `blog_posts` | `publicado` ASC, `categoria` ASC, `fechaPublicacion` DESC | Compuesto | Filtro por categoría |
| `consultas` | `estado` ASC, `createdAt` DESC | Compuesto | Panel admin: pendientes |

---

## 5. Google Analytics Setup

### 5.1 Crear Propiedad GA4

1. Ir a [analytics.google.com](https://analytics.google.com)
2. Click en **"Admin"** (⚙️ abajo a la izquierda)
3. Click en **"+ Crear propiedad"**
4. Configurar:
   - Nombre: `Cuidar MdP`
   - Zona horaria: `Argentina (GMT-3)`
   - Moneda: `Peso argentino (ARS)`
5. Información del negocio:
   - Categoría: `Salud`
   - Tamaño: `Pequeño`
6. Objetivos: Seleccionar **"Generar clientes potenciales"** y **"Conocer el comportamiento del usuario"**
7. Crear flujo de datos → **Web**:
   - URL: `https://cuidarmdp.com.ar`
   - Nombre: `Cuidar MdP - Web`
8. **Copiar el Measurement ID** (formato: `G-XXXXXXXXXX`)
9. Agregar a la variable de entorno `NEXT_PUBLIC_GA_MEASUREMENT_ID`

### 5.2 Eventos Personalizados a Implementar

El componente `GoogleAnalytics.tsx` ya trackea `page_view` automáticamente. Agregar los siguientes eventos personalizados:

```typescript
// utils/analytics.ts

/**
 * Envía un evento personalizado a Google Analytics 4.
 */
export function trackEvent(
  eventName: string,
  parameters?: Record<string, string | number | boolean>
) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
}

// ── Eventos específicos ─────────────────────────────────────────────────

/** Click en botón de WhatsApp */
export function trackWhatsAppClick(source: string) {
  trackEvent('click_whatsapp', { source }); // source: "fab", "header", "residencia", "profesional"
}

/** Envío del formulario de asesoramiento */
export function trackAsesoramientoSubmit(step: number) {
  trackEvent('submit_asesoramiento', { step, form_name: 'asesoramiento' });
}

/** Click en una residencia (desde listado) */
export function trackResidenciaClick(residenciaSlug: string, position: number) {
  trackEvent('click_residencia', { residencia: residenciaSlug, position });
}

/** Click en un profesional (desde listado) */
export function trackProfesionalClick(profesionalSlug: string) {
  trackEvent('click_profesional', { profesional: profesionalSlug });
}

/** Compartir artículo del blog */
export function trackBlogShare(postSlug: string, method: string) {
  trackEvent('share_blog_post', { post: postSlug, method }); // method: "whatsapp", "facebook", "copy"
}

/** Toggle de modo oscuro */
export function trackDarkModeToggle(enabled: boolean) {
  trackEvent('toggle_dark_mode', { dark_mode: enabled });
}

/** Click en número de teléfono */
export function trackPhoneClick(source: string) {
  trackEvent('click_phone', { source });
}

/** Suscripción al newsletter */
export function trackNewsletterSubscribe(source: string) {
  trackEvent('newsletter_subscribe', { source }); // source: "footer", "blog", "popup"
}

/** Envío de formulario de contacto */
export function trackContactSubmit() {
  trackEvent('submit_contacto', { form_name: 'contacto' });
}

/** Uso de filtros de búsqueda */
export function trackFilterUse(filterType: string, filterValue: string) {
  trackEvent('filter_use', { filter_type: filterType, filter_value: filterValue });
}
```

### 5.3 Configurar Conversiones en GA4

1. En GA4 → **Admin** → **Eventos**
2. Marcar como conversión los siguientes eventos:

| Evento | Tipo de Conversión | Valor |
|--------|-------------------|-------|
| `submit_asesoramiento` | Lead generation | Primario |
| `submit_contacto` | Lead generation | Secundario |
| `click_whatsapp` | Engagement | Secundario |
| `newsletter_subscribe` | Lead generation | Terciario |
| `click_phone` | Engagement | Terciario |

### 5.4 Vincular con Google Search Console

1. En GA4 → **Admin** → **Vinculaciones de productos** → **Search Console**
2. Click en **"Vincular"**
3. Seleccionar la propiedad de Search Console de `cuidarmdp.com.ar`
4. Confirmar vinculación
5. Los datos de Search Console aparecerán en GA4 → **Adquisición** → **Search Console**

---

## 6. DNS y Dominio

### 6.1 Registrar Dominio .com.ar

**Proceso en NIC Argentina (nic.ar):**

1. **Crear cuenta** en [nic.ar](https://nic.ar) con CUIL/CUIT
2. Verificar identidad (requiere clave fiscal nivel 2+ de AFIP)
3. **Buscar disponibilidad** de `cuidarmdp.com.ar`
4. **Registrar el dominio:**
   - Completar datos del titular
   - Seleccionar período de registro (1 año mínimo)
   - Pagar mediante los medios habilitados
5. **Delegar DNS** (ver paso 6.2)

> 💡 **Alternativa:** Si nic.ar resulta complejo, se pueden usar registradores intermediarios argentinos como **DonWeb**, **Hostinger AR** o **WireHost** que simplifican el proceso.

### 6.2 Configuración DNS para Vercel

Una vez registrado el dominio, configurar los siguientes registros DNS:

**Para dominio raíz (`cuidarmdp.com.ar`):**

| Tipo | Nombre | Valor | TTL |
|------|--------|-------|-----|
| `A` | `@` | `76.76.21.21` | 300 |

**Para subdominio www:**

| Tipo | Nombre | Valor | TTL |
|------|--------|-------|-----|
| `CNAME` | `www` | `cname.vercel-dns.com` | 300 |

**Pasos para configurar:**

1. Ir al panel de control del registrador de dominio (nic.ar o intermediario)
2. Buscar **"Administración DNS"** o **"Nameservers"**
3. Agregar los registros de la tabla anterior
4. Esperar propagación DNS (puede tardar hasta 48 horas, generalmente 1-4 horas)
5. En Vercel → **Settings** → **Domains** → Verificar que muestre ✅

### 6.3 Verificar Configuración

```bash
# Verificar registro A
nslookup cuidarmdp.com.ar
# Debe resolver a 76.76.21.21

# Verificar CNAME
nslookup www.cuidarmdp.com.ar
# Debe resolver a cname.vercel-dns.com

# Verificar SSL
curl -I https://cuidarmdp.com.ar
# Debe mostrar HTTP/2 200 y certificado válido
```

### 6.4 Configuración de Email

**Opción A — Google Workspace (recomendada para equipos):**

| Costo | Capacidad | Beneficios |
|-------|-----------|------------|
| ~USD 7.20/usuario/mes | 30 GB/usuario | Gmail, Calendar, Drive, Meet |

1. Registrarse en [workspace.google.com](https://workspace.google.com)
2. Verificar dominio agregando registro TXT en DNS
3. Configurar registros MX:

| Prioridad | Servidor |
|:-:|---------|
| 1 | `ASPMX.L.GOOGLE.COM` |
| 5 | `ALT1.ASPMX.L.GOOGLE.COM` |
| 5 | `ALT2.ASPMX.L.GOOGLE.COM` |
| 10 | `ALT3.ASPMX.L.GOOGLE.COM` |
| 10 | `ALT4.ASPMX.L.GOOGLE.COM` |

**Opción B — Zoho Mail (gratuita para 1 usuario):**

| Costo | Capacidad | Beneficios |
|-------|-----------|------------|
| Gratis | 5 GB | Email, Calendar básico |

1. Registrarse en [zoho.com/mail](https://zoho.com/mail)
2. Agregar dominio y verificar con registro TXT
3. Configurar registros MX de Zoho

**Cuentas de email a crear:**

| Dirección | Propósito |
|-----------|-----------|
| `info@cuidarmdp.com.ar` | Contacto general (principal) |
| `asesoramiento@cuidarmdp.com.ar` | Formulario de asesoramiento |
| `admin@cuidarmdp.com.ar` | Administración del sitio |

### 6.5 Redirect WWW

Configurar en Vercel para que `www.cuidarmdp.com.ar` redirija a `cuidarmdp.com.ar`:

1. En **Settings** → **Domains**
2. Agregar `www.cuidarmdp.com.ar`
3. Seleccionar **"Redirect to cuidarmdp.com.ar"**
4. Tipo: **308 Permanent Redirect**

---

## 7. Checklist Post-Deployment

### 7.1 Verificaciones Críticas

| # | Verificación | Herramienta | Estado |
|:-:|-------------|------------|:-:|
| 1 | Sitio accesible en `https://cuidarmdp.com.ar` | Navegador | ⬜ |
| 2 | HTTPS/SSL funcionando (candado verde) | Navegador | ⬜ |
| 3 | Redirect de `www` a dominio raíz | `curl -I www.cuidarmdp.com.ar` | ⬜ |
| 4 | `sitemap.xml` accesible | `https://cuidarmdp.com.ar/sitemap.xml` | ⬜ |
| 5 | `robots.txt` accesible | `https://cuidarmdp.com.ar/robots.txt` | ⬜ |
| 6 | PWA manifest accesible | `https://cuidarmdp.com.ar/manifest.webmanifest` | ⬜ |

### 7.2 SEO y Analítica

| # | Verificación | Herramienta | Estado |
|:-:|-------------|------------|:-:|
| 7 | Verificar propiedad en Google Search Console | Search Console | ⬜ |
| 8 | Enviar sitemap a Search Console | Search Console | ⬜ |
| 9 | GA4 recibiendo datos (verificar en tiempo real) | GA4 Real-time | ⬜ |
| 10 | JSON-LD validado sin errores | [Rich Results Test](https://search.google.com/test/rich-results) | ⬜ |
| 11 | Meta tags OG validados | [Facebook Sharing Debugger](https://developers.facebook.com/tools/debug/) | ⬜ |
| 12 | Canonical URLs correctas en todas las páginas | Inspección manual | ⬜ |

### 7.3 Funcionalidad

| # | Verificación | Método | Estado |
|:-:|-------------|--------|:-:|
| 13 | Página Home carga correctamente | Navegador | ⬜ |
| 14 | Listado de residencias funciona | Navegar a `/residencias` | ⬜ |
| 15 | Detalle de residencia funciona | Click en una residencia | ⬜ |
| 16 | Filtros de residencias funcionan | Probar todos los filtros | ⬜ |
| 17 | Listado de profesionales funciona | Navegar a `/profesionales` | ⬜ |
| 18 | Detalle de profesional funciona | Click en un profesional | ⬜ |
| 19 | Blog listado funciona | Navegar a `/blog` | ⬜ |
| 20 | Blog post individual funciona | Click en un artículo | ⬜ |
| 21 | Formulario de asesoramiento (todos los pasos) | Completar formulario | ⬜ |
| 22 | Formulario de contacto | Enviar mensaje de prueba | ⬜ |
| 23 | Links de WhatsApp funcionan (desktop y mobile) | Click en FAB y links | ⬜ |
| 24 | Links de teléfono funcionan en mobile | Click en números de teléfono | ⬜ |
| 25 | Newsletter suscripción funciona | Suscribirse con email de prueba | ⬜ |
| 26 | Toggle de modo oscuro funciona | Click en botón de tema | ⬜ |
| 27 | Dark mode persiste al recargar | Recargar página | ⬜ |
| 28 | Navegación mobile (menú hamburguesa) | Probar en mobile | ⬜ |

### 7.4 Performance y Accesibilidad

| # | Verificación | Objetivo | Herramienta | Estado |
|:-:|-------------|:-:|------------|:-:|
| 29 | Lighthouse — Performance | > 90 | Chrome DevTools | ⬜ |
| 30 | Lighthouse — Accessibility | > 95 | Chrome DevTools | ⬜ |
| 31 | Lighthouse — Best Practices | > 90 | Chrome DevTools | ⬜ |
| 32 | Lighthouse — SEO | > 95 | Chrome DevTools | ⬜ |
| 33 | Core Web Vitals — LCP | < 2.5s | PageSpeed Insights | ⬜ |
| 34 | Core Web Vitals — INP | < 200ms | PageSpeed Insights | ⬜ |
| 35 | Core Web Vitals — CLS | < 0.1 | PageSpeed Insights | ⬜ |

### 7.5 Cross-Browser Testing

| # | Navegador | Desktop | Mobile | Estado |
|:-:|----------|:-:|:-:|:-:|
| 36 | Google Chrome | ⬜ | ⬜ | ⬜ |
| 37 | Mozilla Firefox | ⬜ | ⬜ | ⬜ |
| 38 | Safari | ⬜ | ⬜ (iOS) | ⬜ |
| 39 | Microsoft Edge | ⬜ | ⬜ | ⬜ |
| 40 | Samsung Internet | — | ⬜ | ⬜ |

---

## 8. Mantenimiento

### 8.1 Cronograma de Actualizaciones

| Frecuencia | Tarea | Responsable |
|-----------|-------|-------------|
| **Semanal** | Revisar errores en Vercel logs y Search Console | Desarrollo |
| **Semanal** | Publicar artículo del blog según calendario | Contenido |
| **Semanal** | Revisar y responder consultas de asesoramiento | Equipo |
| **Quincenal** | Verificar dependencias con `npm outdated` | Desarrollo |
| **Mensual** | Auditoría Lighthouse completa | Desarrollo |
| **Mensual** | Revisar métricas GA4 y Search Console | Marketing |
| **Mensual** | Backup de datos de Firestore | Desarrollo |
| **Trimestral** | Actualizar dependencias mayores (Next.js, React) | Desarrollo |
| **Trimestral** | Revisar y actualizar estrategia SEO | Marketing |
| **Semestral** | Auditoría de seguridad completa | Desarrollo |
| **Anual** | Renovar dominio .com.ar en NIC Argentina | Administración |

### 8.2 Estrategia de Backups

**Firestore:**

```bash
# Exportar todas las colecciones a un bucket de Storage
# (Ejecutar desde Google Cloud Console o gcloud CLI)
gcloud firestore export gs://cuidar-mdp-backups/$(date +%Y-%m-%d)
```

**Automatización recomendada:**
1. Crear un bucket de Storage: `cuidar-mdp-backups`
2. Configurar Cloud Scheduler para exportar semanalmente
3. Configurar retención: mantener últimos 30 días de backups

**Código fuente:**
- Git + GitHub = backup automático del código
- Vercel mantiene historial de deployments

**Datos de contenido (mock data actual):**
- Los archivos `mock-residencias.ts`, `mock-profesionales.ts`, `mock-blog.ts` sirven como backup inicial
- Al migrar a Firebase, mantener estos archivos como referencia

### 8.3 Monitoreo

| Herramienta | Qué Monitorea | Alertas | Costo |
|-------------|---------------|---------|-------|
| **Vercel Analytics** | Performance, visitas, Web Vitals | Automáticas | Incluido en Hobby |
| **Vercel Logs** | Errores de runtime, API routes | Manual | Incluido |
| **UptimeRobot** | Disponibilidad del sitio (cada 5 min) | Email/SMS | Gratis (50 monitores) |
| **Google Search Console** | Errores de indexación, cobertura | Email | Gratis |
| **GA4** | Tráfico, conversiones, comportamiento | Personalizable | Gratis |
| **Sentry** (opcional) | Errores de JavaScript en producción | Tiempo real | Gratis (5K eventos/mes) |

**Configurar UptimeRobot:**
1. Crear cuenta en [uptimerobot.com](https://uptimerobot.com)
2. Agregar monitor HTTP(S) para `https://cuidarmdp.com.ar`
3. Intervalo: 5 minutos
4. Alerta por email al detectar caída

### 8.4 Plan de Respuesta a Incidentes

| Severidad | Descripción | Tiempo de Respuesta | Acción |
|-----------|-------------|:-:|--------|
| 🔴 **Crítica** | Sitio caído completamente | < 1 hora | Verificar Vercel status, revisar último deploy, rollback si necesario |
| 🟠 **Alta** | Funcionalidad principal rota (formularios, listados) | < 4 horas | Identificar commit causante, fix + deploy |
| 🟡 **Media** | Error visual, componente menor roto | < 24 horas | Crear issue, fix en próximo sprint |
| 🟢 **Baja** | Error cosmético, typo en contenido | < 1 semana | Corregir en batch con otros fixes menores |

**Rollback de emergencia en Vercel:**
1. Ir a **Deployments** en el dashboard del proyecto
2. Encontrar el último deployment estable
3. Click en **"..."** → **"Promote to Production"**
4. El sitio se restaurará al estado anterior en ~30 segundos

### 8.5 Referencia de Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Iniciar servidor de desarrollo en `localhost:3000` |
| `npm run build` | Compilar para producción |
| `npm run start` | Iniciar servidor de producción local |
| `npm run lint` | Ejecutar ESLint para verificar código |
| `npm outdated` | Ver dependencias desactualizadas |
| `npm update` | Actualizar dependencias (minor/patch) |
| `npx next info` | Mostrar información del entorno Next.js |
| `npx next telemetry status` | Ver estado de telemetría de Next.js |

---

> 📋 **Documento mantenido por:** Equipo Cuidar MdP  
> 🔄 **Próxima revisión:** Septiembre 2026

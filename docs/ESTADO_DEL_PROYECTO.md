# Estado del proyecto — Cuidar MdP

> Documento de referencia: qué es el proyecto, todo lo construido hasta hoy y
> el plan para la próxima función (seguimiento de clics de contacto).
> Última actualización: 2026-07-16.

---

## 1. Resumen del proyecto

**Cuidar MdP** es un portal web para que las familias de Mar del Plata encuentren
y comparen **residencias geriátricas** y **profesionales** del cuidado de adultos
mayores, con información verificada y contacto directo.

| | |
|---|---|
| **Stack** | Next.js 16 (App Router) · React 19 · TypeScript · Firebase (Firestore + Auth) |
| **Hosting** | Vercel (deploy automático al hacer `push` a `main` en GitHub) |
| **Repo** | `github.com/proyectosalerces/cuidar-mdp` |
| **Dominio** | **www.cuidarmdp.com** (Diego tiene el `.com`; el `.com.ar` no existe) |
| **Base de datos** | Firestore. Lectura pública de contenido; escritura solo admin (por reglas) |
| **Admin** | Control por base de datos: es admin quien tenga su email en la colección `admins` |

### Cómo se sirve el contenido
Las residencias, profesionales y artículos del blog viven en **Firestore**. El sitio
los lee y arma las páginas. Solo el administrador (Diego) puede crear/editar/borrar,
protegido por las **reglas de seguridad de Firestore**.

---

## 2. Estructura actual del sitio

### Parte pública
- **Home** (`/`): hero, cómo funciona, residencias destacadas, blog, CTA.
- **Residencias** (`/residencias`): listado con filtros + **toggle Lista/Mapa**.
- **Mapa** (`/mapa`): todas las residencias ubicadas geográficamente.
- **Profesionales** (`/profesionales`): listado filtrable por especialidad (incluye **Abogado/a**).
- **Fichas de detalle**: `/residencias/[slug]`, `/profesionales/[slug]`.
- **Blog** (`/blog`), **Contacto**, **Asesoramiento**, **Nosotros**, páginas legales.
- **Altas** (links para invitar, no en el menú):
  - `/alta-residencia` — formulario para que una residencia se sume.
  - `/alta-profesional` — formulario para que un profesional se sume.

### Panel de administración (`/admin`)
Menú lateral actual:
1. **Dashboard** — resumen (residencias, profesionales, reseñas).
2. **Residencias** — alta/edición (datos, fotos, ubicación en mapa, habilitaciones).
3. **Destacados** — marcar cada residencia como Normal / Destacada / ⭐ Súper destacada.
4. **Profesionales** — alta/edición.
5. **Reseñas** — moderar (aprobar/ocultar/editar/eliminar) las reseñas por aspectos.
6. **Solicitudes** — bandeja con pestañas **Residencias | Profesionales**: revisar los
   formularios de alta y publicarlos con un clic.
7. **Blog** — alta/edición de artículos.
8. **Mensajes** — formularios de contacto/consulta recibidos.

---

## 3. Todo lo construido en esta etapa de trabajo

| Área | Qué se hizo |
|------|-------------|
| **SEO técnico** | Las fichas de residencias/profesionales se generan desde datos **reales** de Firestore (antes usaban datos de prueba). Sitemap y páginas con refresco automático. |
| **Dominio / SEO** | Corregido el dominio canónico a **www.cuidarmdp.com** (el sitemap apuntaba a un dominio inexistente y el canonical caía en `localhost`). |
| **Imagen de compartir (OG)** | Se genera automáticamente con la marca (sin la marca de agua del placeholder), vía `opengraph-image`. |
| **Blog seguro** | El texto del blog se "limpia" para evitar ejecución de código (anti-XSS). |
| **Imágenes** | Migradas a `next/image` (carga diferida, sin saltos). Se usa `unoptimized` porque algunos hosts (WordPress de Los Alerces) bloquean el optimizador de Vercel. **No quitar `unoptimized`.** |
| **Mapa interactivo** | Página `/mapa` + toggle en el listado (Leaflet, estilo Positron). 28 residencias **geocodificadas** automáticamente desde su dirección. Selector de ubicación en el admin. |
| **Destacados / Súper** | 3 niveles (Normal / Destacada / Súper). Los súper aparecen primero y con marco dorado. Se gestionan desde la sección **Destacados**. |
| **Reseñas por aspectos** | Las familias puntúan aspectos (residencias: limpieza, comida, cuidado, administración, instalaciones; profesionales: puntualidad, trato, profesionalismo, claridad). La nota general = promedio. Moderación desde el admin. |
| **Home** | Se quitaron los testimonios ficticios. |
| **Seguridad del admin** | El email del admin **ya no está escrito en el código**; ser admin se decide por la colección `admins` en Firestore (reglas actualizadas y publicadas). |
| **Layout admin** | El menú público ya no se superpone dentro del panel. |
| **Formularios de alta** | `/alta-residencia` y `/alta-profesional` con secciones, matriz de valores (residencias) / valor de consulta interno (profesionales), y **autorización legal formal**. |
| **Autorización legal** | Ventana modal con texto revisado por abogada (v2): identificación (Diego Catalano, CUIT), derechos ARCO, contacto fehaciente, plazo, efecto de revocación, derechos de imagen y canales de difusión. Queda registrado quién firmó y qué versión aceptó. |
| **Profesionales** | Nueva especialidad **Abogado/a (amparos y obras sociales)**. |

### Colecciones en Firestore
`residencias`, `profesionales`, `blog`, `resenas`, `contactos`, `consultas`,
`solicitudes` (altas de residencias), `solicitudesProfesionales`, `admins`.

---

## 4. Pendientes conocidos (para más adelante)

- **Avisos por email** de nuevas consultas/solicitudes (requiere un servicio de envío tipo Resend).
- **Anti-spam / Firebase App Check** (protege los formularios y la cuota de Firestore).
- **Registro de base de datos ante la AAIP** (trámite legal administrativo, fuera de la web).
- **OK final de la abogada** al texto de autorización ya con los datos cargados.

---

## 5. Próxima función propuesta: seguimiento de clics de contacto

### 5.1 Objetivo
Saber **cómo los usuarios usan los links del sitio** para contactar residencias,
profesionales o servicios promocionados. Sirve para:
- Medir el interés real de las familias por cada ficha.
- **Demostrar valor a quienes pagan** (ej.: "tu ficha recibió 42 clics de WhatsApp este mes").
- Decidir dónde poner esfuerzo de difusión.

### 5.2 Qué se mide
Cada vez que un usuario toca un link de contacto/acción, se registra un "evento":
- **Canal**: WhatsApp · Teléfono · Email · Sitio web · "Ver ficha".
- **A quién**: residencia o profesional (con su nombre e id).
- **Cuándo**: fecha y hora.
- (Sin datos personales del visitante — solo conteos anónimos.)

### 5.3 Cómo funcionaría (diseño técnico)

**a) Registro propio en Firestore (lo que se ve en el admin)**
- Nueva colección **`clicks`**: cada evento es un documento
  `{ canal, entidadTipo, entidadId, entidadNombre, fecha }`.
- Regla de seguridad: **crear** permitido a cualquiera (visitante anónimo);
  **leer** solo el admin. (Igual criterio que `contactos`/`solicitudes`.)
- Un pequeño helper `registrarClick(canal, entidad)` que se llama al tocar cada
  botón de contacto.

**b) Dónde se instrumenta**
- Botones de WhatsApp / teléfono / email / web en las **fichas** de residencia y profesional.
- Botón **"Ver ficha"** desde listado, mapa y home.
- Botón flotante de **WhatsApp** general (asesoramiento).
- A futuro: links de **servicios promocionados**.

**c) Sección nueva en el admin: "📈 Estadísticas / Actividad"**
- **Ranking** de residencias y profesionales más contactados.
- **Desglose por canal** (cuántos por WhatsApp, teléfono, web, etc.).
- **Filtro por período** (últimos 7 / 30 días, este mes).
- Vista por ficha (para mostrarle el dato a cada partner).

**d) Opcional — Google Analytics**
- Además del registro propio, mandar el mismo evento a **Google Analytics 4**
  (el sitio ya tiene GA integrado), por si querés analítica más profunda.

### 5.4 Privacidad
No se guarda ningún dato personal del visitante: solo el conteo de qué links se
tocan y hacia qué ficha. Es información **anónima y agregada**.

### 5.5 Fases sugeridas
1. Modelo de datos + servicio + regla de Firestore (`clicks`). *(requiere republicar reglas)*
2. Helper de tracking + instrumentar los links de contacto en todo el sitio.
3. Sección admin "Estadísticas" (ranking + desglose + período).
4. (Opcional) enviar también el evento a Google Analytics.

### 5.6 Decisiones a definir antes de construir
- ¿Alcanza con el **registro propio en el admin**, o querés también el envío a Google Analytics?
- ¿Qué canales trackeamos primero? (propuesta: WhatsApp, teléfono, "ver ficha", web).
- ¿Sumamos ya los **servicios promocionados**, o arrancamos con residencias y profesionales?

---

*Documento de trabajo — Cuidar MdP.*

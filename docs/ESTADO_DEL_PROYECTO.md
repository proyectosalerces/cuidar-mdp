# Estado del proyecto — Cuidar MdP

> Documento de handoff: qué es el proyecto, todo lo construido, convenciones
> técnicas importantes y pendientes. Pensado para retomar en una conversación nueva.
> Última actualización: 2026-07-16.

---

## 1. Resumen

**Cuidar MdP** es un portal web para que las familias de Mar del Plata encuentren y
comparen **residencias geriátricas** y **profesionales** del cuidado de adultos
mayores, con información verificada y contacto directo.

| | |
|---|---|
| **Stack** | Next.js 16 (App Router) · React 19 · TypeScript · Firebase (Firestore + Auth) |
| **Hosting** | Vercel — deploy automático al hacer `git push` a `main` |
| **Repo** | `github.com/proyectosalerces/cuidar-mdp` |
| **Dominio real** | **https://www.cuidarmdp.com** (el titular tiene el `.com`, NO `.com.ar`). También responde `cuidar-mdp.vercel.app`. |
| **Titular** | Diego Catalano (monotributista), CUIT 20-34058029-0 |
| **Contacto** | info@cuidarmdp.com · WhatsApp +54 9 223 694-8075 |

---

## 2. Convenciones técnicas IMPORTANTES (leer antes de tocar)

1. **Deploy**: `git push origin main` → Vercel publica solo (~1-2 min). No hay deploy manual.
2. **Admin data-driven**: es admin quien tenga su email como id de documento en la
   colección **`admins`** de Firestore. **No hay email hardcodeado** en el código.
   (Admin actual: proyectos@residencialosalerces.com.)
3. **Reglas de Firestore**: viven en `firestore.rules` (repo) pero se **publican a mano
   en la consola de Firebase**. Cada colección NUEVA con escritura pública requiere
   republicar las reglas o los formularios fallan al guardar.
4. **Imágenes**: `SmartImage` y las fichas usan `next/image` con **`unoptimized`**
   porque el optimizador de Vercel da 502 con hosts como el WordPress de
   residencialosalerces.com. **No quitar `unoptimized`.**
5. **Dominio/SEO**: el fallback de `NEXT_PUBLIC_SITE_URL` (layout.tsx y utils/constants.ts)
   es `https://www.cuidarmdp.com`. En Vercel la env var NO está seteada; manda el fallback.
6. **Config Firebase**: las claves `NEXT_PUBLIC_FIREBASE_*` son públicas por diseño; la
   seguridad real la dan las reglas.
7. **Windows/OneDrive**: el proyecto está en OneDrive; a veces el build da un EPERM al
   borrar `.next` — se resuelve con `rm -rf .next` y rebuild.

---

## 3. Estructura actual

### Público
- **Home** (`/`), **Residencias** (`/residencias`, con toggle Lista/Mapa), **Mapa**
  (`/mapa`), **Profesionales** (`/profesionales`), fichas `/residencias/[slug]` y
  `/profesionales/[slug]`, **Blog**, **Contacto**, **Asesoramiento**, **Nosotros**, legales.
- **Altas** (links directos, no en el menú):
  - `/alta-residencia` — formulario para que una residencia se sume.
  - `/alta-profesional` — formulario para que un profesional se sume.

### Panel admin (`/admin`) — menú lateral
1. **Dashboard** — resumen.
2. **Residencias** — alta/edición (datos, fotos, ubicación en mapa, habilitaciones,
   **calificación/estrellas**, toggles Destacada/Activa/**Verificada**).
3. **Destacados** — gestión rápida: nivel Normal/Destacada/⭐Súper por fila + toggle
   **Verificada** por fila + botón "Quitar verificación a todas".
4. **Profesionales** — alta/edición (incluye calificación).
5. **Reseñas** — moderar reseñas por aspectos + **buscador/filtro por residencia,
   profesional o autor** y por estado.
6. **Solicitudes** — bandeja con pestañas **Residencias | Profesionales**: revisar los
   formularios de alta y publicarlos con un clic.
7. **Estadísticas** (📈) — seguimiento de clics de contacto: total por período, desglose
   por canal y ranking de fichas más contactadas.
8. **Blog** — alta/edición.
9. **Mensajes** — formularios de contacto/consulta recibidos.

### Colecciones en Firestore
`residencias`, `profesionales`, `blog`, `resenas`, `contactos`, `consultas`,
`solicitudes`, `solicitudesProfesionales`, `clicks`, `admins`.

---

## 4. Todo lo construido (changelog)

- **SEO**: fichas generadas desde datos reales de Firestore; sitemap + fichas con
  revalidate; dominio canónico corregido a www.cuidarmdp.com (antes apuntaba a
  cuidarmdp.com.ar / localhost).
- **Imagen de compartir (OG)**: generada dinámicamente con la marca vía
  `src/app/opengraph-image.tsx` (se eliminó el placeholder con marca de agua).
- **Logo oficial**: ícono recortado de `logo_principal` → header, favicon
  (`src/app/icon.png`), apple-icon; logo completo en `public/logo.png`.
- **Blog**: sanitización anti-XSS del markdown.
- **Limpieza**: eliminadas páginas admin de un solo uso (seed/diag/fix) y código muerto.
- **Mapa**: `/mapa` + toggle en el listado (Leaflet, estilo Positron); 28 residencias
  geocodificadas; selector de ubicación en el admin.
- **Destacados/Súper**: 3 niveles; los súper aparecen primeros y con marco dorado.
- **Verificada**: categoría controlable (toggle en editor + en Destacados + reset masivo).
  Por defecto **ninguna verificada**.
- **Reseñas por aspectos**: residencias (limpieza, comida, cuidado, administración,
  instalaciones) y profesionales (puntualidad, trato, profesionalismo, claridad); nota
  general = promedio. Moderación y filtro en el admin.
- **Calificación editable**: campos calificación (0-5) y cantidad de reseñas en el editor
  de residencias y profesionales. (Es un valor manual, independiente de las reseñas.)
- **Seguridad del admin**: control por colección `admins` (sin email en el código).
- **Layout admin**: el header/footer público ya no se muestra en `/admin` (SiteChrome).
- **Home**: se quitaron los testimonios ficticios.
- **Formularios de alta** (residencias y profesionales) con secciones y **autorización
  legal formal** (modal + firmante + registro versionado). En residencias, la habilitación
  y los valores son **opcionales**; en profesionales, el valor de consulta es **interno**
  (no se publica).
- **Autorización legal (texto v2)**: revisado con abogada — identificación (Diego Catalano,
  CUIT), derechos ARCO, contacto fehaciente, plazo, efecto de revocación, derechos de
  imagen y canales de difusión. Registra quién firmó y qué versión aceptó.
- **Profesionales**: nueva especialidad **Abogado/a (amparos y obras sociales)**.
- **Seguimiento de clics de contacto** + sección **Estadísticas** en el admin.
- **Mensajes de invitación** (residencias y profesionales) en `docs/mensajes-invitacion.md`.

---

## 5. Pendientes conocidos

- **Avisos por email** de nuevas consultas/solicitudes (requiere servicio tipo Resend).
- **Anti-spam / Firebase App Check** (protege formularios y cuota).
- **Registro de base de datos ante la AAIP** (trámite legal administrativo, fuera de la web).
- **OK final de la abogada** al texto de autorización ya con los datos cargados.
- **Logo**: hay 3 diseños distintos en `marketing/logos` (se usa `logo_principal`). Ideal
  definir uno único y tener versión con fondo transparente + horizontal.
- **Coordenadas faltantes**: "Los Alerces Viamonte" (cargar a mano) y "Luz de Vida" (inactiva).
- Posible mejora: que la calificación de la ficha se calcule sola desde el promedio de
  reseñas aprobadas (hoy es manual).

---

## 6. Cómo trabajar en este proyecto (recordatorio para retomar)

- El usuario (Diego) **no es programador**: explicar en criollo, conclusión primero,
  ofrecer opciones ante decisiones, y confirmar antes de acciones que impactan (deploys,
  borrar datos).
- Verificar con `npm run build` antes de afirmar que algo funciona; subir con commit+push.
- Ante una colección Firestore nueva: recordarle **republicar las reglas** en la consola.
- La captura de pantalla automática del entorno no funciona; la verificación visual la
  hace Diego en Vercel.

---

*Documento de handoff — Cuidar MdP.*

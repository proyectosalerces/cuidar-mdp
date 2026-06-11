/**
 * cargar-blog-posts.mjs
 *
 * Loads original blog posts for Cuidar MdP into Firestore.
 *
 * Usage:
 *   set FIREBASE_ADMIN_PASSWORD=Diego1988!
 *   node scripts/cargar-blog-posts.mjs
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDBhWaGpqYgeaAc1el64rB58cpjGvYMQ6Y",
  authDomain: "cuidar-mdp.firebaseapp.com",
  projectId: "cuidar-mdp",
  storageBucket: "cuidar-mdp.firebasestorage.app",
  messagingSenderId: "255599759087",
  appId: "1:255599759087:web:21cfa21a71317a7835151a",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const authInstance = getAuth(app);

const ADMIN_EMAIL = 'proyectos@residencialosalerces.com';
const ADMIN_PASSWORD = process.env.FIREBASE_ADMIN_PASSWORD;

if (!ADMIN_PASSWORD) {
  console.error('❌ Falta la variable de entorno FIREBASE_ADMIN_PASSWORD');
  process.exit(1);
}

const posts = [
  {
    slug: 'guia-completa-elegir-residencia-geriatrica-mar-del-plata',
    titulo: 'Guía completa: cómo elegir una residencia geriátrica en Mar del Plata',
    extracto: 'Elegir una residencia para un ser querido es una de las decisiones más difíciles. En esta guía te explicamos paso a paso qué mirar, qué preguntar y cómo comparar las opciones disponibles en Mar del Plata.',
    contenido: `## ¿Por dónde empezar?

Cuando llega el momento de buscar una residencia geriátrica, la mayoría de las familias se siente abrumada. En Mar del Plata hay más de 35 opciones habilitadas, cada una con sus particularidades. Esta guía te va a ayudar a tomar una decisión informada.

## 1. Definí las necesidades de tu ser querido

Antes de visitar cualquier residencia, hacete estas preguntas:

- **¿Necesita supervisión las 24 horas?** Si tiene problemas cognitivos (Alzheimer, demencia), es fundamental que la residencia cuente con un área protegida.
- **¿Requiere rehabilitación?** Algunas residencias tienen kinesiología, terapia ocupacional y fonoaudiología dentro de sus servicios.
- **¿Tiene necesidades médicas especiales?** Enfermería permanente, control de medicación, manejo de diabetes, etc.
- **¿Cuál es su nivel de autonomía?** Esto define si necesita internación permanente, temporal, o si un centro de día es suficiente.

## 2. Verificá las habilitaciones

Este punto es **no negociable**. En la provincia de Buenos Aires, las residencias geriátricas deben contar con:

- **Habilitación municipal:** otorgada por la Municipalidad de General Pueyrredón. Verificá que esté vigente.
- **Habilitación provincial:** emitida por el Ministerio de Salud de la Provincia de Buenos Aires. No todas la tienen, pero es un indicador de mayor control.

En Cuidar MdP publicamos el estado de habilitación de cada residencia para que puedas verificarlo fácilmente.

## 3. Visitá al menos 3 residencias

No te quedes con la primera opción. Programá visitas en distintos horarios (mañana, tarde) y prestá atención a:

- **Limpieza general:** baños, habitaciones, comedor. ¿Hay olores desagradables?
- **Estado de los residentes:** ¿Están vestidos, aseados? ¿Se los ve contentos?
- **Interacción del personal:** ¿Se dirigen a los residentes por su nombre? ¿Los tratan con respeto?
- **Espacios comunes:** ¿Hay jardín, sala de estar, actividades programadas?
- **Comida:** pedí ver el menú semanal. ¿Hay opción para dietas especiales?

## 4. Preguntá sobre el equipo profesional

Una buena residencia debe contar, como mínimo, con:

- Médico clínico (visitas regulares o permanente)
- Enfermería 24 horas
- Terapia ocupacional
- Nutricionista
- Trabajadora social
- Director/a técnico/a con matrícula habilitante

Preguntá: *¿Cuántos enfermeros hay por turno? ¿Cuántos residentes atiende cada uno?* La proporción ideal es 1 enfermero cada 8-10 residentes.

## 5. Consultá las condiciones económicas

- **¿Qué incluye la cuota mensual?** Alojamiento, alimentación, lavandería, actividades recreativas.
- **¿Qué se cobra aparte?** Medicación, pañales, productos de higiene personal, kinesiología.
- **¿Hay período de prueba?** Algunas residencias ofrecen una semana de prueba.
- **¿Cuál es la política de aumento?** Pedí que te informen con anticipación.

## 6. Escuchá a tu ser querido

Siempre que sea posible, incluí a la persona mayor en la decisión. Su opinión y comodidad son fundamentales. Si no puede participar activamente, observá su reacción al visitar el lugar.

## 7. No te apures

Es una decisión importante. Tomá el tiempo que necesites. Si tenés dudas, en Cuidar MdP podés consultar sin compromiso y te orientamos según tu situación particular.

---

*¿Necesitás ayuda para elegir? Contactanos por WhatsApp y te asesoramos sin costo.*`,
    categoria: 'guias',
    tags: ['residencias', 'geriátricos', 'Mar del Plata', 'guía', 'familias'],
    autor: 'Equipo Cuidar MdP',
    publicado: true,
    fechaPublicacion: '2025-06-11',
  },
  {
    slug: 'como-contratar-cuidador-domiciliario-mar-del-plata',
    titulo: '¿Cómo contratar un cuidador domiciliario en Mar del Plata?',
    extracto: 'Contratar a la persona correcta para cuidar a un adulto mayor en casa requiere preparación. Te explicamos qué buscar, cómo entrevistar y qué certificaciones exigir.',
    contenido: `## ¿Cuándo es momento de buscar un cuidador?

Hay señales claras de que un adulto mayor necesita acompañamiento profesional:

- Se olvida de tomar la medicación
- Ha tenido caídas recientes
- La higiene personal se ha deteriorado
- Se aísla socialmente o muestra signos de depresión
- La familia ya no puede cubrir todas las necesidades

## ¿Qué buscar en un cuidador domiciliario?

### Formación y certificación

En Mar del Plata, la Municipalidad de General Pueyrredón mantiene un **Registro Municipal de Cuidadores Domiciliarios**. Los profesionales registrados han completado cursos avalados por:

- **DINAPAM** (Dirección Nacional de Políticas para Adultos Mayores): cursos de 420 horas con prácticas supervisadas
- **DGCYE** (Dirección General de Cultura y Educación de PBA): formación técnica oficial

Siempre pedí ver el certificado original y verificá que esté registrado.

### Experiencia comprobable

- ¿Ha trabajado con personas con patologías similares?
- ¿Puede aportar referencias de empleadores anteriores?
- ¿Tiene experiencia con movilización, higiene, alimentación?

### Habilidades blandas

Tan importante como la formación técnica:

- **Paciencia** y empatía
- Buena comunicación con la familia
- Capacidad de observación (detectar cambios en el estado de salud)
- Responsabilidad con los horarios y la medicación

## La entrevista: qué preguntar

1. **¿Por qué eligió esta profesión?** La respuesta te dice mucho sobre la vocación.
2. **Describa una situación difícil y cómo la resolvió.** Evalúa capacidad de reacción.
3. **¿Qué haría si mi familiar se niega a comer / bañarse / tomar la medicación?** Busca respuestas empáticas, no impositivas.
4. **¿Tiene disponibilidad para emergencias?** Importante saber si es flexible.
5. **¿Cómo prefiere comunicarse con la familia?** Cuaderno de novedades, WhatsApp, llamadas.

## Aspectos legales

- **Registrar la relación laboral** a través de AFIP (categoría personal de casas particulares)
- **ART** (Aseguradora de Riesgos del Trabajo): obligatoria
- **Contrato por escrito:** horarios, tareas, salario, francos
- Consultar el convenio del **Sindicato de Personal de Casas Particulares**

## ¿Cuánto cuesta un cuidador en Mar del Plata? (2025)

Los valores varían según las horas y la complejidad del cuidado:

| Modalidad | Rango aproximado |
|---|---|
| Media jornada (4-6 hs) | $250.000 - $400.000/mes |
| Jornada completa (8 hs) | $450.000 - $650.000/mes |
| Cuidador con cama (24 hs) | $700.000 - $1.000.000/mes |

*Valores de referencia a junio 2025. Varían según experiencia, certificaciones y tareas específicas.*

## Un consejo final

No contrates por urgencia. Tomá al menos una semana para entrevistar 2-3 candidatos. Hacé una **prueba de 3-5 días** antes de confirmar. Y recordá: el mejor cuidador es el que tu ser querido acepta y con quien se siente cómodo.

---

*En Cuidar MdP contamos con un directorio de cuidadores certificados. Consultanos.*`,
    categoria: 'guias',
    tags: ['cuidadores', 'domiciliario', 'contratación', 'Mar del Plata', 'DINAPAM'],
    autor: 'Equipo Cuidar MdP',
    publicado: true,
    fechaPublicacion: '2025-06-10',
  },
  {
    slug: 'diferencias-residencia-geriatrica-centro-de-dia-cuidador',
    titulo: 'Residencia, centro de día o cuidador: ¿cuál es la mejor opción?',
    extracto: 'Cada situación es diferente. Te ayudamos a entender las diferencias entre las tres modalidades de cuidado más comunes para adultos mayores.',
    contenido: `## Las tres opciones principales

Cuando una familia necesita apoyo para el cuidado de un adulto mayor, hay tres caminos principales. Ninguno es mejor que otro en abstracto: depende de cada situación.

## 1. Residencia geriátrica (internación permanente)

### ¿Cuándo es la opción indicada?

- El adulto mayor tiene un grado de dependencia alto
- Necesita supervisión médica y de enfermería las 24 horas
- Tiene patologías complejas (Alzheimer avanzado, ACV, movilidad reducida severa)
- La familia no puede garantizar un cuidado seguro en el hogar
- Vive solo y es un riesgo para sí mismo

### Ventajas

- Atención profesional continua
- Socialización con pares
- Alimentación supervisada por nutricionista
- Actividades de estimulación cognitiva
- Tranquilidad para la familia

### A tener en cuenta

- Puede generar resistencia emocional en el adulto mayor
- Requiere un período de adaptación (2-4 semanas)
- Es la opción de mayor costo mensual
- No todas las residencias son iguales en calidad

## 2. Centro de día (atención diurna)

### ¿Cuándo es la opción indicada?

- El adulto mayor es relativamente autónomo pero necesita estimulación
- La familia trabaja durante el día y no puede acompañarlo
- Se busca prevenir el deterioro cognitivo
- El adulto mayor está en etapas iniciales de demencia

### Ventajas

- Mantiene la autonomía y el vínculo con el hogar
- Socialización y actividades grupales
- Menor costo que la internación
- Contención profesional durante el día
- El adulto mayor duerme en su casa

### A tener en cuenta

- No hay supervisión nocturna
- No es apto para personas con alta dependencia
- Requiere traslado diario (ida y vuelta)

## 3. Cuidador domiciliario

### ¿Cuándo es la opción indicada?

- El adulto mayor quiere permanecer en su hogar
- Necesita ayuda puntual (baño, medicación, compañía)
- Tiene un nivel de dependencia leve a moderado
- La familia puede complementar el cuidado en los horarios restantes

### Ventajas

- El adulto mayor permanece en su entorno familiar
- Atención personalizada uno a uno
- Flexibilidad de horarios
- Menor impacto emocional que una mudanza

### A tener en cuenta

- Si el cuidador falta, ¿quién cubre?
- No hay socialización con pares
- El desgaste familiar puede ser mayor
- No es viable para dependencia extrema

## ¿Cómo decidir?

Hacé una evaluación honesta respondiendo estas preguntas:

1. **¿Cuál es el nivel de dependencia real?** (No el que la familia cree, sino el evaluado por un profesional)
2. **¿Qué quiere la persona mayor?** Su opinión importa.
3. **¿Cuál es la capacidad económica de la familia?**
4. **¿Hay red de contención familiar?** ¿O recae todo en una sola persona?
5. **¿Es una solución temporal o permanente?**

## En Mar del Plata

Nuestra ciudad ofrece las tres opciones con buena cobertura:

- **+35 residencias** habilitadas
- Centros de día con actividades recreativas y terapéuticas
- **+85 cuidadores certificados** registrados en el municipio

En Cuidar MdP los tenemos todos mapeados. Consultanos y te orientamos según tu caso particular.

---

*¿No sabés por dónde empezar? Escribinos y te ayudamos a evaluar las opciones.*`,
    categoria: 'guias',
    tags: ['residencias', 'centro de día', 'cuidadores', 'opciones', 'comparativa'],
    autor: 'Equipo Cuidar MdP',
    publicado: true,
    fechaPublicacion: '2025-06-09',
  },
  {
    slug: '10-senales-adulto-mayor-necesita-ayuda-profesional',
    titulo: '10 señales de que un adulto mayor necesita ayuda profesional',
    extracto: 'A veces las señales son sutiles. Aprendé a identificar los indicadores de que tu ser querido podría necesitar acompañamiento o cuidado profesional.',
    contenido: `## Prestar atención a tiempo

Muchas familias reconocen tarde que su ser querido necesitaba ayuda. Las señales suelen ser graduales y a veces las normalizamos. Conocerlas te permite actuar a tiempo.

## 1. Pérdida de peso inexplicable

Si notás que tu familiar ha perdido peso sin hacer dieta, puede deberse a que:
- Se olvida de comer
- Tiene dificultad para cocinar
- Pierde el apetito (puede ser un signo de depresión)
- Tiene problemas para tragar

**Qué hacer:** Consultá con el médico de cabecera y evaluá si necesita ayuda con la alimentación.

## 2. Descuido en la higiene personal

Cuando una persona que siempre fue prolija empieza a descuidar su aspecto, es una señal importante:
- No se baña con la frecuencia habitual
- Usa la misma ropa varios días
- Presenta mal olor corporal
- No se peina ni se afeita

## 3. Olvidos frecuentes de medicación

Si encontrás pastillas sin tomar, medicamentos vencidos o confusión sobre qué toma y cuándo, el riesgo es real. Un error en la medicación puede tener consecuencias graves.

## 4. Caídas o tropiezos recurrentes

Una sola caída es un evento. Dos o más en poco tiempo son un patrón que hay que atender. Las caídas en adultos mayores pueden derivar en fracturas de cadera y hospitalizaciones prolongadas.

## 5. Aislamiento social

Deja de atender el teléfono, no quiere recibir visitas, cancela salidas que antes disfrutaba. El aislamiento puede ser causa o consecuencia de depresión.

## 6. Desorden inusual en el hogar

Si la casa de tu familiar, que siempre estuvo ordenada, ahora presenta:
- Acumulación de basura
- Electrodomésticos en mal estado
- Facturas impagas
- Alimentos vencidos en la heladera

## 7. Cambios de humor o de personalidad

Irritabilidad, agresividad, desconfianza, o llanto frecuente pueden indicar:
- Inicio de deterioro cognitivo
- Depresión
- Dolor no comunicado
- Efectos secundarios de medicación

## 8. Dificultad para manejar las finanzas

Confusión con el dinero, pagar dos veces la misma factura, no poder hacer cuentas simples, o ser víctima de estafas telefónicas.

## 9. Problemas para conducir o moverse

Si tu familiar conduce de forma peligrosa, se pierde en trayectos conocidos, o tiene cada vez más dificultad para caminar y subir escaleras.

## 10. La familia está agotada

Esta es quizás la señal más importante y la más ignorada. Si el familiar cuidador:
- Duerme mal
- Dejó de trabajar o de hacer actividades propias
- Tiene problemas de salud por el estrés
- Siente resentimiento o culpa constante

**El cuidado del cuidador es fundamental.** Si la familia está agotada, la calidad del cuidado baja y todos sufren.

## ¿Qué hacer si identificás varias de estas señales?

1. **No te culpes.** Pedir ayuda no es abandonar.
2. **Consultá con un geriatra.** Una evaluación profesional objetiva es el primer paso.
3. **Evaluá las opciones:** cuidador domiciliario, centro de día, o residencia.
4. **Hablá con tu familiar.** Con respeto y honestidad.

---

*En Cuidar MdP podemos ayudarte a evaluar la situación y encontrar la mejor solución en Mar del Plata. Consultá sin compromiso.*`,
    categoria: 'salud',
    tags: ['señales', 'cuidado', 'familia', 'prevención', 'adulto mayor'],
    autor: 'Equipo Cuidar MdP',
    publicado: true,
    fechaPublicacion: '2025-06-08',
  },
  {
    slug: 'derechos-adultos-mayores-residencias-argentina',
    titulo: 'Derechos de los adultos mayores en residencias: lo que toda familia debe saber',
    extracto: 'Los residentes de geriátricos tienen derechos que deben ser respetados. Conocerlos te permite exigir un trato digno para tu ser querido.',
    contenido: `## El marco legal en Argentina

Los adultos mayores que viven en residencias geriátricas están protegidos por múltiples normas legales. Conocerlas es fundamental para garantizar un cuidado digno.

## Derechos fundamentales

### 1. Derecho a la dignidad y al buen trato

Todo residente tiene derecho a:
- Ser tratado con respeto, sin importar su condición cognitiva
- No ser sometido a maltrato físico, psicológico ni verbal
- Conservar su intimidad y privacidad
- Ser llamado por su nombre

### 2. Derecho a la información

- La familia tiene derecho a conocer el **estado de salud** del residente en cualquier momento
- Debe recibir informes periódicos del equipo médico
- Tiene derecho a acceder a la **historia clínica**
- Debe ser informada sobre cualquier cambio en la medicación o tratamiento

### 3. Derecho a mantener vínculos

- El residente tiene derecho a recibir **visitas sin restricciones** irrazonables
- Puede comunicarse libremente con familiares y amigos
- No se le puede prohibir el contacto telefónico
- Tiene derecho a mantener sus pertenencias personales

### 4. Derecho a la autonomía

- Si tiene capacidad de decisión, puede **elegir sus actividades**, horarios de sueño y alimentación dentro de lo razonable
- No puede ser obligado a participar en actividades contra su voluntad
- Tiene derecho a manifestar preferencias y quejas

### 5. Derecho a la atención médica

- Acceso a atención médica de calidad
- Continuidad en su tratamiento previo
- Derivación a especialistas cuando sea necesario
- No ser sobremedicado para "facilitar" el manejo

## ¿Qué hacer si detectás irregularidades?

### Paso 1: Hablar con la dirección
Muchos problemas se resuelven con una conversación directa y firme con la dirección técnica.

### Paso 2: Documentar
Si la situación persiste:
- Sacá fotos del estado de tu familiar y del establecimiento
- Anotá fechas, horarios y testigos
- Guardá cualquier comunicación escrita

### Paso 3: Denunciar
Podés realizar denuncias en:
- **Defensoría del Pueblo de General Pueyrredón:** Luro 3033, tel. (0223) 493-4448
- **Dirección de Políticas del Adulto Mayor (Municipalidad de Gral. Pueyrredón)**
- **Ministerio de Salud de la Provincia de Buenos Aires**
- En casos de maltrato: **Línea 137** (atención a víctimas de violencia)

## Normativa aplicable

- **Convención Interamericana sobre la Protección de los Derechos Humanos de las Personas Mayores** (Ley 27.360)
- **Ley 2.654 de la CABA y normativas provinciales** sobre establecimientos geriátricos
- **Decreto provincial 3280/90** (regulación de establecimientos de salud)

## Nuestro compromiso

En Cuidar MdP creemos que la transparencia es fundamental. Por eso publicamos información verificada sobre habilitaciones, servicios y calificaciones de cada residencia en Mar del Plata.

---

*Si tenés dudas sobre los derechos de tu familiar en una residencia, contactanos. Te orientamos.*`,
    categoria: 'legales',
    tags: ['derechos', 'residencias', 'regulación', 'adulto mayor', 'familias'],
    autor: 'Equipo Cuidar MdP',
    publicado: true,
    fechaPublicacion: '2025-06-07',
  },
  {
    slug: 'como-preparar-ingreso-residencia-geriatrica',
    titulo: 'Cómo preparar el ingreso de un adulto mayor a una residencia geriátrica',
    extracto: 'El ingreso a una residencia es un momento emocionalmente complejo. Con la preparación adecuada, la transición puede ser mucho más llevadera para todos.',
    contenido: `## Un momento difícil pero manejable

El ingreso de un ser querido a una residencia geriátrica suele venir cargado de emociones: culpa, tristeza, alivio, incertidumbre. Todas son válidas. Lo importante es prepararse para que la transición sea lo más suave posible.

## Antes del ingreso

### 1. Hablá con tu familiar

Si tu ser querido puede participar de la decisión:
- Explicale las razones con honestidad y cariño
- No le mientas ("vamos de visita" y después dejarlo)
- Escuchá sus miedos y preocupaciones
- Visitá el lugar juntos antes del ingreso

### 2. Preparate emocionalmente

- Hablá con un profesional (psicólogo, trabajador social) si lo necesitás
- No cargues con la culpa: estás tomando una decisión responsable
- Aceptá que vas a sentir dolor, y que está bien
- Buscá apoyo en otros familiares o grupos de contención

### 3. Preparate logísticamente

#### Documentación necesaria:
- DNI del residente
- Certificado médico actualizado
- Historia clínica completa
- Listado de medicación actual con dosis y horarios
- Datos de la obra social o prepaga
- Contactos de emergencia

#### Qué llevar:
- **Ropa cómoda** y marcada con nombre (5-7 mudas)
- **Calzado cerrado antideslizante** (no pantuflas abiertas)
- **Artículos de higiene personal** (cepillo, peine, crema, etc.)
- **Objetos personales significativos:** fotos familiares, un almohadón, algún adorno. Estos objetos ayudan a sentirse "en casa"
- **NO llevar:** objetos de valor, joyas costosas, dinero en efectivo

## La primera semana

### Qué esperar

Los primeros días son los más difíciles. Es normal que el residente:
- Pida volver a casa
- Esté irritable o triste
- Duerma más o menos de lo habitual
- Tenga cambios en el apetito
- Llore o se muestre apático

**Esto no significa que la decisión fue incorrecta.** Es un proceso de adaptación que suele durar entre 2 y 4 semanas.

### Cómo acompañar

- **Visitá regularmente** pero no todo el día. Dejá que se integre.
- **Sé puntual con las visitas.** La impuntualidad genera ansiedad.
- **Hablá con el equipo profesional** todos los días la primera semana.
- **No cedas al impulso de retirarlo** a los 2-3 días. Dale tiempo.
- **Llevale algo especial:** su comida favorita, un libro, fotos nuevas.

## Después del primer mes

Si la adaptación fue exitosa, vas a notar:
- Tu familiar empieza a reconocer al personal por nombre
- Participa en alguna actividad grupal
- Tiene algún vínculo con otros residentes
- Los reclamos disminuyen en frecuencia e intensidad
- Su aspecto general mejora

## Un dato que ayuda

El período de adaptación es más difícil para la familia que para el residente. Los profesionales de las residencias están entrenados para contener y acompañar en esta etapa. Confiá en el equipo.

## Red de apoyo en Mar del Plata

- **Centro de Día Municipal:** alternativa de transición para evaluar
- **Defensoría del Adulto Mayor:** orientación y contención
- **PAMI Mar del Plata:** cobertura de internación geriátrica
- **Cuidar MdP:** te acompañamos en todo el proceso

---

*Si estás atravesando este momento, no dudes en contactarnos. Podemos orientarte y acompañarte.*`,
    categoria: 'guias',
    tags: ['ingreso', 'adaptación', 'residencia', 'familia', 'contención'],
    autor: 'Equipo Cuidar MdP',
    publicado: true,
    fechaPublicacion: '2025-06-06',
  },
];

// ── Upload ──────────────────────────────────────────────────────────────────

async function cargarPosts() {
  console.log(`🔐 Autenticando como ${ADMIN_EMAIL}...`);
  try {
    await signInWithEmailAndPassword(authInstance, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('   ✅ Autenticación exitosa\n');
  } catch (error) {
    console.error('❌ Error de autenticación:', error.message);
    process.exit(1);
  }

  console.log(`🔄 Cargando ${posts.length} posts...\n`);

  let ok = 0;
  let errores = 0;

  for (const post of posts) {
    try {
      const ref = doc(db, 'blog', post.slug);
      await setDoc(ref, {
        ...post,
        imagenPortada: '',
        createdAt: serverTimestamp(),
      });
      ok++;
      console.log(`   ✅ [${ok}/${posts.length}] ${post.titulo}`);
    } catch (error) {
      errores++;
      console.error(`   ❌ Error: ${post.slug}:`, error.message);
    }
  }

  console.log(`\n🎉 ¡Carga completada! ${ok} posts cargados.`);
  if (errores > 0) console.log(`   ❌ Errores: ${errores}`);
}

cargarPosts()
  .then(() => process.exit(0))
  .catch((e) => { console.error('❌', e); process.exit(1); });

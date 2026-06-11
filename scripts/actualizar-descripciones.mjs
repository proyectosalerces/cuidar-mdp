/**
 * actualizar-descripciones.mjs
 *
 * Updates all 39 residencias in Firestore with unique descriptions
 * and short descriptions based on the provided data.
 *
 * Usage:
 *   set FIREBASE_ADMIN_PASSWORD=your_password
 *   node scripts/actualizar-descripciones.mjs
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  doc,
  updateDoc,
  serverTimestamp,
} from 'firebase/firestore';

// ── Firebase config (same as the app) ──────────────────────────────────────

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
  console.error('   Ejecutá: set FIREBASE_ADMIN_PASSWORD=tu_password');
  process.exit(1);
}

// ── Datos de cada residencia ───────────────────────────────────────────────

const residencias = [
  {
    slug: 'casagrande',
    descripcion:
      'Casagrande se ubica sobre Av. Independencia 1313, una de las arterias principales de Mar del Plata, y cuenta con capacidad para 63 residentes. Con una calificación de 4.6/5 en Google y una sólida presencia en redes sociales con más de 1.100 seguidores en Instagram, se posiciona como una de las residencias más reconocidas de la ciudad. Ofrece un entorno amplio, cálido y profesional para el cuidado del adulto mayor.',
    descripcionCorta:
      'Residencia destacada sobre Av. Independencia con 63 plazas y calificación Google de 4.6/5.',
  },
  {
    slug: 'en-familia',
    descripcion:
      'En Familia, ubicada en Martínez Zuviría 1450, es una residencia con atención integral las 24 horas gracias a su servicio de enfermería permanente y equipo interdisciplinario. Con una calificación Google de 4.4/5 respaldada por más de 243 reseñas, brinda un ambiente familiar y contenedor con capacidad para 20 residentes. Su enfoque personalizado y equipo profesional la convierten en una opción confiable para quienes buscan cuidado cercano.',
    descripcionCorta:
      'Enfermería 24hs y equipo interdisciplinario con 4.4/5 en Google (243 reseñas) para 20 residentes.',
  },
  {
    slug: 'gema',
    descripcion:
      'Gema forma parte del grupo Hogares MdP y está ubicada en Tomás Guido 956, en una zona tranquila de Mar del Plata. Con capacidad para 40 residentes, ofrece instalaciones amplias y un equipo profesional comprometido. Su pertenencia al grupo Hogares MdP garantiza estándares de calidad y una red de respaldo institucional para el cuidado del adulto mayor.',
    descripcionCorta:
      'Parte del grupo Hogares MdP con 40 plazas en Tomás Guido 956.',
  },
  {
    slug: 'irala',
    descripcion:
      'Irala se encuentra en la calle Irala 5243, en una zona residencial de Mar del Plata. Con capacidad para 22 residentes y una calificación de 4.2/5 en Yably, ofrece un espacio íntimo y personalizado para el cuidado de adultos mayores. Su tamaño reducido permite una atención más cercana y familiar.',
    descripcionCorta:
      'Residencia íntima con 22 plazas y 4.2/5 en Yably, sobre calle Irala.',
  },
  {
    slug: 'la-tranquilidad',
    descripcion:
      'La Tranquilidad es una de las residencias de mayor capacidad en Mar del Plata, con 122 plazas distribuidas en múltiples sedes sobre las calles Aguirre 7156, Aguirre 7162 y Alice 7159. Su amplia infraestructura permite atender distintos perfiles de residentes con espacios diferenciados. La diversidad de sedes brinda flexibilidad y opciones adaptadas a las necesidades de cada familia.',
    descripcionCorta:
      'Amplia residencia con 122 plazas distribuidas en tres sedes sobre Aguirre y Alice.',
  },
  {
    slug: 'las-lilas',
    descripcion:
      'Las Lilas está ubicada en 11 de Septiembre 3957, en el corazón de Mar del Plata, y cuenta con capacidad para 33 residentes. Con años de trayectoria en el cuidado del adulto mayor, ofrece un ambiente hogareño y servicios de atención profesional. Su ubicación céntrica facilita el acceso tanto para residentes como para sus familias.',
    descripcionCorta:
      'Residencia con 33 plazas en 11 de Septiembre, zona céntrica de Mar del Plata.',
  },
  {
    slug: 'los-reyes',
    descripcion:
      'Los Reyes se encuentra en Falucho 1745, en un barrio tranquilo y accesible de la ciudad. Con capacidad para 22 residentes, brinda un entorno acogedor donde la atención personalizada es prioridad. Su escala reducida permite construir vínculos cercanos entre residentes, familias y el equipo de profesionales.',
    descripcionCorta:
      'Entorno acogedor con 22 plazas y atención personalizada en Falucho 1745.',
  },
  {
    slug: 'mi-casa',
    descripcion:
      'Mi Casa, ubicada en San Lorenzo 2236, se destaca por su calificación perfecta de 5.0/5 en Yably, reflejo de la excelencia en el trato y los servicios que brinda. Con capacidad para 30 residentes, su nombre lo dice todo: busca que cada persona se sienta como en su propia casa. El equipo profesional trabaja para mantener un ambiente cálido, seguro y familiar.',
    descripcionCorta:
      'Calificación perfecta 5.0/5 en Yably con 30 plazas en San Lorenzo 2236.',
  },
  {
    slug: 'santiago-apostol',
    descripcion:
      'Santiago Apóstol está ubicada en Garay 1752 y cuenta con una excelente calificación de 4.7/5 en Google, una de las más altas de la ciudad. Con capacidad para 24 residentes, ofrece un espacio de cuidado profesional con fuerte valoración por parte de las familias. Su reputación la convierte en una de las residencias más elegidas de Mar del Plata.',
    descripcionCorta:
      'Una de las mejor calificadas: 4.7/5 en Google, con 24 plazas en Garay 1752.',
  },
  {
    slug: 'el-hogar-de-rosa',
    descripcion:
      'El Hogar de Rosa pertenece al grupo Hogares MdP y se ubica sobre Av. Independencia 933, en una ubicación privilegiada de la ciudad. La pertenencia a un grupo consolidado garantiza protocolos de calidad, profesionales capacitados y una visión integral del cuidado del adulto mayor. Su ubicación sobre una avenida principal la hace fácilmente accesible.',
    descripcionCorta:
      'Integrante del grupo Hogares MdP sobre Av. Independencia 933.',
  },
  {
    slug: 'jose-ignacio',
    descripcion:
      'José Ignacio forma parte del grupo Hogares MdP y se encuentra en 20 de Septiembre 858. Como integrante de un grupo reconocido en la ciudad, cuenta con respaldo institucional y un equipo de profesionales con experiencia en el cuidado geriátrico. Ofrece un espacio seguro y organizado para sus residentes.',
    descripcionCorta:
      'Respaldada por el grupo Hogares MdP, ubicada en 20 de Septiembre 858.',
  },
  {
    slug: 'las-moras',
    descripcion:
      'Las Moras opera en dos sedes estratégicas: Rodríguez Peña 1801 y Sarmiento 2903. Se distingue por su completo equipo profesional que incluye médico clínico, enfermería, terapia ocupacional y nutrición. Cuenta con un área protegida las 24 horas, ideal para residentes que requieren mayor supervisión. Su doble sede y amplitud de servicios la posicionan como una opción integral.',
    descripcionCorta:
      'Dos sedes con médico, enfermería, terapia ocupacional, nutrición y área protegida 24hs.',
  },
  {
    slug: 'residencia-asistida-punta-mogotes',
    descripcion:
      'La Residencia Asistida Punta Mogotes es un establecimiento municipal destinado a personas mayores en situación de desprotección social. Su carácter público garantiza el acceso a quienes más lo necesitan, brindando un espacio seguro y contenedor con servicios esenciales para el bienestar del adulto mayor.',
    descripcionCorta:
      'Residencia municipal para adultos mayores en situación de desprotección.',
  },
  {
    slug: 'residencia-eva-peron',
    descripcion:
      'La Residencia Eva Perón es un establecimiento municipal que brinda alojamiento y cuidado a personas mayores en situación de vulnerabilidad y desprotección. Con respaldo del municipio de General Pueyrredón, garantiza acceso a servicios básicos de salud, alimentación y contención para quienes no cuentan con otra red de apoyo.',
    descripcionCorta:
      'Establecimiento municipal que asiste a adultos mayores en situación de vulnerabilidad.',
  },
  {
    slug: 'residencia-casabella',
    descripcion:
      'Residencia Casabella se ubica en Ángel Roffo 1153, en el barrio Caisamar, una zona residencial y tranquila de Mar del Plata. Con una calificación sobresaliente de 4.91/5 en Yably basada en 29 reseñas, se destaca por la satisfacción de sus residentes y familias. El entorno barrial aporta serenidad al día a día de quienes eligen este hogar.',
    descripcionCorta:
      'Calificación 4.91/5 en Yably en el tranquilo barrio Caisamar.',
  },
  {
    slug: 'bizkaia-residencia',
    descripcion:
      'Bizkaia Residencia se encuentra en Hipólito Yrigoyen 2740 y ostenta una calificación perfecta de 5.0/5 en Yably con 57 reseñas, lo que la convierte en una de las residencias mejor valoradas de toda la ciudad. Su alto volumen de opiniones positivas refleja un nivel de servicio consistente y un compromiso genuino con el bienestar de cada residente.',
    descripcionCorta:
      'Calificación perfecta 5.0/5 con 57 reseñas en Yably, sobre Hipólito Yrigoyen.',
  },
  {
    slug: 'virgen-de-lujan',
    descripcion:
      'Virgen de Luján está ubicada en Ayacucho 4081/4087 y cuenta con la máxima calificación de 5/5 en Google. Este puntaje perfecto refleja la excelencia en el trato, las instalaciones y los servicios que brinda a sus residentes. Su doble numeración sobre Ayacucho sugiere amplias instalaciones y espacios generosos.',
    descripcionCorta:
      'Calificación máxima de 5/5 en Google, ubicada en Ayacucho 4081/4087.',
  },
  {
    slug: 'girasoles',
    descripcion:
      'Girasoles se encuentra en Maipú 3155 y trae consigo más de 20 años de experiencia en el cuidado del adulto mayor. Su calificación perfecta de 5.0/5 en Yably avala dos décadas de dedicación y profesionalismo. La trayectoria sostenida en el tiempo y la constante satisfacción de las familias hablan de un compromiso genuino con la calidad.',
    descripcionCorta:
      'Más de 20 años de experiencia con calificación perfecta 5.0/5 en Yably.',
  },
  {
    slug: 'estancia',
    descripcion:
      'Estancia, ubicada en Tucumán 2771, funciona como residencia geriátrica y centro de rehabilitación, combinando el cuidado permanente con servicios de recuperación física. Con una calificación de 4.65/5 en Yably, ofrece un enfoque integral que abarca desde la internación hasta programas de rehabilitación personalizados para cada residente.',
    descripcionCorta:
      'Residencia y centro de rehabilitación con 4.65/5 en Yably, en Tucumán 2771.',
  },
  {
    slug: 'convivencias',
    descripcion:
      'Convivencias se ubica en Castelli 2062 y cuenta con una calificación perfecta de 5.0/5 en Yably respaldada por 13 reseñas. Con más de 2.300 seguidores en Instagram, mantiene una comunicación activa y transparente con las familias. Su fuerte presencia digital refleja un compromiso con la apertura y la confianza.',
    descripcionCorta:
      'Puntuación perfecta 5.0/5 en Yably y activa comunidad digital con +2.300 seguidores.',
  },
  {
    slug: 'villa-chauvin',
    descripcion:
      'Villa Chauvin se encuentra en San Luis 4465 y se distingue por su equipo multidisciplinario que aborda el cuidado del adulto mayor desde múltiples perspectivas profesionales. Con una calificación de 4.85/5 en Yably, ofrece una atención integral y coordinada que contempla las necesidades médicas, emocionales y sociales de cada residente.',
    descripcionCorta:
      'Equipo multidisciplinario con 4.85/5 en Yably, ubicada en San Luis 4465.',
  },
  {
    slug: 'hogar-ipanema',
    descripcion:
      'Hogar Ipanema está ubicado sobre Av. Libertad 3222, una avenida de fácil acceso en Mar del Plata. Con una calificación de 4.73/5 en Yably, se posiciona entre las residencias bien valoradas de la ciudad. Su ubicación sobre una avenida principal facilita las visitas familiares y el acceso a servicios de salud cercanos.',
    descripcionCorta:
      'Bien valorada con 4.73/5 en Yably, sobre Av. Libertad 3222.',
  },
  {
    slug: 'rincon-de-lila',
    descripcion:
      'Rincón de Lila se encuentra en Valencia 8055, en una zona más alejada del centro que ofrece tranquilidad y contacto con la naturaleza. Con una calificación de 4.80/5 en Yably, combina un entorno sereno con servicios profesionales de calidad. Ideal para quienes buscan un espacio residencial en un ambiente apacible y verde.',
    descripcionCorta:
      'Entorno sereno con 4.80/5 en Yably, en Valencia 8055.',
  },
  {
    slug: 'hogar-mi-bien-estar',
    descripcion:
      'Hogar Mi Bien Estar se ubica en Av. Juan José Paso 3269, sobre una de las avenidas transitadas de la ciudad. Con una calificación de 4.33/5 en Yably, ofrece un espacio de cuidado accesible y profesional. Su nombre refleja su filosofía: priorizar el bienestar integral de cada persona mayor que elige este hogar.',
    descripcionCorta:
      'Bienestar integral con 4.33/5 en Yably, sobre Av. Juan José Paso 3269.',
  },
  {
    slug: 'casa-anis',
    descripcion:
      'Casa Anís está ubicada en 25 de Mayo 3354, en una zona residencial de Mar del Plata. Con una calificación de 4.20/5 en Yably, ofrece un espacio hogareño y cálido para el cuidado del adulto mayor. Su propuesta se centra en brindar un ambiente familiar donde cada residente se sienta valorado y acompañado.',
    descripcionCorta:
      'Ambiente hogareño con 4.20/5 en Yably, en 25 de Mayo 3354.',
  },
  {
    slug: 'los-alerces',
    descripcion:
      'Los Alerces, ubicada en Güemes 3626, es una residencia geriátrica que combina calidez humana, profesionalismo y una visión moderna del cuidado del adulto mayor. Con una calificación de 4.20/5 en Yably y una activa comunidad de más de 1.750 seguidores en Instagram, se distingue por su transparencia, cercanía con las familias y comunicación permanente. Su equipo profesional trabaja con dedicación para crear un entorno donde cada residente reciba atención personalizada, respeto por su historia de vida y la mejor calidad de cuidado en Mar del Plata.',
    descripcionCorta:
      'Calidez, profesionalismo y cuidado personalizado en Güemes 3626, con activa presencia digital.',
  },
  {
    slug: 'hogar-santisima-trinidad',
    descripcion:
      'Hogar Santísima Trinidad se ubica en Olegario Andrade 1143, en el barrio Florida de Mar del Plata. Con una calificación de 4.4/5 en Google, se destaca en un barrio residencial y familiar. Su inserción en la comunidad barrial aporta un sentido de pertenencia y cercanía que enriquece la experiencia de sus residentes.',
    descripcionCorta:
      'Calificación 4.4/5 en Google en el tradicional barrio Florida.',
  },
  {
    slug: 'bona-vista-hogar',
    descripcion:
      'Bona Vista Hogar se encuentra sobre Av. Constitución 4418, una zona accesible de Mar del Plata. Con una calificación de 4.00/5 en Yably, ofrece servicios de cuidado geriátrico en un espacio diseñado para el bienestar y la comodidad. Su nombre evoca la visión de un lugar con buenas perspectivas para el cuidado integral.',
    descripcionCorta:
      'Cuidado geriátrico con 4.00/5 en Yably, sobre Av. Constitución 4418.',
  },
  {
    slug: 'sagrada-familia',
    descripcion:
      'Sagrada Familia está ubicada en Jujuy 1157, en una zona céntrica y accesible de la ciudad. Con una calificación de 3.9/5 en Google, brinda servicios de cuidado para adultos mayores con trayectoria en la comunidad marplatense. Su ubicación central facilita tanto las visitas familiares como el acceso a servicios médicos y comerciales.',
    descripcionCorta:
      'Ubicación céntrica en Jujuy 1157 con calificación 3.9/5 en Google.',
  },
  {
    slug: 'residencia-los-milagros',
    descripcion:
      'Residencia Los Milagros se encuentra en Rawson 1856 y ofrece servicios de internación para adultos mayores en Mar del Plata. Brinda un espacio de contención y cuidado con equipo profesional dedicado al bienestar de sus residentes. Su propuesta se enfoca en la atención diaria y el acompañamiento integral.',
    descripcionCorta:
      'Residencia con atención profesional y contención en Rawson 1856.',
  },
  {
    slug: 'luz-de-vida',
    descripcion:
      'Luz de Vida está ubicada en Av. J. H. Jara 1084 y ofrece un espacio de cuidado para adultos mayores con un equipo comprometido. Su nombre refleja la vocación de iluminar la etapa mayor de la vida con dignidad y acompañamiento profesional. Brinda servicios orientados a la salud, el bienestar y la calidad de vida de cada residente.',
    descripcionCorta:
      'Cuidado con vocación y acompañamiento profesional en Av. J. H. Jara 1084.',
  },
  {
    slug: 'lares-del-mar',
    descripcion:
      'Lares del Mar se ubica en Av. Fortunato de la Plaza 1870 y ofrece una propuesta doble: residencia geriátrica y hogar de día. Con una calificación de 4.4/5 en Google, brinda flexibilidad para familias que buscan tanto internación permanente como asistencia diurna. Esta modalidad mixta la diferencia y la convierte en una opción versátil para distintas necesidades.',
    descripcionCorta:
      'Residencia + hogar de día con 4.4/5 en Google, sobre Av. Fortunato de la Plaza.',
  },
  {
    slug: 'mama-sara-edison',
    descripcion:
      'Mamá Sara Edison es la sede premium del grupo Mamá Sara, ubicada en Edison 2541. Como parte de un grupo con 4 sedes en Mar del Plata, cuenta con respaldo institucional y estándares elevados de calidad. Su categoría premium implica instalaciones superiores, servicios diferenciados y una atención exclusiva para quienes buscan lo mejor en cuidado geriátrico.',
    descripcionCorta:
      'Sede premium del grupo Mamá Sara (4 sedes) en Edison 2541.',
  },
  {
    slug: 'mama-sara-vieytes',
    descripcion:
      'Mamá Sara Vieytes forma parte del reconocido grupo Mamá Sara y se ubica en Vieytes 3242. Como integrante de un grupo con 4 sedes en la ciudad, se beneficia de protocolos estandarizados, profesionales capacitados y una filosofía de cuidado compartida. Ofrece un ambiente familiar con el respaldo de una organización consolidada.',
    descripcionCorta:
      'Integrante del grupo Mamá Sara con 4 sedes, en Vieytes 3242.',
  },
  {
    slug: 'mama-sara-chacabuco',
    descripcion:
      'Mamá Sara Chacabuco se encuentra en Chacabuco 3874 y pertenece al grupo Mamá Sara, con presencia en 4 ubicaciones de Mar del Plata. Esta sede aporta la experiencia y los valores del grupo en un barrio accesible, manteniendo los estándares de calidad y atención que caracterizan a todas las sedes de Mamá Sara.',
    descripcionCorta:
      'Sede Chacabuco del grupo Mamá Sara, en Chacabuco 3874.',
  },
  {
    slug: 'mama-sara-espana',
    descripcion:
      'Mamá Sara España está ubicada en España 855 y completa la red de 4 sedes del grupo Mamá Sara en Mar del Plata. Su ubicación en una zona céntrica la hace fácilmente accesible para visitas familiares. Como parte del grupo, mantiene los mismos estándares de cuidado, profesionalismo y calidez que caracterizan a Mamá Sara.',
    descripcionCorta:
      'Sede céntrica del grupo Mamá Sara, en España 855.',
  },
  {
    slug: 'flor-de-liz',
    descripcion:
      'Flor de Liz cuenta con una de las comunidades digitales más grandes entre las residencias de Mar del Plata, con más de 5.800 seguidores en Instagram. Esta fuerte presencia en redes refleja un compromiso con la comunicación abierta y la transparencia hacia las familias. Su propuesta de cuidado se destaca por la visibilidad y confianza que genera en la comunidad.',
    descripcionCorta:
      'La mayor comunidad digital con +5.800 seguidores en Instagram.',
  },
  {
    slug: 'dos-valles',
    descripcion:
      'Dos Valles se encuentra en Ayacucho 3658 y mantiene una activa presencia en redes sociales con cerca de 1.700 seguidores en Instagram. Esta comunicación constante con la comunidad refleja una gestión moderna y abierta. Ofrece servicios de cuidado geriátrico en una zona residencial accesible de Mar del Plata.',
    descripcionCorta:
      'Gestión moderna con +1.700 seguidores IG, en Ayacucho 3658.',
  },
  {
    slug: 'casalia',
    descripcion:
      'Casalia se ubica en Estados Unidos 355, en el barrio Alfar de Mar del Plata. Con presencia activa en Instagram y más de 600 seguidores, mantiene una comunicación cercana con las familias. Su ubicación en el barrio Alfar ofrece un entorno tranquilo y residencial, ideal para el cuidado del adulto mayor.',
    descripcionCorta:
      'Residencia en el barrio Alfar con presencia digital activa, en Estados Unidos 355.',
  },
];

// ── Actualizar documentos en Firestore ─────────────────────────────────────

async function actualizarDescripciones() {
  // Authenticate as admin first
  console.log(`🔐 Autenticando como ${ADMIN_EMAIL}...`);
  try {
    await signInWithEmailAndPassword(authInstance, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('   ✅ Autenticación exitosa\n');
  } catch (error) {
    console.error('❌ Error de autenticación:', error.message);
    process.exit(1);
  }

  console.log(`🔄 Actualizando descripciones de ${residencias.length} residencias...\n`);

  let actualizadas = 0;
  let errores = 0;

  for (const { slug, descripcion, descripcionCorta } of residencias) {
    try {
      const ref = doc(db, 'residencias', slug);
      await updateDoc(ref, {
        descripcion,
        descripcionCorta,
        updatedAt: serverTimestamp(),
      });
      actualizadas++;
      console.log(`   ✅ [${actualizadas}/${residencias.length}] ${slug}`);
    } catch (error) {
      errores++;
      console.error(`   ❌ Error actualizando ${slug}:`, error.message);
    }
  }

  console.log(`\n🎉 ¡Actualización completada!`);
  console.log(`   ✅ Actualizadas: ${actualizadas}`);
  if (errores > 0) {
    console.log(`   ❌ Errores: ${errores}`);
  }
  console.log('');
}

actualizarDescripciones()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error general:', error);
    process.exit(1);
  });

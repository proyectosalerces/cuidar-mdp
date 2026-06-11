/**
 * cargar-profesionales.mjs
 *
 * Loads ~95 certified home caregivers from the MGP 2024 registry into Firestore.
 * Only stores: name, specialty, certification, year. No personal contact data.
 *
 * Usage:
 *   set FIREBASE_ADMIN_PASSWORD=Diego1988!
 *   node scripts/cargar-profesionales.mjs
 */

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

// ── Firebase config ────────────────────────────────────────────────────────

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

// ── Helpers ────────────────────────────────────────────────────────────────

function generateSlug(name) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function titleCase(str) {
  return str
    .toLowerCase()
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
    .replace(/ De /g, ' de ')
    .replace(/ Del /g, ' del ')
    .replace(/ Los /g, ' los ')
    .replace(/ Las /g, ' las ')
    .replace(/ La /g, ' la ')
    .replace(/ En /g, ' en ')
    .replace(/ Y /g, ' y ');
}

function mapEspecialidad(cert) {
  const c = cert.toUpperCase();
  if (c.includes('CUIDADOS PALIATIVOS')) return 'cuidados-paliativos';
  if (c.includes('AUXILIAR DE FAMILIA')) return 'auxiliar-familia';
  if (c.includes('AUXILIAR EN CUIDADOS GERONTOLOGICO') ||
      c.includes('AUXILIAR GERONTOLOGICO') ||
      c.includes('ASISTENTE GERONTOLOGICO') ||
      c.includes('AUXILIAR EN CUIDADOS DE ADULTOS')) return 'auxiliar-gerontologico';
  return 'cuidador-domiciliario';
}

function mapCertLabel(cert) {
  const c = cert.toUpperCase();
  if (c.includes('CUIDADOS PALIATIVOS')) return 'Formación en Cuidados Paliativos';
  if (c.includes('AUXILIAR DE FAMILIA')) return 'Auxiliar de Familia Esp. en Adultos Mayores';
  if (c.includes('AUXILIAR EN CUIDADOS GERONTOLOGICO')) return 'Auxiliar en Cuidados Gerontológicos';
  if (c.includes('AUXILIAR GERONTOLOGICO DOMICILIARIO')) return 'Auxiliar Gerontológico Domiciliario';
  if (c.includes('ASISTENTE GERONTOLOGICO DOMICILIARIO')) return 'Asistente Gerontológico Domiciliario';
  if (c.includes('AUXILIAR EN CUIDADOS DE ADULTOS')) return 'Auxiliar en Cuidados de Adultos Mayores';
  if (c.includes('AUXILIAR EN CUIDADOS DOMICILIARIOS')) return 'Auxiliar en Cuidados Domiciliarios';
  if (c.includes('CURSO DE FORMACION DE CUIDADORES')) return 'Formación de Cuidadores Domiciliarios';
  return 'Cuidador/a Domiciliario/a';
}

function extractYear(cert) {
  const match = cert.match(/\b(20\d{2})\b/);
  return match ? match[1] : '';
}

function extractEntidad(cert) {
  const c = cert.toUpperCase();
  if (c.includes('DGCYE')) return 'DGCYE';
  if (c.includes('DINAPAM MGP')) return 'DINAPAM / MGP';
  if (c.includes('DINAPAM')) return 'DINAPAM';
  return 'Certificado';
}

// ── Data parsed from PDF ───────────────────────────────────────────────────

const rawData = `ACOSTA ANALIA SOLEDAD|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
ARRATIA BEATRIZ GLORIA|AUXILIAR EN CUIDADOS GERONTOLOGICOS. DINAPAM 2015
ASCONAPE MARIA ANGELICA|AUXILIAR GERONTOLOGICO DOMICILIARIO. DINAPAM 2016
BAEZ VANESA LUCRECIA|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
BARRERA LAURA FERNANDA|AUXILIAR EN CUIDADOS GERONTOLOGICOS. DINAPAM 2016
BILLOTO MARIA LORENA|AUXILIAR EN CUIDADOS DE ADULTOS MAYORES. DGCYE 2015
BOGADO LORENA MARIA|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
BORDA GLADYS ESTELA|AUXILIAR DE FAMILIA ESPECIALIZADO EN A.M. DGCYE 2016
BORDA OLIVIA BEATRIZ|AUXILIAR DE FAMILIA ESPECIALIZADO EN A.M. DGCYE 2016
BORDA ROSA BEATRIZ|AUXILIAR DE FAMILIA ESPECIALIZADO EN A.M. DGCYE 2016
CABRAL MARIA ELENA|CUIDADOR DOMICILIARIO. DINAPAM 2015
CALLEJA MARIA INES|AUXILIAR EN CUIDADOS GERONTOLOGICOS. DINAPAM 2015
CAMALY SILVIA|CUIDADOR DOMICILIARIO. DINAPAM 2015
CARDOZO IRMA ERCILIA|AUXILIAR EN CUIDADOS GERONTOLOGICOS. DINAPAM 2015
CARDOZO MIRTA CAROLINA|AUXILIAR DE FAMILIA ESPECIALIZADO EN A.M. DGCYE 2016
CASTILLO VANINA BELEN|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
CENTURION JUANA LORENA|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
CHACON MARINA|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
CHAMORRO SILVINA BEATRIZ|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
CONTRERAS CLAUDIA ELIZABETH|AUXILIAR EN CUIDADOS GERONTOLOGICOS. DINAPAM 2016
DANIELE NORMA BEATRIZ|AUXILIAR EN CUIDADOS GERONTOLOGICOS. DINAPAM 2015
DIAZ TAMARA LOURDES|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
DOMINGUEZ SONIA ELIZABETH|AUXILIAR EN CUIDADOS GERONTOLOGICOS. DINAPAM 2016
ESCUDERO SILVINA VALERIA|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
ESPERON DORA EMILIA|AUXILIAR GERONTOLOGICO DOMICILIARIO. DINAPAM 2016
ESPINOZA MIRIAM LOURDES|AUXILIAR EN CUIDADOS DE ADULTOS MAYORES. DGCYE 2015
ESPOSITO MARIA JOSE|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
FERNANDEZ MARCELA PATRICIA|AUXILIAR DE FAMILIA ESPECIALIZADO EN A.M. DGCYE 2016
FERNANDEZ VIVIANA BEATRIZ|AUXILIAR DE FAMILIA ESPECIALIZADO EN A.M. DGCYE 2016
FERRADA DANIELA FABIANA|ASISTENTE GERONTOLOGICO DOMICILIARIO. DINAPAM 2015
FIGUEROA CLAUDIA ANAHI|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
FIORENTINI SILVIA NOEMI|CURSO EN FORMACION DE CUIDADOS PALIATIVOS. DINAPAM 2011
FREIJO BAEZ GABRIELA LETICIA|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
FUENZALIDA MARINA VALERIA|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
FUNES VERONICA GRACIELA|AUXILIAR EN CUIDADOS DOMICILIARIOS. DINAPAM 2015
GARCIA ANDREA ALICIA|AUXILIAR EN CUIDADOS GERONTOLOGICOS. DINAPAM 2016
GARCIA GRACIELA BEATRIZ|AUXILIAR EN CUIDADOS GERONTOLOGICOS. DINAPAM 2016
GEREZ GRACIELA LEONOR|AUXILIAR GERONTOLOGICO DOMICILIARIO. DINAPAM 2016
GIMENEZ CORINA ROSALIA|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
GIMENEZ PATRICIA LILIAN|AUXILIAR GERONTOLOGICO DOMICILIARIO. DINAPAM 2016
GOMEZ SILVIA LETICIA|AUXILIAR EN CUIDADOS GERONTOLOGICOS. DINAPAM 2015
GONZALEZ STEFANIA DEL MAR|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
GUEVARA PAULA ANABEL|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
JIMENEZ MIRIAM|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
KEES LAURA SOFIA|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
LOPEZ DIANA ELIZABETH|AUXILIAR EN CUIDADOS GERONTOLOGICOS. DINAPAM 2015
MALDONADO MIRTA IRENE|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
MARTINANGELO MARIA FERNANDA|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
MARTINEZ KARINA ELIZABETH|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
MARTINEZ LORENA ERICA|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
MARTINEZ JUAN CARLOS|AUXILIAR GERONTOLOGICO DOMICILIARIO. DINAPAM 2016
MARTINI VALLE CELESTE AYALEN|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
MAURI CACIAS CARMEN SALOME|CUIDADOR DOMICILIARIO. DINAPAM 2015
MENA CLAUDIA KARINA|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
MENDEZ ALICIA RENE|AUXILIAR EN CUIDADOS DE ADULTOS MAYORES. DGCYE 2015
MENDEZ MARGARITA CEFERINA|AUXILIAR DE FAMILIA ESPECIALIZADO EN A.M. DGCYE 2016
MENDEZ OLGA CRISTINA|AUXILIAR DE FAMILIA ESPECIALIZADO EN A.M. DGCYE 2016
MENDOZA NOEMI MABEL|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
MOLINA MARIA BEATRIZ|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
MORALES ROMINA NOELI|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
MORILLO NOEMI|CUIDADOR DOMICILIARIO. DINAPAM 2016
MOYANO NELIDA ROSA|AUXILIAR EN CUIDADOS GERONTOLOGICOS. DINAPAM 2016
NICORA MARIA DE LOS ANGELES|AUXILIAR EN CUIDADOS GERONTOLOGICOS. DINAPAM 2016
PELUSO ROSA PATRICIA|CUIDADOR DOMICILIARIO. DINAPAM 2015
PIRAGINI PATRICIA ELISABET|AUXILIAR EN CUIDADOS GERONTOLOGICOS. DINAPAM 2015
PISANI EVELYN SOLEDAD|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
RAPONI CLAUDIA MARISA FABIANA|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
RIVAS MAXIMILIANO|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
RIVERO MARIA FERNANDA|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
ROSALES ROXANA KARINA|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
RUBIOLO MARIA FERNANDA|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
SALAZAR RAFAEL ADRIAN|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
SALDARRIAGA QUEREVALU ROSA MARIA|AUXILIAR EN CUIDADOS GERONTOLOGICOS. DINAPAM 2015
SILVA RUBEN|CUIDADOR DOMICILIARIO. DINAPAM 2016
SISINI BLANCA RITA|CUIDADOR DOMICILIARIO. DINAPAM 2016
TEJERINA EDELMIRA|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
TONEATTI MIRIAM EDITH|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
TORRE VALERIA ESTER|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
TORRES FLORES RUTH NERY|AUXILIAR EN CUIDADOS GERONTOLOGICOS. DINAPAM 2016
TRIVELLI SANDRA|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
URIBE PATRICIA ALICIA|AUXILIAR EN CUIDADOS GERONTOLOGICOS. DINAPAM 2015
VALENCIA ORTIZ CLAUDIA PATRICIA|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
VILLALIBRE RAMONA ELENA|CUIDADOR DOMICILIARIO. DINAPAM 2016
VILLALONGA MARCELA EDITH|CURSO DE FORMACION DE CUIDADORES DOMICILIARIOS. DINAPAM 2007
VILLAR BLANCA VIVIANA|AUXILIAR EN CUIDADOS GERONTOLOGICOS. DINAPAM 2015
ZAMORA VICTOR HUGO|AUXILIAR EN CUIDADOS GERONTOLOGICOS. DINAPAM 2016
ZAPATA SANDRA KARINA|CUIDADOR DOMICILIARIO. DINAPAM MGP 2019
ZURITA SILVIA LUCIA|CUIDADOR DOMICILIARIO. DINAPAM 2016`;

// ── Build profesional objects ──────────────────────────────────────────────

const profesionales = rawData.split('\n').map(line => {
  const [rawName, cert] = line.split('|');
  const nombre = titleCase(rawName.trim());
  const slug = generateSlug(rawName.trim());
  const especialidad = mapEspecialidad(cert);
  const certLabel = mapCertLabel(cert);
  const year = extractYear(cert);
  const entidad = extractEntidad(cert);

  return {
    nombre,
    slug,
    especialidad,
    matricula: `${entidad} ${year}`.trim(),
    descripcion: `${certLabel} certificado/a por ${entidad} (${year}). Registrado/a en el Registro Municipal de Cuidadores Domiciliarios de General Pueyrredón.`,
    direccionConsultorio: 'Mar del Plata',
    barrio: 'centro',
    telefono: '',
    foto: '',
    calificacion: 0,
    cantidadResenas: 0,
    activo: true,
  };
});

// ── Upload to Firestore ────────────────────────────────────────────────────

async function cargarProfesionales() {
  console.log(`🔐 Autenticando como ${ADMIN_EMAIL}...`);
  try {
    await signInWithEmailAndPassword(authInstance, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('   ✅ Autenticación exitosa\n');
  } catch (error) {
    console.error('❌ Error de autenticación:', error.message);
    process.exit(1);
  }

  console.log(`🔄 Cargando ${profesionales.length} profesionales...\n`);

  let cargados = 0;
  let errores = 0;

  for (const prof of profesionales) {
    try {
      const ref = doc(db, 'profesionales', prof.slug);
      await setDoc(ref, {
        ...prof,
        createdAt: serverTimestamp(),
      });
      cargados++;
      console.log(`   ✅ [${cargados}/${profesionales.length}] ${prof.nombre} (${prof.especialidad})`);
    } catch (error) {
      errores++;
      console.error(`   ❌ Error cargando ${prof.nombre}:`, error.message);
    }
  }

  console.log(`\n🎉 ¡Carga completada!`);
  console.log(`   ✅ Cargados: ${cargados}`);
  if (errores > 0) {
    console.log(`   ❌ Errores: ${errores}`);
  }
  console.log('');
}

cargarProfesionales()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error general:', error);
    process.exit(1);
  });

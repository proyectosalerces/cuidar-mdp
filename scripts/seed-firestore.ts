/**
 * Seed script — Sube residencias y profesionales a Firestore.
 *
 * Uso:
 *   npx tsx scripts/seed-firestore.ts
 *
 * Este script lee los datos de los archivos mock (mock-residencias.ts y
 * mock-profesionales.ts) y los sube a las colecciones 'residencias' y
 * 'profesionales' de Firestore. Usa el slug como document ID.
 *
 * ⚠️  SOLO EJECUTAR UNA VEZ (o cuando quieras resetear los datos).
 *     Si el documento ya existe, lo sobreescribe.
 */

import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
} from 'firebase/firestore';

/* ── Firebase config (same as the app) ─────────────────────────────────── */

const firebaseConfig = {
  apiKey: 'AIzaSyDBhWaGpqYgeaAc1el64rB58cpjGvYMQ6Y',
  authDomain: 'cuidar-mdp.firebaseapp.com',
  projectId: 'cuidar-mdp',
  storageBucket: 'cuidar-mdp.firebasestorage.app',
  messagingSenderId: '255599787087',
  appId: '1:255599759087:web:21cfa21a71317a7835151a',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* ── Import mock data ──────────────────────────────────────────────────── */

import { mockResidencias } from '../src/data/mock-residencias';
import { mockProfesionales } from '../src/data/mock-profesionales';

/* ── Helpers ───────────────────────────────────────────────────────────── */

function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      clean[key] = value;
    }
  }
  return clean;
}

/* ── Seed functions ────────────────────────────────────────────────────── */

async function seedResidencias() {
  console.log('\n📦 Subiendo residencias a Firestore...');

  let count = 0;
  for (const residencia of mockResidencias) {
    const docId = residencia.slug || residencia.id;
    const data = stripUndefined({ ...residencia });
    // Remove 'id' field — Firestore uses the document ID
    delete data.id;

    const docRef = doc(db, 'residencias', docId);
    await setDoc(docRef, data);
    count++;
    console.log(`  ✅ [${count}/${mockResidencias.length}] ${residencia.nombre}`);
  }

  console.log(`\n✅ ${count} residencias subidas exitosamente.`);
}

async function seedProfesionales() {
  console.log('\n👥 Subiendo profesionales/cuidadores a Firestore...');

  let count = 0;
  for (const profesional of mockProfesionales) {
    const docId = profesional.slug || profesional.id;
    const data = stripUndefined({ ...profesional });
    // Remove 'id' field — Firestore uses the document ID
    delete data.id;

    const docRef = doc(db, 'profesionales', docId);
    await setDoc(docRef, data);
    count++;
    if (count % 10 === 0 || count === mockProfesionales.length) {
      console.log(`  ✅ [${count}/${mockProfesionales.length}] profesionales subidos...`);
    }
  }

  console.log(`\n✅ ${count} profesionales subidos exitosamente.`);
}

async function verifyData() {
  console.log('\n🔍 Verificando datos en Firestore...');

  const resSnap = await getDocs(collection(db, 'residencias'));
  console.log(`  📋 Residencias en Firestore: ${resSnap.size}`);

  const profSnap = await getDocs(collection(db, 'profesionales'));
  console.log(`  📋 Profesionales en Firestore: ${profSnap.size}`);
}

/* ── Main ──────────────────────────────────────────────────────────────── */

async function main() {
  console.log('🚀 Seed Firestore — Cuidar MdP');
  console.log('================================\n');

  try {
    await seedResidencias();
    await seedProfesionales();
    await verifyData();

    console.log('\n🎉 ¡Seed completado exitosamente!');
    console.log('   Los datos están ahora en Firestore.');
    console.log('   Ya podés eliminar los archivos mock si querés.\n');
  } catch (error) {
    console.error('\n❌ Error durante el seed:', error);
    process.exit(1);
  }

  process.exit(0);
}

main();

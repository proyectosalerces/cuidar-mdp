/**
 * importar-residencias.mjs
 *
 * Reads "geriatricos en actividad.xlsx" and uploads each row to the
 * Firestore `residencias` collection using the Firebase CLIENT SDK.
 *
 * Usage:
 *   node scripts/importar-residencias.mjs
 */

import { readFileSync } from 'fs';
import { resolve } from 'path';
import { createRequire } from 'module';

// Use createRequire so we can load CommonJS xlsx
const require = createRequire(import.meta.url);
const XLSX = require('xlsx');

// Firebase client SDK
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  doc,
  writeBatch,
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

// ── Helpers ────────────────────────────────────────────────────────────────

function toSlug(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');
}

function fixMojibake(text) {
  if (!text || typeof text !== 'string') return text;
  // xlsx handles encoding well enough; just trim and return
  return text;
}

function str(value) {
  if (value === null || value === undefined) return '';
  return fixMojibake(String(value).trim());
}

function num(value) {
  if (value === null || value === undefined) return 0;
  // Handle "1,117" format (with comma as thousands separator)
  if (typeof value === 'string') {
    value = value.replace(/,/g, '');
  }
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

function extractRating(notas) {
  if (!notas) return 0;
  const patterns = [
    /Google\s+(?:rating\s+)?(\d+(?:[.,]\d+)?)\/5/i,
    /Yably\s+(\d+(?:[.,]\d+)?)\/5/i,
    /(\d+(?:[.,]\d+)?)\/5/i,
  ];
  for (const pattern of patterns) {
    const match = notas.match(pattern);
    if (match) {
      return parseFloat(match[1].replace(',', '.'));
    }
  }
  return 0;
}

function toTitleCase(text) {
  const lower = text.toLowerCase();
  const exceptions = new Set(['de', 'del', 'la', 'las', 'los', 'el', 'y', 'e']);
  return lower
    .split(/\s+/)
    .map((word, index) => {
      if (index > 0 && exceptions.has(word)) return word;
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(' ');
}

// ── Read the Excel file ────────────────────────────────────────────────────

const EXCEL_PATH = resolve('c:/Users/proye/Desktop/geriatricos en actividad.xlsx');

console.log(`📖 Leyendo archivo Excel: ${EXCEL_PATH}`);

const workbook = XLSX.readFile(EXCEL_PATH);
const sheetName = workbook.SheetNames[0];
console.log(`📄 Hoja: "${sheetName}"`);

const rows = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: '' });

console.log(`📋 Filas encontradas: ${rows.length}`);

// ── Transform rows into Firestore documents ────────────────────────────────

const documents = [];

for (const row of rows) {
  const nombre = str(row['Nombre']);
  if (!nombre) continue;

  const nombreTitleCase = toTitleCase(nombre);
  const slug = toSlug(nombre);
  const notas = str(row['Notas']);
  const calificacion = extractRating(notas);
  const esLosAlerces = slug.includes('los-alerces');

  const docData = {
    nombre: nombreTitleCase,
    slug,
    descripcion: '',
    descripcionCorta: '',
    direccion: str(row['Dirección'] || row['Direccion'] || row['Direcci\u00f3n']),
    telefono: str(row['Teléfono'] || row['Telefono'] || row['Tel\u00e9fono']),
    website: str(row['Web / Facebook'] || row['Web']),
    instagram: str(row['Instagram']),
    seguidoresIG: num(row['Seguidores IG']),
    postsIG: num(row['Posts IG']),
    plazas: num(row['Plazas']),
    recibe: str(row['Recibe']),
    activa: true,
    verificada: true,
    habilitada: true,
    destacada: esLosAlerces,
    calificacion,
    cantidadResenas: 0,
    notas,
    fuentes: str(row['Fuentes']),
    ciudad: 'Mar del Plata',
    barrio: '',
    tiposCuidado: ['internacion-permanente'],
    servicios: [],
    imagenes: [],
    imagenPrincipal: '',
    precioDesde: null,
    precioHasta: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  documents.push({ slug, doc: docData });
  console.log(`   ✅ ${nombreTitleCase} → ${slug} (rating: ${calificacion})`);
}

console.log(`\n📦 Documentos a importar: ${documents.length}\n`);

// ── Upload to Firestore ────────────────────────────────────────────────────

const BATCH_SIZE = 500;

async function uploadDocuments() {
  let uploaded = 0;

  for (let i = 0; i < documents.length; i += BATCH_SIZE) {
    const batch = writeBatch(db);
    const chunk = documents.slice(i, i + BATCH_SIZE);

    for (const { slug, doc: docData } of chunk) {
      const ref = doc(collection(db, 'residencias'), slug);
      batch.set(ref, docData);
    }

    await batch.commit();
    uploaded += chunk.length;
    console.log(`   🔥 Batch enviado — ${uploaded}/${documents.length} documentos`);
  }

  console.log(`\n🎉 ¡Importación completada! ${uploaded} residencias subidas a Firestore.\n`);
}

uploadDocuments()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error durante la importación:', error);
    process.exit(1);
  });

'use client';

/**
 * Admin — Fix: borrar residencias del mock y limpiar fotos de profesionales
 */

import { useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { mockProfesionales } from '@/data/mock-profesionales';
import styles from '../residencias/form.module.css';

const MOCK_SLUGS = new Set([
  'casa-anis','casagrande-residencia-geriatrica','casa-irala',
  'centro-de-dia-plaza-mitre','centro-de-dia-tiempos-modernos',
  'centro-gerontologico-municipal-brown','centro-gerontologico-municipal-vertiz',
  'en-familia-residencia-senior','estancia-residencia',
  'gama-centro-integral-memoria','geriatrico-casablanca','geriatrico-mi-casa',
  'hogares-cristina-french','hogares-cristina-strobel',
  'hogares-mdp-hogar-de-rosa','hogares-mdp-hogar-otonal',
  'hogares-mdp-jose-ignacio','hogares-mdp-residencia-gema',
  'hogar-eva-peron-municipal','kairos-centro-de-dia','lares-del-mar',
  'los-alerces-hogar','mama-sara-chacabuco','mama-sara-edison',
  'mama-sara-espana','mama-sara-vieytes','nuestros-sabios',
  'residencia-las-moras-rodriguez-pena','residencia-las-moras-sarmiento',
  'residencia-seniors','villa-maria-hogar',
]);

export default function FixPage() {
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const addLog = (msg: string) => setLog((prev) => [...prev, msg]);

  const handleFix = async () => {
    setRunning(true);
    setLog([]);

    try {
      // ── 1. Borrar residencias del mock ──
      addLog('🗑️ Borrando residencias del mock de Firestore...');
      const resSnap = await getDocs(collection(db, 'residencias'));
      let deletedRes = 0;

      for (const d of resSnap.docs) {
        if (MOCK_SLUGS.has(d.id)) {
          await deleteDoc(doc(db, 'residencias', d.id));
          deletedRes++;
          addLog(`  ❌ ${d.data().nombre || d.id}`);
        }
      }
      addLog(`✅ ${deletedRes} residencias del mock borradas.`);
      addLog('');

      // ── 2. Limpiar fotos placeholder de profesionales ──
      addLog('🔧 Limpiando fotos placeholder de profesionales...');
      const profSnap = await getDocs(collection(db, 'profesionales'));
      let fixedFoto = 0;

      for (const d of profSnap.docs) {
        const data = d.data();
        if (data.foto && (data.foto.includes('placeholder') || data.foto.includes('/images/'))) {
          await updateDoc(doc(db, 'profesionales', d.id), { foto: '' });
          fixedFoto++;
        }
      }
      addLog(`✅ ${fixedFoto} fotos placeholder limpiadas.`);
      addLog('');

      // ── 3. Verificar resultado ──
      const resAfter = await getDocs(collection(db, 'residencias'));
      const profAfter = await getDocs(collection(db, 'profesionales'));
      addLog('📋 Estado final:');
      addLog(`  Residencias en Firestore: ${resAfter.size}`);
      addLog(`  Profesionales en Firestore: ${profAfter.size}`);
      addLog('');
      addLog('🎉 ¡Corrección completada!');
      setDone(true);
    } catch (err) {
      addLog(`❌ Error: ${err}`);
      console.error(err);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/admin" className={styles.backBtn}>←</Link>
        <h1 className={styles.title}>Fix — Limpieza de datos</h1>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Correcciones pendientes</h2>
        <p style={{ marginBottom: '1rem', color: '#94a3b8', lineHeight: 1.6 }}>
          Este proceso:<br />
          1. <strong>Borra</strong> las 31 residencias duplicadas del mock<br />
          2. <strong>Limpia</strong> las fotos placeholder de los profesionales
        </p>

        <button
          className={styles.saveBtn}
          onClick={handleFix}
          disabled={running || done}
          style={{ marginBottom: '1.5rem' }}
        >
          {running ? 'Ejecutando...' : done ? '✅ Completado' : 'Ejecutar limpieza'}
        </button>

        {log.length > 0 && (
          <pre
            style={{
              background: '#0f172a',
              color: '#e2e8f0',
              padding: '1rem',
              borderRadius: '0.5rem',
              fontSize: '0.85rem',
              lineHeight: 1.8,
              maxHeight: '600px',
              overflowY: 'auto',
              fontFamily: 'monospace',
            }}
          >
            {log.join('\n')}
          </pre>
        )}
      </div>
    </div>
  );
}

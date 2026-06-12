'use client';

/**
 * Admin — Seed page
 *
 * Sube todas las residencias y profesionales de los archivos mock a Firestore.
 * Solo accesible desde /admin/seed cuando el usuario está autenticado como admin.
 *
 * ⚠️  Esta página es de uso único. Sobreescribe los datos existentes en Firestore.
 */

import { useState } from 'react';
import Link from 'next/link';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { mockResidencias } from '@/data/mock-residencias';
import { mockProfesionales } from '@/data/mock-profesionales';
import styles from '../residencias/form.module.css';

function stripUndefined(obj: Record<string, unknown>): Record<string, unknown> {
  const clean: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      clean[key] = value;
    }
  }
  return clean;
}

export default function SeedPage() {
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const addLog = (msg: string) => setLog((prev) => [...prev, msg]);

  const seedResidencias = async () => {
    addLog('📦 Subiendo residencias...');
    let count = 0;
    for (const res of mockResidencias) {
      const docId = res.slug || res.id;
      const data = stripUndefined({ ...res } as Record<string, unknown>);
      delete data.id;
      data.createdAt = data.createdAt || new Date().toISOString();
      data.updatedAt = new Date().toISOString();

      await setDoc(doc(db, 'residencias', docId), data);
      count++;
      if (count % 5 === 0 || count === mockResidencias.length) {
        addLog(`  ✅ ${count}/${mockResidencias.length} residencias`);
      }
    }
    addLog(`✅ ${count} residencias subidas.`);
  };

  const seedProfesionales = async () => {
    addLog('👥 Subiendo profesionales/cuidadores...');
    let count = 0;
    for (const prof of mockProfesionales) {
      const docId = prof.slug || prof.id;
      const data = stripUndefined({ ...prof } as Record<string, unknown>);
      delete data.id;
      data.createdAt = data.createdAt || new Date().toISOString();

      await setDoc(doc(db, 'profesionales', docId), data);
      count++;
      if (count % 10 === 0 || count === mockProfesionales.length) {
        addLog(`  ✅ ${count}/${mockProfesionales.length} profesionales`);
      }
    }
    addLog(`✅ ${count} profesionales subidos.`);
  };

  const handleSeed = async () => {
    setRunning(true);
    setLog([]);
    addLog('🚀 Iniciando seed de Firestore...');
    addLog('');

    try {
      await seedResidencias();
      addLog('');
      await seedProfesionales();
      addLog('');
      addLog('🎉 ¡Seed completado exitosamente!');
      addLog('   Los datos están ahora en Firestore.');
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
        <Link href="/admin" className={styles.backBtn}>
          ←
        </Link>
        <h1 className={styles.title}>Seed Firestore</h1>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Cargar datos iniciales</h2>
        <p style={{ marginBottom: '1rem', color: '#94a3b8', lineHeight: 1.6 }}>
          Este proceso sube <strong>{mockResidencias.length} residencias</strong> y{' '}
          <strong>{mockProfesionales.length} profesionales/cuidadores</strong> a Firestore.
          <br />
          ⚠️ Si los documentos ya existen, se sobreescriben.
        </p>

        <button
          className={styles.saveBtn}
          onClick={handleSeed}
          disabled={running || done}
          style={{ marginBottom: '1.5rem' }}
        >
          {running
            ? 'Subiendo datos...'
            : done
            ? '✅ Seed completado'
            : 'Ejecutar Seed'}
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
              maxHeight: '500px',
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

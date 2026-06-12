'use client';

/**
 * Admin — Fix profesionales data
 *
 * 1. Limpia el campo 'foto' de todos los profesionales que tienen el placeholder
 * 2. Elimina profesionales que NO están en el PDF del listado MGP 2024
 */

import { useState } from 'react';
import Link from 'next/link';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { mockProfesionales } from '@/data/mock-profesionales';
import styles from '../residencias/form.module.css';

export default function FixPage() {
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const addLog = (msg: string) => setLog((prev) => [...prev, msg]);

  const handleFix = async () => {
    setRunning(true);
    setLog([]);
    addLog('🔧 Corrigiendo profesionales en Firestore...');
    addLog('');

    try {
      // Build set of valid slugs from the PDF-generated mock data
      const validSlugs = new Set(mockProfesionales.map((p) => p.slug));
      addLog(`📋 Profesionales válidos (del PDF): ${validSlugs.size}`);

      const snapshot = await getDocs(collection(db, 'profesionales'));
      addLog(`📋 Profesionales en Firestore: ${snapshot.size}`);
      addLog('');

      let fixedFoto = 0;
      let deleted = 0;
      const deletedNames: string[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const slug = data.slug || docSnap.id;

        // Delete if not in the PDF
        if (!validSlugs.has(slug)) {
          deletedNames.push(data.nombre || docSnap.id);
          await deleteDoc(doc(db, 'profesionales', docSnap.id));
          deleted++;
          continue;
        }

        // Fix foto: clear placeholder paths
        const updates: Record<string, unknown> = {};
        if (data.foto && (data.foto.includes('placeholder') || data.foto.includes('/images/'))) {
          updates.foto = '';
          fixedFoto++;
        }

        if (Object.keys(updates).length > 0) {
          await updateDoc(doc(db, 'profesionales', docSnap.id), updates);
        }
      }

      if (deletedNames.length > 0) {
        addLog('🗑️ Profesionales eliminados (no están en el PDF):');
        for (const name of deletedNames) {
          addLog(`  ❌ ${name}`);
        }
        addLog('');
      }

      addLog(`✅ Fotos placeholder limpiadas: ${fixedFoto}`);
      addLog(`🗑️ Profesionales eliminados: ${deleted}`);
      addLog('');

      // Verify final count
      const finalSnapshot = await getDocs(collection(db, 'profesionales'));
      addLog(`📋 Profesionales finales en Firestore: ${finalSnapshot.size}`);
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
        <h1 className={styles.title}>Fix Profesionales</h1>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Corregir datos</h2>
        <p style={{ marginBottom: '1rem', color: '#94a3b8', lineHeight: 1.6 }}>
          Este proceso:<br />
          1. <strong>Elimina</strong> profesionales que no estén en el PDF del listado MGP 2024<br />
          2. <strong>Limpia</strong> las fotos placeholder que generan imágenes rotas
        </p>

        <button
          className={styles.saveBtn}
          onClick={handleFix}
          disabled={running || done}
          style={{ marginBottom: '1.5rem' }}
        >
          {running ? 'Corrigiendo...' : done ? '✅ Completado' : 'Ejecutar corrección'}
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

'use client';

/**
 * Admin — Diagnóstico de datos en Firestore
 *
 * Compara residencias y profesionales en Firestore contra los mocks
 * para detectar documentos huérfanos o datos sobreescritos.
 */

import { useState } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import { mockResidencias } from '@/data/mock-residencias';
import { mockProfesionales } from '@/data/mock-profesionales';
import styles from '../residencias/form.module.css';

interface DiagItem {
  id: string;
  nombre: string;
  source: 'solo-firestore' | 'solo-mock' | 'ambos';
  imagenPrincipal?: string;
  imagenes?: string[];
}

export default function DiagPage() {
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);

  const addLog = (msg: string) => setLog((prev) => [...prev, msg]);

  const handleDiag = async () => {
    setRunning(true);
    setLog([]);
    addLog('🔍 Diagnóstico de datos...');
    addLog('');

    try {
      // ── Residencias ──
      addLog('═══ RESIDENCIAS ═══');
      const resSlugs = new Set(mockResidencias.map((r) => r.slug));
      const resSnap = await getDocs(collection(db, 'residencias'));

      const fsResIds = new Set<string>();
      const resWithImages: string[] = [];
      const resWithPlaceholder: string[] = [];
      const resOnlyFirestore: string[] = [];

      for (const d of resSnap.docs) {
        fsResIds.add(d.id);
        const data = d.data();
        const img = data.imagenPrincipal || '';

        if (!resSlugs.has(d.id) && !resSlugs.has(data.slug)) {
          resOnlyFirestore.push(`${data.nombre || d.id}`);
        }

        if (img && img.includes('firebasestorage')) {
          resWithImages.push(`${data.nombre}: ${img.substring(0, 80)}...`);
        } else if (img && img.includes('placeholder')) {
          resWithPlaceholder.push(data.nombre || d.id);
        }
      }

      addLog(`📋 En Firestore: ${resSnap.size}`);
      addLog(`📋 En mock: ${mockResidencias.length}`);
      addLog('');

      if (resOnlyFirestore.length > 0) {
        addLog('⚠️ SOLO en Firestore (no están en el mock):');
        resOnlyFirestore.forEach((n) => addLog(`  ❓ ${n}`));
        addLog('');
      } else {
        addLog('✅ No hay residencias huérfanas en Firestore');
        addLog('');
      }

      if (resWithImages.length > 0) {
        addLog('🖼️ Residencias CON imagen real (Firebase Storage):');
        resWithImages.forEach((n) => addLog(`  ✅ ${n}`));
        addLog('');
      }

      addLog(`🖼️ Residencias con placeholder (sin imagen real): ${resWithPlaceholder.length}`);
      addLog('');

      // ── Profesionales ──
      addLog('═══ PROFESIONALES ═══');
      const profSlugs = new Set(mockProfesionales.map((p) => p.slug));
      const profSnap = await getDocs(collection(db, 'profesionales'));

      const profOnlyFirestore: string[] = [];

      for (const d of profSnap.docs) {
        const data = d.data();
        if (!profSlugs.has(d.id) && !profSlugs.has(data.slug)) {
          profOnlyFirestore.push(`${data.nombre || d.id}`);
        }
      }

      addLog(`📋 En Firestore: ${profSnap.size}`);
      addLog(`📋 En mock (PDF): ${mockProfesionales.length}`);
      addLog('');

      if (profOnlyFirestore.length > 0) {
        addLog('⚠️ SOLO en Firestore (no están en el PDF):');
        profOnlyFirestore.forEach((n) => addLog(`  ❓ ${n}`));
      } else {
        addLog('✅ No hay profesionales huérfanos en Firestore');
      }

      addLog('');
      addLog('🎉 Diagnóstico completado.');

    } catch (err) {
      addLog(`❌ Error: ${err}`);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <Link href="/admin" className={styles.backBtn}>←</Link>
        <h1 className={styles.title}>Diagnóstico de datos</h1>
      </div>

      <div className={styles.section}>
        <h2 className={styles.sectionTitle}>Comparar Firestore vs Mock</h2>
        <p style={{ marginBottom: '1rem', color: '#94a3b8', lineHeight: 1.6 }}>
          Detecta documentos huérfanos, imágenes perdidas y datos inconsistentes.
        </p>

        <button
          className={styles.saveBtn}
          onClick={handleDiag}
          disabled={running}
          style={{ marginBottom: '1.5rem' }}
        >
          {running ? 'Analizando...' : 'Ejecutar diagnóstico'}
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

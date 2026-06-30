'use client';

/**
 * Admin — One-time geocoding apply (TEMPORARY).
 *
 * Writes precomputed coordinates (geocoded from each residencia's address via
 * OpenStreetMap/Nominatim) into Firestore. Runs as the logged-in admin so the
 * writes pass firestore.rules. Remove this page once it has been run.
 */

import { useState } from 'react';
import Link from 'next/link';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/services/firebase/config';

/* Precomputed: residencia doc id -> coordinates (lat/lng) */
const COORDS: Record<string, { lat: number; lng: number }> = {
  'bizkaia-residencia': { lat: -38.0063681, lng: -57.5565407 },
  casagrande: { lat: -37.9931981, lng: -57.5505717 },
  casalia: { lat: -38.0922369, lng: -57.5543932 },
  convivencias: { lat: -38.0118527, lng: -57.5493624 },
  'dos-valles': { lat: -37.9859761, lng: -57.5510767 },
  'en-familia': { lat: -37.9527756, lng: -57.5688331 },
  'flor-de-liz': { lat: -38.006279, lng: -57.5522923 },
  gema: { lat: -37.9867456, lng: -57.5549891 },
  'hogar-ipanema': { lat: -37.9906003, lng: -57.5487403 },
  'hogar-mi-bien-estar': { lat: -38.0159928, lng: -57.5697892 },
  'hogar-santisima-trinidad': { lat: -37.9598203, lng: -57.561594 },
  irala: { lat: -38.0325245, lng: -57.565892 },
  'jose-ignacio': { lat: -37.9874415, lng: -57.5513449 },
  'las-lilas': { lat: -37.9883609, lng: -57.5572573 },
  'los-alerces': { lat: -38.0181738, lng: -57.556754 },
  'los-alerces-alberti': { lat: -38.0142218, lng: -57.538113 },
  'los-alerces-paso-y-san-luis': { lat: -38.0186313, lng: -57.5645131 },
  'los-alerces-saavedra': { lat: -38.015829, lng: -57.5570358 },
  'los-reyes': { lat: -38.0093009, lng: -57.5429102 },
  'mi-casa': { lat: -38.0133195, lng: -57.5531091 },
  'residencia-casabella': { lat: -37.960835, lng: -57.5595859 },
  'residencia-eva-peron': { lat: -38.0341958, lng: -57.5582546 },
  'residencia-los-milagros': { lat: -38.0113345, lng: -57.546063 },
  'rincon-de-lila': { lat: -37.9508407, lng: -57.5850786 },
  'sagrada-familia': { lat: -37.9908269, lng: -57.5515679 },
  'villa-chauvin': { lat: -38.0209169, lng: -57.565905 },
  'villa-chauvin-suites': { lat: -38.0203692, lng: -57.5657688 },
  'las-moras': { lat: -38.016853, lng: -57.550001 },
};

export default function GeoApplyPage() {
  const [log, setLog] = useState<string[]>([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const addLog = (msg: string) => setLog((prev) => [...prev, msg]);

  const apply = async () => {
    setRunning(true);
    setLog([]);
    setDone(false);
    const entries = Object.entries(COORDS);
    let ok = 0;
    let fail = 0;
    addLog(`Aplicando ${entries.length} ubicaciones...`);
    for (const [id, coord] of entries) {
      try {
        await updateDoc(doc(db, 'residencias', id), {
          coordenadas: coord,
          updatedAt: serverTimestamp(),
        });
        ok++;
        addLog(`✓ ${id}`);
      } catch (err) {
        fail++;
        addLog(`✗ ${id} — ${(err as Error).message}`);
      }
    }
    addLog(`\nListo: ${ok} aplicadas, ${fail} con error.`);
    setDone(true);
    setRunning(false);
  };

  return (
    <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem' }}>
      <Link href="/admin" style={{ color: 'var(--color-primary)' }}>
        ← Volver al panel
      </Link>
      <h1 style={{ marginTop: '1rem' }}>Aplicar ubicaciones (herramienta temporal)</h1>
      <p style={{ color: 'var(--color-text-muted)' }}>
        Carga las coordenadas geocodificadas de {Object.keys(COORDS).length} residencias.
        Es seguro ejecutarlo más de una vez. Después de usarlo, esta página se elimina.
      </p>

      <button
        onClick={apply}
        disabled={running}
        style={{
          background: running ? 'var(--color-neutral-400)' : 'var(--color-primary)',
          color: '#fff',
          border: 'none',
          borderRadius: 10,
          padding: '0.8rem 1.4rem',
          fontSize: '1rem',
          fontWeight: 600,
          cursor: running ? 'default' : 'pointer',
          marginTop: '1rem',
        }}
      >
        {running ? 'Aplicando…' : done ? 'Volver a aplicar' : `Aplicar ${Object.keys(COORDS).length} ubicaciones`}
      </button>

      {log.length > 0 && (
        <pre
          style={{
            marginTop: '1.5rem',
            background: 'var(--color-neutral-100)',
            padding: '1rem',
            borderRadius: 10,
            fontSize: '0.85rem',
            whiteSpace: 'pre-wrap',
            maxHeight: 360,
            overflow: 'auto',
          }}
        >
          {log.join('\n')}
        </pre>
      )}
    </div>
  );
}

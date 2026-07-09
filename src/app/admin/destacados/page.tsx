'use client';

/**
 * Admin — Featured residencias manager.
 *
 * One place to set each residencia's featured level:
 *   Normal · Destacada · Súper destacada (premium).
 * Súper appears first (home + listing) with a distinctive frame.
 */

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import type { Residencia } from '@/types/residencia';
import { getResidencias, updateResidencia } from '@/services/admin.service';
import styles from './page.module.css';

type Nivel = 'normal' | 'destacada' | 'super';

function nivelDe(r: Residencia): Nivel {
  if (r.superDestacada) return 'super';
  if (r.destacada) return 'destacada';
  return 'normal';
}

const FLAGS: Record<Nivel, { destacada: boolean; superDestacada: boolean }> = {
  normal: { destacada: false, superDestacada: false },
  destacada: { destacada: true, superDestacada: false },
  super: { destacada: true, superDestacada: true },
};

export default function AdminDestacadosPage() {
  const [residencias, setResidencias] = useState<Residencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getResidencias();
    // Super first, then destacada, then the rest — same order as the site
    const rank = (r: Residencia) => (r.superDestacada ? 0 : r.destacada ? 1 : 2);
    data.sort((a, b) => rank(a) - rank(b) || a.nombre.localeCompare(b.nombre, 'es'));
    setResidencias(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const setNivel = async (r: Residencia, nivel: Nivel) => {
    if (nivelDe(r) === nivel) return;
    setBusyId(r.id);
    const flags = FLAGS[nivel];
    try {
      await updateResidencia(r.id, flags);
      setResidencias((prev) =>
        prev.map((x) => (x.id === r.id ? { ...x, ...flags } : x)),
      );
    } finally {
      setBusyId(null);
    }
  };

  const superCount = residencias.filter((r) => r.superDestacada).length;
  const destCount = residencias.filter((r) => r.destacada && !r.superDestacada).length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Residencias destacadas</h1>
        <p className={styles.intro}>
          Elegí el nivel de cada residencia. Las <strong>Destacadas</strong> se muestran arriba en
          el home y el listado. Las <strong>Súper destacadas</strong> (premium) aparecen primeras y
          con un marco dorado distintivo. La foto de cada una se cambia desde su ficha (Editar).
          {!loading && (
            <> Actualmente: {superCount} súper · {destCount} destacadas.</>
          )}
        </p>
      </header>

      {loading && <div className={styles.loading}>Cargando residencias…</div>}

      {!loading && (
        <div className={styles.list}>
          {residencias.map((r) => {
            const nivel = nivelDe(r);
            const busy = busyId === r.id;
            return (
              <div key={r.id} className={`${styles.row} ${nivel === 'super' ? styles.rowSuper : ''}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.thumb}
                  src={r.imagenPrincipal || '/icons/icon-192x192.png'}
                  alt={r.nombre}
                  loading="lazy"
                />
                <div className={styles.info}>
                  <p className={styles.nombre}>{r.nombre}</p>
                  <p className={styles.barrio}>
                    {r.barrio || 'Sin barrio'} ·{' '}
                    <Link href={`/admin/residencias/${r.id}`} className={styles.editLink}>
                      Editar ficha / foto
                    </Link>
                  </p>
                </div>
                <div className={styles.segment} role="group" aria-label={`Nivel de ${r.nombre}`}>
                  <button
                    className={`${styles.segBtn} ${nivel === 'normal' ? styles.segActiveNormal : ''}`}
                    onClick={() => setNivel(r, 'normal')}
                    disabled={busy}
                  >
                    Normal
                  </button>
                  <button
                    className={`${styles.segBtn} ${nivel === 'destacada' ? styles.segActiveDestacada : ''}`}
                    onClick={() => setNivel(r, 'destacada')}
                    disabled={busy}
                  >
                    Destacada
                  </button>
                  <button
                    className={`${styles.segBtn} ${nivel === 'super' ? styles.segActiveSuper : ''}`}
                    onClick={() => setNivel(r, 'super')}
                    disabled={busy}
                  >
                    ⭐ Súper
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

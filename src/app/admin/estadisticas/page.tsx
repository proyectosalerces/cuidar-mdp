'use client';

/**
 * Admin — Estadísticas de contacto.
 *
 * Muestra cómo los usuarios usan los links de contacto: total por período,
 * desglose por canal y ranking de residencias/profesionales más contactados.
 * Datos anónimos (colección `clicks`).
 */

import { useEffect, useState, useMemo, useCallback } from 'react';
import type { ClickEvento, CanalClick } from '@/types/click';
import { CANAL_LABELS } from '@/types/click';
import { getClicks } from '@/services/clicks.service';
import styles from './page.module.css';

type Periodo = 7 | 30 | 0; // 0 = todo

interface Fila {
  key: string;
  nombre: string;
  tipo: string;
  total: number;
  porCanal: Partial<Record<CanalClick, number>>;
}

const TIPO_LABEL: Record<string, string> = {
  residencia: 'Residencia',
  profesional: 'Profesional',
  general: 'General',
};

export default function AdminEstadisticasPage() {
  const [clicks, setClicks] = useState<ClickEvento[]>([]);
  const [loading, setLoading] = useState(true);
  const [periodo, setPeriodo] = useState<Periodo>(30);

  const load = useCallback(async () => {
    setLoading(true);
    setClicks(await getClicks());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtrados = useMemo(() => {
    if (periodo === 0) return clicks;
    const desde = Date.now() - periodo * 24 * 60 * 60 * 1000;
    return clicks.filter((c) => {
      const t = new Date(c.fecha).getTime();
      return !isNaN(t) && t >= desde;
    });
  }, [clicks, periodo]);

  const porCanal = useMemo(() => {
    const acc: Partial<Record<CanalClick, number>> = {};
    for (const c of filtrados) acc[c.canal] = (acc[c.canal] ?? 0) + 1;
    return acc;
  }, [filtrados]);

  const ranking = useMemo(() => {
    const map = new Map<string, Fila>();
    for (const c of filtrados) {
      const key = `${c.entidadTipo}:${c.entidadId}`;
      const fila = map.get(key) ?? {
        key,
        nombre: c.entidadNombre || c.entidadId,
        tipo: c.entidadTipo,
        total: 0,
        porCanal: {},
      };
      fila.total += 1;
      fila.porCanal[c.canal] = (fila.porCanal[c.canal] ?? 0) + 1;
      map.set(key, fila);
    }
    return [...map.values()].sort((a, b) => b.total - a.total);
  }, [filtrados]);

  const canalesOrden = (Object.keys(CANAL_LABELS) as CanalClick[]).filter((c) => porCanal[c]);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Estadísticas de contacto</h1>
        <p className={styles.intro}>
          Cómo usan las familias los links del sitio para contactar. Datos anónimos: se cuenta qué
          link se toca y hacia qué ficha (sin datos personales del visitante).
        </p>
      </header>

      <div className={styles.periodo} role="group" aria-label="Período">
        {([7, 30, 0] as Periodo[]).map((p) => (
          <button
            key={p}
            className={`${styles.periodoBtn} ${periodo === p ? styles.periodoBtnActive : ''}`}
            onClick={() => setPeriodo(p)}
          >
            {p === 0 ? 'Todo' : `Últimos ${p} días`}
          </button>
        ))}
      </div>

      {loading && <div className={styles.loading}>Cargando estadísticas…</div>}

      {!loading && filtrados.length === 0 && (
        <div className={styles.empty}>
          Todavía no hay clics registrados en este período. A medida que las familias usen los links
          de contacto, van a aparecer acá.
        </div>
      )}

      {!loading && filtrados.length > 0 && (
        <>
          {/* Summary */}
          <div className={styles.summary}>
            <div className={styles.stat}>
              <div className={styles.statValue}>{filtrados.length}</div>
              <div className={styles.statLabel}>Contactos totales</div>
            </div>
            {canalesOrden.map((c) => (
              <div key={c} className={styles.stat}>
                <div className={styles.statValue}>{porCanal[c]}</div>
                <div className={styles.statLabel}>{CANAL_LABELS[c]}</div>
              </div>
            ))}
          </div>

          {/* Ranking */}
          <h2 className={styles.sectionTitle}>Ranking de más contactados</h2>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ficha</th>
                <th>Canales</th>
                <th style={{ textAlign: 'right' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((f) => (
                <tr key={f.key}>
                  <td>
                    {f.nombre}
                    <div className={styles.tipoTag}>{TIPO_LABEL[f.tipo] ?? f.tipo}</div>
                  </td>
                  <td>
                    <div className={styles.canales}>
                      {(Object.keys(f.porCanal) as CanalClick[]).map((c) => (
                        <span key={c} className={styles.canalChip}>
                          {CANAL_LABELS[c]}: {f.porCanal[c]}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className={styles.totalCell}>{f.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}

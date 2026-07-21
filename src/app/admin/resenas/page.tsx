'use client';

/**
 * Admin — Reviews / family experiences moderation.
 *
 * Lists every review (approved + pending), resolves the institution name,
 * shows the per-aspect breakdown, and lets the admin approve/hide, edit
 * (comment + per-aspect scores) or delete each one.
 */

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import type { Resena } from '@/types/resena';
import { getAspectos, promedioAspectos } from '@/types/resena';
import {
  getAllResenas,
  setResenaAprobada,
  updateResena,
  deleteResena,
} from '@/services/resenas.service';
import { getResidencias, getProfesionales } from '@/services/admin.service';
import StarRatingInput from '@/components/resenas/StarRatingInput/StarRatingInput';
import styles from './page.module.css';

function formatFecha(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es-AR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '';
  }
}

export default function AdminResenasPage() {
  const [resenas, setResenas] = useState<Resena[]>([]);
  const [nombres, setNombres] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editComentario, setEditComentario] = useState('');
  const [editAspectos, setEditAspectos] = useState<Record<string, number>>({});
  const [filtro, setFiltro] = useState('');
  const [estadoFiltro, setEstadoFiltro] = useState<'todas' | 'pendiente' | 'publicada'>('todas');

  const load = useCallback(async () => {
    setLoading(true);
    const [data, residencias, profesionales] = await Promise.all([
      getAllResenas(),
      getResidencias(),
      getProfesionales(),
    ]);
    const map: Record<string, string> = {};
    residencias.forEach((r) => { map[`residencia:${r.id}`] = r.nombre; });
    profesionales.forEach((p) => { map[`profesional:${p.id}`] = p.nombre; });
    setNombres(map);
    setResenas(data);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const nombreEntidad = (r: Resena) =>
    nombres[`${r.entidadTipo}:${r.entidadId}`] ?? `${r.entidadId} (no encontrada)`;

  const toggleAprobada = async (r: Resena) => {
    setBusyId(r.id);
    try {
      await setResenaAprobada(r.id, !r.aprobada);
      setResenas((prev) => prev.map((x) => (x.id === r.id ? { ...x, aprobada: !r.aprobada } : x)));
    } finally {
      setBusyId(null);
    }
  };

  const startEdit = (r: Resena) => {
    setEditId(r.id);
    setEditTitulo(r.titulo);
    setEditComentario(r.comentario);
    setEditAspectos({ ...(r.calificaciones ?? {}) });
  };

  const saveEdit = async (r: Resena) => {
    setBusyId(r.id);
    try {
      const rated = Object.fromEntries(
        Object.entries(editAspectos).filter(([, v]) => v > 0),
      );
      const prom = promedioAspectos(editAspectos);
      const calificacion = prom > 0 ? prom : r.calificacion;
      await updateResena(r.id, {
        titulo: editTitulo.trim(),
        comentario: editComentario.trim(),
        calificaciones: rated,
        calificacion,
      });
      setResenas((prev) =>
        prev.map((x) =>
          x.id === r.id
            ? { ...x, titulo: editTitulo.trim(), comentario: editComentario.trim(), calificaciones: rated, calificacion }
            : x,
        ),
      );
      setEditId(null);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (r: Resena) => {
    if (!window.confirm(`¿Eliminar definitivamente la reseña de ${r.autorNombre}? Esta acción no se puede deshacer.`)) return;
    setBusyId(r.id);
    try {
      await deleteResena(r.id);
      setResenas((prev) => prev.filter((x) => x.id !== r.id));
    } finally {
      setBusyId(null);
    }
  };

  const pendientes = resenas.filter((r) => !r.aprobada).length;

  const visibles = resenas.filter((r) => {
    if (estadoFiltro === 'pendiente' && r.aprobada) return false;
    if (estadoFiltro === 'publicada' && !r.aprobada) return false;
    if (filtro.trim()) {
      const q = filtro.toLowerCase();
      const nombre = nombreEntidad(r).toLowerCase();
      if (!nombre.includes(q) && !(r.autorNombre ?? '').toLowerCase().includes(q)) return false;
    }
    return true;
  });

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Reseñas y experiencias</h1>
        <p className={styles.intro}>
          Acá ves todas las reseñas que dejan las familias. Las nuevas llegan como{' '}
          <strong>pendientes</strong> y no se muestran en el sitio hasta que las aprobás.
          {resenas.length > 0 && (
            <> Hay <strong>{pendientes}</strong> pendiente(s) de {resenas.length} en total.</>
          )}
        </p>
      </header>

      {!loading && resenas.length > 0 && (
        <div className={styles.filtros}>
          <input
            className={styles.filtroInput}
            placeholder="Buscar por residencia, profesional o autor…"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <div className={styles.filtroEstado}>
            {(['todas', 'pendiente', 'publicada'] as const).map((op) => (
              <button
                key={op}
                type="button"
                className={`${styles.filtroBtn} ${estadoFiltro === op ? styles.filtroBtnActive : ''}`}
                onClick={() => setEstadoFiltro(op)}
              >
                {op === 'todas' ? 'Todas' : op === 'pendiente' ? 'Pendientes' : 'Publicadas'}
              </button>
            ))}
          </div>
        </div>
      )}

      {loading && <div className={styles.loading}>Cargando reseñas…</div>}

      {!loading && resenas.length === 0 && (
        <div className={styles.empty}>
          Todavía no hay reseñas. Cuando una familia deje su experiencia, va a aparecer acá.
        </div>
      )}

      {!loading && resenas.length > 0 && visibles.length === 0 && (
        <div className={styles.empty}>No hay reseñas que coincidan con el filtro.</div>
      )}

      {!loading && visibles.length > 0 && (
        <div className={styles.list}>
          {visibles.map((r) => {
            const editing = editId === r.id;
            const busy = busyId === r.id;
            const entidadHref =
              r.entidadTipo === 'residencia'
                ? `/residencias/${r.entidadId}`
                : `/profesionales/${r.entidadId}`;
            const aspectosDefs = getAspectos(r.entidadTipo);
            const breakdown = aspectosDefs.filter((d) => (r.calificaciones?.[d.key] ?? 0) > 0);

            return (
              <article key={r.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span className={`${styles.badge} ${r.aprobada ? styles.badgePublicada : styles.badgePendiente}`}>
                    {r.aprobada ? 'Publicada' : 'Pendiente'}
                  </span>
                  <Link href={entidadHref} className={styles.entidad} target="_blank">
                    {r.entidadTipo === 'residencia' ? '🏠' : '👨‍⚕️'} {nombreEntidad(r)}
                  </Link>
                  <span className={styles.fecha}>{formatFecha(r.fecha)}</span>
                </div>

                <div className={styles.stars} aria-label={`${r.calificacion.toFixed(1)} de 5`}>
                  {'★'.repeat(Math.round(r.calificacion))}
                  {'☆'.repeat(5 - Math.round(r.calificacion))}
                  <span className={styles.starsNum}>{r.calificacion.toFixed(1)}</span>
                </div>

                {editing ? (
                  <>
                    <input
                      className={styles.editInput}
                      value={editTitulo}
                      onChange={(e) => setEditTitulo(e.target.value)}
                      placeholder="Título"
                    />
                    <textarea
                      className={styles.editTextarea}
                      value={editComentario}
                      onChange={(e) => setEditComentario(e.target.value)}
                      placeholder="Comentario"
                    />
                    <div className={styles.editAspectos}>
                      <p className={styles.editAspectosTitle}>Puntuación por aspecto</p>
                      {aspectosDefs.map((d) => (
                        <div key={d.key} className={styles.editAspectRow}>
                          <span>{d.label}</span>
                          <StarRatingInput
                            value={editAspectos[d.key] ?? 0}
                            onChange={(v) => setEditAspectos((prev) => ({ ...prev, [d.key]: v }))}
                            size="sm"
                          />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    {r.titulo && <p className={styles.reseñaTitulo}>{r.titulo}</p>}
                    <p className={styles.comentario}>{r.comentario}</p>
                    {breakdown.length > 0 && (
                      <div className={styles.breakdown}>
                        {breakdown.map((d) => (
                          <span key={d.key} className={styles.breakdownItem}>
                            {d.label}: <strong>{Math.round(r.calificaciones![d.key])}★</strong>
                          </span>
                        ))}
                      </div>
                    )}
                  </>
                )}

                <p className={styles.autor}>
                  Por {r.autorNombre}{r.autorEmail ? ` · ${r.autorEmail}` : ''}
                </p>

                <div className={styles.actions}>
                  {editing ? (
                    <>
                      <button className={`${styles.btn} ${styles.btnApprove}`} onClick={() => saveEdit(r)} disabled={busy}>
                        {busy ? 'Guardando…' : 'Guardar cambios'}
                      </button>
                      <button className={`${styles.btn} ${styles.btnEdit}`} onClick={() => setEditId(null)} disabled={busy}>
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className={`${styles.btn} ${r.aprobada ? styles.btnHide : styles.btnApprove}`}
                        onClick={() => toggleAprobada(r)}
                        disabled={busy}
                      >
                        {r.aprobada ? 'Ocultar del sitio' : 'Aprobar y publicar'}
                      </button>
                      <button className={`${styles.btn} ${styles.btnEdit}`} onClick={() => startEdit(r)} disabled={busy}>
                        Editar
                      </button>
                      <button className={`${styles.btn} ${styles.btnDelete}`} onClick={() => remove(r)} disabled={busy}>
                        Eliminar
                      </button>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

'use client';

/**
 * Admin — Reviews / family experiences moderation.
 *
 * Lists every review (approved + pending) and lets the admin approve/hide,
 * edit, or delete each one. New reviews arrive with `aprobada: false` and are
 * invisible on the public site until approved here.
 */

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import type { Resena } from '@/types/resena';
import {
  getAllResenas,
  setResenaAprobada,
  updateResena,
  deleteResena,
} from '@/services/resenas.service';
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
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [editId, setEditId] = useState<string | null>(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editComentario, setEditComentario] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    const data = await getAllResenas();
    setResenas(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleAprobada = async (r: Resena) => {
    setBusyId(r.id);
    try {
      await setResenaAprobada(r.id, !r.aprobada);
      setResenas((prev) =>
        prev.map((x) => (x.id === r.id ? { ...x, aprobada: !r.aprobada } : x)),
      );
    } finally {
      setBusyId(null);
    }
  };

  const startEdit = (r: Resena) => {
    setEditId(r.id);
    setEditTitulo(r.titulo);
    setEditComentario(r.comentario);
  };

  const saveEdit = async (r: Resena) => {
    setBusyId(r.id);
    try {
      await updateResena(r.id, {
        titulo: editTitulo.trim(),
        comentario: editComentario.trim(),
      });
      setResenas((prev) =>
        prev.map((x) =>
          x.id === r.id
            ? { ...x, titulo: editTitulo.trim(), comentario: editComentario.trim() }
            : x,
        ),
      );
      setEditId(null);
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (r: Resena) => {
    if (!window.confirm(`¿Eliminar definitivamente la reseña de ${r.autorNombre}? Esta acción no se puede deshacer.`)) {
      return;
    }
    setBusyId(r.id);
    try {
      await deleteResena(r.id);
      setResenas((prev) => prev.filter((x) => x.id !== r.id));
    } finally {
      setBusyId(null);
    }
  };

  const pendientes = resenas.filter((r) => !r.aprobada).length;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Reseñas y experiencias</h1>
        <p className={styles.intro}>
          Acá ves todas las reseñas que dejan las familias. Las nuevas llegan como{' '}
          <strong>pendientes</strong> y no se muestran en el sitio hasta que las aprobás.
          {resenas.length > 0 && (
            <> Actualmente hay <strong>{pendientes}</strong> pendiente(s) de {resenas.length} en total.</>
          )}
        </p>
      </header>

      {loading && <div className={styles.loading}>Cargando reseñas…</div>}

      {!loading && resenas.length === 0 && (
        <div className={styles.empty}>
          Todavía no hay reseñas. Cuando una familia deje su experiencia, va a aparecer acá para que la revises.
        </div>
      )}

      {!loading && resenas.length > 0 && (
        <div className={styles.list}>
          {resenas.map((r) => {
            const editing = editId === r.id;
            const busy = busyId === r.id;
            const entidadHref =
              r.entidadTipo === 'residencia'
                ? `/residencias/${r.entidadId}`
                : `/profesionales/${r.entidadId}`;
            return (
              <article key={r.id} className={styles.card}>
                <div className={styles.cardTop}>
                  <span
                    className={`${styles.badge} ${r.aprobada ? styles.badgePublicada : styles.badgePendiente}`}
                  >
                    {r.aprobada ? 'Publicada' : 'Pendiente'}
                  </span>
                  <Link href={entidadHref} className={styles.entidad} target="_blank">
                    {r.entidadTipo === 'residencia' ? '🏠' : '👨‍⚕️'} {r.entidadId}
                  </Link>
                  <span className={styles.fecha}>{formatFecha(r.fecha)}</span>
                </div>

                <div className={styles.stars} aria-label={`${r.calificacion} de 5`}>
                  {'★'.repeat(Math.round(r.calificacion))}
                  {'☆'.repeat(5 - Math.round(r.calificacion))}
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
                  </>
                ) : (
                  <>
                    {r.titulo && <p className={styles.reseñaTitulo}>{r.titulo}</p>}
                    <p className={styles.comentario}>{r.comentario}</p>
                  </>
                )}

                <p className={styles.autor}>
                  Por {r.autorNombre}
                  {r.autorEmail ? ` · ${r.autorEmail}` : ''}
                </p>

                <div className={styles.actions}>
                  {editing ? (
                    <>
                      <button
                        className={`${styles.btn} ${styles.btnApprove}`}
                        onClick={() => saveEdit(r)}
                        disabled={busy}
                      >
                        {busy ? 'Guardando…' : 'Guardar cambios'}
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btnEdit}`}
                        onClick={() => setEditId(null)}
                        disabled={busy}
                      >
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
                      <button
                        className={`${styles.btn} ${styles.btnEdit}`}
                        onClick={() => startEdit(r)}
                        disabled={busy}
                      >
                        Editar
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btnDelete}`}
                        onClick={() => remove(r)}
                        disabled={busy}
                      >
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

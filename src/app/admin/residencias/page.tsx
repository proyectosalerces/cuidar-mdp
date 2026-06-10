'use client';

/**
 * Admin — Residencias list page
 */

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import type { Residencia } from '@/types/residencia';
import {
  getResidencias,
  deleteResidencia,
  updateResidencia,
} from '@/services/admin.service';
import styles from './page.module.css';

export default function AdminResidenciasPage() {
  const [residencias, setResidencias] = useState<Residencia[]>([]);
  const [filtered, setFiltered] = useState<Residencia[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Residencia | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await getResidencias();
      setResidencias(data);
      setFiltered(data);
    } catch (err) {
      console.error('Error fetching residencias:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  /* Search filter */
  useEffect(() => {
    if (!search.trim()) {
      setFiltered(residencias);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      residencias.filter(
        (r) =>
          r.nombre.toLowerCase().includes(q) ||
          r.direccion.toLowerCase().includes(q) ||
          r.barrio.toLowerCase().includes(q),
      ),
    );
  }, [search, residencias]);

  /* Show toast */
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* Toggle destacada */
  const handleToggleDestacada = async (r: Residencia) => {
    try {
      await updateResidencia(r.id, { destacada: !r.destacada });
      setResidencias((prev) =>
        prev.map((item) =>
          item.id === r.id ? { ...item, destacada: !item.destacada } : item,
        ),
      );
      showToast('Residencia actualizada', 'success');
    } catch {
      showToast('Error al actualizar', 'error');
    }
  };

  /* Toggle activa */
  const handleToggleActiva = async (r: Residencia) => {
    try {
      await updateResidencia(r.id, { activa: !r.activa });
      setResidencias((prev) =>
        prev.map((item) =>
          item.id === r.id ? { ...item, activa: !item.activa } : item,
        ),
      );
      showToast('Residencia actualizada', 'success');
    } catch {
      showToast('Error al actualizar', 'error');
    }
  };

  /* Delete */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteResidencia(deleteTarget.id);
      setResidencias((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      showToast('Residencia eliminada', 'success');
    } catch {
      showToast('Error al eliminar', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Residencias</h1>
        <Link href="/admin/residencias/nueva" className={styles.addBtn}>
          + Agregar nueva
        </Link>
      </div>

      {/* Search */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Buscar por nombre, dirección o barrio..."
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      {loading ? (
        <div className={styles.empty}>
          <p>Cargando...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🏠</div>
          <p>No se encontraron residencias</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Dirección</th>
                <th>Teléfono</th>
                <th>Rating</th>
                <th>Destacada</th>
                <th>Activa</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r) => (
                <tr key={r.id}>
                  <td>
                    <strong>{r.nombre}</strong>
                  </td>
                  <td>{r.direccion}</td>
                  <td>{r.telefono}</td>
                  <td>
                    <span className={styles.rating}>
                      ⭐ {r.calificacion.toFixed(1)}
                    </span>
                  </td>
                  <td>
                    <label className={styles.toggle}>
                      <input
                        type="checkbox"
                        checked={r.destacada}
                        onChange={() => handleToggleDestacada(r)}
                      />
                      <span className={styles.toggleSlider} />
                    </label>
                  </td>
                  <td>
                    <label className={styles.toggle}>
                      <input
                        type="checkbox"
                        checked={r.activa}
                        onChange={() => handleToggleActiva(r)}
                      />
                      <span className={styles.toggleSlider} />
                    </label>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link
                        href={`/admin/residencias/${r.id}`}
                        className={styles.editBtn}
                      >
                        Editar
                      </Link>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => setDeleteTarget(r)}
                      >
                        Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deleteTarget && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialog}>
            <h3 className={styles.dialogTitle}>¿Eliminar residencia?</h3>
            <p className={styles.dialogMessage}>
              Estás por eliminar <strong>{deleteTarget.nombre}</strong>. Esta
              acción no se puede deshacer.
            </p>
            <div className={styles.dialogActions}>
              <button
                className={styles.dialogCancel}
                onClick={() => setDeleteTarget(null)}
              >
                Cancelar
              </button>
              <button className={styles.dialogConfirm} onClick={handleDelete}>
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`${styles.toast} ${
            toast.type === 'success' ? styles.toastSuccess : styles.toastError
          }`}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

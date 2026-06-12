'use client';

/**
 * Admin — Profesionales list page
 */

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import type { Profesional } from '@/types/profesional';
import { ESPECIALIDAD_LABELS } from '@/utils/constants';
import type { Especialidad } from '@/types/profesional';
import {
  getProfesionales,
  deleteProfesional,
  updateProfesional,
} from '@/services/admin.service';
import styles from './page.module.css';

export default function AdminProfesionalesPage() {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [filtered, setFiltered] = useState<Profesional[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Profesional | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await getProfesionales();
      setProfesionales(data);
      setFiltered(data);
    } catch (err) {
      console.error('Error fetching profesionales:', err);
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
      setFiltered(profesionales);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      profesionales.filter(
        (p) =>
          p.nombre.toLowerCase().includes(q) ||
          p.especialidad.toLowerCase().includes(q) ||
          (p.email?.toLowerCase().includes(q) ?? false),
      ),
    );
  }, [search, profesionales]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* Toggle activo */
  const handleToggleActivo = async (p: Profesional) => {
    try {
      await updateProfesional(p.id, { activo: !p.activo });
      setProfesionales((prev) =>
        prev.map((item) =>
          item.id === p.id ? { ...item, activo: !item.activo } : item,
        ),
      );
      showToast('Profesional actualizado', 'success');
    } catch {
      showToast('Error al actualizar', 'error');
    }
  };

  /* Delete */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteProfesional(deleteTarget.id);
      setProfesionales((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showToast('Profesional eliminado', 'success');
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
        <h1 className={styles.title}>Profesionales</h1>
        <Link href="/admin/profesionales/nuevo" className={styles.addBtn}>
          + Agregar nuevo
        </Link>
      </div>

      {/* Search */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Buscar por nombre, especialidad o email..."
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
          <div className={styles.emptyIcon}>👨‍⚕️</div>
          <p>No se encontraron profesionales</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Especialidad</th>
                <th>Teléfono</th>
                <th>Rating</th>
                <th>Activo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id}>
                  <td>
                    <div className={styles.nameCell}>
                      {p.foto && !p.foto.includes('placeholder') ? (
                        <img
                          src={p.foto}
                          alt={p.nombre}
                          className={styles.avatar}
                        />
                      ) : (
                        <div className={styles.avatarPlaceholder}>👤</div>
                      )}
                      <strong>{p.nombre}</strong>
                    </div>
                  </td>
                  <td>
                    <span className={styles.badge}>
                      {ESPECIALIDAD_LABELS[p.especialidad as Especialidad] ??
                        p.especialidad}
                    </span>
                  </td>
                  <td>{p.telefono}</td>
                  <td>
                    <span className={styles.rating}>
                      ⭐ {p.calificacion.toFixed(1)}
                    </span>
                  </td>
                  <td>
                    <label className={styles.toggle}>
                      <input
                        type="checkbox"
                        checked={p.activo}
                        onChange={() => handleToggleActivo(p)}
                      />
                      <span className={styles.toggleSlider} />
                    </label>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link
                        href={`/admin/profesionales/${p.id}`}
                        className={styles.editBtn}
                      >
                        Editar
                      </Link>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => setDeleteTarget(p)}
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
            <h3 className={styles.dialogTitle}>¿Eliminar profesional?</h3>
            <p className={styles.dialogMessage}>
              Estás por eliminar a <strong>{deleteTarget.nombre}</strong>. Esta
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

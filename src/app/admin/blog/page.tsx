'use client';

/**
 * Admin — Blog posts list page
 */

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import type { BlogPost } from '@/types/blog';
import {
  getAllBlogPosts,
  deleteBlogPost,
  updateBlogPost,
} from '@/services/admin.service';
import styles from './page.module.css';

const CATEGORIA_LABELS: Record<string, string> = {
  guias: 'Guías',
  salud: 'Salud',
  legal: 'Legal',
  emocional: 'Emocional',
  actividades: 'Actividades',
  nutricion: 'Nutrición',
  noticias: 'Noticias',
};

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [filtered, setFiltered] = useState<BlogPost[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const data = await getAllBlogPosts();
      setPosts(data);
      setFiltered(data);
    } catch (err) {
      console.error('Error fetching blog posts:', err);
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
      setFiltered(posts);
      return;
    }
    const q = search.toLowerCase();
    setFiltered(
      posts.filter(
        (p) =>
          p.titulo.toLowerCase().includes(q) ||
          p.categoria.toLowerCase().includes(q) ||
          p.tags?.some((t) => t.toLowerCase().includes(q)),
      ),
    );
  }, [search, posts]);

  /* Show toast */
  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* Toggle publicado */
  const handleTogglePublicado = async (post: BlogPost) => {
    try {
      await updateBlogPost(post.id, { publicado: !post.publicado });
      setPosts((prev) =>
        prev.map((item) =>
          item.id === post.id ? { ...item, publicado: !item.publicado } : item,
        ),
      );
      showToast('Estado actualizado', 'success');
    } catch {
      showToast('Error al actualizar', 'error');
    }
  };

  /* Delete */
  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBlogPost(deleteTarget.id);
      setPosts((prev) => prev.filter((p) => p.id !== deleteTarget.id));
      showToast('Artículo eliminado', 'success');
    } catch {
      showToast('Error al eliminar', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Blog</h1>
        <Link href="/admin/blog/nuevo" className={styles.addBtn}>
          + Nuevo artículo
        </Link>
      </div>

      {/* Search */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Buscar por título, categoría o tags..."
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
          <div className={styles.emptyIcon}>📝</div>
          <p>No se encontraron artículos</p>
        </div>
      ) : (
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Título</th>
                <th>Categoría</th>
                <th>Fecha</th>
                <th>Publicado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id}>
                  <td>
                    <strong>{post.titulo}</strong>
                  </td>
                  <td>
                    <span className={styles.categoryBadge}>
                      {CATEGORIA_LABELS[post.categoria] ?? post.categoria}
                    </span>
                  </td>
                  <td>{formatDate(post.fechaPublicacion)}</td>
                  <td>
                    <label className={styles.toggle}>
                      <input
                        type="checkbox"
                        checked={post.publicado}
                        onChange={() => handleTogglePublicado(post)}
                      />
                      <span className={styles.toggleSlider} />
                    </label>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className={styles.editBtn}
                      >
                        Editar
                      </Link>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => setDeleteTarget(post)}
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
            <h3 className={styles.dialogTitle}>¿Eliminar artículo?</h3>
            <p className={styles.dialogMessage}>
              Estás por eliminar <strong>{deleteTarget.titulo}</strong>. Esta
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

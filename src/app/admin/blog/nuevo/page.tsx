'use client';

/**
 * Admin — Create new blog post
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { CategoriasBlog } from '@/types/blog';
import { createBlogPost } from '@/services/admin.service';
import styles from '../form.module.css';

const CATEGORIAS: { value: CategoriasBlog; label: string }[] = [
  { value: 'guias', label: 'Guías' },
  { value: 'salud', label: 'Salud' },
  { value: 'legal', label: 'Legal' },
  { value: 'emocional', label: 'Emocional' },
  { value: 'actividades', label: 'Actividades' },
  { value: 'nutricion', label: 'Nutrición' },
  { value: 'noticias', label: 'Noticias' },
];

function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default function NuevoBlogPostPage() {
  const router = useRouter();

  /* Form state */
  const [titulo, setTitulo] = useState('');
  const [categoria, setCategoria] = useState<CategoriasBlog>('guias');
  const [extracto, setExtracto] = useState('');
  const [contenido, setContenido] = useState('');
  const [autorNombre, setAutorNombre] = useState('Equipo Cuidar MdP');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tiempoLectura, setTiempoLectura] = useState('5');
  const [publicado, setPublicado] = useState(false);
  const [imagenPortada, setImagenPortada] = useState('');
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* Tags add/remove */
  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags((prev) => [...prev, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (t: string) => {
    setTags((prev) => prev.filter((item) => item !== t));
  };

  /* Save */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!titulo.trim()) {
      showToast('El título es obligatorio', 'error');
      return;
    }

    setSaving(true);
    try {
      await createBlogPost({
        titulo: titulo.trim(),
        categoria,
        extracto: extracto.trim(),
        contenido: contenido.trim(),
        imagenPortada: imagenPortada.trim(),
        autor: { nombre: autorNombre.trim() || 'Equipo Cuidar MdP' },
        tags,
        tiempoLectura: Number(tiempoLectura) || 5,
        publicado,
        fechaPublicacion: new Date().toISOString(),
      });

      showToast('Artículo creado exitosamente', 'success');
      setTimeout(() => router.push('/admin/blog'), 1500);
    } catch (err) {
      console.error('Error creating blog post:', err);
      showToast('Error al crear el artículo', 'error');
    } finally {
      setSaving(false);
    }
  };

  const slug = generateSlug(titulo);

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/admin/blog" className={styles.backBtn}>
          ←
        </Link>
        <h1 className={styles.title}>Nuevo Artículo</h1>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Información del artículo</h2>
          <div className={styles.grid}>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label}>
                Título<span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                placeholder="Título del artículo"
                required
              />
              {titulo.trim() && (
                <div className={styles.slugPreview}>
                  Slug: <code>{slug}</code>
                </div>
              )}
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Categoría<span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as CategoriasBlog)}
              >
                {CATEGORIAS.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Tiempo de lectura (min)</label>
              <input
                className={styles.input}
                type="number"
                value={tiempoLectura}
                onChange={(e) => setTiempoLectura(e.target.value)}
                min="1"
                max="60"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Autor</label>
              <input
                className={styles.input}
                value={autorNombre}
                onChange={(e) => setAutorNombre(e.target.value)}
                placeholder="Nombre del autor"
              />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Contenido</h2>
          <div className={styles.grid}>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label}>Extracto</label>
              <textarea
                className={styles.textarea}
                value={extracto}
                onChange={(e) => setExtracto(e.target.value)}
                placeholder="Breve descripción del artículo (se muestra en la tarjeta)..."
                maxLength={300}
              />
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label}>
                Contenido (Markdown)
              </label>
              <textarea
                className={`${styles.textarea} ${styles.textareaLarge}`}
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                placeholder="Escribí el contenido del artículo en Markdown..."
              />
            </div>
          </div>
        </div>

        {/* Tags */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Tags</h2>
          <div className={styles.tagsWrapper}>
            <div className={styles.tagInputRow}>
              <input
                className={styles.input}
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="Agregar tag..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
              />
              <button
                type="button"
                className={styles.tagAddBtn}
                onClick={handleAddTag}
              >
                Agregar
              </button>
            </div>
            {tags.length > 0 && (
              <div className={styles.tagsList}>
                {tags.map((t) => (
                  <span key={t} className={styles.tag}>
                    {t}
                    <button
                      type="button"
                      className={styles.tagRemove}
                      onClick={() => handleRemoveTag(t)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Image */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Imagen de portada</h2>
          <div className={styles.field}>
            <label className={styles.label}>URL de la imagen</label>
            <input
              className={styles.input}
              type="url"
              value={imagenPortada}
              onChange={(e) => setImagenPortada(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            <p className={styles.dropHint}>
              Pegá la URL de una imagen de Google Maps, Instagram, o cualquier sitio web
            </p>
          </div>
          {imagenPortada.trim() && (
            <div className={styles.imagePreview} style={{ marginTop: '0.5rem' }}>
              <div className={styles.previewItem}>
                <img
                  src={imagenPortada.trim()}
                  alt="Portada preview"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Estado */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Estado</h2>
          <div className={styles.toggleRow}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={publicado}
                onChange={(e) => setPublicado(e.target.checked)}
              />
              <span className={styles.toggleSlider} />
            </label>
            <span className={styles.toggleLabel}>Publicado</span>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.formActions}>
          <Link href="/admin/blog" className={styles.cancelBtn}>
            Cancelar
          </Link>
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar artículo'}
          </button>
        </div>
      </form>

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

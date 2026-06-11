'use client';

/**
 * Admin — Edit residencia
 */

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { TipoCuidado } from '@/types/residencia';
import {
  BARRIOS_MDP,
  TIPOS_CUIDADO_OPTIONS,
} from '@/utils/constants';
import {
  getResidenciaById,
  updateResidencia,
} from '@/services/admin.service';
import styles from '../form.module.css';

export default function EditResidenciaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();

  /* Form state */
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [barrio, setBarrio] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [facebook, setFacebook] = useState('');
  const [instagram, setInstagram] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [descripcionCorta, setDescripcionCorta] = useState('');
  const [tiposCuidado, setTiposCuidado] = useState<TipoCuidado[]>([]);
  const [servicios, setServicios] = useState<string[]>([]);
  const [servicioInput, setServicioInput] = useState('');
  const [precioDesde, setPrecioDesde] = useState('');
  const [precioHasta, setPrecioHasta] = useState('');
  const [destacada, setDestacada] = useState(false);
  const [activa, setActiva] = useState(true);
  const [imagenPrincipal, setImagenPrincipal] = useState('');
  const [imagenes, setImagenes] = useState<string[]>([]);
  const [imagenInput, setImagenInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* Load existing data */
  useEffect(() => {
    async function loadResidencia() {
      try {
        const data = await getResidenciaById(id);
        if (!data) {
          showToast('Residencia no encontrada', 'error');
          setTimeout(() => router.push('/admin/residencias'), 1500);
          return;
        }
        setNombre(data.nombre);
        setDireccion(data.direccion);
        setBarrio(data.barrio ?? '');
        setTelefono(data.telefono ?? '');
        setEmail(data.email ?? '');
        setWebsite(data.website ?? '');
        setWhatsapp(data.whatsapp ?? '');
        setFacebook(data.facebook ?? '');
        setInstagram(data.instagram ?? '');
        setDescripcion(data.descripcion ?? '');
        setDescripcionCorta(data.descripcionCorta ?? '');
        setTiposCuidado(data.tiposCuidado ?? []);
        setServicios(data.servicios ?? []);
        setPrecioDesde(data.precioDesde?.toString() ?? '');
        setPrecioHasta(data.precioHasta?.toString() ?? '');
        setDestacada(data.destacada ?? false);
        setActiva(data.activa ?? true);
        setImagenPrincipal(data.imagenPrincipal ?? '');
        // Additional images = all images except the principal one
        const extras = (data.imagenes ?? []).filter(
          (img) => img !== (data.imagenPrincipal ?? ''),
        );
        setImagenes(extras);
      } catch (err) {
        console.error('Error loading residencia:', err);
        showToast('Error al cargar los datos', 'error');
      } finally {
        setLoading(false);
      }
    }
    loadResidencia();
  }, [id, router]);

  /* Tipos de cuidado toggle */
  const handleTipoToggle = (tipo: TipoCuidado) => {
    setTiposCuidado((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo],
    );
  };

  /* Servicios */
  const handleAddServicio = () => {
    const trimmed = servicioInput.trim();
    if (trimmed && !servicios.includes(trimmed)) {
      setServicios((prev) => [...prev, trimmed]);
      setServicioInput('');
    }
  };

  const handleRemoveServicio = (s: string) => {
    setServicios((prev) => prev.filter((item) => item !== s));
  };

  /* Imágenes URL add/remove */
  const handleAddImagen = () => {
    const trimmed = imagenInput.trim();
    if (trimmed && !imagenes.includes(trimmed)) {
      setImagenes((prev) => [...prev, trimmed]);
      setImagenInput('');
    }
  };

  const handleRemoveImagen = (url: string) => {
    setImagenes((prev) => prev.filter((item) => item !== url));
  };

  /* Save */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !direccion.trim()) {
      showToast('Nombre y dirección son obligatorios', 'error');
      return;
    }

    setSaving(true);
    try {
      const allImages = [
        ...(imagenPrincipal.trim() ? [imagenPrincipal.trim()] : []),
        ...imagenes,
      ];

      await updateResidencia(id, {
        nombre: nombre.trim(),
        direccion: direccion.trim(),
        barrio,
        telefono: telefono.trim(),
        email: email.trim() || undefined,
        website: website.trim() || undefined,
        whatsapp: whatsapp.trim() || undefined,
        facebook: facebook.trim() || undefined,
        instagram: instagram.trim() || undefined,
        descripcion: descripcion.trim(),
        descripcionCorta: descripcionCorta.trim(),
        tiposCuidado,
        servicios,
        precioDesde: precioDesde ? Number(precioDesde) : undefined,
        precioHasta: precioHasta ? Number(precioHasta) : undefined,
        destacada,
        activa,
        imagenes: allImages,
        imagenPrincipal: imagenPrincipal.trim(),
      });

      showToast('Residencia actualizada', 'success');
      setTimeout(() => router.push('/admin/residencias'), 1500);
    } catch (err) {
      console.error('Error updating residencia:', err);
      showToast('Error al actualizar', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.header}>
          <Link href="/admin/residencias" className={styles.backBtn}>
            ←
          </Link>
          <h1 className={styles.title}>Cargando...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/admin/residencias" className={styles.backBtn}>
          ←
        </Link>
        <h1 className={styles.title}>Editar Residencia</h1>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Basic Info */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Información básica</h2>
          <div className={styles.grid}>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label}>
                Nombre<span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Dirección<span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Barrio</label>
              <select
                className={styles.select}
                value={barrio}
                onChange={(e) => setBarrio(e.target.value)}
              >
                <option value="">Seleccionar barrio</option>
                {BARRIOS_MDP.map((b) => (
                  <option key={b.value} value={b.value}>
                    {b.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Teléfono</label>
              <input
                className={styles.input}
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Sitio web</label>
              <input
                className={styles.input}
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>WhatsApp</label>
              <input
                className={styles.input}
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Facebook</label>
              <input
                className={styles.input}
                type="url"
                value={facebook}
                onChange={(e) => setFacebook(e.target.value)}
                placeholder="https://facebook.com/..."
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Instagram</label>
              <input
                className={styles.input}
                type="url"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                placeholder="https://instagram.com/..."
              />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Descripción</h2>
          <div className={styles.grid}>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label}>Descripción corta</label>
              <input
                className={styles.input}
                value={descripcionCorta}
                onChange={(e) => setDescripcionCorta(e.target.value)}
                maxLength={160}
              />
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label}>Descripción completa</label>
              <textarea
                className={styles.textarea}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Care Types */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Tipos de cuidado</h2>
          <div className={styles.checkboxGroup}>
            {TIPOS_CUIDADO_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`${styles.checkboxLabel} ${
                  tiposCuidado.includes(opt.value as TipoCuidado)
                    ? styles.checkboxChecked
                    : ''
                }`}
              >
                <input
                  type="checkbox"
                  checked={tiposCuidado.includes(opt.value as TipoCuidado)}
                  onChange={() => handleTipoToggle(opt.value as TipoCuidado)}
                />
                {opt.label}
              </label>
            ))}
          </div>
        </div>

        {/* Services */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Servicios</h2>
          <div className={styles.tagsWrapper}>
            <div className={styles.tagInputRow}>
              <input
                className={styles.input}
                value={servicioInput}
                onChange={(e) => setServicioInput(e.target.value)}
                placeholder="Agregar servicio..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddServicio();
                  }
                }}
              />
              <button
                type="button"
                className={styles.tagAddBtn}
                onClick={handleAddServicio}
              >
                Agregar
              </button>
            </div>
            {servicios.length > 0 && (
              <div className={styles.tagsList}>
                {servicios.map((s) => (
                  <span key={s} className={styles.tag}>
                    {s}
                    <button
                      type="button"
                      className={styles.tagRemove}
                      onClick={() => handleRemoveServicio(s)}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Pricing */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Precios</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>Precio desde ($)</label>
              <input
                className={styles.input}
                type="number"
                value={precioDesde}
                onChange={(e) => setPrecioDesde(e.target.value)}
                min="0"
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Precio hasta ($)</label>
              <input
                className={styles.input}
                type="number"
                value={precioHasta}
                onChange={(e) => setPrecioHasta(e.target.value)}
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Imágenes</h2>
          <p className={styles.dropHint} style={{ marginBottom: '0.75rem' }}>
            Pegá la URL de una imagen de Google Maps, Instagram, o cualquier sitio web
          </p>

          {/* Imagen principal */}
          <div className={styles.field} style={{ marginBottom: '1rem' }}>
            <label className={styles.label}>Imagen principal (URL)</label>
            <input
              className={styles.input}
              type="url"
              value={imagenPrincipal}
              onChange={(e) => setImagenPrincipal(e.target.value)}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {imagenPrincipal.trim() && (
              <div className={styles.imagePreview} style={{ marginTop: '0.5rem' }}>
                <div className={styles.previewItem}>
                  <img
                    src={imagenPrincipal.trim()}
                    alt="Imagen principal"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Imágenes adicionales */}
          <div className={styles.tagsWrapper}>
            <label className={styles.label}>Imágenes adicionales (URLs)</label>
            <div className={styles.tagInputRow}>
              <input
                className={styles.input}
                type="url"
                value={imagenInput}
                onChange={(e) => setImagenInput(e.target.value)}
                placeholder="https://ejemplo.com/imagen.jpg"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddImagen();
                  }
                }}
              />
              <button
                type="button"
                className={styles.tagAddBtn}
                onClick={handleAddImagen}
              >
                Agregar
              </button>
            </div>
            {imagenes.length > 0 && (
              <>
                <div className={styles.tagsList}>
                  {imagenes.map((url) => (
                    <span key={url} className={styles.tag}>
                      {url.length > 50 ? url.substring(0, 50) + '...' : url}
                      <button
                        type="button"
                        className={styles.tagRemove}
                        onClick={() => handleRemoveImagen(url)}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
                <div className={styles.imagePreview} style={{ marginTop: '0.5rem' }}>
                  {imagenes.map((url, i) => (
                    <div key={i} className={styles.previewItem}>
                      <img
                        src={url}
                        alt={`Imagen ${i + 1}`}
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <button
                        type="button"
                        className={styles.previewRemove}
                        onClick={() => handleRemoveImagen(url)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Toggles */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Estado</h2>
          <div className={styles.grid}>
            <div className={styles.toggleRow}>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={destacada}
                  onChange={(e) => setDestacada(e.target.checked)}
                />
                <span className={styles.toggleSlider} />
              </label>
              <span className={styles.toggleLabel}>Destacada</span>
            </div>
            <div className={styles.toggleRow}>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  checked={activa}
                  onChange={(e) => setActiva(e.target.checked)}
                />
                <span className={styles.toggleSlider} />
              </label>
              <span className={styles.toggleLabel}>Activa</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.formActions}>
          <Link href="/admin/residencias" className={styles.cancelBtn}>
            Cancelar
          </Link>
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
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

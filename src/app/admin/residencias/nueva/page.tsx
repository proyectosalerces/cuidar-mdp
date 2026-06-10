'use client';

/**
 * Admin — Create new residencia
 */

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { TipoCuidado } from '@/types/residencia';
import {
  BARRIOS_MDP,
  TIPOS_CUIDADO_OPTIONS,
} from '@/utils/constants';
import { createResidencia, uploadImage } from '@/services/admin.service';
import styles from '../form.module.css';

export default function NuevaResidenciaPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Form state */
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [barrio, setBarrio] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [descripcionCorta, setDescripcionCorta] = useState('');
  const [tiposCuidado, setTiposCuidado] = useState<TipoCuidado[]>([]);
  const [servicios, setServicios] = useState<string[]>([]);
  const [servicioInput, setServicioInput] = useState('');
  const [precioDesde, setPrecioDesde] = useState('');
  const [precioHasta, setPrecioHasta] = useState('');
  const [destacada, setDestacada] = useState(false);
  const [activa, setActiva] = useState(true);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* Tipos de cuidado toggle */
  const handleTipoToggle = (tipo: TipoCuidado) => {
    setTiposCuidado((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo],
    );
  };

  /* Servicios add/remove */
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

  /* Image handling */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string]);
      };
      reader.readAsDataURL(file);
      setImageFiles((prev) => [...prev, file]);
    });
    e.target.value = '';
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
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
      // Upload images
      const imageUrls: string[] = [];
      for (const file of imageFiles) {
        const path = `residencias/${Date.now()}-${file.name}`;
        const url = await uploadImage(file, path);
        imageUrls.push(url);
      }

      await createResidencia({
        nombre: nombre.trim(),
        direccion: direccion.trim(),
        barrio,
        telefono: telefono.trim(),
        email: email.trim() || undefined,
        website: website.trim() || undefined,
        whatsapp: whatsapp.trim() || undefined,
        descripcion: descripcion.trim(),
        descripcionCorta: descripcionCorta.trim(),
        tiposCuidado,
        servicios,
        precioDesde: precioDesde ? Number(precioDesde) : undefined,
        precioHasta: precioHasta ? Number(precioHasta) : undefined,
        destacada,
        activa,
        imagenes: imageUrls,
        imagenPrincipal: imageUrls[0] ?? '',
      });

      showToast('Residencia creada exitosamente', 'success');
      setTimeout(() => router.push('/admin/residencias'), 1500);
    } catch (err) {
      console.error('Error creating residencia:', err);
      showToast('Error al crear la residencia', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/admin/residencias" className={styles.backBtn}>
          ←
        </Link>
        <h1 className={styles.title}>Nueva Residencia</h1>
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
                placeholder="Nombre de la residencia"
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
                placeholder="Ej: Av. Colón 1234"
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
                placeholder="+54 9 223..."
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Email</label>
              <input
                className={styles.input}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="contacto@ejemplo.com"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Sitio web</label>
              <input
                className={styles.input}
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>WhatsApp</label>
              <input
                className={styles.input}
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="5492235551234"
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
                placeholder="Breve descripción para la tarjeta"
                maxLength={160}
              />
            </div>
            <div className={`${styles.field} ${styles.fullWidth}`}>
              <label className={styles.label}>Descripción completa</label>
              <textarea
                className={styles.textarea}
                value={descripcion}
                onChange={(e) => setDescripcion(e.target.value)}
                placeholder="Descripción detallada de la residencia..."
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
                placeholder="0"
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
                placeholder="0"
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Images */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Imágenes</h2>
          <div className={styles.imageUpload}>
            <div
              className={styles.dropZone}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className={styles.dropIcon}>📷</div>
              <div className={styles.dropText}>
                Hacé click para subir imágenes
              </div>
              <div className={styles.dropHint}>JPG, PNG, WebP — Máx. 5MB</div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              hidden
              onChange={handleFileChange}
            />
            {imagePreviews.length > 0 && (
              <div className={styles.imagePreview}>
                {imagePreviews.map((src, i) => (
                  <div key={i} className={styles.previewItem}>
                    <img src={src} alt={`Preview ${i + 1}`} />
                    <button
                      type="button"
                      className={styles.previewRemove}
                      onClick={() => handleRemoveImage(i)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
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
            {saving ? 'Guardando...' : 'Guardar residencia'}
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

'use client';

/**
 * Admin — Create new profesional
 */

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Especialidad } from '@/types/profesional';
import { ESPECIALIDAD_OPTIONS, BARRIOS_MDP } from '@/utils/constants';
import { createProfesional, uploadImage } from '@/services/admin.service';
import styles from '../form.module.css';

export default function NuevoProfesionalPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* Form state */
  const [nombre, setNombre] = useState('');
  const [especialidad, setEspecialidad] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [direccion, setDireccion] = useState('');
  const [barrio, setBarrio] = useState('');
  const [matricula, setMatricula] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [website, setWebsite] = useState('');
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);
  const [activo, setActivo] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  /* Photo handling */
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setFotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    setFotoFile(file);
    e.target.value = '';
  };

  /* Save */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nombre.trim() || !especialidad) {
      showToast('Nombre y especialidad son obligatorios', 'error');
      return;
    }

    setSaving(true);
    try {
      let fotoUrl = '';
      if (fotoFile) {
        const path = `profesionales/${Date.now()}-${fotoFile.name}`;
        fotoUrl = await uploadImage(fotoFile, path);
      }

      await createProfesional({
        nombre: nombre.trim(),
        especialidad: especialidad as Especialidad,
        telefono: telefono.trim(),
        email: email.trim() || undefined,
        direccionConsultorio: direccion.trim(),
        barrio,
        matricula: matricula.trim() || undefined,
        descripcion: descripcion.trim(),
        website: website.trim() || undefined,
        foto: fotoUrl,
        activo,
      });

      showToast('Profesional creado exitosamente', 'success');
      setTimeout(() => router.push('/admin/profesionales'), 1500);
    } catch (err) {
      console.error('Error creating profesional:', err);
      showToast('Error al crear el profesional', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <Link href="/admin/profesionales" className={styles.backBtn}>
          ←
        </Link>
        <h1 className={styles.title}>Nuevo Profesional</h1>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        {/* Photo */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Foto</h2>
          <div className={styles.photoUpload}>
            <div className={styles.photoPreview}>
              {fotoPreview ? (
                <img src={fotoPreview} alt="Preview" />
              ) : (
                <span className={styles.photoPlaceholder}>👤</span>
              )}
            </div>
            <div className={styles.photoActions}>
              <button
                type="button"
                className={styles.uploadBtn}
                onClick={() => fileInputRef.current?.click()}
              >
                {fotoPreview ? 'Cambiar foto' : 'Subir foto'}
              </button>
              <p className={styles.photoHint}>JPG, PNG — Máx. 2MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              hidden
              onChange={handlePhotoChange}
            />
          </div>
        </div>

        {/* Basic Info */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Información básica</h2>
          <div className={styles.grid}>
            <div className={styles.field}>
              <label className={styles.label}>
                Nombre completo<span className={styles.required}>*</span>
              </label>
              <input
                className={styles.input}
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Dr. Juan Pérez"
                required
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>
                Especialidad<span className={styles.required}>*</span>
              </label>
              <select
                className={styles.select}
                value={especialidad}
                onChange={(e) => setEspecialidad(e.target.value)}
                required
              >
                <option value="">Seleccionar especialidad</option>
                {ESPECIALIDAD_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Matrícula</label>
              <input
                className={styles.input}
                value={matricula}
                onChange={(e) => setMatricula(e.target.value)}
                placeholder="MP 12345"
              />
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
                placeholder="doctor@ejemplo.com"
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
              <label className={styles.label}>Dirección consultorio</label>
              <input
                className={styles.input}
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                placeholder="Av. Colón 1234"
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
          </div>
        </div>

        {/* Description */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Descripción</h2>
          <div className={styles.field}>
            <label className={styles.label}>Sobre el profesional</label>
            <textarea
              className={styles.textarea}
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Experiencia, formación, áreas de enfoque..."
            />
          </div>
        </div>

        {/* Status */}
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Estado</h2>
          <div className={styles.toggleRow}>
            <label className={styles.toggle}>
              <input
                type="checkbox"
                checked={activo}
                onChange={(e) => setActivo(e.target.checked)}
              />
              <span className={styles.toggleSlider} />
            </label>
            <span className={styles.toggleLabel}>Activo</span>
          </div>
        </div>

        {/* Actions */}
        <div className={styles.formActions}>
          <Link href="/admin/profesionales" className={styles.cancelBtn}>
            Cancelar
          </Link>
          <button
            type="submit"
            className={styles.saveBtn}
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar profesional'}
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

'use client';

/**
 * AutorizacionSeccion — reusable "read & sign the authorization" control.
 *
 * Shared by the residencia and profesional intake forms. Shows a button that
 * opens a modal with the authorization text + the signer's data + consent
 * checkbox, and reports the collected data via onConfirm. The legal text and
 * its version live in @/types/solicitud (single source of truth).
 */

import { useState } from 'react';
import { TEXTO_AUTORIZACION_PARRAFOS } from '@/types/solicitud';
import styles from './AutorizacionSeccion.module.css';

export interface AutorizanteData {
  nombre: string;
  apellido: string;
  cargo: string;
  dni: string;
  telefono: string;
  email: string;
}

const EMPTY: AutorizanteData = {
  nombre: '', apellido: '', cargo: '', dni: '', telefono: '', email: '',
};

interface Props {
  autoriza: boolean;
  datos: AutorizanteData | null;
  error?: string;
  /** Label for the "carácter en que firma" field (e.g. tailored per form). */
  cargoLabel?: string;
  onConfirm: (data: AutorizanteData) => void;
}

export default function AutorizacionSeccion({
  autoriza,
  datos,
  error,
  cargoLabel = 'Carácter en que firma',
  onConfirm,
}: Props) {
  const [open, setOpen] = useState(false);
  const [f, setF] = useState<AutorizanteData>(datos ?? EMPTY);
  const [acepta, setAcepta] = useState(autoriza);
  const [errs, setErrs] = useState<Record<string, string>>({});

  const openModal = () => {
    setF(datos ?? EMPTY);
    setAcepta(autoriza);
    setErrs({});
    setOpen(true);
  };

  const set = (k: keyof AutorizanteData) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setF((prev) => ({ ...prev, [k]: e.target.value }));

  function confirmar() {
    const er: Record<string, string> = {};
    if (!f.nombre.trim()) er.nombre = 'Requerido';
    if (!f.apellido.trim()) er.apellido = 'Requerido';
    if (!f.cargo.trim()) er.cargo = 'Requerido';
    if (!f.telefono.trim()) er.telefono = 'Requerido';
    if (!f.email.trim()) er.email = 'Requerido';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email.trim())) er.email = 'Email no válido';
    if (!acepta) er.acepta = 'Necesitás aceptar para poder autorizar';
    setErrs(er);
    if (Object.keys(er).length > 0) return;
    onConfirm({
      nombre: f.nombre.trim(),
      apellido: f.apellido.trim(),
      cargo: f.cargo.trim(),
      dni: f.dni.trim(),
      telefono: f.telefono.trim(),
      email: f.email.trim(),
    });
    setOpen(false);
  }

  const field = (label: string, key: keyof AutorizanteData, required = false, placeholder = '') => (
    <div className={styles.field}>
      <label className={styles.label}>{label} {required && <span className={styles.req}>*</span>}</label>
      <input className={styles.input} value={f[key]} onChange={set(key)} placeholder={placeholder} />
      {errs[key] && <span className={styles.error}>{errs[key]}</span>}
    </div>
  );

  return (
    <>
      {autoriza && datos ? (
        <div className={styles.firmado}>
          <span>
            ✓ Autorización firmada por <strong>{datos.nombre} {datos.apellido}</strong>
            {datos.cargo ? ` — ${datos.cargo}` : ''}.
          </span>
          <button type="button" className={styles.linkBtn} onClick={openModal}>Ver / editar</button>
        </div>
      ) : (
        <button type="button" className={styles.firmarBtn} onClick={openModal}>
          Leer y firmar la autorización
        </button>
      )}
      {error && <span className={styles.error}>{error}</span>}

      {open && (
        <div className={styles.overlay} role="dialog" aria-modal="true" onClick={() => setOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Autorización para la publicación de información</h3>
            <div className={styles.modalText}>
              {TEXTO_AUTORIZACION_PARRAFOS.map((p, i) => <p key={i}>{p}</p>)}
            </div>

            <p className={styles.modalSubtitle}>Datos de quien autoriza</p>
            <div className={styles.grid2}>
              {field('Nombre', 'nombre', true)}
              {field('Apellido', 'apellido', true)}
              {field(cargoLabel, 'cargo', true, 'Ej: el/la profesional, apoderado/a…')}
              {field('DNI', 'dni')}
              {field('Teléfono de contacto', 'telefono', true)}
              {field('Email', 'email', true)}
            </div>

            <label className={`${styles.consent} ${errs.acepta ? styles.consentError : ''}`}>
              <input type="checkbox" checked={acepta} onChange={(e) => setAcepta(e.target.checked)} />
              <span>He leído y acepto la autorización, y declaro que los datos son veraces.</span>
            </label>
            {errs.acepta && <span className={styles.error}>{errs.acepta}</span>}

            <div className={styles.modalActions}>
              <button type="button" className={styles.modalCancel} onClick={() => setOpen(false)}>Cancelar</button>
              <button type="button" className={styles.modalConfirm} onClick={confirmar}>Confirmar autorización</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

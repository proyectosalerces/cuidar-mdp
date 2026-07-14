'use client';

/**
 * AltaProfesionalForm — public intake form for healthcare/legal professionals.
 * Saves to `solicitudesProfesionales` for admin review. Reuses the residencia
 * form styles and the shared authorization section.
 */

import { useState } from 'react';
import type { Especialidad } from '@/types/profesional';
import { ESPECIALIDAD_OPTIONS } from '@/utils/constants';
import { TEXTO_AUTORIZACION_VERSION } from '@/types/solicitud';
import { MODALIDADES_ATENCION } from '@/types/solicitud-profesional';
import { crearSolicitudProfesional } from '@/services/solicitudes-profesionales.service';
import AutorizacionSeccion, { type AutorizanteData } from './AutorizacionSeccion';
import styles from './AltaResidenciaForm.module.css';

export default function AltaProfesionalForm() {
  const [nombre, setNombre] = useState('');
  const [especialidad, setEspecialidad] = useState<Especialidad | ''>('');
  const [matricula, setMatricula] = useState('');
  const [descripcion, setDescripcion] = useState('');

  const [modalidades, setModalidades] = useState<string[]>([]);
  const [direccionConsultorio, setDireccionConsultorio] = useState('');
  const [barrio, setBarrio] = useState('');

  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');

  const [obrasSociales, setObrasSociales] = useState('');
  const [valorDesde, setValorDesde] = useState('');
  const [valorHasta, setValorHasta] = useState('');

  const [autoriza, setAutoriza] = useState(false);
  const [autorData, setAutorData] = useState<AutorizanteData | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggle = (list: string[], value: string): string[] =>
    list.includes(value) ? list.filter((x) => x !== value) : [...list, value];

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!nombre.trim()) e.nombre = 'Requerido';
    if (!especialidad) e.especialidad = 'Requerido';
    if (!telefono.trim()) e.telefono = 'Requerido';
    if (!email.trim()) e.email = 'Requerido';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) e.email = 'Email no válido';
    if (!autoriza) e.autoriza = 'Necesitás leer y firmar la autorización para poder enviar';
    setErrors(e);
    if (Object.keys(e).length > 0) {
      document.getElementById('alta-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      const d = valorDesde.trim() !== '' ? Number(valorDesde) : undefined;
      const h = valorHasta.trim() !== '' ? Number(valorHasta) : undefined;

      await crearSolicitudProfesional({
        nombre: nombre.trim(),
        especialidad: especialidad as Especialidad,
        matricula: matricula.trim() || undefined,
        descripcion: descripcion.trim() || undefined,
        modalidades,
        direccionConsultorio: direccionConsultorio.trim() || undefined,
        barrio: barrio.trim() || undefined,
        telefono: telefono.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim() || undefined,
        website: website.trim() || undefined,
        instagram: instagram.trim() || undefined,
        obrasSociales: obrasSociales.trim() || undefined,
        valorDesde: d,
        valorHasta: h,
        autoriza,
        autorizanteNombre: autorData?.nombre ?? '',
        autorizanteApellido: autorData?.apellido ?? '',
        autorizanteCargo: autorData?.cargo ?? '',
        autorizanteDni: autorData?.dni || undefined,
        autorizanteTelefono: autorData?.telefono ?? '',
        autorizanteEmail: autorData?.email ?? '',
        textoVersion: TEXTO_AUTORIZACION_VERSION,
      });
      setSuccess(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setErrors({ general: 'Hubo un error al enviar el formulario. Intentá de nuevo en unos minutos.' });
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className={styles.success}>
        <div className={styles.successIcon}>✓</div>
        <h2>¡Gracias! Recibimos tu información.</h2>
        <p>
          Nuestro equipo la va a revisar y, una vez publicada, tu perfil va a aparecer en el portal
          de Cuidar MdP. Si necesitamos algún dato más, nos ponemos en contacto.
        </p>
      </div>
    );
  }

  return (
    <form id="alta-form" className={styles.form} onSubmit={handleSubmit} noValidate>
      {errors.general && <p className={styles.generalError}>{errors.general}</p>}

      {/* 1. Datos del profesional */}
      <fieldset className={styles.section}>
        <legend className={styles.legend}>1 · Datos del profesional</legend>
        <div className={styles.grid2}>
          <Field label="Nombre y apellido" required error={errors.nombre}>
            <input className={styles.input} value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </Field>
          <Field label="Especialidad" required error={errors.especialidad}>
            <select className={styles.input} value={especialidad} onChange={(e) => setEspecialidad(e.target.value as Especialidad)}>
              <option value="">Seleccionar…</option>
              {ESPECIALIDAD_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
          <Field label="Matrícula (opcional)">
            <input className={styles.input} value={matricula} onChange={(e) => setMatricula(e.target.value)} />
          </Field>
        </div>
        <Field label="Descripción / experiencia (opcional)">
          <textarea className={styles.textarea} rows={3} value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Contá brevemente tu experiencia y enfoque" />
        </Field>
      </fieldset>

      {/* 2. Dónde atiende */}
      <fieldset className={styles.section}>
        <legend className={styles.legend}>2 · Dónde atiende</legend>
        <Field label="Modalidad de atención">
          <div className={styles.checks}>
            {MODALIDADES_ATENCION.map((m) => (
              <label key={m.value} className={styles.check}>
                <input type="checkbox" checked={modalidades.includes(m.value)} onChange={() => setModalidades((p) => toggle(p, m.value))} />
                {m.label}
              </label>
            ))}
          </div>
        </Field>
        <div className={styles.grid2}>
          <Field label="Dirección del consultorio (opcional)">
            <input className={styles.input} value={direccionConsultorio} onChange={(e) => setDireccionConsultorio(e.target.value)} />
          </Field>
          <Field label="Barrio (opcional)">
            <input className={styles.input} value={barrio} onChange={(e) => setBarrio(e.target.value)} />
          </Field>
        </div>
      </fieldset>

      {/* 3. Contacto */}
      <fieldset className={styles.section}>
        <legend className={styles.legend}>3 · Contacto</legend>
        <div className={styles.grid2}>
          <Field label="Teléfono" required error={errors.telefono}>
            <input className={styles.input} value={telefono} onChange={(e) => setTelefono(e.target.value)} />
          </Field>
          <Field label="Email" required error={errors.email}>
            <input className={styles.input} type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Field>
          <Field label="WhatsApp">
            <input className={styles.input} value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} />
          </Field>
          <Field label="Sitio web">
            <input className={styles.input} value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="https://" />
          </Field>
          <Field label="Instagram">
            <input className={styles.input} value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@usuario" />
          </Field>
        </div>
      </fieldset>

      {/* 4. Obras sociales y valores */}
      <fieldset className={styles.section}>
        <legend className={styles.legend}>4 · Obras sociales y valores</legend>
        <Field label="Obras sociales / prepagas que atendés (opcional)">
          <input className={styles.input} value={obrasSociales} onChange={(e) => setObrasSociales(e.target.value)} placeholder="Ej: PAMI, IOMA, OSDE, particular" />
        </Field>
        <p className={styles.hint}>
          El valor de la consulta es <strong>solo para uso interno de Cuidar MdP</strong> — no se
          publica en tu perfil.
        </p>
        <div className={styles.grid2}>
          <Field label="Valor consulta desde ($) (opcional)">
            <input className={styles.input} inputMode="numeric" value={valorDesde} onChange={(e) => setValorDesde(e.target.value)} />
          </Field>
          <Field label="Valor consulta hasta ($) (opcional)">
            <input className={styles.input} inputMode="numeric" value={valorHasta} onChange={(e) => setValorHasta(e.target.value)} />
          </Field>
        </div>
      </fieldset>

      {/* 5. Autorización */}
      <fieldset className={styles.section}>
        <legend className={styles.legend}>5 · Autorización</legend>
        <p className={styles.hint}>
          Para publicar tu perfil necesitamos que leas y firmes la autorización. Queda registrada
          con fecha, nombre y datos de contacto.
        </p>
        <AutorizacionSeccion
          autoriza={autoriza}
          datos={autorData}
          error={errors.autoriza}
          cargoLabel="Carácter en que firma (el/la profesional, apoderado/a…)"
          onConfirm={(d) => {
            setAutorData(d);
            setAutoriza(true);
            setErrors((prev) => ({ ...prev, autoriza: '' }));
          }}
        />
      </fieldset>

      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? 'Enviando…' : 'Enviar información'}
      </button>
    </form>
  );
}

/* ── Small field wrapper ───────────────────────────────────────────────── */

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>
        {label} {required && <span className={styles.req}>*</span>}
      </label>
      {children}
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

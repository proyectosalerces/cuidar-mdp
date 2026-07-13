'use client';

/**
 * AltaResidenciaForm — public intake form for residencias.
 *
 * Sections: contacto, habilitación, asistencia, habitaciones, valores,
 * consentimiento. Saves to the `solicitudes` collection for admin review.
 */

import { useState } from 'react';
import type { TipoCuidado, EstadoHabilitacion } from '@/types/residencia';
import {
  TIPOS_HABITACION,
  SERVICIOS_OPCIONES,
  TIPOS_CUIDADO_SOLICITUD,
  TEXTO_AUTORIZACION_PARRAFOS,
  TEXTO_AUTORIZACION_VERSION,
  type ValorHabitacion,
} from '@/types/solicitud';
import { crearSolicitud } from '@/services/solicitudes.service';
import styles from './AltaResidenciaForm.module.css';

type Valores = Record<string, { desde: string; hasta: string }>;

const HABILITACION_OPCIONES: { value: EstadoHabilitacion; label: string }[] = [
  { value: 'si', label: 'Sí' },
  { value: 'en-tramite', label: 'En trámite' },
  { value: 'no', label: 'No' },
];

export default function AltaResidenciaForm() {
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [barrio, setBarrio] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [facebook, setFacebook] = useState('');

  const [habMunicipal, setHabMunicipal] = useState<EstadoHabilitacion | ''>('');
  const [habProvincial, setHabProvincial] = useState<EstadoHabilitacion | ''>('');

  const [tiposCuidado, setTiposCuidado] = useState<TipoCuidado[]>([]);
  const [servicios, setServicios] = useState<string[]>([]);
  const [actividades, setActividades] = useState('');
  const [regimenVisitas, setRegimenVisitas] = useState('');

  const [tiposHabitacion, setTiposHabitacion] = useState<string[]>([]);
  const [disponibilidad, setDisponibilidad] = useState('');

  const [valores, setValores] = useState<Valores>({});
  const [notaPlantas, setNotaPlantas] = useState('');
  const [diferenciales, setDiferenciales] = useState('');
  const [reintegroObraSocial, setReintegroObraSocial] = useState('');

  const [autoriza, setAutoriza] = useState(false);
  const [autorNombre, setAutorNombre] = useState('');
  const [autorApellido, setAutorApellido] = useState('');
  const [autorCargo, setAutorCargo] = useState('');
  const [autorDni, setAutorDni] = useState('');
  const [autorTelefono, setAutorTelefono] = useState('');
  const [autorEmail, setAutorEmail] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [aceptaModal, setAceptaModal] = useState(false);
  const [mErrors, setMErrors] = useState<Record<string, string>>({});

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const toggle = <T extends string>(list: T[], value: T): T[] =>
    list.includes(value) ? list.filter((x) => x !== value) : [...list, value];

  function confirmarAutorizacion() {
    const me: Record<string, string> = {};
    if (!autorNombre.trim()) me.nombre = 'Requerido';
    if (!autorApellido.trim()) me.apellido = 'Requerido';
    if (!autorCargo.trim()) me.cargo = 'Requerido';
    if (!autorTelefono.trim()) me.telefono = 'Requerido';
    if (!autorEmail.trim()) me.email = 'Requerido';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(autorEmail.trim())) me.email = 'Email no válido';
    if (!aceptaModal) me.acepta = 'Necesitás aceptar para poder autorizar';
    setMErrors(me);
    if (Object.keys(me).length > 0) return;
    setAutoriza(true);
    setModalOpen(false);
    setErrors((prev) => ({ ...prev, autoriza: '' }));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!nombre.trim()) e.nombre = 'Requerido';
    if (!direccion.trim()) e.direccion = 'Requerido';
    if (!telefono.trim()) e.telefono = 'Requerido';
    if (!email.trim()) e.email = 'Requerido';
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) e.email = 'Email no válido';
    if (!habMunicipal) e.habMunicipal = 'Requerido';
    if (!habProvincial) e.habProvincial = 'Requerido';
    if (tiposCuidado.length === 0) e.tiposCuidado = 'Elegí al menos uno';
    if (tiposHabitacion.length === 0) e.tiposHabitacion = 'Elegí al menos uno';
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
      const valoresArr: ValorHabitacion[] = tiposHabitacion
        .map((tipo) => {
          const v = valores[tipo] ?? { desde: '', hasta: '' };
          const desde = v.desde.trim() !== '' ? Number(v.desde) : undefined;
          const hasta = v.hasta.trim() !== '' ? Number(v.hasta) : undefined;
          return { tipo, desde, hasta };
        })
        .filter((v) => v.desde !== undefined || v.hasta !== undefined);

      await crearSolicitud({
        nombre: nombre.trim(),
        direccion: direccion.trim(),
        barrio: barrio.trim() || undefined,
        telefono: telefono.trim(),
        email: email.trim(),
        whatsapp: whatsapp.trim() || undefined,
        website: website.trim() || undefined,
        instagram: instagram.trim() || undefined,
        facebook: facebook.trim() || undefined,
        habilitacionMunicipal: (habMunicipal || undefined) as EstadoHabilitacion | undefined,
        habilitacionProvincial: (habProvincial || undefined) as EstadoHabilitacion | undefined,
        tiposCuidado,
        servicios,
        actividades: actividades.trim() || undefined,
        regimenVisitas: regimenVisitas.trim() || undefined,
        tiposHabitacion,
        disponibilidad: disponibilidad.trim() || undefined,
        valores: valoresArr,
        notaPlantas: notaPlantas.trim() || undefined,
        diferenciales: diferenciales.trim() || undefined,
        reintegroObraSocial: reintegroObraSocial.trim() || undefined,
        autoriza,
        autorizanteNombre: autorNombre.trim(),
        autorizanteApellido: autorApellido.trim(),
        autorizanteCargo: autorCargo.trim(),
        autorizanteDni: autorDni.trim() || undefined,
        autorizanteTelefono: autorTelefono.trim(),
        autorizanteEmail: autorEmail.trim(),
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
        <h2>¡Gracias! Recibimos la información de tu residencia.</h2>
        <p>
          Nuestro equipo la va a revisar y, una vez publicada, tu residencia va a aparecer en el
          portal de Cuidar MdP. Si necesitamos algún dato más, nos ponemos en contacto.
        </p>
      </div>
    );
  }

  return (
    <form id="alta-form" className={styles.form} onSubmit={handleSubmit} noValidate>
      {errors.general && <p className={styles.generalError}>{errors.general}</p>}

      {/* ── 1. Datos de la residencia ─────────────────────────── */}
      <fieldset className={styles.section}>
        <legend className={styles.legend}>1 · Datos de la residencia</legend>
        <div className={styles.grid2}>
          <Field label="Nombre de la residencia" required error={errors.nombre}>
            <input className={styles.input} value={nombre} onChange={(e) => setNombre(e.target.value)} />
          </Field>
          <Field label="Barrio">
            <input className={styles.input} value={barrio} onChange={(e) => setBarrio(e.target.value)} />
          </Field>
          <Field label="Dirección" required error={errors.direccion}>
            <input className={styles.input} value={direccion} onChange={(e) => setDireccion(e.target.value)} />
          </Field>
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
          <Field label="Facebook">
            <input className={styles.input} value={facebook} onChange={(e) => setFacebook(e.target.value)} />
          </Field>
        </div>
      </fieldset>

      {/* ── 2. Habilitación ───────────────────────────────────── */}
      <fieldset className={styles.section}>
        <legend className={styles.legend}>2 · Habilitación</legend>
        <div className={styles.grid2}>
          <Field label="Habilitación municipal" required error={errors.habMunicipal}>
            <select className={styles.input} value={habMunicipal} onChange={(e) => setHabMunicipal(e.target.value as EstadoHabilitacion)}>
              <option value="">Seleccionar…</option>
              {HABILITACION_OPCIONES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
          <Field label="Habilitación provincial" required error={errors.habProvincial}>
            <select className={styles.input} value={habProvincial} onChange={(e) => setHabProvincial(e.target.value as EstadoHabilitacion)}>
              <option value="">Seleccionar…</option>
              {HABILITACION_OPCIONES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </Field>
        </div>
      </fieldset>

      {/* ── 3. Asistencia y servicios ─────────────────────────── */}
      <fieldset className={styles.section}>
        <legend className={styles.legend}>3 · Asistencia y servicios</legend>
        <Field label="Tipo de asistencia" required error={errors.tiposCuidado}>
          <div className={styles.checks}>
            {TIPOS_CUIDADO_SOLICITUD.map((t) => (
              <label key={t.value} className={styles.check}>
                <input type="checkbox" checked={tiposCuidado.includes(t.value)} onChange={() => setTiposCuidado((p) => toggle(p, t.value))} />
                {t.label}
              </label>
            ))}
          </div>
        </Field>
        <Field label="Servicios (marcá los que ofrecen)">
          <div className={styles.checks}>
            {SERVICIOS_OPCIONES.map((s) => (
              <label key={s.value} className={styles.check}>
                <input type="checkbox" checked={servicios.includes(s.value)} onChange={() => setServicios((p) => toggle(p, s.value))} />
                {s.label}
              </label>
            ))}
          </div>
        </Field>
        <div className={styles.grid2}>
          <Field label="Actividades (opcional)">
            <input className={styles.input} value={actividades} onChange={(e) => setActividades(e.target.value)} placeholder="Ej: recreación, kinesiología, musicoterapia" />
          </Field>
          <Field label="Régimen de visitas (opcional)">
            <input className={styles.input} value={regimenVisitas} onChange={(e) => setRegimenVisitas(e.target.value)} placeholder="Ej: todos los días 10 a 18 hs" />
          </Field>
        </div>
      </fieldset>

      {/* ── 4. Habitaciones ───────────────────────────────────── */}
      <fieldset className={styles.section}>
        <legend className={styles.legend}>4 · Habitaciones</legend>
        <Field label="Tipos de habitación disponibles" required error={errors.tiposHabitacion}>
          <div className={styles.checks}>
            {TIPOS_HABITACION.map((h) => (
              <label key={h.value} className={styles.check}>
                <input type="checkbox" checked={tiposHabitacion.includes(h.value)} onChange={() => setTiposHabitacion((p) => toggle(p, h.value))} />
                {h.label}
              </label>
            ))}
          </div>
        </Field>
        <Field label="Disponibilidad actual (opcional)">
          <input className={styles.input} value={disponibilidad} onChange={(e) => setDisponibilidad(e.target.value)} placeholder="Ej: 2 camas disponibles" />
        </Field>
      </fieldset>

      {/* ── 5. Valores ────────────────────────────────────────── */}
      <fieldset className={styles.section}>
        <legend className={styles.legend}>5 · Valores orientativos (opcional)</legend>
        {tiposHabitacion.length === 0 ? (
          <p className={styles.hint}>Elegí primero los tipos de habitación en la sección anterior para cargar sus valores.</p>
        ) : (
          <div className={styles.valores}>
            <div className={styles.valorHead}>
              <span>Tipo</span><span>Desde ($)</span><span>Hasta ($)</span>
            </div>
            {tiposHabitacion.map((tipo) => {
              const label = TIPOS_HABITACION.find((h) => h.value === tipo)?.label ?? tipo;
              const v = valores[tipo] ?? { desde: '', hasta: '' };
              return (
                <div key={tipo} className={styles.valorRow}>
                  <span className={styles.valorTipo}>{label}</span>
                  <input className={styles.input} inputMode="numeric" value={v.desde}
                    onChange={(e) => setValores((p) => ({ ...p, [tipo]: { ...v, desde: e.target.value } }))} />
                  <input className={styles.input} inputMode="numeric" value={v.hasta}
                    onChange={(e) => setValores((p) => ({ ...p, [tipo]: { ...v, hasta: e.target.value } }))} />
                </div>
              );
            })}
          </div>
        )}
        <Field label="Diferencia planta baja / planta alta (opcional)">
          <input className={styles.input} value={notaPlantas} onChange={(e) => setNotaPlantas(e.target.value)} placeholder="Ej: planta alta +10%" />
        </Field>
        <Field label="Diferenciales contratables (opcional)">
          <input className={styles.input} value={diferenciales} onChange={(e) => setDiferenciales(e.target.value)} placeholder="Ej: cama ortopédica, acompañante nocturno" />
        </Field>
        <Field label="Reintegro por obra social (opcional)">
          <input className={styles.input} value={reintegroObraSocial} onChange={(e) => setReintegroObraSocial(e.target.value)} placeholder="Ej: PAMI, IOMA, prepagas" />
        </Field>
      </fieldset>

      {/* ── 6. Autorización ───────────────────────────────────── */}
      <fieldset className={styles.section}>
        <legend className={styles.legend}>6 · Autorización</legend>
        <p className={styles.hint}>
          Para publicar tu residencia, una persona responsable debe leer y firmar la autorización.
          Queda registrada con fecha, nombre y datos de contacto.
        </p>
        {autoriza ? (
          <div className={styles.firmado}>
            <span>
              ✓ Autorización firmada por <strong>{autorNombre} {autorApellido}</strong>
              {autorCargo ? ` — ${autorCargo}` : ''}.
            </span>
            <button type="button" className={styles.linkBtn} onClick={() => setModalOpen(true)}>
              Ver / editar
            </button>
          </div>
        ) : (
          <button
            type="button"
            className={styles.firmarBtn}
            onClick={() => { setMErrors({}); setModalOpen(true); }}
          >
            Leer y firmar la autorización
          </button>
        )}
        {errors.autoriza && <span className={styles.error}>{errors.autoriza}</span>}
      </fieldset>

      <button type="submit" className={styles.submit} disabled={submitting}>
        {submitting ? 'Enviando…' : 'Enviar información'}
      </button>

      {/* ── Modal de autorización ─────────────────────────────── */}
      {modalOpen && (
        <div className={styles.overlay} role="dialog" aria-modal="true" onClick={() => setModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>Autorización para la publicación de información</h3>
            <div className={styles.modalText}>
              {TEXTO_AUTORIZACION_PARRAFOS.map((p, i) => <p key={i}>{p}</p>)}
            </div>

            <p className={styles.modalSubtitle}>Datos de quien autoriza</p>
            <div className={styles.grid2}>
              <Field label="Nombre" required error={mErrors.nombre}>
                <input className={styles.input} value={autorNombre} onChange={(e) => setAutorNombre(e.target.value)} />
              </Field>
              <Field label="Apellido" required error={mErrors.apellido}>
                <input className={styles.input} value={autorApellido} onChange={(e) => setAutorApellido(e.target.value)} />
              </Field>
              <Field label="Carácter en que firma" required error={mErrors.cargo}>
                <input className={styles.input} value={autorCargo} onChange={(e) => setAutorCargo(e.target.value)} placeholder="Dueño/a, director/a, apoderado/a…" />
              </Field>
              <Field label="DNI">
                <input className={styles.input} value={autorDni} onChange={(e) => setAutorDni(e.target.value)} />
              </Field>
              <Field label="Teléfono de contacto" required error={mErrors.telefono}>
                <input className={styles.input} value={autorTelefono} onChange={(e) => setAutorTelefono(e.target.value)} />
              </Field>
              <Field label="Email" required error={mErrors.email}>
                <input className={styles.input} type="email" value={autorEmail} onChange={(e) => setAutorEmail(e.target.value)} />
              </Field>
            </div>

            <label className={`${styles.consent} ${mErrors.acepta ? styles.consentError : ''}`}>
              <input type="checkbox" checked={aceptaModal} onChange={(e) => setAceptaModal(e.target.checked)} />
              <span>He leído y acepto la autorización en representación de la residencia, y declaro que los datos son veraces.</span>
            </label>
            {mErrors.acepta && <span className={styles.error}>{mErrors.acepta}</span>}

            <div className={styles.modalActions}>
              <button type="button" className={styles.modalCancel} onClick={() => setModalOpen(false)}>Cancelar</button>
              <button type="button" className={styles.modalConfirm} onClick={confirmarAutorizacion}>Confirmar autorización</button>
            </div>
          </div>
        </div>
      )}
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

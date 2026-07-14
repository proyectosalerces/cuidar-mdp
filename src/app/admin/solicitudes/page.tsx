'use client';

/**
 * Admin — Intake requests (bandeja de solicitudes) with tabs:
 * Residencias | Profesionales. Review each and publish with one click.
 */

import { useEffect, useState, useCallback } from 'react';
import type { SolicitudResidencia } from '@/types/solicitud';
import { SERVICIOS_OPCIONES, TIPOS_HABITACION, TIPOS_CUIDADO_SOLICITUD } from '@/types/solicitud';
import type { SolicitudProfesional } from '@/types/solicitud-profesional';
import { MODALIDADES_ATENCION } from '@/types/solicitud-profesional';
import {
  getSolicitudes,
  updateEstadoSolicitud,
  deleteSolicitud,
} from '@/services/solicitudes.service';
import {
  getSolicitudesProfesionales,
  updateEstadoSolicitudProfesional,
  deleteSolicitudProfesional,
} from '@/services/solicitudes-profesionales.service';
import { createResidencia, createProfesional } from '@/services/admin.service';
import { ESPECIALIDAD_LABELS } from '@/utils/constants';
import styles from './page.module.css';

const HAB_LABEL: Record<string, string> = { si: 'Sí', no: 'No', 'en-tramite': 'En trámite' };
const labelServicio = (k: string) => SERVICIOS_OPCIONES.find((o) => o.value === k)?.label ?? k;
const labelHab = (k: string) => TIPOS_HABITACION.find((o) => o.value === k)?.label ?? k;
const labelCuidado = (k: string) => TIPOS_CUIDADO_SOLICITUD.find((o) => o.value === k)?.label ?? k;
const labelModalidad = (k: string) => MODALIDADES_ATENCION.find((o) => o.value === k)?.label ?? k;

function formatFecha(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch { return ''; }
}

function rangoStr(s: SolicitudResidencia): string {
  const parts = s.valores.map((v) => {
    const d = v.desde ? `$${v.desde.toLocaleString('es-AR')}` : '';
    const h = v.hasta ? `$${v.hasta.toLocaleString('es-AR')}` : '';
    const rango = d && h ? `${d}–${h}` : d || h;
    return `${labelHab(v.tipo)}: ${rango}`;
  });
  let out = parts.join(' · ');
  if (s.notaPlantas) out += out ? ` (${s.notaPlantas})` : s.notaPlantas;
  return out;
}

const badgeClass = (e: string) =>
  e === 'publicada' ? styles.badgePublicada : e === 'descartada' ? styles.badgeDescartada : styles.badgePendiente;
const badgeLabel = (e: string) =>
  e === 'publicada' ? 'Publicada' : e === 'descartada' ? 'Descartada' : 'Pendiente';

type Tab = 'residencias' | 'profesionales';

export default function AdminSolicitudesPage() {
  const [tab, setTab] = useState<Tab>('residencias');
  const [resids, setResids] = useState<SolicitudResidencia[]>([]);
  const [profs, setProfs] = useState<SolicitudProfesional[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [r, p] = await Promise.all([getSolicitudes(), getSolicitudesProfesionales()]);
    setResids(r);
    setProfs(p);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  /* ── Residencias ─────────────────────────────────────────── */

  const publicarResid = async (s: SolicitudResidencia) => {
    if (!window.confirm(`¿Publicar "${s.nombre}" como residencia? Después podés editarla y sumarle fotos.`)) return;
    setBusyId(s.id);
    try {
      const desdes = s.valores.map((v) => v.desde).filter((n): n is number => typeof n === 'number');
      const hastas = s.valores.map((v) => v.hasta).filter((n): n is number => typeof n === 'number');
      await createResidencia({
        nombre: s.nombre,
        direccion: s.direccion,
        barrio: s.barrio ?? '',
        telefono: s.telefono,
        email: s.email || undefined,
        whatsapp: s.whatsapp,
        website: s.website,
        facebook: s.facebook,
        instagram: s.instagram,
        habilitacionMunicipal: s.habilitacionMunicipal,
        habilitacionProvincial: s.habilitacionProvincial,
        mostrarHabilitaciones: true,
        tiposCuidado: s.tiposCuidado,
        servicios: s.servicios.map(labelServicio),
        descripcion: '',
        descripcionCorta: '',
        precioDesde: desdes.length ? Math.min(...desdes) : undefined,
        precioHasta: hastas.length ? Math.max(...hastas) : undefined,
        rangoPrecios: rangoStr(s) || undefined,
        activa: true,
      });
      await updateEstadoSolicitud(s.id, 'publicada');
      setResids((prev) => prev.map((x) => (x.id === s.id ? { ...x, estado: 'publicada' } : x)));
      window.alert(`"${s.nombre}" se publicó. Editala en Residencias para sumar fotos.`);
    } catch (err) {
      window.alert('Error al publicar: ' + (err as Error).message);
    } finally { setBusyId(null); }
  };

  const descartarResid = async (s: SolicitudResidencia) => {
    setBusyId(s.id);
    try {
      await updateEstadoSolicitud(s.id, 'descartada');
      setResids((prev) => prev.map((x) => (x.id === s.id ? { ...x, estado: 'descartada' } : x)));
    } finally { setBusyId(null); }
  };

  const eliminarResid = async (s: SolicitudResidencia) => {
    if (!window.confirm(`¿Eliminar la solicitud de "${s.nombre}"?`)) return;
    setBusyId(s.id);
    try {
      await deleteSolicitud(s.id);
      setResids((prev) => prev.filter((x) => x.id !== s.id));
    } finally { setBusyId(null); }
  };

  /* ── Profesionales ───────────────────────────────────────── */

  const publicarProf = async (s: SolicitudProfesional) => {
    if (!window.confirm(`¿Publicar a "${s.nombre}" como profesional? Después podés editarlo y sumarle foto.`)) return;
    setBusyId(s.id);
    try {
      await createProfesional({
        nombre: s.nombre,
        especialidad: s.especialidad,
        matricula: s.matricula,
        descripcion: s.descripcion ?? '',
        direccionConsultorio: s.direccionConsultorio ?? '',
        barrio: s.barrio ?? '',
        telefono: s.telefono,
        email: s.email || undefined,
        website: s.website,
        obrasSociales: s.obrasSociales
          ? s.obrasSociales.split(/[,·]/).map((x) => x.trim()).filter(Boolean)
          : undefined,
        activo: true,
      });
      await updateEstadoSolicitudProfesional(s.id, 'publicada');
      setProfs((prev) => prev.map((x) => (x.id === s.id ? { ...x, estado: 'publicada' } : x)));
      window.alert(`"${s.nombre}" se publicó. Editalo en Profesionales para sumar foto.`);
    } catch (err) {
      window.alert('Error al publicar: ' + (err as Error).message);
    } finally { setBusyId(null); }
  };

  const descartarProf = async (s: SolicitudProfesional) => {
    setBusyId(s.id);
    try {
      await updateEstadoSolicitudProfesional(s.id, 'descartada');
      setProfs((prev) => prev.map((x) => (x.id === s.id ? { ...x, estado: 'descartada' } : x)));
    } finally { setBusyId(null); }
  };

  const eliminarProf = async (s: SolicitudProfesional) => {
    if (!window.confirm(`¿Eliminar la solicitud de "${s.nombre}"?`)) return;
    setBusyId(s.id);
    try {
      await deleteSolicitudProfesional(s.id);
      setProfs((prev) => prev.filter((x) => x.id !== s.id));
    } finally { setBusyId(null); }
  };

  const pendResid = resids.filter((s) => s.estado === 'pendiente').length;
  const pendProf = profs.filter((s) => s.estado === 'pendiente').length;

  const Consent = ({ s }: { s: { autoriza: boolean; autorizanteNombre?: string; autorizanteApellido?: string; autorizanteCargo?: string; autorizanteTelefono?: string; autorizanteEmail?: string; textoVersion?: string } }) => (
    <div className={styles.consent}>
      ✓ {s.autoriza ? 'Autorizó' : 'NO autorizó'} la publicación · Firmó:{' '}
      <strong>{[s.autorizanteNombre, s.autorizanteApellido].filter(Boolean).join(' ') || '—'}</strong>
      {s.autorizanteCargo ? ` (${s.autorizanteCargo})` : ''}
      {(s.autorizanteTelefono || s.autorizanteEmail) ? ` · ${[s.autorizanteTelefono, s.autorizanteEmail].filter(Boolean).join(' · ')}` : ''}
      {s.textoVersion ? ` · texto ${s.textoVersion}` : ''}
    </div>
  );

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Solicitudes</h1>
        <p className={styles.intro}>
          Formularios completados desde <strong>/alta-residencia</strong> y{' '}
          <strong>/alta-profesional</strong>. Revisá cada uno y publicalo con un clic.
        </p>
      </header>

      <div className={styles.tabs} role="tablist">
        <button className={`${styles.tab} ${tab === 'residencias' ? styles.tabActive : ''}`} onClick={() => setTab('residencias')}>
          Residencias{!loading && pendResid > 0 ? ` (${pendResid})` : ''}
        </button>
        <button className={`${styles.tab} ${tab === 'profesionales' ? styles.tabActive : ''}`} onClick={() => setTab('profesionales')}>
          Profesionales{!loading && pendProf > 0 ? ` (${pendProf})` : ''}
        </button>
      </div>

      {loading && <div className={styles.loading}>Cargando solicitudes…</div>}

      {/* ── Residencias tab ─────────────────────────────────── */}
      {!loading && tab === 'residencias' && (
        resids.length === 0 ? (
          <div className={styles.empty}>Todavía no llegaron solicitudes de residencias.</div>
        ) : (
          <div className={styles.list}>
            {resids.map((s) => {
              const busy = busyId === s.id;
              const contacto = [s.telefono, s.whatsapp && `WhatsApp ${s.whatsapp}`, s.email].filter(Boolean).join(' · ');
              return (
                <article key={s.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={`${styles.badge} ${badgeClass(s.estado)}`}>{badgeLabel(s.estado)}</span>
                    <h2 className={styles.name}>{s.nombre}</h2>
                    <span className={styles.fecha}>{formatFecha(s.createdAt)}</span>
                  </div>
                  <div className={styles.rows}>
                    <div className={`${styles.row} ${styles.rowFull}`}><span className={styles.k}>Dirección: </span><span className={styles.v}>{s.direccion}{s.barrio ? `, ${s.barrio}` : ''}</span></div>
                    <div className={`${styles.row} ${styles.rowFull}`}><span className={styles.k}>Contacto: </span><span className={styles.v}>{contacto}</span></div>
                    <div className={styles.row}><span className={styles.k}>Hab. municipal: </span><span className={styles.v}>{HAB_LABEL[s.habilitacionMunicipal ?? ''] ?? '—'}</span></div>
                    <div className={styles.row}><span className={styles.k}>Hab. provincial: </span><span className={styles.v}>{HAB_LABEL[s.habilitacionProvincial ?? ''] ?? '—'}</span></div>
                    <div className={`${styles.row} ${styles.rowFull}`}><span className={styles.k}>Asistencia: </span><span className={styles.v}>{s.tiposCuidado.map(labelCuidado).join(', ') || '—'}</span></div>
                    {s.servicios.length > 0 && <div className={`${styles.row} ${styles.rowFull}`}><span className={styles.k}>Servicios: </span><span className={styles.v}>{s.servicios.map(labelServicio).join(', ')}</span></div>}
                    <div className={`${styles.row} ${styles.rowFull}`}><span className={styles.k}>Habitaciones: </span><span className={styles.v}>{s.tiposHabitacion.map(labelHab).join(', ') || '—'}{s.disponibilidad ? ` · ${s.disponibilidad}` : ''}</span></div>
                    {rangoStr(s) && <div className={`${styles.row} ${styles.rowFull}`}><span className={styles.k}>Valores: </span><span className={styles.v}>{rangoStr(s)}</span></div>}
                    {s.diferenciales && <div className={`${styles.row} ${styles.rowFull}`}><span className={styles.k}>Diferenciales: </span><span className={styles.v}>{s.diferenciales}</span></div>}
                    {s.reintegroObraSocial && <div className={`${styles.row} ${styles.rowFull}`}><span className={styles.k}>Obra social: </span><span className={styles.v}>{s.reintegroObraSocial}</span></div>}
                  </div>
                  <Consent s={s} />
                  <div className={styles.actions}>
                    {s.estado !== 'publicada' && <button className={`${styles.btn} ${styles.btnPublish}`} onClick={() => publicarResid(s)} disabled={busy}>{busy ? 'Publicando…' : 'Publicar como residencia'}</button>}
                    {s.estado === 'pendiente' && <button className={`${styles.btn} ${styles.btnDiscard}`} onClick={() => descartarResid(s)} disabled={busy}>Descartar</button>}
                    <button className={`${styles.btn} ${styles.btnDelete}`} onClick={() => eliminarResid(s)} disabled={busy}>Eliminar</button>
                  </div>
                </article>
              );
            })}
          </div>
        )
      )}

      {/* ── Profesionales tab ───────────────────────────────── */}
      {!loading && tab === 'profesionales' && (
        profs.length === 0 ? (
          <div className={styles.empty}>Todavía no llegaron solicitudes de profesionales.</div>
        ) : (
          <div className={styles.list}>
            {profs.map((s) => {
              const busy = busyId === s.id;
              const contacto = [s.telefono, s.whatsapp && `WhatsApp ${s.whatsapp}`, s.email].filter(Boolean).join(' · ');
              const valor = (s.valorDesde || s.valorHasta)
                ? `${s.valorDesde ? `$${s.valorDesde.toLocaleString('es-AR')}` : ''}${s.valorDesde && s.valorHasta ? '–' : ''}${s.valorHasta ? `$${s.valorHasta.toLocaleString('es-AR')}` : ''}`
                : '';
              return (
                <article key={s.id} className={styles.card}>
                  <div className={styles.cardTop}>
                    <span className={`${styles.badge} ${badgeClass(s.estado)}`}>{badgeLabel(s.estado)}</span>
                    <h2 className={styles.name}>{s.nombre}</h2>
                    <span className={styles.fecha}>{formatFecha(s.createdAt)}</span>
                  </div>
                  <div className={styles.rows}>
                    <div className={styles.row}><span className={styles.k}>Especialidad: </span><span className={styles.v}>{ESPECIALIDAD_LABELS[s.especialidad] ?? s.especialidad}</span></div>
                    {s.matricula && <div className={styles.row}><span className={styles.k}>Matrícula: </span><span className={styles.v}>{s.matricula}</span></div>}
                    <div className={`${styles.row} ${styles.rowFull}`}><span className={styles.k}>Contacto: </span><span className={styles.v}>{contacto}</span></div>
                    {s.modalidades.length > 0 && <div className={`${styles.row} ${styles.rowFull}`}><span className={styles.k}>Atiende: </span><span className={styles.v}>{s.modalidades.map(labelModalidad).join(', ')}</span></div>}
                    {(s.direccionConsultorio || s.barrio) && <div className={`${styles.row} ${styles.rowFull}`}><span className={styles.k}>Consultorio: </span><span className={styles.v}>{[s.direccionConsultorio, s.barrio].filter(Boolean).join(', ')}</span></div>}
                    {s.obrasSociales && <div className={`${styles.row} ${styles.rowFull}`}><span className={styles.k}>Obras sociales: </span><span className={styles.v}>{s.obrasSociales}</span></div>}
                    {valor && <div className={`${styles.row} ${styles.rowFull}`}><span className={styles.k}>Valor consulta (interno): </span><span className={styles.v}>{valor}</span></div>}
                    {s.descripcion && <div className={`${styles.row} ${styles.rowFull}`}><span className={styles.k}>Descripción: </span><span className={styles.v}>{s.descripcion}</span></div>}
                  </div>
                  <Consent s={s} />
                  <div className={styles.actions}>
                    {s.estado !== 'publicada' && <button className={`${styles.btn} ${styles.btnPublish}`} onClick={() => publicarProf(s)} disabled={busy}>{busy ? 'Publicando…' : 'Publicar como profesional'}</button>}
                    {s.estado === 'pendiente' && <button className={`${styles.btn} ${styles.btnDiscard}`} onClick={() => descartarProf(s)} disabled={busy}>Descartar</button>}
                    <button className={`${styles.btn} ${styles.btnDelete}`} onClick={() => eliminarProf(s)} disabled={busy}>Eliminar</button>
                  </div>
                </article>
              );
            })}
          </div>
        )
      )}
    </div>
  );
}

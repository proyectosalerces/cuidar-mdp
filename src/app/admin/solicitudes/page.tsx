'use client';

/**
 * Admin — Residencia intake requests (bandeja de solicitudes).
 *
 * Review each submission (with the recorded consent) and, with one click,
 * publish it as a residencia in the directory. Also discard / delete.
 */

import { useEffect, useState, useCallback } from 'react';
import type { SolicitudResidencia } from '@/types/solicitud';
import {
  SERVICIOS_OPCIONES,
  TIPOS_HABITACION,
  TIPOS_CUIDADO_SOLICITUD,
} from '@/types/solicitud';
import {
  getSolicitudes,
  updateEstadoSolicitud,
  deleteSolicitud,
} from '@/services/solicitudes.service';
import { createResidencia } from '@/services/admin.service';
import styles from './page.module.css';

const HAB_LABEL: Record<string, string> = { si: 'Sí', no: 'No', 'en-tramite': 'En trámite' };

function labelServicio(k: string) { return SERVICIOS_OPCIONES.find((o) => o.value === k)?.label ?? k; }
function labelHab(k: string) { return TIPOS_HABITACION.find((o) => o.value === k)?.label ?? k; }
function labelCuidado(k: string) { return TIPOS_CUIDADO_SOLICITUD.find((o) => o.value === k)?.label ?? k; }

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

export default function AdminSolicitudesPage() {
  const [solicitudes, setSolicitudes] = useState<SolicitudResidencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setSolicitudes(await getSolicitudes());
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const publicar = async (s: SolicitudResidencia) => {
    if (!window.confirm(`¿Publicar "${s.nombre}" como residencia en el portal? Después podés editarla y sumarle fotos.`)) return;
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
      setSolicitudes((prev) => prev.map((x) => (x.id === s.id ? { ...x, estado: 'publicada' } : x)));
      window.alert(`"${s.nombre}" se publicó. Editala en Residencias para sumar fotos y ajustar detalles.`);
    } catch (err) {
      window.alert('Error al publicar: ' + (err as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const descartar = async (s: SolicitudResidencia) => {
    setBusyId(s.id);
    try {
      await updateEstadoSolicitud(s.id, 'descartada');
      setSolicitudes((prev) => prev.map((x) => (x.id === s.id ? { ...x, estado: 'descartada' } : x)));
    } finally {
      setBusyId(null);
    }
  };

  const eliminar = async (s: SolicitudResidencia) => {
    if (!window.confirm(`¿Eliminar definitivamente la solicitud de "${s.nombre}"?`)) return;
    setBusyId(s.id);
    try {
      await deleteSolicitud(s.id);
      setSolicitudes((prev) => prev.filter((x) => x.id !== s.id));
    } finally {
      setBusyId(null);
    }
  };

  const pendientes = solicitudes.filter((s) => s.estado === 'pendiente').length;

  const badgeClass = (e: string) =>
    e === 'publicada' ? styles.badgePublicada : e === 'descartada' ? styles.badgeDescartada : styles.badgePendiente;
  const badgeLabel = (e: string) =>
    e === 'publicada' ? 'Publicada' : e === 'descartada' ? 'Descartada' : 'Pendiente';

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Solicitudes de residencias</h1>
        <p className={styles.intro}>
          Formularios que completaron las residencias desde <strong>/alta-residencia</strong>.
          Revisá cada una y publicala como residencia con un clic.
          {!loading && <> Hay <strong>{pendientes}</strong> pendiente(s).</>}
        </p>
      </header>

      {loading && <div className={styles.loading}>Cargando solicitudes…</div>}

      {!loading && solicitudes.length === 0 && (
        <div className={styles.empty}>
          Todavía no llegaron solicitudes. Cuando una residencia complete el formulario, aparece acá.
        </div>
      )}

      {!loading && solicitudes.length > 0 && (
        <div className={styles.list}>
          {solicitudes.map((s) => {
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
                  {s.actividades && <div className={`${styles.row} ${styles.rowFull}`}><span className={styles.k}>Actividades: </span><span className={styles.v}>{s.actividades}</span></div>}
                  {s.regimenVisitas && <div className={`${styles.row} ${styles.rowFull}`}><span className={styles.k}>Visitas: </span><span className={styles.v}>{s.regimenVisitas}</span></div>}
                </div>

                <div className={styles.consent}>
                  ✓ {s.autoriza ? 'Autorizó la publicación' : 'NO autorizó'} · Firmó:{' '}
                  <strong>{`${s.autorizanteNombre ?? ''} ${s.autorizanteApellido ?? ''}`.trim() || '—'}</strong>
                  {s.autorizanteCargo ? ` (${s.autorizanteCargo})` : ''}
                  {s.autorizanteDni ? ` · DNI ${s.autorizanteDni}` : ''}
                  {s.autorizanteTelefono ? ` · Tel ${s.autorizanteTelefono}` : ''}
                  {s.autorizanteEmail ? ` · ${s.autorizanteEmail}` : ''}
                  {s.textoVersion ? ` · texto: ${s.textoVersion}` : ''}
                </div>

                <div className={styles.actions}>
                  {s.estado !== 'publicada' && (
                    <button className={`${styles.btn} ${styles.btnPublish}`} onClick={() => publicar(s)} disabled={busy}>
                      {busy ? 'Publicando…' : 'Publicar como residencia'}
                    </button>
                  )}
                  {s.estado === 'pendiente' && (
                    <button className={`${styles.btn} ${styles.btnDiscard}`} onClick={() => descartar(s)} disabled={busy}>
                      Descartar
                    </button>
                  )}
                  <button className={`${styles.btn} ${styles.btnDelete}`} onClick={() => eliminar(s)} disabled={busy}>
                    Eliminar
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

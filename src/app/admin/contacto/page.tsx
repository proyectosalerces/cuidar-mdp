'use client';

/**
 * Admin — Contacto / Mensajes page
 * Two tabs: Mensajes de contacto + Solicitudes de asesoramiento
 */

import { useEffect, useState, useCallback } from 'react';
import {
  getContactMessages,
  getConsultaRequests,
  markMessageAsRead,
  deleteMessage,
  type ContactMessage,
  type ConsultaRequest,
} from '@/services/admin.service';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import styles from './page.module.css';

type Tab = 'contactos' | 'consultas';

const URGENCIA_LABELS: Record<string, string> = {
  inmediata: 'Inmediata',
  'proximas-semanas': 'Próximas semanas',
  'proximo-mes': 'Próximo mes',
  'explorando-opciones': 'Explorando opciones',
};

const PARENTESCO_LABELS: Record<string, string> = {
  'hijo-a': 'Hijo/a',
  'nieto-a': 'Nieto/a',
  'sobrino-a': 'Sobrino/a',
  conyuge: 'Cónyuge',
  'hermano-a': 'Hermano/a',
  otro: 'Otro',
};

const ESTADO_LABELS: Record<string, string> = {
  pendiente: 'Pendiente',
  'en-proceso': 'En proceso',
  completada: 'Completada',
};

export default function AdminContactoPage() {
  const [activeTab, setActiveTab] = useState<Tab>('contactos');
  const [contactos, setContactos] = useState<ContactMessage[]>([]);
  const [consultas, setConsultas] = useState<ConsultaRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    collection: string;
    nombre: string;
  } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const [msgs, reqs] = await Promise.all([
        getContactMessages(),
        getConsultaRequests(),
      ]);
      setContactos(msgs);
      setConsultas(reqs);
    } catch (err) {
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('es-AR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateStr;
    }
  };

  /* Mark as read */
  const handleMarkAsRead = async (id: string) => {
    try {
      await markMessageAsRead('contactos', id);
      setContactos((prev) =>
        prev.map((m) => (m.id === id ? { ...m, leido: true } : m)),
      );
      showToast('Marcado como leído', 'success');
    } catch {
      showToast('Error al actualizar', 'error');
    }
  };

  /* Change consulta estado */
  const handleChangeEstado = async (
    id: string,
    estado: ConsultaRequest['estado'],
  ) => {
    try {
      const docRef = doc(db, 'consultas', id);
      await updateDoc(docRef, { estado });
      setConsultas((prev) =>
        prev.map((c) => (c.id === id ? { ...c, estado } : c)),
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
      await deleteMessage(deleteTarget.collection, deleteTarget.id);
      if (deleteTarget.collection === 'contactos') {
        setContactos((prev) => prev.filter((m) => m.id !== deleteTarget.id));
      } else {
        setConsultas((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      }
      showToast('Mensaje eliminado', 'success');
    } catch {
      showToast('Error al eliminar', 'error');
    } finally {
      setDeleteTarget(null);
    }
  };

  const unreadCount = contactos.filter((m) => !m.leido).length;
  const pendingCount = consultas.filter((c) => c.estado === 'pendiente').length;

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Mensajes</h1>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === 'contactos' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('contactos')}
        >
          Mensajes de contacto
          {unreadCount > 0 && (
            <span className={`${styles.tabBadge} ${styles.tabBadgeUnread}`}>
              {unreadCount}
            </span>
          )}
        </button>
        <button
          className={`${styles.tab} ${activeTab === 'consultas' ? styles.tabActive : ''}`}
          onClick={() => setActiveTab('consultas')}
        >
          Solicitudes de asesoramiento
          {pendingCount > 0 && (
            <span className={`${styles.tabBadge} ${styles.tabBadgeUnread}`}>
              {pendingCount}
            </span>
          )}
        </button>
      </div>

      {/* Content */}
      {loading ? (
        <div className={styles.empty}>
          <p>Cargando...</p>
        </div>
      ) : activeTab === 'contactos' ? (
        /* Contactos Tab */
        contactos.length === 0 ? (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>📬</div>
            <p>No hay mensajes de contacto</p>
          </div>
        ) : (
          <div className={styles.cardsList}>
            {contactos.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.card} ${!msg.leido ? styles.cardUnread : ''}`}
              >
                <div className={styles.cardHeader}>
                  <div className={styles.cardInfo}>
                    <div className={styles.cardName}>{msg.nombre}</div>
                    <div className={styles.cardMeta}>
                      <span className={styles.cardMetaItem}>
                        ✉️ {msg.email}
                      </span>
                      {msg.telefono && (
                        <span className={styles.cardMetaItem}>
                          📞 {msg.telefono}
                        </span>
                      )}
                      <span className={styles.cardMetaItem}>
                        🕐 {formatDate(msg.createdAt)}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`${styles.cardBadge} ${
                      msg.leido ? styles.badgeLeido : styles.badgeNoLeido
                    }`}
                  >
                    {msg.leido ? 'Leído' : 'No leído'}
                  </span>
                </div>

                <div className={styles.cardBody}>
                  {msg.asunto && (
                    <div className={styles.cardAsunto}>
                      Asunto: {msg.asunto}
                    </div>
                  )}
                  <div className={styles.cardMessage}>{msg.mensaje}</div>
                </div>

                <div className={styles.cardActions}>
                  {!msg.leido && (
                    <button
                      className={styles.markReadBtn}
                      onClick={() => handleMarkAsRead(msg.id)}
                    >
                      ✓ Marcar como leído
                    </button>
                  )}
                  <button
                    className={styles.deleteCardBtn}
                    onClick={() =>
                      setDeleteTarget({
                        id: msg.id,
                        collection: 'contactos',
                        nombre: msg.nombre,
                      })
                    }
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : /* Consultas Tab */
      consultas.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📋</div>
          <p>No hay solicitudes de asesoramiento</p>
        </div>
      ) : (
        <div className={styles.cardsList}>
          {consultas.map((req) => (
            <div key={req.id} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardInfo}>
                  <div className={styles.cardName}>{req.nombreFamiliar}</div>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardMetaItem}>
                      ✉️ {req.emailFamiliar}
                    </span>
                    {req.telefonoFamiliar && (
                      <span className={styles.cardMetaItem}>
                        📞 {req.telefonoFamiliar}
                      </span>
                    )}
                    <span className={styles.cardMetaItem}>
                      🕐 {formatDate(req.createdAt)}
                    </span>
                  </div>
                </div>
                <span
                  className={`${styles.cardBadge} ${
                    req.estado === 'pendiente'
                      ? styles.badgePendiente
                      : req.estado === 'en-proceso'
                        ? styles.badgeEnProceso
                        : styles.badgeCompletada
                  }`}
                >
                  {ESTADO_LABELS[req.estado] ?? req.estado}
                </span>
              </div>

              <div className={styles.consultaDetails}>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Parentesco</span>
                  <span className={styles.detailValue}>
                    {PARENTESCO_LABELS[req.parentesco] ?? req.parentesco}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Adulto mayor</span>
                  <span className={styles.detailValue}>
                    {req.nombreAdultoMayor} ({req.edadAdultoMayor} años)
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Urgencia</span>
                  <span className={styles.detailValue}>
                    {URGENCIA_LABELS[req.urgencia] ?? req.urgencia}
                  </span>
                </div>
                {req.barrioPreferido && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Barrio preferido</span>
                    <span className={styles.detailValue}>
                      {req.barrioPreferido}
                    </span>
                  </div>
                )}
                {req.obraSocial && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Obra social</span>
                    <span className={styles.detailValue}>
                      {req.obraSocial}
                    </span>
                  </div>
                )}
                {req.presupuestoEstimado && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Presupuesto</span>
                    <span className={styles.detailValue}>
                      {req.presupuestoEstimado}
                    </span>
                  </div>
                )}
                <div className={`${styles.detailItem} ${styles.detailFullWidth}`}>
                  <span className={styles.detailLabel}>Situación actual</span>
                  <span className={styles.detailValue}>
                    {req.situacionActual}
                  </span>
                </div>
                {req.necesidadesCuidado?.length > 0 && (
                  <div className={`${styles.detailItem} ${styles.detailFullWidth}`}>
                    <span className={styles.detailLabel}>Necesidades de cuidado</span>
                    <span className={styles.detailValue}>
                      {req.necesidadesCuidado.join(', ')}
                    </span>
                  </div>
                )}
                {req.tiposCuidadoBuscados?.length > 0 && (
                  <div className={`${styles.detailItem} ${styles.detailFullWidth}`}>
                    <span className={styles.detailLabel}>Tipos de cuidado buscados</span>
                    <span className={styles.detailValue}>
                      {req.tiposCuidadoBuscados.join(', ')}
                    </span>
                  </div>
                )}
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Movilidad reducida</span>
                  <span className={styles.detailValue}>
                    {req.movilidadReducida ? 'Sí' : 'No'}
                  </span>
                </div>
                <div className={styles.detailItem}>
                  <span className={styles.detailLabel}>Deterioro cognitivo</span>
                  <span className={styles.detailValue}>
                    {req.deterioroCognitivo ? 'Sí' : 'No'}
                  </span>
                </div>
                {req.comentariosAdicionales && (
                  <div className={`${styles.detailItem} ${styles.detailFullWidth}`}>
                    <span className={styles.detailLabel}>Comentarios</span>
                    <span className={styles.detailValue}>
                      {req.comentariosAdicionales}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.cardActions}>
                <select
                  className={styles.estadoSelect}
                  value={req.estado}
                  onChange={(e) =>
                    handleChangeEstado(
                      req.id,
                      e.target.value as ConsultaRequest['estado'],
                    )
                  }
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="en-proceso">En proceso</option>
                  <option value="completada">Completada</option>
                </select>
                <button
                  className={styles.deleteCardBtn}
                  onClick={() =>
                    setDeleteTarget({
                      id: req.id,
                      collection: 'consultas',
                      nombre: req.nombreFamiliar,
                    })
                  }
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation dialog */}
      {deleteTarget && (
        <div className={styles.dialogOverlay}>
          <div className={styles.dialog}>
            <h3 className={styles.dialogTitle}>¿Eliminar mensaje?</h3>
            <p className={styles.dialogMessage}>
              Estás por eliminar el mensaje de{' '}
              <strong>{deleteTarget.nombre}</strong>. Esta acción no se puede
              deshacer.
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

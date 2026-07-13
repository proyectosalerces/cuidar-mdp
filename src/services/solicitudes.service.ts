/**
 * Service for residencia intake requests (`solicitudes` collection).
 *
 * Public create (from the /alta-residencia form); admin read/update/delete.
 */

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import type {
  SolicitudResidencia,
  SolicitudFormData,
  EstadoSolicitud,
} from '@/types/solicitud';

const COLLECTION = 'solicitudes';

/** Remove undefined values (Firestore rejects them). */
function clean<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out;
}

/** Create a new intake request (public). */
export async function crearSolicitud(data: SolicitudFormData): Promise<void> {
  await addDoc(collection(db, COLLECTION), {
    ...clean(data as unknown as Record<string, unknown>),
    estado: 'pendiente',
    createdAt: serverTimestamp(),
  });
}

function mapDoc(d: { id: string; data: () => Record<string, unknown> }): SolicitudResidencia {
  const data = d.data();
  const createdAt =
    data.createdAt instanceof Object && 'toDate' in data.createdAt
      ? (data.createdAt as Timestamp).toDate().toISOString()
      : (data.createdAt as string) ?? '';
  return { ...(data as object), id: d.id, createdAt } as SolicitudResidencia;
}

/** List all intake requests, newest first (admin). */
export async function getSolicitudes(): Promise<SolicitudResidencia[]> {
  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(mapDoc);
  } catch (err) {
    console.warn('[Solicitudes] Error fetching:', err);
    return [];
  }
}

/** Change a request's status (admin). */
export async function updateEstadoSolicitud(id: string, estado: EstadoSolicitud): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { estado });
}

/** Delete a request (admin). */
export async function deleteSolicitud(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

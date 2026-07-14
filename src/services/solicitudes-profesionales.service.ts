/**
 * Service for professional intake requests (`solicitudesProfesionales`).
 * Public create; admin read/update/delete.
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
  SolicitudProfesional,
  SolicitudProfesionalFormData,
} from '@/types/solicitud-profesional';
import type { EstadoSolicitud } from '@/types/solicitud';

const COLLECTION = 'solicitudesProfesionales';

function clean<T extends Record<string, unknown>>(obj: T): Record<string, unknown> {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out;
}

export async function crearSolicitudProfesional(data: SolicitudProfesionalFormData): Promise<void> {
  await addDoc(collection(db, COLLECTION), {
    ...clean(data as unknown as Record<string, unknown>),
    estado: 'pendiente',
    createdAt: serverTimestamp(),
  });
}

function mapDoc(d: { id: string; data: () => Record<string, unknown> }): SolicitudProfesional {
  const data = d.data();
  const createdAt =
    data.createdAt instanceof Object && 'toDate' in data.createdAt
      ? (data.createdAt as Timestamp).toDate().toISOString()
      : (data.createdAt as string) ?? '';
  return { ...(data as object), id: d.id, createdAt } as SolicitudProfesional;
}

export async function getSolicitudesProfesionales(): Promise<SolicitudProfesional[]> {
  try {
    const q = query(collection(db, COLLECTION), orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    return snap.docs.map(mapDoc);
  } catch (err) {
    console.warn('[SolicitudesProfesionales] Error fetching:', err);
    return [];
  }
}

export async function updateEstadoSolicitudProfesional(id: string, estado: EstadoSolicitud): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { estado });
}

export async function deleteSolicitudProfesional(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

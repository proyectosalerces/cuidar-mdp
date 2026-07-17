/**
 * Contact-link click tracking service.
 *
 * `registrarClick` is fire-and-forget: it never blocks the click/navigation
 * and silently ignores errors. Reads are admin-only (see firestore.rules).
 */

import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import type { ClickEvento, CanalClick, ClickEntidadTipo } from '@/types/click';

const COLLECTION = 'clicks';

interface RegistrarClickInput {
  canal: CanalClick;
  entidadTipo: ClickEntidadTipo;
  entidadId: string;
  entidadNombre: string;
}

/** Record a contact-link click. Fire-and-forget (does not block the UI). */
export function registrarClick(data: RegistrarClickInput): void {
  try {
    void addDoc(collection(db, COLLECTION), {
      ...data,
      fecha: serverTimestamp(),
    }).catch(() => {});
  } catch {
    /* never let tracking break a click */
  }
}

/** Fetch click events, newest first (admin). Capped to avoid huge reads. */
export async function getClicks(max = 5000): Promise<ClickEvento[]> {
  try {
    const q = query(collection(db, COLLECTION), orderBy('fecha', 'desc'), limit(max));
    const snap = await getDocs(q);
    return snap.docs.map((d) => {
      const data = d.data();
      const fecha =
        data.fecha instanceof Object && 'toDate' in data.fecha
          ? (data.fecha as Timestamp).toDate().toISOString()
          : (data.fecha as string) ?? '';
      return { ...(data as object), id: d.id, fecha } as ClickEvento;
    });
  } catch (err) {
    console.warn('[Clicks] Error fetching:', err);
    return [];
  }
}

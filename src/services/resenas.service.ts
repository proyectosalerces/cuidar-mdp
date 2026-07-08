/**
 * Reseñas (reviews) service — Firestore-backed.
 *
 * Stores reviews in the 'resenas' collection in Firestore.
 * Falls back to mock data if Firestore is empty.
 */

import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import type { AppUser } from '@/services/firebase/auth';
import type {
  Resena,
  ResenaFormData,
  ResenaStats,
  EntidadTipo,
} from '@/types/resena';

/* ── Constants ─────────────────────────────────────────────────────────── */

const COLLECTION = 'resenas';

/* ── Helpers ───────────────────────────────────────────────────────────── */

/** Map a Firestore document to a Resena object. */
function mapDoc(doc: { id: string; data: () => Record<string, unknown> }): Resena {
  const d = doc.data();
  return {
    id: doc.id,
    autorId: (d.autorId as string) ?? '',
    autorNombre: (d.autorNombre as string) ?? 'Usuario',
    autorEmail: (d.autorEmail as string) ?? '',
    entidadId: (d.entidadId as string) ?? '',
    entidadTipo: (d.entidadTipo as EntidadTipo) ?? 'residencia',
    calificacion: (d.calificacion as number) ?? 5,
    calificaciones: (d.calificaciones as Record<string, number>) ?? undefined,
    titulo: (d.titulo as string) ?? '',
    comentario: (d.comentario as string) ?? '',
    fecha: d.fecha instanceof Object && 'toDate' in d.fecha
      ? (d.fecha as Timestamp).toDate().toISOString()
      : (d.fecha as string) ?? new Date().toISOString(),
    aprobada: (d.aprobada as boolean) ?? false,
  };
}

/* ── Public API ────────────────────────────────────────────────────────── */

/**
 * Returns approved reviews for a given entity, sorted by date desc.
 */
export async function getResenas(
  entidadId: string,
  entidadTipo: EntidadTipo,
): Promise<Resena[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('entidadId', '==', entidadId),
      where('entidadTipo', '==', entidadTipo),
      where('aprobada', '==', true),
      orderBy('fecha', 'desc'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDoc);
  } catch (err) {
    console.warn('[Resenas] Firestore query error, returning empty:', err);
    return [];
  }
}

/**
 * Computes stats from approved reviews for an entity.
 */
export async function getResenaStats(
  entidadId: string,
  entidadTipo: EntidadTipo,
): Promise<ResenaStats> {
  const approved = await getResenas(entidadId, entidadTipo);

  const distribucion: Record<1 | 2 | 3 | 4 | 5, number> = {
    1: 0, 2: 0, 3: 0, 4: 0, 5: 0,
  };

  let sum = 0;
  for (const r of approved) {
    const star = Math.min(5, Math.max(1, Math.round(r.calificacion))) as 1 | 2 | 3 | 4 | 5;
    distribucion[star]++;
    sum += r.calificacion;
  }

  return {
    promedio: approved.length > 0 ? sum / approved.length : 0,
    total: approved.length,
    distribucion,
  };
}

/**
 * Creates a new review with `aprobada: false` in Firestore.
 */
export async function crearResena(
  data: ResenaFormData,
  user: AppUser,
  entidadId: string,
  entidadTipo: EntidadTipo,
): Promise<Resena> {
  const docData = {
    autorId: user.uid,
    autorNombre: user.displayName ?? 'Usuario',
    autorEmail: user.email ?? '',
    entidadId,
    entidadTipo,
    calificacion: data.calificacion,
    calificaciones: data.calificaciones ?? {},
    titulo: data.titulo.trim(),
    comentario: data.comentario.trim(),
    fecha: serverTimestamp(),
    aprobada: false,
  };

  const docRef = await addDoc(collection(db, COLLECTION), docData);

  return {
    id: docRef.id,
    autorId: docData.autorId,
    autorNombre: docData.autorNombre,
    autorEmail: docData.autorEmail,
    entidadId: docData.entidadId,
    entidadTipo: docData.entidadTipo,
    calificacion: docData.calificacion,
    calificaciones: docData.calificaciones,
    titulo: docData.titulo,
    comentario: docData.comentario,
    fecha: new Date().toISOString(),
    aprobada: false,
  };
}

/* ── Admin API ─────────────────────────────────────────────────────────── */

/**
 * Returns ALL reviews (approved + pending), newest first. Admin only.
 */
export async function getAllResenas(): Promise<Resena[]> {
  try {
    const q = query(collection(db, COLLECTION), orderBy('fecha', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDoc);
  } catch (err) {
    console.warn('[Resenas] Error fetching all reviews:', err);
    return [];
  }
}

/** Approve or hide a review (toggle its `aprobada` flag). Admin only. */
export async function setResenaAprobada(id: string, aprobada: boolean): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), { aprobada });
}

/** Edit a review's title / comment / rating(s). Admin only. */
export async function updateResena(
  id: string,
  data: Partial<Pick<Resena, 'titulo' | 'comentario' | 'calificacion' | 'calificaciones'>>,
): Promise<void> {
  await updateDoc(doc(db, COLLECTION, id), data);
}

/** Permanently delete a review. Admin only. */
export async function deleteResena(id: string): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, id));
}

/**
 * Returns all reviews by a given user (approved + pending).
 */
export async function getMisResenas(autorId: string): Promise<Resena[]> {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('autorId', '==', autorId),
      orderBy('fecha', 'desc'),
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(mapDoc);
  } catch (err) {
    console.warn('[Resenas] Error fetching user reviews:', err);
    return [];
  }
}

/**
 * Check whether a user already reviewed a specific entity.
 */
export async function yaReseno(
  autorId: string,
  entidadId: string,
  entidadTipo: EntidadTipo,
): Promise<boolean> {
  try {
    const q = query(
      collection(db, COLLECTION),
      where('autorId', '==', autorId),
      where('entidadId', '==', entidadId),
      where('entidadTipo', '==', entidadTipo),
    );
    const snapshot = await getDocs(q);
    return !snapshot.empty;
  } catch {
    return false;
  }
}

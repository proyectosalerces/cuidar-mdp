/**
 * Admin Service — CRUD operations for residencias & profesionales
 *
 * Uses Firebase client SDK (Firestore + Storage).
 */

import {
  collection,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  getDocs,
  getDoc,
  serverTimestamp,
  query,
  orderBy,
} from 'firebase/firestore';
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage';
import { db, storage } from '@/services/firebase/config';
import type { Residencia } from '@/types/residencia';
import type { Profesional } from '@/types/profesional';

/* ── Helpers ───────────────────────────────────────────────────────────── */

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9\s-]/g, '')   // remove special chars
    .trim()
    .replace(/\s+/g, '-')           // spaces to hyphens
    .replace(/-+/g, '-');            // collapse multiple hyphens
}

/* ── Residencias ──────────────────────────────────────────────────────── */

export async function getResidencias(): Promise<Residencia[]> {
  const q = query(collection(db, 'residencias'), orderBy('nombre'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Residencia);
}

export async function getResidenciaById(id: string): Promise<Residencia | null> {
  const docRef = doc(db, 'residencias', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Residencia;
}

export async function createResidencia(data: Partial<Residencia>): Promise<string> {
  const slug = generateSlug(data.nombre ?? '');
  const docRef = doc(db, 'residencias', slug);

  await setDoc(docRef, {
    ...data,
    slug,
    ciudad: data.ciudad ?? 'Mar del Plata',
    calificacion: data.calificacion ?? 0,
    cantidadResenas: data.cantidadResenas ?? 0,
    imagenes: data.imagenes ?? [],
    imagenPrincipal: data.imagenPrincipal ?? '',
    servicios: data.servicios ?? [],
    tiposCuidado: data.tiposCuidado ?? [],
    habilitada: data.habilitada ?? true,
    verificada: data.verificada ?? false,
    destacada: data.destacada ?? false,
    activa: data.activa ?? true,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return slug;
}

export async function updateResidencia(
  id: string,
  data: Partial<Residencia>,
): Promise<void> {
  const docRef = doc(db, 'residencias', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteResidencia(id: string): Promise<void> {
  const docRef = doc(db, 'residencias', id);
  await deleteDoc(docRef);
}

/* ── Profesionales ────────────────────────────────────────────────────── */

export async function getProfesionales(): Promise<Profesional[]> {
  const q = query(collection(db, 'profesionales'), orderBy('nombre'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as Profesional);
}

export async function getProfesionalById(id: string): Promise<Profesional | null> {
  const docRef = doc(db, 'profesionales', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Profesional;
}

export async function createProfesional(data: Partial<Profesional>): Promise<string> {
  const slug = generateSlug(data.nombre ?? '');
  const docRef = doc(db, 'profesionales', slug);

  await setDoc(docRef, {
    ...data,
    slug,
    calificacion: data.calificacion ?? 0,
    cantidadResenas: data.cantidadResenas ?? 0,
    foto: data.foto ?? '',
    activo: data.activo ?? true,
    createdAt: serverTimestamp(),
  });

  return slug;
}

export async function updateProfesional(
  id: string,
  data: Partial<Profesional>,
): Promise<void> {
  const docRef = doc(db, 'profesionales', id);
  await updateDoc(docRef, { ...data });
}

export async function deleteProfesional(id: string): Promise<void> {
  const docRef = doc(db, 'profesionales', id);
  await deleteDoc(docRef);
}

/* ── Image Uploads ────────────────────────────────────────────────────── */

export async function uploadImage(file: File, path: string): Promise<string> {
  const storageRef = ref(storage, path);
  const snapshot = await uploadBytes(storageRef, file);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
}

export async function deleteImage(url: string): Promise<void> {
  try {
    const storageRef = ref(storage, url);
    await deleteObject(storageRef);
  } catch {
    // Image may not exist — ignore
  }
}

/* ── Stats ────────────────────────────────────────────────────────────── */

export async function getStats(): Promise<{
  totalResidencias: number;
  totalProfesionales: number;
  totalResenas: number;
}> {
  const [residenciasSnap, profesionalesSnap, resenasSnap] = await Promise.all([
    getDocs(collection(db, 'residencias')),
    getDocs(collection(db, 'profesionales')),
    getDocs(collection(db, 'resenas')),
  ]);

  return {
    totalResidencias: residenciasSnap.size,
    totalProfesionales: profesionalesSnap.size,
    totalResenas: resenasSnap.size,
  };
}

/* ── Blog ─────────────────────────────────────────────────────────────── */

import type { BlogPost } from '@/types/blog';
import type { ContactoFormData, SolicitudConsultaFormData } from '@/types/contacto';

export interface ContactMessage extends ContactoFormData {
  id: string;
  createdAt: string;
  leido: boolean;
}

export interface ConsultaRequest extends SolicitudConsultaFormData {
  id: string;
  createdAt: string;
  estado: 'pendiente' | 'en-proceso' | 'completada';
}

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const q = query(collection(db, 'blog'), orderBy('fechaPublicacion', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as BlogPost);
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  const docRef = doc(db, 'blog', id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as BlogPost;
}

export async function createBlogPost(data: Partial<BlogPost>): Promise<string> {
  const slug = generateSlug(data.titulo ?? '');
  const docRef = doc(db, 'blog', slug);

  await setDoc(docRef, {
    ...data,
    slug,
    autor: data.autor ?? { nombre: 'Equipo Cuidar MdP' },
    tags: data.tags ?? [],
    imagenPortada: data.imagenPortada ?? '',
    publicado: data.publicado ?? false,
    tiempoLectura: data.tiempoLectura ?? 5,
    fechaPublicacion: data.fechaPublicacion ?? new Date().toISOString(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return slug;
}

export async function updateBlogPost(
  id: string,
  data: Partial<BlogPost>,
): Promise<void> {
  const docRef = doc(db, 'blog', id);
  await updateDoc(docRef, {
    ...data,
    updatedAt: serverTimestamp(),
  });
}

export async function deleteBlogPost(id: string): Promise<void> {
  const docRef = doc(db, 'blog', id);
  await deleteDoc(docRef);
}

/* ── Contacto / Consultas ─────────────────────────────────────────────── */

export async function getContactMessages(): Promise<ContactMessage[]> {
  const q = query(collection(db, 'contactos'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? data.createdAt ?? '',
      leido: data.leido ?? false,
    } as ContactMessage;
  });
}

export async function getConsultaRequests(): Promise<ConsultaRequest[]> {
  const q = query(collection(db, 'consultas'), orderBy('createdAt', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => {
    const data = d.data();
    return {
      ...data,
      id: d.id,
      createdAt: data.createdAt?.toDate?.()?.toISOString?.() ?? data.createdAt ?? '',
      estado: data.estado ?? 'pendiente',
    } as ConsultaRequest;
  });
}

export async function markMessageAsRead(
  collectionName: string,
  id: string,
): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, { leido: true });
}

export async function deleteMessage(
  collectionName: string,
  id: string,
): Promise<void> {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);
}

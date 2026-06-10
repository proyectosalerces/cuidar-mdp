/**
 * Service layer for contact and consultation forms
 *
 * Saves data to Firebase Firestore collections.
 */

import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import type { ContactoFormData, SolicitudConsultaFormData } from '@/types/contacto';

/**
 * Submit a general contact form — saves to Firestore 'contactos' collection
 */
export async function enviarContacto(
  data: ContactoFormData
): Promise<void> {
  await addDoc(collection(db, 'contactos'), {
    ...data,
    leido: false,
    createdAt: serverTimestamp(),
  });
}

/**
 * Submit a personalized care consultation request — saves to Firestore 'consultas' collection
 */
export async function solicitarAsesoramiento(
  data: SolicitudConsultaFormData
): Promise<void> {
  await addDoc(collection(db, 'consultas'), {
    ...data,
    estado: 'pendiente',
    createdAt: serverTimestamp(),
  });
}

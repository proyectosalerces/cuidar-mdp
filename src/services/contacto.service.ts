/**
 * Service layer for contact and consultation forms
 *
 * Currently logs data to console. Will be replaced with Firebase Firestore
 * writes and email notifications once the backend is connected.
 */

import type { ContactoFormData, SolicitudConsultaFormData } from '@/types/contacto';

/**
 * Submit a general contact form
 *
 * TODO: Save to Firestore 'contactos' collection and trigger email notification
 */
export async function enviarContacto(
  data: ContactoFormData
): Promise<void> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800));

  console.log('[Contacto] Formulario de contacto recibido:', {
    nombre: data.nombre,
    email: data.email,
    asunto: data.asunto ?? '(sin asunto)',
    timestamp: new Date().toISOString(),
  });

  // TODO: Save to Firestore
  // const docRef = await addDoc(collection(db, 'contactos'), {
  //   ...data,
  //   createdAt: serverTimestamp(),
  //   leido: false,
  // });
}

/**
 * Submit a personalized care consultation request
 *
 * TODO: Save to Firestore 'consultas' collection and trigger priority email notification
 */
export async function solicitarAsesoramiento(
  data: SolicitudConsultaFormData
): Promise<void> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1200));

  console.log('[Contacto] Solicitud de asesoramiento recibida:', {
    nombreFamiliar: data.nombreFamiliar,
    emailFamiliar: data.emailFamiliar,
    urgencia: data.urgencia,
    tiposCuidado: data.tiposCuidadoBuscados,
    timestamp: new Date().toISOString(),
  });

  // TODO: Save to Firestore
  // const docRef = await addDoc(collection(db, 'consultas'), {
  //   ...data,
  //   createdAt: serverTimestamp(),
  //   estado: 'pendiente',
  //   asignadoA: null,
  // });
}

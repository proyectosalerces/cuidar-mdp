/**
 * Firebase Storage service for image uploads
 *
 * TODO: Implement after installing firebase package.
 * Currently exports skeleton functions with proper TypeScript signatures.
 */

// TODO: Uncomment after installing firebase
// import {
//   ref,
//   uploadBytes,
//   getDownloadURL,
//   deleteObject,
// } from 'firebase/storage';
// import { storage } from './config';

export interface UploadResult {
  url: string | null;
  path: string | null;
  error: string | null;
}

/**
 * Upload an image to Firebase Storage
 * @param file - The file or blob to upload
 * @param path - Storage path, e.g. 'residencias/sol-otono/foto-1.jpg'
 */
export async function uploadImage(
  file: File | Blob,
  path: string
): Promise<UploadResult> {
  // TODO: Implement with Firebase Storage
  // const storageRef = ref(storage, path);
  // const snapshot = await uploadBytes(storageRef, file);
  // const url = await getDownloadURL(snapshot.ref);
  // return { url, path, error: null };
  console.warn('[Storage] uploadImage called — Firebase not configured yet');
  void file;
  void path;
  return { url: null, path: null, error: 'Firebase Storage no está configurado todavía.' };
}

/**
 * Delete an image from Firebase Storage
 * @param path - Storage path of the image to delete
 */
export async function deleteImage(path: string): Promise<{ error: string | null }> {
  // TODO: Implement with Firebase Storage
  // const storageRef = ref(storage, path);
  // await deleteObject(storageRef);
  // return { error: null };
  console.warn('[Storage] deleteImage called — Firebase not configured yet');
  void path;
  return { error: 'Firebase Storage no está configurado todavía.' };
}

/**
 * Get the download URL of a stored image
 * @param path - Storage path of the image
 */
export async function getImageUrl(path: string): Promise<string | null> {
  // TODO: Implement with Firebase Storage
  // const storageRef = ref(storage, path);
  // return getDownloadURL(storageRef);
  console.warn('[Storage] getImageUrl called — Firebase not configured yet');
  void path;
  return null;
}

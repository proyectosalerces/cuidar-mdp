/**
 * /mis-resenas — page showing the logged-in user's reviews.
 *
 * For now this is a simple placeholder that lists
 * the user's reviews (approved + pending) from localStorage.
 */

import type { Metadata } from 'next';
import MisResenasView from './MisResenasView';

export const metadata: Metadata = {
  title: 'Mis reseñas',
  description: 'Revisá todas las reseñas que dejaste en Cuidar MdP.',
  robots: { index: false, follow: false },
};

export default function MisResenasPage() {
  return <MisResenasView />;
}

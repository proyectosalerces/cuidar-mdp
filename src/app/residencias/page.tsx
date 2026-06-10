/**
 * /residencias — Search & Filter listing page
 *
 * Server component that renders the client-side ResidenciasPage wrapper.
 */

import type { Metadata } from 'next';
import ResidenciasPage from '@/components/residencias/ResidenciasPage';

export const metadata: Metadata = {
  title: 'Residencias Geriátricas',
  description:
    'Explorá residencias geriátricas verificadas en Mar del Plata. Filtrá por barrio, tipo de cuidado, precio y calificación para encontrar el mejor lugar para tu ser querido.',
  openGraph: {
    title: 'Residencias Geriátricas — Cuidar MdP',
    description:
      'Encontrá la residencia ideal en Mar del Plata. Comparamos opciones verificadas con toda la información que necesitás.',
  },
};

export default function ResidenciasPageRoute() {
  return <ResidenciasPage />;
}

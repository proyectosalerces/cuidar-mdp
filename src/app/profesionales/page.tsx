/**
 * /profesionales — Directory listing page
 *
 * Server component that renders the client-side ProfesionalesPage wrapper.
 */

import type { Metadata } from 'next';
import ProfesionalesPage from '@/components/profesionales/ProfesionalesPage';

export const metadata: Metadata = {
  title: 'Profesionales de Salud Geriátrica',
  description:
    'Encontrá profesionales de salud geriátrica verificados en Mar del Plata. Geriatras, gerontólogos, kinesiólogos, psicólogos y más especialistas para el cuidado del adulto mayor.',
  alternates: {
    canonical: '/profesionales',
  },
  openGraph: {
    title: 'Profesionales de Salud Geriátrica — Cuidar MdP',
    description:
      'Directorio de profesionales especializados en el cuidado del adulto mayor en Mar del Plata. Encontrá al especialista que necesitás.',
  },
};

export default function ProfesionalesPageRoute() {
  return <ProfesionalesPage />;
}

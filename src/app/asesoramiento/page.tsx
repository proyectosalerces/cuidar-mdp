import type { Metadata } from 'next';
import AsesoramientoForm from '@/components/asesoramiento/AsesoramientoForm';

export const metadata: Metadata = {
  title: 'Asesoramiento Personalizado',
  description:
    'Solicitá un asesoramiento personalizado para encontrar la mejor opción de cuidado geriátrico en Mar del Plata. Completá el formulario y recibí una recomendación a medida.',
  alternates: {
    canonical: '/asesoramiento',
  },
  openGraph: {
    title: 'Asesoramiento Personalizado — Cuidar MdP',
    description:
      'Encontrá la mejor opción de cuidado para tu ser querido en Mar del Plata con nuestro asesoramiento gratuito.',
  },
};

export default function AsesoramientoPage() {
  return <AsesoramientoForm />;
}

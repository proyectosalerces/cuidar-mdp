/**
 * /nosotros route — About Us page (server component with SEO metadata).
 */

import type { Metadata } from 'next';
import NosotrosPage from '@/components/nosotros/NosotrosPage';
import { generateMetadata as genMeta } from '@/utils/seo';

export const metadata: Metadata = genMeta({
  title: 'Sobre Nosotros',
  description:
    'Conocé a Cuidar MdP: consultora de recomendación geriátrica en Mar del Plata. Nuestra misión, valores y cómo acompañamos a las familias en la búsqueda del mejor cuidado.',
  path: '/nosotros',
});

export default function NosotrosRoute() {
  return <NosotrosPage />;
}

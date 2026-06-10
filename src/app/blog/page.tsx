/**
 * /blog — Blog listing page
 *
 * Server component that renders the client-side BlogPage wrapper.
 */

import type { Metadata } from 'next';
import BlogPage from '@/components/blog/BlogPage';
import { SITE_NAME, SITE_URL } from '@/utils/constants';

export const metadata: Metadata = {
  title: `Blog — Recursos y Guías | ${SITE_NAME}`,
  description:
    'Artículos, guías y recursos sobre cuidado geriátrico, salud del adulto mayor, nutrición, actividades y asesoramiento legal para familias en Mar del Plata.',
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
  openGraph: {
    title: `Blog — Recursos y Guías | ${SITE_NAME}`,
    description:
      'Información actualizada sobre cuidado geriátrico, salud del adulto mayor y asesoramiento para familias.',
    url: `${SITE_URL}/blog`,
    siteName: SITE_NAME,
    locale: 'es_AR',
    type: 'website',
  },
};

export default function BlogPageRoute() {
  return <BlogPage />;
}

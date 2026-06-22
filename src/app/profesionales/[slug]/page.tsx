/**
 * /profesionales/[slug] — Detail page for a single profesional
 *
 * Uses generateStaticParams for static generation and generateMetadata for SEO.
 */

import type { Metadata } from 'next';
import { getProfesionalBySlug, getProfesionales } from '@/services/profesionales.service';
import ProfesionalDetail from '@/components/profesionales/ProfesionalDetail/ProfesionalDetail';
import ProfesionalNotFound from '@/components/profesionales/ProfesionalDetail/ProfesionalNotFound';
import JsonLd from '@/components/seo/JsonLd';
import { generateProfesionalJsonLd } from '@/utils/seo';

/* Regenerar las páginas con datos frescos de Firestore cada hora */
export const revalidate = 3600;

/* ── Static params ────────────────────────────────────────────────────── */

export async function generateStaticParams() {
  const profesionales = await getProfesionales();
  return profesionales.map((p) => ({ slug: p.slug }));
}

/* ── SEO metadata ─────────────────────────────────────────────────────── */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const profesional = await getProfesionalBySlug(slug);

  if (!profesional) {
    return {
      title: 'Profesional no encontrado',
      description: 'El profesional que buscás no existe o fue removido del directorio.',
    };
  }

  const description = profesional.descripcion.length > 160
    ? profesional.descripcion.slice(0, 157) + '…'
    : profesional.descripcion;

  return {
    title: profesional.nombre,
    description,
    alternates: {
      canonical: `/profesionales/${profesional.slug}`,
    },
    openGraph: {
      title: `${profesional.nombre} — Cuidar MdP`,
      description,
    },
  };
}

/* ── Page component ───────────────────────────────────────────────────── */

export default async function ProfesionalDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const profesional = await getProfesionalBySlug(slug);

  if (!profesional) {
    return <ProfesionalNotFound />;
  }

  return (
    <>
      <JsonLd id={`jsonld-prof-${profesional.slug}`} data={generateProfesionalJsonLd(profesional)} />
      <ProfesionalDetail profesional={profesional} />
    </>
  );
}

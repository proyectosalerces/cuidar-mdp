/**
 * /residencias/[slug] — Detail page for a single residencia
 *
 * Uses generateStaticParams for static generation and generateMetadata for SEO.
 */

import type { Metadata } from 'next';
import { getResidenciaBySlug } from '@/services/residencias.service';
import { mockResidencias } from '@/data/mock';
import ResidenciaDetail from '@/components/residencias/ResidenciaDetail/ResidenciaDetail';
import ResidenciaNotFound from '@/components/residencias/ResidenciaDetail/ResidenciaNotFound';
import JsonLd from '@/components/seo/JsonLd';
import { generateResidenciaJsonLd } from '@/utils/seo';

/* ── Static params ────────────────────────────────────────────────────── */

export async function generateStaticParams() {
  return mockResidencias
    .filter((r) => r.activa)
    .map((r) => ({ slug: r.slug }));
}

/* ── SEO metadata ─────────────────────────────────────────────────────── */

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const residencia = await getResidenciaBySlug(slug);

  if (!residencia) {
    return {
      title: 'Residencia no encontrada',
      description: 'La residencia que buscás no existe o fue removida.',
    };
  }

  return {
    title: residencia.nombre,
    description: residencia.descripcionCorta,
    alternates: {
      canonical: `/residencias/${residencia.slug}`,
    },
    openGraph: {
      title: `${residencia.nombre} — Cuidar MdP`,
      description: residencia.descripcionCorta,
    },
  };
}

/* ── Page component ───────────────────────────────────────────────────── */

export default async function ResidenciaDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const residencia = await getResidenciaBySlug(slug);

  if (!residencia) {
    return <ResidenciaNotFound />;
  }

  return (
    <>
      <JsonLd id={`jsonld-residencia-${residencia.slug}`} data={generateResidenciaJsonLd(residencia)} />
      <ResidenciaDetail residencia={residencia} />
    </>
  );
}


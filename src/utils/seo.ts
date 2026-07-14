/**
 * SEO metadata helper for Next.js App Router pages
 */

import type { Metadata } from 'next';
import type { Residencia } from '@/types/residencia';
import type { BlogPost } from '@/types/blog';
import type { Profesional } from '@/types/profesional';
import { SITE_NAME, SITE_DESCRIPTION, SITE_URL } from '@/utils/constants';

interface SeoParams {
  /** Page title – the root layout template will append the site name */
  title: string;
  /** Meta description for the page */
  description?: string;
  /** Canonical path (without domain), e.g. "/residencias" */
  path?: string;
  /** Open Graph image path relative to public/ */
  ogImage?: string;
  /** Set to true to prevent indexing */
  noIndex?: boolean;
}

/**
 * Generate a Next.js `Metadata` object for a given page.
 *
 * Usage in a page or layout:
 * ```ts
 * export const metadata = generateMetadata({
 *   title: 'Residencias geriátricas',
 *   description: 'Encontrá la mejor residencia geriátrica en Mar del Plata.',
 *   path: '/residencias',
 * });
 * ```
 */
export function generateMetadata({
  title,
  description = SITE_DESCRIPTION,
  path = '',
  ogImage,
  noIndex = false,
}: SeoParams): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = path;

  // When no custom image is passed, inherit the site-wide generated
  // Open Graph image (src/app/opengraph-image.tsx).
  const ogImages = ogImage
    ? [{ url: ogImage, width: 1200, height: 630, alt: title }]
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: `${SITE_URL}${path}`,
      siteName: SITE_NAME,
      locale: 'es_AR',
      type: 'website',
      ...(ogImages ? { images: ogImages } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
  };
}

/**
 * Generate JSON-LD structured data for a local business.
 * Embed the returned object in a <script type="application/ld+json"> tag.
 */
export function generateLocalBusinessJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_NAME,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mar del Plata',
      addressRegion: 'Buenos Aires',
      addressCountry: 'AR',
    },
    areaServed: {
      '@type': 'City',
      name: 'Mar del Plata',
    },
  };
}

/**
 * Generate JSON-LD structured data for a single residencia (LocalBusiness).
 */
export function generateResidenciaJsonLd(residencia: Residencia): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: residencia.nombre,
    description: residencia.descripcionCorta,
    url: `${SITE_URL}/residencias/${residencia.slug}`,
    image: residencia.imagenPrincipal,
    telephone: residencia.telefono,
    address: {
      '@type': 'PostalAddress',
      streetAddress: residencia.direccion,
      addressLocality: residencia.ciudad,
      addressRegion: 'Buenos Aires',
      addressCountry: 'AR',
    },
    ...(residencia.coordenadas && {
      geo: {
        '@type': 'GeoCoordinates',
        latitude: residencia.coordenadas.lat,
        longitude: residencia.coordenadas.lng,
      },
    }),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: residencia.calificacion,
      reviewCount: residencia.cantidadResenas,
      bestRating: 5,
    },
    ...(residencia.precioDesde && {
      priceRange: residencia.rangoPrecios ?? `Desde $${residencia.precioDesde.toLocaleString('es-AR')}`,
    }),
    ...(residencia.website && { sameAs: residencia.website }),
    areaServed: {
      '@type': 'City',
      name: 'Mar del Plata',
    },
  };
}

/**
 * Generate JSON-LD structured data for a blog post (Article schema).
 */
export function generateBlogPostJsonLd(post: BlogPost): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.titulo,
    description: post.extracto,
    image: post.imagenPortada,
    url: `${SITE_URL}/blog/${post.slug}`,
    datePublished: post.fechaPublicacion,
    author: {
      '@type': 'Person',
      name: post.autor.nombre,
      ...(post.autor.bio && { description: post.autor.bio }),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${post.slug}`,
    },
    articleSection: post.categoria,
    keywords: post.tags.join(', '),
    wordCount: post.contenido.split(/\s+/).length,
    timeRequired: `PT${post.tiempoLectura}M`,
    inLanguage: 'es-AR',
  };
}

/**
 * Generate JSON-LD structured data for a healthcare professional (Physician schema).
 */
export function generateProfesionalJsonLd(profesional: Profesional): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Physician',
    name: profesional.nombre,
    description: profesional.descripcion,
    url: `${SITE_URL}/profesionales/${profesional.slug}`,
    image: profesional.foto,
    telephone: profesional.telefono,
    medicalSpecialty: profesional.especialidad,
    address: {
      '@type': 'PostalAddress',
      streetAddress: profesional.direccionConsultorio,
      addressLocality: 'Mar del Plata',
      addressRegion: 'Buenos Aires',
      addressCountry: 'AR',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: profesional.calificacion,
      reviewCount: profesional.cantidadResenas,
      bestRating: 5,
    },
    ...(profesional.obrasSociales && {
      availableService: profesional.obrasSociales.map((os) => ({
        '@type': 'MedicalTherapy',
        name: os,
      })),
    }),
    ...(profesional.horarioAtencion && {
      openingHours: profesional.horarioAtencion,
    }),
    ...(profesional.email && { email: profesional.email }),
    ...(profesional.website && { sameAs: profesional.website }),
  };
}

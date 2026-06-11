/**
 * Next.js App Router sitemap convention.
 *
 * Generates a sitemap.xml with static and dynamic pages.
 * Uses Firestore services for dynamic content.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/sitemap
 */

import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/utils/constants';
import { getResidencias } from '@/services/residencias.service';
import { getBlogPosts } from '@/services/blog.service';
import { getProfesionales } from '@/services/profesionales.service';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  /* ── Static pages ─────────────────────────────────────────────────── */

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/residencias`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/profesionales`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/contacto`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/asesoramiento`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/nosotros`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  /* ── Dynamic: Residencias ─────────────────────────────────────────── */

  const residencias = await getResidencias();
  const residenciaPages: MetadataRoute.Sitemap = residencias.map((r) => ({
    url: `${SITE_URL}/residencias/${r.slug}`,
    lastModified: new Date(r.updatedAt),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  /* ── Dynamic: Blog Posts ──────────────────────────────────────────── */

  const blogPosts = await getBlogPosts();
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(p.fechaPublicacion),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  /* ── Dynamic: Profesionales ───────────────────────────────────────── */

  const profesionales = await getProfesionales();
  const profesionalPages: MetadataRoute.Sitemap = profesionales.map((p) => ({
    url: `${SITE_URL}/profesionales/${p.slug}`,
    lastModified: new Date(p.createdAt),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...residenciaPages,
    ...blogPages,
    ...profesionalPages,
  ];
}

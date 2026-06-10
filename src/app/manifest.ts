/**
 * Next.js App Router Web App Manifest convention.
 *
 * Generates a PWA manifest.json at /manifest.webmanifest.
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/metadata/manifest
 */

import type { MetadataRoute } from 'next';
import { SITE_DESCRIPTION } from '@/utils/constants';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Cuidar MdP',
    short_name: 'Cuidar MdP',
    description: SITE_DESCRIPTION,
    theme_color: '#1B6B5A',
    background_color: '#FFFFFF',
    display: 'standalone',
    start_url: '/',
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  };
}

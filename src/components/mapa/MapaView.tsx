'use client';

/**
 * MapaView — client wrapper that loads the Leaflet map only in the browser.
 *
 * The map component is imported with `ssr: false` because Leaflet relies on
 * `window`/`document`, which don't exist during server rendering.
 */

import dynamic from 'next/dynamic';
import type { Residencia } from '@/types/residencia';

const MapaResidencias = dynamic(
  () => import('./MapaResidencias/MapaResidencias'),
  {
    ssr: false,
    loading: () => (
      <div
        style={{
          height: '70vh',
          minHeight: 420,
          display: 'grid',
          placeItems: 'center',
          borderRadius: 16,
          background: 'var(--color-neutral-200)',
          color: 'var(--color-text-muted)',
        }}
      >
        Cargando mapa…
      </div>
    ),
  },
);

interface MapaViewProps {
  residencias: Residencia[];
  height?: string;
}

export default function MapaView({ residencias, height }: MapaViewProps) {
  return <MapaResidencias residencias={residencias} height={height} />;
}

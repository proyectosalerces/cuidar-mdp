/**
 * /mapa — Interactive map of all active residencias with a location.
 *
 * Server component: fetches residencias from Firestore and passes the ones
 * that have coordinates to the client-only map.
 */

import type { Metadata } from 'next';
import { getResidencias } from '@/services/residencias.service';
import { generateMetadata as genMeta } from '@/utils/seo';
import MapaView from '@/components/mapa/MapaView';
import styles from './page.module.css';

export const revalidate = 3600;

export const metadata: Metadata = genMeta({
  title: 'Mapa de Residencias',
  description:
    'Ubicá en el mapa todas las residencias geriátricas de Mar del Plata. Encontrá la más cercana a tu zona y accedé a su ficha completa.',
  path: '/mapa',
});

export default async function MapaPage() {
  const residencias = (await getResidencias()).filter((r) => r.coordenadas);

  return (
    <main className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          Mapa de residencias geriátricas en Mar del Plata
        </h1>
        <p className={styles.subtitle}>
          Explorá <span className={styles.count}>{residencias.length} residencias</span> ubicadas en
          el mapa y elegí la más cercana a tu zona.
        </p>
      </header>

      <MapaView residencias={residencias} height="75vh" />
    </main>
  );
}

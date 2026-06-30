'use client';

/**
 * MapaResidencias — interactive Leaflet map of senior-care facilities.
 *
 * Renders a CARTO "Positron" basemap (built on OpenStreetMap data) with a
 * custom brand pin per residencia. Clicking a pin opens a compact card with
 * photo, name, neighborhood, rating and a link to the full profile.
 *
 * Client-only: Leaflet touches `window`, so this component must never run on
 * the server (import it via `next/dynamic` with `ssr: false`).
 */

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { Residencia } from '@/types/residencia';
import styles from './MapaResidencias.module.css';

interface MapaResidenciasProps {
  residencias: Residencia[];
  /** CSS height for the map container. Defaults to a tall viewport block. */
  height?: string;
}

const MDP_CENTER: [number, number] = [-38.002, -57.551];
const DEFAULT_ZOOM = 13;
const PRIMARY = '#1B6B5A';

/* ── Helpers ──────────────────────────────────────────────────────────── */

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const HOME_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>';

/** Custom teardrop pin icon (avoids Leaflet's default-icon asset bug). */
const pinIcon = L.divIcon({
  className: '',
  html: `<div class="cmp-pin" style="background:${PRIMARY}">${HOME_SVG}</div>`,
  iconSize: [32, 32],
  iconAnchor: [6, 32],
  popupAnchor: [10, -30],
});

/** Build the compact popup card markup for a residencia. */
function buildPopup(r: Residencia): string {
  const stars = r.calificacion ? '★'.repeat(Math.round(r.calificacion)) : '';
  const photo = r.imagenPrincipal
    ? `<div class="cmp-photo"><img src="${escapeHtml(r.imagenPrincipal)}" alt="${escapeHtml(r.nombre)}" loading="lazy" /></div>`
    : `<div class="cmp-photo cmp-photo-empty">${HOME_SVG}</div>`;

  const rating = r.calificacion
    ? `<p class="cmp-rating">${stars} ${r.calificacion.toFixed(1)}</p>`
    : '';

  return (
    `${photo}` +
    `<div class="cmp-body">` +
    `<p class="cmp-name">${escapeHtml(r.nombre)}</p>` +
    `<p class="cmp-barrio">📍 ${escapeHtml(r.barrio)}, ${escapeHtml(r.ciudad)}</p>` +
    `${rating}` +
    `<a class="cmp-btn" href="/residencias/${encodeURIComponent(r.slug)}">Ver ficha →</a>` +
    `</div>`
  );
}

/* ── Component ────────────────────────────────────────────────────────── */

export default function MapaResidencias({ residencias, height }: MapaResidenciasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    const map = L.map(container, {
      center: MDP_CENTER,
      zoom: DEFAULT_ZOOM,
      scrollWheelZoom: false,
    });
    mapRef.current = map;

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        maxZoom: 20,
        subdomains: 'abcd',
        attribution: '© OpenStreetMap © CARTO',
      },
    ).addTo(map);

    const withCoords = residencias.filter((r) => r.coordenadas);
    const markers: L.Marker[] = withCoords.map((r) =>
      L.marker([r.coordenadas!.lat, r.coordenadas!.lng], { icon: pinIcon })
        .bindPopup(buildPopup(r), { closeButton: true })
        .addTo(map),
    );

    if (markers.length > 0) {
      const group = L.featureGroup(markers);
      map.fitBounds(group.getBounds().pad(0.15), { maxZoom: 15 });
    }

    /* Leaflet needs a size recalc once the container has its final layout. */
    setTimeout(() => map.invalidateSize(), 0);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, [residencias]);

  return (
    <div
      ref={containerRef}
      className={styles.map}
      style={height ? { height } : undefined}
      role="application"
      aria-label="Mapa de residencias geriátricas en Mar del Plata"
    />
  );
}

'use client';

/**
 * LocationPicker — small Leaflet map where the admin clicks to set a
 * residencia's exact location. Client-only (load via next/dynamic ssr:false).
 */

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface LocationPickerProps {
  lat: number | null;
  lng: number | null;
  onPick: (lat: number, lng: number) => void;
}

const MDP_CENTER: [number, number] = [-38.002, -57.551];
const PRIMARY = '#1B6B5A';

const HOME_SVG =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5"/><path d="M5 10v10h14V10"/><path d="M9 20v-6h6v6"/></svg>';

const pinIcon = L.divIcon({
  className: '',
  html: `<div class="cmp-pin" style="background:${PRIMARY}">${HOME_SVG}</div>`,
  iconSize: [32, 32],
  iconAnchor: [6, 32],
});

export default function LocationPicker({ lat, lng, onPick }: LocationPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const onPickRef = useRef(onPick);
  onPickRef.current = onPick;

  /* Init map once */
  useEffect(() => {
    const container = containerRef.current;
    if (!container || mapRef.current) return;

    const hasValue = lat != null && lng != null;
    const map = L.map(container, {
      center: hasValue ? [lat, lng] : MDP_CENTER,
      zoom: hasValue ? 16 : 13,
    });
    mapRef.current = map;

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      { maxZoom: 20, subdomains: 'abcd', attribution: '© OpenStreetMap © CARTO' },
    ).addTo(map);

    if (hasValue) {
      markerRef.current = L.marker([lat, lng], { icon: pinIcon }).addTo(map);
    }

    map.on('click', (e: L.LeafletMouseEvent) => {
      onPickRef.current(e.latlng.lat, e.latlng.lng);
    });

    setTimeout(() => map.invalidateSize(), 0);

    return () => {
      map.remove();
      mapRef.current = null;
      markerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Sync marker when the value changes (from map click or manual inputs) */
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (lat != null && lng != null) {
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      } else {
        markerRef.current = L.marker([lat, lng], { icon: pinIcon }).addTo(map);
      }
    } else if (markerRef.current) {
      map.removeLayer(markerRef.current);
      markerRef.current = null;
    }
  }, [lat, lng]);

  return (
    <div
      ref={containerRef}
      style={{ height: 300, borderRadius: 12, overflow: 'hidden' }}
      role="application"
      aria-label="Seleccionar ubicación en el mapa"
    />
  );
}

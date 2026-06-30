'use client';

/**
 * LocationPickerField — admin form field to set a residencia's location.
 *
 * Combines a click-to-place map (loaded client-only) with manual lat/lng
 * inputs. Values are kept as strings to match the surrounding form state.
 */

import dynamic from 'next/dynamic';

const LocationPicker = dynamic(() => import('./LocationPicker'), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: 300,
        borderRadius: 12,
        display: 'grid',
        placeItems: 'center',
        background: 'var(--color-neutral-200)',
        color: 'var(--color-text-muted)',
      }}
    >
      Cargando mapa…
    </div>
  ),
});

interface LocationPickerFieldProps {
  lat: string;
  lng: string;
  onChange: (lat: string, lng: string) => void;
}

function toNum(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed === '' || isNaN(Number(trimmed))) return null;
  return Number(trimmed);
}

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '0.6rem 0.75rem',
  borderRadius: 8,
  border: '1px solid var(--color-neutral-300)',
  fontSize: '0.9rem',
};

export default function LocationPickerField({ lat, lng, onChange }: LocationPickerFieldProps) {
  return (
    <div>
      <LocationPicker
        lat={toNum(lat)}
        lng={toNum(lng)}
        onPick={(la, ln) => onChange(la.toFixed(6), ln.toFixed(6))}
      />

      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.6rem' }}>
        <input
          type="text"
          inputMode="decimal"
          value={lat}
          onChange={(e) => onChange(e.target.value, lng)}
          placeholder="Latitud (ej. -38.0055)"
          style={inputStyle}
          aria-label="Latitud"
        />
        <input
          type="text"
          inputMode="decimal"
          value={lng}
          onChange={(e) => onChange(lat, e.target.value)}
          placeholder="Longitud (ej. -57.5530)"
          style={inputStyle}
          aria-label="Longitud"
        />
      </div>

      <p style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', margin: '0.5rem 0 0' }}>
        Hacé clic en el mapa para marcar la ubicación exacta de la residencia. También podés
        escribir las coordenadas a mano.
      </p>
    </div>
  );
}

import { ImageResponse } from 'next/og';

/**
 * Dynamically generated Open Graph / social preview image (1200×630).
 * Replaces the old watermarked placeholder. Applies site-wide.
 */

export const alt = 'Cuidar MdP — Consultora Geriátrica en Mar del Plata';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '90px',
          background: 'linear-gradient(135deg, #1B6B5A 0%, #14503f 100%)',
          color: '#ffffff',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            display: 'flex',
            fontSize: 30,
            letterSpacing: 4,
            textTransform: 'uppercase',
            color: '#E8A838',
            fontWeight: 600,
          }}
        >
          Consultora Geriátrica · Mar del Plata
        </div>

        <div style={{ display: 'flex', marginTop: 24, fontSize: 108, fontWeight: 800 }}>
          <span>Cuidar&nbsp;</span>
          <span style={{ color: '#E8A838' }}>MdP</span>
        </div>

        <div style={{ display: 'flex', marginTop: 20, fontSize: 46, fontWeight: 600, lineHeight: 1.2 }}>
          El cuidado que merecen, cerca de casa.
        </div>

        <div style={{ display: 'flex', marginTop: 18, fontSize: 30, color: 'rgba(255,255,255,0.85)' }}>
          Residencias y profesionales verificados en Mar del Plata
        </div>

        <div style={{ display: 'flex', marginTop: 56, fontSize: 32, fontWeight: 700, color: '#E8A838' }}>
          www.cuidarmdp.com
        </div>
      </div>
    ),
    { ...size },
  );
}

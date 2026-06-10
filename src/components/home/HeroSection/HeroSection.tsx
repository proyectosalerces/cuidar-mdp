/**
 * Hero section — full-width gradient, search bar, trust indicators.
 */

import Link from 'next/link';
import { TIPOS_CUIDADO_OPTIONS } from '@/utils/constants';
import styles from './HeroSection.module.css';

export default function HeroSection() {
  return (
    <section className={styles.hero} aria-label="Inicio">
      {/* Subtle dot pattern overlay */}
      <div className={styles.pattern} aria-hidden="true" />

      <div className={styles.content}>
        <h1 className={styles.heading}>
          Encontrá el mejor cuidado para tu ser querido
        </h1>

        <p className={styles.subheading}>
          Te ayudamos a elegir la residencia geriátrica ideal en Mar&nbsp;del&nbsp;Plata.
          Asesoramiento gratuito y personalizado.
        </p>

        {/* ── Search bar ──────────────────────────────────── */}
        <form
          className={styles.searchBar}
          action="/residencias"
          method="get"
          role="search"
          aria-label="Buscar residencias"
        >
          <input
            type="text"
            name="q"
            className={styles.searchInput}
            placeholder="Barrio, nombre o servicio…"
            aria-label="Buscar por barrio, nombre o servicio"
          />
          <select
            name="tipo"
            className={styles.searchSelect}
            aria-label="Tipo de cuidado"
            defaultValue=""
          >
            <option value="" disabled>
              Tipo de cuidado
            </option>
            {TIPOS_CUIDADO_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <button type="submit" className={styles.searchButton}>
            Buscar
          </button>
        </form>

        {/* ── Trust indicators ────────────────────────────── */}
        <div className={styles.trustRow} aria-label="Indicadores de confianza">
          <div className={styles.trustItem}>
            <span className={styles.trustValue}>19</span>
            <span className={styles.trustLabel}>Residencias verificadas</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustValue}>12</span>
            <span className={styles.trustLabel}>Profesionales</span>
          </div>
          <div className={styles.trustItem}>
            <span className={styles.trustValue}>100%</span>
            <span className={styles.trustLabel}>Gratuito</span>
          </div>
        </div>
      </div>
    </section>
  );
}

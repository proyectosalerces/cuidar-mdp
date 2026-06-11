'use client';

/**
 * ResidenciaCard — Premium card for the residencias listing grid.
 *
 * Renders an image placeholder with gradient, verification badge,
 * name, barrio, rating, service badges and price range.
 * The entire card links to `/residencias/[slug]`.
 */

import Link from 'next/link';
import type { Residencia } from '@/types/residencia';
import { Rating } from '@/components/ui';
import { formatPrecio, formatCalificacion } from '@/utils/formatters';
import { cn } from '@/utils/classnames';
import styles from './ResidenciaCard.module.css';

interface ResidenciaCardProps {
  residencia: Residencia;
  className?: string;
}

const MAX_SERVICES = 4;

export default function ResidenciaCard({ residencia, className }: ResidenciaCardProps) {
  const visibleServices = residencia.servicios.slice(0, MAX_SERVICES);
  const moreCount = residencia.servicios.length - MAX_SERVICES;

  return (
    <Link
      href={`/residencias/${residencia.slug}`}
      className={cn(styles.card, className)}
      id={`residencia-card-${residencia.slug}`}
    >
      {/* ── Image ─────────────────────────────────────────────────── */}
      <div className={styles.imageWrapper}>
        <div className={styles.imageGradientOverlay} />
        {residencia.imagenPrincipal ? (
          <img
            src={residencia.imagenPrincipal}
            alt={residencia.nombre}
            className={styles.image}
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const placeholder = target.nextElementSibling as HTMLElement;
              if (placeholder) placeholder.style.display = 'flex';
            }}
          />
        ) : null}
        <div
          className={styles.imagePlaceholder}
          style={residencia.imagenPrincipal ? { display: 'none' } : undefined}
        >
          <svg className={styles.placeholderIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14M3 21h18M3 21l6-6m0 0l3 3 4-4 5 5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Verified badge */}
        {residencia.verificada && (
          <span className={styles.verifiedBadge}>
            <svg className={styles.verifiedIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 12l2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            Verificada
          </span>
        )}

        {/* Featured badge */}
        {residencia.destacada && (
          <span className={styles.featuredBadge}>
            <svg className={styles.featuredIcon} viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Destacada
          </span>
        )}
      </div>

      {/* ── Body ──────────────────────────────────────────────────── */}
      <div className={styles.body}>
        <h3 className={styles.name}>{residencia.nombre}</h3>

        <div className={styles.locationRow}>
          <svg className={styles.locationIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <span>{residencia.barrio}, {residencia.ciudad}</span>
        </div>

        <div className={styles.ratingRow}>
          <span className={styles.ratingValue}>{formatCalificacion(residencia.calificacion)}</span>
          <Rating value={residencia.calificacion} count={residencia.cantidadResenas} size="sm" />
        </div>

        {/* Services */}
        <div className={styles.services}>
          {visibleServices.map((servicio) => (
            <span key={servicio} className={styles.serviceBadge}>
              {servicio}
            </span>
          ))}
          {moreCount > 0 && (
            <span className={styles.moreServices}>+{moreCount}</span>
          )}
        </div>
      </div>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <div className={styles.footer}>
        <div>
          <div className={styles.priceLabel}>Desde</div>
          <div className={styles.price}>
            {residencia.precioDesde ? formatPrecio(residencia.precioDesde) : 'Consultar'}
          </div>
        </div>
        <span className={styles.viewMore}>
          Ver más
          <svg className={styles.viewMoreIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </div>
    </Link>
  );
}

/**
 * FeaturedResidencias — Grid of highlighted senior-care facility cards.
 */

import Link from 'next/link';
import { mockResidencias } from '@/data/mock-residencias';
import { formatPrecio, formatCalificacion } from '@/utils/formatters';
import styles from './FeaturedResidencias.module.css';

/** Show only the featured (destacada) residencias, capped at 6. */
const featured = mockResidencias.filter((r) => r.destacada).slice(0, 6);

/** Maximum number of service badges to display per card. */
const MAX_SERVICES = 3;

export default function FeaturedResidencias() {
  return (
    <section className={styles.section} aria-label="Residencias destacadas">
      <div className={styles.container}>
        {/* ── Header ────────────────────────────────────────── */}
        <div className={styles.header}>
          <span className={styles.sectionLabel}>Verificadas y recomendadas</span>
          <h2 className={styles.title}>Residencias destacadas en Mar&nbsp;del&nbsp;Plata</h2>
          <p className={styles.subtitle}>
            Conocé las opciones mejor valoradas por las familias de la ciudad.
          </p>
        </div>

        {/* ── Card grid ─────────────────────────────────────── */}
        <div className={styles.grid}>
          {featured.map((residencia) => (
            <Link
              key={residencia.id}
              href={`/residencias/${residencia.slug}`}
              className={styles.card}
            >
              {/* Image */}
              <div className={styles.cardImage}>
                <div className={styles.cardImagePlaceholder} aria-hidden="true">
                  🏠
                </div>
                {residencia.verificada && (
                  <span className={styles.verifiedBadge}>✓ Verificada</span>
                )}
              </div>

              {/* Body */}
              <div className={styles.cardBody}>
                <h3 className={styles.cardName}>{residencia.nombre}</h3>

                <div className={styles.cardMeta}>
                  <span className={styles.cardBarrio}>📍 {residencia.barrio}</span>
                  <span className={styles.cardRating}>
                    <span className={styles.ratingStar}>★</span>
                    {formatCalificacion(residencia.calificacion)}
                    <span className={styles.ratingCount}>
                      ({residencia.cantidadResenas})
                    </span>
                  </span>
                </div>

                {/* Services */}
                <div className={styles.servicesList}>
                  {residencia.servicios.slice(0, MAX_SERVICES).map((s) => (
                    <span key={s} className={styles.serviceBadge}>
                      {s}
                    </span>
                  ))}
                  {residencia.servicios.length > MAX_SERVICES && (
                    <span className={styles.serviceBadge}>
                      +{residencia.servicios.length - MAX_SERVICES}
                    </span>
                  )}
                </div>

                {/* Price + arrow */}
                <div className={styles.cardFooter}>
                  <div>
                    {residencia.precioDesde && (
                      <span className={styles.price}>
                        {formatPrecio(residencia.precioDesde)}{' '}
                        <span className={styles.priceLabel}>/ mes</span>
                      </span>
                    )}
                  </div>
                  <span className={styles.cardArrow} aria-hidden="true">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── View all ──────────────────────────────────────── */}
        <div className={styles.viewAll}>
          <Link href="/residencias" className={styles.viewAllLink}>
            Ver todas las residencias →
          </Link>
        </div>
      </div>
    </section>
  );
}

'use client';

/**
 * FeaturedResidencias — Grid of highlighted senior-care facility cards.
 * Fetches from Firestore and shows cover images when available.
 */

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import type { Residencia } from '@/types/residencia';
import { formatPrecio, formatCalificacion } from '@/utils/formatters';
import styles from './FeaturedResidencias.module.css';

/** Maximum number of service badges to display per card. */
const MAX_SERVICES = 3;

export default function FeaturedResidencias() {
  const [featured, setFeatured] = useState<Residencia[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const snapshot = await getDocs(collection(db, 'residencias'));
        const all = snapshot.docs.map((doc) => {
          const d = doc.data();
          return { id: doc.id, ...d } as Residencia;
        });
        // Featured first, then by rating, cap at 6
        const sorted = all
          .filter((r) => r.publicada !== false)
          .sort((a, b) => {
            if (a.destacada && !b.destacada) return -1;
            if (!a.destacada && b.destacada) return 1;
            return (b.calificacion ?? 0) - (a.calificacion ?? 0);
          })
          .slice(0, 6);
        setFeatured(sorted);
      } catch (err) {
        console.warn('[FeaturedResidencias] Error loading:', err);
      }
    }
    load();
  }, []);

  if (featured.length === 0) return null;

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
                {residencia.imagenPrincipal ? (
                  <img
                    src={residencia.imagenPrincipal}
                    alt={residencia.nombre}
                    className={styles.coverImage}
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
                  className={styles.cardImagePlaceholder}
                  aria-hidden="true"
                  style={residencia.imagenPrincipal ? { display: 'none' } : undefined}
                >
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

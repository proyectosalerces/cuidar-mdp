/**
 * TestimonialsSection — Family testimonial quote cards.
 * Horizontal scroll on mobile, 3-col grid on desktop.
 */

import { mockTestimonials } from '@/data/mock-testimonials';
import styles from './TestimonialsSection.module.css';

/** Show the first 6 testimonials. */
const testimonials = mockTestimonials.slice(0, 6);

/** Get initials from a full name (e.g. "María Laura González" → "MG"). */
function getInitials(name: string): string {
  const parts = name.split(' ').filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

/** Render filled stars up to the rating value. */
function renderStars(rating: number): string {
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5 - full);
}

export default function TestimonialsSection() {
  return (
    <section className={styles.section} aria-label="Testimonios de familias">
      <div className={styles.container}>
        {/* ── Header ────────────────────────────────────────── */}
        <div className={styles.header}>
          <span className={styles.sectionLabel}>Experiencias reales</span>
          <h2 className={styles.title}>Lo que dicen las familias</h2>
          <p className={styles.subtitle}>
            Historias de quienes ya encontraron el lugar ideal para sus seres queridos.
          </p>
        </div>

        {/* ── Testimonial track ─────────────────────────────── */}
        <div className={styles.track}>
          {testimonials.map((t) => (
            <article key={t.id} className={styles.card}>
              <span className={styles.quoteIcon} aria-hidden="true">"</span>
              <p className={styles.quoteText}>{t.texto}</p>

              <div className={styles.authorRow}>
                <div className={styles.avatar} aria-hidden="true">
                  {getInitials(t.nombre)}
                </div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{t.nombre}</span>
                  <span className={styles.authorRelation}>
                    {t.parentesco}
                    {t.residencia ? ` · ${t.residencia}` : ''}
                  </span>
                </div>
                <div className={styles.stars} aria-label={`${t.calificacion} de 5 estrellas`}>
                  {renderStars(t.calificacion)}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

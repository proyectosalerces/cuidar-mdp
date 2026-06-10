/**
 * BlogPreview — Latest 3 blog posts displayed as cards.
 */

import Link from 'next/link';
import { mockBlogPosts } from '@/data/mock-blog';
import { formatTiempoLectura } from '@/utils/formatters';
import styles from './BlogPreview.module.css';

/** Category display labels. */
const CATEGORY_LABELS: Record<string, string> = {
  guias: 'Guías',
  salud: 'Salud',
  legal: 'Legal',
  emocional: 'Emocional',
  actividades: 'Actividades',
  nutricion: 'Nutrición',
  noticias: 'Noticias',
};

/** Blog icon by category. */
const CATEGORY_ICONS: Record<string, string> = {
  guias: '📋',
  salud: '🩺',
  legal: '⚖️',
  emocional: '💛',
  actividades: '🧩',
  nutricion: '🥗',
  noticias: '📰',
};

/** Take the 3 most recent published posts. */
const posts = mockBlogPosts
  .filter((p) => p.publicado)
  .sort((a, b) => new Date(b.fechaPublicacion).getTime() - new Date(a.fechaPublicacion).getTime())
  .slice(0, 3);

export default function BlogPreview() {
  return (
    <section className={styles.section} aria-label="Blog y recursos">
      <div className={styles.container}>
        {/* ── Header ────────────────────────────────────────── */}
        <div className={styles.header}>
          <span className={styles.sectionLabel}>Información útil</span>
          <h2 className={styles.title}>Recursos y guías para familias</h2>
          <p className={styles.subtitle}>
            Artículos escritos por profesionales para acompañarte en cada etapa.
          </p>
        </div>

        {/* ── Grid ──────────────────────────────────────────── */}
        <div className={styles.grid}>
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className={styles.card}
            >
              {/* Image */}
              <div className={styles.cardImage}>
                <div className={styles.cardImagePlaceholder} aria-hidden="true">
                  {CATEGORY_ICONS[post.categoria] ?? '📄'}
                </div>
                <span className={styles.categoryBadge}>
                  {CATEGORY_LABELS[post.categoria] ?? post.categoria}
                </span>
              </div>

              {/* Body */}
              <div className={styles.cardBody}>
                <h3 className={styles.cardTitle}>{post.titulo}</h3>
                <p className={styles.cardExcerpt}>{post.extracto}</p>

                <div className={styles.cardFooter}>
                  <span className={styles.readTime}>
                    {formatTiempoLectura(post.tiempoLectura)}
                  </span>
                  <span className={styles.readMore}>Leer más →</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── View all ──────────────────────────────────────── */}
        <div className={styles.viewAll}>
          <Link href="/blog" className={styles.viewAllLink}>
            Ver todas las publicaciones →
          </Link>
        </div>
      </div>
    </section>
  );
}

'use client';

/**
 * BlogCard — Displays a blog post as a visually rich card.
 *
 * Features: gradient image placeholder, category badge, meta info,
 * hover lift, and "Leer más" link.
 */

import Link from 'next/link';
import { Badge } from '@/components/ui';
import { cn } from '@/utils/classnames';
import { formatFecha, formatTiempoLectura } from '@/utils/formatters';
import type { BlogPost } from '@/types/blog';
import styles from './BlogCard.module.css';

/* -------------------------------------------------------------------------- */
/*  Maps                                                                       */
/* -------------------------------------------------------------------------- */

const CATEGORY_LABELS: Record<string, string> = {
  guias: 'Guías',
  salud: 'Salud',
  legal: 'Legal',
  legales: 'Legales',
  familias: 'Familias',
  emocional: 'Emocional',
  actividades: 'Actividades',
  nutricion: 'Nutrición',
  noticias: 'Noticias',
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  guias: 'linear-gradient(135deg, #1B6B5A 0%, #2B8F7A 100%)',
  salud: 'linear-gradient(135deg, #2D6A9F 0%, #4EA4D4 100%)',
  legal: 'linear-gradient(135deg, #6B4C8A 0%, #9B7DB8 100%)',
  legales: 'linear-gradient(135deg, #6B4C8A 0%, #9B7DB8 100%)',
  familias: 'linear-gradient(135deg, #C4614A 0%, #E88A72 100%)',
  emocional: 'linear-gradient(135deg, #D4764A 0%, #E8A272 100%)',
  actividades: 'linear-gradient(135deg, #2A7F62 0%, #52B788 100%)',
  nutricion: 'linear-gradient(135deg, #D49520 0%, #F0BD5E 100%)',
  noticias: 'linear-gradient(135deg, #4A5568 0%, #718096 100%)',
};

/* -------------------------------------------------------------------------- */
/*  Props                                                                      */
/* -------------------------------------------------------------------------- */

interface BlogCardProps {
  post: BlogPost;
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function BlogCard({ post, className }: BlogCardProps) {
  const gradient =
    CATEGORY_GRADIENTS[post.categoria] ?? CATEGORY_GRADIENTS.noticias;
  const label = CATEGORY_LABELS[post.categoria] ?? post.categoria;

  return (
    <article className={cn(styles.card, className)}>
      {/* Image */}
      <Link href={`/blog/${post.slug}`} className={styles.imageLink}>
        <div
          className={styles.imagePlaceholder}
          style={{ background: post.imagenPortada ? undefined : gradient }}
        >
          {post.imagenPortada ? (
            <img
              src={post.imagenPortada}
              alt={post.titulo}
              className={styles.coverImage}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                if (target.parentElement) {
                  target.parentElement.style.background = gradient;
                }
              }}
            />
          ) : (
            <>
              <div className={styles.imagePattern} />
              {/* Decorative icon */}
              <svg
                className={styles.imageIcon}
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#fff"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                <path d="M8 7h6" />
                <path d="M8 11h8" />
              </svg>
            </>
          )}
          <Badge variant="primary" className={styles.categoryBadge}>
            {label}
          </Badge>
        </div>
      </Link>

      {/* Content */}
      <div className={styles.content}>
        <Link href={`/blog/${post.slug}`} className={styles.titleLink}>
          <h3 className={styles.title}>{post.titulo}</h3>
        </Link>

        <p className={styles.excerpt}>{post.extracto}</p>

        <div className={styles.meta}>
          <span className={styles.author}>{post.autor.nombre}</span>
          <span className={styles.separator}>·</span>
          <time dateTime={post.fechaPublicacion} className={styles.date}>
            {formatFecha(post.fechaPublicacion)}
          </time>
          <span className={styles.separator}>·</span>
          <span className={styles.readTime}>
            {formatTiempoLectura(post.tiempoLectura)}
          </span>
        </div>

        <Link href={`/blog/${post.slug}`} className={styles.readMore}>
          Leer más →
        </Link>
      </div>
    </article>
  );
}

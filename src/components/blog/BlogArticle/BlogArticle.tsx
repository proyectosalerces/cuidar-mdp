/**
 * BlogArticle — Full article view with breadcrumbs, content, tags, and related posts.
 *
 * Server component — no client-side interactivity needed.
 */

import Link from 'next/link';
import { Badge } from '@/components/ui';
import BlogCard from '@/components/blog/BlogCard/BlogCard';
import { formatFecha, formatTiempoLectura } from '@/utils/formatters';
import { markdownToHtml } from '@/utils/markdown';
import type { BlogPost } from '@/types/blog';
import styles from './BlogArticle.module.css';

/* -------------------------------------------------------------------------- */
/*  Category labels                                                            */
/* -------------------------------------------------------------------------- */

const CATEGORY_LABELS: Record<string, string> = {
  guias: 'Guías',
  salud: 'Salud',
  legal: 'Legal',
  emocional: 'Emocional',
  actividades: 'Actividades',
  nutricion: 'Nutrición',
  noticias: 'Noticias',
};

/* -------------------------------------------------------------------------- */
/*  Props                                                                      */
/* -------------------------------------------------------------------------- */

interface BlogArticleProps {
  post: BlogPost;
  relatedPosts: BlogPost[];
}

/* -------------------------------------------------------------------------- */
/*  Component                                                                  */
/* -------------------------------------------------------------------------- */

export default function BlogArticle({ post, relatedPosts }: BlogArticleProps) {
  const contentHtml = markdownToHtml(post.contenido);
  const categoryLabel = CATEGORY_LABELS[post.categoria] ?? post.categoria;

  return (
    <>
      {/* ── Breadcrumbs ───────────────────────────────────────────────── */}
      <nav className={styles.breadcrumbs} aria-label="Breadcrumbs">
        <div className={styles.breadcrumbsInner}>
          <Link href="/" className={styles.breadcrumbLink}>
            Inicio
          </Link>
          <span className={styles.breadcrumbSep} aria-hidden="true">
            /
          </span>
          <Link href="/blog" className={styles.breadcrumbLink}>
            Blog
          </Link>
          <span className={styles.breadcrumbSep} aria-hidden="true">
            /
          </span>
          <span className={styles.breadcrumbCurrent} aria-current="page">
            {post.titulo}
          </span>
        </div>
      </nav>

      {/* ── Article ───────────────────────────────────────────────────── */}
      <article className={styles.article}>
        <div className={styles.container}>
          {/* Header */}
          <header className={styles.header}>
            <Badge variant="primary" className={styles.categoryBadge}>
              {categoryLabel}
            </Badge>

            <h1 className={styles.title}>{post.titulo}</h1>

            <div className={styles.meta}>
              <div className={styles.authorInfo}>
                <div className={styles.authorAvatar}>
                  {post.autor.nombre.charAt(0)}
                </div>
                <div>
                  <span className={styles.authorName}>
                    {post.autor.nombre}
                  </span>
                  {post.autor.bio && (
                    <span className={styles.authorBio}>{post.autor.bio}</span>
                  )}
                </div>
              </div>

              <div className={styles.metaDetails}>
                <time
                  dateTime={post.fechaPublicacion}
                  className={styles.date}
                >
                  {formatFecha(post.fechaPublicacion)}
                </time>
                <span className={styles.metaSep}>·</span>
                <span className={styles.readTime}>
                  {formatTiempoLectura(post.tiempoLectura)}
                </span>
              </div>
            </div>
          </header>

          {/* Cover image */}
          {post.imagenPortada && (
            <div className={styles.coverWrapper}>
              <img
                src={post.imagenPortada}
                alt={post.titulo}
                className={styles.coverImage}
              />
            </div>
          )}

          {/* Divider */}
          <hr className={styles.divider} />

          {/* Body */}
          <div
            className={styles.body}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <footer className={styles.tagsSection}>
              <h4 className={styles.tagsTitle}>Etiquetas</h4>
              <div className={styles.tagsList}>
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className={styles.tag}>
                    {tag}
                  </Badge>
                ))}
              </div>
            </footer>
          )}
        </div>
      </article>

      {/* ── Related Posts ─────────────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className={styles.relatedSection}>
          <div className={styles.container}>
            <h2 className={styles.relatedTitle}>Artículos relacionados</h2>
            <div className={styles.relatedGrid}>
              {relatedPosts.map((rp) => (
                <BlogCard key={rp.id} post={rp} />
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

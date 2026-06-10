'use client';

/**
 * BlogPage — Blog listing page with hero, category filters, and card grid.
 *
 * Client component to support interactive category filtering.
 */

import { useState, useEffect } from 'react';
import BlogCard from '@/components/blog/BlogCard/BlogCard';
import BlogCategoryFilter from '@/components/blog/BlogCategoryFilter';
import { getBlogPosts } from '@/services/blog.service';
import type { BlogPost } from '@/types/blog';
import styles from './BlogPage.module.css';

export default function BlogPage() {
  const [activeCategory, setActiveCategory] = useState('');
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getBlogPosts(activeCategory || undefined).then((data) => {
      setPosts(data);
      setLoading(false);
    });
  }, [activeCategory]);

  return (
    <>
      {/* ── Hero Section ──────────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroPattern} />
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Recursos y guías para familias</h1>
          <p className={styles.heroSubtitle}>
            Información actualizada sobre cuidado geriátrico, salud del adulto
            mayor y asesoramiento para familias en Mar del Plata.
          </p>
        </div>
      </section>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <section className={styles.main}>
        <div className={styles.container}>
          <BlogCategoryFilter
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />

          {loading ? (
            /* Skeleton grid */
            <div className={styles.grid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={styles.skeleton}>
                  <div className={styles.skeletonImage} />
                  <div className={styles.skeletonContent}>
                    <div className={styles.skeletonTitle} />
                    <div className={styles.skeletonText} />
                    <div
                      className={styles.skeletonText}
                      style={{ width: '60%' }}
                    />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length > 0 ? (
            /* Post cards */
            <div className={styles.grid}>
              {posts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className={styles.emptyState}>
              <div className={styles.emptyIcon}>📝</div>
              <h3 className={styles.emptyTitle}>
                No hay artículos en esta categoría
              </h3>
              <p className={styles.emptyText}>
                Todavía no publicamos artículos en esta sección. ¡Volvé pronto!
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

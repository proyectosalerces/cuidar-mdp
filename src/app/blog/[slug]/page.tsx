/**
 * /blog/[slug] — Blog article detail page
 *
 * Server component with dynamic metadata and static params generation.
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import BlogArticle from '@/components/blog/BlogArticle/BlogArticle';
import { getBlogPosts, getBlogPostBySlug } from '@/services/blog.service';
import { SITE_NAME, SITE_URL } from '@/utils/constants';
import JsonLd from '@/components/seo/JsonLd';
import { generateBlogPostJsonLd } from '@/utils/seo';

/* -------------------------------------------------------------------------- */
/*  Types                                                                      */
/* -------------------------------------------------------------------------- */

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

/* -------------------------------------------------------------------------- */
/*  Static Params                                                              */
/* -------------------------------------------------------------------------- */

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

/* -------------------------------------------------------------------------- */
/*  Dynamic Metadata                                                           */
/* -------------------------------------------------------------------------- */

export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: `Artículo no encontrado | ${SITE_NAME}`,
    };
  }

  return {
    title: `${post.titulo} | ${SITE_NAME}`,
    description: post.extracto,
    alternates: {
      canonical: `${SITE_URL}/blog/${post.slug}`,
    },
    openGraph: {
      title: `${post.titulo} | ${SITE_NAME}`,
      description: post.extracto,
      url: `${SITE_URL}/blog/${post.slug}`,
      siteName: SITE_NAME,
      locale: 'es_AR',
      type: 'article',
      publishedTime: post.fechaPublicacion,
      authors: [post.autor.nombre],
    },
  };
}

/* -------------------------------------------------------------------------- */
/*  Page Component                                                             */
/* -------------------------------------------------------------------------- */

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  /* ── Not Found ──────────────────────────────────────────────────── */
  if (!post) {
    return (
      <section
        style={{
          textAlign: 'center',
          padding: '6rem 1.5rem',
          maxWidth: '600px',
          marginInline: 'auto',
        }}
      >
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📖</div>
        <h1
          style={{
            fontFamily: 'var(--font-family-heading)',
            fontSize: 'clamp(1.5rem, 3vw, 2.5rem)',
            marginBottom: '1rem',
          }}
        >
          Artículo no encontrado
        </h1>
        <p
          style={{
            color: 'var(--color-text-muted)',
            fontSize: 'var(--font-lg)',
            marginBottom: '2rem',
            lineHeight: 1.6,
          }}
        >
          Lo sentimos, el artículo que buscás no existe o fue eliminado.
        </p>
        <Link
          href="/blog"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 2rem',
            background:
              'linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%)',
            color: '#fff',
            borderRadius: 'var(--radius-full)',
            fontFamily: 'var(--font-family-heading)',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          ← Volver al blog
        </Link>
      </section>
    );
  }

  /* ── Related Posts ──────────────────────────────────────────────── */
  const allSameCategory = await getBlogPosts(post.categoria);
  const relatedPosts = allSameCategory
    .filter((p) => p.id !== post.id)
    .slice(0, 3);

  return (
    <>
      <JsonLd id={`jsonld-blog-${post.slug}`} data={generateBlogPostJsonLd(post)} />
      <BlogArticle post={post} relatedPosts={relatedPosts} />
    </>
  );
}

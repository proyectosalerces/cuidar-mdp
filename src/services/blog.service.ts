/**
 * Service layer for blog posts
 *
 * Currently uses mock data. Will be replaced with Firebase Firestore
 * queries once the backend is connected.
 */

import type { BlogPost, CategoriasBlog } from '@/types/blog';
import { mockBlogPosts } from '@/data/mock';

/**
 * Get all published blog posts, optionally filtered by category.
 * Results are sorted by publication date, newest first.
 */
export async function getBlogPosts(
  categoria?: CategoriasBlog | string
): Promise<BlogPost[]> {
  let posts = mockBlogPosts.filter((p) => p.publicado);

  if (categoria) {
    posts = posts.filter((p) => p.categoria === categoria);
  }

  return posts.sort(
    (a, b) =>
      new Date(b.fechaPublicacion).getTime() -
      new Date(a.fechaPublicacion).getTime()
  );
}

/**
 * Get a single blog post by its URL slug
 */
export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  return (
    mockBlogPosts.find((p) => p.slug === slug && p.publicado) ?? null
  );
}

/**
 * Get the most recent published blog posts
 * @param limit - Maximum number of posts to return (default: 3)
 */
export async function getRecentPosts(
  limit: number = 3
): Promise<BlogPost[]> {
  const allPosts = await getBlogPosts();
  return allPosts.slice(0, limit);
}

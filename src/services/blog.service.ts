/**
 * Service layer for blog posts
 *
 * Reads from the Firestore 'blog' collection with a 5-minute
 * in-memory cache. Falls back to mock data when Firestore is unavailable.
 */

import {
  collection,
  getDocs,
  type Timestamp,
} from 'firebase/firestore';
import { db } from '@/services/firebase/config';
import type { BlogPost, CategoriasBlog } from '@/types/blog';
import { mockBlogPosts } from '@/data/mock';

/* ── Constants ──────────────────────────────────────────────────────────── */

const COLLECTION = 'blog';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/* ── In-memory cache ────────────────────────────────────────────────────── */

let cache: { data: BlogPost[]; timestamp: number } | null = null;

/* ── Helpers ─────────────────────────────────────────────────────────────── */

/** Map a Firestore document to a BlogPost object. */
function mapDoc(doc: { id: string; data: () => Record<string, unknown> }): BlogPost {
  const d = doc.data();

  const toISO = (val: unknown): string => {
    if (val instanceof Object && 'toDate' in val) {
      return (val as Timestamp).toDate().toISOString();
    }
    return (val as string) ?? new Date().toISOString();
  };

  const rawAutor = d.autor;
  const autor =
    typeof rawAutor === 'string'
      ? { nombre: rawAutor }
      : (rawAutor as Record<string, unknown>) ?? {};

  return {
    id: doc.id,
    titulo: (d.titulo as string) ?? '',
    slug: (d.slug as string) ?? '',
    extracto: (d.extracto as string) ?? '',
    contenido: (d.contenido as string) ?? '',
    imagenPortada: (d.imagenPortada as string) ?? '',
    autor: {
      nombre: (autor.nombre as string) ?? '',
      avatar: autor.avatar as string | undefined,
      bio: autor.bio as string | undefined,
    },
    categoria: (d.categoria as CategoriasBlog) ?? 'noticias',
    tags: (d.tags as string[]) ?? [],
    fechaPublicacion: toISO(d.fechaPublicacion),
    tiempoLectura: (d.tiempoLectura as number) ?? 5,
    publicado: (d.publicado as boolean) ?? false,
  };
}

/* ── Data fetching with cache ───────────────────────────────────────────── */

/**
 * Fetch all blog posts from Firestore, using the in-memory cache when fresh.
 * Falls back to mock data if Firestore is unavailable.
 */
async function fetchAllBlogPosts(): Promise<BlogPost[]> {
  // Return cached data if still fresh
  if (cache && Date.now() - cache.timestamp < CACHE_TTL) {
    return cache.data;
  }

  try {
    const snapshot = await getDocs(collection(db, COLLECTION));
    const allPosts = snapshot.docs.map(mapDoc);

    // Filter published and sort by date (done in JS to avoid composite index)
    const posts = allPosts
      .filter((p) => p.publicado)
      .sort(
        (a, b) =>
          new Date(b.fechaPublicacion).getTime() -
          new Date(a.fechaPublicacion).getTime(),
      );

    // Update cache
    cache = { data: posts, timestamp: Date.now() };

    return posts;
  } catch (err) {
    console.warn(
      '[Blog] Firestore query failed, falling back to mock data:',
      err,
    );
    return mockBlogPosts
      .filter((p) => p.publicado)
      .sort(
        (a, b) =>
          new Date(b.fechaPublicacion).getTime() -
          new Date(a.fechaPublicacion).getTime(),
      );
  }
}

/* ── Public API ──────────────────────────────────────────────────────────── */

/**
 * Get all published blog posts, optionally filtered by category.
 * Results are sorted by publication date, newest first.
 */
export async function getBlogPosts(
  categoria?: CategoriasBlog | string
): Promise<BlogPost[]> {
  const posts = await fetchAllBlogPosts();

  if (!categoria) {
    return posts;
  }

  return posts.filter((p) => p.categoria === categoria);
}

/**
 * Get a single blog post by its URL slug
 */
export async function getBlogPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const all = await fetchAllBlogPosts();
  return all.find((p) => p.slug === slug) ?? null;
}

/**
 * Get the most recent published blog posts
 * @param limit - Maximum number of posts to return (default: 3)
 */
export async function getRecentPosts(
  limit: number = 3
): Promise<BlogPost[]> {
  const allPosts = await fetchAllBlogPosts();
  return allPosts.slice(0, limit);
}

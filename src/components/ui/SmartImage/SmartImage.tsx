'use client';

/**
 * SmartImage — wrapper around next/image for optimized, lazy-loaded photos.
 *
 * Uses `fill` so it adapts to any positioned container (the existing image
 * wrappers already set aspect-ratio + position). If the URL is empty or the
 * image fails to load, it renders the provided `fallback` node instead
 * (preserving the previous gradient/placeholder behavior).
 */

import Image from 'next/image';
import { useState, type ReactNode } from 'react';

interface SmartImageProps {
  /** Image URL. When empty, the fallback is rendered. */
  src: string | undefined | null;
  /** Accessible alt text. */
  alt: string;
  /** CSS class applied to the image (object-fit, etc.). */
  className?: string;
  /** Responsive sizes hint for the optimizer. */
  sizes?: string;
  /** Load this image eagerly (use for above-the-fold hero images). */
  priority?: boolean;
  /** Rendered when there is no src or the image fails to load. */
  fallback: ReactNode;
}

const DEFAULT_SIZES = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';

export default function SmartImage({
  src,
  alt,
  className,
  sizes,
  priority,
  fallback,
}: SmartImageProps) {
  const [errored, setErrored] = useState(false);

  if (!src || errored) {
    return <>{fallback}</>;
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes ?? DEFAULT_SIZES}
      className={className}
      priority={priority}
      // Load images directly (skip Vercel's optimizer proxy): the residencia
      // photos live on third-party hosts, some of which block server-side
      // fetches (WordPress hotlink protection) or use expiring signed URLs.
      unoptimized
      onError={() => setErrored(true)}
    />
  );
}

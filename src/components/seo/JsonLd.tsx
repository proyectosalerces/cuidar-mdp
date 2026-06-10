/**
 * JSON-LD Structured Data component.
 *
 * Uses Next.js Script component to avoid the "script tag inside React
 * component" warning in Next.js 16+.
 */

import Script from 'next/script';

interface JsonLdProps {
  /** The JSON-LD structured data object to embed */
  data: Record<string, unknown>;
  /** Unique id for the script tag */
  id?: string;
}

export default function JsonLd({ data, id = 'json-ld' }: JsonLdProps) {
  return (
    <Script
      id={id}
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

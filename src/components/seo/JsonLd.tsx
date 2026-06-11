/**
 * JSON-LD Structured Data component.
 *
 * Renders as a plain <script type="application/ld+json"> tag so that
 * search-engine crawlers see the structured data in the initial HTML.
 */

export default function JsonLd({ id, data }: { id: string; data: object }) {
  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

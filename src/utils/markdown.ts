/**
 * Simple markdown-to-HTML converter.
 *
 * Handles the subset of Markdown used in the blog mock data:
 * - ## / ### headings
 * - **bold**
 * - Unordered lists (- item)
 * - Ordered lists (1. item)
 * - Paragraphs (double-newline separated)
 * - [text](url) links
 * - > blockquotes
 */

export function markdownToHtml(md: string): string {
  const lines = md.split('\n');
  const htmlParts: string[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Skip empty lines
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Headings: ### before ##
    if (line.startsWith('### ')) {
      htmlParts.push(`<h3>${inlineFormat(line.slice(4).trim())}</h3>`);
      i++;
      continue;
    }

    if (line.startsWith('## ')) {
      htmlParts.push(`<h2>${inlineFormat(line.slice(3).trim())}</h2>`);
      i++;
      continue;
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quoteLines: string[] = [];
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(lines[i].slice(2).trim());
        i++;
      }
      htmlParts.push(`<blockquote><p>${inlineFormat(quoteLines.join(' '))}</p></blockquote>`);
      continue;
    }

    // Ordered list (1. / 2. / etc.)
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+\.\s/, '').trim());
        i++;
      }
      const lis = items.map((item) => `<li>${inlineFormat(item)}</li>`).join('');
      htmlParts.push(`<ol>${lis}</ol>`);
      continue;
    }

    // Unordered list (- item)
    if (line.startsWith('- ')) {
      const items: string[] = [];
      while (i < lines.length && lines[i].startsWith('- ')) {
        items.push(lines[i].slice(2).trim());
        i++;
      }
      const lis = items.map((item) => `<li>${inlineFormat(item)}</li>`).join('');
      htmlParts.push(`<ul>${lis}</ul>`);
      continue;
    }

    // Paragraph — collect consecutive non-empty, non-special lines
    const paragraphLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('## ') &&
      !lines[i].startsWith('### ') &&
      !lines[i].startsWith('> ') &&
      !lines[i].startsWith('- ') &&
      !/^\d+\.\s/.test(lines[i])
    ) {
      paragraphLines.push(lines[i].trim());
      i++;
    }

    if (paragraphLines.length > 0) {
      htmlParts.push(`<p>${inlineFormat(paragraphLines.join(' '))}</p>`);
    }
  }

  return htmlParts.join('\n');
}

/**
 * Escape HTML special characters so any raw HTML in the source text is
 * rendered as plain text instead of being executed by the browser (XSS guard).
 */
function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Only allow safe link schemes. Blocks javascript:, data:, etc.
 * Returns the URL if safe, or null to drop the link.
 */
function safeUrl(url: string): string | null {
  const trimmed = url.trim();
  if (/^(https?:\/\/|\/|mailto:|tel:|#)/i.test(trimmed)) {
    return trimmed;
  }
  return null;
}

/**
 * Process inline formatting: **bold**, [text](url)
 *
 * Escapes the raw text FIRST, then applies the markdown formatting on top,
 * so user content can never inject executable HTML.
 */
function inlineFormat(text: string): string {
  // 1) Neutralize any HTML in the raw text
  let result = escapeHtml(text);
  // 2) Bold: **text**
  result = result.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // 3) Links: [text](url) — validate the URL scheme, drop unsafe ones
  result = result.replace(/\[(.+?)\]\((.+?)\)/g, (_match, label: string, url: string) => {
    const safe = safeUrl(url);
    if (!safe) return label;
    return `<a href="${safe}" rel="noopener noreferrer">${label}</a>`;
  });
  return result;
}

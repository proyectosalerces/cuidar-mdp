/**
 * Site footer with 4-column grid: brand, navigation, contact, social/newsletter.
 */

import Link from 'next/link';
import {
  SITE_NAME,
  SITE_TAGLINE,
  SITE_DESCRIPTION,
  NAV_ITEMS,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  WHATSAPP_NUMBER,
  SOCIAL_LINKS,
} from '@/utils/constants';
import NewsletterForm from '@/components/newsletter/NewsletterForm';
import styles from './Footer.module.css';

const currentYear = new Date().getFullYear();

/** Map platform names to short visual labels (used as icon placeholders). */
const PLATFORM_ICONS: Record<string, string> = {
  instagram: 'IG',
  facebook: 'FB',
  whatsapp: 'WA',
  linkedin: 'IN',
  youtube: 'YT',
};

export default function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.grid}>
        {/* ── Column 1: Brand ──────────────────────────────── */}
        <div className={styles.brandCol}>
          <Link href="/" className={styles.brandLogo}>
            <span className={styles.brandIcon} aria-hidden="true">C</span>
            <span className={styles.brandName}>{SITE_NAME}</span>
          </Link>
          <p className={styles.tagline}>{SITE_TAGLINE}</p>
          <p className={styles.brandDescription}>{SITE_DESCRIPTION}</p>
        </div>

        {/* ── Column 2: Navigation ────────────────────────── */}
        <div>
          <h3 className={styles.columnTitle}>Navegación</h3>
          <nav className={styles.navList} aria-label="Navegación del pie de página">
            {NAV_ITEMS.map((item) => (
              <Link key={item.href} href={item.href} className={styles.navItem}>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* ── Column 3: Contact ───────────────────────────── */}
        <div>
          <h3 className={styles.columnTitle}>Contacto</h3>
          <div className={styles.contactList}>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon} aria-hidden="true">✉</span>
              <a href={`mailto:${CONTACT_EMAIL}`} className={styles.contactLink}>
                {CONTACT_EMAIL}
              </a>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon} aria-hidden="true">☎</span>
              <a href={`tel:${CONTACT_PHONE.replace(/\s/g, '')}`} className={styles.contactLink}>
                {CONTACT_PHONE}
              </a>
            </div>
            <div className={styles.contactItem}>
              <span className={styles.contactIcon} aria-hidden="true">💬</span>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                className={styles.contactLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* ── Column 4: Social & Newsletter ───────────────── */}
        <div>
          <h3 className={styles.columnTitle}>Seguinos</h3>
          <div className={styles.socialRow}>
            {SOCIAL_LINKS.map((link) => (
              <a
                key={link.platform}
                href={link.url}
                className={styles.socialLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={link.label}
              >
                {PLATFORM_ICONS[link.platform] ?? link.platform[0].toUpperCase()}
              </a>
            ))}
          </div>

          <NewsletterForm />
        </div>
      </div>

      {/* ── Bottom bar ──────────────────────────────────────── */}
      <div className={styles.bottomBar}>
        <div className={styles.bottomInner}>
          <p className={styles.copyright}>
            © {currentYear} {SITE_NAME}. Todos los derechos reservados.
          </p>
          <div className={styles.legalLinks}>
            <Link href="/privacidad" className={styles.legalLink}>
              Política de privacidad
            </Link>
            <Link href="/terminos" className={styles.legalLink}>
              Términos y condiciones
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

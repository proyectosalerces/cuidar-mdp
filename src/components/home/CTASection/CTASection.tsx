/**
 * CTASection — Full-width call-to-action with gradient background.
 */

import Link from 'next/link';
import { WHATSAPP_NUMBER } from '@/utils/constants';
import styles from './CTASection.module.css';

export default function CTASection() {
  return (
    <section className={styles.section} aria-label="Solicitar asesoramiento">
      <div className={styles.container}>
        <h2 className={styles.heading}>
          ¿No sabés por dónde empezar?
        </h2>
        <p className={styles.subheading}>
          Nuestro equipo te asesora de forma gratuita.
          Contanos la situación y te recomendamos las mejores opciones.
        </p>

        <div className={styles.buttons}>
          <Link href="/contacto" className={styles.buttonPrimary}>
            Solicitar asesoramiento
          </Link>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Hola, necesito asesoramiento para encontrar una residencia geriátrica')}`}
            className={styles.buttonWhatsapp}
            target="_blank"
            rel="noopener noreferrer"
          >
            💬 Hablar por WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}

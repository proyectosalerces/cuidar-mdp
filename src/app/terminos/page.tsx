/**
 * /terminos route — Términos y Condiciones page (server component with SEO metadata).
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { generateMetadata as genMeta } from '@/utils/seo';
import styles from '../(legal)/legal.module.css';

export const metadata: Metadata = genMeta({
  title: 'Términos y Condiciones',
  description:
    'Términos y condiciones de uso del sitio web de Cuidar MdP, consultora de recomendación geriátrica en Mar del Plata, Argentina.',
  path: '/terminos',
});

export default function TerminosPage() {
  return (
    <main>
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Hero                                                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className={styles.hero} aria-label="Términos y Condiciones">
        <div className={styles.heroDecorLeft} aria-hidden="true" />
        <div className={styles.heroDecorRight} aria-hidden="true" />

        <div className={styles.container}>
          <div className={styles.heroContent}>
            <nav className={styles.heroBreadcrumb} aria-label="Breadcrumb">
              <Link href="/">Inicio</Link>
              <span className={styles.heroBreadcrumbSep} aria-hidden="true">
                ›
              </span>
              <span>Términos y Condiciones</span>
            </nav>

            <h1 className={styles.heroTitle}>Términos y Condiciones</h1>
            <p className={styles.heroSubtitle}>
              Conocé las condiciones que regulan el uso de nuestro sitio web y
              los servicios de Cuidar MdP.
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Body                                                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className={styles.body}>
        <div className={styles.container}>
          <div className={styles.content}>
            <div className={styles.lastUpdated}>
              <span className={styles.lastUpdatedIcon} aria-hidden="true">
                📅
              </span>
              Última actualización: 10 de junio de 2025
            </div>

            {/* 1. Aceptación ──────────────────────────────────────────────── */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                1. Aceptación de los Términos
              </h2>
              <p className={styles.sectionText}>
                Al acceder y utilizar el sitio web de Cuidar MdP
                (en adelante, &quot;el Sitio&quot;), usted acepta quedar vinculado por
                los presentes Términos y Condiciones. Si no está de acuerdo con
                alguna de estas condiciones, le solicitamos que no utilice el
                Sitio.
              </p>
              <p className={styles.sectionText}>
                El uso continuado del Sitio después de la publicación de
                modificaciones a estos términos constituye la aceptación de
                dichas modificaciones.
              </p>
            </div>

            <hr className={styles.divider} />

            {/* 2. Descripción del servicio ─────────────────────────────── */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                2. Descripción del Servicio
              </h2>
              <p className={styles.sectionText}>
                Cuidar MdP es una <strong>consultora de recomendación
                geriátrica</strong> con sede en Mar del Plata, Provincia de
                Buenos Aires, Argentina. Nuestro servicio consiste en asesorar y
                orientar a las familias en la búsqueda de residencias
                geriátricas, profesionales de salud y servicios de cuidado para
                adultos mayores.
              </p>
              <div className={styles.highlight}>
                <p>
                  Cuidar MdP actúa exclusivamente como intermediario y
                  facilitador de información. <strong>No prestamos servicios de
                  salud, asistencia médica ni cuidado geriátrico de manera
                  directa.</strong> Las decisiones sobre el cuidado de los
                  adultos mayores son responsabilidad exclusiva de las familias
                  y los profesionales de salud involucrados.
                </p>
              </div>
            </div>

            <hr className={styles.divider} />

            {/* 3. Uso del sitio web ─────────────────────────────────────── */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>3. Uso del Sitio Web</h2>
              <p className={styles.sectionText}>
                El usuario se compromete a utilizar el Sitio de conformidad con
                la ley, estos Términos y Condiciones, la moral y las buenas
                costumbres. En particular, el usuario se obliga a:
              </p>
              <ul className={styles.list}>
                <li>
                  No utilizar el Sitio con fines ilícitos o contrarios a lo
                  establecido en estos términos.
                </li>
                <li>
                  No introducir ni difundir contenido que sea difamatorio,
                  obsceno, amenazante o que vulnere derechos de terceros.
                </li>
                <li>
                  No intentar acceder de forma no autorizada a los sistemas o
                  redes conectadas al Sitio.
                </li>
                <li>
                  No reproducir, duplicar ni explotar con fines comerciales
                  ninguna parte del Sitio sin autorización expresa.
                </li>
                <li>
                  Proporcionar información veraz y actualizada cuando complete
                  formularios o solicite asesoramiento.
                </li>
              </ul>
            </div>

            <hr className={styles.divider} />

            {/* 4. Propiedad intelectual ─────────────────────────────────── */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                4. Propiedad Intelectual
              </h2>
              <p className={styles.sectionText}>
                Todo el contenido del Sitio, incluyendo pero no limitado a
                textos, gráficos, logotipos, íconos, imágenes, clips de audio,
                descargas digitales y compilaciones de datos, es propiedad de
                Cuidar MdP o de sus proveedores de contenido y está protegido
                por las leyes argentinas e internacionales de propiedad
                intelectual.
              </p>
              <p className={styles.sectionText}>
                La marca &quot;Cuidar MdP&quot;, su logotipo y elementos
                gráficos distintivos son propiedad exclusiva de Cuidar MdP.
                Queda prohibida su reproducción, distribución o modificación sin
                autorización previa por escrito.
              </p>
            </div>

            <hr className={styles.divider} />

            {/* 5. Limitación de responsabilidad ─────────────────────────── */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                5. Limitación de Responsabilidad
              </h2>
              <p className={styles.sectionText}>
                Cuidar MdP realiza sus mejores esfuerzos para que la información
                publicada en el Sitio sea precisa y actualizada. Sin embargo, no
                garantizamos la exactitud, integridad ni vigencia de dicha
                información.
              </p>
              <div className={styles.highlight}>
                <p>
                  Cuidar MdP es un <strong>intermediario</strong> y no un
                  prestador de servicios de salud. No asumimos responsabilidad
                  alguna por la calidad, seguridad o idoneidad de las
                  residencias, profesionales o servicios recomendados. La
                  contratación de cualquier servicio de terceros es una decisión
                  independiente del usuario.
                </p>
              </div>
              <p className={styles.sectionText}>
                En ningún caso Cuidar MdP será responsable por daños directos,
                indirectos, incidentales, consecuentes o especiales derivados
                del uso o la imposibilidad de uso del Sitio o de los servicios
                recomendados a través del mismo.
              </p>
            </div>

            <hr className={styles.divider} />

            {/* 6. Enlaces a terceros ─────────────────────────────────────── */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>6. Enlaces a Terceros</h2>
              <p className={styles.sectionText}>
                El Sitio puede contener enlaces a sitios web de terceros. Estos
                enlaces se proporcionan únicamente para conveniencia del
                usuario. Cuidar MdP no controla ni se responsabiliza por el
                contenido, las políticas de privacidad ni las prácticas de
                dichos sitios de terceros.
              </p>
              <p className={styles.sectionText}>
                La inclusión de un enlace no implica respaldo, aprobación ni
                asociación con el sitio de terceros enlazado.
              </p>
            </div>

            <hr className={styles.divider} />

            {/* 7. Modificaciones ───────────────────────────────────────── */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                7. Modificaciones de los Términos
              </h2>
              <p className={styles.sectionText}>
                Cuidar MdP se reserva el derecho de modificar estos Términos y
                Condiciones en cualquier momento y sin previo aviso. Las
                modificaciones entrarán en vigor desde su publicación en el
                Sitio. Es responsabilidad del usuario revisar periódicamente
                estos términos.
              </p>
              <p className={styles.sectionText}>
                La fecha de la última actualización se indica al inicio de este
                documento.
              </p>
            </div>

            <hr className={styles.divider} />

            {/* 8. Ley aplicable ────────────────────────────────────────── */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                8. Ley Aplicable y Jurisdicción
              </h2>
              <p className={styles.sectionText}>
                Estos Términos y Condiciones se rigen por las leyes de la
                República Argentina. Cualquier controversia derivada del uso del
                Sitio será sometida a la jurisdicción de los tribunales
                ordinarios de la ciudad de Mar del Plata, Provincia de Buenos
                Aires, renunciando las partes a cualquier otro fuero o
                jurisdicción que pudiera corresponderles.
              </p>
            </div>

            <hr className={styles.divider} />

            {/* 9. Contacto ─────────────────────────────────────────────── */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>9. Contacto</h2>
              <p className={styles.sectionText}>
                Si tiene preguntas o inquietudes sobre estos Términos y
                Condiciones, puede contactarnos a través de los siguientes
                medios:
              </p>
              <div className={styles.contactBox}>
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon} aria-hidden="true">
                    📞
                  </span>
                  Teléfono / WhatsApp:{' '}
                  <a
                    href="https://wa.me/542235409226"
                    className={styles.contactLink}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    223 540-9226
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

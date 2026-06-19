/**
 * /privacidad route — Política de Privacidad page (server component with SEO metadata).
 */

import type { Metadata } from 'next';
import Link from 'next/link';
import { generateMetadata as genMeta } from '@/utils/seo';
import styles from '../(legal)/legal.module.css';

export const metadata: Metadata = genMeta({
  title: 'Política de Privacidad',
  description:
    'Política de privacidad de Cuidar MdP. Conocé cómo recopilamos, usamos y protegemos tus datos personales conforme a la Ley 25.326 de Protección de Datos Personales de Argentina.',
  path: '/privacidad',
});

export default function PrivacidadPage() {
  return (
    <main>
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* Hero                                                               */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      <section className={styles.hero} aria-label="Política de Privacidad">
        <div className={styles.heroDecorLeft} aria-hidden="true" />
        <div className={styles.heroDecorRight} aria-hidden="true" />

        <div className={styles.container}>
          <div className={styles.heroContent}>
            <nav className={styles.heroBreadcrumb} aria-label="Breadcrumb">
              <Link href="/">Inicio</Link>
              <span className={styles.heroBreadcrumbSep} aria-hidden="true">
                ›
              </span>
              <span>Política de Privacidad</span>
            </nav>

            <h1 className={styles.heroTitle}>Política de Privacidad</h1>
            <p className={styles.heroSubtitle}>
              Tu privacidad es importante para nosotros. Conocé cómo
              recopilamos, usamos y protegemos tu información personal.
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

            <p className={styles.sectionText}>
              La presente Política de Privacidad describe cómo Cuidar MdP
              (en adelante, &quot;nosotros&quot; o &quot;el Sitio&quot;)
              recopila, utiliza, almacena y protege la información personal de
              los usuarios, en cumplimiento de la{' '}
              <strong>
                Ley 25.326 de Protección de Datos Personales
              </strong>{' '}
              de la República Argentina y su normativa complementaria.
            </p>

            <hr className={styles.divider} />

            {/* 1. Información que recopilamos ───────────────────────────── */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                1. Información que Recopilamos
              </h2>
              <p className={styles.sectionText}>
                Podemos recopilar los siguientes tipos de información:
              </p>

              <h3
                style={{
                  fontSize: 'var(--font-lg)',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  marginBottom: 'var(--space-3)',
                  fontFamily: 'var(--font-family-heading)',
                }}
              >
                Información proporcionada voluntariamente
              </h3>
              <ul className={styles.list}>
                <li>
                  Nombre y apellido, al completar formularios de contacto o
                  asesoramiento.
                </li>
                <li>
                  Número de teléfono y dirección de correo electrónico.
                </li>
                <li>
                  Información sobre el adulto mayor que requiere cuidado
                  (edad, necesidades de atención, ubicación preferida).
                </li>
                <li>
                  Reseñas y comentarios publicados en el Sitio.
                </li>
              </ul>

              <h3
                style={{
                  fontSize: 'var(--font-lg)',
                  fontWeight: 600,
                  color: 'var(--color-text)',
                  marginBottom: 'var(--space-3)',
                  marginTop: 'var(--space-5)',
                  fontFamily: 'var(--font-family-heading)',
                }}
              >
                Información recopilada automáticamente
              </h3>
              <ul className={styles.list}>
                <li>
                  Dirección IP y datos de geolocalización aproximada.
                </li>
                <li>
                  Tipo de navegador, sistema operativo y dispositivo utilizado.
                </li>
                <li>
                  Páginas visitadas, tiempo de permanencia y patrones de
                  navegación dentro del Sitio.
                </li>
                <li>
                  Datos recopilados a través de cookies y tecnologías similares.
                </li>
              </ul>
            </div>

            <hr className={styles.divider} />

            {/* 2. Cómo usamos la información ───────────────────────────── */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                2. Cómo Usamos la Información
              </h2>
              <p className={styles.sectionText}>
                Utilizamos la información recopilada para los siguientes fines:
              </p>
              <ul className={styles.list}>
                <li>
                  Brindar el servicio de asesoramiento y recomendación
                  geriátrica solicitado por el usuario.
                </li>
                <li>
                  Responder consultas y solicitudes enviadas a través de los
                  formularios de contacto.
                </li>
                <li>
                  Mejorar la experiencia de navegación y el funcionamiento del
                  Sitio.
                </li>
                <li>
                  Enviar comunicaciones relacionadas con nuestros servicios,
                  siempre que el usuario haya dado su consentimiento.
                </li>
                <li>
                  Elaborar estadísticas anónimas sobre el uso del Sitio.
                </li>
                <li>
                  Cumplir con obligaciones legales y requerimientos de
                  autoridades competentes.
                </li>
              </ul>
            </div>

            <hr className={styles.divider} />

            {/* 3. Cookies ──────────────────────────────────────────────── */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                3. Cookies y Tecnologías Similares
              </h2>
              <p className={styles.sectionText}>
                El Sitio utiliza cookies y tecnologías similares para mejorar la
                experiencia del usuario. Las cookies son pequeños archivos de
                texto que se almacenan en su dispositivo al visitar el Sitio.
              </p>
              <p className={styles.sectionText}>
                Utilizamos los siguientes tipos de cookies:
              </p>
              <ul className={styles.list}>
                <li>
                  <strong>Cookies esenciales:</strong> necesarias para el
                  funcionamiento básico del Sitio (inicio de sesión,
                  preferencias de idioma).
                </li>
                <li>
                  <strong>Cookies analíticas:</strong> nos permiten comprender
                  cómo los usuarios interactúan con el Sitio para mejorar su
                  funcionamiento.
                </li>
                <li>
                  <strong>Cookies de preferencias:</strong> recuerdan sus
                  opciones (como el modo oscuro) para brindar una experiencia
                  personalizada.
                </li>
              </ul>
              <p className={styles.sectionText}>
                Puede configurar su navegador para rechazar todas las cookies o
                para recibir un aviso cuando se envíe una cookie. Tenga en
                cuenta que algunas funcionalidades del Sitio podrían no
                funcionar correctamente si desactiva las cookies.
              </p>
            </div>

            <hr className={styles.divider} />

            {/* 4. Compartir información ─────────────────────────────────── */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                4. Compartir Información con Terceros
              </h2>
              <p className={styles.sectionText}>
                Cuidar MdP no vende, alquila ni comercializa datos personales de
                los usuarios. Podemos compartir información en los siguientes
                casos:
              </p>
              <ul className={styles.list}>
                <li>
                  <strong>Residencias y profesionales recomendados:</strong>{' '}
                  cuando el usuario solicita asesoramiento, podemos compartir
                  datos de contacto con las residencias o profesionales
                  seleccionados para facilitar la comunicación.
                </li>
                <li>
                  <strong>Proveedores de servicios:</strong> utilizamos
                  servicios de terceros (hosting, analíticas, correo
                  electrónico) que pueden acceder a datos personales
                  exclusivamente para prestar el servicio contratado.
                </li>
                <li>
                  <strong>Obligaciones legales:</strong> cuando sea requerido
                  por ley, orden judicial o autoridad competente.
                </li>
              </ul>
            </div>

            <hr className={styles.divider} />

            {/* 5. Seguridad ────────────────────────────────────────────── */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                5. Seguridad de los Datos
              </h2>
              <p className={styles.sectionText}>
                Implementamos medidas de seguridad técnicas y organizativas
                apropiadas para proteger la información personal contra el
                acceso no autorizado, la alteración, divulgación o destrucción.
                Estas medidas incluyen:
              </p>
              <ul className={styles.list}>
                <li>Cifrado de datos en tránsito mediante protocolo HTTPS.</li>
                <li>
                  Control de acceso restringido a los datos personales
                  almacenados.
                </li>
                <li>
                  Uso de plataformas de almacenamiento con certificaciones de
                  seguridad reconocidas internacionalmente.
                </li>
              </ul>
              <p className={styles.sectionText}>
                Sin embargo, ningún método de transmisión por Internet ni de
                almacenamiento electrónico es 100% seguro. Si bien nos
                esforzamos por proteger su información, no podemos garantizar su
                seguridad absoluta.
              </p>
            </div>

            <hr className={styles.divider} />

            {/* 6. Derechos del usuario (ARCO) ──────────────────────────── */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                6. Derechos del Usuario
              </h2>
              <p className={styles.sectionText}>
                De acuerdo con la Ley 25.326 de Protección de Datos Personales
                de Argentina, usted tiene los siguientes derechos sobre sus
                datos personales:
              </p>
              <ul className={styles.list}>
                <li>
                  <strong>Acceso:</strong> solicitar información sobre los datos
                  personales que tenemos almacenados sobre usted.
                </li>
                <li>
                  <strong>Rectificación:</strong> solicitar la corrección de
                  datos personales inexactos o incompletos.
                </li>
                <li>
                  <strong>Supresión:</strong> solicitar la eliminación de sus
                  datos personales cuando ya no sean necesarios para los fines
                  para los cuales fueron recopilados.
                </li>
                <li>
                  <strong>Oposición:</strong> oponerse al tratamiento de sus
                  datos personales en determinadas circunstancias.
                </li>
              </ul>
              <div className={styles.highlight}>
                <p>
                  Para ejercer cualquiera de estos derechos, puede contactarnos
                  a través de los medios indicados al final de esta política.
                  Responderemos a su solicitud en un plazo máximo de 10 días
                  hábiles conforme a lo establecido por la normativa vigente.
                </p>
              </div>
              <p className={styles.sectionText}>
                La AGENCIA DE ACCESO A LA INFORMACIÓN PÚBLICA, en su carácter
                de Órgano de Control de la Ley 25.326, tiene la atribución de
                atender las denuncias y reclamos que interpongan quienes
                resulten afectados en sus derechos por incumplimiento de las
                normas vigentes en materia de protección de datos personales.
              </p>
            </div>

            <hr className={styles.divider} />

            {/* 7. Retención de datos ──────────────────────────────────── */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>7. Retención de Datos</h2>
              <p className={styles.sectionText}>
                Conservamos los datos personales durante el tiempo necesario
                para cumplir con los fines para los que fueron recopilados,
                incluyendo la prestación del servicio de asesoramiento, el
                cumplimiento de obligaciones legales y la resolución de
                eventuales controversias.
              </p>
              <p className={styles.sectionText}>
                Una vez que los datos ya no sean necesarios, procederemos a su
                eliminación o anonimización de forma segura.
              </p>
            </div>

            <hr className={styles.divider} />

            {/* 8. Menores de edad ──────────────────────────────────────── */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>8. Menores de Edad</h2>
              <p className={styles.sectionText}>
                El Sitio no está dirigido a menores de 18 años. No recopilamos
                intencionalmente información personal de menores de edad. Si
                tomamos conocimiento de que hemos recopilado datos de un menor,
                procederemos a eliminarlos de inmediato.
              </p>
              <p className={styles.sectionText}>
                Si usted es padre, madre o tutor y cree que su hijo/a nos ha
                proporcionado datos personales, le solicitamos que se comunique
                con nosotros para gestionar su eliminación.
              </p>
            </div>

            <hr className={styles.divider} />

            {/* 9. Cambios en la política ──────────────────────────────── */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>
                9. Cambios en esta Política
              </h2>
              <p className={styles.sectionText}>
                Nos reservamos el derecho de actualizar esta Política de
                Privacidad en cualquier momento. Cualquier modificación será
                publicada en esta página con la fecha de actualización
                correspondiente.
              </p>
              <p className={styles.sectionText}>
                Le recomendamos revisar periódicamente esta política para
                mantenerse informado sobre cómo protegemos su información.
              </p>
            </div>

            <hr className={styles.divider} />

            {/* 10. Contacto ──────────────────────────────────────────── */}
            <div className={styles.section}>
              <h2 className={styles.sectionTitle}>10. Contacto</h2>
              <p className={styles.sectionText}>
                Si tiene preguntas, comentarios o solicitudes relacionadas con
                esta Política de Privacidad o el tratamiento de sus datos
                personales, puede contactarnos a través de:
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
                <div className={styles.contactItem}>
                  <span className={styles.contactIcon} aria-hidden="true">
                    ✉️
                  </span>
                  Email:{' '}
                  <a
                    href="mailto:info@cuidarmdp.com"
                    className={styles.contactLink}
                  >
                    info@cuidarmdp.com
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

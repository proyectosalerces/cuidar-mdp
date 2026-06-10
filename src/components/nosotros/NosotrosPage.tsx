'use client';

/**
 * NosotrosPage — Premium institutional About Us page.
 *
 * Sections:
 * 1. Hero with forest green gradient
 * 2. Misión & Visión
 * 3. Nuestros Valores (6-card grid)
 * 4. Cómo Trabajamos (4-step timeline)
 * 5. Números que nos respaldan (stats)
 * 6. CTA with action buttons
 */

import { Button } from '@/components/ui';
import {
  SITE_NAME,
  WHATSAPP_NUMBER,
} from '@/utils/constants';
import { buildWhatsAppLink } from '@/utils/formatters';
import styles from './NosotrosPage.module.css';

/* ─── Data ────────────────────────────────────────────────────────────────── */

const VALORES = [
  {
    icon: '💛',
    title: 'Empatía',
    description:
      'Entendemos que detrás de cada consulta hay una familia que necesita apoyo.',
  },
  {
    icon: '🔍',
    title: 'Transparencia',
    description:
      'Brindamos información honesta y sin compromisos comerciales.',
  },
  {
    icon: '🎓',
    title: 'Profesionalismo',
    description:
      'Nuestro equipo está capacitado en gerontología y cuidado geriátrico.',
  },
  {
    icon: '🤝',
    title: 'Compromiso',
    description:
      'Acompañamos a cada familia en todo el proceso de búsqueda.',
  },
  {
    icon: '📍',
    title: 'Cercanía',
    description:
      'Conocemos Mar del Plata, sus barrios, residencias y profesionales.',
  },
  {
    icon: '🎁',
    title: 'Gratuidad',
    description:
      'Nuestro servicio de asesoramiento es 100% gratuito para las familias.',
  },
] as const;

const PASOS = [
  {
    title: 'Escuchamos',
    description:
      'Conocemos la situación del adulto mayor y las necesidades de la familia.',
  },
  {
    title: 'Evaluamos',
    description:
      'Analizamos las opciones disponibles según criterios de calidad.',
  },
  {
    title: 'Recomendamos',
    description:
      'Sugerimos las mejores alternativas personalizadas.',
  },
  {
    title: 'Acompañamos',
    description:
      'Te acompañamos en la visita y seguimiento posterior.',
  },
] as const;

const STATS = [
  { value: '19+', label: 'Residencias verificadas' },
  { value: '12', label: 'Profesionales recomendados' },
  { value: '100%', label: 'Asesoramiento gratuito' },
  { value: '8+', label: 'Años de experiencia en el sector' },
] as const;

/* ─── Component ───────────────────────────────────────────────────────────── */

export default function NosotrosPage() {
  const whatsappLink = buildWhatsAppLink(
    WHATSAPP_NUMBER,
    `Hola ${SITE_NAME}, me gustaría solicitar asesoramiento sobre cuidado geriátrico.`,
  );

  return (
    <main>
      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* 1. Hero                                                            */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className={styles.hero} aria-label="Sobre nosotros">
        <div className={styles.heroDecorLeft} aria-hidden="true" />
        <div className={styles.heroDecorRight} aria-hidden="true" />

        <div className={styles.container}>
          <div className={styles.heroContent}>
            <nav className={styles.heroBreadcrumb} aria-label="Breadcrumb">
              <a href="/">Inicio</a>
              <span className={styles.heroBreadcrumbSep} aria-hidden="true">
                ›
              </span>
              <span>Nosotros</span>
            </nav>

            <h1 className={styles.heroTitle}>
              Sobre{' '}
              <span className={styles.heroTitleAccent}>{SITE_NAME}</span>
            </h1>

            <p className={styles.heroSubtitle}>
              Somos una consultora de recomendación geriátrica en Mar del Plata.
              Ayudamos a las familias a encontrar el mejor cuidado para sus
              seres queridos.
            </p>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* 2. Misión & Visión                                                 */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className={styles.missionSection} aria-labelledby="mision-heading">
        <div className={styles.container}>
          <div className={styles.missionGrid}>
            {/* Text column */}
            <div className={styles.missionContent}>
              <div>
                <span className={styles.sectionLabel}>Quiénes somos</span>
                <h2 id="mision-heading" className={styles.sectionTitle}>
                  Nuestra Misión y Visión
                </h2>
              </div>

              <div className={styles.missionBlock}>
                <h3 className={styles.missionBlockTitle}>
                  <span className={styles.missionBlockIcon} aria-hidden="true">
                    🎯
                  </span>
                  Nuestra Misión
                </h3>
                <p className={styles.missionBlockText}>
                  Brindar a las familias marplatenses la información, el
                  acompañamiento y la confianza necesarias para tomar la mejor
                  decisión sobre el cuidado de sus adultos mayores.
                </p>
              </div>

              <div className={styles.missionBlock}>
                <h3 className={styles.missionBlockTitle}>
                  <span className={styles.missionBlockIcon} aria-hidden="true">
                    🌟
                  </span>
                  Nuestra Visión
                </h3>
                <p className={styles.missionBlockText}>
                  Ser la consultora de referencia en Mar del Plata para el
                  cuidado geriátrico, donde cada familia encuentre orientación
                  transparente, humana y profesional.
                </p>
              </div>
            </div>

            {/* Decorative column */}
            <div className={styles.missionDecor} aria-hidden="true">
              <div className={styles.missionDecorCircle}>
                <span className={styles.missionDecorDot} />
                <span className={styles.missionDecorDot} />
                <span className={styles.missionDecorDot} />
                <div className={styles.missionDecorInner}>🏡</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* 3. Nuestros Valores                                                */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className={styles.valuesSection} aria-labelledby="valores-heading">
        <div className={styles.container}>
          <div className={styles.valuesHeader}>
            <span className={styles.sectionLabel}>Lo que nos define</span>
            <h2 id="valores-heading" className={styles.sectionTitle}>
              Nuestros Valores
            </h2>
            <p className={styles.sectionSubtitle} style={{ marginInline: 'auto' }}>
              Cada decisión que tomamos está guiada por estos principios
              fundamentales.
            </p>
          </div>

          <div className={styles.valuesGrid}>
            {VALORES.map((valor) => (
              <article key={valor.title} className={styles.valueCard}>
                <div className={styles.valueIcon} aria-hidden="true">
                  {valor.icon}
                </div>
                <h3 className={styles.valueTitle}>{valor.title}</h3>
                <p className={styles.valueDescription}>{valor.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* 4. Cómo Trabajamos                                                 */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className={styles.processSection} aria-labelledby="proceso-heading">
        <div className={styles.container}>
          <div className={styles.processHeader}>
            <span className={styles.sectionLabel}>Nuestro proceso</span>
            <h2 id="proceso-heading" className={styles.sectionTitle}>
              Cómo Trabajamos
            </h2>
            <p className={styles.sectionSubtitle} style={{ marginInline: 'auto' }}>
              Un acompañamiento integral en cada etapa del camino.
            </p>
          </div>

          <div className={styles.processTimeline}>
            {PASOS.map((paso, i) => (
              <div key={paso.title} className={styles.processStep}>
                <div className={styles.processStepNumber} aria-hidden="true">
                  {i + 1}
                </div>
                <div className={styles.processStepContent}>
                  <h3 className={styles.processStepTitle}>{paso.title}</h3>
                  <p className={styles.processStepDescription}>
                    {paso.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* 5. Estadísticas                                                    */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className={styles.statsSection} aria-labelledby="stats-heading">
        <div className={styles.container}>
          <div className={styles.statsHeader}>
            <span className={styles.sectionLabel} style={{ color: 'rgba(255,255,255,0.6)' }}>
              Nuestro impacto
            </span>
            <h2 id="stats-heading" className={styles.statsTitle}>
              Números que nos respaldan
            </h2>
            <p className={styles.statsSubtitle}>
              Nuestra trayectoria habla por nosotros.
            </p>
          </div>

          <div className={styles.statsGrid}>
            {STATS.map((stat) => (
              <div key={stat.label} className={styles.statCard}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* 6. CTA                                                             */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className={styles.ctaSection} aria-labelledby="cta-heading">
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2 id="cta-heading" className={styles.ctaTitle}>
              ¿Necesitás ayuda para elegir?
            </h2>
            <p className={styles.ctaSubtitle}>
              Nuestro equipo está listo para escucharte y acompañarte en la
              búsqueda del mejor cuidado para tu ser querido.
            </p>
            <div className={styles.ctaButtons}>
              <Button
                variant="primary"
                size="lg"
                href="/asesoramiento"
                icon={<span aria-hidden="true">📋</span>}
              >
                Solicitar asesoramiento
              </Button>
              <Button
                variant="whatsapp"
                size="lg"
                href={whatsappLink}
                icon={
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                }
              >
                Hablar por WhatsApp
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

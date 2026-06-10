/**
 * HowItWorks — 3-step process explanation with numbered circles.
 */

import styles from './HowItWorks.module.css';

interface Step {
  number: number;
  icon: string;
  title: string;
  description: string;
}

const STEPS: Step[] = [
  {
    number: 1,
    icon: '💬',
    title: 'Contanos qué necesitás',
    description: 'Describí la situación del adulto mayor y qué tipo de cuidado estás buscando.',
  },
  {
    number: 2,
    icon: '✅',
    title: 'Recibí recomendaciones',
    description: 'Te sugerimos opciones verificadas y adaptadas a tus necesidades y presupuesto.',
  },
  {
    number: 3,
    icon: '🏠',
    title: 'Visitá y elegí',
    description: 'Te acompañamos en todo el proceso, desde la visita hasta la adaptación.',
  },
];

export default function HowItWorks() {
  return (
    <section className={styles.section} aria-label="Cómo funciona">
      <div className={styles.container}>
        <span className={styles.sectionLabel}>Proceso simple</span>
        <h2 className={styles.title}>¿Cómo funciona?</h2>
        <p className={styles.subtitle}>
          En tres pasos te ayudamos a encontrar el lugar ideal para tu ser querido.
        </p>

        <div className={styles.stepsRow}>
          {STEPS.map((step) => (
            <div key={step.number} className={styles.step}>
              <div className={styles.stepNumber} aria-hidden="true">
                {step.number}
              </div>
              <span className={styles.stepIcon} aria-hidden="true">
                {step.icon}
              </span>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepDescription}>{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/**
 * /alta-profesional — Public intake form for professionals to join the directory.
 */

import type { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/utils/seo';
import AltaProfesionalForm from '@/components/alta/AltaProfesionalForm';
import styles from '../alta-residencia/page.module.css';

export const metadata: Metadata = genMeta({
  title: 'Sumate como profesional',
  description:
    'Sumate al portal de Cuidar MdP como profesional del cuidado de adultos mayores en Mar del Plata: geriatría, kinesiología, abogados de amparos y más.',
  path: '/alta-profesional',
  noIndex: true,
});

export default function AltaProfesionalPage() {
  return (
    <main className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Sumate como profesional a Cuidar MdP</h1>
        <p className={styles.intro}>
          Completá este formulario para aparecer en el portal ante las familias que buscan
          profesionales del cuidado de adultos mayores en Mar del Plata. Es <strong>gratuito</strong>.
          Solo los primeros campos son obligatorios. Al final te pedimos tu autorización para publicar
          la información.
        </p>
      </header>

      <AltaProfesionalForm />
    </main>
  );
}

/**
 * /alta-residencia — Public intake form for residencias to join the directory.
 */

import type { Metadata } from 'next';
import { generateMetadata as genMeta } from '@/utils/seo';
import AltaResidenciaForm from '@/components/alta/AltaResidenciaForm';
import styles from './page.module.css';

export const metadata: Metadata = genMeta({
  title: 'Sumá tu residencia',
  description:
    'Sumá tu residencia geriátrica al portal de Cuidar MdP. Completá tus datos, servicios y valores para aparecer ante las familias que buscan en Mar del Plata.',
  path: '/alta-residencia',
  noIndex: true,
});

export default function AltaResidenciaPage() {
  return (
    <main className={`container ${styles.page}`}>
      <header className={styles.header}>
        <h1 className={styles.title}>Sumá tu residencia a Cuidar MdP</h1>
        <p className={styles.intro}>
          Completá este formulario para que tu residencia aparezca en el portal. Es{' '}
          <strong>gratuito</strong>. Solo los primeros campos son obligatorios; el resto lo podés
          completar con lo que tengas a mano. La información se publica para orientar a las familias,
          por eso al final te pedimos tu autorización.
        </p>
      </header>

      <AltaResidenciaForm />
    </main>
  );
}

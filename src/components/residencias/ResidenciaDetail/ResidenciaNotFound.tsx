'use client';

/**
 * ResidenciaNotFound — Friendly 404 component for when a residencia slug doesn't match.
 */

import Link from 'next/link';
import { Button } from '@/components/ui';
import styles from './ResidenciaDetail.module.css';

export default function ResidenciaNotFound() {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.notFound}>
        <svg className={styles.notFoundIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="10" />
          <path d="M16 16s-1.5-2-4-2-4 2-4 2" strokeLinecap="round" strokeLinejoin="round" />
          <line x1="9" y1="9" x2="9.01" y2="9" strokeLinecap="round" strokeWidth="2" />
          <line x1="15" y1="9" x2="15.01" y2="9" strokeLinecap="round" strokeWidth="2" />
        </svg>
        <h1 className={styles.notFoundTitle}>Residencia no encontrada</h1>
        <p className={styles.notFoundDescription}>
          No pudimos encontrar la residencia que estás buscando. Es posible que
          haya sido removida o que el enlace sea incorrecto.
        </p>
        <Link href="/residencias">
          <Button variant="primary">Ver todas las residencias</Button>
        </Link>
      </div>
    </div>
  );
}

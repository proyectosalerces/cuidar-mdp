/**
 * ProfesionalNotFound — Friendly 404 state for missing professionals.
 */

import Link from 'next/link';
import { Button } from '@/components/ui';
import styles from './ProfesionalDetail.module.css';

/* ── Inline SVG Icon ──────────────────────────────────────────────────── */

function SearchOffIcon() {
  return (
    <svg
      className={styles.notFoundIcon}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
      <line x1="8" y1="8" x2="14" y2="14" />
      <line x1="14" y1="8" x2="8" y2="14" />
    </svg>
  );
}

/* ── Component ────────────────────────────────────────────────────────── */

export default function ProfesionalNotFound() {
  return (
    <div className={styles.notFound}>
      <SearchOffIcon />
      <h2 className={styles.notFoundTitle}>Profesional no encontrado</h2>
      <p className={styles.notFoundText}>
        No pudimos encontrar el profesional que buscás. Puede que haya sido
        removido del directorio o que el enlace sea incorrecto.
      </p>
      <Button href="/profesionales" variant="primary" size="lg">
        Ver todos los profesionales
      </Button>
    </div>
  );
}

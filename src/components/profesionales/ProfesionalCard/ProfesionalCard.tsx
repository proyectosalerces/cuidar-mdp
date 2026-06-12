/**
 * ProfesionalCard — Card component for the profesionales directory grid.
 *
 * Displays a summary of a healthcare professional with avatar initials,
 * specialty badge, rating, description, location, phone and obras sociales.
 */

import Link from 'next/link';
import { cn } from '@/utils/classnames';
import { Badge, Rating } from '@/components/ui';
import { ESPECIALIDAD_LABELS } from '@/utils/constants';
import { formatTelefono } from '@/utils/formatters';
import type { Profesional } from '@/types/profesional';
import styles from './ProfesionalCard.module.css';

/* ── Helpers ──────────────────────────────────────────────────────────── */

function getInitials(name: string): string {
  const cleaned = name.replace(/^(Dra?\.?|Lic\.?)\s*/i, '').trim();
  const parts = cleaned.split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const last = parts.length > 1 ? parts[parts.length - 1]![0] : '';
  return (first + last).toUpperCase();
}

/* ── Inline SVG Icons ─────────────────────────────────────────────────── */

function MapPinIcon() {
  return (
    <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className={styles.metaIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </svg>
  );
}

/* ── Props ─────────────────────────────────────────────────────────────── */

interface ProfesionalCardProps {
  profesional: Profesional;
  className?: string;
}

/* ── Component ────────────────────────────────────────────────────────── */

const MAX_OBRAS_SHOWN = 3;

export default function ProfesionalCard({
  profesional,
  className,
}: ProfesionalCardProps) {
  const obras = profesional.obrasSociales ?? [];
  const visibleObras = obras.slice(0, MAX_OBRAS_SHOWN);
  const overflow = obras.length - MAX_OBRAS_SHOWN;

  return (
    <Link
      href={`/profesionales/${profesional.slug}`}
      className={cn(styles.card, className)}
    >
      {/* Header: avatar + info */}
      <div className={styles.header}>
        <div className={styles.avatar}>
          <span className={styles.initials}>
            {getInitials(profesional.nombre)}
          </span>
        </div>

        <div className={styles.headerInfo}>
          <h3 className={styles.name}>{profesional.nombre}</h3>
          <div className={styles.specialtyRow}>
            <Badge variant="primary">
              {ESPECIALIDAD_LABELS[profesional.especialidad]}
            </Badge>
          </div>
          <Rating
            value={profesional.calificacion}
            count={profesional.cantidadResenas}
            size="sm"
          />
        </div>
      </div>

      {/* Description */}
      <p className={styles.description}>{profesional.descripcion}</p>

      {/* Meta: location + phone */}
      <div className={styles.meta}>
        <span className={styles.metaItem}>
          <MapPinIcon />
          {profesional.barrio}
        </span>
        {profesional.mostrarTelefono !== false && (
          <span className={styles.metaItem}>
            <PhoneIcon />
            {formatTelefono(profesional.telefono)}
          </span>
        )}
      </div>

      {/* Obras sociales */}
      {obras.length > 0 && (
        <div className={styles.obrasSociales}>
          {visibleObras.map((os) => (
            <Badge key={os} variant="outline">
              {os}
            </Badge>
          ))}
          {overflow > 0 && (
            <Badge variant="outline">+{overflow}</Badge>
          )}
        </div>
      )}
    </Link>
  );
}

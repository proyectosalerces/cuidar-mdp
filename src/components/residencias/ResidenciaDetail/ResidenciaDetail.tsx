'use client';

/**
 * ResidenciaDetail — Full detail view for a single residencia.
 *
 * Renders breadcrumbs, hero, two-column layout with description/services on the left
 * and a sticky contact/price sidebar on the right.
 */

import { useState } from 'react';
import Link from 'next/link';
import type { Residencia } from '@/types/residencia';
import { Button, Badge, Rating } from '@/components/ui';
import { TIPOS_CUIDADO_LABELS, WHATSAPP_NUMBER } from '@/utils/constants';
import {
  formatPrecio,
  formatCalificacion,
  formatRangoPrecios,
  formatTelefono,
  buildWhatsAppLink,
} from '@/utils/formatters';
import ResenaSection from '@/components/resenas/ResenaSection/ResenaSection';
import AuthModal from '@/components/auth/AuthModal/AuthModal';
import styles from './ResidenciaDetail.module.css';

interface ResidenciaDetailProps {
  residencia: Residencia;
}

export default function ResidenciaDetail({ residencia }: ResidenciaDetailProps) {
  const [showAuthModal, setShowAuthModal] = useState(false);

  const whatsappPhone = residencia.whatsapp ?? WHATSAPP_NUMBER;
  const whatsappMessage = `Hola, quisiera consultar disponibilidad en ${residencia.nombre}. ¿Podrían darme más información?`;
  const whatsappLink = buildWhatsAppLink(whatsappPhone, whatsappMessage);

  return (
    <>
      <div className={styles.pageContainer}>
        {/* ── Breadcrumbs ───────────────────────────────────────────────── */}
        <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/" className={styles.breadcrumbLink}>Inicio</Link>
        <span className={styles.breadcrumbSeparator} aria-hidden="true">›</span>
        <Link href="/residencias" className={styles.breadcrumbLink}>Residencias</Link>
        <span className={styles.breadcrumbSeparator} aria-hidden="true">›</span>
        <span className={styles.breadcrumbCurrent}>{residencia.nombre}</span>
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className={styles.hero}>
        <div className={styles.heroOverlay} />
        <svg className={styles.heroPlaceholderIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M3 21V7a2 2 0 012-2h14a2 2 0 012 2v14M3 21h18M3 21l6-6m0 0l3 3 4-4 5 5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className={styles.heroContent}>
          <div className={styles.heroBadges}>
            {residencia.verificada && (
              <Badge variant="success">✓ Verificada</Badge>
            )}
            {residencia.habilitada && (
              <Badge variant="primary">Habilitada</Badge>
            )}
            {residencia.destacada && (
              <Badge variant="secondary">★ Destacada</Badge>
            )}
          </div>
          <h1 className={styles.heroTitle}>{residencia.nombre}</h1>
          <div className={styles.heroMeta}>
            <span className={styles.heroLocation}>
              <svg className={styles.heroLocationIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {residencia.direccion} — {residencia.barrio}, {residencia.ciudad}
            </span>
            <div className={styles.heroRating}>
              <span className={styles.heroRatingValue}>
                {formatCalificacion(residencia.calificacion)}
              </span>
              <Rating value={residencia.calificacion} showCount={false} size="md" />
              <span className={styles.heroRatingCount}>
                ({residencia.cantidadResenas} reseñas)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Two-column layout ─────────────────────────────────────────── */}
      <div className={styles.content}>
        {/* Left column */}
        <div className={styles.mainColumn}>
          {/* Description */}
          <section className={styles.detailSection}>
            <h2 className={styles.sectionTitle}>
              <svg className={styles.sectionTitleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="14 2 14 8 20 8" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="16" y1="13" x2="8" y2="13" strokeLinecap="round" />
                <line x1="16" y1="17" x2="8" y2="17" strokeLinecap="round" />
              </svg>
              Acerca de {residencia.nombre}
            </h2>
            <p className={styles.description}>{residencia.descripcion}</p>
          </section>

          {/* Services */}
          <section className={styles.detailSection}>
            <h2 className={styles.sectionTitle}>
              <svg className={styles.sectionTitleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14" strokeLinecap="round" strokeLinejoin="round" />
                <polyline points="22 4 12 14.01 9 11.01" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Servicios
            </h2>
            <div className={styles.servicesGrid}>
              {residencia.servicios.map((servicio) => (
                <span key={servicio} className={styles.servicePill}>
                  <svg className={styles.servicePillIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {servicio}
                </span>
              ))}
            </div>
          </section>

          {/* Care types */}
          <section className={styles.detailSection}>
            <h2 className={styles.sectionTitle}>
              <svg className={styles.sectionTitleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Tipos de cuidado
            </h2>
            <div className={styles.careTypesGrid}>
              {residencia.tiposCuidado.map((tipo) => (
                <span key={tipo} className={styles.careTypeBadge}>
                  {TIPOS_CUIDADO_LABELS[tipo]}
                </span>
              ))}
            </div>
          </section>

          {/* Extra info */}
          {(residencia.horarioVisitas || residencia.capacidad || residencia.anioFundacion) && (
            <section className={styles.detailSection}>
              <h2 className={styles.sectionTitle}>
                <svg className={styles.sectionTitleIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Información adicional
              </h2>
              <div className={styles.infoGrid}>
                {residencia.horarioVisitas && (
                  <div className={styles.infoCard}>
                    <span className={styles.infoCardLabel}>Horario de visitas</span>
                    <span className={styles.infoCardValue}>{residencia.horarioVisitas}</span>
                  </div>
                )}
                {residencia.capacidad && (
                  <div className={styles.infoCard}>
                    <span className={styles.infoCardLabel}>Capacidad</span>
                    <span className={styles.infoCardValue}>{residencia.capacidad} residentes</span>
                  </div>
                )}
                {residencia.anioFundacion && (
                  <div className={styles.infoCard}>
                    <span className={styles.infoCardLabel}>Año de fundación</span>
                    <span className={styles.infoCardValue}>{residencia.anioFundacion}</span>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Reviews */}
          <ResenaSection
            entidadId={residencia.id}
            entidadTipo="residencia"
            entidadNombre={residencia.nombre}
            onRequestAuth={() => setShowAuthModal(true)}
          />
        </div>

        {/* ── Right column — sticky sidebar ──────────────────────────── */}
        <aside className={styles.contactSidebar}>
          {/* Price card */}
          <div className={styles.priceCard}>
            <p className={styles.priceLabel}>Precio mensual</p>
            <p className={styles.priceValue}>
              {residencia.precioDesde
                ? `Desde ${formatPrecio(residencia.precioDesde)}`
                : 'Consultar'}
            </p>
            {residencia.precioDesde && residencia.precioHasta && (
              <p className={styles.priceRange}>
                {formatRangoPrecios(residencia.precioDesde, residencia.precioHasta)}
              </p>
            )}

            <div className={styles.ctaGroup}>
              <Button variant="primary" fullWidth>
                Consultar disponibilidad
              </Button>
              <span className={styles.ctaDivider}>o</span>
              <Button variant="whatsapp" fullWidth href={whatsappLink}>
                Hablar por WhatsApp
              </Button>
            </div>
          </div>

          {/* Contact info */}
          <div className={styles.contactInfo}>
            {/* Phone */}
            <div className={styles.contactItem}>
              <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <a href={`tel:${residencia.telefono}`} className={styles.contactLink}>
                {formatTelefono(residencia.telefono)}
              </a>
            </div>

            {/* Email */}
            {residencia.email && (
              <div className={styles.contactItem}>
                <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeLinecap="round" strokeLinejoin="round" />
                  <polyline points="22,6 12,13 2,6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <a href={`mailto:${residencia.email}`} className={styles.contactLink}>
                  {residencia.email}
                </a>
              </div>
            )}

            {/* Website */}
            {residencia.website && (
              <div className={styles.contactItem}>
                <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="2" y1="12" x2="22" y2="12" />
                  <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
                </svg>
                <a
                  href={residencia.website}
                  className={styles.contactLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {residencia.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}

            {/* Address */}
            <div className={styles.contactItem}>
              <svg className={styles.contactIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              <span>{residencia.direccion}, {residencia.barrio}</span>
            </div>
          </div>

          {/* Map placeholder */}
          {residencia.coordenadas && (
            <div className={styles.mapPlaceholder}>
              <svg className={styles.mapIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" strokeLinecap="round" strokeLinejoin="round" />
                <line x1="8" y1="2" x2="8" y2="18" strokeLinecap="round" />
                <line x1="16" y1="6" x2="16" y2="22" strokeLinecap="round" />
              </svg>
              <span className={styles.mapText}>
                {residencia.coordenadas.lat.toFixed(4)}, {residencia.coordenadas.lng.toFixed(4)}
              </span>
              <span className={styles.mapText}>Mapa próximamente</span>
            </div>
          )}
        </aside>
      </div>
    </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />
    </>
  );
}

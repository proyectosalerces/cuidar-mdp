import type { Metadata } from 'next';
import ContactoPage from '@/components/contacto/ContactoPage';

export const metadata: Metadata = {
  title: 'Contacto',
  description:
    'Contactá a Cuidar MdP para consultas sobre residencias geriátricas, profesionales de salud y servicios de cuidado en Mar del Plata. Teléfono, WhatsApp y formulario de contacto.',
  alternates: {
    canonical: '/contacto',
  },
  openGraph: {
    title: 'Contacto — Cuidar MdP',
    description:
      'Escribinos o llamanos. Te ayudamos a encontrar la mejor opción de cuidado geriátrico en Mar del Plata.',
  },
};

export default function ContactoRoute() {
  return <ContactoPage />;
}

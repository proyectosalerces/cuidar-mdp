import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import Header from "@/components/layout/Header/Header";
import Footer from "@/components/layout/Footer/Footer";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { AuthProvider } from "@/contexts/AuthContext";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import JsonLd from "@/components/seo/JsonLd";
import { generateLocalBusinessJsonLd } from "@/utils/seo";
import "./globals.css";

/* ── Fonts ─────────────────────────────────────────────────────────────── */

const outfit = Outfit({
  variable: "--font-family-heading",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-family-body",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

/* ── Viewport ─────────────────────────────────────────────────────────── */

export const viewport: Viewport = {
  themeColor: "#1B6B5A",
  width: "device-width",
  initialScale: 1,
};

/* ── Metadata ──────────────────────────────────────────────────────────── */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Cuidar MdP — Consultora Geriátrica en Mar del Plata",
    template: "Cuidar MdP - %s",
  },
  description:
    "Consultora de recomendación geriátrica en Mar del Plata. El cuidado que merecen, cerca de casa. Encontrá residencias, cuidadores y servicios para adultos mayores.",
  keywords: [
    "geriátrico",
    "Mar del Plata",
    "residencia adultos mayores",
    "cuidadores",
    "consultora geriátrica",
  ],
  openGraph: {
    type: "website",
    locale: "es_AR",
    siteName: "Cuidar MdP",
    title: "Cuidar MdP — Consultora Geriátrica en Mar del Plata",
    description:
      "El cuidado que merecen, cerca de casa. Encontrá residencias, cuidadores y servicios para adultos mayores en Mar del Plata.",
    url: siteUrl,
    images: [
      {
        url: '/images/og-default.png',
        width: 1200,
        height: 630,
        alt: 'Cuidar MdP — Consultora Geriátrica en Mar del Plata',
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Cuidar MdP — Consultora Geriátrica",
    description:
      "El cuidado que merecen, cerca de casa. Consultora geriátrica en Mar del Plata.",
    images: ['/images/og-default.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Cuidar MdP",
  },
  applicationName: "Cuidar MdP",
};

/* ── WhatsApp FAB ──────────────────────────────────────────────────────── */

const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

function WhatsAppFab() {
  if (!whatsappNumber) return null;

  return (
    <a
      href={`https://wa.me/${whatsappNumber}?text=Hola%2C%20quisiera%20más%20información%20sobre%20sus%20servicios`}
      className="whatsapp-fab"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contactar por WhatsApp"
    >
      <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    </a>
  );
}

/* ── Root Layout ───────────────────────────────────────────────────────── */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es-AR" className={`${outfit.variable} ${inter.variable}`} suppressHydrationWarning data-scroll-behavior="smooth">
      <head>
        {/* FOUC prevention: apply theme before React hydrates */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('cuidar-mdp-theme');if(t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme:dark)').matches)){document.documentElement.setAttribute('data-theme','dark')}}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        {/* JSON-LD Structured Data: LocalBusiness */}
        <JsonLd id="jsonld-local-business" data={generateLocalBusinessJsonLd()} />
        {/* Google Analytics 4 */}
        <GoogleAnalytics />

        <ThemeProvider>
          <AuthProvider>
            {/* Accessibility: skip navigation link */}
            <a href="#contenido-principal" className="skip-link">
              Ir al contenido principal
            </a>

            {/* Site Header */}
            <Header />

            {/* Main content area */}
            <main id="contenido-principal">{children}</main>

            {/* Site Footer */}
            <Footer />
          </AuthProvider>
        </ThemeProvider>

        {/* Floating WhatsApp button */}
        <WhatsAppFab />
      </body>
    </html>
  );
}

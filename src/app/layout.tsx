import type { Metadata, Viewport } from "next";
import { Outfit, Inter } from "next/font/google";
import SiteChrome from "@/components/layout/SiteChrome";
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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.cuidarmdp.com";

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
  },
  twitter: {
    card: "summary_large_image",
    title: "Cuidar MdP — Consultora Geriátrica",
    description:
      "El cuidado que merecen, cerca de casa. Consultora geriátrica en Mar del Plata.",
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
            {/* Public header/footer everywhere except /admin (own layout) */}
            <SiteChrome>{children}</SiteChrome>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

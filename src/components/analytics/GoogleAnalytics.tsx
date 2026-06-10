'use client';

/**
 * Google Analytics 4 integration component.
 *
 * Loads gtag.js and tracks page views on route changes.
 * Renders nothing when NEXT_PUBLIC_GA_MEASUREMENT_ID is not set.
 */

import { useEffect } from 'react';
import Script from 'next/script';
import { usePathname } from 'next/navigation';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

export default function GoogleAnalytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (!GA_MEASUREMENT_ID || typeof window === 'undefined') return;

    // Track page view on route change
    window.gtag?.('config', GA_MEASUREMENT_ID, {
      page_path: pathname,
    });
  }, [pathname]);

  // Don't render anything if no measurement ID is configured
  if (!GA_MEASUREMENT_ID) return null;

  return (
    <>
      {/* Global site tag (gtag.js) - Google Analytics */}
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('consent', 'default', {
            analytics_storage: 'granted',
          });
          gtag('config', '${GA_MEASUREMENT_ID}', {
            page_path: window.location.pathname,
          });
        `}
      </Script>
    </>
  );
}

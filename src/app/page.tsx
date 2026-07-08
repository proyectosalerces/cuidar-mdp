/**
 * Home page — Composes all landing-page sections in order.
 *
 * This is a server component. Each section handles its own
 * data fetching and rendering.
 */

import type { Metadata } from 'next';
import HeroSection from '@/components/home/HeroSection/HeroSection';
import HowItWorks from '@/components/home/HowItWorks/HowItWorks';
import FeaturedResidencias from '@/components/home/FeaturedResidencias/FeaturedResidencias';
import BlogPreview from '@/components/home/BlogPreview/BlogPreview';
import CTASection from '@/components/home/CTASection/CTASection';

export const metadata: Metadata = {
  alternates: { canonical: '/' },
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <FeaturedResidencias />
      <BlogPreview />
      <CTASection />
    </>
  );
}

/**
 * Home page — Composes all landing-page sections in order.
 *
 * This is a server component. Each section handles its own
 * data fetching (currently from mock data) and rendering.
 */

import HeroSection from '@/components/home/HeroSection/HeroSection';
import HowItWorks from '@/components/home/HowItWorks/HowItWorks';
import FeaturedResidencias from '@/components/home/FeaturedResidencias/FeaturedResidencias';
import TestimonialsSection from '@/components/home/TestimonialsSection/TestimonialsSection';
import BlogPreview from '@/components/home/BlogPreview/BlogPreview';
import CTASection from '@/components/home/CTASection/CTASection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <FeaturedResidencias />
      <TestimonialsSection />
      <BlogPreview />
      <CTASection />
    </>
  );
}

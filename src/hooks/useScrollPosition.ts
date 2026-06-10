'use client';

/**
 * Custom hook for tracking the current scroll position
 *
 * Returns the current vertical scroll offset. Useful for implementing
 * sticky headers, scroll-based animations, and "back to top" buttons.
 *
 * Uses passive event listener for performance.
 *
 * @example
 * const scrollY = useScrollPosition();
 * const isScrolled = scrollY > 80; // Header becomes sticky after 80px
 */

import { useState, useEffect } from 'react';

export function useScrollPosition(): number {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Set initial value
    handleScroll();

    // Passive listener for better scroll performance
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return scrollY;
}

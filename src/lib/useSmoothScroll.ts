import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap, ScrollTrigger, usePrefersReducedMotion } from './motion';

/** Module-level handle so anchor navigation can drive the same scroller. */
let instance: Lenis | null = null;

/**
 * Smooth scroll, driven by Lenis and ticked by GSAP so ScrollTrigger reads a
 * single source of truth for scroll position.
 *
 * Disabled entirely under `prefers-reduced-motion` — hijacked scrolling is one
 * of the things that setting exists to switch off.
 */
export function useSmoothScroll() {
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (reduced) return;

    const lenis = new Lenis({
      duration: 1.1,
      // Fast to start, long to settle. Reads as mass rather than as easing.
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.6,
    });
    instance = lenis;

    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      instance = null;
    };
  }, [reduced]);
}

/** Locks the page while the mobile menu is open, on either scroller. */
export function setScrollLocked(locked: boolean) {
  if (instance) {
    if (locked) instance.stop();
    else instance.start();
  }
  document.documentElement.style.overflow = locked ? 'hidden' : '';
}

/**
 * Anchor navigation that works with or without Lenis, and respects
 * reduced-motion by falling back to an instant native jump.
 */
export function scrollToId(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return;

  if (instance) {
    instance.scrollTo(el as HTMLElement, { offset: 0, duration: 1.4 });
    return;
  }
  el.scrollIntoView({ behavior: 'auto', block: 'start' });
}

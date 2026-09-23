import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Motion language: weight, movement, precision, control.
 * Everything animates on `transform`, `opacity` or `clip-path` only.
 */
gsap.defaults({ ease: 'power3.out', duration: 1 });

export { gsap, ScrollTrigger };

// Dev-only handle so animation state can be inspected from the console.
if (import.meta.env.DEV) {
  (window as unknown as Record<string, unknown>).gsap = gsap;
  (window as unknown as Record<string, unknown>).ScrollTrigger = ScrollTrigger;
}

/** Shared easing curves so every section moves with the same physics. */
export const ease = {
  /** Settling, expensive — the default for reveals. */
  weight: 'expo.out',
  /** Loaded, deliberate — for movement with mass behind it. */
  load: 'power2.inOut',
  /** Quick, mechanical — for hover and UI state. */
  snap: 'power3.out',
} as const;

const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * Scopes a GSAP context to a ref and reverts it on unmount, so React strict
 * mode double-invocation cannot leave orphaned ScrollTriggers behind.
 */
export function useGsap(
  setup: (ctx: { self: HTMLElement }) => void,
  deps: readonly unknown[] = [],
) {
  const scope = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const self = scope.current;
    if (!self) return;
    const ctx = gsap.context(() => setup({ self }), self);
    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return scope;
}

/** Live `prefers-reduced-motion` state. Motion is opt-out, never assumed. */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return true;
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

/** Generic media-query hook — used to gate desktop-only interactions. */
export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(() => {
    if (typeof window === 'undefined') return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    setMatches(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

/** True on pointer-precise, wide viewports — where hover effects are worth running. */
export function useIsDesktop() {
  return useMediaQuery('(min-width: 1024px) and (hover: hover) and (pointer: fine)');
}

/**
 * Magnetic button behaviour. The element leans toward the cursor and releases
 * on exit. Desktop-only and reduced-motion aware; returns handlers to spread.
 */
export function useMagnetic<T extends HTMLElement>(strength = 0.28) {
  const ref = useRef<T>(null);
  // Both hooks run on every render: `a() && b()` would skip b() while a() is
  // false, and React crashes (error #310) when the hook count changes.
  const isDesktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();
  const enabled = isDesktop && !reduced;

  const onMove = useCallback(
    (event: React.MouseEvent<T>) => {
      const el = ref.current;
      if (!el || !enabled) return;
      const rect = el.getBoundingClientRect();
      const x = event.clientX - (rect.left + rect.width / 2);
      const y = event.clientY - (rect.top + rect.height / 2);
      gsap.to(el, {
        x: x * strength,
        y: y * strength * 0.6,
        duration: 0.6,
        ease: ease.snap,
      });
    },
    [enabled, strength],
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el || !enabled) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)' });
  }, [enabled]);

  return enabled
    ? { ref, onMouseMove: onMove, onMouseLeave: onLeave }
    : { ref, onMouseMove: undefined, onMouseLeave: undefined };
}

/* --------------------------------------------------------------------------
   REVEALS
   The stylesheet hides `[data-anim]` elements before JS runs. GSAP cannot
   infer those start values reliably (a CSS `translate3d(0,105%,0)` is parsed
   as pixels, so tweening `yPercent` to 0 leaves the pixel offset in place), so
   every reveal is an explicit `fromTo` whose start matches the stylesheet.
   -------------------------------------------------------------------------- */

export type RevealKind = 'rise' | 'fade' | 'fade-up' | 'draw-x' | 'draw-y' | 'clip';

const FROM: Record<RevealKind, gsap.TweenVars> = {
  rise: { yPercent: 105, y: 0 },
  fade: { opacity: 0 },
  'fade-up': { opacity: 0, y: 28 },
  'draw-x': { scaleX: 0 },
  'draw-y': { scaleY: 0 },
  clip: { clipPath: 'inset(0 0 100% 0)' },
};

const TO: Record<RevealKind, gsap.TweenVars> = {
  rise: { yPercent: 0, y: 0, duration: 1.1, ease: ease.weight },
  fade: { opacity: 1, duration: 0.9 },
  'fade-up': { opacity: 1, y: 0, duration: 0.9, ease: ease.weight },
  'draw-x': { scaleX: 1, duration: 1, ease: ease.load },
  'draw-y': { scaleY: 1, duration: 1, ease: ease.load },
  clip: { clipPath: 'inset(0 0 0% 0)', duration: 1.2, ease: ease.weight },
};

/** Read at call time so a mid-session change of the setting is respected. */
function reducedMotion() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Adds a reveal to a timeline. `targets` is resolved inside the GSAP context.
 *
 * Under `prefers-reduced-motion` every kind collapses to a plain opacity fade:
 * the content still arrives, but nothing travels, scales or unclips.
 */
export function reveal(
  tl: gsap.core.Timeline,
  targets: gsap.TweenTarget,
  kind: RevealKind,
  vars: gsap.TweenVars = {},
  position?: gsap.Position,
) {
  if (reducedMotion()) {
    return tl.fromTo(
      targets,
      { opacity: 0 },
      { opacity: 1, duration: 0.4, stagger: vars.stagger ?? 0, ease: 'none' },
      position,
    );
  }
  return tl.fromTo(targets, FROM[kind], { ...TO[kind], ...vars }, position);
}

/** Convenience: the default scroll trigger every section reveals against. */
export function onEnter(trigger: gsap.DOMTarget, start = 'top 78%'): ScrollTrigger.Vars {
  return { trigger, start, once: true };
}

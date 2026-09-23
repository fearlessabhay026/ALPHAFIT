import type { ImageSlot } from '../../data/site';
import { gsap, onEnter, reveal, useGsap, usePrefersReducedMotion } from '../../lib/motion';
import { ImagePlate } from './ImagePlate';

/**
 * Transition devices. Each one makes the seam between two sections a
 * deliberate moment instead of an empty black gap.
 */

/**
 * Section marker — sits on a section's top edge: the running index and name,
 * a rule that draws across, and a giant outline numeral cropped by the edge,
 * drifting slowly against the scroll. Decorative; hidden from assistive tech.
 * The host section must be `relative overflow-clip`.
 */
export function SectionMarker({ index, name }: { index: string; name: string }) {
  const reduced = usePrefersReducedMotion();

  const scope = useGsap(
    ({ self }) => {
      const tl = gsap.timeline({ scrollTrigger: onEnter(self, 'top 88%') });
      reveal(tl, '[data-marker-rule]', 'draw-x', { duration: 1.4 }, 0);
      reveal(tl, '[data-marker-text]', 'fade', { stagger: 0.1 }, 0.2);
      if (reduced) return;
      gsap.fromTo(
        '[data-marker-number]',
        { xPercent: 6 },
        {
          xPercent: -6,
          ease: 'none',
          scrollTrigger: { trigger: self, start: 'top bottom', end: 'bottom+=600 top', scrub: 1 },
        },
      );
    },
    [reduced],
  );

  return (
    <div
      ref={scope as React.Ref<HTMLDivElement>}
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-0 z-[1]"
    >
      <span
        data-marker-number
        className="display-type absolute top-[-0.42em] right-[-1vw] text-[30vw] leading-[0.82] text-transparent select-none"
        style={{ WebkitTextStroke: '1px rgba(237,233,227,0.06)' }}
      >
        {index}
      </span>
      <div className="gutter relative mx-auto flex max-w-[120rem] items-center gap-4 pt-7 md:pt-9">
        <span data-marker-text className="label-type text-red">
          {index}
        </span>
        <span className="relative block h-px flex-1 overflow-hidden">
          <span data-marker-rule className="absolute inset-0 block origin-left bg-iron" />
          <span className="absolute inset-y-0 left-0 block w-10 origin-left bg-red" data-marker-rule />
        </span>
        <span data-marker-text className="label-type text-smoke">
          {name}
        </span>
      </div>
    </div>
  );
}

/**
 * Type band — two rows of oversized words travelling in opposite directions as
 * the page scrolls, one solid and one outlined. Static under reduced motion.
 */
export function TypeBand({ words, label }: { words: readonly string[]; label: string }) {
  const reduced = usePrefersReducedMotion();

  const scope = useGsap(
    ({ self }) => {
      if (reduced) return;
      const st = { trigger: self, start: 'top bottom', end: 'bottom top', scrub: 0.8 };
      gsap.fromTo('[data-band-row="0"]', { xPercent: 0 }, { xPercent: -22, ease: 'none', scrollTrigger: st });
      gsap.fromTo('[data-band-row="1"]', { xPercent: -26 }, { xPercent: -4, ease: 'none', scrollTrigger: { ...st } });
    },
    [reduced],
  );

  const run = [...words, ...words, ...words];

  return (
    <div
      ref={scope as React.Ref<HTMLDivElement>}
      role="presentation"
      className="relative overflow-clip border-y border-iron/60 bg-void py-8 md:py-12"
    >
      <p className="sr-only">{label}</p>
      {[0, 1].map((row) => (
        <div
          key={row}
          aria-hidden
          data-band-row={row}
          className="flex w-max items-center gap-[4vw] whitespace-nowrap will-change-transform"
        >
          {run.map((word, i) => (
            <span key={`${row}-${i}`} className="flex items-center gap-[4vw]">
              <span
                className={`display-type text-[clamp(3rem,9vw,8.5rem)] ${row === 1 ? 'text-transparent' : 'text-bone'}`}
                style={row === 1 ? { WebkitTextStroke: '1px rgba(237,233,227,0.28)' } : undefined}
              >
                {word}
              </span>
              <span className="block h-[0.9vw] min-h-2 w-[0.9vw] min-w-2 rotate-45 bg-red" />
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/**
 * Image slit — a thin, full-bleed crop of a photograph that slides against the
 * scroll. A breath of image between two dark sections.
 */
export function ImageSlit({ slot, caption }: { slot: ImageSlot; caption: string }) {
  const reduced = usePrefersReducedMotion();

  const scope = useGsap(
    ({ self }) => {
      if (reduced) return;
      gsap.fromTo(
        '[data-slit-image]',
        { yPercent: -14 },
        {
          yPercent: 14,
          ease: 'none',
          scrollTrigger: { trigger: self, start: 'top bottom', end: 'bottom top', scrub: 1 },
        },
      );
    },
    [reduced],
  );

  return (
    <div
      ref={scope as React.Ref<HTMLDivElement>}
      className="relative h-[34svh] min-h-[14rem] overflow-clip bg-void md:h-[42svh]"
    >
      <div data-slit-image className="absolute inset-x-0 -inset-y-[18%] will-change-transform">
        <ImagePlate slot={slot} sizes="100vw" className="brightness-[0.85]" />
      </div>
      <span
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to bottom, rgba(3,3,4,1) 0%, transparent 35%, transparent 65%, rgba(10,10,12,1) 100%)',
        }}
      />
      <p className="label-type gutter absolute inset-x-0 bottom-6 mx-auto max-w-[120rem] text-bone/60">
        {caption}
      </p>
    </div>
  );
}

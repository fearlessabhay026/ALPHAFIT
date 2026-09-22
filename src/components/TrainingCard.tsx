import { useRef } from 'react';
import type { trainingPrograms } from '../data/site';
import { ease, gsap, useIsDesktop, usePrefersReducedMotion } from '../lib/motion';
import { scrollToId } from '../lib/useSmoothScroll';
import { ImagePlate } from './ui/ImagePlate';

type Program = (typeof trainingPrograms)[number];

/**
 * An editorial image card, not a UI card: full-bleed photograph, a number, a
 * title and a rule. On desktop the active card becomes dominant and its
 * neighbours give way — the interaction is handled by the parent, which owns
 * the sibling compression; this component owns everything inside its own frame.
 */
export function TrainingCard({
  program,
  onActivate,
}: {
  program: Program;
  onActivate: (active: boolean) => void;
}) {
  const root = useRef<HTMLAnchorElement>(null);
  const isDesktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();
  const interactive = isDesktop && !reduced;

  const setActive = (active: boolean) => {
    onActivate(active);
    const el = root.current;
    if (!el || !interactive) return;

    const q = gsap.utils.selector(el);
    gsap.to(q('[data-card-image]'), {
      scale: active ? 1.08 : 1,
      yPercent: active ? -1.5 : 0,
      duration: 0.9,
      ease: ease.weight,
    });
    gsap.to(q('[data-card-body]'), { y: active ? -14 : 0, duration: 0.7, ease: ease.weight });
    gsap.to(q('[data-card-scrim]'), { opacity: active ? 0.4 : 0.78, duration: 0.7 });
  };

  /** Subtle cursor-following lean inside the frame. Desktop only. */
  const onMove = (event: React.MouseEvent<HTMLAnchorElement>) => {
    const el = root.current;
    if (!el || !interactive) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) / rect.width;
    const y = (event.clientY - (rect.top + rect.height / 2)) / rect.height;
    gsap.to(el.querySelector('[data-card-image]'), {
      x: x * 18,
      y: y * 18,
      duration: 1,
      ease: 'power3.out',
    });
  };

  return (
    <a
      ref={root}
      href={program.href}
      onClick={(event) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey) return;
        event.preventDefault();
        scrollToId(program.href);
      }}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => {
        setActive(false);
        if (interactive) {
          gsap.to(root.current?.querySelector('[data-card-image]') ?? [], {
            x: 0,
            y: 0,
            duration: 0.9,
            ease: ease.weight,
          });
        }
      }}
      onMouseMove={onMove}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      data-training-card
      className="group relative block aspect-[3/4] overflow-hidden border border-iron/70 bg-void transition-colors duration-500 hover:border-red focus-visible:border-red active:border-red md:aspect-[3/4.2]"
      aria-label={`${program.title} — ${program.copy}`}
    >
      <div data-card-image className="absolute inset-[-6%] will-change-transform">
        <ImagePlate slot={program.image} sizes="(max-width: 768px) 100vw, 33vw" vignette={0.55} />
      </div>

      <span
        data-card-scrim
        aria-hidden
        className="absolute inset-0 opacity-[0.78]"
        style={{
          background:
            'linear-gradient(to top, rgba(3,3,4,0.97) 6%, rgba(3,3,4,0.6) 42%, rgba(3,3,4,0.2) 100%)',
        }}
      />

      <span className="label-type absolute top-5 left-5 text-bone md:top-6 md:left-6">
        {program.index}
      </span>

      <div data-card-body className="absolute inset-x-5 bottom-5 md:inset-x-6 md:bottom-6">
        <span
          data-card-rule
          aria-hidden
          className="mb-4 block h-px w-full origin-left bg-red transition-transform duration-700 ease-out lg:scale-x-0 lg:group-hover:scale-x-100 lg:group-focus-visible:scale-x-100"
        />
        <h3 className="display-type text-[clamp(1.5rem,2.6vw,2.15rem)]">{program.title}</h3>
        <p className="body-type mt-3 max-w-[18rem] text-[0.82rem] text-ash">{program.copy}</p>
        <p
          data-card-detail
          className="body-type mt-3 hidden max-w-[18rem] text-[0.82rem] text-smoke opacity-0 transition-opacity duration-500 ease-out lg:block lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100"
        >
          {program.detail}
        </p>

        <span
          aria-hidden
          className="mt-5 flex h-9 w-9 items-center justify-center rounded-full border border-iron text-bone transition-colors duration-400 group-hover:border-red group-hover:bg-red group-focus-visible:border-red group-focus-visible:bg-red"
        >
          {'→'}
        </span>
      </div>
    </a>
  );
}

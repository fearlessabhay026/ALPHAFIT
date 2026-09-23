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
    gsap.to(q('[data-card-scrim]'), { opacity: active ? 0.82 : 1, duration: 0.7 });
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
      className="group relative block aspect-[3/4] overflow-hidden border border-iron/70 bg-void transition-colors duration-500 hover:border-red focus-visible:border-red active:border-red md:aspect-[3/4.6]"
      aria-label={`${program.index} ${program.title} ${program.copy}`}
    >
      <div data-card-image className="absolute inset-[-6%] will-change-transform">
        <ImagePlate slot={program.image} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw" />
      </div>

      <span
        data-card-scrim
        aria-hidden
        className="absolute inset-0"
        style={{
          // Only the lower band darkens, where the text sits. The top ~70% stays photograph.
          background:
            'linear-gradient(to top, rgba(3,3,4,0.96) 0%, rgba(3,3,4,0.78) 16%, rgba(3,3,4,0.3) 30%, transparent 42%), linear-gradient(to bottom, rgba(3,3,4,0.5) 0%, transparent 14%)',
        }}
      />

      <div className="absolute inset-x-5 top-5 flex items-center justify-between md:inset-x-6 md:top-6">
        <span className="label-type text-bone">{program.index}</span>
        <span
          aria-hidden
          className="flex h-9 w-9 items-center justify-center rounded-full border border-bone/25 bg-void/30 text-bone backdrop-blur-sm transition-[background-color,border-color,translate] duration-500 ease-out group-hover:translate-x-1 group-hover:border-red group-hover:bg-red group-focus-visible:border-red group-focus-visible:bg-red group-active:border-red group-active:bg-red"
        >
          {'\u2192'}
        </span>
      </div>

      <div data-card-body className="absolute inset-x-5 bottom-5 md:inset-x-6 md:bottom-6">
        <span
          data-card-rule
          aria-hidden
          className="mb-4 block h-px w-full origin-left bg-red transition-transform duration-700 ease-out lg:scale-x-0 lg:group-hover:scale-x-100 lg:group-focus-visible:scale-x-100"
        />
        <h3 className="display-type text-[clamp(1.5rem,2.4vw,2.15rem)]">{program.title}</h3>
        {/* Copy and hover detail share one grid cell and crossfade, so the text
            block never grows into the photograph. */}
        <div className="mt-3 grid max-w-[18rem] [&>*]:col-start-1 [&>*]:row-start-1">
          <p className="body-type text-[0.82rem] text-ash transition-opacity duration-500 ease-out lg:group-hover:opacity-0 lg:group-focus-visible:opacity-0">
            {program.copy}
          </p>
          <p
            data-card-detail
            aria-hidden
            className="body-type hidden text-[0.82rem] text-bone/85 opacity-0 transition-opacity duration-500 ease-out lg:block lg:group-hover:opacity-100 lg:group-focus-visible:opacity-100"
          >
            {program.detail}
          </p>
        </div>
      </div>
    </a>
  );
}

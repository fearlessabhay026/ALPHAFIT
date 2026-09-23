import { useEffect, useState } from 'react';
import { trainingPrograms, trainingSection, sections } from '../data/site';
import { ease, gsap, onEnter, reveal, useGsap, useIsDesktop, usePrefersReducedMotion } from '../lib/motion';
import { Button } from './ui/Button';
import { SectionMarker } from './ui/Transitions';
import { MaskLine, SectionLabel } from './ui/Reveal';
import { TrainingCard } from './TrainingCard';

/**
 * Training — an asymmetric editorial block: the statement holds the left
 * column, three image cards run across the right. Hovering one makes it
 * dominant and lets the others give way, using transforms only so nothing
 * re-lays-out mid-interaction.
 */
export function Training() {
  const [active, setActive] = useState<number | null>(null);
  const isDesktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();

  const scope = useGsap(({ self }) => {
    const tl = gsap.timeline({ scrollTrigger: onEnter(self, 'top 72%') });

    reveal(tl, '[data-training-label]', 'fade-up', {}, 0);
    reveal(tl, '[data-anim="rise"] > *', 'rise', { duration: 1.15, stagger: 0.09 }, 0.1);
    reveal(tl, '[data-training-copy]', 'fade-up', { stagger: 0.08 }, 0.45);
    reveal(tl, '[data-training-card]', 'clip', { stagger: 0.12, duration: 1.1 }, 0.35);
  }, []);

  // Neighbour compression: transform-only, so no layout is triggered per frame.
  useEffect(() => {
    const root = scope.current;
    if (!root || !isDesktop || reduced) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>('[data-training-card]'));
    cards.forEach((card, index) => {
      const isActive = active === index;
      const isDimmed = active !== null && !isActive;
      gsap.to(card, {
        // Active card grows ~5%; its neighbours give way without leaving the grid.
        scale: isActive ? 1.055 : isDimmed ? 0.96 : 1,
        opacity: isDimmed ? 0.55 : 1,
        zIndex: isActive ? 2 : 1,
        duration: 0.8,
        ease: ease.weight,
      });
    });
  }, [active, isDesktop, reduced, scope]);

  return (
    <section
      id="train"
      ref={scope as React.Ref<HTMLElement>}
      data-training
      aria-labelledby="training-heading"
      className="relative overflow-clip bg-ink pt-28 pb-24 md:pt-32 lg:pt-36 lg:pb-32"
    >
      <SectionMarker {...sections.training} />
      <div className="gutter mx-auto max-w-[120rem]">
        <div className="grid grid-cols-12 gap-x-6 gap-y-14">
          {/* Left column — the statement */}
          <div className="col-span-12 lg:col-span-4 lg:sticky lg:top-32 lg:self-start">
            <div data-training-label>
              <SectionLabel>{trainingSection.label}</SectionLabel>
            </div>

            <h2
              id="training-heading"
              className="display-type mt-8 text-[clamp(3rem,9.5vw,5.5rem)] md:mt-10"
            >
              {trainingSection.lines.map((line) => (
                <MaskLine key={line} as="span" className="block">
                  <span className={line === trainingSection.accentLine ? 'text-red' : undefined}>
                    {line}
                  </span>
                </MaskLine>
              ))}
            </h2>

            <p data-training-copy className="body-type mt-7 max-w-sm text-[0.95rem] text-ash">
              {trainingSection.support}
            </p>
            <div data-training-copy className="mt-9">
              <Button href={trainingSection.cta.href} variant="outline">
                {trainingSection.cta.label}
              </Button>
            </div>
          </div>

          {/* Right column — the cards */}
          <ul className="col-span-12 grid gap-4 sm:grid-cols-2 lg:col-span-8 lg:grid-cols-3 lg:gap-5">
            {trainingPrograms.map((program, index) => (
              <li
                key={program.index}
                className="sm:[&:nth-child(3)]:col-span-2 lg:[&:nth-child(3)]:col-span-1"
              >
                <TrainingCard
                  program={program}
                  onActivate={(on) =>
                    setActive((current) => (on ? index : current === index ? null : current))
                  }
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

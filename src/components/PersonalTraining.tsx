import { coaching } from '../data/site';
import { gsap, onEnter, reveal, useGsap, usePrefersReducedMotion } from '../lib/motion';
import { Button } from './ui/Button';
import { ImagePlate } from './ui/ImagePlate';
import { MaskLine, SectionLabel } from './ui/Reveal';

/**
 * Coaching — a full-bleed photograph on one side, the argument on the other.
 * The image column runs taller than the text column and moves against it, so
 * the two halves never feel like a two-column template.
 */
export function PersonalTraining() {
  const reduced = usePrefersReducedMotion();

  const scope = useGsap(({ self }) => {
    const tl = gsap.timeline({ scrollTrigger: onEnter(self, 'top 72%') });

    reveal(tl, '[data-coaching-label]', 'fade-up', {}, 0);
    reveal(tl, '[data-anim="rise"] > *', 'rise', { duration: 1.15, stagger: 0.1 }, 0.05);
    reveal(tl, '[data-coaching-frame]', 'clip', { duration: 1.3 }, 0.1);
    reveal(tl, '[data-coaching-copy]', 'fade-up', { stagger: 0.08 }, 0.5);
    reveal(tl, '[data-coaching-rule]', 'draw-x', { stagger: 0.08, duration: 0.7 }, 0.6);
    reveal(tl, '[data-coaching-item]', 'fade-up', { stagger: 0.08, duration: 0.7 }, 0.68);

    if (reduced) return;

    gsap.fromTo(
      '[data-coaching-image]',
      { yPercent: -7 },
      {
        yPercent: 7,
        ease: 'none',
        scrollTrigger: { trigger: '[data-coaching-frame]', start: 'top bottom', end: 'bottom top', scrub: 1 },
      },
    );
  }, [reduced]);

  return (
    <section
      id="coaching"
      ref={scope as React.Ref<HTMLElement>}
      data-coaching
      aria-labelledby="coaching-heading"
      className="relative overflow-clip bg-ink py-24 md:py-32 lg:py-44"
    >
      <div className="gutter mx-auto max-w-[120rem]">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12 lg:items-center">
          {/* Image column */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-5">
            <div
              data-coaching-frame
              className="relative aspect-[4/5] overflow-hidden border border-iron/60 lg:aspect-[3/4.2]"
            >
              <div data-coaching-image className="absolute inset-[-8%] will-change-transform">
                <ImagePlate
                  slot={coaching.image}
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  vignette={0.5}
                />
              </div>
              <span
                aria-hidden
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to top, rgba(3,3,4,0.85) 2%, transparent 55%)',
                }}
              />
              <p className="label-type absolute bottom-6 left-6 text-ash">
                1-on-1 / On the floor
              </p>
            </div>
          </div>

          {/* Argument column */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            <div data-coaching-label>
              <SectionLabel>{coaching.label}</SectionLabel>
            </div>

            <h2
              id="coaching-heading"
              className="display-type mt-8 text-[clamp(2.4rem,7vw,4.6rem)] md:mt-10"
            >
              {coaching.lines.map((line) => (
                <MaskLine key={line} as="span" className="block">
                  <span className={line === coaching.accentLine ? 'text-red' : undefined}>
                    {line}
                  </span>
                </MaskLine>
              ))}
            </h2>

            <p data-coaching-copy className="body-type mt-7 max-w-md text-[0.95rem] text-ash">
              {coaching.support}
            </p>

            <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-9">
              {coaching.principles.map((principle) => (
                <li key={principle.index}>
                  <span
                    data-coaching-rule
                    aria-hidden
                    className="mb-4 block h-px w-full origin-left bg-iron"
                  />
                  <div data-coaching-item>
                    <span className="label-type text-red">{principle.index}</span>
                    <h3 className="display-type mt-3 text-[clamp(1.1rem,1.9vw,1.5rem)]">
                      {principle.title}
                    </h3>
                    <p className="body-type mt-2 text-[0.8rem] text-smoke">{principle.note}</p>
                  </div>
                </li>
              ))}
            </ul>

            <div data-coaching-copy className="mt-12">
              <Button href={coaching.cta.href}>{coaching.cta.label}</Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

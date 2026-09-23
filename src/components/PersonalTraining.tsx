import { coaching, sections } from '../data/site';
import { gsap, onEnter, reveal, useGsap, usePrefersReducedMotion } from '../lib/motion';
import { Button } from './ui/Button';
import { ImagePlate } from './ui/ImagePlate';
import { SectionMarker } from './ui/Transitions';
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
      className="relative overflow-clip bg-ink py-20 md:py-28 lg:py-28"
    >
      <SectionMarker {...sections.coaching} />
      <div className="gutter mx-auto max-w-[120rem]">
        <div className="grid grid-cols-12 gap-x-6 gap-y-12 lg:items-center">
          {/* Image column — dominant, bleeding off the left edge of the page */}
          <div className="col-span-12 -mx-5 md:-mx-10 lg:col-span-7 lg:mr-0 min-[90rem]:-ml-14">
            <div
              data-coaching-frame
              className="relative aspect-[4/5] overflow-hidden sm:aspect-[4/3] lg:aspect-auto lg:h-[min(92svh,60rem)]"
            >
              <div data-coaching-image className="absolute inset-[-8%] will-change-transform">
                <ImagePlate
                  slot={coaching.image}
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="contrast-[1.05]"
                />
              </div>
              <span
                aria-hidden
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(3,3,4,0.9) 0%, transparent 38%), linear-gradient(to left, rgba(10,10,12,0.85) 0%, transparent 30%)',
                }}
              />
              <span
                aria-hidden
                className="absolute inset-0 mix-blend-screen"
                style={{ background: 'radial-gradient(45% 55% at 92% 18%, rgba(225,20,20,0.22), transparent 70%)' }}
              />
              <p className="label-type absolute bottom-6 left-5 text-ash md:left-10 min-[90rem]:left-14">
                Fig. 06 / 1-on-1, on the floor
              </p>
            </div>
          </div>

          {/* Argument column */}
          <div className="col-span-12 lg:col-span-5 lg:col-start-8 lg:py-10">
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

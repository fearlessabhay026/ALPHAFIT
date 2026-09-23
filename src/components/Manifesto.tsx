import { manifesto, sections } from '../data/site';
import { gsap, onEnter, reveal, useGsap, usePrefersReducedMotion } from '../lib/motion';
import { ImagePlate } from './ui/ImagePlate';
import { SectionMarker } from './ui/Transitions';
import { MaskLine, SectionLabel } from './ui/Reveal';

/**
 * Manifesto — the belief statement, not an "about us". Typography is the whole
 * idea here: a near-black field, one enormous two-line statement, and four
 * principles divided by rules that draw themselves.
 */
export function Manifesto() {
  const reduced = usePrefersReducedMotion();

  const scope = useGsap(({ self }) => {
    const tl = gsap.timeline({ scrollTrigger: onEnter(self, 'top 70%') });

    reveal(tl, '[data-manifesto-label]', 'fade-up', {}, 0);
    reveal(tl, '[data-anim="rise"] > *', 'rise', { duration: 1.2, stagger: 0.1 }, 0.1);
    reveal(tl, '[data-manifesto-copy]', 'fade-up', { stagger: 0.1 }, 0.5);
    reveal(tl, '[data-manifesto-rule]', 'draw-y', { stagger: 0.07, duration: 0.8 }, 0.6);
    reveal(tl, '[data-manifesto-item]', 'fade-up', { stagger: 0.09, duration: 0.8 }, 0.7);

    if (reduced) {
      gsap.set('[data-manifesto-image]', { opacity: 0.55 });
      return;
    }

    // The red word carries slightly further than the line above it.
    gsap.to('[data-manifesto-accent]', {
      xPercent: 3.5,
      ease: 'none',
      scrollTrigger: { trigger: self, start: 'top bottom', end: 'bottom top', scrub: 1 },
    });

    // The backdrop surfaces slowly as the section is read — never past a
    // texture's worth of opacity, so the type stays the subject.
    gsap.fromTo(
      '[data-manifesto-image]',
      { opacity: 0, scale: 1.16 },
      {
        opacity: 0.55,
        scale: 1,
        ease: 'none',
        scrollTrigger: { trigger: self, start: 'top bottom', end: 'center center', scrub: 1 },
      },
    );
  }, [reduced]);

  return (
    <section
      id="about"
      ref={scope as React.Ref<HTMLElement>}
      data-manifesto
      aria-labelledby="manifesto-heading"
      className="relative overflow-clip bg-void pt-32 pb-24 md:pt-40 md:pb-28 lg:pt-44 lg:pb-32"
    >
      <SectionMarker {...sections.manifesto} />
      {/* Chalk and grip, held back to a texture on the right of the statement */}
      <div
        data-manifesto-image
        aria-hidden
        className="manifesto-photo-mask absolute inset-y-0 right-0 w-full opacity-0 lg:w-[64%]"
      >
        <ImagePlate
          slot={manifesto.image}
          sizes="(min-width: 1024px) 64vw, 100vw"
          className="grayscale-[45%] contrast-[1.15] brightness-[0.8]"
        />
      </div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(3,3,4,0.97) 18%, rgba(3,3,4,0.62) 58%, rgba(3,3,4,0.5) 100%), linear-gradient(0deg, rgba(3,3,4,0.95) 0%, transparent 42%)',
        }}
      />

      <div className="gutter relative mx-auto max-w-[120rem]">
        <div data-manifesto-label>
          <SectionLabel>{manifesto.label}</SectionLabel>
        </div>

        <div className="mt-10 grid grid-cols-12 gap-x-6 gap-y-10 md:mt-14">
          <h2
            id="manifesto-heading"
            className="display-type col-span-12 text-[clamp(2.8rem,17vw,8rem)] lg:col-span-7"
          >
            {manifesto.lines.map((line) => (
              <MaskLine key={line} as="span" className="block">
                <span
                  data-manifesto-accent={line === manifesto.accentLine ? '' : undefined}
                  className={line === manifesto.accentLine ? 'inline-block text-red' : undefined}
                >
                  {line}
                </span>
              </MaskLine>
            ))}
          </h2>

          <div className="col-span-12 flex flex-col justify-between gap-10 lg:col-span-4 lg:col-start-9 lg:pt-6">
            <p data-manifesto-copy className="body-type max-w-md text-[1.05rem] text-bone md:text-[1.15rem]">
              {manifesto.support}
            </p>
            <p data-manifesto-copy className="label-type text-smoke">
              {manifesto.aside}
            </p>
          </div>
        </div>

        {/* Four principles, separated by rules that draw down as they arrive */}
        <ul className="mt-20 grid grid-cols-2 gap-y-12 md:mt-28 md:grid-cols-4">
          {manifesto.pillars.map((pillar, index) => (
            <li key={pillar.index} className="relative pl-5 md:pl-8">
              {index > 0 && (
                <span
                  aria-hidden
                  data-manifesto-rule
                  className="absolute top-0 left-0 block h-full w-px origin-top bg-iron"
                />
              )}
              {index === 0 && (
                <span
                  aria-hidden
                  data-manifesto-rule
                  className="absolute top-0 left-0 block h-full w-px origin-top bg-red"
                />
              )}
              <div data-manifesto-item>
                <span className="label-type text-red">{pillar.index}</span>
                <h3 className="display-type mt-4 text-[clamp(1.4rem,2.6vw,2.1rem)]">{pillar.title}</h3>
                <p className="body-type mt-3 max-w-[15rem] text-[0.82rem] text-ash">{pillar.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

import { contact, finalCta, sections } from '../data/site';
import { gsap, onEnter, reveal, useGsap, usePrefersReducedMotion } from '../lib/motion';
import { Button } from './ui/Button';
import { ImagePlate } from './ui/ImagePlate';
import { SectionMarker } from './ui/Transitions';
import { MaskLine } from './ui/Reveal';

/**
 * The close. Almost entirely black, one enormous question, one action — then
 * the practical details, so the page ends somewhere you can act on.
 *
 * The photograph sits far behind the type: presence, not subject.
 */
export function FinalCTA() {
  const reduced = usePrefersReducedMotion();

  const scope = useGsap(
    ({ self }) => {
      const tl = gsap.timeline({ scrollTrigger: onEnter(self, 'top 72%') });
      reveal(tl, '[data-anim="rise"] > *', 'rise', { duration: 1.25, stagger: 0.11 }, 0);
      reveal(tl, '[data-cta-copy]', 'fade-up', { stagger: 0.1 }, 0.45);
      reveal(tl, '[data-cta-rule]', 'draw-x', {}, 0.6);
      reveal(tl, '[data-cta-contact]', 'fade-up', { stagger: 0.07 }, 0.75);

      if (reduced) return;

      gsap.fromTo(
        '[data-cta-image]',
        { yPercent: -6, scale: 1.1 },
        {
          yPercent: 6,
          scale: 1.1,
          ease: 'none',
          scrollTrigger: { trigger: self, start: 'top bottom', end: 'bottom top', scrub: 1 },
        },
      );
    },
    [reduced],
  );

  return (
    <section
      id="join"
      ref={scope as React.Ref<HTMLElement>}
      aria-labelledby="cta-heading"
      className="relative overflow-clip bg-void pt-28 pb-14 md:pt-40 md:pb-16 lg:pt-48"
    >
      <SectionMarker {...sections.join} />
      <div data-cta-image aria-hidden className="absolute inset-0 opacity-50">
        <ImagePlate slot={finalCta.image} sizes="100vw" className="grayscale-[25%]" />
      </div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(180deg, rgba(3,3,4,0.95) 0%, rgba(3,3,4,0.55) 30%, rgba(3,3,4,0.6) 62%, rgba(3,3,4,0.97) 100%)',
        }}
      />

      <div className="gutter relative mx-auto max-w-[120rem]">
        <div className="grid grid-cols-12 items-end gap-x-6 gap-y-10">
          <h2
            id="cta-heading"
            className="display-type col-span-12 text-[clamp(3.6rem,15vw,11rem)] lg:col-span-8"
          >
            {finalCta.lines.map((line) => (
              <MaskLine key={line} as="span" className="block">
                <span className={line === finalCta.accentLine ? 'text-red' : undefined}>{line}</span>
              </MaskLine>
            ))}
          </h2>

          <p
            data-cta-copy
            className="label-type col-span-12 pb-4 leading-[2] text-ash lg:col-span-3 lg:col-start-10 lg:text-right"
          >
            Discipline today.
            <br />A stronger tomorrow.
          </p>
        </div>

        <div data-cta-copy className="mt-12 md:mt-14">
          <Button href={finalCta.cta.href}>{finalCta.cta.label}</Button>
        </div>

        {/* Contact */}
        <div className="mt-24 md:mt-32">
          <span data-cta-rule aria-hidden className="block h-px w-full origin-left bg-iron" />
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 pt-8 md:grid-cols-4">
            {contact.map((item) => (
              <div key={item.label} data-cta-contact>
                <dt className="label-type text-smoke">{item.label}</dt>
                <dd className="mt-3">
                  {item.href ? (
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="body-type text-[0.95rem] text-bone transition-colors duration-300 hover:text-red"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <span className="body-type text-[0.95rem] text-ash">{item.value}</span>
                  )}
                  {item.placeholder && (
                    <span className="label-type mt-2 block text-red/80">Placeholder</span>
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

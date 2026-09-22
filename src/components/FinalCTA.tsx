import { finalCta } from '../data/site';
import { gsap, onEnter, reveal, useGsap, usePrefersReducedMotion } from '../lib/motion';
import { Button } from './ui/Button';
import { ImagePlate } from './ui/ImagePlate';
import { MaskLine } from './ui/Reveal';

/**
 * The close. Almost entirely black, one enormous question, one action.
 * Nothing else competes.
 */
export function FinalCTA() {
  const reduced = usePrefersReducedMotion();

  const scope = useGsap(({ self }) => {
    const tl = gsap.timeline({ scrollTrigger: onEnter(self, 'top 72%') });
    reveal(tl, '[data-anim="rise"] > *', 'rise', { duration: 1.25, stagger: 0.11 }, 0);
    reveal(tl, '[data-cta-copy]', 'fade-up', { stagger: 0.1 }, 0.45);

    if (reduced) return;

    gsap.fromTo(
      '[data-cta-image]',
      { yPercent: -8, scale: 1.12 },
      {
        yPercent: 8,
        scale: 1.12,
        ease: 'none',
        scrollTrigger: { trigger: self, start: 'top bottom', end: 'bottom top', scrub: 1 },
      },
    );
  }, [reduced]);

  return (
    <section
      id="join"
      ref={scope as React.Ref<HTMLElement>}
      data-cta
      aria-labelledby="cta-heading"
      className="relative overflow-clip bg-void pt-28 pb-24 md:pt-40 md:pb-32 lg:pt-52 lg:pb-40"
    >
      <div data-cta-image aria-hidden className="absolute inset-0 scale-110">
        <ImagePlate slot={finalCta.image} sizes="100vw" vignette={0.85} />
      </div>
      <div
        aria-hidden
        className="absolute inset-0"
        style={{ background: 'linear-gradient(180deg, rgba(3,3,4,0.9) 0%, rgba(3,3,4,0.72) 100%)' }}
      />

      <div className="gutter relative mx-auto max-w-[120rem]">
        <div className="grid grid-cols-12 items-end gap-x-6 gap-y-12">
          <h2 id="cta-heading" className="display-type col-span-12 text-[clamp(3.6rem,15vw,11rem)] lg:col-span-8">
            {finalCta.lines.map((line) => (
              <MaskLine key={line} as="span" className="block">
                <span className={line === finalCta.accentLine ? 'text-red' : undefined}>
                  {line}
                </span>
              </MaskLine>
            ))}
          </h2>

          <p
            data-cta-copy
            className="label-type col-span-12 pb-4 leading-[2] text-ash lg:col-span-3 lg:col-start-10 lg:text-right"
          >
            Discipline today.
            <br />
            A stronger tomorrow.
          </p>
        </div>

        <div data-cta-copy className="mt-12 md:mt-16">
          <Button href={finalCta.cta.href}>{finalCta.cta.label}</Button>
        </div>
      </div>
    </section>
  );
}

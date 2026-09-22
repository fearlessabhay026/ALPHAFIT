import { hero } from '../data/site';
import { ease, gsap, reveal, useGsap, usePrefersReducedMotion } from '../lib/motion';
import { Button } from './ui/Button';
import { ImagePlate } from './ui/ImagePlate';
import { MaskLine } from './ui/Reveal';

/**
 * Hero — full viewport, layered: kinetic word wall behind, image plate in the
 * middle, typography in front. Everything moves at a different rate so the
 * composition has depth without any of it reading as an effect.
 */
export function Hero() {
  const reduced = usePrefersReducedMotion();

  const scope = useGsap(({ self }) => {
    // Entrance. Runs once, on load, before any scrolling happens.
    const intro = gsap.timeline({ defaults: { ease: ease.weight } });

    intro.fromTo(
      '[data-hero-image]',
      { opacity: 0, scale: reduced ? 1 : 1.14 },
      { opacity: 1, scale: 1, duration: reduced ? 0.6 : 2, ease: 'power2.out' },
      0,
    );
    reveal(intro, '[data-anim="rise"] > *', 'rise', { duration: 1.15, stagger: 0.09 }, 0.15);
    reveal(intro, '[data-anim="fade-up"]', 'fade-up', { stagger: 0.07 }, 0.75);
    reveal(intro, '[data-hero-rule]', 'draw-y', {}, 0.6);

    if (reduced) return;

    // Scroll: the image lags, the type leads, the word wall drifts.
    gsap
      .timeline({
        scrollTrigger: {
          trigger: self,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
        },
      })
      .to('[data-hero-image]', { yPercent: 14, scale: 1.12, ease: 'none' }, 0)
      .to('[data-hero-content]', { yPercent: -12, opacity: 0.25, ease: 'none' }, 0)
      .to('[data-hero-hud]', { yPercent: -30, opacity: 0, ease: 'none' }, 0)
      .to('[data-kinetic="0"]', { yPercent: -120, opacity: 0, ease: 'none' }, 0)
      .fromTo('[data-kinetic="1"]', { yPercent: 60, opacity: 0 }, { yPercent: -40, opacity: 1, ease: 'none' }, 0)
      .fromTo('[data-kinetic="2"]', { yPercent: 140, opacity: 0 }, { yPercent: 10, opacity: 1, ease: 'none' }, 0.25);
  }, [reduced]);

  return (
    <section
      id="top"
      ref={scope as React.Ref<HTMLElement>}
      data-hero
      aria-labelledby="hero-heading"
      className="relative min-h-[100svh] overflow-clip bg-void"
    >
      {/* Layer 0 — kinetic word wall */}
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {hero.kinetic.map((word, index) => (
          <span
            key={word}
            data-kinetic={index}
            className="display-type absolute text-[26vw] whitespace-nowrap text-transparent will-change-transform"
            style={{
              WebkitTextStroke: '1px rgba(237,233,227,0.07)',
              opacity: index === 0 ? 1 : 0,
            }}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Layer 1 — the photograph */}
      <div
        data-hero-image
        className="absolute inset-0 origin-center opacity-0 will-change-transform"
      >
        <ImagePlate slot={hero.image} priority sizes="100vw" vignette={0.45} />
      </div>

      {/* Layer 2 — scrims that hand the type enough contrast to sit on */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(3,3,4,0.95) 0%, rgba(3,3,4,0.45) 38%, rgba(3,3,4,0.15) 62%, rgba(3,3,4,0.7) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-0 hidden md:block"
        style={{
          background:
            'linear-gradient(100deg, rgba(3,3,4,0.86) 0%, rgba(3,3,4,0.34) 40%, transparent 68%)',
        }}
      />

      {/* Layer 3 — typography */}
      <div className="gutter relative mx-auto flex min-h-[100svh] max-w-[120rem] flex-col justify-end pt-28 pb-14 md:pb-16">
        <div data-hero-content className="max-w-[68rem]">
          <p className="label-type mb-6 flex items-center gap-3 text-ash md:mb-9">
            <span aria-hidden className="inline-block h-px w-8 bg-red" />
            Strength / Conditioning
          </p>

          <h1 id="hero-heading" className="display-type text-[clamp(4.2rem,27vw,11.5rem)]">
            {hero.lines.map((line) => (
              <MaskLine
                key={line}
                as="span"
                className="block"
                innerClassName={line === hero.accentWord ? 'text-red' : undefined}
              >
                {line}
              </MaskLine>
            ))}
          </h1>

          <div className="mt-9 flex flex-col gap-7 md:mt-12 md:flex-row md:items-center md:gap-12">
            <p
              data-anim="fade-up"
              className="body-type max-w-[19rem] text-[0.95rem] text-ash md:text-base"
            >
              {hero.support}
            </p>
            <div data-anim="fade-up" className="flex flex-wrap items-center gap-x-9 gap-y-3">
              <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
              <Button href={hero.secondaryCta.href} variant="ghost">
                {hero.secondaryCta.label}
              </Button>
            </div>
          </div>
        </div>

        {/* HUD (mobile) — metadata reads as a row under the CTAs */}
        <ul data-hero-hud className="mt-12 flex flex-wrap gap-x-7 gap-y-3 lg:hidden">
          {hero.hud.map((item) => (
            <li key={item.index} data-anim="fade-up" className="flex items-baseline gap-2.5">
              <span className="label-type text-red">{item.index}</span>
              <span className="label-type text-ash">{item.label}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* HUD (desktop) — a quiet vertical column on the right edge of the grid */}
      <div className="pointer-events-none absolute inset-0 hidden lg:block">
        <div className="gutter mx-auto flex h-full max-w-[120rem] items-center justify-end">
          <ul data-hero-hud className="flex flex-col items-end gap-7">
            {hero.hud.map((item) => (
              <li key={item.index} data-anim="fade-up" className="flex flex-col items-end gap-2">
                <span className="label-type text-red">{item.index}</span>
                <span className="label-type text-ash">{item.label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <ScrollCue />
    </section>
  );
}

/** Thin vertical rule with a red segment that travels down it. */
function ScrollCue() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-10 bottom-10 hidden flex-col items-center gap-3 md:flex lg:right-14"
    >
      <span className="label-type text-smoke">Scroll</span>
      <span
        data-hero-rule
        className="relative block h-16 w-px origin-top scale-y-0 overflow-hidden bg-iron"
      >
        <span className="absolute inset-x-0 top-0 block h-5 bg-red [animation:cue_2.4s_var(--ease-load)_infinite]" />
      </span>
    </div>
  );
}

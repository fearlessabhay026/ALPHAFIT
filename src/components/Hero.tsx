import { useEffect } from 'react';
import { hero } from '../data/site';
import { photos } from '../data/images.generated';
import { ease, gsap, reveal, useGsap, useIsDesktop, usePrefersReducedMotion } from '../lib/motion';
import { Button } from './ui/Button';
import { ImagePlate } from './ui/ImagePlate';
import { MaskLine } from './ui/Reveal';

/**
 * Hero — a split composition: the statement holds the left, the athlete holds
 * the right, and a gradient seam lets one dissolve into the other.
 *
 * Depth, back to front:
 *   ambience   a blurred copy of the photograph carrying its red light across the black
 *   words      the kinetic TRAIN / BUILD / PERFORM wall, partly behind the athlete
 *   athlete    the photograph, masked into the dark on its left edge
 *   type       the headline and actions
 *
 * Scroll and pointer each move those layers at different rates. They drive
 * separate wrappers (scroll: yPercent on the outer, pointer: x/y on the inner)
 * so the two never fight over the same transform.
 */
export function Hero() {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useIsDesktop();
  const photo = photos[hero.image.photo];

  const scope = useGsap(
    ({ self }) => {
      const intro = gsap.timeline({ defaults: { ease: ease.weight } });

      intro.fromTo(
        '[data-hero-photo]',
        { opacity: 0, scale: reduced ? 1 : 1.12 },
        { opacity: 1, scale: 1, duration: reduced ? 0.6 : 2.2, ease: 'power2.out' },
        0,
      );
      intro.fromTo('[data-hero-ambience]', { opacity: 0 }, { opacity: 1, duration: 1.6 }, 0.2);
      reveal(intro, '[data-anim="rise"] > *', 'rise', { duration: 1.15, stagger: 0.09 }, 0.2);
      reveal(intro, '[data-anim="fade-up"]', 'fade-up', { stagger: 0.07 }, 0.8);
      reveal(intro, '[data-hero-rule]', 'draw-y', {}, 0.9);

      if (reduced) return;

      gsap
        .timeline({
          scrollTrigger: { trigger: self, start: 'top top', end: 'bottom top', scrub: 0.6 },
        })
        .to('[data-depth="ambience"]', { yPercent: 22, ease: 'none' }, 0)
        .to('[data-depth="athlete"]', { yPercent: 9, ease: 'none' }, 0)
        .to('[data-depth="type"]', { yPercent: -16, opacity: 0.2, ease: 'none' }, 0)
        .to('[data-hero-hud]', { yPercent: -40, opacity: 0, ease: 'none' }, 0)
        .to('[data-kinetic="0"]', { yPercent: -120, opacity: 0, ease: 'none' }, 0)
        .fromTo('[data-kinetic="1"]', { yPercent: 60, opacity: 0 }, { yPercent: -40, opacity: 1, ease: 'none' }, 0)
        .fromTo('[data-kinetic="2"]', { yPercent: 140, opacity: 0 }, { yPercent: 10, opacity: 1, ease: 'none' }, 0.25);
    },
    [reduced],
  );

  // Pointer parallax. Desktop + fine pointer only, and off under reduced motion.
  useEffect(() => {
    const root = scope.current;
    if (!root || !isDesktop || reduced) return;

    const layers = [
      { el: root.querySelector('[data-pointer="ambience"]'), depth: -10 },
      { el: root.querySelector('[data-pointer="words"]'), depth: -6 },
      { el: root.querySelector('[data-pointer="athlete"]'), depth: 14 },
      { el: root.querySelector('[data-pointer="type"]'), depth: 5 },
    ].map(({ el, depth }) => ({
      depth,
      x: gsap.quickTo(el, 'x', { duration: 1.4, ease: 'power3.out' }),
      y: gsap.quickTo(el, 'y', { duration: 1.4, ease: 'power3.out' }),
    }));

    const onMove = (event: PointerEvent) => {
      const nx = event.clientX / window.innerWidth - 0.5;
      const ny = event.clientY / window.innerHeight - 0.5;
      for (const layer of layers) {
        layer.x(nx * layer.depth * 2);
        layer.y(ny * layer.depth * 1.2);
      }
    };
    const onLeave = () => layers.forEach((layer) => (layer.x(0), layer.y(0)));

    root.addEventListener('pointermove', onMove, { passive: true });
    root.addEventListener('pointerleave', onLeave);
    return () => {
      root.removeEventListener('pointermove', onMove);
      root.removeEventListener('pointerleave', onLeave);
    };
  }, [isDesktop, reduced, scope]);

  return (
    <section
      id="top"
      ref={scope as React.Ref<HTMLElement>}
      aria-labelledby="hero-heading"
      className="relative min-h-[100svh] overflow-clip bg-void"
    >
      {/* Ambience — the photograph's own light, blurred across the whole field */}
      <div data-depth="ambience" aria-hidden className="absolute inset-0 will-change-transform">
        <div data-pointer="ambience" className="absolute -inset-[6%]">
          <img
            data-hero-ambience
            src={photo.thumb}
            alt=""
            className="h-full w-full scale-110 object-cover blur-2xl saturate-150 js:opacity-0"
            style={{ objectPosition: hero.image.focus }}
          />
          <div className="absolute inset-0 bg-void/70" />
        </div>
      </div>

      {/* Kinetic word wall — sits behind the athlete */}
      <div
        aria-hidden
        data-pointer="words"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        {hero.kinetic.map((word, index) => (
          <span
            key={word}
            data-kinetic={index}
            className="display-type absolute text-[26vw] whitespace-nowrap text-transparent will-change-transform"
            style={{
              WebkitTextStroke: '1px rgba(237,233,227,0.09)',
              opacity: index === 0 ? 1 : 0,
            }}
          >
            {word}
          </span>
        ))}
      </div>

      {/* Athlete — full bleed on phones, the right half on desktop */}
      <div
        data-depth="athlete"
        className="absolute inset-x-0 top-0 h-[74svh] will-change-transform lg:inset-y-0 lg:right-0 lg:left-auto lg:h-auto lg:w-[56%]"
      >
        <div data-pointer="athlete" className="absolute -inset-[3%]">
          <div
            data-hero-photo
            className="hero-athlete-mask absolute inset-0 will-change-transform js:opacity-0"
          >
            <ImagePlate
              slot={hero.image}
              priority
              sizes="(min-width: 1024px) 60vw, 180vw"
              className="brightness-[0.92] contrast-[1.06]"
            />
            {/* Red rim light raking in from camera right */}
            <span
              aria-hidden
              className="absolute inset-0 mix-blend-screen"
              style={{
                background:
                  'radial-gradient(38% 58% at 100% 28%, rgba(225,20,20,0.32), transparent 72%)',
              }}
            />
          </div>
        </div>
        <p className="label-type absolute top-28 right-10 hidden text-bone/50 lg:block min-[90rem]:right-14">
          Fig. 01 / The setup
        </p>
      </div>

      {/* Seam — hands the lower frame to the type on phones */}
      <div
        aria-hidden
        className="absolute inset-0 lg:hidden"
        style={{
          background:
            'linear-gradient(to top, rgba(3,3,4,1) 0%, rgba(3,3,4,0.92) 34%, rgba(3,3,4,0.35) 58%, rgba(3,3,4,0.15) 80%, rgba(3,3,4,0.55) 100%)',
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 hidden h-[34%] lg:block"
        style={{ background: 'linear-gradient(to top, rgba(3,3,4,0.95), transparent)' }}
      />

      {/* Type */}
      <div data-depth="type" className="relative will-change-transform">
        <div
          data-pointer="type"
          className="gutter relative mx-auto flex min-h-[100svh] max-w-[120rem] flex-col justify-end pt-28 pb-14 md:pb-16"
        >
          <div className="lg:max-w-[50%]">
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

            <p
              data-anim="fade-up"
              className="body-type mt-8 max-w-[21rem] text-[0.95rem] text-ash md:mt-10 md:text-base"
            >
              {hero.support}
            </p>
            <div
              data-anim="fade-up"
              className="mt-7 flex flex-wrap items-center gap-x-9 gap-y-3 md:mt-8"
            >
              <Button href={hero.primaryCta.href}>{hero.primaryCta.label}</Button>
              <Button href={hero.secondaryCta.href} variant="ghost">
                {hero.secondaryCta.label}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* HUD — tiny editorial metadata along the floor of the frame, with the scroll cue */}
      <div
        data-hero-hud
        className="gutter pointer-events-none absolute inset-x-0 bottom-0 mx-auto max-w-[120rem] pb-6 md:pb-8 lg:pb-12"
      >
        <div className="flex items-end justify-between gap-6 lg:justify-end lg:gap-12">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 md:gap-x-9">
            {hero.hud.map((item) => (
              <li key={item.index} data-anim="fade-up" className="flex items-baseline gap-2.5">
                <span className="label-type text-red">{item.index}</span>
                <span className="label-type text-ash">{item.label}</span>
              </li>
            ))}
          </ul>
          <div aria-hidden className="hidden flex-col items-center gap-3 md:flex">
            <span className="label-type text-smoke">Scroll</span>
            <span
              data-hero-rule
              className="relative block h-14 w-px origin-top scale-y-0 overflow-hidden bg-iron"
            >
              <span className="absolute inset-x-0 top-0 block h-5 bg-red [animation:cue_2.4s_var(--ease-load)_infinite]" />
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

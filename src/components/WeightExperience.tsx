import { weightExperience as w } from '../data/site';
import {
  ease,
  gsap,
  onEnter,
  reveal,
  useGsap,
  useMediaQuery,
  usePrefersReducedMotion,
} from '../lib/motion';
import { MaskLine } from './ui/Reveal';

/**
 * The signature moment. A pinned black field, one enormous statement, and a
 * column of loads that travels through the viewport as you scroll — a plate
 * turning behind it all.
 *
 * It is a storytelling device, not a tracker: nothing here is interactive and
 * nothing is being calculated.
 *
 * Pinning is md-and-up only. On phones it degrades to a short scroll-revealed
 * sequence, which keeps the typography huge without the cost of a pin.
 */
export function WeightExperience() {
  const reduced = usePrefersReducedMotion();
  const canPin = useMediaQuery('(min-width: 768px)');
  const pinned = canPin && !reduced;

  const scope = useGsap(({ self }) => {
    if (!pinned) {
      // Static fallback: reveal on entry, show every load at rest.
      const tl = gsap.timeline({ scrollTrigger: onEnter(self, 'top 72%') });
      reveal(tl, '[data-anim="rise"] > *', 'rise', { stagger: 0.1 }, 0);
      reveal(tl, '[data-weight-load]', 'fade-up', { stagger: 0.1, duration: 0.7 }, 0.3);
      reveal(tl, '[data-weight-closing]', 'fade-up', {}, 0.7);
      return;
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: self,
        start: 'top top',
        end: '+=280%',
        pin: '[data-weight-stage]',
        scrub: 0.8,
        anticipatePin: 1,
      },
    });

    // The statement arrives first and holds while the loads run past it.
    reveal(tl, '[data-anim="rise"] > *', 'rise', { duration: 1.1, stagger: 0.14 }, 0);

    // The plate turns through the whole section — slow, heavy, continuous.
    tl.fromTo(
      '[data-weight-plate]',
      { rotate: -22, scale: 0.86, opacity: 0.35 },
      { rotate: 24, scale: 1.08, opacity: 0.75, ease: 'none', duration: 6 },
      0,
    );

    // Loads travel up through the frame, one handing over to the next.
    w.loads.forEach((_, index) => {
      tl.fromTo(
        `[data-weight-load="${index}"]`,
        { yPercent: 130, opacity: 0 },
        { yPercent: 0, opacity: 1, duration: 0.7, ease: ease.weight },
        1 + index * 0.9,
      ).to(
        `[data-weight-load="${index}"]`,
        { yPercent: -130, opacity: 0, duration: 0.7, ease: 'power2.in' },
        1.75 + index * 0.9,
      );
    });

    // Final state.
    tl.to('[data-weight-heading]', { opacity: 0.18, duration: 0.6 }, 5.1)
      .fromTo(
        '[data-weight-closing]',
        { opacity: 0, yPercent: 40 },
        { opacity: 1, yPercent: 0, duration: 0.8, ease: ease.weight },
        5.3,
      )
      .to({}, { duration: 0.6 });
  }, [pinned]);

  return (
    <section
      ref={scope as React.Ref<HTMLElement>}
      data-weight
      aria-labelledby="weight-heading"
      className="relative bg-void"
    >
      <div
        data-weight-stage
        className="relative flex min-h-[70svh] flex-col justify-center overflow-clip py-24 md:min-h-[100svh] md:py-0"
      >
        {/* The plate */}
        <div
          aria-hidden
          data-weight-plate
          className="pointer-events-none absolute top-1/2 left-1/2 aspect-square w-[130vw] -translate-x-1/2 -translate-y-1/2 will-change-transform md:w-[78vh]"
          style={{
            background: [
              'radial-gradient(circle, transparent 0 17%, rgba(225,20,20,0.5) 17.5% 19%, transparent 19.5%)',
              'radial-gradient(circle, transparent 0 25%, rgba(200,200,215,0.14) 25.5% 26.5%, transparent 27%)',
              'radial-gradient(circle, rgba(30,30,36,0.9) 0 48%, transparent 49%)',
              'radial-gradient(circle, transparent 0 46%, rgba(215,215,230,0.18) 47% 48.5%, transparent 49.5%)',
            ].join(','),
          }}
        />

        <div className="gutter relative mx-auto flex w-full max-w-[120rem] flex-col gap-10 md:flex-row md:items-center md:justify-between md:gap-16">
          <h2
            id="weight-heading"
            data-weight-heading
            className="display-type text-[clamp(3rem,10.5vw,8.5rem)]"
          >
            {w.lines.map((line) => (
              <MaskLine key={line} as="span" className="block">
                <span className={line === w.accentLine ? 'text-red' : undefined}>{line}</span>
              </MaskLine>
            ))}
          </h2>

          {/* The loads. Pinned: they travel. Otherwise: a plain stacked list. */}
          <div
            className={
              pinned
                ? 'relative h-[8rem] w-full shrink-0 md:h-[12rem] md:max-w-[22rem]'
                : 'grid grid-cols-2 gap-x-6 gap-y-5'
            }
          >
            {w.loads.map((load, index) => (
              <p
                key={load}
                data-weight-load={index}
                className={`display-type flex items-baseline gap-2 will-change-transform ${
                  pinned
                    ? 'absolute inset-x-0 top-0 justify-end text-[clamp(3.2rem,9vw,7rem)] md:justify-start'
                    : 'text-[clamp(2.4rem,12vw,4rem)]'
                }`}
              >
                {load}
                <span className="label-type text-red">{w.unit}</span>
              </p>
            ))}
          </div>
        </div>

        <p
          data-weight-closing
          className="label-type gutter absolute inset-x-0 bottom-10 mx-auto max-w-[120rem] text-ash md:bottom-14"
        >
          {w.closing}
        </p>
      </div>
    </section>
  );
}

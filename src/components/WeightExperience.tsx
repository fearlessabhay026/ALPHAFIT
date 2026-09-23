import { useRef } from 'react';
import { plateSequence } from '../data/plate.generated';
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
import { PlateCanvas, spinAt, type PlateProgress } from './PlateSequence';
import { MaskLine } from './ui/Reveal';

/**
 * The signature moment. A black field, one statement, and a 20 KG ALPHAFIT
 * plate — a real object rendered from the plate model — turning out of the
 * dark while the loads climb past it.
 *
 * Pinned on desktop. On phones, and under reduced motion, it becomes a short
 * flowing sequence with a single rendered frame, so the typography stays huge
 * without the cost of a pin or a frame sequence.
 */
export function WeightExperience() {
  const reduced = usePrefersReducedMotion();
  const canPin = useMediaQuery('(min-width: 768px)');
  const pinned = canPin && !reduced;
  return pinned ? <PinnedWeight /> : <FlowWeight reduced={reduced} />;
}

/* -------------------------------------------------------------------------- */

const DURATION = 10; // timeline units; everything below is placed on this scale

function PinnedWeight() {
  const progress = useRef<PlateProgress>({ t: 0 }).current;

  const scope = useGsap(({ self }) => {
    // The statement lands as the section arrives, before the pin — the stage
    // is never empty when it locks.
    const intro = gsap.timeline({ scrollTrigger: onEnter(self, 'top 65%') });
    reveal(intro, '[data-weight-heading] [data-anim="rise"] > *', 'rise', { stagger: 0.12 }, 0);
    reveal(intro, '[data-weight-meta]', 'fade', { stagger: 0.1 }, 0.4);

    const tl = gsap.timeline({
      defaults: { ease: 'none' },
      scrollTrigger: {
        trigger: self,
        start: 'top top',
        end: '+=320%',
        pin: '[data-weight-stage]',
        scrub: 1.2, // heavy: the plate settles after the scroll stops
        anticipatePin: 1,
      },
    });

    // The plate. Spin is linear in progress because the frames' lighting was
    // baked against exactly that angle — see PlateSequence.spinAt.
    tl.to(progress, { t: 1, duration: DURATION }, 0);
    tl.fromTo(
      '[data-plate]',
      { xPercent: -50, yPercent: -50, x: '9vw', y: '6vh', scale: 0.75, rotate: spinAt(0) },
      { xPercent: -50, yPercent: -50, x: '-2vw', y: '-1vh', scale: 1.15, rotate: spinAt(1), duration: DURATION },
      0,
    );
    // Its light on the floor grows as it comes forward.
    tl.fromTo('[data-plate-glow]', { opacity: 0.25, scale: 0.8 }, { opacity: 1, scale: 1.1, duration: DURATION }, 0);

    // Type drifts against the plate: parallax, not choreography.
    tl.to('[data-weight-heading]', { y: '-7vh', duration: 8 }, 0);

    // Loads climb through the frame, each handing over to the next.
    const slots = [1.0, 2.9, 4.8, 6.7];
    w.loads.forEach((_, i) => {
      const at = slots[i];
      const last = i === w.loads.length - 1;
      // Each exit is mostly clear before the next load arrives, so two
      // numbers never sit on top of each other.
      tl.fromTo(
        `[data-load="${i}"]`,
        { yPercent: 115, x: 40, opacity: 0, scale: 0.82, rotate: -7 },
        { yPercent: 0, x: 0, opacity: 1, scale: 1, rotate: 0, duration: 0.9, ease: ease.weight },
        at + 0.1,
      ).to(
        `[data-load="${i}"]`,
        { yPercent: -115, x: -50, opacity: 0, scale: 1.08, rotate: 4, duration: 0.55, ease: 'power2.in' },
        last ? 8.1 : at + 1.4,
      );
    });
    tl.fromTo('[data-load-rail]', { scaleY: 0 }, { scaleY: 1, duration: 7, ease: 'none' }, 1);

    // Final state: the statement gives way to the instruction.
    tl.to('[data-weight-heading]', { opacity: 0, y: '-12vh', duration: 0.8, ease: 'power2.in' }, 8.1);
    tl.to('[data-weight-loads]', { opacity: 0, duration: 0.6 }, 8.1);
    reveal(tl, '[data-weight-closing] [data-anim="rise"] > *', 'rise', { stagger: 0.18, duration: 1 }, 8.5);
    tl.to({}, { duration: 0.4 }, DURATION - 0.4);
  }, []);

  return (
    <section
      ref={scope as React.Ref<HTMLElement>}
      data-weight
      aria-labelledby="weight-heading"
      className="relative bg-void"
    >
      <div data-weight-stage className="relative h-[100svh] overflow-clip">
        {/* Light pooling on the floor beneath the plate */}
        <div
          aria-hidden
          data-plate-glow
          className="pointer-events-none absolute bottom-[-18vh] left-[58%] h-[55vh] w-[70vw] -translate-x-1/2 rounded-[50%]"
          style={{ background: 'radial-gradient(closest-side, rgba(225,20,20,0.22), transparent)' }}
        />

        {/* The plate — an object in the room, not a background */}
        <div
          data-plate
          className="absolute top-1/2 left-[58%] aspect-square w-[min(88vh,58vw)] will-change-transform"
        >
          <PlateCanvas progress={progress} />
        </div>

        <div className="gutter relative mx-auto flex h-full max-w-[120rem] items-center">
          {/* Statement */}
          <h2
            id="weight-heading"
            data-weight-heading
            className="display-type relative z-10 text-[clamp(3.4rem,9.5vw,9.5rem)]"
          >
            {w.lines.map((line) => (
              <MaskLine key={line} as="span" className="block">
                <span className={line === w.accentLine ? 'text-red' : undefined}>{line}</span>
              </MaskLine>
            ))}
          </h2>

          {/* Final instruction, occupying the statement's place */}
          <p
            data-weight-closing
            className="display-type gutter absolute inset-x-0 top-1/2 z-10 mx-auto max-w-[120rem] -translate-y-1/2 text-[clamp(3.4rem,9.5vw,9.5rem)]"
          >
            {w.closing.map((line, i) => (
              <MaskLine key={line} as="span" className="block">
                <span className={i === w.closing.length - 1 ? 'text-red' : undefined}>{line}</span>
              </MaskLine>
            ))}
          </p>

          {/* Loads, with a rail that fills as they climb */}
          <div
            data-weight-loads
            aria-hidden
            className="absolute right-10 bottom-[16vh] z-10 flex items-end gap-6 min-[90rem]:right-14"
          >
            <span className="relative block h-40 w-px bg-iron">
              <span data-load-rail className="absolute inset-0 block origin-bottom bg-red" />
            </span>
            <div className="relative h-[clamp(5rem,11vw,11rem)] w-[clamp(15rem,26vw,26rem)]">
              {w.loads.map((load, i) => (
                <p
                  key={load}
                  data-load={i}
                  className="display-type absolute right-0 bottom-0 flex items-baseline gap-3 text-[clamp(5rem,11vw,11rem)] opacity-0 will-change-transform"
                >
                  {load}
                  <span className="label-type text-red">{w.unit}</span>
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Technical metadata along the floor */}
        <div className="gutter pointer-events-none absolute inset-x-0 bottom-8 mx-auto flex max-w-[120rem] items-center justify-between">
          <p data-weight-meta className="label-type text-smoke">
            20 kg / ALPHAFIT bumper
          </p>
          <p data-weight-meta className="label-type text-smoke">
            Load progression — {w.loads.join(' / ')} {w.unit}
          </p>
        </div>

        {/* Screen readers get the sequence as plain text rather than an animation */}
        <p className="sr-only">
          Loads: {w.loads.map((l) => `${l} ${w.unit}`).join(', ')}. {w.closing.join(' ')}
        </p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */

function FlowWeight({ reduced }: { reduced: boolean }) {
  const scope = useGsap(
    ({ self }) => {
      const tl = gsap.timeline({ scrollTrigger: onEnter(self, 'top 72%') });
      reveal(tl, '[data-anim="rise"] > *', 'rise', { stagger: 0.1 }, 0);
      reveal(tl, '[data-load]', 'fade-up', { stagger: 0.1, duration: 0.7 }, 0.3);

      if (reduced) return;
      // Even without the frame sequence the plate still turns and comes forward.
      gsap.fromTo(
        '[data-plate]',
        { rotate: spinAt(0), scale: 0.82 },
        {
          rotate: spinAt(1),
          scale: 1.04,
          ease: 'none',
          scrollTrigger: { trigger: self, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
        },
      );
    },
    [reduced],
  );

  return (
    <section
      ref={scope as React.Ref<HTMLElement>}
      data-weight
      aria-labelledby="weight-heading"
      className="relative overflow-clip bg-void py-24 md:py-32"
    >
      <div className="gutter mx-auto grid max-w-[120rem] items-center gap-12 md:grid-cols-2">
        <h2 id="weight-heading" className="display-type text-[clamp(3.2rem,15vw,8rem)]">
          {w.lines.map((line) => (
            <MaskLine key={line} as="span" className="block">
              <span className={line === w.accentLine ? 'text-red' : undefined}>{line}</span>
            </MaskLine>
          ))}
        </h2>

        <div className="relative mx-auto w-[86vw] max-w-[34rem] md:w-full">
          <div
            aria-hidden
            className="absolute inset-x-[-10%] bottom-[-14%] h-1/2 rounded-[50%]"
            style={{ background: 'radial-gradient(closest-side, rgba(225,20,20,0.2), transparent)' }}
          />
          <img
            data-plate
            src={plateSequence.still}
            alt="A 20 kg ALPHAFIT bumper plate, its embossed lettering catching a raking light."
            width={720}
            height={720}
            loading="lazy"
            decoding="async"
            className="relative aspect-square w-full will-change-transform"
          />
        </div>

        <ul className="grid grid-cols-2 gap-x-6 gap-y-4 md:col-span-2 md:grid-cols-4">
          {w.loads.map((load) => (
            <li
              key={load}
              data-load
              className="display-type flex items-baseline gap-2 border-t border-iron pt-4 text-[clamp(2.6rem,12vw,5rem)]"
            >
              {load}
              <span className="label-type text-red">{w.unit}</span>
            </li>
          ))}
        </ul>

        <p className="display-type text-[clamp(2.8rem,13vw,7rem)] md:col-span-2">
          {w.closing.map((line, i) => (
            <MaskLine key={line} as="span" className="block">
              <span className={i === w.closing.length - 1 ? 'text-red' : undefined}>{line}</span>
            </MaskLine>
          ))}
        </p>
      </div>
    </section>
  );
}

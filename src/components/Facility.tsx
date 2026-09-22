import { useState } from 'react';
import { facility, facilityStrip } from '../data/site';
import { gsap, onEnter, reveal, useGsap, useIsDesktop, usePrefersReducedMotion } from '../lib/motion';
import { Button } from './ui/Button';
import { ImagePlate } from './ui/ImagePlate';
import { MaskLine, SectionLabel } from './ui/Reveal';

/**
 * The Room — the environment sell. The photograph dominates; everything else
 * is annotation. Hotspots are buttons so they are reachable by keyboard, and
 * they collapse into a plain readable list on small screens.
 */
export function Facility() {
  const [open, setOpen] = useState<string | null>(null);
  const isDesktop = useIsDesktop();
  const reduced = usePrefersReducedMotion();

  const scope = useGsap(({ self }) => {
    const tl = gsap.timeline({ scrollTrigger: onEnter(self, 'top 74%') });

    reveal(tl, '[data-facility-label]', 'fade-up', {}, 0);
    reveal(tl, '[data-anim="rise"] > *', 'rise', { duration: 1.15, stagger: 0.09 }, 0.05);
    reveal(tl, '[data-facility-copy]', 'fade-up', { stagger: 0.08 }, 0.4);
    reveal(tl, '[data-facility-frame]', 'clip', { duration: 1.4 }, 0.2);
    reveal(tl, '[data-facility-spot]', 'fade', { stagger: 0.08, duration: 0.6 }, 0.9);

    if (reduced) return;

    // The room drifts under its own frame as the section passes.
    gsap.fromTo(
      '[data-facility-image]',
      { yPercent: -6, scale: 1.1 },
      {
        yPercent: 6,
        scale: 1.1,
        ease: 'none',
        scrollTrigger: { trigger: '[data-facility-frame]', start: 'top bottom', end: 'bottom top', scrub: 1 },
      },
    );
  }, [reduced]);

  return (
    <section
      id="facility"
      ref={scope as React.Ref<HTMLElement>}
      data-facility
      aria-labelledby="facility-heading"
      className="relative overflow-clip bg-ink py-24 md:py-32 lg:py-40"
    >
      <div className="gutter mx-auto max-w-[120rem]">
        <div className="grid grid-cols-12 items-end gap-x-6 gap-y-8">
          <div className="col-span-12 lg:col-span-5">
            <div data-facility-label>
              <SectionLabel>{facility.label}</SectionLabel>
            </div>
            <h2
              id="facility-heading"
              className="display-type mt-8 text-[clamp(3.4rem,11vw,7.5rem)]"
            >
              {facility.lines.map((line) => (
                <MaskLine key={line} as="span" className="block">
                  <span className={line === facility.accentLine ? 'text-red' : undefined}>
                    {line}
                  </span>
                </MaskLine>
              ))}
            </h2>
          </div>

          <div className="col-span-12 flex flex-col gap-7 pb-2 lg:col-span-4 lg:col-start-9 lg:items-end">
            <p
              data-facility-copy
              className="body-type max-w-xs text-[0.95rem] text-ash lg:text-right"
            >
              {facility.support}
            </p>
            <div data-facility-copy>
              <Button href={facility.cta.href} variant="outline">
                {facility.cta.label}
              </Button>
            </div>
          </div>
        </div>

        {/* The room */}
        <div
          data-facility-frame
          className="relative mt-12 aspect-[4/5] overflow-hidden border border-iron/60 sm:aspect-[16/10] lg:mt-16 lg:aspect-[16/8]"
        >
          <div data-facility-image className="absolute inset-0 scale-110 will-change-transform">
            <ImagePlate slot={facility.image} sizes="100vw" vignette={0.7} />
          </div>

          {isDesktop && (
            <div className="absolute inset-0">
              {facility.hotspots.map((spot) => (
                <Hotspot
                  key={spot.index}
                  spot={spot}
                  open={open === spot.index}
                  onSet={(next) =>
                    setOpen((current) =>
                      next ? spot.index : current === spot.index ? null : current,
                    )
                  }
                />
              ))}
            </div>
          )}
        </div>

        {/* Below 1024px the hotspots become an honest list rather than a diagram */}
        <ul className="mt-8 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2 lg:hidden">
          {facility.hotspots.map((spot) => (
            <li key={spot.index} className="flex gap-4 border-t border-iron/60 pt-4">
              <span className="label-type shrink-0 pt-1 text-red">{spot.index}</span>
              <div>
                <h3 className="display-type text-[1.15rem]">{spot.title}</h3>
                <p className="body-type mt-1.5 text-[0.82rem] text-ash">{spot.note}</p>
              </div>
            </li>
          ))}
        </ul>

        <FacilityStrip />
      </div>
    </section>
  );
}

type Spot = (typeof facility.hotspots)[number];

/**
 * A hotspot: a marker, a connecting line, and a panel. Rendered as a button so
 * it can be tabbed to and opened from the keyboard, not just hovered.
 */
function Hotspot({
  spot,
  open,
  onSet,
}: {
  spot: Spot;
  open: boolean;
  onSet: (open: boolean) => void;
}) {
  // Panels on the right half of the image open leftwards so they stay in frame.
  const flip = spot.x > 58;

  return (
    <div
      data-facility-spot
      className="absolute"
      style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
    >
      <button
        type="button"
        onMouseEnter={() => onSet(true)}
        onMouseLeave={() => onSet(false)}
        onFocus={() => onSet(true)}
        onBlur={() => onSet(false)}
        onClick={() => onSet(!open)}
        aria-expanded={open}
        className="group relative flex -translate-x-1/2 -translate-y-1/2 items-center gap-2.5"
      >
        <span
          aria-hidden
          className={`relative block h-2.5 w-2.5 shrink-0 rounded-full border transition-colors duration-300 ${
            open ? 'border-red bg-red' : 'border-bone/70 bg-transparent'
          }`}
        >
          <span
            className={`absolute -inset-2 rounded-full border transition-all duration-500 ${
              open ? 'scale-100 border-red/50 opacity-100' : 'scale-75 border-bone/25 opacity-60'
            }`}
          />
        </span>
        <span
          className={`label-type whitespace-nowrap transition-colors duration-300 ${
            open ? 'text-bone' : 'text-bone/60'
          }`}
        >
          {spot.index} / {spot.title}
        </span>
      </button>

      {/* Connector: draws out toward the panel when the spot is live */}
      <span
        aria-hidden
        className={`absolute top-1/2 block h-px origin-left bg-red transition-transform duration-500 ease-out ${
          open ? 'scale-x-100' : 'scale-x-0'
        } ${flip ? 'right-full mr-1 origin-right' : 'left-full ml-1'}`}
        style={{ width: '2.5rem' }}
      />

      <div
        className={`pointer-events-none absolute top-1/2 w-56 -translate-y-1/2 border border-iron bg-void/95 p-4 backdrop-blur-sm transition-all duration-500 ease-out ${
          open ? 'translate-x-0 opacity-100' : 'opacity-0'
        } ${flip ? 'right-full mr-12' : 'left-full ml-12'}`}
      >
        <h3 className="display-type text-[1.05rem]">{spot.title}</h3>
        <p className="body-type mt-2 text-[0.78rem] text-ash">{spot.note}</p>
      </div>
    </div>
  );
}

/**
 * The strip: five details of the room. Horizontal drift on desktop tied to
 * scroll, a native swipe list on touch.
 */
function FacilityStrip() {
  const reduced = usePrefersReducedMotion();
  const isDesktop = useIsDesktop();

  const scope = useGsap(({ self }) => {
    if (reduced || !isDesktop) return;
    gsap.fromTo(
      '[data-strip-track]',
      { xPercent: 0 },
      {
        xPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: self, start: 'top bottom', end: 'bottom top', scrub: 1.2 },
      },
    );
  }, [reduced, isDesktop]);

  return (
    <div ref={scope as React.Ref<HTMLDivElement>} data-strip className="mt-16 lg:mt-24">
      <div className="no-scrollbar -mx-5 overflow-x-auto px-5 md:-mx-10 md:px-10 lg:mx-0 lg:overflow-visible lg:px-0">
        <ul
          data-strip-track
          className="flex w-max gap-3 lg:w-[112%] lg:gap-4"
        >
          {facilityStrip.map((item) => (
            <li
              key={item.title}
              className="group relative w-[62vw] shrink-0 sm:w-[38vw] lg:w-auto lg:flex-1"
            >
              <div className="relative aspect-[3/4] overflow-hidden border border-iron/60 sm:aspect-square lg:aspect-[4/5]">
                <ImagePlate
                  slot={item.image}
                  sizes="(max-width: 1024px) 62vw, 20vw"
                  vignette={0.6}
                  className="transition-transform duration-[900ms] ease-out group-hover:scale-105"
                />
                <span
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to top, rgba(3,3,4,0.9) 4%, transparent 60%)',
                  }}
                />
              </div>
              <div className="mt-4 flex items-baseline justify-between gap-3 border-t border-iron/60 pt-3">
                <h3 className="display-type text-[1rem]">{item.title}</h3>
                <p className="label-type text-smoke">{item.note}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

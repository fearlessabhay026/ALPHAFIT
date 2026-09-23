import { useState } from 'react';
import { facility, facilityStrip, sections } from '../data/site';
import { gsap, onEnter, reveal, useGsap, useIsDesktop, usePrefersReducedMotion } from '../lib/motion';
import { Button } from './ui/Button';
import { ImagePlate } from './ui/ImagePlate';
import { SectionMarker } from './ui/Transitions';
import { MaskLine, SectionLabel } from './ui/Reveal';

/**
 * The Room — the environment sell. The photograph dominates; everything else
 * is annotation. Hotspots are buttons so they are reachable by keyboard, and
 * they collapse into a plain readable list on small screens.
 */
export function Facility() {
  const [open, setOpen] = useState<string | null>(null);
  const isDesktop = useIsDesktop();
  const activeSpot = facility.hotspots.find((spot) => spot.index === open) ?? null;
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
    // Gentle, so hotspots near the edges stay inside the frame.
    gsap.fromTo(
      '[data-facility-image]',
      { yPercent: -2.5, scale: 1.06 },
      {
        yPercent: 2.5,
        scale: 1.06,
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
      className="relative overflow-clip bg-ink pt-28 pb-20 md:pt-32 lg:pt-36 lg:pb-24"
    >
      <SectionMarker {...sections.facility} />
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

        {/* The room — the photograph dominates; hotspots ride on it */}
        <div
          data-facility-frame
          className="relative mt-12 aspect-[4/5] overflow-hidden border border-iron/60 sm:aspect-[16/10] lg:mt-16 lg:aspect-[1672/941]"
        >
          <div data-facility-image className="absolute inset-0 will-change-transform">
            <RoomZoom active={activeSpot}>
              <ImagePlate
                slot={facility.image}
                sizes="(min-width: 1024px) 94vw, 180vw"
                className="brightness-[0.95] contrast-[1.05]"
              />
              <span
                aria-hidden
                className="facility-focus pointer-events-none absolute inset-0"
                style={
                  {
                    '--fx': `${activeSpot?.x ?? 50}%`,
                    '--fy': `${activeSpot?.y ?? 50}%`,
                    opacity: activeSpot ? 1 : 0,
                  } as React.CSSProperties
                }
              />
              {isDesktop &&
                facility.hotspots.map((spot) => (
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
            </RoomZoom>
          </div>

          <span
            aria-hidden
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'linear-gradient(to top, rgba(3,3,4,0.7) 0%, transparent 28%), linear-gradient(to bottom, rgba(3,3,4,0.45) 0%, transparent 18%)',
            }}
          />
          <p className="label-type pointer-events-none absolute top-5 left-5 text-bone/60 md:top-6 md:left-6">
            Fig. 04 / The training floor
          </p>
          <p className="label-type pointer-events-none absolute right-5 bottom-5 hidden text-bone/45 md:right-6 md:bottom-6 lg:block">
            Hover the floor
          </p>
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
 * Zooms the room 3.5% toward the active hotspot. Expressed as translate + scale
 * about the centre (rather than moving transform-origin), so gliding from one
 * hotspot to the next animates instead of jumping.
 */
function RoomZoom({ active, children }: { active: Spot | null; children: React.ReactNode }) {
  const zoom = active ? 1.035 : 1;
  const tx = active ? (1 - zoom) * (active.x - 50) : 0;
  const ty = active ? (1 - zoom) * (active.y - 50) : 0;
  return (
    <div
      className="absolute inset-0 transition-transform duration-[1100ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{ transform: `translate(${tx}%, ${ty}%) scale(${zoom})` }}
    >
      {children}
    </div>
  );
}

/**
 * A hotspot: a dot exactly on its point, a label beside it, and a panel that
 * opens vertically on a drawn connector — so the panel can never collide with
 * the label. Rendered as a button so it works from the keyboard, not only on hover.
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
  const labelLeft = spot.x > 78; // near the right edge the label sits on the left
  const panelAbove = spot.y > 60;
  const panelRight = spot.x > 55; // right of centre: panel hangs leftward from the dot
  const panelId = `hotspot-${spot.index}`;

  return (
    <div data-facility-spot className="absolute h-0 w-0" style={{ left: `${spot.x}%`, top: `${spot.y}%` }}>
      <button
        type="button"
        onMouseEnter={() => onSet(true)}
        onMouseLeave={() => onSet(false)}
        onFocus={() => onSet(true)}
        onBlur={() => onSet(false)}
        onClick={() => onSet(!open)}
        aria-expanded={open}
        aria-controls={panelId}
        className="absolute top-0 left-0 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      >
        <span
          aria-hidden
          className={`relative block h-2.5 w-2.5 rounded-full border transition-colors duration-300 ${
            open ? 'border-red bg-red' : 'border-bone/80 bg-void/40'
          }`}
        >
          <span
            className={`absolute -inset-2 rounded-full border transition-all duration-500 ${
              open ? 'scale-100 border-red/60 opacity-100' : 'scale-75 border-bone/30 opacity-70'
            }`}
          />
        </span>
        <span
          className={`label-type absolute top-1/2 -translate-y-1/2 whitespace-nowrap drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)] transition-colors duration-300 ${
            labelLeft ? 'right-full mr-0.5' : 'left-full ml-0.5'
          } ${open ? 'text-bone' : 'text-bone/70'}`}
        >
          {spot.index} / {spot.title}
        </span>
      </button>

      {/* Connector: draws out of the dot toward the panel */}
      <span
        aria-hidden
        className={`absolute left-0 block h-9 w-px bg-red transition-transform duration-500 ease-out ${
          panelAbove ? 'bottom-2.5 origin-bottom' : 'top-2.5 origin-top'
        } ${open ? 'scale-y-100' : 'scale-y-0'}`}
      />

      <div
        id={panelId}
        role="note"
        className={`pointer-events-none absolute w-60 border border-iron bg-void/90 p-4 backdrop-blur-sm transition-[opacity,translate] duration-500 ease-out ${
          panelAbove ? 'bottom-12' : 'top-12'
        } ${panelRight ? 'right-0 -mr-px border-r-red' : 'left-0 -ml-px border-l-red'} ${
          open ? 'translate-y-0 opacity-100' : `${panelAbove ? 'translate-y-2' : '-translate-y-2'} opacity-0`
        }`}
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
      { xPercent: 2 },
      {
        xPercent: -8,
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
          className="flex w-max gap-3 lg:w-[108%] lg:gap-4"
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

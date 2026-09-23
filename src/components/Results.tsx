import { useEffect, useRef, useState } from 'react';
import { results, type ImageSlot, sections } from '../data/site';
import { ease, gsap, onEnter, reveal, useGsap, usePrefersReducedMotion } from '../lib/motion';
import { ImagePlate } from './ui/ImagePlate';
import { SectionMarker } from './ui/Transitions';
import { MaskLine, SectionLabel } from './ui/Reveal';

/**
 * Results — before/after frames hung on the gym wall, with the member's story
 * beside them.
 *
 * Every entry is a placeholder. Transformation photographs and quotes are
 * personal data: they go in only with the member's consent, and they are never
 * invented. Until then each frame renders as an honest, marked empty frame
 * rather than a stand-in image that could be mistaken for a real result.
 */
export function Results() {
  const [index, setIndex] = useState(0);
  const reduced = usePrefersReducedMotion();
  const panel = useRef<HTMLDivElement>(null);
  const entry = results.entries[index];
  const total = results.entries.length;

  const scope = useGsap(({ self }) => {
    const tl = gsap.timeline({ scrollTrigger: onEnter(self, 'top 74%') });
    reveal(tl, '[data-results-label]', 'fade-up', {}, 0);
    reveal(tl, '[data-anim="rise"] > *', 'rise', { duration: 1.1, stagger: 0.09 }, 0.05);
    reveal(tl, '[data-results-copy]', 'fade-up', { stagger: 0.08 }, 0.4);
    reveal(tl, '[data-results-wall]', 'clip', { duration: 1.4 }, 0.2);
    reveal(tl, '[data-results-frame]', 'fade-up', { stagger: 0.12 }, 0.7);
  }, []);

  // Slide transition: frames clip in, the story shifts. No carousel library.
  useEffect(() => {
    if (reduced || !panel.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-results-media]',
        { clipPath: 'inset(0 0 0 100%)' },
        { clipPath: 'inset(0 0 0 0%)', duration: 0.9, stagger: 0.1, ease: ease.weight },
      );
      gsap.fromTo(
        '[data-results-text] > *',
        { opacity: 0, x: 24 },
        { opacity: 1, x: 0, duration: 0.7, stagger: 0.06, ease: ease.weight },
      );
    }, panel);
    return () => ctx.revert();
  }, [index, reduced]);

  const go = (step: number) => setIndex((current) => (current + step + total) % total);

  return (
    <section
      ref={scope as React.Ref<HTMLElement>}
      aria-labelledby="results-heading"
      className="relative overflow-clip bg-void pt-24 md:pt-32 lg:pt-36"
    >
      <SectionMarker {...sections.results} />
      <div className="gutter mx-auto max-w-[120rem]">
        <div className="grid grid-cols-12 items-end gap-x-6 gap-y-8">
          <div className="col-span-12 lg:col-span-8">
            <div data-results-label>
              <SectionLabel>{results.label}</SectionLabel>
            </div>
            <h2 id="results-heading" className="display-type mt-8 text-[clamp(2.6rem,8.5vw,6.5rem)]">
              {results.lines.map((line) => (
                <MaskLine key={line} as="span" className="block">
                  <span className={line === results.accentLine ? 'text-red' : undefined}>{line}</span>
                </MaskLine>
              ))}
            </h2>
          </div>
          <p
            data-results-copy
            className="body-type col-span-12 max-w-sm pb-2 text-[0.92rem] text-ash lg:col-span-4 lg:col-start-9"
          >
            {results.support}
          </p>
        </div>
      </div>

      {/* The wall */}
      <div
        data-results-wall
        className="relative mt-14 lg:mt-20 lg:aspect-[16/10] lg:min-h-[50rem]"
      >
        <div className="relative aspect-[16/9] lg:absolute lg:inset-0 lg:aspect-auto">
          <ImagePlate slot={results.backdrop} sizes="100vw" className="brightness-[0.8]" />
          <span
            aria-hidden
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(3,3,4,1) 0%, transparent 18%, transparent 70%, rgba(3,3,4,1) 100%), linear-gradient(to right, transparent 40%, rgba(3,3,4,0.35) 100%)',
            }}
          />
        </div>

        <div
          ref={panel}
          aria-live="polite"
          className="gutter relative mx-auto grid max-w-[120rem] gap-8 pt-8 pb-20 lg:absolute lg:inset-0 lg:grid-cols-12 lg:content-center lg:gap-x-6 lg:py-16"
        >
          {/* Before → After, hung on the empty wall, the story beneath them */}
          <div className="lg:col-span-7 lg:col-start-5">
            <div className="flex items-center gap-3 sm:gap-5">
              <MemberFrame slot={entry.before} phase="Before" />
              <span aria-hidden className="flex shrink-0 flex-col items-center gap-2 text-red">
                <span className="block h-px w-6 bg-red sm:w-10" />
                <span className="label-type">{'\u2192'}</span>
              </span>
              <MemberFrame slot={entry.after} phase="After" />
            </div>

            <div className="mt-8 grid gap-8 border-t border-iron/70 pt-6 md:grid-cols-[1.4fr_1fr] md:gap-10">
              <figure data-results-text className="m-0">
                {entry.placeholder && (
                  <p className="label-type mb-4 inline-block border border-red/60 bg-void/60 px-2.5 py-1.5 text-red">
                    Placeholder
                  </p>
                )}
                <blockquote className="body-type text-[1rem] text-bone md:text-[1.08rem]">
                  {'\u201C'}
                  {entry.quote}
                  {'\u201D'}
                </blockquote>
                <figcaption className="mt-5 flex items-baseline gap-4">
                  <span className="display-type text-[1.1rem]">{entry.name}</span>
                  <span className="label-type text-smoke">{entry.meta}</span>
                </figcaption>
              </figure>

              <div className="flex flex-col justify-between gap-6">
                <p className="flex items-baseline gap-3">
                  <span className="label-type text-smoke">{entry.milestone.label}</span>
                  <span className="display-type text-[1.8rem] text-red">{entry.milestone.value}</span>
                </p>
                <div className="flex items-center justify-between gap-6">
                  <p className="label-type text-ash">
                    <span className="text-bone">{String(index + 1).padStart(2, '0')}</span>
                    {' / '}
                    {String(total).padStart(2, '0')}
                  </p>
                  <div className="flex gap-2.5">
                    <ArrowButton label="Previous member story" onClick={() => go(-1)} direction="prev" />
                    <ArrowButton label="Next member story" onClick={() => go(1)} direction="next" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * One before/after frame. With a photograph it shows it; without one it shows
 * a marked empty frame — deliberate, and impossible to mistake for a result.
 */
function MemberFrame({ slot, phase }: { slot: ImageSlot; phase: 'Before' | 'After' }) {
  return (
    <figure data-results-frame className="m-0 min-w-0 flex-1">
      <div
        data-results-media
        className="relative aspect-[3/4] overflow-hidden border border-bone/15 bg-void/75 backdrop-blur-[2px]"
      >
        {slot.photo ? (
          <ImagePlate slot={slot} sizes="(min-width: 1024px) 22vw, 45vw" />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-4 text-center">
            <span className="display-type text-[clamp(1.6rem,3.4vw,3rem)] text-bone/15">{phase}</span>
            <span className="label-type max-w-[11rem] leading-[1.6] text-smoke">
              Member photo — awaiting consent
            </span>
          </div>
        )}
        {/* Corner ticks: registration marks, so the frame reads as intentional */}
        <span aria-hidden className="absolute top-2 left-2 h-3 w-3 border-t border-l border-red" />
        <span aria-hidden className="absolute top-2 right-2 h-3 w-3 border-t border-r border-red" />
        <span aria-hidden className="absolute bottom-2 left-2 h-3 w-3 border-b border-l border-red" />
        <span aria-hidden className="absolute right-2 bottom-2 h-3 w-3 border-r border-b border-red" />
      </div>
      <figcaption className="label-type mt-3 text-bone">{phase}</figcaption>
    </figure>
  );
}

function ArrowButton({
  label,
  onClick,
  direction,
}: {
  label: string;
  onClick: () => void;
  direction: 'prev' | 'next';
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="group flex h-11 w-11 items-center justify-center border border-iron bg-void/60 text-bone transition-colors duration-300 hover:border-red hover:bg-red focus-visible:border-red"
    >
      <span
        aria-hidden
        className={`inline-block transition-transform duration-300 ease-out ${
          direction === 'prev'
            ? 'group-hover:-translate-x-1 group-focus-visible:-translate-x-1'
            : 'group-hover:translate-x-1 group-focus-visible:translate-x-1'
        }`}
      >
        {direction === 'prev' ? '←' : '→'}
      </span>
    </button>
  );
}

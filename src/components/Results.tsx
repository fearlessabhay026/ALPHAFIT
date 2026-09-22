import { useEffect, useRef, useState } from 'react';
import { results } from '../data/site';
import { ease, gsap, onEnter, reveal, useGsap, usePrefersReducedMotion } from '../lib/motion';
import { ImagePlate } from './ui/ImagePlate';
import { MaskLine, SectionLabel } from './ui/Reveal';

/**
 * Results — before/after, a milestone and a member quote.
 *
 * Every entry is a placeholder. Real transformation imagery and quotes are
 * personal data: they only go in with the member's consent, and they are
 * never invented. Placeholder entries render with a visible marker so an
 * unfinished field cannot ship by accident.
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
    reveal(tl, '[data-results-frame]', 'clip', { stagger: 0.12, duration: 1.1 }, 0.25);
  }, []);

  // Slide transition: the images clip in, the text shifts. No carousel library.
  useEffect(() => {
    if (reduced || !panel.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-results-media]',
        { clipPath: 'inset(0 0 0 100%)' },
        { clipPath: 'inset(0 0 0 0%)', duration: 0.9, stagger: 0.08, ease: ease.weight },
      );
      gsap.fromTo(
        '[data-results-text] > *',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.06, ease: ease.weight },
      );
    }, panel);
    return () => ctx.revert();
  }, [index, reduced]);

  const go = (step: number) => setIndex((current) => (current + step + total) % total);

  return (
    <section
      ref={scope as React.Ref<HTMLElement>}
      data-results
      aria-labelledby="results-heading"
      className="relative overflow-clip bg-void py-24 md:py-32 lg:py-40"
    >
      <div className="gutter mx-auto max-w-[120rem]">
        <div className="grid grid-cols-12 items-end gap-x-6 gap-y-8">
          <div className="col-span-12 lg:col-span-7">
            <div data-results-label>
              <SectionLabel>{results.label}</SectionLabel>
            </div>
            <h2
              id="results-heading"
              className="display-type mt-8 text-[clamp(2.6rem,8vw,5.5rem)]"
            >
              {results.lines.map((line) => (
                <MaskLine key={line} as="span" className="block">
                  <span className={line === results.accentLine ? 'text-red' : undefined}>
                    {line}
                  </span>
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

        <div
          ref={panel}
          className="mt-14 grid grid-cols-12 gap-x-6 gap-y-8 lg:mt-20"
          aria-live="polite"
        >
          {/* Before / after pair */}
          <div className="col-span-12 grid grid-cols-2 gap-3 lg:col-span-7">
            {(['before', 'after'] as const).map((phase) => (
              <figure key={phase} data-results-frame className="relative">
                <div
                  data-results-media
                  className="relative aspect-[3/4] overflow-hidden border border-iron/60 bg-ink"
                >
                  <ImagePlate slot={entry[phase]} sizes="(max-width: 1024px) 50vw, 28vw" />
                  <span className="label-type absolute bottom-4 left-4 text-bone">{phase}</span>
                </div>
              </figure>
            ))}
          </div>

          {/* Story panel */}
          <div className="col-span-12 flex flex-col justify-between gap-10 lg:col-span-4 lg:col-start-9">
            <figure data-results-text className="m-0">
              {entry.placeholder && (
                <p className="label-type mb-6 inline-block border border-red/60 px-2.5 py-1.5 text-red">
                  Placeholder — awaiting real member story
                </p>
              )}
              <blockquote className="body-type text-[1.05rem] text-bone md:text-[1.15rem]">
                {'“'}
                {entry.quote}
                {'”'}
              </blockquote>
              <figcaption className="mt-6">
                <p className="display-type text-[1.1rem]">{entry.name}</p>
                <p className="label-type mt-2 text-smoke">{entry.meta}</p>
              </figcaption>
              <p className="mt-8 flex items-baseline gap-3 border-t border-iron pt-5">
                <span className="label-type text-smoke">{entry.milestone.label}</span>
                <span className="display-type text-[1.6rem] text-red">{entry.milestone.value}</span>
              </p>
            </figure>

            {/* Controls */}
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
    </section>
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
      className="group flex h-11 w-11 items-center justify-center border border-iron text-bone transition-colors duration-300 hover:border-red hover:bg-red focus-visible:border-red"
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

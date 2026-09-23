import { SectionMarker } from './ui/Transitions';
import { stats, sections } from '../data/site';
import { gsap, onEnter, reveal, useGsap } from '../lib/motion';
import { SectionLabel } from './ui/Reveal';

/**
 * Numbers — four giant figures divided by rules that draw themselves down.
 *
 * Every value is a placeholder. These are business claims, so they stay filler
 * until real figures exist; placeholder entries carry a visible marker.
 */
export function Stats() {
  const scope = useGsap(({ self }) => {
    const tl = gsap.timeline({ scrollTrigger: onEnter(self, 'top 76%') });
    reveal(tl, '[data-stats-label]', 'fade-up', {}, 0);
    reveal(tl, '[data-stats-rule]', 'draw-y', { stagger: 0.08, duration: 0.9 }, 0.1);
    reveal(tl, '[data-anim="rise"] > *', 'rise', { stagger: 0.1, duration: 1.1 }, 0.15);
    reveal(tl, '[data-stats-meta]', 'fade-up', { stagger: 0.08, duration: 0.7 }, 0.45);
  }, []);

  return (
    <section
      ref={scope as React.Ref<HTMLElement>}
      data-stats
      aria-labelledby="stats-heading"
      className="relative overflow-clip bg-ink pt-28 pb-20 md:pt-32 lg:pt-36 lg:pb-28"
    >
      <SectionMarker {...sections.stats} />
      <div className="gutter mx-auto max-w-[120rem]">
        <div data-stats-label>
          <SectionLabel>{stats.label}</SectionLabel>
        </div>
        <h2 id="stats-heading" className="sr-only">
          ALPHAFIT in numbers
        </h2>

        <ul className="mt-12 grid grid-cols-2 gap-y-14 md:mt-16 md:grid-cols-4">
          {stats.items.map((item, index) => (
            <li key={item.title} className="relative pl-5 md:pl-8">
              <span
                aria-hidden
                data-stats-rule
                className={`absolute top-0 left-0 block h-full w-px origin-top ${
                  index === 0 ? 'bg-red' : 'bg-iron'
                }`}
              />
              <p className="reveal-mask" data-anim="rise">
                <span className="display-type block text-[clamp(3rem,8.5vw,6.5rem)] will-change-transform">
                  {item.value}
                </span>
              </p>
              <div data-stats-meta className="mt-4">
                <h3 className="label-type text-bone">{item.title}</h3>
                <p className="body-type mt-2 max-w-[12rem] text-[0.8rem] text-smoke">{item.note}</p>
                {item.placeholder && (
                  <p className="label-type mt-3 text-red/80">Placeholder figure</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

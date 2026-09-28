import { useEffect, useRef, useState } from 'react';
import { joinHref, navigation } from '../data/site';
import { gsap, ease, usePrefersReducedMotion } from '../lib/motion';
import { scrollToId, setScrollLocked } from '../lib/useSmoothScroll';
import { Wordmark } from './ui/Wordmark';

/**
 * Minimal overlay navigation. Transparent across the hero, then settles into a
 * dark bar once the hero is behind you. A hairline tracks page progress in red.
 */
export function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    let frame = 0;
    const read = () => {
      frame = 0;
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(y > window.innerHeight * 0.6);
      setProgress(max > 0 ? Math.min(1, y / max) : 0);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(read);
    };
    read();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  const go = (href: string) => {
    setMenuOpen(false);
    scrollToId(href);
    history.replaceState(null, '', href);
  };

  return (
    <>
      <a
        href="#main"
        className="label-type pointer-events-none fixed top-0 left-0 z-[90] -translate-y-full bg-red px-5 py-4 text-bone opacity-0 transition-transform duration-200 focus:pointer-events-auto focus:translate-y-0 focus:opacity-100"
      >
        Skip to content
      </a>

      <header
        className={`fixed inset-x-0 top-0 z-[70] transition-[background-color,border-color,backdrop-filter] duration-500 ease-out ${
          scrolled
            ? 'border-b border-iron/80 bg-ink/85 backdrop-blur-md'
            : 'border-b border-transparent bg-transparent'
        }`}
      >
        <nav
          aria-label="Primary"
          className="gutter mx-auto flex h-16 max-w-[120rem] items-center justify-between md:h-20"
        >
          <a
            href="#top"
            onClick={(event) => {
              event.preventDefault();
              go('#top');
            }}
            className="shrink-0"
            aria-label="ALPHAFIT — back to top"
          >
            <Wordmark className="text-[0.82rem] md:text-[0.95rem]" />
          </a>

          <ul className="hidden items-center gap-10 lg:flex">
            {navigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(event) => {
                    event.preventDefault();
                    go(item.href);
                  }}
                  className="label-type group relative py-2 text-ash transition-colors duration-300 hover:text-bone"
                >
                  {item.label}
                  <span
                    aria-hidden
                    className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-red transition-transform duration-400 ease-out group-hover:scale-x-100"
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-4">
            <a
              href={joinHref}
              target="_blank"
              rel="noopener noreferrer"
              className="label-type hidden border border-red px-5 py-3 text-bone transition-colors duration-300 hover:bg-red lg:inline-block"
            >
              Join now
            </a>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="label-type flex items-center gap-2.5 py-2 text-bone lg:hidden"
            >
              Menu
              <span aria-hidden className="flex flex-col gap-[3px]">
                <span className="block h-px w-5 bg-bone" />
                <span className="block h-px w-5 bg-red" />
              </span>
            </button>
          </div>
        </nav>

        {/* Page progress — the only persistent red element on the page */}
        <div
          aria-hidden
          className={`h-px w-full transition-colors duration-500 ${scrolled ? 'bg-iron/60' : 'bg-transparent'}`}
        >
          <div
            className="h-px origin-left bg-red"
            style={{ transform: `scaleX(${progress})`, transition: 'transform 120ms linear' }}
          />
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} onNavigate={go} />
    </>
  );
}

function MobileMenu({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean;
  onClose: () => void;
  onNavigate: (href: string) => void;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!open) return;
    setScrollLocked(true);
    const previous = document.activeElement as HTMLElement | null;
    closeButton.current?.focus();

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key !== 'Tab' || !panel.current) return;
      // Contain focus inside the overlay while it is open.
      const focusables = panel.current.querySelectorAll<HTMLElement>('a[href], button');
      if (!focusables.length) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      setScrollLocked(false);
      previous?.focus();
    };
  }, [open, onClose]);

  useEffect(() => {
    if (!open || !panel.current || reduced) return;
    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .fromTo(
          '[data-menu-panel]',
          { clipPath: 'inset(0 0 100% 0)' },
          { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: ease.weight },
        )
        .fromTo(
          '[data-menu-item] > *',
          { yPercent: 110 },
          { yPercent: 0, duration: 0.7, stagger: 0.06, ease: ease.weight },
          '-=0.45',
        )
        .fromTo('[data-menu-foot]', { opacity: 0 }, { opacity: 1, duration: 0.5 }, '-=0.3');
    }, panel);
    return () => ctx.revert();
  }, [open, reduced]);

  if (!open) return null;

  return (
    <div
      ref={panel}
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      className="fixed inset-0 z-[80] lg:hidden"
    >
      <div data-menu-panel className="absolute inset-0 flex flex-col bg-void">
        <div className="gutter flex h-16 shrink-0 items-center justify-between md:h-20">
          <Wordmark className="text-[0.82rem]" />
          <button
            ref={closeButton}
            type="button"
            onClick={onClose}
            className="label-type flex items-center gap-2.5 py-2 text-bone"
          >
            Close
            <span aria-hidden className="relative block h-4 w-4">
              <span className="absolute top-1/2 left-0 block h-px w-4 rotate-45 bg-red" />
              <span className="absolute top-1/2 left-0 block h-px w-4 -rotate-45 bg-bone" />
            </span>
          </button>
        </div>

        <nav aria-label="Mobile" className="gutter flex flex-1 flex-col justify-center">
          <ul>
            {navigation.map((item, index) => (
              <li key={item.href} className="border-t border-iron/60 last:border-b">
                <a
                  href={item.href}
                  onClick={(event) => {
                    event.preventDefault();
                    onNavigate(item.href);
                  }}
                  className="flex items-baseline gap-5 py-5"
                >
                  <span className="label-type text-red">{`0${index + 1}`}</span>
                  <span data-menu-item className="reveal-mask">
                    <span className="display-type block text-[clamp(2.6rem,13vw,4.5rem)]">
                      {item.label}
                    </span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <a
            href={joinHref}
            target="_blank"
            rel="noopener noreferrer"
            className="label-type mt-10 flex items-center justify-between border border-red px-6 py-5 text-bone"
          >
            Join now
            <span aria-hidden>{'→'}</span>
          </a>
        </nav>

        <div data-menu-foot className="gutter label-type flex items-center justify-between pb-8 text-smoke">
          <span>Strength / Conditioning</span>
          <span className="text-red">Train like a king</span>
        </div>
      </div>
    </div>
  );
}

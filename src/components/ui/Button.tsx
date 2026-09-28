import type { ReactNode } from 'react';
import { useMagnetic } from '../../lib/motion';
import { scrollToId } from '../../lib/useSmoothScroll';

type Variant = 'primary' | 'outline' | 'ghost';

type Props = {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  /** Rendered inside the button; defaults to the arrow glyph. */
  trailing?: ReactNode;
};

const VARIANTS: Record<Variant, string> = {
  // Black field, red border, red fill on hover. Rectangular by design.
  primary:
    'border border-red bg-transparent text-bone hover:bg-red hover:text-bone focus-visible:bg-red',
  outline:
    'border border-iron bg-transparent text-bone hover:border-bone/70 hover:bg-bone hover:text-ink',
  ghost: 'border border-transparent bg-transparent text-ash hover:text-bone px-0',
};

export function Button({ href, children, variant = 'primary', className = '', trailing }: Props) {
  const magnetic = useMagnetic<HTMLAnchorElement>(variant === 'ghost' ? 0.14 : 0.24);

  const isHash = href.startsWith('#');
  const isExternal = /^https?:/.test(href);

  return (
    <a
      {...magnetic}
      href={href}
      {...(isExternal && { target: '_blank', rel: 'noopener noreferrer' })}
      onClick={
        isHash
          ? (event) => {
              // Keep modifier-clicks and middle-clicks native.
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return;
              event.preventDefault();
              scrollToId(href);
              history.replaceState(null, '', href);
            }
          : undefined
      }
      className={`group inline-flex items-center gap-3 px-6 py-4 font-display text-[0.78rem] font-semibold tracking-[0.18em] uppercase transition-colors duration-300 ease-out will-change-transform ${VARIANTS[variant]} ${className}`}
    >
      <span>{children}</span>
      <span
        aria-hidden
        className="inline-block translate-x-0 transition-transform duration-300 ease-out group-hover:translate-x-1.5 group-focus-visible:translate-x-1.5"
      >
        {trailing ?? '→'}
      </span>
    </a>
  );
}

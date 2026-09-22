import type { ElementType, ReactNode } from 'react';

/**
 * Motion primitives. Each sets a `data-anim` hook that the stylesheet uses to
 * hide the element pre-animation (only when JS is running) and that each
 * section's GSAP timeline animates back to rest.
 */

type MaskLineProps = {
  children: ReactNode;
  className?: string;
  /** Inner element carries the transform; the wrapper does the clipping. */
  innerClassName?: string;
  as?: ElementType;
};

/** A single line of display type that slides up out of its own clip box. */
export function MaskLine({ children, className = '', innerClassName = '', as }: MaskLineProps) {
  const Tag = (as ?? 'span') as ElementType;
  return (
    <Tag className={`reveal-mask ${className}`} data-anim="rise">
      <span className={`block will-change-transform ${innerClassName}`}>{children}</span>
    </Tag>
  );
}

export function FadeUp({
  children,
  className = '',
  as,
}: {
  children: ReactNode;
  className?: string;
  as?: ElementType;
}) {
  const Tag = (as ?? 'div') as ElementType;
  return (
    <Tag className={className} data-anim="fade-up">
      {children}
    </Tag>
  );
}

/** A hairline that draws itself from its origin edge. */
export function Rule({
  className = '',
  vertical = false,
}: {
  className?: string;
  vertical?: boolean;
}) {
  return (
    <span
      aria-hidden
      data-anim={vertical ? 'draw-y' : 'draw-x'}
      className={`block bg-iron ${vertical ? 'w-px' : 'h-px w-full'} ${className}`}
    />
  );
}

/** Tiny uppercase section marker with a red tick. */
export function SectionLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <p className={`label-type flex items-center gap-3 text-red ${className}`} data-anim="fade-up">
      <span aria-hidden className="inline-block h-px w-6 bg-red" />
      {children}
    </p>
  );
}

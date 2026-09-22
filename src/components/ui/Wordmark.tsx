/**
 * ALPHAFIT wordmark. Set in the display face with a red terminal bar so the
 * logo belongs to the same type system as the headlines rather than sitting
 * outside it as a foreign asset.
 */
export function Wordmark({ className = '' }: { className?: string }) {
  return (
    <span className={`relative inline-block leading-none ${className}`}>
      <span className="font-display text-[1em] font-black tracking-[0.2em] uppercase">
        Alphafit
      </span>
      <span aria-hidden className="absolute -bottom-[0.28em] left-0 block h-[2px] w-full bg-red" />
    </span>
  );
}

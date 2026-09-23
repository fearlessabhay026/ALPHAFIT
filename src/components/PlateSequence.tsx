import { useEffect, useRef } from 'react';
import { plateSequence } from '../data/plate.generated';
import { gsap } from '../lib/motion';

/** Shared, mutable scroll progress (0–1). The section's timeline writes it; the canvas reads it. */
export type PlateProgress = { t: number };

const BATCH = 10;

/**
 * The 20 KG plate, pre-rendered from the ALPHAFIT GLB (see scripts/plate).
 *
 * Follows the frame-scrub rules that keep this smooth on real devices:
 *  - a <canvas> blit, never a <video>
 *  - frames preloaded in batches (browsers cap ~6 connections per host) as the
 *    section approaches, not on page load
 *  - nothing is drawn from a scroll handler: the GSAP ticker reads progress
 *    once per frame and redraws only when the frame index actually changes
 *  - until a frame arrives, the nearest loaded frame is drawn — never a blank
 *
 * The spin is NOT in the frames — the parent applies it as a CSS rotate so it
 * stays perfectly continuous. `spinAt()` must be used for that rotate, because
 * each frame's lighting was baked against exactly that angle.
 */
export function PlateCanvas({ progress, className = '' }: { progress: PlateProgress; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    const ctx = el?.getContext('2d');
    if (!el || !ctx) return;

    const { frames, size } = plateSequence;
    const images: (HTMLImageElement | null)[] = frames.map(() => null);
    let drawn = -1;
    let started = false;
    let cancelled = false;

    const nearestLoaded = (target: number) => {
      for (let d = 0; d < frames.length; d++) {
        if (images[target - d]) return target - d;
        if (images[target + d]) return target + d;
      }
      return -1;
    };

    const draw = () => {
      const target = Math.round(Math.min(1, Math.max(0, progress.t)) * (frames.length - 1));
      const index = images[target] ? target : nearestLoaded(target);
      if (index < 0 || index === drawn) return;
      ctx.clearRect(0, 0, size, size);
      ctx.drawImage(images[index]!, 0, 0, size, size);
      drawn = index;
    };

    const preload = async () => {
      if (started) return;
      started = true;
      // First, last and middle frames first so any scroll position has a close neighbour.
      const order = [0, frames.length - 1, Math.floor(frames.length / 2)];
      for (let i = 0; i < frames.length; i++) if (!order.includes(i)) order.push(i);
      for (let i = 0; i < order.length && !cancelled; i += BATCH) {
        await Promise.all(
          order.slice(i, i + BATCH).map(async (index) => {
            const img = new Image();
            img.src = frames[index];
            try {
              await img.decode();
              if (!cancelled) images[index] = img;
            } catch {
              /* a missing frame falls back to its nearest neighbour */
            }
          }),
        );
        drawn = -1; // a better frame may now be available
      }
    };

    const observer = new IntersectionObserver(
      (entries) => entries.some((e) => e.isIntersecting) && preload(),
      { rootMargin: '200% 0px' },
    );
    observer.observe(el);
    gsap.ticker.add(draw);

    return () => {
      cancelled = true;
      observer.disconnect();
      gsap.ticker.remove(draw);
    };
  }, [progress]);

  return (
    <canvas
      ref={canvas}
      width={plateSequence.size}
      height={plateSequence.size}
      aria-hidden
      className={`block h-full w-full ${className}`}
    />
  );
}

/** The CSS spin (degrees) the frames were lit for at progress t. */
export const spinAt = (t: number) =>
  plateSequence.spinFrom + (plateSequence.spinTo - plateSequence.spinFrom) * t;

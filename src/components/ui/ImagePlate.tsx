import type { CSSProperties } from 'react';
import type { ImageSlot, PlateKind } from '../../data/site';
import { photos } from '../../data/images.generated';

/**
 * ImagePlate — the single image primitive for the whole site.
 *
 * If the slot names a `photo`, it renders that photograph responsively: a
 * srcset of hashed WebP renditions, the slot's focal point as object-position,
 * and a ~200 byte blurred placeholder painted underneath so the frame is never
 * an empty black box while the file arrives.
 *
 * With no photo it renders a generated art-directed stand-in built from
 * layered gradients, so an unfilled slot still reads as deliberate.
 *
 * Slots with an empty `alt` are decorative backdrops and are hidden from
 * assistive technology.
 */

type Props = {
  slot: ImageSlot;
  className?: string;
  /** Marks the hero image so it is eagerly fetched and prioritised for LCP. */
  priority?: boolean;
  /** Extra layer scaled/translated by a parent parallax timeline. */
  style?: CSSProperties;
  sizes?: string;
  /** 0 disables the built-in vignette, for slots that sit under their own scrim. */
  vignette?: number;
};

/**
 * Each recipe is a stack of CSS gradients read bottom-layer-last, tuned to the
 * same palette as the rest of the site: near-black base, one controlled red
 * light source, haze, and a suggestion of form. Abstract on purpose.
 */
const RECIPES: Record<PlateKind, string> = {
  'athlete-rack': [
    // Red key light raking in from behind the figure
    'radial-gradient(52% 44% at 74% 20%, rgba(255,43,43,0.34), transparent 68%)',
    // The figure: a torso mass with a rim on each shoulder
    'radial-gradient(11% 24% at 68% 52%, rgba(226,226,236,0.30), transparent 72%)',
    'radial-gradient(20% 34% at 68% 58%, rgba(150,150,166,0.20), transparent 74%)',
    'linear-gradient(94deg, transparent 60%, rgba(236,236,246,0.14) 62.5%, transparent 65%)',
    'linear-gradient(266deg, transparent 24%, rgba(255,80,80,0.16) 27%, transparent 30%)',
    // The rack: uprights receding into the dark
    'linear-gradient(90deg, transparent 51%, rgba(198,198,212,0.13) 52.4%, transparent 53.8%)',
    'linear-gradient(90deg, transparent 85%, rgba(198,198,212,0.11) 86.6%, transparent 88%)',
    // Haze on the floor, then the room falling away to black
    'radial-gradient(46% 20% at 62% 88%, rgba(180,180,200,0.13), transparent 74%)',
    'linear-gradient(180deg, #16161e 0%, #0b0b11 46%, #050507 100%)',
  ].join(','),
  'plates-stack': [
    'radial-gradient(circle at 58% 48%, rgba(225,20,20,0.2) 0 12%, transparent 13%)',
    'radial-gradient(circle at 58% 48%, rgba(200,200,210,0.13) 22% 23%, transparent 24%)',
    'radial-gradient(circle at 58% 48%, rgba(200,200,210,0.09) 36% 37%, transparent 38%)',
    'radial-gradient(circle at 58% 48%, rgba(200,200,210,0.06) 52% 53%, transparent 54%)',
    'radial-gradient(80% 80% at 58% 48%, rgba(120,120,130,0.12), transparent 70%)',
    'linear-gradient(160deg, #101014, #030304)',
  ].join(','),
  'bar-knurl': [
    'repeating-linear-gradient(112deg, rgba(210,210,220,0.10) 0 1px, transparent 1px 7px)',
    'repeating-linear-gradient(68deg, rgba(210,210,220,0.08) 0 1px, transparent 1px 7px)',
    'radial-gradient(60% 120% at 50% 50%, rgba(225,20,20,0.16), transparent 68%)',
    'linear-gradient(180deg, #16161b 0%, #08080a 60%, #030304 100%)',
  ].join(','),
  'chalk-haze': [
    'radial-gradient(38% 34% at 48% 44%, rgba(235,235,240,0.24), transparent 72%)',
    'radial-gradient(60% 50% at 62% 62%, rgba(200,200,215,0.10), transparent 75%)',
    'radial-gradient(50% 40% at 20% 20%, rgba(225,20,20,0.13), transparent 70%)',
    'linear-gradient(200deg, #0d0d11, #030304)',
  ].join(','),
  'room-wide': [
    // Overhead pools of light down the length of the floor
    'radial-gradient(14% 38% at 22% 28%, rgba(214,214,232,0.16), transparent 74%)',
    'radial-gradient(11% 30% at 46% 25%, rgba(200,200,220,0.11), transparent 76%)',
    'radial-gradient(34% 54% at 86% 30%, rgba(255,43,43,0.28), transparent 70%)',
    // Rack uprights receding toward the back wall
    'linear-gradient(90deg, transparent 15%, rgba(210,210,228,0.11) 16.4%, transparent 17.8%)',
    'linear-gradient(90deg, transparent 29%, rgba(210,210,228,0.09) 30.2%, transparent 31.4%)',
    'linear-gradient(90deg, transparent 61%, rgba(210,210,228,0.08) 62%, transparent 63%)',
    'linear-gradient(90deg, transparent 72%, rgba(210,210,228,0.07) 72.9%, transparent 73.8%)',
    // Floor sheen, then the room dropping away to black
    'radial-gradient(60% 22% at 48% 92%, rgba(190,190,212,0.14), transparent 76%)',
    'linear-gradient(0deg, rgba(3,3,4,0.94) 0%, transparent 30%)',
    'linear-gradient(175deg, #101017 0%, #08080d 50%, #030304 100%)',
  ].join(','),
  coaching: [
    // Two figures, the nearer one catching most of the light
    'radial-gradient(15% 30% at 37% 50%, rgba(224,224,238,0.26), transparent 74%)',
    'radial-gradient(26% 46% at 36% 58%, rgba(168,168,186,0.17), transparent 74%)',
    'radial-gradient(21% 38% at 64% 52%, rgba(146,146,164,0.15), transparent 74%)',
    // Rim light, and a shaft coming through from behind them
    'radial-gradient(48% 42% at 88% 20%, rgba(255,43,43,0.34), transparent 68%)',
    'linear-gradient(104deg, transparent 70%, rgba(255,90,90,0.12) 74%, transparent 79%)',
    'linear-gradient(76deg, transparent 22%, rgba(228,228,244,0.08) 26%, transparent 31%)',
    // Floor
    'linear-gradient(0deg, rgba(3,3,4,0.92) 0%, transparent 26%)',
    'radial-gradient(50% 16% at 48% 88%, rgba(186,186,208,0.12), transparent 76%)',
    'linear-gradient(190deg, #16161f, #050507)',
  ].join(','),
  torso: [
    // Centre mass with a hard rim down each side
    'radial-gradient(13% 26% at 50% 44%, rgba(232,232,244,0.26), transparent 74%)',
    'radial-gradient(24% 44% at 50% 54%, rgba(178,178,194,0.16), transparent 76%)',
    'linear-gradient(95deg, rgba(255,43,43,0.26) 0 5%, transparent 19%)',
    'linear-gradient(265deg, rgba(226,226,242,0.14) 0 4%, transparent 17%)',
    // A single shaft raking across the frame
    'linear-gradient(108deg, transparent 58%, rgba(226,226,242,0.07) 62%, transparent 67%)',
    'linear-gradient(180deg, #14141c 0%, #09090d 60%, #030304 100%)',
  ].join(','),
  'iron-detail': [
    'radial-gradient(circle at 44% 40%, rgba(215,215,225,0.15) 0 18%, transparent 19%)',
    'radial-gradient(circle at 44% 40%, rgba(150,150,160,0.1) 31% 33%, transparent 34%)',
    'linear-gradient(118deg, transparent 40%, rgba(240,240,250,0.12) 46%, transparent 52%)',
    'radial-gradient(70% 70% at 78% 76%, rgba(225,20,20,0.16), transparent 70%)',
    'linear-gradient(150deg, #131317, #030304)',
  ].join(','),
  platform: [
    'linear-gradient(180deg, transparent 54%, rgba(190,190,205,0.08) 55%, transparent 58%)',
    'radial-gradient(44% 16% at 50% 56%, rgba(215,215,228,0.16), transparent 72%)',
    'radial-gradient(56% 46% at 50% 18%, rgba(225,20,20,0.17), transparent 72%)',
    'linear-gradient(180deg, #0f0f14 0%, #060608 60%, #030304 100%)',
  ].join(','),
};

export function ImagePlate({
  slot,
  className = '',
  priority = false,
  style,
  sizes = '100vw',
  vignette = 0.72,
}: Props) {
  const shared = `h-full w-full object-cover ${className}`;
  const decorative = slot.alt === '';

  if (slot.photo) {
    const photo = photos[slot.photo];
    const focus = slot.focus ?? '50% 50%';
    return (
      <img
        src={photo.src}
        srcSet={photo.srcSet}
        sizes={sizes}
        width={photo.width}
        height={photo.height}
        alt={slot.alt}
        aria-hidden={decorative || undefined}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        fetchPriority={priority ? 'high' : 'auto'}
        draggable={false}
        className={`select-none ${shared}`}
        style={{
          objectPosition: focus,
          backgroundImage: `url(${photo.lqip})`,
          backgroundSize: 'cover',
          backgroundPosition: focus,
          ...style,
        }}
      />
    );
  }

  return (
    <div
      role={decorative ? undefined : 'img'}
      aria-label={decorative ? undefined : slot.alt}
      aria-hidden={decorative || undefined}
      data-image-slot={slot.plate}
      className={`relative isolate ${shared}`}
      style={{ backgroundImage: RECIPES[slot.plate], backgroundSize: 'cover', ...style }}
    >
      {/* Texture: keeps the generated plate from reading as flat CSS */}
      <span aria-hidden className="pointer-events-none absolute inset-0 bg-[url('/texture.svg')] opacity-[0.5] mix-blend-overlay" />
      {/* Vignette: pulls the eye to centre and hands the edges back to the page */}
      {vignette > 0 && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: `radial-gradient(120% 90% at 50% 45%, transparent 38%, rgba(3,3,4,${vignette}) 100%)`,
          }}
        />
      )}
      {import.meta.env.DEV && (
        <span className="label-type pointer-events-none absolute bottom-2 left-2 z-10 max-w-[92%] truncate rounded-xs bg-red/85 px-1.5 py-1 text-[0.5rem] text-bone">
          image slot · {slot.plate}
        </span>
      )}
    </div>
  );
}

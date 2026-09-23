/**
 * The plate's scroll choreography, shared by the renderer and the site.
 *
 * The site spins the plate with a CSS rotate so the motion is perfectly smooth.
 * Only the slow-changing parts — the tilt toward camera and the light raking
 * across the face — are baked into frames. Each frame's lights are therefore
 * counter-rotated by the spin the site will apply at that point, so after the
 * CSS rotation the light reads as fixed in the room while the plate turns.
 */
export const FRAMES = 40;
export const SPIN_FROM = -58; // degrees, at scroll progress 0
export const SPIN_TO = 6; // degrees, at scroll progress 1 — settles near upright so "20 KG" reads

export const spinAt = (t) => SPIN_FROM + (SPIN_TO - SPIN_FROM) * t;
const easeOut = (t) => 1 - (1 - t) ** 3;

export function frameSpecs() {
  return Array.from({ length: FRAMES }, (_, i) => {
    const t = i / (FRAMES - 1);
    const e = easeOut(t);
    return {
      // Turns from a steep three-quarter view to nearly face-on.
      tiltY: -40 + 34 * e,
      tiltX: 11 - 8 * e,
      // Key light starts almost off and rises to a raking angle that picks
      // out the embossed "20 KG" and ALPHAFIT lettering.
      keyAz: 158 - spinAt(t),
      keyEl: 3 + 8 * e,
      keyI: 0.08 + 4.4 * t ** 1.6,
      // Constant red rim on the far edge.
      rimAz: -18 - spinAt(t),
      rimEl: 6,
      rimI: 7,
      exposure: 0.95,
    };
  });
}

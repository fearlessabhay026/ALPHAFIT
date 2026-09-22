# ALPHAFIT

A single-page, cinematic site for ALPHAFIT — a strength-training gym.

Built as a premium athletic campaign that happens to be a website: black field,
oversized condensed type, one controlled red accent, and scroll-driven motion
that reads as weight rather than as effects.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build to dist/
npm run preview    # serve the production build
npm run typecheck
```

---

## Stack

| Concern | Choice | Why |
| --- | --- | --- |
| Build | **Vite 7** | One page, no server rendering needed; ships less JS than a framework. |
| UI | **React 19 + TypeScript** | Strict mode on; content is typed. |
| Styling | **Tailwind CSS v4** | CSS-first config; design tokens live in `src/styles/index.css`. |
| Motion | **GSAP + ScrollTrigger** | Scrubbing, pinning and timeline choreography in one library. |
| Scrolling | **Lenis** | Smooth scroll, ticked by GSAP so ScrollTrigger reads one source of truth. |
| Fonts | **Archivo + JetBrains Mono, self-hosted** | No third-party request; the LCP font is preloaded. |

No animation library is layered on top of GSAP, and no UI kit is used.

---

## Structure

```
src/
  data/site.ts            All copy, navigation, image slots and placeholders
  lib/
    motion.ts             GSAP setup, reveal primitives, magnetic + media hooks
    useSmoothScroll.ts    Lenis lifecycle, anchor navigation, scroll locking
  components/
    Navigation.tsx        Overlay nav, scroll state, full-screen mobile menu
    Hero.tsx              Kinetic word wall, parallax layers, HUD, scroll cue
    Manifesto.tsx         "No shortcuts." — typography-led belief statement
    Training.tsx          Sticky statement + three magnetic editorial cards
    TrainingCard.tsx
    Facility.tsx          "The room." — hotspots + horizontal detail strip
    WeightExperience.tsx  Pinned signature moment: loads travelling past type
    PersonalTraining.tsx  Coaching argument against a full-bleed frame
    Results.tsx           Before/after with a clip-reveal transition
    Stats.tsx             Giant figures divided by self-drawing rules
    FinalCTA.tsx          The close
    Footer.tsx
    ui/                   Button, ImagePlate, Reveal primitives, Grain, Wordmark
```

Content is separated from presentation: to re-word the site, edit
`src/data/site.ts` and touch nothing else.

---

## Photography — READ THIS FIRST

**There is no ALPHAFIT photography in this repository.** The art direction
rules out generic stock and AI-looking gym imagery, so rather than ship
something off-brand, every image slot renders a generated stand-in: a layered,
art-directed dark plate (`src/components/ui/ImagePlate.tsx`) that holds the
composition and carries the right palette.

### Replacing a plate with a real photograph

Set `src` on the slot in `src/data/site.ts` and update `alt` to describe the
actual photograph. Nothing else changes.

```ts
image: {
  src: '/photos/hero-rack.jpg',
  alt: 'An ALPHAFIT member setting up under a loaded barbell in the squat rack.',
  plate: 'athlete-rack',   // kept as the fallback
  brief: '...',            // the art-direction note for this slot
}
```

### Slot manifest

Every slot carries a `brief` field in `src/data/site.ts` describing what to
shoot. In development, each unfilled slot also renders a small red badge on the
image itself so nothing ships unnoticed.

| Where | Slot | Aspect | Subject |
| --- | --- | --- | --- |
| Hero | `hero.image` | Full bleed | Athlete mid-setup under a loaded bar; leave the left third empty for type |
| Manifesto | `manifesto.image` | Full bleed | Plates against raw concrete; sits at low opacity behind type |
| Training ×3 | `trainingPrograms[].image` | 3:4 | Heavy squat / mid-set under tension / coach cueing a lift |
| Facility | `facility.image` | 16:8 | **The real training floor** — this section is the environment sell |
| Facility strip ×5 | `facilityStrip[].image` | 4:5 | Iron, racks, bars, chalk, sweat — details and atmosphere |
| Coaching | `coaching.image` | 3:4 | Coach + athlete, or athlete under heavy load; no trainer smiling at camera |
| Results ×6 | `results.entries[].before/after` | 3:4 | Consented member photographs; before and after must match for lighting and crop |

After swapping in the real facility photograph, re-point the hotspot
coordinates in `facility.hotspots` — they are percentages of the image box.

---

## Placeholder content

The following are **deliberately fake** and must be replaced with verified data
or removed. Nothing here was invented to look plausible; each renders with a
visible marker in the UI.

| Item | Location | Marker |
| --- | --- | --- |
| Member count, years, session count | `stats.items` | "Placeholder figure" under each |
| Member stories, names, milestones | `results.entries` | Red "Placeholder — awaiting real member story" chip |
| Location, Instagram, WhatsApp | `contact` | Red "placeholder" tag in the footer |
| Before/after imagery | `results.entries[].before/after` | Generated plate + dev badge |

`LocalBusiness` / `Gym` structured data is **intentionally not shipped**. There
is a `TODO` in `index.html` marking where it goes — add it only once the real
legal name, address, geo and opening hours exist, because search engines treat
structured data as factual claims.

---

## Motion

One motion language across the page: weight, movement, precision, control.

- Everything animates on `transform`, `opacity` or `clip-path`. No layout-triggering
  properties are animated, including the training cards' neighbour compression,
  which uses `scale` rather than `flex-basis`.
- `src/lib/motion.ts` owns the shared easing curves and the `reveal()` primitive.
  Pre-animation hidden states live in CSS behind a `.js` class, so the page is
  fully readable if the script never boots.
- **`reveal()` always sets both `yPercent` and `y`.** GSAP parses a CSS
  `translate3d(0, 105%, 0)` start state into *pixels*, so tweening `yPercent`
  alone leaves the pixel offset behind and the element never arrives. Use the
  helper rather than hand-writing these tweens.
- Section triggers are passed the scope **element**, not a selector string:
  `gsap.context` scopes selectors to *descendants*, so `trigger: '[data-x]'`
  on the scope root itself silently matches nothing and fires at scroll 0.

### Reduced motion

With `prefers-reduced-motion: reduce`:

- Lenis is never instantiated — native scrolling is restored.
- Every reveal collapses to a plain opacity fade; nothing travels, scales or unclips.
- All parallax, the pinned weight section, magnetic buttons and the cursor-lean
  on cards are skipped.
- Card hover states are CSS-driven, so they still respond to hover and keyboard
  focus without GSAP.

---

## Accessibility

- Semantic landmarks, one `h1`, `h2` per section, `h3` for items.
- Skip link, visible red focus rings on every interactive element, and a tab
  order that follows the page.
- Facility hotspots are real `<button>`s with `aria-expanded`, openable from the
  keyboard; below 1024px they become a plain readable list instead of a diagram.
- The mobile menu is a labelled dialog: focus is moved in, contained, restored
  on close, and `Escape` closes it.
- The results slider is an `aria-live="polite"` region with labelled controls.

---

## Performance notes

- Fonts are self-hosted, subset to latin, and the display face is preloaded.
- GSAP + Lenis are split into their own chunk.
- The hero image is the only eagerly-fetched image; every other slot is lazy.
- The film grain is a static SVG overlay, so it costs nothing per frame.
- The weight section only pins at ≥768px; phones get a scroll-revealed
  sequence instead, which keeps the typography without the cost of a pin.

Verified at 390, 768, 1024 and 1440px with no horizontal overflow.

---

## Deployment

Deployed on Vercel, connected to this GitHub repo — pushing to the production
branch triggers a build automatically.

- Project: `alphafit` (team `abhay-s-team5`)
- Production: https://alphafit-eight.vercel.app

### vercel.json

Vercel defaults everything served out of `public/` to
`Cache-Control: max-age=0, must-revalidate`, which makes the **preloaded LCP
font revalidate on every visit**. `vercel.json` overrides that:

| Path | Cache | Why |
| --- | --- | --- |
| `/assets/*` | 1 year, immutable | Vite content-hashes these, so it is always safe |
| `/fonts/*` | 1 year, immutable | Fixed subsets. **If you swap a font file, change its filename too**, or clients will hold the old one |
| `favicon / og / texture` | 1 day | Unhashed art, so a replacement goes live quickly |

`vercel.json` is validated strictly — it rejects unknown keys, so don't add
comment fields to it.

### Before going live

1. **Remove the `noindex` tag** in `index.html`. It is there because the page
   still shows placeholder figures and member stories, and those should not be
   indexed as factual.
2. Replace the placeholders listed above, and fill the image slots.
3. Add the `LocalBusiness` JSON-LD once the real business details exist.
4. Attach the real domain in the Vercel project, and rename the production
   branch to something more permanent than the current working branch.

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
npm run images     # rebuild photography from assets-src/photos
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
  data/site.ts            All copy, navigation, image slots and contact details
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
    WeightExperience.tsx  Pinned signature moment: the plate turns, loads climb past
    PlateSequence.tsx     Canvas frame-scrub for the rendered 20 KG plate
    PersonalTraining.tsx  Coaching argument against a full-bleed frame
    Stats.tsx             Giant figures divided by self-drawing rules
    FinalCTA.tsx          The close, with address, hours, Instagram and WhatsApp
    WhatsAppButton.tsx    Sticky WhatsApp shortcut on phones, shown after the hero
    Footer.tsx
    ui/                   Button, ImagePlate, Reveal primitives, Transitions, Grain, Wordmark
  data/images.generated.ts  Built photo manifest (npm run images)
  data/plate.generated.ts   Built plate frame list (scripts/plate)
assets-src/photos/        Photography masters
scripts/build-images.mjs  Photo pipeline
scripts/plate/            Offline plate renderer (own package.json)
```

Content is separated from presentation: to re-word the site, edit
`src/data/site.ts` and touch nothing else.

---

## Photography

Every image slot is fed from `assets-src/photos/` — JPEG masters, one per
photograph. `npm run images` turns them into responsive, content-hashed WebP
renditions in `public/images/` (480 / 800 / 1200 / full width, ~60–125 KB at
full size), a ~200 byte blurred placeholder each, and the typed manifest
`src/data/images.generated.ts`. It also writes the hero's
`<link rel="preload">` into `index.html`, so the largest image starts
downloading before React runs.

**The current photographs are AI-generated stand-ins, not ALPHAFIT's gym or
members** (each slot is marked `source: 'generated'` in `src/data/site.ts`).
They set the art direction; they should be replaced with real photography
before launch — **the facility first**, because visitors will read "The Room"
as the actual room.

### Replacing a photograph

1. Drop the new master into `assets-src/photos/` (reuse the old filename to
   replace it, or add a new one).
2. `npm run images`
3. In `src/data/site.ts`, point the slot's `photo` at the key, update its
   `alt` to describe the real photograph, set `focus` (the CSS
   object-position to keep in frame when cropped), and set `source: 'alphafit'`.
4. For the facility photograph, re-point `facility.hotspots` — they are
   percentages of the photo, not of the frame.

Each slot carries a `brief` describing what to shoot. A slot with no `photo`
falls back to a generated gradient plate (with a red "image slot" badge in
dev), so nothing breaks while a photograph is missing.

### The 20 KG plate

The plate in "Your next rep" is rendered from the ALPHAFIT bumper-plate model
into 40 frames (~1.1 MB, desktop only, fetched as the section approaches) plus
a 32 KB still for phones and reduced motion. The renderer is a separate
sub-package so three.js and Playwright never enter the site's install — see
`scripts/plate/README.md`.

### Slot manifest

| Where | Photo | Subject |
| --- | --- | --- |
| Hero | `hero-deadlift-setup` | Athlete over a loaded bar, right half of frame |
| Manifesto | `chalk-hands` | Chalked hands, used as low-opacity texture |
| Training | `strength-squat`, `hypertrophy-press`, `coach-squat` | Squat / dumbbell press / coach + athlete |
| Facility | `room-wide` | **The real training floor** — hotspots are mapped onto it |
| Facility strip | `plates-floor`, `room-racks`, `grip-bar`, `chalk-hands`, `athlete-negative-space` | Iron, racks, bars, chalk, sweat |
| Image slit | `plates-floor` | Loaded bar on the platform, cropped thin |
| Coaching | `coach-squat` | Coach cueing an athlete under load |
| Final CTA | `athlete-negative-space` | Athlete + bar with negative space, low opacity |

## Business details

Contact details, stats and the structured data are real, supplied by ALPHAFIT:

| Item | Where |
| --- | --- |
| Address, hours, Instagram, WhatsApp | `contact` in `src/data/site.ts` |
| WhatsApp number and pre-filled messages | `WHATSAPP`, `whatsappLink`, `joinHref` in `src/data/site.ts` |
| Members, years, sessions | `stats.items` in `src/data/site.ts` |
| `ExerciseGym` JSON-LD | `index.html` — keep it in step with `contact` |

Every "join" action (nav "Join now", hero "Start training", "Start your
journey", the sticky phone button) opens WhatsApp with a free-trial message.
"Book a consultation" opens WhatsApp with a coaching message.

Anything still unknown stays out rather than being filled with a guess. The
member-stories section was removed until real, consented stories and
before/after photos exist; bring it back from git history (`Results.tsx`)
when they do. Opening times are not published yet, only the days.

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

### Prerendering

`npm run build` renders the page twice: the normal client build, then
`vite build --ssr src/entry-server.tsx`, and `scripts/prerender.mjs` writes
the server-rendered markup into `dist/index.html`. Crawlers, link previews
and visitors without JavaScript get the full page; `src/main.tsx` hydrates it.
The dev server still renders client-side.

Two rules keep hydration clean:

- Read browser state (`matchMedia`, sizes) through `useMediaQuery` /
  `usePrefersReducedMotion` in `src/lib/motion.ts`, never in a `useState`
  initialiser or during render.
- Start states that GSAP animates from belong behind JS: the `[data-anim]`
  attributes, or the `js:` Tailwind variant (e.g. `js:opacity-0`). A plain
  `opacity-0` hides the element for anyone without JavaScript.

### vercel.json

Vercel defaults everything served out of `public/` to
`Cache-Control: max-age=0, must-revalidate`, which makes the **preloaded LCP
font revalidate on every visit**. `vercel.json` overrides that:

| Path | Cache | Why |
| --- | --- | --- |
| `/assets/*` | 1 year, immutable | Vite content-hashes these |
| `/images/*` | 1 year, immutable | `npm run images` puts a content hash in every filename |
| `/plate/*` | 1 year, immutable | The frame folder is named by a hash of the render |
| `/fonts/*` | 1 year, immutable | Fixed subsets. **If you swap a font file, change its filename too** |
| `favicon / og.jpg / texture` | 1 day | Unhashed, so a replacement goes live quickly |

`vercel.json` is validated strictly — it rejects unknown keys, so don't add
comment fields to it.

### Still to do

1. Replace the AI-generated stand-in photography with real ALPHAFIT photos
   (facility first).
2. Add opening times to `contact` and `openingHours` in the JSON-LD.
3. Attach the real domain in the Vercel project, update the absolute
   `og:image` / `og:url` in `index.html` to it, and rename the production
   branch to something more permanent than the current working branch.

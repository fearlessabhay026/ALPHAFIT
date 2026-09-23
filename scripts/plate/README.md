# Plate renderer

Renders the 20 KG ALPHAFIT bumper plate used in the "Your next rep" section as
a frame sequence. This runs offline, once; the site only ships the output.

```bash
cd scripts/plate
npm install
# put the model at source/alphafit_bumper_20kg.glb (gitignored — it is 33 MB)
npm run render
```

If Playwright's own Chromium isn't installed, either run
`npx playwright install chromium` or point at an existing binary with
`CHROMIUM_PATH=/path/to/chrome npm run render`.

## Output

- `public/plate/<hash>/f00–f39.webp` — 40 × 1000px frames with alpha, ~1.1 MB total
- `public/plate/<hash>/still.webp` — the final frame at 720px, for phones and reduced motion
- `src/data/plate.generated.ts` — frame URLs and the spin range the site must apply

The hash changes whenever the render changes, so the frames can be cached
forever (see `vercel.json`).

## Why frames, not live three.js

A live WebGL scene would mean ~170 KB of three.js, a multi-megabyte model, and
a GPU context on phones. The frames cost nothing at runtime and are only
fetched on desktop as the section approaches.

Only the slow parts of the motion are baked in — the tilt toward camera and
the key light raking across the face. The spin is a CSS rotate so it stays
perfectly smooth; to keep the light fixed in the room as the image turns, each
frame's lights are counter-rotated by the spin the site will apply at that
moment. `sequence.mjs` holds that choreography and is the one place to change it.

## The embossed lettering

"20 KG", ALPHAFIT and the arcs are not geometry — they are the GLB's
`EXT_materials_bump` height map. three.js doesn't implement that extension, so
`render.mjs` extracts the texture from the GLB and `render.html` applies it as a
`bumpMap`. The lettering only appears where the key light grazes the face,
which is what makes the reveal work.

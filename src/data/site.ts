/**
 * ALPHAFIT — content architecture.
 *
 * All copy, navigation and media slots live here so the site can be
 * re-authored without touching a component.
 *
 * PLACEHOLDER POLICY
 * ------------------
 * Anything that would be a factual claim about the business (member counts,
 * years operating, testimonials, address, phone) must be real. While a value
 * is unknown it is marked `placeholder: true` and written with obvious filler
 * (XX+, "Member name"). Never replace filler with invented numbers — replace
 * it with real data or leave the entry out. Components render `placeholder` entries with a visible
 * marker so an unfinished field is obvious during review.
 *
 * PHOTOGRAPHY
 * -----------
 * `photo` keys point at assets-src/photos (built by `npm run images`).
 * Every current photograph is `source: 'generated'` — an art-directed stand-in,
 * not ALPHAFIT's actual gym or members. Replace them with real photography,
 * starting with the facility: visitors will read "The Room" as the real room.
 */
import type { PhotoKey } from './images.generated';

export type ImageSlot = {
  /** Key of a built photograph. When absent, the generated plate renders instead. */
  photo?: PhotoKey;
  /** Describes the photograph, not the layout. Omit only for decorative backdrops. */
  alt: string;
  /** Stand-in composition used when there is no photograph. See components/ui/ImagePlate.tsx */
  plate: PlateKind;
  /** CSS object-position: the focal point to keep in frame when the image is cropped. */
  focus?: string;
  /** Art-direction note for whoever shoots the real photograph. */
  brief: string;
  /** Provenance. 'generated' marks a stand-in to be replaced with real ALPHAFIT photography. */
  source?: 'generated' | 'alphafit';
};

export type PlateKind =
  | 'athlete-rack'
  | 'plates-stack'
  | 'bar-knurl'
  | 'chalk-haze'
  | 'room-wide'
  | 'coaching'
  | 'torso'
  | 'iron-detail'
  | 'platform';

export const brand = {
  name: 'ALPHAFIT',
  tagline: 'Train like a king.',
  signoff: 'Strength builds a better you.',
} as const;

/** ALPHAFIT's WhatsApp, digits only with the country code (wa.me format). */
const WHATSAPP = '919850408764';

/** A wa.me link that opens a chat with ALPHAFIT, pre-filled with `message`. */
export const whatsappLink = (message: string) =>
  `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(message)}`;

/** Where every "join" action lands: a WhatsApp chat asking for a free trial. */
export const joinHref = whatsappLink("Hi AlphaFit, I'd like to book a free trial session");

export const navigation = [
  { label: 'Train', href: '#train' },
  { label: 'Coaching', href: '#coaching' },
  { label: 'Facility', href: '#facility' },
  { label: 'About', href: '#about' },
] as const;

/** Section index used by the transition markers — the page's running order. */
export const sections = {
  manifesto: { index: '02', name: 'Manifesto' },
  training: { index: '03', name: 'Training' },
  facility: { index: '04', name: 'Facility' },
  weight: { index: '05', name: 'The work' },
  coaching: { index: '06', name: 'Coaching' },
  stats: { index: '07', name: 'Numbers' },
  join: { index: '08', name: 'Join' },
} as const;

export const hero = {
  lines: ['Train', 'Like a', 'King'],
  /** The word rendered in red inside the final line. */
  accentWord: 'King',
  support: 'Built for those who take training seriously.',
  primaryCta: { label: 'Start training', href: joinHref },
  secondaryCta: { label: 'Explore ALPHAFIT', href: '#about' },
  /** Tiny editorial metadata set around the composition. */
  hud: [
    { index: '01', label: 'Strength' },
    { index: '02', label: 'Discipline' },
    { index: '03', label: 'Progress' },
  ],
  /** Kinetic word layer behind the composition. */
  kinetic: ['Train', 'Build', 'Perform'],
  image: {
    photo: 'hero-deadlift-setup',
    focus: '62% 38%',
    source: 'generated',
    alt: 'An athlete stands over a loaded barbell between the racks, preparing to deadlift.',
    plate: 'athlete-rack',
    brief:
      'Hero. Athlete mid-setup over a loaded bar. Dark exposure, deep shadow, ' +
      'red rim light, chalk and haze. No eye contact, no smiling. Subject in the ' +
      'right half of the frame so the left can carry the type.',
  } satisfies ImageSlot,
} as const;

export const manifesto = {
  label: 'Our belief',
  lines: ['No', 'Shortcuts.'],
  accentLine: 'Shortcuts.',
  support: 'Strength is built one session at a time. Show up. Load the bar. Do the work.',
  aside: 'Same people. Different results.',
  pillars: [
    { index: '01', title: 'Discipline', note: 'Turn up on the days you would rather not.' },
    { index: '02', title: 'Strength', note: 'Heavier than last month. Every month.' },
    { index: '03', title: 'Consistency', note: 'The program only works if you run it.' },
    { index: '04', title: 'Progress', note: 'Measured, logged, and earned.' },
  ],
  image: {
    photo: 'chalk-hands',
    focus: '58% 30%',
    source: 'generated',
    alt: '',
    plate: 'plates-stack',
    brief:
      'Manifesto backdrop. Chalked hands over the chalk bowl, a loaded plate ' +
      'in frame. Sits at low opacity behind the type — texture, not subject.',
  } satisfies ImageSlot,
} as const;

export const trainingSection = {
  label: 'Our training',
  lines: ['Train', 'With', 'Purpose.'],
  accentLine: 'Purpose.',
  support: 'Structured training. Real progression. A stronger version of you.',
  cta: { label: 'View programs', href: '#coaching' },
} as const;

export const trainingPrograms = [
  {
    index: '01',
    title: 'Strength',
    copy: 'Heavy compounds. Progressive overload. Real strength.',
    detail: 'Squat, press, pull. Loaded, logged and reviewed every block.',
    href: '#coaching',
    image: {
      photo: 'strength-squat',
      focus: '42% 46%',
      source: 'generated',
      alt: 'An athlete at the bottom of a heavy back squat inside the rack.',
      plate: 'athlete-rack',
      brief:
        'Strength card. Back squat or deadlift at a genuinely heavy load. Tight ' +
        'crop, dark exposure, effort visible in the posture. Portrait 3:4.',
    } satisfies ImageSlot,
  },
  {
    index: '02',
    title: 'Hypertrophy',
    copy: 'Build muscle. Build structure. Build confidence.',
    detail: 'Controlled tempo, managed volume, and enough recovery to grow.',
    href: '#coaching',
    image: {
      photo: 'hypertrophy-press',
      focus: '58% 40%',
      source: 'generated',
      alt: 'An athlete pressing a pair of heavy dumbbells on an incline bench.',
      plate: 'torso',
      brief:
        'Hypertrophy card. Mid-set, muscle under tension, low key lighting with a ' +
        'red edge. Anatomy over face. Portrait 3:4.',
    } satisfies ImageSlot,
  },
  {
    index: '03',
    title: 'Personal training',
    copy: '1-on-1 coaching. Individual programming. Accountability.',
    detail: 'A coach on the floor with you, correcting the rep that matters.',
    href: '#coaching',
    image: {
      photo: 'coach-squat',
      focus: '38% 60%',
      source: 'generated',
      alt: 'A coach crouches beside an athlete, cueing his squat position.',
      plate: 'coaching',
      brief:
        'Coaching card. Coach and athlete in frame, coach mid-cue, athlete under ' +
        'load. Documentary, not posed. Portrait 3:4.',
    } satisfies ImageSlot,
  },
] as const;

export const facility = {
  label: 'The facility',
  lines: ['The', 'Room.'],
  accentLine: 'Room.',
  support: 'Everything you need. Nothing you don’t.',
  cta: { label: 'Take a tour', href: '#join' },
  image: {
    photo: 'room-wide',
    source: 'generated',
    alt: 'The training floor: dumbbell racks, power racks, a lifting platform with a loaded bar.',
    plate: 'room-wide',
    brief:
      'Facility hero. Wide shot of the real training floor, lights low, racks ' +
      'receding into shadow. Must be the actual room — this section is the ' +
      'environment sell. Landscape 16:9.',
  } satisfies ImageSlot,
  /**
   * Hotspots are percentages of the photograph (16:9), not of the frame, and
   * they move with the image. Re-point them whenever the photograph changes.
   */
  hotspots: [
    { index: '01', title: 'Racks', note: 'Power racks for heavy lifts, built for strength.', x: 84, y: 27 },
    { index: '02', title: 'Plates', note: 'Calibrated bumper plates, loaded and ready.', x: 94, y: 45 },
    { index: '03', title: 'Bars', note: 'Power and Olympic bars with honest knurling.', x: 70, y: 72 },
    { index: '04', title: 'Platform', note: 'A dedicated platform for pulls and Olympic work.', x: 58, y: 85 },
    { index: '05', title: 'Cables', note: 'Full cable and accessory station for the details.', x: 30, y: 40 },
  ],
} as const;

export const facilityStrip = [
  {
    title: 'Iron',
    note: 'The foundation',
    image: {
      photo: 'plates-floor',
      focus: '28% 58%',
      source: 'generated',
      alt: 'A loaded barbell resting on the floor, 20 kg ALPHAFIT plates in focus.',
      plate: 'iron-detail',
      brief: 'Macro. Worn iron plate edge, lettering catching a single light.',
    } satisfies ImageSlot,
  },
  {
    title: 'Racks',
    note: 'Lift heavier',
    image: {
      photo: 'room-racks',
      focus: '30% 45%',
      source: 'generated',
      alt: 'A row of power racks under low red light.',
      plate: 'athlete-rack',
      brief: 'Rack uprights, strong verticals, deep falloff into black.',
    } satisfies ImageSlot,
  },
  {
    title: 'Bars',
    note: 'Built to last',
    image: {
      photo: 'grip-bar',
      focus: '64% 55%',
      source: 'generated',
      alt: 'A chalked hand gripping the knurling of a loaded bar.',
      plate: 'bar-knurl',
      brief: 'Macro on knurling with chalk in the grooves. Shallow depth of field.',
    } satisfies ImageSlot,
  },
  {
    title: 'Chalk',
    note: 'Better grip',
    image: {
      photo: 'chalk-hands',
      focus: '66% 32%',
      source: 'generated',
      alt: 'Chalk dust rising from an athlete’s hands above the chalk bowl.',
      plate: 'chalk-haze',
      brief: 'Chalk clap backlit against black. Atmosphere shot, no faces.',
    } satisfies ImageSlot,
  },
  {
    title: 'Sweat',
    note: 'Real work',
    image: {
      photo: 'athlete-negative-space',
      focus: '34% 55%',
      source: 'generated',
      alt: 'An athlete standing over the bar between sets, chalk hanging in the air.',
      plate: 'torso',
      brief: 'Between sets. Effort visible. Documentary, unposed, dark.',
    } satisfies ImageSlot,
  },
] as const;

export const weightExperience = {
  lines: ['Your next', 'Rep', 'Is waiting.'],
  accentLine: 'Rep',
  /** Scrubbed through as the section is pinned. Units stay metric. */
  loads: ['40', '60', '80', '100'],
  unit: 'kg',
  closing: ['The work', 'Starts now.'],
} as const;

export const coaching = {
  label: 'Coaching',
  lines: ['Don’t just', 'Work out.', 'Train.'],
  accentLine: 'Train.',
  support: 'Personalised programming. Better technique. Structured progression. Accountability.',
  cta: {
    label: 'Book a consultation',
    href: whatsappLink("Hi AlphaFit, I'd like to book a coaching consultation"),
  },
  principles: [
    { index: '01', title: 'Program', note: 'Written for your training age, not a template.' },
    { index: '02', title: 'Coaching', note: 'A coach on the floor, every session.' },
    { index: '03', title: 'Technique', note: 'Positions corrected before load goes up.' },
    { index: '04', title: 'Accountability', note: 'Sessions logged. Progress reviewed.' },
  ],
  image: {
    photo: 'coach-squat',
    focus: '50% 50%',
    source: 'generated',
    alt: 'An ALPHAFIT coach crouches beside an athlete under a loaded bar, cueing his squat.',
    plate: 'coaching',
    brief:
      'Coaching hero. Coach plus athlete, or athlete under heavy load. Red rim ' +
      'light, chalk, raw floor, visible effort. No trainer smiling at camera.',
  } satisfies ImageSlot,
} as const;

/**
 * Verified figures supplied by ALPHAFIT. Business claims: only ever replace
 * them with real numbers, never estimates.
 */
export const stats = {
  label: 'By the numbers',
  items: [
    { value: '120+', title: 'Members', note: 'A stronger community', placeholder: false },
    { value: '1+', title: 'Years', note: 'Years of commitment', placeholder: false },
    { value: '730+', title: 'Sessions', note: 'Countless stories', placeholder: false },
    { value: '01', title: 'Mission', note: 'A healthier tomorrow', placeholder: false },
  ],
} as const;

export const finalCta = {
  lines: ['Ready', 'To train?'],
  accentLine: 'To train?',
  support: 'Discipline today. A stronger tomorrow.',
  cta: { label: 'Start your journey', href: joinHref },
  image: {
    photo: 'athlete-negative-space',
    focus: '28% 50%',
    source: 'generated',
    alt: '',
    plate: 'platform',
    brief:
      'Closing image. Athlete and loaded bar at the edge of frame with wide ' +
      'negative space for the type. Sits far behind the headline at low opacity.',
  } satisfies ImageSlot,
} as const;

export const contact = [
  {
    label: 'Location',
    value: 'Sapnawat, Hapur, Uttar Pradesh 245101',
    href: 'https://maps.app.goo.gl/mA6HcsDvRZeKjPgUA',
    placeholder: false,
  },
  { label: 'Hours', value: 'Mon–Sat', href: undefined, placeholder: false },
  {
    label: 'Instagram',
    value: '@thealphafitx',
    href: 'https://www.instagram.com/thealphafitx/',
    placeholder: false,
  },
  { label: 'WhatsApp', value: '+91 98504 08764', href: joinHref, placeholder: false },
] as const;

export const footer = {
  legal: `© ${new Date().getFullYear()} ALPHAFIT. All rights reserved.`,
  credit: { label: 'Website by Advicty', href: 'https://advicty.vercel.app' },
} as const;

/** Scroll-driven type bands that carry the page from one section into the next. */
export const bands = {
  intoTraining: {
    label: 'Train with purpose: strength, hypertrophy, coaching.',
    words: ['Strength', 'Hypertrophy', 'Coaching', 'Train with purpose'],
  },
  intoTheWork: {
    label: 'No shortcuts. Built under pressure. Train like a king.',
    words: ['No shortcuts', 'Built under pressure', 'Train like a king'],
  },
} as const;

/** A thin image band between the plate section and coaching. */
export const coachingSlit = {
  caption: 'Fig. 05 / The platform',
  image: {
    photo: 'plates-floor',
    focus: '40% 60%',
    source: 'generated',
    alt: '',
    plate: 'platform',
    brief: 'A loaded bar on the platform, plates in the foreground. Wide, dark, cropped thin.',
  } satisfies ImageSlot,
} as const;

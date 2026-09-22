/**
 * ALPHAFIT — content architecture.
 *
 * All copy, navigation and media slots live here so the site can be
 * re-authored without touching a component.
 *
 * PLACEHOLDER POLICY
 * ------------------
 * Anything that would be a factual claim about the business (member counts,
 * years operating, testimonials, address, phone) is a placeholder marked with
 * `placeholder: true` and written with obvious filler (XX+, "Member name").
 * Never replace these with invented numbers — replace them with real data or
 * leave them out. Components render `placeholder` entries with a dimmed
 * treatment so an unfinished field is visible during review.
 */

export type ImageSlot = {
  /** Set to a real ALPHAFIT photograph to replace the generated plate. */
  src?: string;
  /** Required whenever `src` is set. Describes the photograph, not the layout. */
  alt: string;
  /** Selects the generated stand-in composition. See components/ui/ImagePlate.tsx */
  plate: PlateKind;
  /** Art-direction note for whoever shoots / sources the real image. */
  brief: string;
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

export const navigation = [
  { label: 'Train', href: '#train' },
  { label: 'Coaching', href: '#coaching' },
  { label: 'Facility', href: '#facility' },
  { label: 'About', href: '#about' },
] as const;

export const hero = {
  lines: ['Train', 'Like a', 'King'],
  /** The word rendered in red inside the final line. */
  accentWord: 'King',
  support: 'Built for those who take training seriously.',
  primaryCta: { label: 'Start training', href: '#join' },
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
    alt: 'An ALPHAFIT member setting up under a loaded barbell in the squat rack.',
    plate: 'athlete-rack',
    brief:
      'Hero. Athlete mid-setup under a loaded bar. Dark exposure, deep shadow, ' +
      'single red rim light from camera right, visible chalk and haze. No eye ' +
      'contact, no smiling. Shot wide enough to leave the left third empty for type.',
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
    { index: '03', title: 'Consistency', note: 'The programme only works if you run it.' },
    { index: '04', title: 'Progress', note: 'Measured, logged, and earned.' },
  ],
  image: {
    alt: 'Loaded bumper plates racked against a concrete wall at ALPHAFIT.',
    plate: 'plates-stack',
    brief:
      'Manifesto backdrop. Stacked plates or a loaded bar against raw concrete. ' +
      'Near-black, high contrast, heavy grain. Sits at very low opacity behind type.',
  } satisfies ImageSlot,
} as const;

export const trainingSection = {
  label: 'Our training',
  lines: ['Train', 'With', 'Purpose.'],
  accentLine: 'Purpose.',
  support: 'Structured training. Real progression. A stronger version of you.',
  cta: { label: 'View programmes', href: '#coaching' },
} as const;

export const trainingPrograms = [
  {
    index: '01',
    title: 'Strength',
    copy: 'Heavy compounds. Progressive overload. Real strength.',
    detail: 'Squat, press, pull. Loaded, logged and reviewed every block.',
    href: '#coaching',
    image: {
      alt: 'A member driving out of the bottom of a heavy back squat.',
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
      alt: 'A member mid-set on a dumbbell press under low gym lighting.',
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
      alt: 'An ALPHAFIT coach cueing a member through a lift on the platform.',
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
    alt: 'The main training floor at ALPHAFIT: racks, platforms and loaded bars.',
    plate: 'room-wide',
    brief:
      'Facility hero. Wide shot of the real training floor, lights low, racks ' +
      'receding into shadow. Must be the actual room — this section is the ' +
      'environment sell. Landscape 16:9 or wider.',
  } satisfies ImageSlot,
  /**
   * Hotspots are positioned as percentages of the image box so they survive
   * any crop. Re-point them after swapping in the real photograph.
   */
  hotspots: [
    { index: '01', title: 'Racks', note: 'Power racks for heavy lifts, built for strength.', x: 30, y: 34 },
    { index: '02', title: 'Plates', note: 'Calibrated and bumper plates, loaded and ready.', x: 14, y: 58 },
    { index: '03', title: 'Bars', note: 'Power and Olympic bars with honest knurling.', x: 52, y: 62 },
    { index: '04', title: 'Platform', note: 'A dedicated platform for pulls and Olympic work.', x: 34, y: 82 },
    { index: '05', title: 'Cables', note: 'Full cable and accessory station for the details.', x: 76, y: 54 },
  ],
} as const;

export const facilityStrip = [
  {
    title: 'Iron',
    note: 'The foundation',
    image: {
      alt: 'Close detail of a stacked iron plate at ALPHAFIT.',
      plate: 'iron-detail',
      brief: 'Macro. Worn iron plate edge, lettering catching a single light.',
    } satisfies ImageSlot,
  },
  {
    title: 'Racks',
    note: 'Lift heavier',
    image: {
      alt: 'Uprights of a power rack disappearing into shadow.',
      plate: 'athlete-rack',
      brief: 'Rack uprights, strong verticals, deep falloff into black.',
    } satisfies ImageSlot,
  },
  {
    title: 'Bars',
    note: 'Built to last',
    image: {
      alt: 'Knurling detail on a loaded power bar.',
      plate: 'bar-knurl',
      brief: 'Macro on knurling with chalk in the grooves. Shallow depth of field.',
    } satisfies ImageSlot,
  },
  {
    title: 'Chalk',
    note: 'Better grip',
    image: {
      alt: 'Chalk dust hanging in the air above the platform.',
      plate: 'chalk-haze',
      brief: 'Chalk clap backlit against black. Atmosphere shot, no faces.',
    } satisfies ImageSlot,
  },
  {
    title: 'Sweat',
    note: 'Real work',
    image: {
      alt: 'A member resting between sets after a heavy effort.',
      plate: 'torso',
      brief: 'Between sets. Effort visible. Documentary, unposed, dark.',
    } satisfies ImageSlot,
  },
] as const;

export const weightExperience = {
  lines: ['Your next', 'Rep', 'Is waiting.'],
  accentLine: 'Rep',
  /** Scrubbed through as the section is pinned. Units stay metric. */
  loads: ['45', '60', '80', '100'],
  unit: 'kg',
  closing: 'The work starts now.',
} as const;

export const coaching = {
  label: 'Coaching',
  lines: ['Don’t just', 'Work out.', 'Train.'],
  accentLine: 'Train.',
  support:
    'Personalised programming. Better technique. Structured progression. Accountability.',
  cta: { label: 'Book a consultation', href: '#join' },
  principles: [
    { index: '01', title: 'Programme', note: 'Written for your training age, not a template.' },
    { index: '02', title: 'Coaching', note: 'A coach on the floor, every session.' },
    { index: '03', title: 'Technique', note: 'Positions corrected before load goes up.' },
    { index: '04', title: 'Accountability', note: 'Sessions logged. Progress reviewed.' },
  ],
  image: {
    alt: 'An ALPHAFIT coach spotting a member through a heavy press.',
    plate: 'coaching',
    brief:
      'Coaching hero. Coach plus athlete, or athlete under heavy load. Red rim ' +
      'light, chalk, raw floor, visible effort. No trainer smiling at camera.',
  } satisfies ImageSlot,
} as const;

export const results = {
  label: 'Real people',
  lines: ['Real work.', 'Real progress.'],
  accentLine: 'Real progress.',
  support:
    'Progress at ALPHAFIT is measured in sessions completed and load moved, not in promises.',
  /**
   * PLACEHOLDER — replace every entry with a real, consented member story.
   * Do not publish invented quotes, names or transformation imagery.
   */
  entries: [
    {
      placeholder: true,
      name: 'Member name',
      meta: 'Programme / duration',
      quote: 'Member story placeholder — replace with a real, consented quote.',
      milestone: { label: 'Milestone', value: 'XX kg' },
      before: {
        alt: 'Placeholder for a member’s before photograph.',
        plate: 'torso',
        brief: 'Before image. Consistent lighting, angle and framing with the after image.',
      } satisfies ImageSlot,
      after: {
        alt: 'Placeholder for a member’s after photograph.',
        plate: 'torso',
        brief: 'After image. Must match the before image exactly for lighting and crop.',
      } satisfies ImageSlot,
    },
    {
      placeholder: true,
      name: 'Member name',
      meta: 'Programme / duration',
      quote: 'Member story placeholder — replace with a real, consented quote.',
      milestone: { label: 'Milestone', value: 'XX kg' },
      before: {
        alt: 'Placeholder for a member’s before photograph.',
        plate: 'torso',
        brief: 'Before image. Consistent lighting, angle and framing with the after image.',
      } satisfies ImageSlot,
      after: {
        alt: 'Placeholder for a member’s after photograph.',
        plate: 'torso',
        brief: 'After image. Must match the before image exactly for lighting and crop.',
      } satisfies ImageSlot,
    },
    {
      placeholder: true,
      name: 'Member name',
      meta: 'Programme / duration',
      quote: 'Member story placeholder — replace with a real, consented quote.',
      milestone: { label: 'Milestone', value: 'XX kg' },
      before: {
        alt: 'Placeholder for a member’s before photograph.',
        plate: 'torso',
        brief: 'Before image. Consistent lighting, angle and framing with the after image.',
      } satisfies ImageSlot,
      after: {
        alt: 'Placeholder for a member’s after photograph.',
        plate: 'torso',
        brief: 'After image. Must match the before image exactly for lighting and crop.',
      } satisfies ImageSlot,
    },
  ],
} as const;

/**
 * PLACEHOLDER — every figure below is filler. Replace with verified numbers
 * or delete the entry. Do not invent business statistics.
 */
export const stats = {
  label: 'By the numbers',
  items: [
    { value: 'XX+', title: 'Members', note: 'A stronger community', placeholder: true },
    { value: 'XX+', title: 'Years', note: 'Years of commitment', placeholder: true },
    { value: 'XXXX+', title: 'Sessions', note: 'Countless stories', placeholder: true },
    { value: '01', title: 'Mission', note: 'A healthier tomorrow', placeholder: false },
  ],
} as const;

export const finalCta = {
  lines: ['Ready', 'To train?'],
  accentLine: 'To train?',
  support: 'Discipline today. A stronger tomorrow.',
  cta: { label: 'Start your journey', href: '#join' },
  image: {
    alt: 'A chalked barbell resting on the platform at the end of a session.',
    plate: 'platform',
    brief:
      'Closing image. A single loaded bar on the platform, chalk dust, almost ' +
      'entirely black. Sits far behind the type at low opacity.',
  } satisfies ImageSlot,
} as const;

/**
 * PLACEHOLDER — contact details are unverified. Replace with the real
 * address, handle and number before launch, or remove the entry.
 */
export const contact = {
  location: { label: 'Location', value: 'City, State', href: undefined, placeholder: true },
  instagram: { label: 'Instagram', value: '@alphafit', href: undefined, placeholder: true },
  whatsapp: { label: 'WhatsApp', value: '+00 00000 00000', href: undefined, placeholder: true },
} as const;

export const footer = {
  columns: [
    {
      title: 'Navigate',
      links: navigation.map((item) => ({ label: item.label, href: item.href })),
    },
  ],
  legal: `© ${new Date().getFullYear()} ALPHAFIT. All rights reserved.`,
} as const;

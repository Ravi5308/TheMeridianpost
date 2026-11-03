// Sample newsroom data. Every screen reads from this module through the
// helpers in `src/lib/news.ts`, so swapping in Netlify Database later only
// means replacing those helpers. See PLAN.md.

export type ArticleStatus = 'published' | 'scheduled' | 'draft' | 'review'

export type Section = {
  slug: string
  name: string
  description: string
}

export type Author = {
  id: string
  name: string
  role: string
  initials: string
}

export type ArticleBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string; cite?: string }

export type Article = {
  id: string
  slug: string
  title: string
  dek: string
  section: string
  authorId: string
  image: string
  imageCaption: string
  status: ArticleStatus
  publishedAt: string
  updatedAt: string
  breaking?: boolean
  featured?: boolean
  live?: boolean
  tags: string[]
  views: number
  body: ArticleBlock[]
}

export type StaticPage = {
  id: string
  slug: string
  title: string
  status: 'published' | 'draft'
  updatedAt: string
  inFooter: boolean
}

export type MediaAsset = {
  id: string
  file: string
  alt: string
  credit: string
  width: number
  height: number
  sizeKb: number
  uploadedAt: string
  usedIn: number
}

export const sections: Section[] = [
  { slug: 'world', name: 'World', description: 'International affairs, diplomacy and conflict.' },
  { slug: 'politics', name: 'Politics', description: 'Elections, policy and power.' },
  { slug: 'business', name: 'Business', description: 'Markets, companies and the economy.' },
  { slug: 'technology', name: 'Technology', description: 'The industry, the products and their consequences.' },
  { slug: 'science', name: 'Science', description: 'Discovery, space and the natural world.' },
  { slug: 'climate', name: 'Climate', description: 'The planet, weather and the energy transition.' },
  { slug: 'health', name: 'Health', description: 'Medicine, research and public health.' },
  { slug: 'sport', name: 'Sport', description: 'Results, analysis and the stories behind the game.' },
  { slug: 'culture', name: 'Culture', description: 'Arts, books, film and ideas.' },
  { slug: 'opinion', name: 'Opinion', description: 'Argument and analysis from our columnists.' },
]

export const authors: Author[] = [
  { id: 'a1', name: 'Helena Okafor', role: 'Diplomatic Correspondent', initials: 'HO' },
  { id: 'a2', name: 'Marcus Lindqvist', role: 'Economics Editor', initials: 'ML' },
  { id: 'a3', name: 'Priya Raman', role: 'Technology Reporter', initials: 'PR' },
  { id: 'a4', name: 'Tomás Herrera', role: 'Climate Correspondent', initials: 'TH' },
  { id: 'a5', name: 'Grace Whitfield', role: 'Political Editor', initials: 'GW' },
  { id: 'a6', name: 'Daniel Abara', role: 'Sports Writer', initials: 'DA' },
  { id: 'a7', name: 'Yuki Tanaka', role: 'Science Editor', initials: 'YT' },
  { id: 'a8', name: 'Ines Moreau', role: 'Culture Critic', initials: 'IM' },
]

const genericBody = (lead: string): ArticleBlock[] => [
  { type: 'p', text: lead },
  {
    type: 'p',
    text: 'Officials familiar with the discussions said the outcome had been far from certain even in the final hours, with negotiators trading drafts late into the night. Several described an atmosphere that shifted repeatedly between optimism and frustration.',
  },
  {
    type: 'p',
    text: 'The development follows months of quiet preparation, much of it conducted away from public view. Analysts said the timing reflected both domestic pressures and a narrowing window for agreement before the end of the year.',
  },
  { type: 'h2', text: 'What happens next' },
  {
    type: 'p',
    text: 'Implementation will now fall to a working group expected to report back within ninety days. Critics warn that the most difficult questions — on funding, oversight and enforcement — have been deferred rather than resolved.',
  },
  {
    type: 'quote',
    text: 'This is a beginning, not an ending. The hard work starts on Monday morning.',
    cite: 'A senior official involved in the talks',
  },
  {
    type: 'p',
    text: 'For those most directly affected, the details will matter more than the headlines. Community groups said they would be watching closely to see whether commitments made this week translate into change on the ground.',
  },
  {
    type: 'p',
    text: 'The Meridian will continue to follow the story as it develops. Readers can find our full coverage, including explainers and analysis, in the related section below.',
  },
]

export const articles: Article[] = [
  {
    id: 'n1',
    slug: 'coastal-nations-sign-landmark-ocean-accord',
    title: 'Coastal nations sign landmark accord to protect a third of the world’s oceans',
    dek: 'After a marathon final session in Lisbon, 61 governments commit to binding targets, a shared enforcement fund and the first independent monitoring body for the high seas.',
    section: 'world',
    authorId: 'a1',
    image: 'summit.png',
    imageCaption: 'Delegates arrive for the closing session of the summit on Saturday. Photograph: The Meridian',
    status: 'published',
    publishedAt: '2026-11-02T07:40:00Z',
    updatedAt: '2026-11-02T09:15:00Z',
    featured: true,
    breaking: true,
    live: true,
    tags: ['Oceans', 'Diplomacy', 'Climate'],
    views: 184320,
    body: genericBody(
      'Sixty-one coastal nations on Saturday signed what negotiators described as the most ambitious ocean protection agreement in a generation, committing to place 30 percent of their territorial waters and a share of the high seas under binding protection by 2035.',
    ),
  },
  {
    id: 'n2',
    slug: 'markets-slide-as-rate-fears-return',
    title: 'Global markets slide as rate fears return to trading floors',
    dek: 'Bond yields climbed for a fourth straight session as investors priced in fewer cuts next year.',
    section: 'business',
    authorId: 'a2',
    image: 'markets.png',
    imageCaption: 'Traders on the exchange floor on Friday afternoon.',
    status: 'published',
    publishedAt: '2026-11-02T06:10:00Z',
    updatedAt: '2026-11-02T06:10:00Z',
    breaking: true,
    tags: ['Markets', 'Interest rates'],
    views: 96211,
    body: genericBody(
      'Stock markets fell sharply across Europe and Asia on Monday as a fresh run of strong economic data revived fears that central banks will keep interest rates higher for longer than investors had hoped.',
    ),
  },
  {
    id: 'n3',
    slug: 'storm-surge-leaves-thousands-displaced',
    title: 'Storm surge leaves thousands displaced along the southern coast',
    dek: 'Rescue crews worked through the night as flood waters reached record levels in three provinces.',
    section: 'climate',
    authorId: 'a4',
    image: 'storm.png',
    imageCaption: 'Emergency workers wade through a flooded street at dusk.',
    status: 'published',
    publishedAt: '2026-11-01T22:30:00Z',
    updatedAt: '2026-11-02T05:00:00Z',
    featured: true,
    tags: ['Extreme weather', 'Flooding'],
    views: 142087,
    body: genericBody(
      'Thousands of residents spent the night in temporary shelters after a powerful storm surge swept through low-lying towns along the southern coast, flooding homes and cutting power to more than 200,000 households.',
    ),
  },
  {
    id: 'n4',
    slug: 'chipmakers-race-to-build-new-fabs',
    title: 'Inside the race to build the next generation of chip factories',
    dek: 'A $40bn wave of construction is reshaping towns that never expected to be at the centre of the global economy.',
    section: 'technology',
    authorId: 'a3',
    image: 'tech.png',
    imageCaption: 'Engineers inside a semiconductor cleanroom.',
    status: 'published',
    publishedAt: '2026-11-01T15:00:00Z',
    updatedAt: '2026-11-01T15:00:00Z',
    featured: true,
    tags: ['Semiconductors', 'Industry'],
    views: 58734,
    body: genericBody(
      'On a stretch of former farmland two hours from the nearest major city, cranes now outnumber trees. The site will soon house one of the most advanced semiconductor fabrication plants ever built.',
    ),
  },
  {
    id: 'n5',
    slug: 'turnout-surges-in-early-voting',
    title: 'Turnout surges in early voting as campaign enters final week',
    dek: 'Record numbers cast ballots on the first weekend, with younger voters showing up in force.',
    section: 'politics',
    authorId: 'a5',
    image: 'election.png',
    imageCaption: 'Voters queue outside a polling station on Sunday morning.',
    status: 'published',
    publishedAt: '2026-11-01T12:20:00Z',
    updatedAt: '2026-11-01T18:45:00Z',
    tags: ['Elections'],
    views: 77420,
    body: genericBody(
      'More than four million people cast early ballots over the weekend, election officials said on Sunday, a record that both main parties claimed as evidence of momentum heading into the final week of the campaign.',
    ),
  },
  {
    id: 'n6',
    slug: 'late-winner-sends-city-top-of-the-table',
    title: 'Stoppage-time winner sends City to the top of the table',
    dek: 'A breathless finale under the lights ends a run of three matches without a win.',
    section: 'sport',
    authorId: 'a6',
    image: 'football.png',
    imageCaption: 'The decisive moment in the 94th minute.',
    status: 'published',
    publishedAt: '2026-11-01T21:55:00Z',
    updatedAt: '2026-11-01T21:55:00Z',
    tags: ['Football'],
    views: 65302,
    body: genericBody(
      'For ninety minutes it looked as though City’s wait for a win would stretch to a fourth match. Then, with the clock showing 93:41, the ball fell kindly in the area and the stadium erupted.',
    ),
  },
  {
    id: 'n7',
    slug: 'new-blood-test-detects-cancers-earlier',
    title: 'New blood test detects several cancers years earlier, trial finds',
    dek: 'Researchers caution that wider studies are needed before the test can be used routinely.',
    section: 'health',
    authorId: 'a7',
    image: 'health.png',
    imageCaption: 'A researcher examines a sample in the laboratory.',
    status: 'published',
    publishedAt: '2026-10-31T09:00:00Z',
    updatedAt: '2026-10-31T09:00:00Z',
    tags: ['Cancer', 'Research'],
    views: 88912,
    body: genericBody(
      'A simple blood test was able to detect signs of eleven types of cancer up to four years before diagnosis in a large clinical trial, researchers reported on Friday.',
    ),
  },
  {
    id: 'n8',
    slug: 'retrospective-redefines-abstract-painting',
    title: 'The retrospective that asks us to look at abstract painting again',
    dek: 'Six decades of work, one vast room and an argument about what we owe to difficult art.',
    section: 'culture',
    authorId: 'a8',
    image: 'culture.png',
    imageCaption: 'Visitors at the opening night of the exhibition.',
    status: 'published',
    publishedAt: '2026-10-31T17:30:00Z',
    updatedAt: '2026-10-31T17:30:00Z',
    tags: ['Art', 'Exhibitions'],
    views: 21455,
    body: genericBody(
      'The first thing you notice is the scale. The second is the silence — the way a room full of people falls quiet in front of a canvas that, at first glance, appears to contain almost nothing at all.',
    ),
  },
  {
    id: 'n9',
    slug: 'private-rocket-reaches-orbit-on-first-try',
    title: 'Private rocket reaches orbit on its first attempt',
    dek: 'The launch marks the first orbital success for a European start-up.',
    section: 'science',
    authorId: 'a7',
    image: 'science.png',
    imageCaption: 'The rocket lifts off at dawn.',
    status: 'published',
    publishedAt: '2026-10-30T06:45:00Z',
    updatedAt: '2026-10-30T06:45:00Z',
    tags: ['Space'],
    views: 47009,
    body: genericBody(
      'A rocket built by a company that did not exist six years ago reached orbit on its maiden flight early on Thursday, a rare first-attempt success in an industry where early failures are expected.',
    ),
  },
  {
    id: 'n10',
    slug: 'new-rail-line-transforms-commutes',
    title: 'A new rail line is quietly transforming how a city gets to work',
    dek: 'Six months in, journey times have halved for some of the capital’s poorest districts.',
    section: 'business',
    authorId: 'a2',
    image: 'city.png',
    imageCaption: 'The new elevated line crosses the eastern districts.',
    status: 'published',
    publishedAt: '2026-10-29T08:00:00Z',
    updatedAt: '2026-10-29T08:00:00Z',
    tags: ['Infrastructure', 'Cities'],
    views: 33190,
    body: genericBody(
      'Six months after its opening, the city’s newest rail line is carrying more passengers than planners projected for its fifth year — and changing daily life in neighbourhoods long cut off from the centre.',
    ),
  },
  {
    id: 'n11',
    slug: 'drought-forces-hard-choices-for-farmers',
    title: 'Third year of drought forces hard choices for grain farmers',
    dek: 'Yields are down by a quarter and many families are weighing whether to plant at all.',
    section: 'climate',
    authorId: 'a4',
    image: 'farm.png',
    imageCaption: 'Cracked soil in a wheat field in the central plains.',
    status: 'published',
    publishedAt: '2026-10-28T10:15:00Z',
    updatedAt: '2026-10-28T10:15:00Z',
    tags: ['Agriculture', 'Drought'],
    views: 29871,
    body: genericBody(
      'Standing at the edge of a field that should, by now, be green, the farmer crouches and runs a hand across ground split into plates by the sun.',
    ),
  },
  {
    id: 'n12',
    slug: 'parliament-needs-to-rediscover-the-art-of-compromise',
    title: 'Parliament needs to rediscover the lost art of compromise',
    dek: 'The chamber has never been louder. It has rarely achieved less.',
    section: 'opinion',
    authorId: 'a5',
    image: 'opinion.png',
    imageCaption: 'The empty chamber before Tuesday’s session.',
    status: 'published',
    publishedAt: '2026-11-01T07:00:00Z',
    updatedAt: '2026-11-01T07:00:00Z',
    tags: ['Opinion', 'Parliament'],
    views: 41200,
    body: genericBody(
      'There was a time, not so long ago, when a good day in parliament was one in which both sides left the chamber slightly disappointed. That was the sign that something had been agreed.',
    ),
  },
  {
    id: 'n13',
    slug: 'budget-preview-what-to-expect',
    title: 'Budget preview: the five numbers that will define the week',
    dek: 'From the deficit to the defence pledge, what to watch for on Wednesday.',
    section: 'politics',
    authorId: 'a2',
    image: 'markets.png',
    imageCaption: 'Treasury officials prepare the documents.',
    status: 'scheduled',
    publishedAt: '2026-11-04T06:00:00Z',
    updatedAt: '2026-11-02T08:20:00Z',
    tags: ['Budget'],
    views: 0,
    body: genericBody('Wednesday’s budget will be judged on five numbers.'),
  },
  {
    id: 'n14',
    slug: 'ai-regulation-draft-leaked',
    title: 'Leaked draft shows sweeping new rules for AI developers',
    dek: 'Companies would face audits before releasing their most capable systems.',
    section: 'technology',
    authorId: 'a3',
    image: 'tech.png',
    imageCaption: 'Server racks in a data centre.',
    status: 'review',
    publishedAt: '2026-11-02T12:00:00Z',
    updatedAt: '2026-11-02T09:02:00Z',
    tags: ['AI', 'Regulation'],
    views: 0,
    body: genericBody('A leaked draft of the regulation, seen by The Meridian, would require audits.'),
  },
  {
    id: 'n15',
    slug: 'derby-day-preview',
    title: 'Derby day: five battles that will decide Sunday’s clash',
    dek: 'Form, fitness and a little history.',
    section: 'sport',
    authorId: 'a6',
    image: 'football.png',
    imageCaption: 'Training ahead of the derby.',
    status: 'draft',
    publishedAt: '2026-11-07T10:00:00Z',
    updatedAt: '2026-11-01T16:40:00Z',
    tags: ['Football'],
    views: 0,
    body: genericBody('Few fixtures carry the weight of this one.'),
  },
  {
    id: 'n16',
    slug: 'reef-survey-results',
    title: 'Reef survey finds unexpected signs of recovery',
    dek: 'Divers recorded coral regrowth at sites written off a decade ago.',
    section: 'science',
    authorId: 'a7',
    image: 'storm.png',
    imageCaption: 'The survey team prepares to dive.',
    status: 'scheduled',
    publishedAt: '2026-11-03T05:30:00Z',
    updatedAt: '2026-11-01T11:00:00Z',
    tags: ['Oceans'],
    views: 0,
    body: genericBody('Divers returned from the outer reef with unexpected news.'),
  },
]

export const pages: StaticPage[] = [
  { id: 'p1', slug: 'about', title: 'About The Meridian', status: 'published', updatedAt: '2026-09-12T10:00:00Z', inFooter: true },
  { id: 'p2', slug: 'editorial-standards', title: 'Editorial standards', status: 'published', updatedAt: '2026-08-03T10:00:00Z', inFooter: true },
  { id: 'p3', slug: 'contact', title: 'Contact the newsroom', status: 'published', updatedAt: '2026-10-01T10:00:00Z', inFooter: true },
  { id: 'p4', slug: 'corrections', title: 'Corrections & clarifications', status: 'published', updatedAt: '2026-10-28T10:00:00Z', inFooter: true },
  { id: 'p5', slug: 'privacy', title: 'Privacy policy', status: 'published', updatedAt: '2026-06-20T10:00:00Z', inFooter: true },
  { id: 'p6', slug: 'careers', title: 'Work with us', status: 'draft', updatedAt: '2026-10-30T10:00:00Z', inFooter: false },
]

export const media: MediaAsset[] = [
  { id: 'm1', file: 'summit.png', alt: 'Delegates walk through a colonnade as photographers look on', credit: 'The Meridian', width: 1376, height: 768, sizeKb: 1946, uploadedAt: '2026-11-02T07:12:00Z', usedIn: 1 },
  { id: 'm2', file: 'markets.png', alt: 'Traders watch market screens', credit: 'The Meridian', width: 1376, height: 768, sizeKb: 1894, uploadedAt: '2026-11-02T05:50:00Z', usedIn: 2 },
  { id: 'm3', file: 'storm.png', alt: 'Rescue workers in a flooded street', credit: 'Agency pool', width: 1376, height: 768, sizeKb: 2003, uploadedAt: '2026-11-01T22:05:00Z', usedIn: 2 },
  { id: 'm4', file: 'tech.png', alt: 'Engineers inside a chip cleanroom', credit: 'The Meridian', width: 1376, height: 768, sizeKb: 1863, uploadedAt: '2026-11-01T13:40:00Z', usedIn: 2 },
  { id: 'm5', file: 'election.png', alt: 'Voters queue outside a polling station', credit: 'The Meridian', width: 1376, height: 768, sizeKb: 2142, uploadedAt: '2026-11-01T11:00:00Z', usedIn: 1 },
  { id: 'm6', file: 'football.png', alt: 'Player celebrates a goal in a floodlit stadium', credit: 'Sports desk', width: 1376, height: 768, sizeKb: 1897, uploadedAt: '2026-11-01T21:50:00Z', usedIn: 2 },
  { id: 'm7', file: 'health.png', alt: 'Researcher holds a vial to the light', credit: 'The Meridian', width: 1376, height: 768, sizeKb: 1642, uploadedAt: '2026-10-31T08:30:00Z', usedIn: 1 },
  { id: 'm8', file: 'culture.png', alt: 'Visitors in front of a large abstract painting', credit: 'The Meridian', width: 1376, height: 768, sizeKb: 1697, uploadedAt: '2026-10-31T16:00:00Z', usedIn: 1 },
  { id: 'm9', file: 'science.png', alt: 'Rocket launch at dawn', credit: 'Agency pool', width: 1376, height: 768, sizeKb: 1624, uploadedAt: '2026-10-30T06:00:00Z', usedIn: 1 },
  { id: 'm10', file: 'city.png', alt: 'Aerial view of a city with a new rail line', credit: 'The Meridian', width: 1376, height: 768, sizeKb: 2326, uploadedAt: '2026-10-29T07:30:00Z', usedIn: 1 },
  { id: 'm11', file: 'farm.png', alt: 'Farmer inspects cracked soil', credit: 'The Meridian', width: 1376, height: 768, sizeKb: 2152, uploadedAt: '2026-10-28T09:50:00Z', usedIn: 1 },
  { id: 'm12', file: 'opinion.png', alt: 'Empty parliamentary chamber', credit: 'The Meridian', width: 1376, height: 768, sizeKb: 1975, uploadedAt: '2026-10-31T19:00:00Z', usedIn: 1 },
]

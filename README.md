# Win-Win Business Solutions — website

Marketing site for **Win-Win Business Solutions** (Madurai), the back office for Win-Win Management Consultants, Singapore.

Built with React 19, TypeScript, Vite, Tailwind CSS and Framer Motion (lazy-loaded).
The design language follows heymeco.xyz: Newsreader display type, Hanken Grotesk body, DM Mono labels, sky-wash heroes, stippled clouds and grain-textured cards, in the blues of the Win-Win logo.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # type-checks, builds to dist/ and copies index.html → 404.html
npm run preview    # serve the production build
```

## Project layout

```
src/
  content/site.ts         All copy: company details, services, FAQs, journey stages, careers…
  pages/                  One file per route (Home ships in the main bundle, the rest are lazy)
  components/
    layout/               Header (full-screen menu), Footer, Layout, MobileContactBar, ScrollProgress
    ui/                   Reusable building blocks: Logo, Reveal, SectionIntro, PageHero, Faq, CtaBand
    motion/               Animated graphics (see below)
  hooks/                  useTheme, useSeo, useLoop, useLiveClock
  lib/
    perf.tsx              Automatic performance tiers
    geo.ts                Coastline data for the dot-matrix map
    motionFeatures.ts     Framer Motion features, loaded after first paint
    ease.ts               Shared easing curves
```

To change wording, edit `src/content/site.ts`; layouts read from it.

## Motion graphics

| Component | Where | What it does |
| --- | --- | --- |
| `WorkingPaper` | Home hero | Reconciliation fills in, a checker scan line sweeps and draws ticks row by row, open item highlighted, floating callouts, pointer tilt |
| `FileJourney` | Home | Pinned 5-stage scroll story: files fly in → figures type in → ticked → open item flagged → stamped and signed off in Singapore, with leader-line callouts and a stage counter |
| `RouteMap` | Home, About | Dot-matrix map of South India → Singapore; documents travel out, review notes travel back; live IST / SGT clocks |
| `ReviewOrbit` | Team | One clock drives the orbiting file, trailing arc, lit role and centre caption |
| `GrowthPath` | Careers | Staircase drawn by scroll with a rider dot on the line tip, milestones and a flag |
| `WordReveal` | About | Statement whose words light up as you scroll |
| `RisingChart` | Services | Logo-style bars rise and the arrow draws (hover to replay) |
| `ServiceGlyph` | Home, Services | Line-art illustration per service that draws itself |
| `Clouds`, `Squiggle`, `CountUp`, `ScrollCue`, `ScrollRail`, `SentGraphic`, `BalanceScale` | Throughout | Hero clouds, hand-drawn underline, count-ups, "keep scrolling" cues, contact success, 404 |

Scroll-driven sections show a "Keep scrolling" or "Scroll to…" cue so visitors know to scroll.

## Performance and low-end devices

`lib/perf.tsx` picks a tier once per session:

- **lite** when the visitor prefers reduced motion, has Save-Data on or a 2G connection, has ≤ 2 GB memory or ≤ 2 CPU cores, fails a ~2 ms CPU micro-benchmark (more than about 3.5× slower than a laptop), or renders the intro below about 38 fps.
- **full** otherwise.

The lite tier keeps all content and the scroll-driven stories. It removes idle loops, springs, pointer tilt and backdrop blur. Under reduced motion everything renders still.

Other measures:
- Idle animations pause when off-screen (`useLoop`).
- Framer Motion's feature bundle loads after first paint (`LazyMotion strict`).
- Routes are code-split.
- Below-the-fold blocks use `content-visibility`.
- The map's ~700 land dots render as a single SVG path.
- The logo is 4 KB WebP.

You can force a tier with `?perf=lite` or `?perf=full`.

## Responsive behaviour

- **Phones:** decorative panels, secondary copy (such as "Why it matters", the full address and extra list items) and callouts are hidden. A quick-contact bar for Call, WhatsApp and Enquire stays pinned to the bottom.
- **Tablets and desktop:** the full illustrations show.

## Accessibility

- Skip link, semantic landmarks and one `h1` per page.
- Labelled form fields.
- The full-screen menu traps focus, makes the page behind it `inert`, closes on Esc and returns focus to the Menu button.
- Light and dark themes follow the OS until the visitor picks one, and are applied before first paint.

## Deploying

The site is a static SPA, so serve `dist/`:

- **Vercel:** `vercel.json` rewrites all routes to `index.html`.
- **Netlify:** `public/_redirects` does the same.
- **GitHub Pages and similar hosts:** `dist/404.html` is a copy of `index.html`.

The contact form doesn't need a backend. It opens a pre-filled email to `admin@win-win.com.in`.

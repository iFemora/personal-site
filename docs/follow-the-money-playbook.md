# Follow the Money — build playbook

How to pick this project up cold and continue it the way it has been
built. Read this first, then `docs/anatomy-log.md` (the dated decision
log — every scope call, feedback round, and lesson, written as it
happened; the eventual /work case study gets written FROM that log).

## What this is

Femi's product proof: one concept taken from idea to production solo,
documented and instrumented so it generates its own case study. The
product is an interactive explanation of card payments at
`/follow-the-money` (named by Femi; permanent redirect from the old
`/anatomy`; listed in the nav under the "Knowledge" umbrella since
2026-09-30, after a spell unlisted from 2026-09-27; see the log). Three audiences,
named by Femi (2026-08-06) and all first-class: people who carry cards
(learn how money moves), small merchants (what integrating actually
costs and means), and payments professionals (the competence signal).
The standard is education done properly, beautifully, in the site's
design language. The page opens by naming the three seats and hands the
reader one question to carry through every act: where is the money
right now, and who is on the hook if this step fails?

Inspiration benchmark is Siddiqui's *The Anatomy of the Swipe*.
**Hard rule: recreate the territory, never the book.** All copy is
original wording of industry facts Femi knows professionally. Zero
reuse of the book's text, examples, or characters. The outro carries a
courteous further-reading credit.

## The working pattern (this is the part to preserve)

1. **Small release → Femi plays it on his phone → feedback → fix →
   next act.** Never batch. His feedback arrives as voice notes;
   quote the sharp lines verbatim into the log.
2. **Every scope decision is his, on the record.** Offer a strawman,
   let him redline. Refusals (what v1 will NOT do) are logged — the
   cuts are the PM evidence.
3. **All copy ships as DRAFT.** Flag it every time. He does the voice
   pass; never assume a sentence is his. House copy rules: minimize
   em-dashes, never "throughline".
4. **A push is not a release.** After `git push`, confirm a Vercel
   deployment exists and reaches READY (Vercel MCP `list_deployments`,
   projectId in `.vercel/project.json`), then `curl` the production
   page and grep for a marker string from the new build before telling
   Femi anything is live. This rule exists because a webhook once
   missed a push and he tested a build that never shipped.
5. **Instrument everything from first deploy** through
   `src/lib/anatomyTrack.ts` only (one union of event names). The
   funnel decides what gets built next. Success metric: still TBD
   with Femi — pin it before any public announcement.
6. **Smoothness bar** (his words: like the About page): declarative
   keyframe animations with `times` arrays, never per-frame React
   state; clocks live in their own tiny components ("islands") so
   ticks re-render nothing else; schedules are `setTimeout`-owned so
   backgrounded tabs can't freeze a run; status text crossfades;
   traversed rails stay lit (monotonic trails); action buttons have
   NO exit animations (a stale exiting button once ate taps and
   double-advanced state — guard advances by checking the current
   tail, see DisputeCase `tailRef`).
7. **Geometry must be exact.** Rails run actor-center to actor-center
   through the glyphs' vertical middle (desktop centers: 12.5/37.5/
   62.5/87.5% for four stops; 10..90% for five). Femi catches
   single-digit-pixel misalignment from screenshots. Never space
   columns with flex `gap` (it shifts centers off the rail marks);
   pad inside columns instead.
8. **Mobile first.** Every rail has a vertical layout; he tests phone
   first. iOS audio only starts inside a touch — warm the
   AudioContext in the tap handler (see `useBeep`), and know the
   ring/silent switch mutes web audio regardless.

## The three grammars (choose per act)

- **Watchable journey** (Act I stage): a run you trigger and watch —
  rail, travelling pulse, lit trail, live clock. Default is "story
  pace": the pulse dwells ~2 s per actor so statuses are readable,
  while the ms clock advances through the TRUE milliseconds for that
  stop via a piecewise wall→sim mapping (see `TIMELINES` in
  PaymentStage). Real time (1.8 s) stays one tap away. Insight that
  forced this: no uniform slowdown makes a 150 ms terminal readable.
- **Playable time-compression** (Act II night): press play, hours
  compress to seconds, scenes light and stay lit, wall clock rolls
  past midnight. Femi called this one "genuinely good".
- **Case file** (Act III dispute): an argument you sit inside, not a
  journey you watch. User-paced filings attributed to actors, the
  reader makes the branching calls, three endings, and a sticky
  ledger always showing whose money it is right now. User-paced =
  smooth by construction.

Depth-on-demand rides the stage: every actor has a "go deeper +" door
(content in `src/lib/anatomyDepth.ts`, one open at a time, opens are
funnel events telling us where curiosity goes).

## File map

- `src/app/follow-the-money/page.tsx` — the page: hero, sections 01–06,
  outro with credit. Section copy and the seat takeaways live here.
- `src/app/follow-the-money/opengraph-image.tsx` — the page's share
  card (banknote green); the simulator route inherits it.
- `src/components/anatomy/PaymentStage.tsx` — Act I stage (scenarios,
  card, rail, timelines, sound, doors, verdict).
- `src/components/anatomy/SettlementTimeline.tsx` — Act II night
  player (desktop rail breathes to 880px; mobile approved as-is).
- `src/components/anatomy/DisputeCase.tsx` — Act III case file. FOUR
  cases since 2026-08-02 (fraud, non-delivery, cancelled subscription,
  duplicate charge) in a `CASES` array; each carries its own steps
  graph (branch via `choice.options[].to`), amount, and closing coda.
  A picker opens the act; endings offer rerun or switch-case.
- `src/components/anatomy/CardBuild.tsx` — Act IV build sheet (release
  one, 2026-10-02): company pills, the four seats with doors, the
  funding strip. Content in `src/lib/cardBuild.ts`.
- `src/components/anatomy/IssuerReplay.tsx` — Act IV release two
  (2026-10-03): the issuer stop opened into processor, program, books;
  path and clock follow the card built above. Release three's ending
  (`ENDINGS` in `cardBuild.ts`) is the sheet's fifth step.
- `src/lib/program-economics.ts` + `src/components/anatomy/ProgramSimulator.tsx`
  + `src/app/follow-the-money/simulator/page.tsx` — the card program
  simulator (2026-10-03), a route of its own linked from the end of
  act five. The model has no React in it; the view has no formulas.
- `src/lib/anatomyDepth.ts` — go-deeper chapters per actor.
- `src/lib/anatomyTrack.ts` — the only place event names exist.
- `src/components/anatomy/ChapterMark.tsx` — in-view funnel beacons.
- Touchpoints elsewhere: the Knowledge umbrella's two rooms in
  `Nav.tsx` (`items` array: Follow the Money and Build a Card Program,
  the simulator; only the deepest matching room lights); accent
  mapping in
  `AccentController.tsx` (`money`: banknote green `#2e6b47` /
  `#8fcfa5` in tokens.css, with a hue per guest palette in
  palettes.css, since 2026-10-01; the audit covers it); redirect in
  `next.config.ts`; `sitemap.ts`; sticky header in `layout.tsx`
  (sitewide, `bg-background/85` + blur — the dispute ledger sticks
  just beneath it at `top-[72px]/[76px]`).

## Status and what's next

Done: Acts I–III live and verified in production; named; in the nav
(under Knowledge since 2026-09-30);
sticky nav sitewide; funnel armed; Act III expanded to four dispute
cases (2026-08-02); three-audience framing, question-led act intros,
and the three-seat economics takeaways (2026-08-06, from external
accessibility-PM feedback — quotes in the log); site-wide WCAG 2.2 AA
contrast baseline (`npm run audit:contrast`, docs/accessibility.md).

Open, roughly in order:
1. **Femi's voice pass** over all copy (Act III most sensitive; the
   2026-08-06 orientation + seat-takeaway copy is DRAFT too).
2. **Act IV — before the tap**: scoped with Femi 2026-10-02 (see the
   log). All three releases are live (the build sheet, the issuer stop
   opened on its own rail, the who-is-on-the-hook ending with the seat
   takeaways and the share card). Industry mechanism only, never "the
   chapter I built". **Act V is the card program simulator** (Femi,
   2026-10-03): section 06 on the page, the sheet at
   `/follow-the-money/simulator`.
3. Success metric (before announcing), OG image so links unfurl,
   home-page teaser, first funnel review (which doors get opened,
   where the chapter drop-off is). The page's own accent shipped
   2026-10-01.

Related but separate: the Wall of Love waitlist experiment is parked
until the wall reaches ~30 voices (he has ~40 contributors pending).

## Resume checklist

1. Read this file, then skim `docs/anatomy-log.md` tail.
2. `npm run lint && npx tsc --noEmit && npx next build`.
3. Open `/follow-the-money` via `preview_start`, run one story-pace
   payment, play the night, walk the dispute (4 Continues to the
   merchant fork).
4. Build the next increment small; log decisions with dates; ship;
   verify the deployment and the production HTML; then tell Femi.

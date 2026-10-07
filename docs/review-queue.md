# Review queue

Everything on the site that was drafted or decided on Femi's behalf and
still needs his eyes, in one place. Sessions append here instead of
scattering asks across chat. Resolve a line by editing the thing, then
delete the line. Dated on entry.

Format: **what** · where · how to resolve.

## Copy drafted in Femi's voice (2026-09-30, PM audit phases 0–2)

- **CV seeking sentence.** "I am now open to Solutions Architect,
  Customer Success, and Product leadership roles, in Vancouver or
  remote across Canada." · `src/app/cv/page.tsx`, Summary · rewrite or
  keep.
- **CV Marqeta bullets recast in past tense.** In particular "Led
  Resolve's credit expansion across FCRA disputes…" (was "Leading"):
  if that work had not shipped when the role ended, "Scoped" or
  "Started" is truer · `src/app/cv/page.tsx` · confirm each verb.
- **Hero pill and CTA wording.** "Open to new roles" and "Book an
  intro" are the audit's words · `src/app/page.tsx`,
  `src/components/BookIntroLink.tsx` · keep or reword.
- **Meta description.** "Femi Siji-Kenneth is a product leader open
  to Solutions Architect, Customer Success, and Product roles.
  Vancouver + remote Canada." · `src/app/layout.tsx` (three places)
  · keep or reword.
- **Resolve case study tense.** Eyebrow "Marqeta · 2025 – 2026";
  standfirst "…and expanded it in small releases after that"; "four
  product areas I carried" · `src/app/work/resolve/page.tsx`.
- **Knowledge dropdown note.** "More soon" · `src/components/Nav.tsx`.
- **"How I decide" intro (2026-09-30, Femi's ask).** Now reads "These
  are the principles I decide by, formed in product work and used well
  beyond it: when time is short, the roadmap is crowded, or the
  evidence changes the plan." His fallback if this still feels
  ambiguous: "These are the product principles I use when time is
  short…" · `src/app/page.tsx` · keep, or swap to the fallback.
- **Case study testimonial section.** Label "In their words", link
  "More on the wall of love →" · `src/components/CaseStudy.tsx`.
- **Colophon Build sentence.** "…a design-system package inside the
  same repository, so the site and its system move together" ·
  `src/app/colophon/page.tsx`.

## Essays as imported from Substack (2026-09-30)

- **The Wrong Scoreboard** keeps its closing sign-off ("Femi
  Siji-Kenneth writes about product, culture, tennis…") ·
  `content/writing/2026-04-09-the-wrong-scoreboard.mdx` · keep on-site
  or cut.
- **Go Fetch** says "I am a Lead Product Manager at a publicly traded
  fintech company", true when written · `content/writing/2026-03-01-go-fetch.mdx`
  · leave as a dated piece, or add a one-line note.
- **Plentywaka** (2019, the Medium-era piece) is now the oldest
  on-site entry · `content/writing/2019-09-23-plentywaka.mdx` ·
  happy with it here, or `homepageHidden: true`, or remove.
- **Making Sense at the Edges** opens with a Wikimedia photo; the
  photographer credit survived in the caption but the CC BY-SA licence
  link was an empty image link and got stripped ·
  `content/writing/2025-08-01-making-sense-at-the-edges.mdx` · add the
  licence link back if you want it explicit.
- **Substack canonical.** Substack has no canonical-URL setting, so
  both copies coexist. If you care, add "Originally published at
  ifemora.dev/writing/…" to each Substack post · on Substack, not here.

## Decisions that are Femi's (2026-09-30)

- **Tennis / notes cadence.** Counter is hidden below three entries;
  nothing else changed. Commit to a rhythm or don't · no code needed
  either way.
- **Morakinyo Adejare on the corporate-banking case study.** He is
  Lead Product Designer at FCMB, but the wall says you know him from
  NUTM; confirm he was on that work or swap the quote ·
  `src/app/work/corporate-banking/page.tsx`.
- **A Marqeta voice for Resolve.** The case study has no testimonial
  because nobody from Marqeta is on the wall. Ask one colleague to
  fill the form · then add a `voices` entry in
  `src/app/work/resolve/page.tsx`.
- **Follow the Money, still open from the playbook.** Voice pass over
  all copy (Act III most sensitive), Act IV (where cards come from),
  the page's own accent (touches locked tokens + 8 palettes), a
  success metric before any announcement ·
  `docs/follow-the-money-playbook.md`.
- **GA4.** New events `book_intro_click` and `nav_knowledge_open` now
  fire; the 12 custom dimensions are still pending in GA4 Admin
  (property G-1Z3809BM26) · GA4 Admin, not code.
- **Google Calendar "Meet with Femi".** Check the schedule's timezone
  and hours after the Vancouver move · Google Calendar settings.
- **The audit file.** `ifemora-dev-pm-audit-roadmap.md` lives in
  ~/Downloads. Move it into `docs/` if you want future sessions to
  read it without being handed the file · your call, it is your
  auditor's document.

## Site audit (2026-10-01)

- **Full-site critique and roadmap.** The "Now" batch shipped
  2026-10-01 with drafted copy (below); "Next" and "Later" are the
  backlog · `docs/site-audit-2026-10-01.md` · read, reword, pick the
  next batch.
- **Hero positioning line.** "Product leader, ten years in payments and
  banking. Open to Solutions Architect, Customer Success and Product
  roles, in Vancouver or remote across Canada." The second sentence is
  `SEEKING_LINE` in `src/components/HireMe.tsx` and is reused in the
  hire-me block and the author card; change it once there ·
  `src/app/page.tsx`, `src/components/HireMe.tsx` · keep or reword.
- **Hire-me block copy.** Label "Open to new roles"; body "Twenty
  minutes on a call is the quickest way to find out whether the fit is
  real. The calendar link books straight into my week."; links "Read
  the CV →", "Email →" · `src/components/HireMe.tsx` · keep or reword.
- **Author card under essays and notes.** "Product leader, ten years in
  payments and banking." + `SEEKING_LINE`, link "The work →" ·
  `src/components/HireMe.tsx` (`compact`) · keep or reword.
- **Employer line under the home bio.** "Marqeta · Paystack, a Stripe
  company · FCMB · Farmcrowdy" · `src/app/page.tsx` `employers` · keep,
  reorder, or cut.
- **Home teaser metas** now carry the company ("FCMB · 2024–25",
  "Paystack · 2021–24", "Marqeta · 2025–26") · `src/app/page.tsx` ·
  confirm the Marqeta span reads right as "2025–26".
- **Work case 03 tense.** "Resolve was one of four areas I carried at
  Marqeta … were the others." · `src/app/work/page.tsx` · confirm.
- **Follow the Money outro.** "…in Lagos, Toronto and Vancouver. The
  two seconds have been my working life." (was "my day job") ·
  `src/app/follow-the-money/page.tsx` · keep or reword.
- **404 copy.** "Not here." / "The page moved, or never was. The rest
  of the site is." / "Looking for someone who builds products in
  payments and banking? That part is not lost." ·
  `src/app/not-found.tsx` · keep or reword.
- **Title tag and share card.** Default title "Femi Siji-Kenneth —
  Product leader, payments and banking"; OG card gains a mono line
  "Open to Solutions Architect · Customer Success · Product" ·
  `src/app/layout.tsx`, `src/app/opengraph-image.tsx` · keep or reword.
- **"What I'm looking for" (home section 04).** Three drafted lines:
  "The role: Solutions Architect, Customer Success, or Product." / "The
  place: a bank, an enterprise, or a payments company." / "The where:
  Vancouver, or remote across Canada.", each with a two-sentence body.
  The third body says "happy to keep eastern hours", an assumption ·
  `src/app/page.tsx` `seeking` · reword, cut, or confirm the hours line.
- **Constellation caption.** "21 beats, 1992 to Now. Hover a dot to read
  it; click to jump." · `src/components/motion/Constellation.tsx` · keep
  or reword.
- **CV "Print" link.** Beside "Download as PDF →" there is now a muted
  "Print" for people who want the browser dialog ·
  `src/components/PrintButton.tsx` · keep or drop.
- **Employer wordmarks** (home bio, /work): typographic marks in
  Fraunces with a note and role under each ("a Stripe company",
  "First City Monument Bank", "Techstars Toronto"; "Product, key
  accounts" for Paystack). Official logos were skipped on purpose: four
  brand systems never sit on one hairline cleanly, and the brand sites
  are unreachable from the cloud session · `src/components/EmployerStrip.tsx`
  · keep, reword the notes, or drop in SVGs if all four can match.
- **CV "In sixty seconds".** ₦70B monthly volume · 200,000+ clients ·
  5 PMs grown · 29 states, each with a one-line label, printed too ·
  `src/app/cv/page.tsx` `numbers` · confirm the four, reword labels.
- **Work page coda.** Entry 06 (this site) now reads "Coda" with
  smaller type; the index says "five projects, and this site" ·
  `src/app/work/page.tsx` · keep or restore the sixth number.
- **Follow the Money accent.** Banknote green, chosen without you;
  the playbook asked to confirm first and the "Later" batch was the
  confirmation · `packages/femora-ds/tokens.css`, `src/app/palettes.css`
  · live with it or pick another hue (swap hues, never steps).
- **Case-study share cards.** Five new OG images in slate teal with
  the case title and the eyebrow · `src/app/work/*/opengraph-image.tsx`
  · check one on LinkedIn's post inspector.
- **Act IV copy, all of it.** Section 05 intro ("Every card is a
  promise someone else keeps."), the four company lines, the four
  seats (role, "asks of you", and each go-deeper chapter), the five
  funding positions and their "for you" lines. Industry facts in my
  words; a few phrases are deliberately pointed ("a petrol station at
  midnight", "six-point type") · `src/lib/cardBuild.ts`,
  `src/app/follow-the-money/page.tsx` · voice pass, beat by beat.
- **Act IV release two copy.** The replay intro ("the machine that
  answers, the seat that is sometimes asked, and the book that
  remembers"), the stop lines per path, the two pills ("Your service
  answers in time" / "is too slow"), and the four verdict paragraphs ·
  `src/components/anatomy/IssuerReplay.tsx` `pathFor` · voice pass.
- **Branch protection on main.** CI runs but cannot block a red push.
  GitHub → Settings → Rules → Rulesets → New branch ruleset: target
  `main`, enable "Require status checks to pass" and pick `lint · types
  · build · contrast` and `smoke`; leave "Require a pull request" off so
  Pages CMS commits still land · GitHub settings · five clicks.
- **Simulator copy (2026-10-03).** The page hero ("Build a card program",
  "Five acts said how the money moves. This is what it costs to run the
  thing.", the intro paragraph), the control eyebrows, the three preset
  lines, the state lines, the six "who is on the hook" paragraphs and
  the lever phrases · `src/app/follow-the-money/simulator/page.tsx`,
  `src/lib/program-economics.ts` (`PRESETS`, `leverFor`, `hookFor`,
  `stateLine`), `ProgramSimulator.tsx` · voice pass.
- **Simulator presets and defaults.** Values are illustrative and mine;
  the neobank story carries $250,000 a month of fixed costs so that it
  sits underwater until the fee moves · `src/lib/program-economics.ts`
  `PRESETS`, `DEFAULTS` · tune from your own rate-card memory.
- **The link out of act five.** "The card is built. What it costs to run
  one, month by month, has a room of its own: build a card program." ·
  `src/app/follow-the-money/page.tsx` · keep or reword.
- **Act IV release three copy.** The five endings (three moments and a
  verdict each) and the three seat takeaways after the sheet ·
  `src/lib/cardBuild.ts` `ENDINGS`, `src/app/follow-the-money/page.tsx`
  · voice pass; the verdicts are the lines recruiters will quote.
- **Section 06 copy and the share card line.** "A card program is a
  business, not a feature.", the intro, "Six acts, playable" and the
  carried question on the card · `src/app/follow-the-money/page.tsx`,
  `src/app/follow-the-money/opengraph-image.tsx` · keep or reword.


## Compliance check against the "website fine" reel (2026-10-05)

- **Privacy disclosure.** GA4 and Vercel Analytics run on every page and
  nothing on the site says so; Google's Analytics terms require a
  posted privacy notice that names GA and its cookies · a short
  `/privacy` page (or a Colophon section) plus a footer link · decide
  whether you want the page, and whether GA should wait for consent
  (Quebec Law 25 / GDPR opt-in) or keep loading as it does.
- **Audio-only field notes need a text alternative (WCAG 1.2.1, level
  A).** Five of six voice memos have a body that can stand as the
  transcript; "there's no one way to do anything" (2026-07-01) has
  nothing · `content/field-notes.json`, `transcript` field · paste a
  transcript in your words, or a one-paragraph summary.

## Comparison with prashanthnimmagadda.vercel.app (2026-10-07)

- **Comparison doc.** Nine borrowable moves, ranked, with draft copy for
  the thesis line, five "decision" lines on Work and a capabilities
  strip; two bugs found on the way (Knowledge pages end without HireMe,
  home has no H2s) · `docs/comparison-prashanthnimmagadda-2026-10-07.md`
  · read, reword the drafts, pick the "Now" batch.
## Positioning pivot (2026-10-07, Femi's "yes" to the design-led framing)

- **The three lines.** `LEAD_LINE` "Product leader, ten years in payments
  and banking."; `THESIS_LINE` "I care most about how a product feels to
  use, and I carry the ledgers, APIs and operations underneath it
  myself."; `SEEKING_LINE` "Open to founding and senior product roles,
  Head of Product to Director, in Vancouver or remote across Canada." ·
  `src/components/HireMe.tsx` · reword once, every placement follows.
- **Hire-me two-audience paragraph.** "If you are a founder with a first
  product still to ship, I design it end to end and build the first
  version with your engineers. If you run product at a scale-up or a
  bank, I take the regulated, operationally heavy workflows and make them
  feel simple." · `src/components/HireMe.tsx` · keep or reword.
- **"What I'm looking for" lines 1 and 2.** "The role: a founding product
  seat, or a senior one." and "The place: where the detail is the
  product." with new bodies; line 3 unchanged · `src/app/page.tsx`
  `seeking` · keep or reword.
- **"How I decide" principle 04 body.** Now "…The screen is where that
  complexity is either absorbed or passed on to the person using it, and
  I would rather absorb it: fewer steps, plain words, the state of things
  always visible." · `src/app/page.tsx` · keep or reword.
- **CV header and summary.** Subtitle "Product Leader · Design-led
  Products on Complex, Regulated Systems"; summary gains "design the
  experience myself alongside the design team, carry the ledgers, APIs
  and operational detail underneath it"; seeking sentence recast to the
  new roles · `src/app/cv/page.tsx` · confirm, then the PDF regenerates
  with `npm run build && npm run cv:pdf`.
- **Meta description and share card.** "Femi Siji-Kenneth designs the
  product and builds the systems beneath it: payments, banking, regulated
  platforms. Open to founding and senior product roles, Vancouver or
  remote across Canada." and the OG line "Open to founding and senior
  product roles" · `src/app/layout.tsx`,
  `src/app/opengraph-image.tsx` · keep or reword.
- **Home proof strip.** "Under 5 months" (Resolve), ₦70B, 200,000+, 5 PMs
  under the hero; the CV keeps its four with 29 states · `src/lib/proof.ts`
  · confirm the four, or swap one for 29 states.
- **Nav dropdown notes.** Studio "Film, essays, photographs"; Knowledge
  "How card money moves, and what a program costs" · `src/components/Nav.tsx`.
- **Love search suggestions.** "kind, honest, curious or design", words
  that appear on the wall today · `src/components/WallOfLove.tsx`
  `SUGGESTIONS` · swap for words you would rather people find.
- **Resolve outcomes.** The Gemini spec claimed a >50% handling-time cut
  and zero missed deadlines; nothing on the site supports them, so they
  were not used. If any outcome is true and sayable, give the number and
  it goes into the case study and the proof strip ·
  `src/app/work/resolve/page.tsx`, `src/lib/proof.ts`.

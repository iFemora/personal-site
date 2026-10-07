# ifemora.dev vs prashanthnimmagadda.vercel.app (2026-10-07)

A mentor's comparison, written against the north star in CLAUDE.md:
three recruiter conversations a day. The other site belongs to
Prashanth Nimmagadda, a product manager positioning for AI product
roles. Different market, same job: get a stranger with a hiring budget
to book a call.

## Scope and limits

What was verified:

- ifemora.dev: source read, production build run, seven routes
  measured with Playwright at 1440px and 390px (load, transfer weight,
  LCP, word and link counts, CTA placement, heading structure).
- The other site: its text content as indexed by the search engine
  (the positioning line, experience summary, headline metrics, the four
  featured products and the one-line product thesis for each), plus
  the public footprint it links out to: an open-source repository with
  active dependency updates, an App Store developer page, Peerlist,
  Medium.

What was not verified: the other site's layout, typography, motion,
navigation, calls to action, performance, accessibility and mobile
behaviour. The cloud session's network policy blocks
prashanthnimmagadda.vercel.app, ifemora.dev, peerlist.io, medium.com
and tracxn.com. Add those hosts under Allowed domains in the
environment settings and a second pass can cover the rendered page.
Nothing below claims anything about his design.

One caution on sources: there is a second Prashanth Nimmagadda, CTO
of Setu, who dominates search results. Only the Birmingham MSc / AI PM
profile is the site owner. Nothing from the Setu profile is used here.

## The two sites in one paragraph each

**His.** One page, one thesis: "Product Manager building AI products,
agentic systems, and local-first AI tools." Then a credential sentence
("8 years of professional experience, 5 in product management, across
telco, fintech, consumer products, and AI systems"), two headline
metrics (a telco platform from 23M to 50M monthly active users in 18
months; AI screening workflows that cut recruitment time 40%), a
current-status line (completing an MSc in Business Analytics at
Birmingham), and four featured products, each with a one-line product
decision and a number: Synopse AI (co-founder, 5,000+ users, 25
countries, 10K articles a day in 10 languages, 42% weekly retention),
Lucid (multi-model chat, 18+ models; "users should not need to
understand model choice"), PRD Genie (open source, local-first, "70%
less PRD writing time"), Stillform (a concept; "personal AI should be
private, fast, useful, grounded in your own files"). A focus-areas list
in recruiter vocabulary closes it. Hosted on a vercel.app subdomain;
the site itself is not indexed under its own domain, the GitHub
profile README that mirrors it is.

**Yours.** A designed site with a real identity (Fraunces, the spiral,
hairlines, eight contrast-checked palettes, restrained motion), a
professional half (hero with availability pill and booking CTA, Work
with five case studies, a two-page CV with a generated PDF, a hire-me
block at the end of every professional page) and a personality half
(Studio, Writing, Notes, Gallery, Love, About timeline). Two
interactive pieces under Knowledge: Follow the Money and the card
program simulator. CI with lint, types, build, contrast audit and a
smoke test. JSON-LD, sitemap, canonicals, per-case-study share cards.

## Where ifemora.dev is ahead (keep all of it)

1. **A domain and an identity.** ifemora.dev vs a vercel.app subdomain.
   The spiral, the type, the palettes and the motion read as one hand.
   A recruiter remembers "the spiral site". Nobody remembers a subdomain.
2. **Conversion plumbing that is measured.** Booking CTA in the hero and
   at the end of Home, Work, CV and every case study; a compact author
   card under essays and notes; every placement passes a GA
   `link_location`. His indexed content shows no booking link and no
   availability statement at all (unverified on the rendered page).
3. **Depth of proof.** Five case studies built on decisions, "what v1
   left out", artifacts a hiring manager can forward, and voices from
   the Wall of Love quoted beside the claim they support. His products
   get a sentence and a number each.
4. **Social proof.** 23 voices on the wall, filterable, quoted back on
   four case studies. He has none visible.
5. **Interactive product proof.** Follow the Money and the simulator are
   a payments fluency test you pass in public. His equivalent is shipped
   software (see below), which is a different, also strong, kind.
6. **Search and share hygiene.** Sitemap, robots, canonicals, Person
   JSON-LD, OG cards per case study, a title tag with role keywords.
   His site returns nothing for a `site:` query.
7. **Engineering discipline a Solutions Architect candidate can point
   at.** Tokens declared once as light/dark pairs, a contrast audit in
   CI, a smoke test, an accessibility policy document, reduced-motion
   handling with a regression test.
8. **The personality half.** 99 gallery items, a sequenced series, the
   About constellation, essays, voice notes. This is what makes you
   memorable after the call, and it is the half most PM portfolios lack.

## What his site does that yours can use (ranked by effect on the metric)

### 1. A thesis line, not a status line

His first sentence says what he builds and for which market, in the
words of the job posts he wants: AI products, agentic systems,
local-first tools. Yours says "Product leader, ten years in payments
and banking" and then a status: open to these roles, in these places.
The status is right and should stay. What is missing is the thesis:
the one thing you believe about the work that a bank or a payments
company would hire you to do.

Your own material already contains it. "I go where the customers are,
stay with an idea until I understand it, then improve it in small
releases." That is a Solutions Architect's and a Customer Success
lead's sentence. It sits in section 01, below the fold.

Draft to react to (your words, not mine, are what ships):

> Product leader, ten years in payments and banking. I sit with the
> customer until the platform does what they need, then ship it in
> small releases.

Where: `src/app/page.tsx` hero line, `SEEKING_LINE` stays as the second
sentence. Effort: one line. Needs your voice.

### 2. Capability vocabulary in the language of the target role

He lists eight capability nouns ("RAG pipelines, multi-model
orchestration, agentic workflows, product analytics and growth
systems"). They are the terms recruiters type into LinkedIn search and
the terms an ATS matches. Your site's vocabulary is PM-shaped: tools on
the CV (Jira, Figma, Mixpanel), roles and outcomes on Work. For
Solutions Architect and Customer Success searches, the words that
matter are not there as nouns: solution design, API integration,
implementation and onboarding, enterprise rollout, program management,
card issuing, disputes operations, KYC/AML, SSO and federated identity,
PCI DSS audit logging, BPO transition. Every one of those is true of
your work and appears somewhere in a bullet. None appears as a label.

Where: a "Capabilities" strip on `/cv` above the tool groups, and the
same nouns in the CV meta description and the Work index intro.
Effort: an hour. Needs your confirmation of each noun.

### 3. One product decision per project, said in one line

"The core product decision: users should not need to understand model
choice for every task." That framing, one decision per product, is
the most PM-literate thing on his page. Your case studies contain
better decisions than that but the Work cards and the home teasers
lead with the achievement ("Built a corporate banking platform from
scratch"). The "How I decide" section already does decision-first with
an evidence link; the Work cards do not.

Where: a `decision` line on each entry in `src/app/work/page.tsx`
(mono eyebrow "The decision" under the title), drawn from the case
study's own text. Drafts to react to:

- Corporate banking: "Two markets, one surface; the complexity stays
  behind the product."
- Airline payments: "Turn a booking reference into an amount owed, and
  sell it to the industry as a room, not a cold call."
- Resolve: "Design beside the BPO agent, not from the ticket schema."
- Farmcrowdy: "Walk the 29 states before writing the roadmap."
- Product team: "Hire APMs and scope them up; the pipeline outlives
  the hire."

Effort: an afternoon. Needs your voice.

### 4. Shipped, usable software as proof

His strongest asset is that a recruiter can click into PRD Genie's
repository, see dependency bots keeping it alive, and use the thing.
There are apps under his name in the App Store. Your proof is
narrative plus two interactive pages. For Solutions Architect roles
specifically, visible code is the credential that separates "PM who
talks to engineers" from "PM who can read the integration".

You already have the material:

- This repository. The site is a case study in CI, design tokens,
  accessibility auditing, phone-publishing APIs and a design-system
  package. It is private. Repo visibility is already an open item from
  the 2026-10-01 audit; this is the argument for closing it.
- `@femora/design-system`. A public package with its own README is a
  thing a hiring manager can scroll.
- The simulator model (`src/lib/program-economics.ts`) is pure and
  documented; it could stand alone as a small open-source library with
  a README that explains interchange, program fees and break-even.
- The contrast audit and the CV PDF script are the kind of small tools
  people star.

Where: GitHub settings first (visibility, then the branch protection
already in the queue), then a "Built" line in the Work coda or a third
Knowledge room linking the repo, the package and the simulator model.
Effort: visibility is five clicks; a package README is an afternoon.

### 5. A GitHub profile README that mirrors the site

The only reason his content could be read from here is that his GitHub
profile README repeats the site word for word, and search engines index
GitHub. Yours has no profile README in the index. A `iFemora/iFemora`
README with the hero line, the four CV numbers, the three work teasers
and the booking link costs thirty minutes and gives recruiters who
search GitHub a second front door with the same words.

Also: add GitHub to the Person JSON-LD `sameAs` and the footer link
row once the repository is public.

### 6. A "Now" line

"Currently completing MSc Business Analytics at the University of
Birmingham." A present-tense sentence that says the person is in
motion. Yours has "From the desk", which the last audit flagged as
reading "nothing for two months" when the derived month ages. A "Now"
line in the hero caption or at the top of the desk, hand-written and
dated, does the same job as his and refreshes in one commit: what you
are building, what you are reading, who you are talking to.

Where: `src/app/page.tsx` caption under the photo, or a `now` field in
`content/desk.json`. Effort: fifteen minutes a month.

### 7. Breadth framing that a bank recruiter parses

"Across telco, fintech, consumer products, and AI systems" is a scan
line. Yours is "payments, banking, and agriculture". Agriculture is
true and it is the best story on the site, but to a bank recruiter it
reads as a detour. The Farmcrowdy work is also a 200,000-user mobile
product, a marketplace and field service. "Payments, banking, and
marketplaces" or "payments, banking, and mobile at scale" keeps the
truth and loses the pause. Your call; it is a highlighted phrase.

### 8. AI as a named theme, because it is true

His whole site is AI. Yours mentions Claude Code twice: a CV tool line
and the Work coda. Yet the CV holds "IVR improvements, including AI
agent management", "built the automated testing workflow exclusively
using Claude Code and Playwright", and the site itself was built end to
end in Claude Code. In 2026 "AI" is the second word a recruiter types
after the role. Do not AI-wash the positioning; do name the three
things in one place, ideally the capabilities strip from item 2, and
give the testing workflow a paragraph in the Resolve case study.

### 9. Trust statements as copy

PRD Genie's README states its privacy posture in plain words: no
telemetry, keys never written to disk. That is trust as a feature. Your
review queue already notes that GA4 and Vercel Analytics run with no
posted notice. A short `/privacy` page in house style, linked from the
footer, is both the compliance fix and a trust signal for the regulated
employers you want.

## What not to copy

- A subdomain. Keep the domain.
- Metrics without a how. "40% reduction in recruitment time" with no
  story is a claim; your "what v1 left out" sections are evidence.
- Keyword density. His positioning will date with the trend. Yours is
  built on ten years in one industry; specificity is the differentiator.
- One page. The personality half is what people remember; the fix is
  nav priority during the search, not amputation.
- No social proof, no booking link, no sitemap.

## Measurements (ifemora.dev, production build, 1440px unless noted)

| Route | Load | Words | Links | Booking CTAs | Page height |
|---|---|---|---|---|---|
| / | 990 ms | 706 | 37 | 2 | 5124 px |
| /work | 824 ms | 666 | 27 | 1 | 3954 px |
| /cv | 834 ms | 1198 | 22 | 2 | 5630 px |
| /about | 857 ms | 912 | 15 | 0 | 6306 px |
| /writing | 968 ms | 176 | 18 | 0 | 2259 px |
| /follow-the-money | 904 ms | 1755 | 15 | 0 | 8660 px |
| /love | 928 ms | 1911 | 14 | 0 | 6427 px |

Phone (390px), home: LCP 356 ms, no horizontal overflow, JS 722 KB
uncompressed, fonts 556 KB, CSS 74 KB. The CV loads 744 KB of fonts.
Both fine on broadband; the font weight is the one number to watch if
Core Web Vitals ever matter for ranking on the name.

Two findings from the run, both yours to fix now:

1. **Follow the Money and the simulator end with nothing.** `FooterClose`
   treats `/follow-the-money` as a professional route and hides the
   tennis ask, but neither page renders `HireMe`. Your product proof,
   the pages a hiring manager is most likely to forward, has zero
   booking links and ends dead. Add `<HireMe location="money_end" />`
   and `simulator_end`.
2. **The home page has one H1 and no H2s.** Section labels ("01 —
   About") are paragraphs. Screen readers and search engines see a page
   with no sections. Promote the section labels to `h2` with the same
   classes; no visual change.

## Plan

**Now (this week, no voice needed):** HireMe on the two Knowledge
pages; H2s on home; GitHub to `sameAs`; repository visibility and
branch protection; a GitHub profile README.

**Next (needs your words):** the thesis line; the capabilities strip;
one decision line per Work entry; the AI paragraph in Resolve; the
"Now" line; the `/privacy` page.

**Later:** a public README for the design-system package; the
simulator model as a standalone library; the breadth phrase.

## Sources

- Search-engine index of prashanthnimmagadda.vercel.app and the
  mirrored GitHub profile README, 2026-10-07.
- github.com/prashanthnimmagadda/prd-genie (repository description
  and README summary as indexed).
- Local production build of this repository at commit 6c978a7.

# ifemora.dev — full-site critique and roadmap (2026-10-01)

Scope: every listed page at phone (390px) and desktop (1440px) widths,
light and dark, keyboard, reduced motion, the printed CV, the share
card, the 404, and the GitHub side (repo, CI, README, history).
Tennis and Maintenance were skipped on purpose; both stay unlisted.

Method: production build run locally, every page screenshotted and
measured with Playwright, source read for each route, lint, typecheck
and contrast audit run, GitHub inspected through the API. Findings
marked **verified** were reproduced; the rest are judgement calls.

The lens is the north star in CLAUDE.md: three recruiter conversations
a day. Every recommendation below is weighed against that first and
against "very high UX standards" second. The two rarely conflict.

---

## 1. Verdict in one paragraph

The site is already in the top few percent of personal sites on craft:
a real design system, a signature mark, typography with intent, motion
that stays out of the way, eight contrast-checked palettes, honest case
studies, and a wall of love nobody else has. What it is not yet is a
conversion machine. A recruiter who lands on the home page learns the
name, "Thinker. Tinkerer.", and that Femi is open to roles. They do not
learn, above the fold, what he does, for whom he has done it, or which
roles he wants. Company names (Marqeta, Paystack/Stripe, FCMB,
Farmcrowdy/Techstars) appear nowhere on the home page. The booking CTA
exists once, in the hero, and nowhere else: not on Work, not on CV, not
at the end of a case study, not under an essay. Several surfaces still
speak in the present tense about Marqeta. And two real bugs ship today:
the About timeline is invisible to anyone with reduced motion on, and
the 404 page is Next.js's unstyled default. Fix the message and the
CTA plumbing first; the design needs polish, not surgery.

---

## 2. What is working (keep, do not touch)

- **The visual identity.** Fraunces display with the WONK axis, the
  spiral as logo, favicon, OG and background, hairlines instead of
  boxes, section numbering, the ghost wordmark in the footer. It reads
  as one hand. Nothing here needs changing.
- **The design system discipline.** Tokens declared once as light/dark
  pairs, palettes that override only pairs, a contrast audit in CI.
  This is rare on a personal site and is itself a Solutions-Architect
  proof point. (Verified: lint, tsc, build and contrast audit all pass.)
- **Motion restraint.** Small travel, one easing, no scroll hijack,
  reduced-motion respected almost everywhere (see the one exception
  in §4). The Reveal/DrawnRule/MaskedLines family is consistent across
  every page.
- **The case studies.** Decisions over screenshots, "what v1 left out",
  honest about what cannot be published. The artifacts (release map,
  banking system map, Nigeria field map, pay-by-reference) are exactly
  the kind of thing a hiring manager forwards to a peer.
- **Follow the Money.** A working, playable model of a card payment is
  a stronger demonstration of payments fluency than any bullet. It is
  the right thing to have under "Knowledge".
- **Wall of Love.** 23 voices, filterable by "for the work", searchable,
  with the voices quoted back on four case studies. Rare and
  persuasive.
- **Studio hub, Writing, Notes, Gallery.** Clear hierarchy, consistent
  index pattern, good empty states. The 99-item gallery with a photos /
  art / books toggle and a sequenced series is a real body of work.
- **Dark mode and palettes.** Both render cleanly on every page checked.
- **Nav.** Sticky glass bar, umbrella dropdowns, keyboard reachable,
  Escape closes, `aria-expanded` and `aria-current` present. The phone
  menu is clean.
- **Publishing pipeline.** MDX from frontmatter, phone-publishing APIs,
  Pages CMS, RSS, sitemap, JSON-LD, canonicals, CI on every push.

---

## 3. What is not working — ranked

### A. Message and conversion (the biggest gap)

1. **The home hero does not say what Femi does or wants.** Above the
   fold: name, "Thinker. Tinkerer.", pill, CTA, photo. The only
   descriptor is the 11px mono caption "Product, payments" tucked under
   the photo. The target roles live only in the meta description and
   on /cv. A recruiter has to scroll to section 01 to read "I build
   products in payments, banking, and agriculture", and even then the
   roles are never named. *Fix: one positioning line between the
   tagline and the pill, in Femi's words. Draft to react to: "Product
   leader, ten years in payments and banking. Open to Solutions
   Architect, Customer Success and Product roles, Vancouver or remote
   across Canada."* (`src/app/page.tsx`)
2. **No company names on the home page.** The three work teasers say
   "Built a corporate banking platform…", "Expanded a payment
   platform…", "Took a cardholder support platform…" with no FCMB, no
   Paystack (a Stripe company), no Marqeta. Recognisable names are the
   fastest credibility a recruiter scans for. *Fix: add the company to
   each teaser's meta slot, and consider a one-line "Marqeta · Paystack
   · FCMB · Farmcrowdy" strip under the bio.* (`src/app/page.tsx`
   `workItems`)
3. **The booking CTA appears once on the whole site.** Hero only.
   Nothing at the bottom of Home, nothing on /work, nothing on /cv,
   nothing at the end of a case study, nothing under an essay. Every
   long page ends with "Say hello →" (a mailto), which is a weaker ask
   than a calendar link. *Fix: a shared `HireMe` block (status line +
   Book an intro + email + CV) rendered at the end of Home, Work, each
   case study and the CV, and as a quiet author card under essays and
   notes. `BookIntroLink` already takes a `location` prop for GA, so
   every placement is measurable.* (`src/components/`, `CaseStudy.tsx`,
   `writing/[slug]/page.tsx`, `cv/page.tsx`, `work/page.tsx`)
4. **The CV contact line is not clickable.** "Vancouver, BC ·
   oluwafemiakinseye@gmail.com · linkedin.com/in/ifemora" is plain
   text. On the single highest-intent page, email and LinkedIn need to
   be links, and "Book an intro" belongs next to "Download as PDF".
   (`src/app/cv/page.tsx` header) **Verified.**
5. **"Download as PDF" is a print dialog, not a file.** On a phone it
   opens the print sheet, which recruiters do not expect. The printed
   output also runs to three Letter pages with the third nearly empty.
   *Fix: ship a real `public/cv/femi-siji-kenneth.pdf`, regenerated by
   a small script (Playwright is already available) and linked with
   `download`; tighten print margins so it fits two pages.* **Verified.**
6. **The share card does not carry the signal.** The OG image says
   "Thinker. Tinkerer. · Vancouver · Product · Payments · Essays". When
   the link is posted on LinkedIn, the card is the first impression and
   it says nothing about availability or roles. *Fix: one extra mono
   line on the home OG image ("Open to Solutions Architect, Customer
   Success and Product roles"), and a title tag with role keywords:
   "Femi Siji-Kenneth — Product leader, payments and banking" (the
   default title is the bare name).* (`src/app/opengraph-image.tsx`,
   `layout.tsx` metadata) **Verified.**
7. **Present tense about Marqeta survives on /work.** Case 03 reads
   "Resolve is one of four areas I carry: … the telephony suite behind
   *our* IVR". The eyebrow says "Marqeta · 2025" while the CV and the
   case study say 2025 – 2026. Follow the Money's outro says "in Lagos
   and Toronto. The two seconds are my day job." All three contradict
   the Owner status rule. (`src/app/work/page.tsx`,
   `src/app/follow-the-money/page.tsx`) **Verified.**
8. **The role framing is split between two words.** The CV headline is
   "Product Leader · Product Teams, Digital Experiences & Regulated
   Markets", the Person JSON-LD says "Product Leader", the hero says
   nothing, the footer says "Building something in ~~payments~~
   genuinely good?". Pick one line and use it in the hero, the CV
   headline, the OG image and the meta title. *Needs Femi's words.*
9. **Essays end in a dead end.** The most shareable pages (essays,
   notes) finish with "← All writing". No author line, no "I'm open to
   roles", no way to book. A two-line author card is the standard
   fix. (`src/app/writing/[slug]/page.tsx`, `field-notes/page.tsx`)
10. **"Twice, that became a company of my own"** is highlighted on the
    home bio but neither company is named anywhere findable (Addict
    Creative is on /studio/reel, Agramondis in the About timeline).
    Either name them in the sentence or link the phrase to the
    timeline beats. Minor, but it is a highlighted claim without proof.

### B. Design and UX

11. **Micro type is too small.** The "How I decide" evidence labels and
    the "From the desk" labels are 9px mono uppercase with wide
    tracking; the desktop nav segments are 10px. 9px is below any
    accessibility or readability guideline for UI text. *Fix: floor at
    11px (`text-[11px]`), 12px where it fits.* (`src/app/page.tsx`
    lines with `text-[9px]`, `Nav.tsx` `segmentClass`)
12. **The phone hero is positioned with hard-coded pixel offsets.** The
    photo sits at `top-[304px]` and the caption at `top-[590px]`; the
    container is `min-h-[644px]`. It renders correctly today, but any
    change to tagline length, a longer IdentityFlip word, a font
    fallback or a user font-size setting will overlap the pill or the
    photo. *Fix: make the phone hero a normal flow column (name →
    tagline → pill/CTA → photo → caption) and keep the absolute layout
    for `sm:` only.* (`src/app/page.tsx` hero)
13. **About's constellation is hard to read as a control.** The spiral
    of years is attractive, but its dots are 7px, its year labels 10px
    mono, and the only instruction is a mono caption "Touch a year to
    preview it, click to jump". Most visitors will not know it is
    interactive, and 7px dots fall well short of the 24px target-size
    guideline (WCAG 2.5.8). *Fix: 24px hit areas around each dot, a
    one-line serif caption ("Twenty beats, 1992 to now. Tap one."),
    and the beat title shown on hover/focus.* (`Constellation.tsx`)
14. **No custom 404.** Visitors hitting a dead link get Next's default
    "404 | This page could not be found." in a system sans, with no
    link home, no spiral, no voice. *Fix: `src/app/not-found.tsx` in
    house style with links to Work, Writing and the booking CTA.*
    **Verified.**
15. **No skip link.** Keyboard users tab through 10 nav stops before
    content on every page. A visually-hidden "Skip to content" link at
    the top of `<body>` targeting `<main>` fixes it in five lines.
    **Verified.**
16. **The footer ask is the same on every page.** "Building something
    genuinely good? Or just want to debate tennis? Say hello →" is
    charming once. It should be a per-page close: Work and CV end with
    the hire-me block; Studio, Notes and Gallery keep the playful line.
17. **The "Updated August 2026" label on From the desk is working
    against you.** It is derived correctly, but today it reads as
    "nothing for two months". Either publish a note (which is the real
    fix) or drop the label until cadence is steadier.
18. **Case-study typography on phone.** The 200px label column
    collapses correctly, but the mono section labels ("01 · Scope") and
    the artifact captions sit at 10–11px with 0.18em tracking; on a
    390px screen they are the hardest text on the site to read.
    Same floor as item 11.
19. **The Work index and the CV disagree on form.** /work says "Index —
    six projects" and "No. 01 / 06" (two counters saying the same
    thing); the sixth "project" is this website, which is a lovely
    story but dilutes a page a recruiter reads for product proof. *Keep
    it, but move it last with a lighter treatment, or move it to the
    colophon teaser and make Work five entries again.*
20. **The essay index shows four pieces, and the oldest is from 2019.**
    Not a design problem, but the index implies a thin writer. The
    Substack archive has more; the review queue already asks about
    Plentywaka. Consider `homepageHidden` for it and importing two or
    three more.

### C. Bugs and accessibility (verified)

21. **About timeline is invisible with reduced motion on.** All 21
    beats keep `opacity:0; transform:translateY(16px)` and never
    reveal, before or after scrolling. Cause: `useReducedMotion()` is
    `null` on the server, so SSR emits `initial={{opacity:0}}`; on the
    client `reduced` is true, `initial` becomes `false`, and Motion
    never animates the inline style away. React does not reconcile the
    mismatched style attribute. Anyone with "Reduce motion" set (a
    common iOS setting) sees an empty page under the intro.
    *Fix: never branch on `reduced` inside `initial`; use
    `initial={{opacity:0,y:16}} whileInView={{opacity:1,y:0}}` and pass
    `transition={{duration: reduced ? 0 : 0.55}}`, or gate with a
    mounted flag. Audit every component that puts `reduced` in
    `initial`: `StoryThread.tsx`, `template.tsx`, `IdentityFlip.tsx`,
    `ProximityType.tsx`, `MaskedLines.tsx`, `Nav.tsx`.*
    (`src/components/about/StoryThread.tsx`)
22. **Intermittent hydration error on Home (React #418, text
    mismatch).** Seen on the first load under reduced motion; same root
    cause as above, most likely `IdentityFlip` rendering a different
    text node when `reduced` flips from `null` to `true`. Harmless to
    the eye today but it is a console error on the landing page and
    will bite on the next React upgrade.
23. **About timeline photos use raw `<img>`** (eslint rule disabled)
    instead of `next/image`, so they ship unoptimised. (`StoryThread.tsx`)
24. **Sitemap advertises /tennis** while the page is deliberately
    unlisted. Either it is live and findable or it is not; search
    engines will index a one-entry log. Remove it from `sitemap.ts`
    until it has content. (`src/app/sitemap.ts`)
25. **Gallery source images are 0.8–1.2 MB each** (34 MB folder).
    `next/image` resizes on delivery so visitors are fine, but the
    repo and the Pages CMS media browser carry the weight, and any raw
    `<img>` path (see 23) would serve them whole. The CLAUDE.md rule
    is 2000px/q80; a one-off resize pass would bring most under 400 KB.

### D. GitHub and engineering

26. **README is stale and wrong in four places**: tokens "live in
    `src/app/globals.css`" (they live in `packages/femora-ds`), body
    font "Inter" (it is Newsreader), essays registered in
    `src/lib/writing.ts` `internalPosts` (frontmatter is read from
    disk), and an "Add a Medium piece" section (Medium was removed on
    purpose). Anyone who opens the repo, including a hiring manager
    for a Solutions Architect role, reads this first. **Verified.**
27. **Repo homepage points at `personal-site-six-khaki.vercel.app`**,
    not ifemora.dev. Description is fine. Fix in repo settings.
28. **The repo is private, but the site advertises it.** Work entry 06
    and the colophon describe "designed and built end to end in Claude
    Code" and the design-system package, yet nobody can see it. For
    the target roles the code is a portfolio piece. Secrets already
    live in Vercel env, and the two content APIs are bearer-guarded.
    *Recommendation: make it public once the README is fixed and the
    personal photos in `public/` are something Femi is happy to have
    cloneable; otherwise keep private and drop the "see the code"
    implication.* Femi's call.
29. **No branch protection on main.** CI runs on push to main but
    cannot block a red push; a failing commit still deploys because
    Vercel builds independently. *Fix: require the CI check on main
    (branch protection or a ruleset). Pages CMS commits still land
    because the check runs after the commit; it only stops merges of
    PRs, which is the right amount of friction for a one-person repo.*
30. **The roadmap lives in ~/Downloads.** The review queue says so. A
    `docs/` file (this one) plus GitHub Issues for the items below
    gives a trail the next session can read. Issues are empty today.
31. **Hidden-page mechanics are inconsistent.** Tennis is "unlisted"
    but in the sitemap and CLAUDE.md; Maintenance is a preview route;
    the Knowledge umbrella has a "More soon" row. A single
    `hidden: true` convention in nav + sitemap would make "unlisted"
    mean one thing.

---

## 4. What could change later (good, not urgent)

- **A "What I'm looking for" section on Home** (three short lines:
  the roles, the markets, the kind of team), placed between "How I
  decide" and "From the desk". It is the question every recruiter has
  and the site never answers in prose. Needs Femi's words.
- **Logos or wordmarks for the four employers** on Home and Work.
  Hairline-style, monochrome, in the mono eyebrow colour, so they stay
  inside the design language.
- **An "In 60 seconds" strip on /cv**: four numbers (₦70B monthly
  volume, 200,000+ clients, 5 PMs grown, 29 states) above the
  Summary, for the recruiter who gives the page ten seconds.
- **Open Graph images per case study** (the essay route has them; the
  case studies fall back to the home card).
- **Follow the Money's own accent and Act IV**, as already logged in
  the playbook.
- **A Marqeta voice on the Resolve case study**, as already logged.
- **Analytics review**: `book_intro_click` by `link_location` will
  show which placement converts once items 3 and 9 ship. Check it in
  two weeks and cut placements that do nothing.
- **Testing**: one Playwright smoke test in CI (every listed route
  returns 200, no console errors, About beats visible under reduced
  motion) would have caught items 21 and 22. Keep it under a minute.

## 5. What not to change

- Design tokens, type, the spiral, the hairline layout, the palette
  system: locked and right.
- The motion vocabulary: fix the reduced-motion bug, do not add more.
- The Studio / Knowledge umbrella structure: it is working.
- The write APIs: the simplicity is the feature (CLAUDE.md).
- Tennis stays hidden until there is a log worth reading.

---

## 6. Roadmap

Effort: S = under an hour, M = half a day, L = a day or more.
"Words" means the copy needs Femi's own sentence before it ships; a
draft can be prepared and queued in `docs/review-queue.md`.

### Now (this week) — conversion and correctness

**Status: shipped 2026-10-01** (all ten, on branch
`claude/relaxed-dijkstra-8zs04p`). The repo homepage setting in item
10 is a GitHub UI change and is in the review queue.

| # | Item | Type | Where | Effort | Words |
|---|------|------|-------|--------|-------|
| 1 | Fix the About timeline reduced-motion bug and the same `initial` pattern in the other motion components (§3.21–22) | code | `StoryThread.tsx`, `template.tsx`, `IdentityFlip.tsx`, `ProximityType.tsx`, `MaskedLines.tsx` | M | no |
| 2 | Past tense and dates on /work case 03 and the Follow the Money outro (§3.7) | copy | `work/page.tsx`, `follow-the-money/page.tsx` | S | light |
| 3 | Hero positioning line under the tagline (§3.1) | copy + design | `page.tsx` hero | S | yes |
| 4 | Company names on the three home work teasers (§3.2) | copy | `page.tsx` `workItems` | S | no |
| 5 | Shared hire-me block at the end of Home, Work, CV and every case study; author card under essays and notes (§3.3, 3.9) | design + code | new `HireMe.tsx`, `CaseStudy.tsx`, `writing/[slug]`, `field-notes`, `cv`, `work` | M | light |
| 6 | Clickable email and LinkedIn in the CV header, "Book an intro" beside the PDF link (§3.4) | code | `cv/page.tsx` | S | no |
| 7 | Custom 404 in house style (§3.14) | design + code | `src/app/not-found.tsx` | S | light |
| 8 | OG image line and role-bearing title tag (§3.6) | copy + code | `opengraph-image.tsx`, `layout.tsx` | S | yes |
| 9 | Remove /tennis from the sitemap (§3.24) | code | `sitemap.ts` | S | no |
| 10 | README rewrite to match reality; repo homepage to ifemora.dev (§3.26–27) | docs | `README.md`, GitHub settings | S | no |

### Next (two to three weeks) — UX polish

**Status: shipped 2026-10-01**, items 11–19 (12 had shipped with the
Now batch). Item 20 is a GitHub ruleset; the exact clicks are in the
review queue.

| # | Item | Type | Where | Effort | Words |
|---|------|------|-------|--------|-------|
| 11 | Type floor: no UI text under 11px (§3.11, 3.18) | design | `page.tsx`, `Nav.tsx`, `CaseStudy.tsx`, artifacts | S | no |
| 12 | Phone hero as a flow column, no pixel offsets (§3.12) | design + code | `page.tsx` hero | M | no |
| 13 | Real PDF file for the CV, two pages, linked with `download` (§3.5) | code | `scripts/`, `public/cv/`, `PrintButton.tsx` | M | no |
| 14 | Skip link (§3.15) | code | `layout.tsx` | S | no |
| 15 | About constellation: bigger targets, caption, hover titles (§3.13) | design | `Constellation.tsx` | M | light |
| 16 | Per-page footer close: hire-me on professional pages, the tennis line on personality pages (§3.16) | design + copy | `layout.tsx` footer → per-route | S | light |
| 17 | `next/image` for About timeline photos; gallery resize pass (§3.23, 3.25) | code | `StoryThread.tsx`, `public/gallery` | M | no |
| 18 | "What I'm looking for" section on Home (§4) | copy + design | `page.tsx` | M | yes |
| 19 | One Playwright smoke test in CI (§4) | code | `.github/workflows/ci.yml`, `scripts/` | M | no |
| 20 | Branch protection requiring CI on main (§3.29) | settings | GitHub | S | no |

### Later — depth

| # | Item | Type | Where | Effort | Words |
|---|------|------|-------|--------|-------|
| 21 | Employer wordmark strip on Home and Work (§4) | design | `page.tsx`, `work/page.tsx` | M | no |
| 22 | "In 60 seconds" numbers strip on /cv (§4) | design + copy | `cv/page.tsx` | S | light |
| 23 | Case-study OG images (§4) | code | `work/*/opengraph-image.tsx` | M | no |
| 24 | Decide on repo visibility and act on it (§3.28) | decision | GitHub | S | Femi |
| 25 | Import two or three more Substack essays; hide Plentywaka from the home teasers (§3.20) | content | `content/writing/` | M | Femi |
| 26 | Work entry 06 (this site): move last with lighter weight, or to the colophon teaser (§3.19) | design | `work/page.tsx` | S | no |
| 27 | Follow the Money accent and Act IV; Marqeta voice on Resolve (already logged) | design + content | playbook | L | Femi |
| 28 | Review `book_intro_click` by placement after two weeks; prune (§4) | analytics | GA4 | S | no |

### Sequencing note

Items 1–10 are independent and can ship as one batch in a day. Items
3, 8 and 18 need Femi's sentence; a draft for each is in §3 and should
be queued in `docs/review-queue.md` rather than guessed at. Nothing in
this roadmap touches locked tokens, fonts or layout width.

@AGENTS.md

# Project context

This is the source of **[ifemora.dev](https://ifemora.dev)** — Femi Siji-Kenneth's
personal website. Femi is a Lead Product Manager at Marqeta (payments / fintech),
based in Vancouver (moved from Toronto in 2026). He writes essays on Substack (`ifemora.substack.com`), plays tennis,
and signs the site "Thinker. Tinkerer."

When Femi opens this repo in Claude Code, his typical request is one of:

- "Publish this essay" (he pastes content)
- "Add this Substack link" (URL of a new post)
- "Change X on the site" (copy tweak, layout fix, new section)
- "Why is Y broken" (debugging the deployed site)

**Treat each request as a real task to ship.** Edit, commit, push. Don't ask for
permission for ordinary code changes — push them. Only confirm on destructive
operations (deleting files, rewriting history, changing DNS).

---

# Stack

- **Next.js 16.2 (App Router, Turbopack)** — see `AGENTS.md` warning above
- **React 19**
- **Tailwind v4** with CSS-first `@theme` config (no `tailwind.config.ts`) — tokens live in `packages/femora-ds/tokens.css`; `src/app/globals.css` just imports them
- **`@femora/design-system`** (`packages/femora-ds/`) — local package holding the motion primitives, spiral mark, and styling tokens; resolved via `tsconfig.json` paths, built output (`dist/`) is gitignored
- **MDX** for on-site essays via `@next/mdx` + a dynamic `[slug]` route
- **TypeScript**, **ESLint**
- Deployed on **Vercel** with auto-deploy on push to `main`
- Repo: **`iFemora/personal-site`** (SSH remote, pushes go to GitHub directly)
- **Pages CMS** (`.pages.yml`) lets Femi edit the JSON content files + media
  from pagescms.org without code; every CMS save is a git commit to `main`.
  Keep `.pages.yml` in sync when content schemas change.
- The repo must live OUTSIDE iCloud-synced folders (`~/Documents`, `~/Desktop`)
  — iCloud resurrects deleted files inside git repos. Home is `~/Code/personal-site`.

---

# Site map

```
/                       Home — hero, bio, 3 work teasers, 3 writing teasers, footer
/about                  Life timeline — "how I got here", dated beats, duotone-ready photos
/work                   5 artifact-first case cards
/cv                     Long-form designed résumé with print-to-PDF button
/studio                 Umbrella hub for "the other kind of work" (nav: STUDIO, a
                        dropdown sub-nav like Pick Your Palette). Three rooms:
                        Reel (/studio/reel), Writing (/writing), Gallery (/gallery).
                        The hub teases each. Accent: indigo.
/studio/reel            Film + creative direction. Content in content/studio.json;
                        click-to-play YouTube/Vimeo embeds (VideoEmbed) behind
                        duotone posters, Behance case-study links, Nasir Kareem
                        credited on the Addict Creative pieces.
/writing                Unified index of Substack pieces + on-site MDX posts
/writing/[slug]         Individual MDX post
/field-notes            Short observations + voice memos
/follow-the-money       Interactive payments explainer (nav: MONEY) — Femi's
                        product proof. BEFORE touching it, read
                        docs/follow-the-money-playbook.md (pattern + status)
                        and docs/anatomy-log.md (dated decision log).
                        /anatomy 308-redirects here.
/tennis                 Tennis log — match notes, photos, video clips
/gallery                Contact-sheet photo gallery (duotone → color hover, lightbox)
/gallery/[series]       Sequenced photo series (e.g. /gallery/looking-closer) — chapters,
                        pairs/triptychs, authored order; listed as a strip above the sheet
/colophon               How the site is made — mark, type, colour, motion, build
/api/field-notes        POST endpoint hit by the iOS Shortcut for phone publishing
/api/gallery            POST endpoint hit by the "Publish Photo" iOS Shortcut
/maintenance            Preview of the "out, briefly" page (to take the site dark,
                        restore src/middleware.ts from git history and set MAINTENANCE = true)
```

**Per-page accents** (html[data-accent], set by `AccentController`):
home rust · work/cv slate-teal · writing moss · notes ochre · tennis muted
chartreuse · gallery umber · love madder rose · studio indigo ·
follow-the-money borrows slate-teal for now. Every accent has a pair in
each of the 7 guest palettes too (`src/app/palettes.css`), so a new one
means 8 pairs plus the audit list.
New sections claim the next sibling from the earthy family in
`packages/femora-ds/tokens.css`.

**Nav order:** About · Work · Studio ▾ (Reel, Writing, Gallery) · Money ·
Notes · Love. Writing and Gallery keep their URLs and accents; they only
moved under the Studio dropdown to keep the pill to six words. Don't
re-add them as top-level items.

**The nav is sticky sitewide** (`layout.tsx` header: a full-bleed
"liquid glass" bar — full viewport width at every size, translucent
`bg-background/70` + heavy blur + saturate, bottom hairline, z-40; the
1100px constraint lives on the inner wrapper). Anything else that
sticks must sit below it (the dispute ledger uses
`top-[72px] sm:top-[76px]`).

**Tennis log publishing:** prepend to `content/tennis.json` —
`{ id, date, title?, body?, image?: {src, alt, caption?, width, height}, video?: {src, poster?, caption?} }`.
Media files go in `public/tennis/`.

**About timeline publishing:** edit `content/about-timeline.json` —
`{ id, year, title, caption?, image?: {src, alt} }`. Sorted ascending by
year ("Now" / non-numeric sort last). Photos (in `public/about/`) render
duotone and flood to color on hover, matching the gallery treatment.

**Gallery publishing (phone):** `POST /api/gallery` (same shared secret /
GITHUB_PAT as field notes) uploads a JPEG to `public/gallery/` and prepends
to `content/gallery.json`. Payload: `{ imageBase64, caption?, location?,
date?, width, height }`. The "Publish Photo" iOS Shortcut resizes → converts
to JPEG → reads dimensions → POSTs. Gallery shows a "still in the darkroom"
empty state until the first photo lands.

**Gallery publishing (manual):** add to `content/gallery.json` —
`{ id, src, alt, caption?, location?, date?, width, height, kind? }`. Image
files go in `public/gallery/` (book covers in `public/gallery/books/`).
`kind` is `"photo"` (default), `"art"`, or `"book"` — the gallery is a
single toggled view (photos / art / books, the sliding pill); every kind
renders duotone until hover. For books: caption = title, note = author,
plus optional `status` ("reading" | "queued" | "finished"), `category`
("faith" | "product" | "others" — powers the shelf sub-toggle) and
`verdict` (a one-line marginalia quote in Femi's words — never invent
these). No serial labels anywhere (FR-001 etc.) — Femi removed them
deliberately; don't reintroduce.

**Photo series (sequenced bodies of work, e.g. a trip):** these stay OUT
of the shuffled contact sheet so they don't dilute it. Add an entry to
`content/gallery-series.json` — `{ slug, title, tagline, intro, location,
date, cover: [frame ids], hero: frame, chapters: [{ title, note?, frames }] }`
where a frame is `{ id, src, alt, width, height, caption?, location?,
date?, group? }`. Consecutive frames sharing a `group` letter render on
one row (2 = pair, 3 = triptych); ungrouped frames stand alone (portrait
ones capped at 640px). Images go in `public/gallery/<slug>/`, resized to
2000px long edge, JPEG q80 (sharp is already in node_modules). Chapter
titles and notes are Femi's words (the first series reuses his VFS deck);
alt text is descriptive, not voice. The route is
`src/app/gallery/[series]/page.tsx`; the strip on `/gallery` and the
sitemap pick new series up automatically.

---

# Design system

Locked. Don't change tokens without confirming first.

**Colors** (in `packages/femora-ds/tokens.css`, as `--l-*` / `--d-*` pairs — see Theme below):
- Light: bg `#faf7f0`, text `#1f1b16`, muted `#6f675c`, accent `#9a3b1e` (rust, home), rule `#e2dccf`
- Dark: bg `#16120e`, text `#ece6da`, muted `#9a9183`, accent `#e8997b`, rule `#2e2920`
- Each section has its own accent pair (see per-page accents above); `--accent` swaps via `html[data-accent]`
- `packages/femora-ds/styles.css` is a flattened self-contained mirror (fonts + tokens + utilities) for external consumers — keep it in sync when tokens change

**Fonts** (loaded via `next/font/google` in `src/app/layout.tsx`):
- Display / headings: **Fraunces** (variable serif, SOFT/WONK/opsz axes) → class `font-serif`
- Body / UI: **Newsreader** (serif) → default body font, mapped to `font-sans`
- Date metadata / eyebrows: **IBM Plex Mono** → class `font-mono`

**Layout:**
- Page shell `max-w-[1100px]`; reading columns (essays, cv) `max-w-[680px]`, left-aligned, mx-auto
- Hairline rules between sections (`border-t border-rule`)
- Generous vertical rhythm
- No cards / no boxes — just text and hairlines
- Mobile and desktop both use the same single column

**Interaction:**
- Links always underlined (`underline underline-offset-4`)
- Hover: color shifts to `text-accent` and underline often removed
- External links get a small `↗` glyph

**Theme (light/dark):**
- Defaults to the system (`prefers-color-scheme`); a nav ThemeToggle
  (sun ↔ moon morph, `src/components/ThemeToggle.tsx`) forces
  `html[data-theme="light"|"dark"]`, persisted in `localStorage.theme`,
  applied pre-paint by an inline script in `layout.tsx` (html has
  `suppressHydrationWarning` for that attribute).
- **Every scheme-dependent value is declared ONCE as a light/dark pair**
  (`--l-background` / `--d-background`) in `tokens.css`. Two "resolve"
  blocks there — one per media query, one per `[data-theme="dark"]` —
  point the real tokens at the right half. Those blocks hold only
  `var()` references, never values, so the copies can't disagree.
  - To change a colour: edit the pair.
  - To add a scheme-dependent token: add the pair, then add one line to
    all three resolve lists (light default, media dark, forced dark).
  - Non-colours use this too (`--wash`, `--grain-blend`,
    `--grain-opacity`), which is why `utilities.css` has no dark
    selectors at all.
  - NEVER reintroduce a `prefers-color-scheme` block outside those
    resolve blocks; it defeats the whole arrangement.

**Palettes** (Pick Your Palette, `src/app/palettes.css` + `src/lib/palettes.ts`):
- Eight palettes: house (default, in `tokens.css`) plus ink, ember,
  riso, chalk, tide, grove, cobalt as `html[data-palette="…"]`.
- A palette overrides **only pairs**, never resolve logic, so light and
  dark both follow for free. Values come from Radix Colors v3 at fixed
  steps: 2 background, 6 rule, 11 muted + accents, 12 foreground. Step
  11 is the contrast-guaranteed text step — **swap hues, never steps.**
- A palette can set `--l-wash`/`--d-wash` to `0%` for clean paper (ink
  does, because a wash of near-black is a grey smudge; it also hides
  `.accent-wash` so the empty layer stops compositing).
- Adding one means: pairs in `palettes.css`, an entry with swatch dots
  in `palettes.ts`, and the id in the pre-paint allowlist in
  `layout.tsx`. Choice persists in `localStorage.palette`.

**Motion system** (built on `motion/react`; primitives live in
`packages/femora-ds/src/components/`, exported from `@femora/design-system`;
site-specific pieces — `BackgroundSpiral`, `CursorDot`, `CursorField` — stay in
`src/components/motion/`):
- Philosophy: "quietly alive" — small travel (8–14px), house easing `[0.16, 1, 0.3, 1]` (exported as `EASE` from `@femora/design-system/ease`), nothing performs
- `Reveal` — scroll-triggered fade-rise (or `immediate` for above-the-fold)
- `DrawnRule` — hairline rules draw themselves left-to-right; use instead of raw `<hr>`
- `MaskedLines` — type-being-set line reveal for page titles/taglines
- `Spiral` — the signature mark; draws beside the home tagline ("thinks in spirals")
- `BackgroundSpiral` — huge ghost spiral behind the page; rotates with scroll, drifts toward cursor
- `ProximityType` — hero type that breathes under the cursor (per-letter Fraunces variable axes)
- `IdentityFlip` — tagline words roll through Femi's identities on hover/tap
- `Highlight` — marker-swipe over key phrases, draws on scroll into view
- `CursorDot` + `Magnetic` — accent dot trails pointer, nav leans toward it (desktop only)
- `CursorField` — context provider in `src/app/layout.tsx` sharing cursor position with `BackgroundSpiral`/`CursorDot`
- `src/app/template.tsx` — soft page-entrance transition on route change
- NO scroll-hijacking: Lenis was added and removed (Femi found it laggy). Never re-add smooth-scroll libraries.
- The spiral (`@femora/design-system/spiral-path`) IS the logo — favicon, apple-icon, OG image, nav mark all use it. No F-in-a-box.
- ALL motion respects `prefers-reduced-motion` (collapses to instant/static)
- New sections must use these primitives, not ad-hoc animations
- `/cv` is intentionally static (print-to-PDF page)

---

# Accessibility

Target: **WCAG 2.2 AA, pragmatic** — full rationale, rules, and scope in
`docs/accessibility.md`. The parts that bite during everyday changes:

- **Any color-pair or palette change must pass `npm run audit:contrast`**
  (checks all 8 palettes x 2 schemes; conformance applies to every theme,
  not just the house palette). FAILs block; WARNs are the accent wash,
  accepted by policy.
- Keyboard focus has one house style (`:focus-visible` in
  `packages/femora-ds/utilities.css`). Never `outline-none` without an
  equal replacement.
- Interactive elements are native (`button`/`a`/`input`), icon buttons
  get `aria-label`, motion respects `prefers-reduced-motion`.

---

# How to publish — three paths

## 1. New on-site essay (preferred for new writing)

User pastes the essay content. You:

1. Pick a slug like `2026-07-12-essay-title`.
2. Create `content/writing/<slug>.mdx` with YAML frontmatter:
   ```mdx
   ---
   title: The essay title
   date: "2026-07-12"
   description: One-sentence description.
   ---

   # The essay title

   …body in Markdown…
   ```
3. Commit (`new post: <title>`) and push.

There is no index to update: `src/lib/writing.ts` builds the writing index by
reading frontmatter from every `.mdx` in `content/writing/` (files starting
with `_` are skipped). Optional frontmatter: `homepageHidden: true`, `image:
{src, alt}`. Essays are also editable in Pages CMS ("Essays" collection).

**Note:** `content/writing/_template.mdx` is a build-only file. Do not delete it.
Turbopack's dynamic-import glob needs at least one `.mdx` in the folder to resolve.

## 2. New Substack / external piece

Prepend to the array in `content/writing/external.json` (no `type` field —
the loader adds it):

```json
{
  "href": "https://ifemora.substack.com/p/...",
  "source": "Substack",
  "title": "Post title",
  "date": "YYYY-MM-DD",
  "description": "One-sentence description.",
  "image": {
    "src": "https://substackcdn.com/image/fetch/...",
    "alt": "Hero image for <title>"
  }
}
```

To get the image URL and date, fetch the post page and read `og:image` and
the JSON-LD `datePublished`. Substack blocks default curl — send a browser
User-Agent (`curl -A "Mozilla/5.0 ..."`).

NOTE (2026-08): Medium links were deliberately removed sitewide — Femi keeps
Medium separate from this site. Religion content is also scrubbed from this
site on purpose; it lives on his separate religion project. Don't reintroduce
either.

Commit (`new post: <title>`) and push.

## 3. New field note (text or audio)

Prepend to the array in `content/field-notes.json`:

```json
{
  "id": "YYYY-MM-DD-HHMM-some-slug",
  "date": "YYYY-MM-DD",
  "body": "Optional plain text. Double newlines\n\nbreak into paragraphs.",
  "audio": {
    "src": "/field-notes/audio/<id>.m4a",
    "title": "Optional title"
  }
}
```

Commit (`field note: <title>`) and push. For audio notes, the file must
already be in `public/field-notes/audio/`.

The iOS Shortcut "Publish Field Note" handles this automatically via
`POST /api/field-notes`, so most audio notes won't go through Claude Code.

---

# Conventions

- **Always run `git add` + `git commit` + `git push` together** after a change. Single commit per logical change.
- Commit messages: imperative, lowercase first word, ~50 chars first line, optional body. No "claude" / "AI" mentions in commit messages.
- **Don't add comments** unless the why is non-obvious.
- **Don't add features the user didn't ask for** (e.g., don't sneak in a "Newsletter" component while fixing the home page).
- **Always use the Femora design system.** New components use existing tokens (`text-accent`, `border-rule`, `font-serif`, etc.), not new colors.
- **Mobile-first responsive.** Use `sm:` (640px+) for desktop adjustments.

---

# Voice

Femi's writing voice — useful when drafting copy on his behalf:

- Editorial, slightly literary
- Comfortable with subordinate clauses; not breezy
- Subtle neurodivergence ("think in spirals") — never clinical
- Self-aware but not self-deprecating
- Concrete details over abstractions ("$30M annualized volume" not "significant revenue impact")
- Reads his own essays for cues — his essay titles ("The Wrong Scoreboard", "Making Sense at the Edges") are the closest reference

Don't generate content in his voice without confirming first. Drafts are fine
to offer; never assume a tagline or paragraph is what he'd actually write.

---

# Don'ts

- Don't restore deleted welcome posts.
- Don't change design tokens (colors, fonts, layout width) without confirming.
- Don't push secrets to the repo. `GITHUB_PAT` and `FIELD_NOTES_SECRET` live in Vercel env vars only.
- Don't bypass git hooks. If a hook fails, fix the underlying issue.
- Don't run `npm install` of new packages without confirming. New deps = audit risk.

---

# Common gotchas

- **Linting and Claude worktrees:** `npm run lint` must lint authored project
  files only. Claude Code may create nested worktrees under
  `.claude/worktrees/`; their `.next` output is generated code and is
  intentionally ignored in `eslint.config.mjs`. Do not remove that ignore or
  treat errors from generated worktree files as site-code failures.
- **Tailwind v4** uses `@theme inline` in CSS, not `tailwind.config.ts`. Adding a new color token means editing `packages/femora-ds/tokens.css` (and mirroring it in the flattened `packages/femora-ds/styles.css`).
- **Dynamic MDX import** (`src/app/writing/[slug]/page.tsx`) requires at least one `.mdx` file in `content/writing/`. `_template.mdx` exists for this reason.
- **`next/image` remote patterns** in `next.config.ts` must list any new image host. Currently allows `substackcdn.com`.
- **`metadataBase`** in `src/app/layout.tsx` reads `NEXT_PUBLIC_SITE_URL` env var. Production value is `https://ifemora.dev`.
